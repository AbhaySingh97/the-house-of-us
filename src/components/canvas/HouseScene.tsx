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

export const HouseScene: React.FC = () => {
  return (
    <>
      {/* Soft Romantic Ambient Lighting */}
      <ambientLight color="#ebdcd0" intensity={0.55} />

      {/* Gentle directional moonlit night tint from sky */}
      <directionalLight 
        position={[10, 15, -15]} 
        color="#c8e4f5" 
        intensity={0.4} 
        castShadow 
      />

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
