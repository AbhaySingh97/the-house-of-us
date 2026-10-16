import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const AmbientParticles: React.FC = () => {
  const motesRef = useRef<THREE.Points>(null);
  const petalsRef = useRef<THREE.Points>(null);

  // 1. Warm Golden Light Motes across the entire house
  const motesCount = 140;
  const [motePos, moteVel] = useMemo(() => {
    const pos = new Float32Array(motesCount * 3);
    const vel = new Float32Array(motesCount * 3);

    for (let i = 0; i < motesCount; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 26 + 4;
      pos[i * 3 + 1] = Math.random() * 3.0 + 0.3;
      pos[i * 3 + 2] = -Math.random() * 30 + 2;

      vel[i * 3 + 0] = (Math.random() - 0.5) * 0.08;
      vel[i * 3 + 1] = Math.random() * 0.06 + 0.02;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.08;
    }
    return [pos, vel];
  }, []);

  // 2. Floating Rose Petals in Sanctuary and Corridor 4
  const petalCount = 70;
  const [petalPos, petalVel] = useMemo(() => {
    const pos = new Float32Array(petalCount * 3);
    const vel = new Float32Array(petalCount * 3);

    for (let i = 0; i < petalCount; i++) {
      // Centered around Sanctuary (-5.5, -26) and Corridor 4
      pos[i * 3 + 0] = -10.0 + Math.random() * 15;
      pos[i * 3 + 1] = 0.5 + Math.random() * 3.2;
      pos[i * 3 + 2] = -31.0 + Math.random() * 10;

      vel[i * 3 + 0] = (Math.random() - 0.5) * 0.12;
      vel[i * 3 + 1] = -0.15 - Math.random() * 0.1; // Slowly drifts down
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.12;
    }
    return [pos, vel];
  }, []);

  useFrame((_, delta) => {
    // Animate golden motes
    if (motesRef.current) {
      const geo = motesRef.current.geometry;
      const posAttr = geo.attributes.position as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;

      for (let i = 0; i < motesCount; i++) {
        arr[i * 3 + 0] += moteVel[i * 3 + 0] * delta;
        arr[i * 3 + 1] += moteVel[i * 3 + 1] * delta;
        arr[i * 3 + 2] += moteVel[i * 3 + 2] * delta;

        if (arr[i * 3 + 1] > 3.4) {
          arr[i * 3 + 1] = 0.3;
        }
      }
      posAttr.needsUpdate = true;
    }

    // Animate drifting rose petals
    if (petalsRef.current) {
      const geo = petalsRef.current.geometry;
      const posAttr = geo.attributes.position as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;

      for (let i = 0; i < petalCount; i++) {
        arr[i * 3 + 0] += petalVel[i * 3 + 0] * delta;
        arr[i * 3 + 1] += petalVel[i * 3 + 1] * delta;
        arr[i * 3 + 2] += petalVel[i * 3 + 2] * delta;

        // Reset when falling near floor
        if (arr[i * 3 + 1] < 0.2) {
          arr[i * 3 + 1] = 3.2 + Math.random() * 0.6;
          arr[i * 3 + 0] = -10.0 + Math.random() * 15;
          arr[i * 3 + 2] = -31.0 + Math.random() * 10;
        }
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Warm Golden Dust Motes */}
      <points ref={motesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[motePos, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.065}
          color="#ffe2a8"
          transparent
          opacity={0.65}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Drifting Rose Petals in Sanctuary */}
      <points ref={petalsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[petalPos, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.11}
          color="#e03b62"
          transparent
          opacity={0.75}
          blending={THREE.NormalBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
};
