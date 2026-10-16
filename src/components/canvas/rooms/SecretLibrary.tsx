import React from 'react';
import { LibraryFurniture } from '../furniture/LibraryFurniture';
import { Candle } from '../furniture/Candle';

export const SecretLibrary: React.FC = () => {
  return (
    <group position={[14.5, 0, -10.5]}>
      {/* --- FLOOR (Polished mahogany parquet) --- */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[10.0, 10.0]} />
        <meshStandardMaterial color="#2b150c" roughness={0.5} metalness={0.12} />
      </mesh>

      {/* Deep Emerald Velvet Persian Rug with Gold Filigree Border */}
      <group position={[0, 0.005, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[6.0, 6.0]} />
          <meshStandardMaterial color="#143320" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.3, 24]} />
          <meshStandardMaterial color="#1a422a" roughness={0.85} />
        </mesh>
      </group>

      {/* --- COFFERED LIBRARY CEILING --- */}
      <mesh position={[0, 3.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10.0, 10.0]} />
        <meshStandardMaterial color="#f2eae1" roughness={0.9} />
      </mesh>
      {/* Wooden cross beams */}
      {[-2.5, 0, 2.5].map((bx) => (
        <mesh key={`lbx_${bx}`} position={[bx, 3.14, 0]}>
          <boxGeometry args={[0.18, 0.12, 10.0]} />
          <meshStandardMaterial color="#241108" roughness={0.7} />
        </mesh>
      ))}
      {[-2.5, 0, 2.5].map((bz) => (
        <mesh key={`lbz_${bz}`} position={[0, 3.14, bz]}>
          <boxGeometry args={[10.0, 0.12, 0.18]} />
          <meshStandardMaterial color="#241108" roughness={0.7} />
        </mesh>
      ))}

      {/* --- WALLS (Parchment White Plaster with Dark Emerald Wainscoting) --- */}
      {/* West Wall (Entrance from Corridor 2 at Z: [-0.8, 0.8]) */}
      <mesh position={[-5.0, 1.6, 2.9]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[4.2, 3.2]} />
        <meshStandardMaterial color="#d4c9bd" roughness={0.85} />
      </mesh>
      <mesh position={[-4.98, 0.55, 2.9]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[4.2, 1.1]} />
        <meshStandardMaterial color="#122b1c" roughness={0.7} />
      </mesh>
      <mesh position={[-5.0, 1.6, -2.9]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[4.2, 3.2]} />
        <meshStandardMaterial color="#d4c9bd" roughness={0.85} />
      </mesh>
      <mesh position={[-4.98, 0.55, -2.9]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[4.2, 1.1]} />
        <meshStandardMaterial color="#122b1c" roughness={0.7} />
      </mesh>
      <mesh position={[-5.0, 2.9, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[1.6, 0.6]} />
        <meshStandardMaterial color="#d4c9bd" roughness={0.85} />
      </mesh>

      {/* South Wall (Solid wall with bookshelves) */}
      <mesh position={[0, 1.6, 5.0]} rotation={[0, Math.PI, 0]} receiveShadow>
        <planeGeometry args={[10.0, 3.2]} />
        <meshStandardMaterial color="#d4c9bd" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.55, 4.98]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[10.0, 1.1]} />
        <meshStandardMaterial color="#122b1c" roughness={0.7} />
      </mesh>

      {/* East Wall */}
      <mesh position={[5.0, 1.6, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[10.0, 3.2]} />
        <meshStandardMaterial color="#d4c9bd" roughness={0.85} />
      </mesh>
      <mesh position={[4.98, 0.55, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[10.0, 1.1]} />
        <meshStandardMaterial color="#122b1c" roughness={0.7} />
      </mesh>

      {/* North Wall (Exit to Corridor 3 at X: [-0.8, 0.8]) */}
      <mesh position={[-2.9, 1.6, -5.0]} receiveShadow>
        <planeGeometry args={[4.2, 3.2]} />
        <meshStandardMaterial color="#d4c9bd" roughness={0.85} />
      </mesh>
      <mesh position={[-2.9, 0.55, -4.98]}>
        <planeGeometry args={[4.2, 1.1]} />
        <meshStandardMaterial color="#122b1c" roughness={0.7} />
      </mesh>
      <mesh position={[2.9, 1.6, -5.0]} receiveShadow>
        <planeGeometry args={[4.2, 3.2]} />
        <meshStandardMaterial color="#d4c9bd" roughness={0.85} />
      </mesh>
      <mesh position={[2.9, 0.55, -4.98]}>
        <planeGeometry args={[4.2, 1.1]} />
        <meshStandardMaterial color="#122b1c" roughness={0.7} />
      </mesh>
      <mesh position={[0, 2.9, -5.0]} receiveShadow>
        <planeGeometry args={[1.6, 0.6]} />
        <meshStandardMaterial color="#d4c9bd" roughness={0.85} />
      </mesh>

      {/* Central Scholar Desk with Bookcases & Combination Compartment */}
      <LibraryFurniture deskPosition={[0, 0, 0]} />

      {/* Rolling Library Ladder (Leaning against North East Bookcase) */}
      <group position={[3.2, 0, -4.6]} rotation={[0.15, 0, 0]}>
        {/* Left rail */}
        <mesh position={[-0.22, 1.5, 0]} castShadow>
          <boxGeometry args={[0.04, 3.0, 0.08]} />
          <meshStandardMaterial color="#1e0c06" roughness={0.6} />
        </mesh>
        {/* Right rail */}
        <mesh position={[0.22, 1.5, 0]} castShadow>
          <boxGeometry args={[0.04, 3.0, 0.08]} />
          <meshStandardMaterial color="#1e0c06" roughness={0.6} />
        </mesh>
        {/* Rungs */}
        {[0.4, 0.8, 1.2, 1.6, 2.0, 2.4].map((ry, ri) => (
          <mesh key={ri} position={[0, ry, 0]} castShadow>
            <cylinderGeometry args={[0.015, 0.015, 0.44, 8]} />
            <meshStandardMaterial color="#c59b27" metalness={0.8} roughness={0.3} />
          </mesh>
        ))}
        {/* Brass rolling wheel at bottom */}
        {[-0.22, 0.22].map((wx, wi) => (
          <mesh key={wi} position={[wx, 0.05, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.02, 12]} />
            <meshStandardMaterial color="#c59b27" metalness={0.9} roughness={0.2} />
          </mesh>
        ))}
      </group>

      {/* Vintage Terrestrial Globe on Mahogany Stand */}
      <group position={[-3.8, 0, 3.8]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.15, 1.0, 12]} />
          <meshStandardMaterial color="#241108" roughness={0.6} />
        </mesh>
        {/* Brass Axis Ring */}
        <mesh position={[0, 1.1, 0]} rotation={[0.4, 0, 0]}>
          <torusGeometry args={[0.26, 0.015, 8, 24]} />
          <meshStandardMaterial color="#c59b27" metalness={0.85} roughness={0.25} />
        </mesh>
        {/* Sphere globe */}
        <mesh position={[0, 1.1, 0]} castShadow>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshStandardMaterial color="#3d6b52" roughness={0.7} />
        </mesh>
      </group>

      {/* Leather Chesterfield Reading Chair */}
      <group position={[2.6, 0, 1.8]} rotation={[0, -Math.PI / 3, 0]}>
        {/* Seat */}
        <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.8, 0.22, 0.8]} />
          <meshStandardMaterial color="#421a12" roughness={0.5} />
        </mesh>
        {/* Deep Tufted Backrest */}
        <mesh position={[0, 0.88, -0.35]} castShadow>
          <boxGeometry args={[0.8, 0.72, 0.2]} />
          <meshStandardMaterial color="#421a12" roughness={0.5} />
        </mesh>
        {/* Rolled Armrests */}
        {[-0.44, 0.44].map((ax, i) => (
          <mesh key={i} position={[ax, 0.64, 0]} castShadow>
            <cylinderGeometry args={[0.1, 0.1, 0.75, 12]} />
            <meshStandardMaterial color="#35140e" roughness={0.55} />
          </mesh>
        ))}
      </group>

      {/* Candles on Bookshelf Ledges */}
      <Candle position={[-4.5, 1.8, -2.8]} height={0.16} lightIntensity={0.6} />
      <Candle position={[4.5, 1.8, 3.2]} height={0.14} lightIntensity={0.6} />

      {/* Central Brass Chandelier */}
      <group position={[0, 2.7, 0]}>
        <pointLight color="#ffe4b5" intensity={2.2} distance={9.0} decay={2} castShadow />
      </group>
    </group>
  );
};
