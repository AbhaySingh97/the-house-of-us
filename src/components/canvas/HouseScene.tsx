import React, { Suspense } from 'react';
import { EntranceHall } from './rooms/EntranceHall';
import { MemoryRoom } from './rooms/MemoryRoom';
import { SecretLibrary } from './rooms/SecretLibrary';
import { IndoorGarden } from './rooms/IndoorGarden';
import { SanctuaryRoom } from './rooms/SanctuaryRoom';
import { Corridors } from './rooms/Corridors';
import { AmbientParticles } from './environment/AmbientParticles';
import { RainEffect } from './environment/RainEffect';
import { PlayerController } from './PlayerController';

import { useGameStore } from '../../state/gameStore';

export const HouseScene: React.FC = () => {
  const { settings } = useGameStore();

  return (
    <>
      {/* Warm Romantic Sky / Ground Hemisphere Lighting */}
      <hemisphereLight 
        color="#fffaf2" 
        groundColor="#dfcfbe" 
        intensity={0.95} 
      />

      {/* Base Warm Ambient Illumination - prevents pitch-dark corners */}
      <ambientLight color="#fff3e8" intensity={0.7} />

      {/* Key Warm Directional Sunlight / Moonlight */}
      <directionalLight 
        position={[8, 16, -12]} 
        color="#fff4e6" 
        intensity={0.85} 
        castShadow={settings.quality !== 'low'} 
        shadow-mapSize-width={1024} 
        shadow-mapSize-height={1024} 
        shadow-bias={-0.0001} 
      />

      {/* Global Environmental Fill Lights across room junctions */}
      <pointLight position={[0, 2.5, -1.0]} color="#ffe6cc" intensity={1.2} distance={8} decay={1.3} />
      <pointLight position={[0, 2.6, -10.5]} color="#ffe2c8" intensity={1.4} distance={9} decay={1.3} />
      <pointLight position={[10.0, 2.5, -10.5]} color="#ffe6cc" intensity={1.2} distance={8} decay={1.3} />
      <pointLight position={[14.5, 2.5, -20.0]} color="#e0f0fa" intensity={1.2} distance={8} decay={1.3} />
      <pointLight position={[0.5, 2.8, -26.0]} color="#ffe8f0" intensity={1.5} distance={10} decay={1.3} />

      <Suspense fallback={null}>
        {/* All connected rooms of the house */}
        <EntranceHall />
        <MemoryRoom />
        <SecretLibrary />
        <IndoorGarden />
        <SanctuaryRoom />
        <Corridors />

        {/* Ambient atmospheric particles & outdoor rain */}
        <AmbientParticles />
        <RainEffect />

        {/* First-person player controller with collisions */}
        <PlayerController initialPosition={[0, 1.65, 2.2]} />
      </Suspense>
    </>
  );
};
