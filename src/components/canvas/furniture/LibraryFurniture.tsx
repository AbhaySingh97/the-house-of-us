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

        {/* Desk Lamp - Optimized warm lighting */}
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
            <meshStandardMaterial color="#fffbee" roughness={0.8} />
          </mesh>
          <pointLight position={[0, 0.38, 0]} color="#ffe099" intensity={2.6} distance={6.5} decay={1.3} />
        </group>

        {/* Chapter II Letter (Folded 3D Parchment with Red Wax Seal) */}
        <group position={[-0.3, 0.87, 0.1]} rotation={[-Math.PI / 2, 0, 0.05]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.34, 0.26, 0.012]} />
            <meshStandardMaterial color="#fdf8ec" roughness={0.7} />
          </mesh>
          {[-0.08, -0.04, 0.0, 0.04, 0.08].map((y, idx) => (
            <mesh key={idx} position={[0, y, 0.008]}>
              <planeGeometry args={[0.26 - (idx % 2) * 0.05, 0.005]} />
              <meshBasicMaterial color="#30150d" />
            </mesh>
          ))}
          {/* Crimson Wax Seal */}
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
          {/* Approach glowing beacon */}
          <mesh position={[0, 0, 0.009]}>
            <ringGeometry args={[0.19, 0.22, 32]} />
            <meshBasicMaterial color="#ffc566" transparent opacity={0.4} />
          </mesh>
        </group>

        {/* 3 Inscribed Clue Books stacked on desk with visible Roman numerals and ribs */}
        <group position={[-0.05, 0.86, -0.2]}>
          {/* Vol VII - Burgundy Leather ("First Glance") */}
          <group position={[0, 0.025, 0]} rotation={[0, 0.1, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.26, 0.045, 0.34]} />
              <meshStandardMaterial color="#691e2b" roughness={0.5} />
            </mesh>
            {/* Gilded page block */}
            <mesh position={[0.01, 0, 0]}>
              <boxGeometry args={[0.24, 0.038, 0.32]} />
              <meshStandardMaterial color="#e5c158" metalness={0.7} roughness={0.3} />
            </mesh>
            {/* Spine Gold Ribs & VII Tag */}
            <mesh position={[-0.125, 0, 0]}>
              <boxGeometry args={[0.015, 0.042, 0.34]} />
              <meshStandardMaterial color="#50141f" roughness={0.6} />
            </mesh>
            <mesh position={[-0.13, 0.005, 0]} rotation={[0, Math.PI / 2, 0]}>
              <planeGeometry args={[0.1, 0.025]} />
              <meshStandardMaterial color="#e5c158" metalness={0.8} roughness={0.2} />
            </mesh>
          </group>

          {/* Vol II - Royal Navy Leather ("Second Chance") */}
          <group position={[0.02, 0.07, 0.01]} rotation={[0, -0.08, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.24, 0.045, 0.32]} />
              <meshStandardMaterial color="#193359" roughness={0.5} />
            </mesh>
            <mesh position={[0.01, 0, 0]}>
              <boxGeometry args={[0.22, 0.038, 0.3]} />
              <meshStandardMaterial color="#e5c158" metalness={0.7} roughness={0.3} />
            </mesh>
            <mesh position={[-0.115, 0, 0]}>
              <boxGeometry args={[0.015, 0.042, 0.32]} />
              <meshStandardMaterial color="#122440" roughness={0.6} />
            </mesh>
            <mesh position={[-0.12, 0.005, 0]} rotation={[0, Math.PI / 2, 0]}>
              <planeGeometry args={[0.08, 0.025]} />
              <meshStandardMaterial color="#e5c158" metalness={0.8} roughness={0.2} />
            </mesh>
          </group>

          {/* Vol IV - Forest Emerald Leather ("Four Seasons") */}
          <group position={[-0.01, 0.115, 0.02]} rotation={[0, 0.15, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.22, 0.045, 0.3]} />
              <meshStandardMaterial color="#1a5232" roughness={0.5} />
            </mesh>
            <mesh position={[0.01, 0, 0]}>
              <boxGeometry args={[0.2, 0.038, 0.28]} />
              <meshStandardMaterial color="#e5c158" metalness={0.7} roughness={0.3} />
            </mesh>
            <mesh position={[-0.105, 0, 0]}>
              <boxGeometry args={[0.015, 0.042, 0.3]} />
              <meshStandardMaterial color="#123b24" roughness={0.6} />
            </mesh>
            <mesh position={[-0.11, 0.005, 0]} rotation={[0, Math.PI / 2, 0]}>
              <planeGeometry args={[0.08, 0.025]} />
              <meshStandardMaterial color="#e5c158" metalness={0.8} roughness={0.2} />
            </mesh>
          </group>
        </group>

        {/* The Secret Lock Compartment Box */}
        <group position={[0.4, 0.86, 0.05]}>
          {/* Walnut casing */}
          <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.42, 0.16, 0.3]} />
            <meshStandardMaterial color="#351a0e" roughness={0.5} />
          </mesh>
          {/* Brass faceplate with 3 dials */}
          <mesh position={[0, 0.08, 0.155]}>
            <boxGeometry args={[0.34, 0.1, 0.015]} />
            <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* 3 Tumbler Dials with number indicators */}
          {[-0.1, 0, 0.1].map((dx, i) => (
            <mesh key={i} position={[dx, 0.08, 0.165]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.025, 0.025, 0.02, 16]} />
              <meshStandardMaterial color="#222222" metalness={0.8} roughness={0.25} />
            </mesh>
          ))}

          {/* Compartment Slide / Drawer: Slides forward when solved! */}
          <group position={[0, 0.08, flags.libraryPuzzleSolved ? 0.24 : 0]}>
            {flags.libraryPuzzleSolved && (
              <group position={[0, 0, 0]}>
                {/* Velvet tray */}
                <mesh position={[0, -0.04, 0]}>
                  <boxGeometry args={[0.32, 0.04, 0.2]} />
                  <meshStandardMaterial color="#1a4d31" roughness={0.7} />
                </mesh>
                {/* Verdant Conservatory Key (Leaf shape with filigree) */}
                <group position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <mesh castShadow>
                    <cylinderGeometry args={[0.04, 0.04, 0.012, 6]} />
                    <meshStandardMaterial color="#2ecc71" metalness={0.8} roughness={0.2} />
                  </mesh>
                  <mesh position={[0, -0.07, 0]} castShadow>
                    <cylinderGeometry args={[0.008, 0.008, 0.1, 8]} />
                    <meshStandardMaterial color="#27ae60" metalness={0.85} roughness={0.2} />
                  </mesh>
                  <mesh position={[0.018, -0.1, 0]} castShadow>
                    <boxGeometry args={[0.026, 0.022, 0.008]} />
                    <meshStandardMaterial color="#27ae60" metalness={0.85} roughness={0.2} />
                  </mesh>
                  <pointLight color="#2ecc71" intensity={1.4} distance={2.2} decay={1.3} />
                </group>
              </group>
            )}
          </group>
        </group>
      </group>

      {/* --- LARGE FLOOR-TO-CEILING BOOKSHELVES (Corrected Relative Room Coordinates) --- */}
      {/* North Wall Bookshelf (X: 2.4, Z: -4.72 against North wall) */}
      <group position={[2.4, 1.6, -4.72]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[4.2, 3.1, 0.45]} />
          <meshStandardMaterial color="#4a2a16" roughness={0.65} />
        </mesh>
        {/* Books rows */}
        {[-1.0, -0.4, 0.2, 0.8].map((sy, rowIdx) => (
          <group key={rowIdx} position={[0, sy, 0.12]}>
            {[-1.8, -1.2, -0.6, 0, 0.6, 1.2, 1.8].map((bx, colIdx) => {
              const colors = ['#691e2b', '#1a3359', '#1a5232', '#6b4d1b', '#482559'];
              const c = colors[(rowIdx * 3 + colIdx) % colors.length];
              return (
                <mesh key={colIdx} position={[bx, 0.15, 0]} castShadow>
                  <boxGeometry args={[0.5, 0.28, 0.2]} />
                  <meshStandardMaterial color={c} roughness={0.6} />
                </mesh>
              );
            })}
          </group>
        ))}
      </group>

      {/* East Wall Bookshelf (X: 4.72, Z: 0 against East wall) */}
      <group position={[4.72, 1.6, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[4.2, 3.1, 0.45]} />
          <meshStandardMaterial color="#4a2a16" roughness={0.65} />
        </mesh>
        {[-1.0, -0.4, 0.2, 0.8].map((sy, rowIdx) => (
          <group key={rowIdx} position={[0, sy, 0.12]}>
            {[-1.8, -1.2, -0.6, 0, 0.6, 1.2, 1.8].map((bx, colIdx) => {
              const colors = ['#691e2b', '#1a3359', '#1a5232', '#6b4d1b', '#482559'];
              const c = colors[(rowIdx * 2 + colIdx) % colors.length];
              return (
                <mesh key={colIdx} position={[bx, 0.15, 0]} castShadow>
                  <boxGeometry args={[0.5, 0.28, 0.2]} />
                  <meshStandardMaterial color={c} roughness={0.6} />
                </mesh>
              );
            })}
          </group>
        ))}
      </group>
    </group>
  );
};
