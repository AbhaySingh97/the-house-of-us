import React from 'react';
import { MemoryDesk } from '../furniture/MemoryDesk';
import { Fireplace } from '../furniture/Fireplace';
import { Candle } from '../furniture/Candle';

export const MemoryRoom: React.FC = () => {
  return (
    <group position={[0, 0, -10.5]}>
      {/* --- FLOOR (Dark walnut parquet) --- */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[9.0, 9.0]} />
        <meshStandardMaterial color="#301c11" roughness={0.65} metalness={0.1} />
      </mesh>

      {/* Large Warm Crimson Persian Rug with Inset Damask Border */}
      <group position={[0, 0.005, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[5.6, 5.6]} />
          <meshStandardMaterial color="#591420" roughness={0.8} />
        </mesh>
        {/* Inner Gold Medallion */}
        <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.2, 24]} />
          <meshStandardMaterial color="#802130" roughness={0.85} />
        </mesh>
      </group>

      {/* --- COFFERED WOODEN CEILING BEAMS --- */}
      <mesh position={[0, 3.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[9.0, 9.0]} />
        <meshStandardMaterial color="#ece5dc" roughness={0.9} />
      </mesh>
      {/* Transverse and longitudinal dark walnut beams */}
      {[-2.25, 0, 2.25].map((bx) => (
        <mesh key={`bx_${bx}`} position={[bx, 3.14, 0]}>
          <boxGeometry args={[0.16, 0.12, 9.0]} />
          <meshStandardMaterial color="#2d170e" roughness={0.7} />
        </mesh>
      ))}
      {[-2.25, 0, 2.25].map((bz) => (
        <mesh key={`bz_${bz}`} position={[0, 3.14, bz]}>
          <boxGeometry args={[9.0, 0.12, 0.16]} />
          <meshStandardMaterial color="#2d170e" roughness={0.7} />
        </mesh>
      ))}

      {/* --- WALLS (Muted Taupe Plaster with Deep Burgundy Wainscoting) --- */}
      {/* South Wall (Entrance from Corridor 1 at center X: [-0.8, 0.8]) */}
      <mesh position={[-2.65, 1.6, 4.5]} receiveShadow>
        <planeGeometry args={[3.7, 3.2]} />
        <meshStandardMaterial color="#c7baa9" roughness={0.85} />
      </mesh>
      <mesh position={[-2.65, 0.55, 4.48]}>
        <planeGeometry args={[3.7, 1.1]} />
        <meshStandardMaterial color="#42141c" roughness={0.7} />
      </mesh>
      <mesh position={[2.65, 1.6, 4.5]} receiveShadow>
        <planeGeometry args={[3.7, 3.2]} />
        <meshStandardMaterial color="#c7baa9" roughness={0.85} />
      </mesh>
      <mesh position={[2.65, 0.55, 4.48]}>
        <planeGeometry args={[3.7, 1.1]} />
        <meshStandardMaterial color="#42141c" roughness={0.7} />
      </mesh>
      <mesh position={[0, 2.9, 4.5]} receiveShadow>
        <planeGeometry args={[1.6, 0.6]} />
        <meshStandardMaterial color="#c7baa9" roughness={0.85} />
      </mesh>

      {/* North Wall (Solid wall with fireplace) */}
      <mesh position={[0, 1.6, -4.5]} receiveShadow>
        <planeGeometry args={[9.0, 3.2]} />
        <meshStandardMaterial color="#c7baa9" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.55, -4.48]}>
        <planeGeometry args={[9.0, 1.1]} />
        <meshStandardMaterial color="#42141c" roughness={0.7} />
      </mesh>
      {/* Stone Fireplace */}
      <Fireplace position={[0, 0, -4.15]} />

      {/* West Wall (Rainy Window wall with velvet drapes) */}
      <mesh position={[-4.5, 1.6, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[9.0, 3.2]} />
        <meshStandardMaterial color="#c7baa9" roughness={0.85} />
      </mesh>
      <mesh position={[-4.48, 0.55, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[9.0, 1.1]} />
        <meshStandardMaterial color="#42141c" roughness={0.7} />
      </mesh>

      {/* Arch French Window with view of dark starry rain */}
      <group position={[-4.46, 1.8, 0]} rotation={[0, Math.PI / 2, 0]}>
        {/* Dark Walnut Window Frame */}
        <mesh>
          <boxGeometry args={[2.5, 1.9, 0.08]} />
          <meshStandardMaterial color="#2d170e" roughness={0.65} />
        </mesh>
        {/* Glass panes with soft reflective wet sheen */}
        <mesh position={[0, 0, 0.02]}>
          <planeGeometry args={[2.3, 1.7]} />
          <meshStandardMaterial color="#0c1524" roughness={0.15} metalness={0.85} />
        </mesh>
        {/* Burgundy Velvet Curtains flanking window */}
        <mesh position={[-1.3, 0, 0.08]} rotation={[0, 0.2, 0]} castShadow>
          <boxGeometry args={[0.35, 2.1, 0.12]} />
          <meshStandardMaterial color="#55121e" roughness={0.85} />
        </mesh>
        <mesh position={[1.3, 0, 0.08]} rotation={[0, -0.2, 0]} castShadow>
          <boxGeometry args={[0.35, 2.1, 0.12]} />
          <meshStandardMaterial color="#55121e" roughness={0.85} />
        </mesh>
        {/* Soft cool outdoor moonlight glow through glass */}
        <pointLight position={[0, 0, 0.3]} color="#7faedb" intensity={0.9} distance={5} />
      </group>

      {/* East Wall (Doorway to Corridor 2 at Z: [-0.8, 0.8]) */}
      <mesh position={[4.5, 1.6, -2.65]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[3.7, 3.2]} />
        <meshStandardMaterial color="#c7baa9" roughness={0.85} />
      </mesh>
      <mesh position={[4.48, 0.55, -2.65]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[3.7, 1.1]} />
        <meshStandardMaterial color="#42141c" roughness={0.7} />
      </mesh>
      <mesh position={[4.5, 1.6, 2.65]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[3.7, 3.2]} />
        <meshStandardMaterial color="#c7baa9" roughness={0.85} />
      </mesh>
      <mesh position={[4.48, 0.55, 2.65]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[3.7, 1.1]} />
        <meshStandardMaterial color="#42141c" roughness={0.7} />
      </mesh>
      <mesh position={[4.5, 2.9, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[1.6, 0.6]} />
        <meshStandardMaterial color="#c7baa9" roughness={0.85} />
      </mesh>

      {/* Writing Desk with Chapter I Letter & Keepsake Box */}
      <MemoryDesk position={[-1.8, 0, -0.6]} />

      {/* Vintage Velvet Armchair & Footstool */}
      <group position={[-1.8, 0, 1.0]} rotation={[0, Math.PI, 0]}>
        {/* Seat */}
        <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.75, 0.22, 0.75]} />
          <meshStandardMaterial color="#591420" roughness={0.7} />
        </mesh>
        {/* Tufted Backrest */}
        <mesh position={[0, 0.86, -0.32]} castShadow>
          <boxGeometry args={[0.75, 0.7, 0.18]} />
          <meshStandardMaterial color="#591420" roughness={0.7} />
        </mesh>
        {/* Armrests */}
        {[-0.41, 0.41].map((ax, i) => (
          <mesh key={i} position={[ax, 0.62, 0]} castShadow>
            <boxGeometry args={[0.14, 0.32, 0.7]} />
            <meshStandardMaterial color="#470f19" roughness={0.75} />
          </mesh>
        ))}
        {/* Small Velvet Footstool */}
        <mesh position={[0, 0.2, 0.75]} castShadow>
          <boxGeometry args={[0.5, 0.22, 0.4]} />
          <meshStandardMaterial color="#591420" roughness={0.75} />
        </mesh>
      </group>

      {/* Corner Antique Bookshelf */}
      <group position={[3.8, 0, 3.8]} rotation={[0, -Math.PI / 4, 0]}>
        <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.2, 2.4, 0.35]} />
          <meshStandardMaterial color="#2d170e" roughness={0.7} />
        </mesh>
        <Candle position={[0.3, 1.3, 0.1]} height={0.14} lightIntensity={0.5} />
      </group>

      {/* Wall Sconces with warm candle glow */}
      {[-2.5, 2.5].map((wx, i) => (
        <group key={i} position={[wx, 2.1, -4.44]}>
          <mesh castShadow>
            <boxGeometry args={[0.1, 0.24, 0.08]} />
            <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.25} />
          </mesh>
          <Candle position={[0, 0.05, 0.07]} height={0.12} lightIntensity={0.6} />
        </group>
      ))}

      {/* Central Romantic Chandelier */}
      <group position={[0, 2.8, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.6, 8]} />
          <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, -0.3, 0]} castShadow>
          <torusGeometry args={[0.5, 0.025, 8, 24]} />
          <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
        </mesh>
        <pointLight color="#ffe0b2" intensity={1.8} distance={8} decay={2} castShadow />
      </group>
    </group>
  );
};
