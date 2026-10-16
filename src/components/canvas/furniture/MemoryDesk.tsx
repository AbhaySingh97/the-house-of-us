import React, { useEffect } from 'react';
import { interactiveRegistry } from '../../../state/interactiveRegistry';
import { gameStore, useGameStore } from '../../../state/gameStore';

export const MemoryDesk: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const { flags } = useGameStore();

  useEffect(() => {
    // 1. Memory Letter
    interactiveRegistry.register({
      id: 'memory_letter',
      label: 'Read Chapter I Letter',
      subLabel: '"The Echo of Beginning"',
      type: 'inspect',
      position: [position[0] - 0.45, position[1] + 0.9, position[2]],
      radius: 2.5,
      onInteract: () => {
        gameStore.openModal('LETTER_MEMORY');
      }
    });

    // 2. Keepsake Box / Memory Puzzle
    interactiveRegistry.register({
      id: 'memory_box',
      label: flags.memoryPuzzleSolved ? 'Inspect Opened Keepsake Box' : 'Unlock Velvet Keepsake Box',
      subLabel: flags.memoryPuzzleSolved ? 'Holds the Silver Heart Key' : 'Three recessed velvet slots',
      type: 'puzzle',
      position: [position[0] + 0.35, position[1] + 0.9, position[2]],
      radius: 2.5,
      onInteract: () => {
        gameStore.openModal('MEMORY_PUZZLE');
      }
    });

    // 3. Hourglass
    interactiveRegistry.register({
      id: 'prop_hourglass',
      label: 'Examine Antique Hourglass',
      subLabel: 'Golden sand measuring our patience',
      type: 'inspect',
      position: [position[0] + 0.65, position[1] + 0.9, position[2] - 0.22],
      radius: 2.2,
      onInteract: () => {
        gameStore.showToast('Antique Brass Hourglass: Golden sand measuring the sweet hours we spent talking.');
      }
    });

    // 4. Rose Quartz
    interactiveRegistry.register({
      id: 'prop_rose_quartz',
      label: 'Examine Rose Quartz Crystal',
      subLabel: 'Soft translucent pink mineral',
      type: 'inspect',
      position: [position[0] + 0.42, position[1] + 0.9, position[2] - 0.24],
      radius: 2.2,
      onInteract: () => {
        gameStore.showToast('Raw Rose Quartz: Glowing with the gentle warmth of true affection.');
      }
    });

    // 5. Music Box
    interactiveRegistry.register({
      id: 'prop_music_box',
      label: 'Examine Enamelled Music Box',
      subLabel: 'Plays a sweet shared melody',
      type: 'inspect',
      position: [position[0] + 0.15, position[1] + 0.9, position[2] - 0.22],
      radius: 2.2,
      onInteract: () => {
        gameStore.showToast('Enamelled Music Box: A delicate wind-up melody of the song that first united us.');
      }
    });

    return () => {
      interactiveRegistry.unregister('memory_letter');
      interactiveRegistry.unregister('memory_box');
      interactiveRegistry.unregister('prop_hourglass');
      interactiveRegistry.unregister('prop_rose_quartz');
      interactiveRegistry.unregister('prop_music_box');
    };
  }, [flags.memoryPuzzleSolved, position]);

  return (
    <group position={position}>
      {/* Heavy Mahogany Desk */}
      {/* Desktop */}
      <mesh position={[0, 0.82, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.08, 0.85]} />
        <meshStandardMaterial color="#4d271a" roughness={0.45} />
      </mesh>
      {/* Left drawer pedestal */}
      <mesh position={[-0.65, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.42, 0.78, 0.78]} />
        <meshStandardMaterial color="#3e1d13" roughness={0.55} />
      </mesh>
      {/* Right drawer pedestal */}
      <mesh position={[0.65, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.42, 0.78, 0.78]} />
        <meshStandardMaterial color="#3e1d13" roughness={0.55} />
      </mesh>
      {/* Drawer brass knobs */}
      {[-0.65, 0.65].map((x, i) => (
        <group key={i}>
          <mesh position={[x, 0.6, 0.41]} castShadow>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshStandardMaterial color="#e5b842" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[x, 0.35, 0.41]} castShadow>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshStandardMaterial color="#e5b842" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      ))}

      {/* Desk Lamp (Green Banker's Lamp / Brass) - Optimized lighting */}
      <group position={[-0.7, 0.86, -0.2]}>
        <mesh position={[0, 0.02, 0]} castShadow>
          <boxGeometry args={[0.16, 0.04, 0.16]} />
          <meshStandardMaterial color="#c59b27" metalness={0.85} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0.22, 0]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.38, 12]} />
          <meshStandardMaterial color="#c59b27" metalness={0.85} roughness={0.25} />
        </mesh>
        {/* Emerald glass curved shade */}
        <mesh position={[0, 0.38, 0]} rotation={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.22, 16, 1, false, 0, Math.PI]} />
          <meshStandardMaterial color="#1a6340" roughness={0.2} metalness={0.1} />
        </mesh>
        <pointLight position={[0, 0.35, 0]} color="#ffe8aa" intensity={2.6} distance={6.5} decay={1.3} />
      </group>

      {/* Chapter I Letter on Desk (Folded 3D Parchment with Red Wax Seal) */}
      <group position={[-0.28, 0.87, 0.1]} rotation={[-Math.PI / 2, 0, -0.05]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.34, 0.26, 0.012]} />
          <meshStandardMaterial color="#fdf8ec" roughness={0.7} />
        </mesh>
        {/* Handwriting ink */}
        {[-0.08, -0.04, 0.0, 0.04, 0.08].map((y, idx) => (
          <mesh key={idx} position={[0, y, 0.008]}>
            <planeGeometry args={[0.26 - (idx % 2) * 0.05, 0.005]} />
            <meshBasicMaterial color="#351a13" />
          </mesh>
        ))}
        {/* Red Wax Seal */}
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
        {/* Interactive glowing ring */}
        <mesh position={[0, 0, 0.009]}>
          <ringGeometry args={[0.19, 0.22, 32]} />
          <meshBasicMaterial color="#ffc566" transparent opacity={0.4} />
        </mesh>
      </group>

      {/* The Velvet Keepsake Box */}
      <group position={[0.35, 0.86, 0.05]}>
        {/* Box Base (Crimson Velvet & Warm Walnut) */}
        <mesh position={[0, 0.06, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.36, 0.12, 0.26]} />
          <meshStandardMaterial color="#7a1827" roughness={0.7} />
        </mesh>
        {/* Brass corner brackets */}
        {[-0.17, 0.17].map((bx) =>
          [-0.12, 0.12].map((bz) => (
            <mesh key={`${bx}_${bz}`} position={[bx, 0.06, bz]}>
              <boxGeometry args={[0.02, 0.11, 0.02]} />
              <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
            </mesh>
          ))
        )}

        {/* Box Lid: Hinged (opens when solved) */}
        <group position={[0, 0.12, -0.12]} rotation={[flags.memoryPuzzleSolved ? -Math.PI * 0.6 : 0, 0, 0]}>
          <mesh position={[0, 0.02, 0.12]} castShadow>
            <boxGeometry args={[0.37, 0.04, 0.27]} />
            <meshStandardMaterial color="#63111f" roughness={0.6} />
          </mesh>
          {/* Top Brass Filigree Emblem */}
          <mesh position={[0, 0.042, 0.12]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.05, 16]} />
            <meshStandardMaterial color="#e5b842" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>

        {/* Revealed Silver Heart Key (visible when opened) */}
        {flags.memoryPuzzleSolved && (
          <group position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0.3]}>
            {/* Heart Bow */}
            <mesh castShadow>
              <torusGeometry args={[0.04, 0.009, 12, 24]} />
              <meshStandardMaterial color="#f0f6ff" metalness={0.98} roughness={0.1} />
            </mesh>
            <mesh position={[0, -0.015, 0]}>
              <torusGeometry args={[0.02, 0.005, 8, 16]} />
              <meshStandardMaterial color="#f0f6ff" metalness={0.98} roughness={0.1} />
            </mesh>
            <mesh position={[0, -0.07, 0]} castShadow>
              <cylinderGeometry args={[0.008, 0.008, 0.1, 8]} />
              <meshStandardMaterial color="#f0f6ff" metalness={0.98} roughness={0.1} />
            </mesh>
            <mesh position={[0.016, -0.1, 0]} castShadow>
              <boxGeometry args={[0.024, 0.022, 0.008]} />
              <meshStandardMaterial color="#f0f6ff" metalness={0.98} roughness={0.1} />
            </mesh>
            <pointLight color="#d9ebff" intensity={1.2} distance={2.0} decay={1.3} />
          </group>
        )}
      </group>

      {/* 3 Interactive Keepsake Props displayed on desk */}
      {/* 1. Antique Brass Hourglass */}
      <group position={[0.65, 0.86, -0.22]}>
        {/* Top/bottom brass plates */}
        <mesh position={[0, 0.01, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.02, 16]} />
          <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.02, 16]} />
          <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* 3 Brass Support Pillars */}
        {[-0.038, 0.038].map((px, pi) => (
          <mesh key={pi} position={[px, 0.08, 0]}>
            <cylinderGeometry args={[0.004, 0.004, 0.14, 8]} />
            <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
          </mesh>
        ))}
        {/* Glass bulbs with golden sand */}
        <mesh position={[0, 0.08, 0]}>
          <sphereGeometry args={[0.035, 14, 14]} />
          <meshStandardMaterial color="#ffffff" roughness={0.1} transparent opacity={0.55} />
        </mesh>
        <mesh position={[0, 0.05, 0]}>
          <sphereGeometry args={[0.022, 8, 8]} />
          <meshStandardMaterial color="#e5b842" roughness={0.8} />
        </mesh>
      </group>

      {/* 2. Faceted Rose Quartz Crystal */}
      <group position={[0.42, 0.87, -0.24]}>
        <mesh castShadow>
          <octahedronGeometry args={[0.05, 0]} />
          <meshStandardMaterial 
            color="#ff9eb5" 
            emissive="#ff5c8a"
            emissiveIntensity={0.3}
            roughness={0.2} 
            metalness={0.1} 
          />
        </mesh>
        <pointLight color="#ff88a3" intensity={0.6} distance={1.2} decay={1.3} />
      </group>

      {/* 3. Enamelled Music Box */}
      <group position={[0.15, 0.87, -0.22]}>
        <mesh castShadow>
          <boxGeometry args={[0.11, 0.065, 0.085]} />
          <meshStandardMaterial color="#1a3b5c" roughness={0.35} metalness={0.3} />
        </mesh>
        {/* Gold lid frame */}
        <mesh position={[0, 0.034, 0]}>
          <boxGeometry args={[0.115, 0.008, 0.09]} />
          <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Brass winding key */}
        <mesh position={[-0.065, 0.02, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 0.03, 8]} />
          <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>
    </group>
  );
};
