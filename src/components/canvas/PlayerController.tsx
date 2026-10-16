import React, { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { gameStore } from '../../state/gameStore';
import { inputStore } from '../../state/inputStore';
import { interactiveRegistry, type InteractiveItem } from '../../state/interactiveRegistry';
import { resolveCollision, detectCurrentRoom } from '../../utils/collision';
import { soundEngine } from '../../audio/soundEngine';

interface PlayerControllerProps {
  initialPosition?: [number, number, number];
}

export const PlayerController: React.FC<PlayerControllerProps> = ({
  initialPosition = [0, 1.65, 2.2]
}) => {
  const { camera, gl } = useThree();

  // Position and velocity
  const positionRef = useRef<[number, number, number]>([...initialPosition]);
  const velocityRef = useRef<[number, number]>([0, 0]); // vx, vz in camera space
  const eulerRef = useRef<THREE.Euler>(new THREE.Euler(0, Math.PI, 0, 'YXZ')); // face north (-Z)

  // Footstep accumulator
  const stepDistRef = useRef(0);

  // Keyboard state
  const keysRef = useRef<{ [k: string]: boolean }>({});
  const isLockedRef = useRef(false);

  // Active target cache
  const activeTargetRef = useRef<InteractiveItem | null>(null);

  // Set initial camera
  useEffect(() => {
    camera.position.set(...positionRef.current);
    camera.rotation.copy(eulerRef.current);
  }, [camera]);

  // Pointer lock & keyboard listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const state = gameStore.getState();
      const code = e.code;

      if (code === 'Escape') {
        if (state.activeModal !== null) {
          gameStore.closeModal();
          return;
        }
        if (state.phase === 'PLAYING') {
          gameStore.setPhase('PAUSED');
          return;
        }
        if (state.phase === 'PAUSED') {
          gameStore.setPhase('PLAYING');
          return;
        }
      }

      if (state.phase !== 'PLAYING' || state.activeModal !== null) return;

      keysRef.current[code] = true;

      if (code === 'KeyE') {
        if (activeTargetRef.current) {
          activeTargetRef.current.onInteract();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.code] = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const state = gameStore.getState();
      if (state.phase !== 'PLAYING' || state.activeModal !== null) return;
      if (!isLockedRef.current) return;

      const sensitivity = 0.0022 * state.settings.mouseSensitivity;
      const movementX = e.movementX || 0;
      const movementY = e.movementY || 0;

      eulerRef.current.y -= movementX * sensitivity;
      eulerRef.current.x -= movementY * sensitivity;

      // Clamp pitch to ~[-85, 85] deg
      const maxPitch = Math.PI / 2.05;
      eulerRef.current.x = Math.max(-maxPitch, Math.min(maxPitch, eulerRef.current.x));

      camera.rotation.copy(eulerRef.current);
    };

    const handlePointerLockChange = () => {
      isLockedRef.current = document.pointerLockElement === gl.domElement;
    };

    const handleClickCanvas = () => {
      const state = gameStore.getState();
      if (state.phase === 'PLAYING' && state.activeModal === null && !state.settings.touchControls) {
        if (document.pointerLockElement !== gl.domElement) {
          gl.domElement.requestPointerLock?.();
        }
      }
    };

    const unsubscribe = gameStore.subscribe((s) => {
      if (s.activeModal !== null || s.phase !== 'PLAYING') {
        if (document.pointerLockElement) {
          document.exitPointerLock?.();
        }
      }
    });

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('pointerlockchange', handlePointerLockChange);
    gl.domElement.addEventListener('click', handleClickCanvas);

    return () => {
      unsubscribe();
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      gl.domElement.removeEventListener('click', handleClickCanvas);
    };
  }, [gl, camera]);

  useFrame((_, delta) => {
    const state = gameStore.getState();
    if (state.phase !== 'PLAYING' || state.activeModal !== null) {
      gameStore.setPrompt(null);
      activeTargetRef.current = null;
      return;
    }

    // Touch look input
    const { dx: touchDx, dy: touchDy } = inputStore.consumeLookDelta();
    if (touchDx !== 0 || touchDy !== 0) {
      const sensitivity = 0.0035 * state.settings.mouseSensitivity;
      eulerRef.current.y -= touchDx * sensitivity;
      eulerRef.current.x -= touchDy * sensitivity;
      const maxPitch = Math.PI / 2.05;
      eulerRef.current.x = Math.max(-maxPitch, Math.min(maxPitch, eulerRef.current.x));
      camera.rotation.copy(eulerRef.current);
    }

    // Touch interact trigger
    if (inputStore.consumeInteract()) {
      if (activeTargetRef.current) {
        activeTargetRef.current.onInteract();
      }
    }

    // Combine keyboard + virtual joystick input
    const keys = keysRef.current;
    let inputForward = 0;
    let inputRight = 0;

    if (keys['KeyW'] || keys['ArrowUp']) inputForward += 1;
    if (keys['KeyS'] || keys['ArrowDown']) inputForward -= 1;
    if (keys['KeyA'] || keys['ArrowLeft']) inputRight -= 1;
    if (keys['KeyD'] || keys['ArrowRight']) inputRight += 1;

    // Mobile virtual joystick input
    const touchInput = inputStore.getState();
    inputForward += touchInput.moveForward;
    inputRight += touchInput.moveRight;

    // Normalize input
    const inputLen = Math.hypot(inputForward, inputRight);
    if (inputLen > 1) {
      inputForward /= inputLen;
      inputRight /= inputLen;
    }

    const isSprinting = (keys['ShiftLeft'] || keys['ShiftRight'] || touchInput.isSprinting);
    const speed = isSprinting ? 4.2 : 2.6;

    // Target velocity in camera horizontal space
    const targetVx = inputRight * speed;
    const targetVz = -inputForward * speed;

    // Smooth damping
    const smoothFactor = 1 - Math.exp(-12 * delta);
    velocityRef.current[0] += (targetVx - velocityRef.current[0]) * smoothFactor;
    velocityRef.current[1] += (targetVz - velocityRef.current[1]) * smoothFactor;

    // Convert velocity from camera yaw space to world space
    const yaw = eulerRef.current.y;
    const worldVx = velocityRef.current[0] * Math.cos(yaw) + velocityRef.current[1] * Math.sin(yaw);
    const worldVz = -velocityRef.current[0] * Math.sin(yaw) + velocityRef.current[1] * Math.cos(yaw);

    const currentPos = positionRef.current;
    const nextPos: [number, number, number] = [
      currentPos[0] + worldVx * delta,
      1.65, // Eye height
      currentPos[2] + worldVz * delta
    ];

    // Resolve collision against walls and closed doors
    const doorStates = {
      door1Open: state.flags.door1Open,
      door2Open: state.flags.door2Open,
      door3Open: state.flags.door3Open,
      door4Open: state.flags.door4Open
    };

    const resolvedPos = resolveCollision(currentPos, nextPos, doorStates, 0.35);
    positionRef.current = resolvedPos;
    camera.position.set(resolvedPos[0], resolvedPos[1], resolvedPos[2]);

    // Footstep audio calculation
    const moveDist = Math.hypot(resolvedPos[0] - currentPos[0], resolvedPos[2] - currentPos[2]);
    if (moveDist > 0.001) {
      stepDistRef.current += moveDist;
      if (stepDistRef.current > (isSprinting ? 1.6 : 1.35)) {
        stepDistRef.current = 0;
        soundEngine.playFootstep();
      }
    }

    // Room detection
    const currentRoom = detectCurrentRoom(resolvedPos[0], resolvedPos[2]);
    gameStore.setCurrentRoom(currentRoom);

    // Camera forward vector
    const camDir = new THREE.Vector3();
    camera.getWorldDirection(camDir);
    const camForward: [number, number, number] = [camDir.x, camDir.y, camDir.z];

    // Interactive target detection
    const closest = interactiveRegistry.findClosestInView(resolvedPos, camForward);
    activeTargetRef.current = closest;

    if (closest) {
      gameStore.setPrompt({
        id: closest.id,
        label: closest.label,
        subLabel: closest.subLabel,
        type: closest.type,
        position: closest.position
      });
    } else {
      gameStore.setPrompt(null);
    }
  });

  return null;
};
