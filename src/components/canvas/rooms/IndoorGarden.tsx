import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GardenFountain } from '../furniture/GardenFountain';

export const IndoorGarden: React.FC = () => {
  const fairyLightsRef = useRef<THREE.Group>(null);

  // Subtle floating firefly sparkle
  useFrame(({ clock }) => {
    if (fairyLightsRef.current) {
      const t = clock.getElapsedTime();
      fairyLightsRef.current.position.y = Math.sin(t * 1.5) * 0.05;
    }
  });

  return (
    <group position={[14.5, 0, -26.0]}>
      {/* --- FLOOR (Warm natural limestone flagstones with soft moss sheen) --- */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[12.0, 13.0]} />
        <meshStandardMaterial color="#8a8274" roughness={0.65} metalness={0.1} />
      </mesh>

      {/* Decorative center circular stone roundel with moss trim */}
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[2.7, 32]} />
        <meshStandardMaterial color="#aba89f" roughness={0.7} />
      </mesh>

      {/* Flagstone Stepping Path to Grand Doors (West) */}
      {[-1.8, -2.6, -3.4, -4.2, -5.0].map((px, pi) => (
        <mesh key={pi} position={[px, 0.008, 0]} rotation={[-Math.PI / 2, 0, 0.1 * pi]} receiveShadow>
          <planeGeometry args={[0.7, 1.2]} />
          <meshStandardMaterial color="#b5b2a7" roughness={0.75} />
        </mesh>
      ))}

      {/* --- CONSERVATORY GLASS CEILING & BEAMS --- */}
      <group position={[0, 3.8, 0]}>
        {/* Wrought Iron Arched Greenhouse Beams */}
        {[-4.5, -2.25, 0, 2.25, 4.5].map((rx) => (
          <mesh key={rx} position={[rx, 0, 0]}>
            <boxGeometry args={[0.1, 0.16, 13.0]} />
            <meshStandardMaterial color="#354533" metalness={0.7} roughness={0.4} />
          </mesh>
        ))}
        {/* Glass Skylight Panes */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[12.0, 13.0]} />
          <meshStandardMaterial 
            color="#d0eaf5" 
            roughness={0.08} 
            metalness={0.3} 
            transparent 
            opacity={0.35} 
          />
        </mesh>
      </group>

      {/* Hanging Ivy & Floral Vines from Overhead Beams */}
      {[-3.0, 0, 3.0].map((vx, i) =>
        [-3.5, 0, 3.5].map((vz, j) => (
          <group key={`${i}_${j}`} position={[vx, 3.7, vz]}>
            <mesh position={[0, -0.4, 0]}>
              <cylinderGeometry args={[0.08, 0.2, 0.8, 6]} />
              <meshStandardMaterial color="#2d6935" roughness={0.8} />
            </mesh>
            {/* Small hanging flower buds */}
            <mesh position={[0, -0.85, 0]}>
              <sphereGeometry args={[0.06, 6, 6]} />
              <meshStandardMaterial color="#ff77aa" roughness={0.7} />
            </mesh>
          </group>
        ))
      )}

      {/* --- WALLS --- */}
      {/* South Wall (Entrance from Corridor 3 at center X: [-0.8, 0.8]) */}
      <mesh position={[-3.4, 1.8, 6.5]} receiveShadow>
        <planeGeometry args={[5.2, 3.6]} />
        <meshStandardMaterial color="#495745" roughness={0.8} />
      </mesh>
      <mesh position={[3.4, 1.8, 6.5]} receiveShadow>
        <planeGeometry args={[5.2, 3.6]} />
        <meshStandardMaterial color="#495745" roughness={0.8} />
      </mesh>
      <mesh position={[0, 3.2, 6.5]} receiveShadow>
        <planeGeometry args={[1.6, 0.8]} />
        <meshStandardMaterial color="#495745" roughness={0.8} />
      </mesh>

      {/* North Wall: Grand Conservatory Glass Wall Overlooking Moonlit Rain */}
      <group position={[0, 1.8, -6.5]}>
        <mesh position={[0, -1.0, 0]}>
          <boxGeometry args={[12.0, 1.6, 0.2]} />
          <meshStandardMaterial color="#354533" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.5, 0]}>
          <planeGeometry args={[12.0, 2.0]} />
          <meshStandardMaterial color="#102030" roughness={0.12} metalness={0.8} transparent opacity={0.75} />
        </mesh>
      </group>

      {/* East Wall: Greenhouse Glass Wall */}
      <group position={[6.0, 1.8, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh position={[0, -1.0, 0]}>
          <boxGeometry args={[13.0, 1.6, 0.2]} />
          <meshStandardMaterial color="#354533" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.5, 0]}>
          <planeGeometry args={[13.0, 2.0]} />
          <meshStandardMaterial color="#102030" roughness={0.12} metalness={0.8} transparent opacity={0.75} />
        </mesh>
      </group>

      {/* West Wall: Grand Double Doorway to Corridor 4 at center Z: [-1.3, 1.3] */}
      <mesh position={[-6.0, 1.8, -3.9]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[5.2, 3.6]} />
        <meshStandardMaterial color="#495745" roughness={0.8} />
      </mesh>
      <mesh position={[-6.0, 1.8, 3.9]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[5.2, 3.6]} />
        <meshStandardMaterial color="#495745" roughness={0.8} />
      </mesh>
      <mesh position={[-6.0, 3.2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[2.6, 0.8]} />
        <meshStandardMaterial color="#495745" roughness={0.8} />
      </mesh>

      {/* --- LUSH BLOOMING ROSE BUSHES & PLANTERS --- */}
      {[
        [-4.8, 0, -5.2],
        [-2.4, 0, -5.6],
        [2.4, 0, -5.6],
        [4.8, 0, -5.2],
        [5.3, 0, -2.6],
        [5.3, 0, 2.6],
        [-4.8, 0, 5.2],
        [4.8, 0, 5.2],
      ].map(([px, py, pz], i) => (
        <group key={i} position={[px, py, pz]}>
          {/* Terracotta Planter */}
          <mesh position={[0, 0.35, 0]} castShadow>
            <cylinderGeometry args={[0.32, 0.24, 0.7, 16]} />
            <meshStandardMaterial color="#8a442e" roughness={0.8} />
          </mesh>
          {/* Bush foliage */}
          <mesh position={[0, 0.95, 0]} castShadow>
            <sphereGeometry args={[0.5, 12, 12]} />
            <meshStandardMaterial color="#214d2a" roughness={0.85} />
          </mesh>
          {/* Pink and Red Rose Petals */}
          {[0, 1.25, 2.5, 3.75, 5.0].map((ang, fi) => (
            <mesh 
              key={fi} 
              position={[Math.cos(ang) * 0.4, 1.1 + (fi % 2) * 0.16, Math.sin(ang) * 0.4]}
            >
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshStandardMaterial color={fi % 2 === 0 ? "#e03b62" : "#ff8da1"} roughness={0.5} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Centerpiece Fountain & 4 Interactive Lanterns */}
      <GardenFountain center={[0, 0, 0]} />

      {/* Gentle Floating Fireflies / Fairy Lights in Conservatory */}
      <group ref={fairyLightsRef}>
        {[
          [-2.2, 2.1, -1.8],
          [2.5, 2.3, 1.5],
          [-1.5, 1.9, 2.4],
          [1.8, 2.4, -2.2]
        ].map(([fx, fy, fz], fi) => (
          <group key={fi} position={[fx, fy, fz]}>
            <mesh>
              <sphereGeometry args={[0.025, 6, 6]} />
              <meshBasicMaterial color="#a8ff99" />
            </mesh>
            <pointLight color="#a8ff99" intensity={0.5} distance={1.8} />
          </group>
        ))}
      </group>

      {/* Atmospheric Moonlit Skylight Glow */}
      <pointLight position={[0, 3.5, 0]} color="#d6eef8" intensity={2.2} distance={15} decay={1.3} />
    </group>
  );
};
