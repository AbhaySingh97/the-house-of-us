import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SanctuaryPedestal } from '../furniture/SanctuaryPedestal';
import { Candle } from '../furniture/Candle';
import { useGameStore } from '../../../state/gameStore';

export const SanctuaryRoom: React.FC = () => {
  const { flags } = useGameStore();
  const domeLightRef = useRef<THREE.PointLight>(null);
  const fairyStarRef = useRef<THREE.Group>(null);

  // Dynamic ambient brightening and fairy light twinkle
  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();
    if (domeLightRef.current) {
      const targetIntensity = flags.finalPuzzleSolved ? 4.2 : 2.2;
      domeLightRef.current.intensity = THREE.MathUtils.lerp(
        domeLightRef.current.intensity,
        targetIntensity,
        1 - Math.exp(-4 * delta)
      );
    }

    if (fairyStarRef.current) {
      fairyStarRef.current.rotation.y = t * 0.03;
    }
  });

  return (
    <group position={[-5.5, 0, -26.0]}>
      {/* --- FLOOR (Polished White Italian Carrara Marble) --- */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[13.0, 13.0]} />
        <meshStandardMaterial color="#faf7f2" roughness={0.18} metalness={0.2} />
      </mesh>

      {/* Concentric Rose Gold Inlay Rings in Marble */}
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[2.75, 2.85, 48]} />
        <meshStandardMaterial color="#e59870" metalness={0.9} roughness={0.15} />
      </mesh>
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[4.45, 4.55, 48]} />
        <meshStandardMaterial color="#e59870" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* --- DENSE RED ROSE PETAL CEREMONIAL AISLE --- */}
      {Array.from({ length: 60 }).map((_, i) => {
        // Line from X = 5.5 (entrance) to X = 0 (center pedestal)
        const px = 5.4 - (i / 60) * 5.1;
        const pz = (Math.sin(i * 1.6) * 0.55);
        const color = i % 3 === 0 ? "#8c0d22" : i % 3 === 1 ? "#bd1534" : "#e03b62";
        return (
          <mesh key={i} position={[px, 0.01, pz]} rotation={[-Math.PI / 2, 0, i * 0.8]}>
            <planeGeometry args={[0.1, 0.06]} />
            <meshStandardMaterial color={color} roughness={0.65} />
          </mesh>
        );
      })}

      {/* --- GRAND ROMANTIC DOME CEILING WITH FAIRY STAR CANOPY --- */}
      <mesh position={[0, 4.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[13.0, 13.0]} />
        <meshStandardMaterial color="#fdfbf7" roughness={0.9} />
      </mesh>

      {/* Hanging Starry Fairy Lights Canopy */}
      <group ref={fairyStarRef} position={[0, 3.8, 0]}>
        {Array.from({ length: 32 }).map((_, si) => {
          const angle = (si / 32) * Math.PI * 2;
          const r = 1.0 + (si % 4) * 0.8;
          const sx = Math.cos(angle) * r;
          const sz = Math.sin(angle) * r;
          const dropY = -0.3 - (si % 5) * 0.18;
          return (
            <group key={si} position={[sx, dropY, sz]}>
              {/* Thin golden wire */}
              <mesh position={[0, -dropY / 2, 0]}>
                <cylinderGeometry args={[0.002, 0.002, -dropY, 4]} />
                <meshBasicMaterial color="#d4af37" />
              </mesh>
              {/* Star Light droplet */}
              <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[0.025, 8, 8]} />
                <meshBasicMaterial color="#fff0d0" />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* --- WALLS (Champagne & Soft Blush Velvet Damask) --- */}
      {/* East Wall (Entrance from Corridor 4 at center Z: [-1.2, 1.2]) */}
      <mesh position={[6.5, 2.1, -3.9]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[5.2, 4.2]} />
        <meshStandardMaterial color="#d9c7c2" roughness={0.7} />
      </mesh>
      <mesh position={[6.48, 0.65, -3.9]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[5.2, 1.3]} />
        <meshStandardMaterial color="#661928" roughness={0.65} />
      </mesh>
      <mesh position={[6.5, 2.1, 3.9]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[5.2, 4.2]} />
        <meshStandardMaterial color="#d9c7c2" roughness={0.7} />
      </mesh>
      <mesh position={[6.48, 0.65, 3.9]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[5.2, 1.3]} />
        <meshStandardMaterial color="#661928" roughness={0.65} />
      </mesh>
      <mesh position={[6.5, 3.6, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[2.6, 1.2]} />
        <meshStandardMaterial color="#d9c7c2" roughness={0.7} />
      </mesh>

      {/* West Wall */}
      <mesh position={[-6.5, 2.1, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[13.0, 4.2]} />
        <meshStandardMaterial color="#d9c7c2" roughness={0.7} />
      </mesh>
      <mesh position={[-6.48, 0.65, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[13.0, 1.3]} />
        <meshStandardMaterial color="#661928" roughness={0.65} />
      </mesh>

      {/* North Wall */}
      <mesh position={[0, 2.1, -6.5]} receiveShadow>
        <planeGeometry args={[13.0, 4.2]} />
        <meshStandardMaterial color="#d9c7c2" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.65, -6.48]}>
        <planeGeometry args={[13.0, 1.3]} />
        <meshStandardMaterial color="#661928" roughness={0.65} />
      </mesh>

      {/* South Wall */}
      <mesh position={[0, 2.1, 6.5]} rotation={[0, Math.PI, 0]} receiveShadow>
        <planeGeometry args={[13.0, 4.2]} />
        <meshStandardMaterial color="#d9c7c2" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.65, 6.48]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[13.0, 1.3]} />
        <meshStandardMaterial color="#661928" roughness={0.65} />
      </mesh>

      {/* --- ORNATE MARBLE CANDELABRA COLUMNS IN CORNERS --- */}
      {[
        [-5.2, -5.2],
        [5.2, -5.2],
        [-5.2, 5.2],
        [5.2, 5.2]
      ].map(([cx, cz], i) => (
        <group key={i} position={[cx, 0, cz]}>
          <mesh position={[0, 1.1, 0]} castShadow>
            <cylinderGeometry args={[0.22, 0.28, 2.2, 20]} />
            <meshStandardMaterial color="#faf4ed" roughness={0.3} metalness={0.1} />
          </mesh>
          <Candle position={[0, 2.2, 0]} height={0.2} lightIntensity={0.8} />
          <Candle position={[-0.1, 2.2, 0]} height={0.15} lightIntensity={0.6} />
          <Candle position={[0.1, 2.2, 0]} height={0.17} lightIntensity={0.6} />
        </group>
      ))}

      {/* Floral Urns flanking the East Entrance Doorway */}
      {[
        [5.5, 0, -1.8],
        [5.5, 0, 1.8]
      ].map(([ux, uy, uz], ui) => (
        <group key={ui} position={[ux, uy, uz]}>
          <mesh position={[0, 0.45, 0]} castShadow>
            <cylinderGeometry args={[0.25, 0.16, 0.9, 16]} />
            <meshStandardMaterial color="#faf4ed" roughness={0.35} />
          </mesh>
          <mesh position={[0, 1.05, 0]} castShadow>
            <sphereGeometry args={[0.35, 10, 10]} />
            <meshStandardMaterial color="#e03b62" roughness={0.6} />
          </mesh>
        </group>
      ))}

      {/* Central Marble Pedestal & Celestial Keepsake Chest */}
      <SanctuaryPedestal position={[0, 0, 0]} />

      {/* Celestial Dome Chandelier Light */}
      <group position={[0, 3.8, 0]}>
        <pointLight 
          ref={domeLightRef}
          color={flags.finalPuzzleSolved ? "#ffd6e4" : "#ffe8d0"} 
          intensity={2.4} 
          distance={15} 
          decay={2} 
          castShadow 
        />
      </group>
    </group>
  );
};
