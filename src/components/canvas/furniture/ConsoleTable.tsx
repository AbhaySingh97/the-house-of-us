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
        <meshStandardMaterial color="#54301d" roughness={0.5} />
      </mesh>
      {/* Beveled edge trim */}
      <mesh position={[0, 0.77, 0]} castShadow>
        <boxGeometry args={[1.54, 0.04, 0.59]} />
        <meshStandardMaterial color="#422516" roughness={0.6} />
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
          <meshStandardMaterial color="#54301d" roughness={0.5} />
        </mesh>
      ))}

      {/* Decorative Ornate Mirror on Wall behind Table */}
      <group position={[0, 1.8, -0.26]}>
        {/* Frame */}
        <mesh castShadow>
          <boxGeometry args={[1.2, 1.4, 0.05]} />
          <meshStandardMaterial color="#d4af37" metalness={0.85} roughness={0.25} />
        </mesh>
        {/* Mirror Glass */}
        <mesh position={[0, 0, 0.03]}>
          <planeGeometry args={[1.05, 1.25]} />
          <meshStandardMaterial color="#d8edf2" roughness={0.05} metalness={0.9} />
        </mesh>
      </group>

      {/* Warm Table Lamp */}
      <group position={[-0.5, 0.84, 0]}>
        {/* Brass Base */}
        <mesh position={[0, 0.04, 0]} castShadow>
          <cylinderGeometry args={[0.09, 0.11, 0.08, 16]} />
          <meshStandardMaterial color="#d4af37" metalness={0.85} roughness={0.25} />
        </mesh>
        {/* Stem */}
        <mesh position={[0, 0.22, 0]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.28, 12]} />
          <meshStandardMaterial color="#d4af37" metalness={0.85} roughness={0.25} />
        </mesh>
        {/* Pleated Fabric Shade */}
        <mesh position={[0, 0.4, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.22, 0.22, 16]} />
          <meshStandardMaterial color="#fff6e5" roughness={0.8} />
        </mesh>
        {/* Lamp Light - Optimized without expensive point shadow */}
        <pointLight position={[0, 0.38, 0]} color="#ffd699" intensity={2.4} distance={7} decay={1.3} />
      </group>

      {/* The Welcome Letter (Folded 3D Parchment with Red Wax Seal) */}
      <group position={[-0.05, 0.855, 0.05]} rotation={[-Math.PI / 2, 0, 0.08]}>
        {/* Parchment slab with thickness */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.34, 0.26, 0.012]} />
          <meshStandardMaterial color="#fdf7ea" roughness={0.7} />
        </mesh>
        {/* Folded paper crease line */}
        <mesh position={[0, 0, 0.007]}>
          <planeGeometry args={[0.32, 0.006]} />
          <meshBasicMaterial color="#e0d0b8" />
        </mesh>
        {/* Faux handwriting ink lines */}
        {[-0.07, -0.04, -0.01, 0.03, 0.06].map((y, idx) => (
          <mesh key={idx} position={[0, y, 0.008]}>
            <planeGeometry args={[0.26 - (idx % 2) * 0.05, 0.006]} />
            <meshBasicMaterial color="#2d170e" />
          </mesh>
        ))}
        {/* Crimson Red Wax Seal Medallion with Raised Rim */}
        <group position={[0.1, -0.08, 0.012]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.032, 0.035, 0.01, 16]} />
            <meshStandardMaterial color="#9e1828" roughness={0.4} metalness={0.1} />
          </mesh>
          <mesh position={[0, 0.006, 0]}>
            <torusGeometry args={[0.024, 0.004, 8, 16]} />
            <meshStandardMaterial color="#7a0e1c" roughness={0.5} />
          </mesh>
        </group>
        {/* Approach Glowing Beacon Ring */}
        <mesh position={[0, 0, 0.009]}>
          <ringGeometry args={[0.19, 0.22, 32]} />
          <meshBasicMaterial color="#ffc566" transparent opacity={0.45} />
        </mesh>
      </group>

      {/* Lavender Flower Arrangement in Glazed Ceramic Vase */}
      <group position={[0.22, 0.84, -0.1]}>
        <mesh position={[0, 0.1, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.08, 0.2, 16]} />
          <meshStandardMaterial color="#faf5eb" roughness={0.2} metalness={0.1} />
        </mesh>
        {/* Ceramic Neck Trim */}
        <mesh position={[0, 0.18, 0]}>
          <torusGeometry args={[0.062, 0.008, 8, 16]} />
          <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Lavender stalks & blossoms */}
        <mesh position={[0, 0.26, 0]}>
          <sphereGeometry args={[0.08, 10, 10]} />
          <meshStandardMaterial color="#8a5da5" roughness={0.8} />
        </mesh>
        <mesh position={[0.03, 0.31, 0.02]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color="#9d73b8" roughness={0.8} />
        </mesh>
      </group>

      {/* Ornate Brass Key (if not picked up yet) */}
      {!flags.hasFoundHallwayKey && (
        <group position={[0.45, 0.85, 0.08]}>
          {/* Small Crimson Velvet Pad underneath the key */}
          <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <circleGeometry args={[0.14, 24]} />
            <meshStandardMaterial color="#7d1726" roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.006, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.13, 0.14, 24]} />
            <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
          </mesh>

          {/* Detailed 3D Antique Key Resting with Slight Upright Angle */}
          <group position={[0, 0.04, 0]} rotation={[-Math.PI * 0.45, 0.2, 0.3]}>
            {/* Key Bow: Outer Filigree Ring */}
            <mesh castShadow>
              <torusGeometry args={[0.05, 0.012, 12, 24]} />
              <meshStandardMaterial color="#ffcf40" metalness={0.95} roughness={0.15} />
            </mesh>
            {/* Inner Heart / Clover Bow Accent */}
            <mesh position={[0, 0, 0]} castShadow>
              <torusGeometry args={[0.025, 0.007, 8, 16]} />
              <meshStandardMaterial color="#ffcf40" metalness={0.95} roughness={0.15} />
            </mesh>
            {/* Collar Trim */}
            <mesh position={[0, -0.055, 0]} castShadow>
              <cylinderGeometry args={[0.016, 0.016, 0.015, 12]} />
              <meshStandardMaterial color="#ffcf40" metalness={0.95} roughness={0.15} />
            </mesh>
            {/* Fluted Key Shaft */}
            <mesh position={[0, -0.12, 0]} castShadow>
              <cylinderGeometry args={[0.01, 0.01, 0.12, 12]} />
              <meshStandardMaterial color="#ffcf40" metalness={0.95} roughness={0.15} />
            </mesh>
            {/* Dual Notched Bit Teeth */}
            <group position={[0.025, -0.16, 0]}>
              <mesh castShadow>
                <boxGeometry args={[0.035, 0.038, 0.01]} />
                <meshStandardMaterial color="#ffcf40" metalness={0.95} roughness={0.15} />
              </mesh>
              {/* Notched Ward Cutout */}
              <mesh position={[0.008, 0, 0]}>
                <boxGeometry args={[0.015, 0.012, 0.012]} />
                <meshStandardMaterial color="#54301d" roughness={0.5} />
              </mesh>
            </group>
          </group>

          {/* Gentle Pulsing Golden Key Beacon */}
          <pointLight color="#ffe066" intensity={1.4} distance={2.5} decay={1.3} />
          {/* Beacon Aura Ring */}
          <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.15, 0.18, 32]} />
            <meshBasicMaterial color="#ffe066" transparent opacity={0.55} />
          </mesh>
        </group>
      )}
    </group>
  );
};
