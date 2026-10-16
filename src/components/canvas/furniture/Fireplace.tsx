import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Candle } from './Candle';

export const Fireplace: React.FC<{ position: [number, number, number]; rotationY?: number }> = ({
  position,
  rotationY = 0
}) => {
  const lightRef = useRef<THREE.PointLight>(null);
  const flame1Ref = useRef<THREE.Mesh>(null);
  const flame2Ref = useRef<THREE.Mesh>(null);
  const embersRef = useRef<THREE.Points>(null);

  // Subtle natural flame flicker & rising embers
  const emberCount = 20;
  const emberPos = React.useMemo(() => {
    const pos = new Float32Array(emberCount * 3);
    for (let i = 0; i < emberCount; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 0.5;
      pos[i * 3 + 1] = 0.3 + Math.random() * 0.8;
      pos[i * 3 + 2] = 0.05 + Math.random() * 0.2;
    }
    return pos;
  }, []);

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime() * 9;
    const flicker = Math.sin(t) * 0.18 + Math.sin(t * 2.3) * 0.12 + Math.sin(t * 4.7) * 0.06;

    if (lightRef.current) {
      lightRef.current.intensity = 2.6 + flicker;
    }

    if (flame1Ref.current) {
      flame1Ref.current.scale.set(
        1 + flicker * 0.4,
        1 + Math.sin(t * 1.8) * 0.25,
        1 + flicker * 0.4
      );
    }
    if (flame2Ref.current) {
      flame2Ref.current.scale.set(
        1 - flicker * 0.3,
        1 + Math.cos(t * 2.1) * 0.2,
        1 - flicker * 0.3
      );
    }

    // Rise ember sparks
    if (embersRef.current) {
      const geo = embersRef.current.geometry;
      const posAttr = geo.attributes.position as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;

      for (let i = 0; i < emberCount; i++) {
        arr[i * 3 + 1] += 0.8 * delta;
        arr[i * 3 + 0] += Math.sin(t + i) * 0.005;

        if (arr[i * 3 + 1] > 1.3) {
          arr[i * 3 + 1] = 0.3;
          arr[i * 3 + 0] = (Math.random() - 0.5) * 0.5;
        }
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Stone Mantel Structure */}
      {/* Hearth Base */}
      <mesh position={[0, 0.1, 0.4]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.2, 1.0]} />
        <meshStandardMaterial color="#2d2a29" roughness={0.9} />
      </mesh>
      {/* Left Pillar */}
      <mesh position={[-0.8, 1.0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.35, 1.6, 0.5]} />
        <meshStandardMaterial color="#3d3836" roughness={0.85} />
      </mesh>
      {/* Right Pillar */}
      <mesh position={[0.8, 1.0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.35, 1.6, 0.5]} />
        <meshStandardMaterial color="#3d3836" roughness={0.85} />
      </mesh>
      {/* Header Stone */}
      <mesh position={[0, 1.65, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.1, 0.35, 0.52]} />
        <meshStandardMaterial color="#423e3c" roughness={0.85} />
      </mesh>
      {/* Carved Wood Mantelpiece Shelf */}
      <mesh position={[0, 1.88, 0.05]} castShadow receiveShadow>
        <boxGeometry args={[2.35, 0.1, 0.65]} />
        <meshStandardMaterial color="#2c150c" roughness={0.6} />
      </mesh>

      {/* Firebox Interior (Blackened brick cavity) */}
      <mesh position={[0, 0.9, -0.05]}>
        <boxGeometry args={[1.25, 1.2, 0.4]} />
        <meshStandardMaterial color="#140f0e" roughness={1.0} />
      </mesh>

      {/* Burning Wood Logs */}
      {[-0.25, 0, 0.25].map((x, i) => (
        <mesh key={i} position={[x, 0.28, 0.08]} rotation={[0.2 * (i - 1), 0.3 * (i - 1), 1.57]} castShadow>
          <cylinderGeometry args={[0.06, 0.07, 0.65, 8]} />
          <meshStandardMaterial color="#24140d" roughness={0.95} />
        </mesh>
      ))}

      {/* Glowing Embers and Coals */}
      <mesh position={[0, 0.24, 0.05]}>
        <boxGeometry args={[0.7, 0.12, 0.35]} />
        <meshStandardMaterial 
          color="#ff3b00" 
          emissive="#ff4500" 
          emissiveIntensity={3.2} 
          roughness={0.9} 
        />
      </mesh>

      {/* Dynamic Animated Flames */}
      <mesh ref={flame1Ref} position={[-0.08, 0.48, 0.05]}>
        <coneGeometry args={[0.18, 0.48, 8]} />
        <meshBasicMaterial color="#ffaa11" transparent opacity={0.85} />
      </mesh>
      <mesh ref={flame2Ref} position={[0.08, 0.44, 0.08]}>
        <coneGeometry args={[0.15, 0.42, 8]} />
        <meshBasicMaterial color="#ff5500" transparent opacity={0.8} />
      </mesh>

      {/* Rising Ember Sparks */}
      <points ref={embersRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[emberPos, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.035}
          color="#ffcc44"
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Warm Fireplace Light */}
      <pointLight 
        ref={lightRef}
        position={[0, 0.55, 0.35]} 
        color="#ff7722" 
        intensity={2.8} 
        distance={8.0} 
        decay={2} 
        castShadow 
      />

      {/* Mantel Decorations: Antique Clock & Candles */}
      {/* Clock */}
      <group position={[0, 2.08, -0.05]}>
        <mesh castShadow>
          <boxGeometry args={[0.28, 0.32, 0.14]} />
          <meshStandardMaterial color="#2d170e" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.02, 0.075]}>
          <circleGeometry args={[0.09, 16]} />
          <meshStandardMaterial color="#f7ecd7" roughness={0.4} />
        </mesh>
      </group>
      {/* Candles on Mantel */}
      <Candle position={[-0.75, 1.93, 0.05]} height={0.16} lightIntensity={0.6} />
      <Candle position={[0.75, 1.93, 0.05]} height={0.14} lightIntensity={0.6} />

      {/* Framed Romantic Art on Mantel */}
      <group position={[0, 2.55, -0.16]}>
        <mesh castShadow>
          <boxGeometry args={[1.4, 0.95, 0.04]} />
          <meshStandardMaterial color="#b38f29" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.025]}>
          <planeGeometry args={[1.25, 0.8]} />
          <meshStandardMaterial color="#2d1720" roughness={0.8} />
        </mesh>
      </group>
    </group>
  );
};
