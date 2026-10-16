import React from 'react';
import { ConsoleTable } from '../furniture/ConsoleTable';
import { Candle } from '../furniture/Candle';

export const EntranceHall: React.FC = () => {
  return (
    <group position={[0, 0, 0]}>
      {/* --- FLOOR (Warm herringbone oak parquet) --- */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[7.0, 7.0]} />
        <meshStandardMaterial color="#422718" roughness={0.65} metalness={0.1} />
      </mesh>

      {/* Decorative Woven Persian Entry Rug with Gold Fringe */}
      <group position={[0, 0.005, 1.0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[2.4, 3.8]} />
          <meshStandardMaterial color="#6e1a24" roughness={0.8} />
        </mesh>
        {/* Fringes */}
        <mesh position={[0, 0.001, -1.92]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.4, 0.08]} />
          <meshStandardMaterial color="#d4b26f" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.001, 1.92]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.4, 0.08]} />
          <meshStandardMaterial color="#d4b26f" roughness={0.9} />
        </mesh>
      </group>

      {/* --- CEILING WITH CROWN MOLDING --- */}
      <mesh position={[0, 3.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[7.0, 7.0]} />
        <meshStandardMaterial color="#faf6f0" roughness={0.95} />
      </mesh>
      {/* Ceiling Moldings */}
      <mesh position={[0, 3.16, 3.44]}>
        <boxGeometry args={[7.0, 0.08, 0.12]} />
        <meshStandardMaterial color="#e8dfd5" roughness={0.8} />
      </mesh>
      <mesh position={[-3.44, 3.16, 0]}>
        <boxGeometry args={[0.12, 0.08, 7.0]} />
        <meshStandardMaterial color="#e8dfd5" roughness={0.8} />
      </mesh>
      <mesh position={[3.44, 3.16, 0]}>
        <boxGeometry args={[0.12, 0.08, 7.0]} />
        <meshStandardMaterial color="#e8dfd5" roughness={0.8} />
      </mesh>

      {/* --- WALLS (Soft Cream Plaster with Dark Walnut Wainscoting) --- */}
      {/* South Wall (Front door entrance) */}
      <mesh position={[0, 1.6, 3.5]} rotation={[0, Math.PI, 0]} receiveShadow>
        <planeGeometry args={[7.0, 3.2]} />
        <meshStandardMaterial color="#e3d8cc" roughness={0.85} />
      </mesh>
      {/* South Wall Wainscoting */}
      <mesh position={[0, 0.55, 3.48]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[7.0, 1.1]} />
        <meshStandardMaterial color="#2d170e" roughness={0.65} />
      </mesh>

      {/* Grand Front Door (Arrival Portal) */}
      <group position={[0, 1.3, 3.47]} rotation={[0, Math.PI, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.8, 2.6, 0.08]} />
          <meshStandardMaterial color="#26130b" roughness={0.55} />
        </mesh>
        {/* Carved Door Panels */}
        {[-0.45, 0.45].map((dx, i) => (
          <group key={i} position={[dx, 0, 0.045]}>
            <mesh position={[0, 0.55, 0]}>
              <boxGeometry args={[0.65, 0.95, 0.02]} />
              <meshStandardMaterial color="#1f0e08" roughness={0.7} />
            </mesh>
            <mesh position={[0, -0.55, 0]}>
              <boxGeometry args={[0.65, 0.95, 0.02]} />
              <meshStandardMaterial color="#1f0e08" roughness={0.7} />
            </mesh>
          </group>
        ))}
        {/* Brass Lion Knocker */}
        <mesh position={[0, 0.35, 0.06]}>
          <torusGeometry args={[0.07, 0.015, 8, 16]} />
          <meshStandardMaterial color="#e5b842" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* West Wall */}
      <mesh position={[-3.5, 1.6, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[7.0, 3.2]} />
        <meshStandardMaterial color="#e3d8cc" roughness={0.85} />
      </mesh>
      <mesh position={[-3.48, 0.55, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[7.0, 1.1]} />
        <meshStandardMaterial color="#2d170e" roughness={0.65} />
      </mesh>

      {/* East Wall */}
      <mesh position={[3.5, 1.6, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[7.0, 3.2]} />
        <meshStandardMaterial color="#e3d8cc" roughness={0.85} />
      </mesh>
      <mesh position={[3.48, 0.55, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[7.0, 1.1]} />
        <meshStandardMaterial color="#2d170e" roughness={0.65} />
      </mesh>

      {/* North Wall (Opening to Corridor 1 at X: [-1.0, 1.0]) */}
      <mesh position={[-2.25, 1.6, -3.5]} receiveShadow>
        <planeGeometry args={[2.5, 3.2]} />
        <meshStandardMaterial color="#e3d8cc" roughness={0.85} />
      </mesh>
      <mesh position={[-2.25, 0.55, -3.48]}>
        <planeGeometry args={[2.5, 1.1]} />
        <meshStandardMaterial color="#2d170e" roughness={0.65} />
      </mesh>
      <mesh position={[2.25, 1.6, -3.5]} receiveShadow>
        <planeGeometry args={[2.5, 3.2]} />
        <meshStandardMaterial color="#e3d8cc" roughness={0.85} />
      </mesh>
      <mesh position={[2.25, 0.55, -3.48]}>
        <planeGeometry args={[2.5, 1.1]} />
        <meshStandardMaterial color="#2d170e" roughness={0.65} />
      </mesh>
      <mesh position={[0, 2.9, -3.5]} receiveShadow>
        <planeGeometry args={[2.0, 0.6]} />
        <meshStandardMaterial color="#e3d8cc" roughness={0.85} />
      </mesh>

      {/* Console Table on East Wall */}
      <group position={[3.1, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <ConsoleTable position={[0, 0, 0]} />
        {/* Additional Romantic Candle on console */}
        <Candle position={[0.55, 0.84, -0.15]} height={0.14} lightIntensity={0.8} />
      </group>

      {/* Coat Rack & Umbrella Stand on West Wall */}
      <group position={[-2.8, 0, 2.0]}>
        {/* Coat Rack Post */}
        <mesh position={[0, 0.9, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.05, 1.8, 12]} />
          <meshStandardMaterial color="#241109" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.04, 0]} castShadow>
          <cylinderGeometry args={[0.24, 0.28, 0.08, 16]} />
          <meshStandardMaterial color="#241109" roughness={0.6} />
        </mesh>
        {/* Brass Umbrella Cylinder */}
        <mesh position={[0.35, 0.3, 0]} castShadow>
          <cylinderGeometry args={[0.14, 0.12, 0.6, 16]} />
          <meshStandardMaterial color="#c59b27" metalness={0.85} roughness={0.3} />
        </mesh>
        {/* Curved umbrella handle */}
        <mesh position={[0.35, 0.7, 0]} rotation={[0, 0, 0.3]}>
          <cylinderGeometry args={[0.015, 0.015, 0.3, 8]} />
          <meshStandardMaterial color="#40141b" roughness={0.5} />
        </mesh>
      </group>

      {/* Potted Ficus Plant in Corner */}
      <group position={[-2.8, 0, -2.8]}>
        <mesh position={[0, 0.35, 0]} castShadow>
          <cylinderGeometry args={[0.26, 0.2, 0.7, 16]} />
          <meshStandardMaterial color="#ece3d5" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.9, 0]} castShadow>
          <sphereGeometry args={[0.42, 10, 10]} />
          <meshStandardMaterial color="#1b4528" roughness={0.85} />
        </mesh>
      </group>

      {/* Wall Sconces with Ambient Halos */}
      {[-1.5, 1.5].map((sz, i) => (
        <group key={i} position={[-3.44, 2.1, sz]} rotation={[0, Math.PI / 2, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.1, 0.22, 0.08]} />
            <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.25} />
          </mesh>
          <Candle position={[0, 0.05, 0.07]} height={0.12} lightIntensity={0.6} />
        </group>
      ))}

      {/* Central Brass Chandelier with Crystals */}
      <group position={[0, 2.7, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.7, 8]} />
          <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, -0.35, 0]} castShadow>
          <torusGeometry args={[0.5, 0.025, 8, 24]} />
          <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Crystal drops */}
        {[0, 1.05, 2.1, 3.14, 4.19, 5.24].map((ang, ci) => (
          <mesh key={ci} position={[Math.cos(ang) * 0.5, -0.45, Math.sin(ang) * 0.5]}>
            <coneGeometry args={[0.025, 0.08, 6]} />
            <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0.9} transparent opacity={0.7} />
          </mesh>
        ))}
        <pointLight position={[0, -0.35, 0]} color="#ffe0b2" intensity={2.2} distance={7.5} decay={2} castShadow />
      </group>
    </group>
  );
};
