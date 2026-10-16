import React, { useEffect } from 'react';
import { interactiveRegistry } from '../../../state/interactiveRegistry';
import { gameStore, useGameStore } from '../../../state/gameStore';

export const ConsoleTable: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const { flags } = useGameStore();

  useEffect(() => {
    // 1. Welcome Note interaction
    interactiveRegistry.register({
      id: 'welcome_note',
      label: 'Read Welcome Note',
      subLabel: 'A handwritten letter on parchment',
      type: 'inspect',
      position: [position[0] - 0.35, position[1] + 0.9, position[2]],
      radius: 2.5,
      onInteract: () => {
        gameStore.openModal('WELCOME_NOTE');
      }
    });

    return () => {
      interactiveRegistry.unregister('welcome_note');
    };
  }, [position]);

  // 2. Brass Key interaction (until picked up)
  useEffect(() => {
    if (!flags.hasFoundHallwayKey) {
      interactiveRegistry.register({
        id: 'hallway_key',
        label: 'Take Ornate Brass Key',
        subLabel: 'Tucked beside the dried lavender',
        type: 'pickup',
        position: [position[0] + 0.45, position[1] + 0.88, position[2]],
        radius: 2.2,
        onInteract: () => {
          gameStore.pickupHallwayKey();
        }
      });
    } else {
      interactiveRegistry.unregister('hallway_key');
    }

    return () => {
      interactiveRegistry.unregister('hallway_key');
    };
  }, [flags.hasFoundHallwayKey, position]);

  return (
    <group position={position}>
      {/* Wooden Console Table */}
      {/* Tabletop */}
      <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.08, 0.55]} />
        <meshStandardMaterial color="#3b2216" roughness={0.6} />
      </mesh>
      {/* Beveled edge trim */}
      <mesh position={[0, 0.77, 0]} castShadow>
        <boxGeometry args={[1.54, 0.04, 0.59]} />
        <meshStandardMaterial color="#2d190f" roughness={0.7} />
      </mesh>
      {/* 4 Carved Legs */}
      {[
        [-0.65, 0.4, -0.2],
        [0.65, 0.4, -0.2],
        [-0.65, 0.4, 0.2],
        [0.65, 0.4, 0.2],
      ].map(([lx, ly, lz], i) => (
        <mesh key={i} position={[lx, ly, lz]} castShadow receiveShadow>
          <boxGeometry args={[0.08, 0.8, 0.08]} />
          <meshStandardMaterial color="#3b2216" roughness={0.6} />
        </mesh>
      ))}

      {/* Decorative Ornate Mirror on Wall behind Table */}
      <group position={[0, 1.8, -0.26]}>
        {/* Frame */}
        <mesh castShadow>
          <boxGeometry args={[1.2, 1.4, 0.05]} />
          <meshStandardMaterial color="#c59b27" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Mirror Glass */}
        <mesh position={[0, 0, 0.03]}>
          <planeGeometry args={[1.05, 1.25]} />
          <meshStandardMaterial color="#d4e4ea" roughness={0.05} metalness={0.9} />
        </mesh>
      </group>

      {/* Warm Table Lamp */}
      <group position={[-0.5, 0.84, 0]}>
        {/* Brass Base */}
        <mesh position={[0, 0.04, 0]} castShadow>
          <cylinderGeometry args={[0.09, 0.11, 0.08, 16]} />
          <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Stem */}
        <mesh position={[0, 0.22, 0]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.28, 12]} />
          <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Pleated Fabric Shade */}
        <mesh position={[0, 0.4, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.22, 0.22, 16]} />
          <meshStandardMaterial color="#f7ecd7" roughness={0.8} />
        </mesh>
        {/* Lamp Light */}
        <pointLight position={[0, 0.38, 0]} color="#ffb766" intensity={2.2} distance={5} decay={2} castShadow />
      </group>

      {/* The Welcome Letter (Parchment with folded corner) */}
      <group position={[-0.05, 0.85, 0.05]} rotation={[-Math.PI / 2, 0, 0.08]}>
        <mesh castShadow receiveShadow>
          <planeGeometry args={[0.32, 0.24]} />
          <meshStandardMaterial color="#fcf5e5" roughness={0.9} />
        </mesh>
        {/* Faux handwriting ink lines */}
        {[-0.06, -0.02, 0.02, 0.06].map((y, idx) => (
          <mesh key={idx} position={[0, y, 0.001]}>
            <planeGeometry args={[0.24 - (idx % 2) * 0.04, 0.006]} />
            <meshBasicMaterial color="#3a2218" />
          </mesh>
        ))}
        {/* Subtle glowing beacon ring so player notices it */}
        <mesh position={[0, 0, 0.002]}>
          <ringGeometry args={[0.18, 0.2, 24]} />
          <meshBasicMaterial color="#ffc566" transparent opacity={0.4} />
        </mesh>
      </group>

      {/* Lavender Vase */}
      <group position={[0.25, 0.84, -0.1]}>
        <mesh position={[0, 0.1, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.08, 0.2, 12]} />
          <meshStandardMaterial color="#ede3d1" roughness={0.4} />
        </mesh>
        {/* Lavender stalks */}
        <mesh position={[0, 0.25, 0]}>
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshStandardMaterial color="#7a5585" roughness={0.9} />
        </mesh>
      </group>

      {/* Ornate Brass Key (if not picked up yet) */}
      {!flags.hasFoundHallwayKey && (
        <group position={[0.45, 0.86, 0.08]} rotation={[-Math.PI / 2, 0, 0.4]}>
          {/* Key Bow */}
          <mesh castShadow>
            <torusGeometry args={[0.04, 0.01, 8, 16]} />
            <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Key Blade */}
          <mesh position={[0, -0.07, 0]} castShadow>
            <cylinderGeometry args={[0.008, 0.008, 0.1, 8]} />
            <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Key Bit */}
          <mesh position={[0.018, -0.1, 0]} castShadow>
            <boxGeometry args={[0.025, 0.02, 0.008]} />
            <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Gentle glow effect */}
          <pointLight color="#ffe066" intensity={0.8} distance={1.2} />
        </group>
      )}
    </group>
  );
};
