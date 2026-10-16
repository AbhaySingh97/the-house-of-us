import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const RainEffect: React.FC = () => {
  const rainRef = useRef<THREE.Points>(null);
  const count = 400; // Efficient count for fast mobile & desktop 60fps

  // Distribute rain streaks primarily outside windows & greenhouse
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // 50% outside conservatory greenhouse, 50% outside west window/perimeter
      if (i % 2 === 0) {
        // Outside Conservatory (X: 8 to 22, Z: -34 to -18, Y: 1 to 9)
        pos[i * 3 + 0] = 7.5 + Math.random() * 15;
        pos[i * 3 + 1] = Math.random() * 8 + 0.5;
        pos[i * 3 + 2] = -34 + Math.random() * 16;
      } else {
        // Outside Memory Room West Window (X: -8 to -4.6, Z: -16 to -6, Y: 1 to 7)
        pos[i * 3 + 0] = -8.5 + Math.random() * 3.8;
        pos[i * 3 + 1] = Math.random() * 8 + 0.5;
        pos[i * 3 + 2] = -16 + Math.random() * 11;
      }

      vel[i * 3 + 0] = -0.6; // Slight wind slant towards west
      vel[i * 3 + 1] = -12.0 - Math.random() * 4.0; // Fast downward rain speed
      vel[i * 3 + 2] = -0.3;
    }

    return [pos, vel];
  }, []);

  useFrame((_, delta) => {
    if (!rainRef.current) return;
    const geo = rainRef.current.geometry;
    const posAttr = geo.attributes.position as THREE.BufferAttribute;
    const posArray = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      posArray[i * 3 + 0] += velocities[i * 3 + 0] * delta;
      posArray[i * 3 + 1] += velocities[i * 3 + 1] * delta;
      posArray[i * 3 + 2] += velocities[i * 3 + 2] * delta;

      // Reset when hitting the ground
      if (posArray[i * 3 + 1] < 0.1) {
        posArray[i * 3 + 1] = 7.5 + Math.random() * 2.0;
        // Keep within outdoor zones
        if (i % 2 === 0) {
          posArray[i * 3 + 0] = 7.5 + Math.random() * 15;
          posArray[i * 3 + 2] = -34 + Math.random() * 16;
        } else {
          posArray[i * 3 + 0] = -8.5 + Math.random() * 3.8;
          posArray[i * 3 + 2] = -16 + Math.random() * 11;
        }
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={rainRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.09}
        color="#a5c8e4"
        transparent
        opacity={0.45}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};
