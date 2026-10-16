import React, { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { interactiveRegistry } from '../../../state/interactiveRegistry';
import { gameStore, useGameStore } from '../../../state/gameStore';
import { GAME_CONFIG } from '../../../config/gameConfig';

export const GardenFountain: React.FC<{ center: [number, number, number] }> = ({ center }) => {
  const { flags } = useGameStore();
  const waterRef = useRef<THREE.Mesh>(null);

  // Animate gentle water pulsation
  useFrame(({ clock }) => {
    if (waterRef.current) {
      const t = clock.getElapsedTime() * 2;
      waterRef.current.scale.set(
        1 + Math.sin(t) * 0.02,
        1,
        1 + Math.cos(t) * 0.02
      );
    }
  });

  // 1. Garden Letter on Stone Bench
  useEffect(() => {
    interactiveRegistry.register({
      id: 'garden_letter',
      label: 'Read Chapter III Letter',
      subLabel: '"The Garden of Seasons"',
      type: 'inspect',
      position: [center[0] - 2.8, center[1] + 0.6, center[2]],
      radius: 2.5,
      onInteract: () => {
        gameStore.openModal('LETTER_GARDEN');
      }
    });

    return () => {
      interactiveRegistry.unregister('garden_letter');
    };
  }, [center]);

  // Lantern positions surrounding the fountain
  const lanternOffsets: Record<'dawn' | 'meadow' | 'twilight' | 'starlight', [number, number]> = {
    dawn: [0, 2.8],         // South: Dawn
    meadow: [2.8, 0],        // East: Meadow
    twilight: [0, -2.8],      // North: Twilight
    starlight: [-2.8, 0],    // West: Starlight
  };

  // Register interactive lanterns
  useEffect(() => {
    GAME_CONFIG.puzzles.gardenPuzzle.lanterns.forEach((lantern) => {
      const offset = lanternOffsets[lantern.id];
      const pos: [number, number, number] = [
        center[0] + offset[0],
        center[1] + 1.2,
        center[2] + offset[1]
      ];

      interactiveRegistry.register({
        id: `lantern_${lantern.id}`,
        label: `Kindle ${lantern.title}`,
        subLabel: lantern.subtitle,
        type: 'lantern',
        position: pos,
        radius: 2.6,
        onInteract: () => {
          gameStore.touchLantern(lantern.id);
        }
      });
    });

    return () => {
      GAME_CONFIG.puzzles.gardenPuzzle.lanterns.forEach((lantern) => {
        interactiveRegistry.unregister(`lantern_${lantern.id}`);
      });
    };
  }, [center]);

  return (
    <group position={center}>
      {/* --- TIERED CARVED STONE FOUNTAIN --- */}
      {/* Outer Basin */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.5, 1.6, 0.5, 24]} />
        <meshStandardMaterial color="#3a3e39" roughness={0.8} />
      </mesh>
      {/* Water pool */}
      <mesh ref={waterRef} position={[0, 0.45, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.38, 24]} />
        <meshStandardMaterial color="#2a7796" roughness={0.1} metalness={0.8} transparent opacity={0.85} />
      </mesh>
      {/* Center Pedestal Tier */}
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.45, 0.6, 16]} />
        <meshStandardMaterial color="#3a3e39" roughness={0.8} />
      </mesh>
      {/* Upper Tier Basin */}
      <mesh position={[0, 1.05, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.7, 0.5, 0.2, 16]} />
        <meshStandardMaterial color="#444943" roughness={0.75} />
      </mesh>
      {/* Upper Water */}
      <mesh position={[0, 1.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.62, 16]} />
        <meshStandardMaterial color="#388faa" roughness={0.1} metalness={0.9} transparent opacity={0.9} />
      </mesh>
      {/* Center Finial */}
      <mesh position={[0, 1.35, 0]} castShadow>
        <sphereGeometry args={[0.15, 12, 12]} />
        <meshStandardMaterial color="#e5c158" metalness={0.85} roughness={0.3} />
      </mesh>

      {/* --- GARDEN BENCH WITH CHAPTER III LETTER --- */}
      <group position={[-2.8, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        {/* Carved stone bench seat */}
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.3, 0.08, 0.45]} />
          <meshStandardMaterial color="#4a4f49" roughness={0.8} />
        </mesh>
        {/* Bench legs */}
        {[-0.5, 0.5].map((bx, i) => (
          <mesh key={i} position={[bx, 0.22, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.12, 0.44, 0.38]} />
            <meshStandardMaterial color="#4a4f49" roughness={0.8} />
          </mesh>
        ))}
        {/* Letter resting on bench */}
        <group position={[0, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0.1]}>
          <mesh castShadow receiveShadow>
            <planeGeometry args={[0.32, 0.24]} />
            <meshStandardMaterial color="#fcf5e5" roughness={0.85} />
          </mesh>
          {[-0.06, -0.02, 0.02, 0.06].map((y, idx) => (
            <mesh key={idx} position={[0, y, 0.001]}>
              <planeGeometry args={[0.24 - (idx % 2) * 0.04, 0.005]} />
              <meshBasicMaterial color="#2d1c25" />
            </mesh>
          ))}
          <mesh position={[0, 0, 0.002]}>
            <ringGeometry args={[0.18, 0.2, 24]} />
            <meshBasicMaterial color="#ffc566" transparent opacity={0.4} />
          </mesh>
        </group>
      </group>

      {/* --- 4 ROMANTIC PEDESTAL LANTERNS --- */}
      {GAME_CONFIG.puzzles.gardenPuzzle.lanterns.map((lantern) => {
        const offset = lanternOffsets[lantern.id];
        const isLit = flags.litLanterns.includes(lantern.id);

        return (
          <group key={lantern.id} position={[offset[0], 0, offset[1]]}>
            {/* Stone Pillar Base */}
            <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.18, 0.24, 1.0, 12]} />
              <meshStandardMaterial color="#353b34" roughness={0.85} />
            </mesh>
            {/* Ornate Capital */}
            <mesh position={[0, 1.05, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.38, 0.1, 0.38]} />
              <meshStandardMaterial color="#2d332c" roughness={0.8} />
            </mesh>

            {/* Brass Lantern Cage */}
            <group position={[0, 1.25, 0]}>
              <mesh castShadow>
                <boxGeometry args={[0.26, 0.32, 0.26]} />
                <meshStandardMaterial 
                  color={isLit ? lantern.color : '#1a1f1a'} 
                  emissive={isLit ? lantern.color : '#000000'}
                  emissiveIntensity={isLit ? 1.6 : 0}
                  roughness={0.3} 
                  transparent 
                  opacity={0.85} 
                />
              </mesh>
              {/* Top hood */}
              <mesh position={[0, 0.22, 0]} castShadow>
                <coneGeometry args={[0.2, 0.16, 4]} />
                <meshStandardMaterial color="#c59b27" metalness={0.85} roughness={0.3} />
              </mesh>

              {/* Glowing point light if lit */}
              {isLit && (
                <pointLight 
                  color={lantern.color} 
                  intensity={2.8} 
                  distance={6.0} 
                  decay={2} 
                  castShadow 
                />
              )}
            </group>
          </group>
        );
      })}
    </group>
  );
};
