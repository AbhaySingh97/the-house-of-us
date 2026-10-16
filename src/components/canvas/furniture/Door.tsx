import React, { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { interactiveRegistry } from '../../../state/interactiveRegistry';
import { gameStore, useGameStore } from '../../../state/gameStore';

interface DoorProps {
  id: 1 | 2 | 3 | 4;
  position: [number, number, number];
  rotationY?: number; // Base angle in radians (e.g. 0, Math.PI/2, etc.)
  width?: number;
  height?: number;
  label?: string;
  isDouble?: boolean; // For Conservatory grand double door
}

export const Door: React.FC<DoorProps> = ({
  id,
  position,
  rotationY = 0,
  width = 1.6,
  height = 2.6,
  label = 'Door',
  isDouble = false
}) => {
  const hingeRef1 = useRef<THREE.Group>(null);
  const hingeRef2 = useRef<THREE.Group>(null);

  const { flags } = useGameStore();
  const isOpen = (
    id === 1 ? flags.door1Open :
    id === 2 ? flags.door2Open :
    id === 3 ? flags.door3Open :
    flags.door4Open
  );
  const isLocked = (
    id === 1 ? !flags.door1Unlocked :
    id === 2 ? !flags.door2Unlocked :
    id === 3 ? !flags.door3Unlocked :
    !flags.door4Unlocked
  );

  // Register interactive target
  useEffect(() => {
    const promptLabel = isOpen 
      ? `Close ${label}` 
      : isLocked 
        ? `Unlock ${label}` 
        : `Open ${label}`;

    interactiveRegistry.register({
      id: `door_${id}`,
      label: promptLabel,
      subLabel: isLocked ? 'Requires Key' : undefined,
      type: 'door',
      position: [position[0], position[1] + height * 0.5, position[2]],
      radius: 3.0,
      onInteract: () => {
        gameStore.toggleDoor(id);
      }
    });

    return () => {
      interactiveRegistry.unregister(`door_${id}`);
    };
  }, [id, isOpen, isLocked, label, position]);

  // Smooth rotation animation around the hinge
  useFrame((_, delta) => {
    // Target hinge angle: ~85 deg when open, 0 when closed
    const targetAngle = isOpen ? (Math.PI * 0.48) : 0;
    const smooth = 1 - Math.exp(-9 * delta);

    if (hingeRef1.current) {
      hingeRef1.current.rotation.y = THREE.MathUtils.lerp(
        hingeRef1.current.rotation.y,
        targetAngle,
        smooth
      );
    }

    if (isDouble && hingeRef2.current) {
      hingeRef2.current.rotation.y = THREE.MathUtils.lerp(
        hingeRef2.current.rotation.y,
        -targetAngle,
        smooth
      );
    }
  });

  const panelWidth = isDouble ? width / 2 : width;

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Decorative Doorframe */}
      {/* Left post */}
      <mesh position={[-width / 2 - 0.06, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.12, height + 0.1, 0.18]} />
        <meshStandardMaterial color="#3a2318" roughness={0.7} />
      </mesh>
      {/* Right post */}
      <mesh position={[width / 2 + 0.06, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.12, height + 0.1, 0.18]} />
        <meshStandardMaterial color="#3a2318" roughness={0.7} />
      </mesh>
      {/* Top lintel */}
      <mesh position={[0, height + 0.05, 0]} castShadow receiveShadow>
        <boxGeometry args={[width + 0.24, 0.12, 0.18]} />
        <meshStandardMaterial color="#3a2318" roughness={0.7} />
      </mesh>

      {/* SINGLE DOOR (Door 1, 2, 3) */}
      {!isDouble && (
        // Hinge group positioned at the left jamb edge
        <group ref={hingeRef1} position={[-width / 2, 0, 0]}>
          {/* Door leaf shifted so its left edge is at the hinge pivot */}
          <group position={[panelWidth / 2, 0, 0]}>
            {/* Main wooden slab */}
            <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
              <boxGeometry args={[panelWidth - 0.04, height - 0.04, 0.08]} />
              <meshStandardMaterial color="#4d2f1d" roughness={0.65} />
            </mesh>
            {/* Inset panels */}
            <mesh position={[0, height * 0.72, 0.045]}>
              <boxGeometry args={[panelWidth * 0.65, height * 0.38, 0.02]} />
              <meshStandardMaterial color="#3e2314" roughness={0.75} />
            </mesh>
            <mesh position={[0, height * 0.28, 0.045]}>
              <boxGeometry args={[panelWidth * 0.65, height * 0.38, 0.02]} />
              <meshStandardMaterial color="#3e2314" roughness={0.75} />
            </mesh>
            {/* Brass Handle */}
            <mesh position={[panelWidth * 0.36, height * 0.48, 0.06]} castShadow>
              <cylinderGeometry args={[0.015, 0.015, 0.12, 12]} />
              <meshStandardMaterial color="#e5b842" metalness={0.85} roughness={0.25} />
            </mesh>
            {/* Keyhole Plate */}
            <mesh position={[panelWidth * 0.36, height * 0.42, 0.045]}>
              <boxGeometry args={[0.04, 0.08, 0.01]} />
              <meshStandardMaterial color="#c29b38" metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
        </group>
      )}

      {/* DOUBLE DOOR (Conservatory Door 4) */}
      {isDouble && (
        <>
          {/* Left Leaf */}
          <group ref={hingeRef1} position={[-width / 2, 0, 0]}>
            <group position={[panelWidth / 2, 0, 0]}>
              <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
                <boxGeometry args={[panelWidth - 0.03, height - 0.04, 0.08]} />
                <meshStandardMaterial color="#551a24" roughness={0.55} />
              </mesh>
              {/* Glass window pane on upper door leaf */}
              <mesh position={[0, height * 0.68, 0]}>
                <boxGeometry args={[panelWidth * 0.7, height * 0.42, 0.06]} />
                <meshStandardMaterial 
                  color="#eed5dc" 
                  roughness={0.15} 
                  metalness={0.2} 
                  transparent 
                  opacity={0.65} 
                />
              </mesh>
              {/* Ornate Brass Handle */}
              <mesh position={[panelWidth * 0.36, height * 0.48, 0.06]} castShadow>
                <cylinderGeometry args={[0.018, 0.018, 0.14, 12]} />
                <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.2} />
              </mesh>
            </group>
          </group>

          {/* Right Leaf */}
          <group ref={hingeRef2} position={[width / 2, 0, 0]}>
            <group position={[-panelWidth / 2, 0, 0]}>
              <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
                <boxGeometry args={[panelWidth - 0.03, height - 0.04, 0.08]} />
                <meshStandardMaterial color="#551a24" roughness={0.55} />
              </mesh>
              {/* Glass window pane */}
              <mesh position={[0, height * 0.68, 0]}>
                <boxGeometry args={[panelWidth * 0.7, height * 0.42, 0.06]} />
                <meshStandardMaterial 
                  color="#eed5dc" 
                  roughness={0.15} 
                  metalness={0.2} 
                  transparent 
                  opacity={0.65} 
                />
              </mesh>
              {/* Ornate Brass Handle */}
              <mesh position={[-panelWidth * 0.36, height * 0.48, 0.06]} castShadow>
                <cylinderGeometry args={[0.018, 0.018, 0.14, 12]} />
                <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.2} />
              </mesh>
            </group>
          </group>
        </>
      )}
    </group>
  );
};
