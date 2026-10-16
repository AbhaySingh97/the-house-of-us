import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CandleProps {
  position: [number, number, number];
  height?: number;
  hasLight?: boolean;
  lightIntensity?: number;
  lightDistance?: number;
}

export const Candle: React.FC<CandleProps> = ({
  position,
  height = 0.16,
  hasLight = true,
  lightIntensity = 0.6,
  lightDistance = 2.5
}) => {
  const flameRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 7 + (position[0] * 3.1 + position[2] * 2.7);
    const flicker = Math.sin(t) * 0.12 + Math.cos(t * 2.3) * 0.08;

    if (flameRef.current) {
      flameRef.current.scale.set(
        1 + flicker * 0.5,
        1 + Math.sin(t * 1.5) * 0.2,
        1 + flicker * 0.5
      );
    }

    if (lightRef.current) {
      lightRef.current.intensity = lightIntensity * (1 + flicker * 0.35);
    }
  });

  return (
    <group position={position}>
      {/* Wax Pillar */}
      <mesh position={[0, height / 2, 0]} castShadow>
        <cylinderGeometry args={[0.022, 0.025, height, 12]} />
        <meshStandardMaterial color="#fffbe8" roughness={0.5} />
      </mesh>

      {/* Wick */}
      <mesh position={[0, height + 0.015, 0]}>
        <cylinderGeometry args={[0.002, 0.002, 0.03, 6]} />
        <meshBasicMaterial color="#1a110b" />
      </mesh>

      {/* Flickering Flame Teardrop */}
      <mesh ref={flameRef} position={[0, height + 0.038, 0]}>
        <coneGeometry args={[0.014, 0.045, 8]} />
        <meshBasicMaterial color="#ffaa22" />
      </mesh>

      {/* Warm Localized Candlelight */}
      {hasLight && (
        <pointLight
          ref={lightRef}
          position={[0, height + 0.045, 0]}
          color="#ffaa33"
          intensity={lightIntensity}
          distance={lightDistance}
          decay={2}
        />
      )}
    </group>
  );
};
