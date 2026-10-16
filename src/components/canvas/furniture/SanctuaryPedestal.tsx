import React, { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { interactiveRegistry } from '../../../state/interactiveRegistry';
import { gameStore, useGameStore } from '../../../state/gameStore';

export const SanctuaryPedestal: React.FC<{ position: [number, number, number] }> = ({
  position
}) => {
  const { flags } = useGameStore();
  const chestLidRef = useRef<THREE.Group>(null);
  const auraLightRef = useRef<THREE.PointLight>(null);

  // Register interactive chest
  useEffect(() => {
    interactiveRegistry.register({
      id: 'final_chest',
      label: flags.finalPuzzleSolved ? 'View The Celestial Sanctuary' : 'Unlock Celestial Keepsake Chest',
      subLabel: flags.finalPuzzleSolved ? 'The Heart of Us has opened' : 'Inscribed with three sacred pillars',
      type: 'puzzle',
      position: [position[0], position[1] + 1.2, position[2]],
      radius: 2.8,
      onInteract: () => {
        if (flags.finalPuzzleSolved) {
          gameStore.setPhase('FINAL_REVEAL');
        } else {
          gameStore.openModal('FINAL_PUZZLE');
        }
      }
    });

    return () => {
      interactiveRegistry.unregister('final_chest');
    };
  }, [flags.finalPuzzleSolved, position]);

  // Smooth chest lid opening animation when solved
  useFrame(({ clock }, delta) => {
    if (chestLidRef.current) {
      const targetRotation = flags.chestOpen ? -Math.PI * 0.65 : 0;
      chestLidRef.current.rotation.x = THREE.MathUtils.lerp(
        chestLidRef.current.rotation.x,
        targetRotation,
        1 - Math.exp(-6 * delta)
      );
    }

    if (auraLightRef.current) {
      const t = clock.getElapsedTime() * 3;
      if (flags.chestOpen) {
        auraLightRef.current.intensity = 4.5 + Math.sin(t) * 0.8;
      } else {
        auraLightRef.current.intensity = 1.8 + Math.sin(t) * 0.4;
      }
    }
  });

  return (
    <group position={position}>
      {/* --- CARVED WHITE MARBLE ROTUNDA PEDESTAL --- */}
      {/* Stepped Plinth Base */}
      <mesh position={[0, 0.12, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.3, 1.45, 0.24, 32]} />
        <meshStandardMaterial color="#f0ece6" roughness={0.35} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.32, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.1, 1.25, 0.2, 32]} />
        <meshStandardMaterial color="#faf6f0" roughness={0.3} metalness={0.1} />
      </mesh>
      {/* Central Column */}
      <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.8, 0.88, 0.6, 24]} />
        <meshStandardMaterial color="#f2eee8" roughness={0.35} metalness={0.1} />
      </mesh>
      {/* Top Table Capital */}
      <mesh position={[0, 1.05, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.05, 0.95, 0.1, 32]} />
        <meshStandardMaterial color="#faf6f0" roughness={0.25} metalness={0.15} />
      </mesh>

      {/* Crimson Velvet Round Cushion */}
      <mesh position={[0, 1.12, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.7, 0.75, 0.08, 24]} />
        <meshStandardMaterial color="#8b1c31" roughness={0.8} />
      </mesh>

      {/* --- RING OF ROMANTIC CANDLES ON PEDESTAL --- */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const cx = Math.cos(angle) * 0.88;
        const cz = Math.sin(angle) * 0.88;
        return (
          <group key={i} position={[cx, 1.1, cz]}>
            {/* Candle wax stick */}
            <mesh position={[0, 0.08, 0]} castShadow>
              <cylinderGeometry args={[0.02, 0.025, 0.16, 8]} />
              <meshStandardMaterial color="#fffbe6" roughness={0.4} />
            </mesh>
            {/* Flickering Flame */}
            <mesh position={[0, 0.18, 0]}>
              <coneGeometry args={[0.015, 0.04, 6]} />
              <meshBasicMaterial color="#ffaa22" />
            </mesh>
          </group>
        );
      })}

      {/* --- THE CELESTIAL KEEPSAKE CHEST --- */}
      <group position={[0, 1.16, 0]}>
        {/* Chest Base: Rose gold filigree and dark walnut */}
        <mesh position={[0, 0.12, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.55, 0.24, 0.38]} />
          <meshStandardMaterial color="#3a1820" roughness={0.5} />
        </mesh>
        {/* Rose gold corner trims */}
        {[-0.27, 0.27].map((cx) =>
          [-0.18, 0.18].map((cz) => (
            <mesh key={`${cx}_${cz}`} position={[cx, 0.12, cz]}>
              <boxGeometry args={[0.03, 0.23, 0.03]} />
              <meshStandardMaterial color="#e5a478" metalness={0.9} roughness={0.2} />
            </mesh>
          ))
        )}

        {/* Hinged Chest Domed Lid */}
        <group ref={chestLidRef} position={[0, 0.24, -0.18]}>
          <group position={[0, 0.06, 0.18]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.19, 0.19, 0.56, 16, 1, false, 0, Math.PI]} />
              <meshStandardMaterial color="#4d1b28" roughness={0.45} />
            </mesh>
            {/* Golden Star Emblem on Lid */}
            <mesh position={[0, 0.2, 0]}>
              <sphereGeometry args={[0.04, 8, 8]} />
              <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
        </group>

        {/* Interior Radiance / Heart of Us when Opened */}
        {flags.chestOpen && (
          <group position={[0, 0.22, 0]}>
            {/* Glowing Ruby Heart / Keepsake */}
            <mesh castShadow>
              <octahedronGeometry args={[0.1, 2]} />
              <meshStandardMaterial 
                color="#ff2a55" 
                emissive="#ff2a55" 
                emissiveIntensity={2.5} 
                roughness={0.1} 
              />
            </mesh>
            {/* Romantic Sparkle Ring */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.18, 0.22, 32]} />
              <meshBasicMaterial color="#ffc5d3" transparent opacity={0.65} />
            </mesh>
          </group>
        )}

        {/* Chest Aura Point Light - Optimized without shadow passes */}
        <pointLight 
          ref={auraLightRef}
          position={[0, 0.35, 0.1]} 
          color={flags.chestOpen ? "#ff99bb" : "#ffcc77"} 
          intensity={flags.chestOpen ? 4.5 : 2.0} 
          distance={8.0} 
          decay={1.3} 
        />
      </group>

      {/* Scattered Rose Petals on Floor around pedestal */}
      {Array.from({ length: 24 }).map((_, i) => {
        const radius = 1.3 + (i % 6) * 0.25;
        const angle = (i * 0.53);
        const px = Math.cos(angle) * radius;
        const pz = Math.sin(angle) * radius;
        return (
          <mesh key={i} position={[px, 0.01, pz]} rotation={[-Math.PI / 2, 0, i * 0.4]}>
            <planeGeometry args={[0.08, 0.05]} />
            <meshStandardMaterial color="#b3122c" roughness={0.6} />
          </mesh>
        );
      })}
    </group>
  );
};
