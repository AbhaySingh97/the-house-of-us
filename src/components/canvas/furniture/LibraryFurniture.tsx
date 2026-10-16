import React, { useEffect } from 'react';
import { interactiveRegistry } from '../../../state/interactiveRegistry';
import { gameStore, useGameStore } from '../../../state/gameStore';

export const LibraryFurniture: React.FC<{ deskPosition: [number, number, number] }> = ({
  deskPosition
}) => {
  const { flags } = useGameStore();

  useEffect(() => {
    // 1. Chapter II Letter
    interactiveRegistry.register({
      id: 'library_letter',
      label: 'Read Chapter II Letter',
      subLabel: '"Written in the Margins"',
      type: 'inspect',
      position: [deskPosition[0] - 0.45, deskPosition[1] + 0.9, deskPosition[2]],
      radius: 2.5,
      onInteract: () => {
        gameStore.openModal('LETTER_LIBRARY');
      }
    });

    // 2. Secret Combination Lock Compartment
    interactiveRegistry.register({
      id: 'library_lock',
      label: flags.libraryPuzzleSolved ? 'Inspect Open Secret Compartment' : 'Examine 3-Dial Brass Lock',
      subLabel: flags.libraryPuzzleSolved ? 'Contains the Conservatory Key' : 'Turn the numbered tumblers',
      type: 'puzzle',
      position: [deskPosition[0] + 0.4, deskPosition[1] + 0.9, deskPosition[2]],
      radius: 2.5,
      onInteract: () => {
        gameStore.openModal('LIBRARY_PUZZLE');
      }
    });

    // 3. Inscribed Clue Books
    interactiveRegistry.register({
      id: 'library_books',
      label: 'Examine Inscribed Books',
      subLabel: 'Three numbered leather-bound volumes',
      type: 'inspect',
      position: [deskPosition[0] - 0.05, deskPosition[1] + 0.9, deskPosition[2] - 0.2],
      radius: 2.5,
      onInteract: () => {
        gameStore.showToast('Inscribed: Vol. 7 (First Glance) • Vol. 2 (Second Chance) • Vol. 4 (Four Seasons)');
      }
    });

    return () => {
      interactiveRegistry.unregister('library_letter');
      interactiveRegistry.unregister('library_lock');
      interactiveRegistry.unregister('library_books');
    };
  }, [deskPosition, flags.libraryPuzzleSolved]);

  return (
    <group>
      {/* --- SCHOLAR'S DESK --- */}
      <group position={deskPosition}>
        {/* Tabletop */}
        <mesh position={[0, 0.82, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.9, 0.08, 0.95]} />
          <meshStandardMaterial color="#2d170e" roughness={0.5} />
        </mesh>
        {/* Desk Pedestals */}
        <mesh position={[-0.7, 0.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.4, 0.78, 0.85]} />
          <meshStandardMaterial color="#241108" roughness={0.6} />
        </mesh>
        <mesh position={[0.7, 0.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.4, 0.78, 0.85]} />
          <meshStandardMaterial color="#241108" roughness={0.6} />
        </mesh>

        {/* Desk Lamp */}
        <group position={[-0.7, 0.86, -0.25]}>
          <mesh position={[0, 0.02, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.1, 0.04, 16]} />
            <meshStandardMaterial color="#c59b27" metalness={0.85} roughness={0.25} />
          </mesh>
          <mesh position={[0, 0.22, 0]} castShadow>
            <cylinderGeometry args={[0.012, 0.012, 0.38, 12]} />
            <meshStandardMaterial color="#c59b27" metalness={0.85} roughness={0.25} />
          </mesh>
          <mesh position={[0, 0.4, 0]} castShadow>
            <cylinderGeometry args={[0.12, 0.18, 0.18, 16]} />
            <meshStandardMaterial color="#fffaed" roughness={0.8} />
          </mesh>
          <pointLight position={[0, 0.38, 0]} color="#ffe099" intensity={2.2} distance={4.5} decay={2} castShadow />
        </group>

        {/* Chapter II Letter */}
        <group position={[-0.3, 0.87, 0.1]} rotation={[-Math.PI / 2, 0, 0.05]}>
          <mesh castShadow receiveShadow>
            <planeGeometry args={[0.34, 0.26]} />
            <meshStandardMaterial color="#fcf5e5" roughness={0.85} />
          </mesh>
          {[-0.08, -0.04, 0.0, 0.04, 0.08].map((y, idx) => (
            <mesh key={idx} position={[0, y, 0.001]}>
              <planeGeometry args={[0.26 - (idx % 2) * 0.05, 0.005]} />
              <meshBasicMaterial color="#30150d" />
            </mesh>
          ))}
          <mesh position={[0, 0, 0.002]}>
            <ringGeometry args={[0.18, 0.2, 24]} />
            <meshBasicMaterial color="#ffc566" transparent opacity={0.35} />
          </mesh>
        </group>

        {/* 3 Inscribed Clue Books stacked on desk */}
        <group position={[-0.05, 0.86, -0.2]}>
          {/* Vol VII - Burgundy */}
          <mesh position={[0, 0.02, 0]} rotation={[0, 0.1, 0]} castShadow>
            <boxGeometry args={[0.24, 0.04, 0.32]} />
            <meshStandardMaterial color="#551a24" roughness={0.6} />
          </mesh>
          {/* Vol II - Navy */}
          <mesh position={[0.02, 0.06, 0.01]} rotation={[0, -0.08, 0]} castShadow>
            <boxGeometry args={[0.22, 0.04, 0.3]} />
            <meshStandardMaterial color="#1a2e45" roughness={0.6} />
          </mesh>
          {/* Vol IV - Forest Green */}
          <mesh position={[-0.01, 0.1, 0.02]} rotation={[0, 0.15, 0]} castShadow>
            <boxGeometry args={[0.2, 0.04, 0.28]} />
            <meshStandardMaterial color="#1e4028" roughness={0.6} />
          </mesh>
        </group>

        {/* The Secret Lock Compartment Box */}
        <group position={[0.4, 0.86, 0.05]}>
          {/* Walnut casing */}
          <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.42, 0.16, 0.3]} />
            <meshStandardMaterial color="#1f0f09" roughness={0.6} />
          </mesh>
          {/* Brass faceplate with 3 dials */}
          <mesh position={[0, 0.08, 0.155]}>
            <boxGeometry args={[0.34, 0.1, 0.015]} />
            <meshStandardMaterial color="#c59b27" metalness={0.9} roughness={0.25} />
          </mesh>
          {/* 3 Tumbler Dials */}
          {[-0.1, 0, 0.1].map((dx, i) => (
            <mesh key={i} position={[dx, 0.08, 0.165]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.025, 0.025, 0.02, 16]} />
              <meshStandardMaterial color="#222222" metalness={0.7} roughness={0.3} />
            </mesh>
          ))}

          {/* Compartment Slide / Drawer: Slides forward when solved! */}
          <group position={[0, 0.08, flags.libraryPuzzleSolved ? 0.22 : 0]}>
            {flags.libraryPuzzleSolved && (
              <group position={[0, 0, 0]}>
                {/* Velvet tray */}
                <mesh position={[0, -0.04, 0]}>
                  <boxGeometry args={[0.32, 0.04, 0.2]} />
                  <meshStandardMaterial color="#1a452a" roughness={0.8} />
                </mesh>
                {/* Verdant Conservatory Key (Leaf shape) */}
                <group position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <mesh castShadow>
                    <cylinderGeometry args={[0.035, 0.035, 0.01, 6]} />
                    <meshStandardMaterial color="#2ecc71" metalness={0.7} roughness={0.25} />
                  </mesh>
                  <mesh position={[0, -0.07, 0]} castShadow>
                    <cylinderGeometry args={[0.007, 0.007, 0.09, 8]} />
                    <meshStandardMaterial color="#27ae60" metalness={0.8} roughness={0.25} />
                  </mesh>
                  <pointLight color="#2ecc71" intensity={0.9} distance={1.2} />
                </group>
              </group>
            )}
          </group>
        </group>
      </group>

      {/* --- LARGE FLOOR-TO-CEILING BOOKSHELVES --- */}
      {/* North Wall Bookshelf */}
      <group position={[17.0, 1.6, -15.2]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[4.2, 3.1, 0.45]} />
          <meshStandardMaterial color="#2d170e" roughness={0.7} />
        </mesh>
        {/* Books rows */}
        {[-1.0, -0.4, 0.2, 0.8].map((sy, rowIdx) => (
          <group key={rowIdx} position={[0, sy, 0.12]}>
            {[-1.8, -1.2, -0.6, 0, 0.6, 1.2, 1.8].map((bx, colIdx) => {
              const colors = ['#5c1e28', '#1a334d', '#234a31', '#4d3b1a', '#3e244d'];
              const c = colors[(rowIdx * 3 + colIdx) % colors.length];
              return (
                <mesh key={colIdx} position={[bx, 0.15, 0]} castShadow>
                  <boxGeometry args={[0.5, 0.28, 0.2]} />
                  <meshStandardMaterial color={c} roughness={0.7} />
                </mesh>
              );
            })}
          </group>
        ))}
      </group>

      {/* East Wall Bookshelf */}
      <group position={[19.3, 1.6, -10.5]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[4.2, 3.1, 0.45]} />
          <meshStandardMaterial color="#2d170e" roughness={0.7} />
        </mesh>
        {[-1.0, -0.4, 0.2, 0.8].map((sy, rowIdx) => (
          <group key={rowIdx} position={[0, sy, 0.12]}>
            {[-1.8, -1.2, -0.6, 0, 0.6, 1.2, 1.8].map((bx, colIdx) => {
              const colors = ['#5c1e28', '#1a334d', '#234a31', '#4d3b1a', '#3e244d'];
              const c = colors[(rowIdx * 2 + colIdx) % colors.length];
              return (
                <mesh key={colIdx} position={[bx, 0.15, 0]} castShadow>
                  <boxGeometry args={[0.5, 0.28, 0.2]} />
                  <meshStandardMaterial color={c} roughness={0.7} />
                </mesh>
              );
            })}
          </group>
        ))}
      </group>
    </group>
  );
};
