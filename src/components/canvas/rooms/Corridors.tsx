import React from 'react';
import { Door } from '../furniture/Door';

export const Corridors: React.FC = () => {
  return (
    <group>
      {/* =====================================================================
          CORRIDOR 1: Entrance Hall to Memory Room
          Z: [-6.0, -3.5], X: [-1.0, 1.0]
      ===================================================================== */}
      <group>
        {/* Floor */}
        <mesh position={[0, 0, -4.75]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[2.0, 2.5]} />
          <meshStandardMaterial color="#4a2e1b" roughness={0.65} />
        </mesh>
        {/* Ceiling */}
        <mesh position={[0, 3.2, -4.75]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.0, 2.5]} />
          <meshStandardMaterial color="#f7f3ed" roughness={0.9} />
        </mesh>
        {/* West Wall */}
        <mesh position={[-1.0, 1.6, -4.75]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
          <planeGeometry args={[2.5, 3.2]} />
          <meshStandardMaterial color="#d9cec1" roughness={0.8} />
        </mesh>
        {/* East Wall */}
        <mesh position={[1.0, 1.6, -4.75]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
          <planeGeometry args={[2.5, 3.2]} />
          <meshStandardMaterial color="#d9cec1" roughness={0.8} />
        </mesh>
        {/* Hallway Sconce */}
        <pointLight position={[0, 2.4, -4.75]} color="#ffe0b2" intensity={1.2} distance={4} />

        {/* DOOR 1: Door to Memory Room */}
        <Door 
          id={1} 
          position={[0, 0, -6.0]} 
          rotationY={0} 
          width={1.6} 
          height={2.6} 
          label="Door to the Memory Room" 
        />
      </group>

      {/* =====================================================================
          CORRIDOR 2: Memory Room to Secret Library (East Gallery)
          X: [4.5, 9.5], Z: [-11.4, -9.6]
      ===================================================================== */}
      <group>
        {/* Floor */}
        <mesh position={[7.0, 0, -10.5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[5.0, 1.8]} />
          <meshStandardMaterial color="#352014" roughness={0.65} />
        </mesh>
        {/* Runner Rug */}
        <mesh position={[7.0, 0.005, -10.5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[4.4, 1.1]} />
          <meshStandardMaterial color="#551a24" roughness={0.85} />
        </mesh>
        {/* Ceiling */}
        <mesh position={[7.0, 3.2, -10.5]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[5.0, 1.8]} />
          <meshStandardMaterial color="#f0eae1" roughness={0.9} />
        </mesh>
        {/* North Wall */}
        <mesh position={[7.0, 1.6, -11.4]} receiveShadow>
          <planeGeometry args={[5.0, 3.2]} />
          <meshStandardMaterial color="#c2b6a7" roughness={0.8} />
        </mesh>
        {/* South Wall */}
        <mesh position={[7.0, 1.6, -9.6]} rotation={[0, Math.PI, 0]} receiveShadow>
          <planeGeometry args={[5.0, 3.2]} />
          <meshStandardMaterial color="#c2b6a7" roughness={0.8} />
        </mesh>
        {/* Gallery Sconce */}
        <pointLight position={[7.0, 2.4, -10.5]} color="#ffe0b2" intensity={1.4} distance={4.5} />

        {/* DOOR 2: Door to Secret Library */}
        <Door 
          id={2} 
          position={[4.5, 0, -10.5]} 
          rotationY={Math.PI / 2} 
          width={1.6} 
          height={2.6} 
          label="Door to the Secret Library" 
        />
      </group>

      {/* =====================================================================
          CORRIDOR 3: Secret Library to Indoor Garden (Verdant Passage)
          Z: [-19.5, -15.5], X: [13.6, 15.4]
      ===================================================================== */}
      <group>
        {/* Floor */}
        <mesh position={[14.5, 0, -17.5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[1.8, 4.0]} />
          <meshStandardMaterial color="#2d332a" roughness={0.85} />
        </mesh>
        {/* Ceiling */}
        <mesh position={[14.5, 3.2, -17.5]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.8, 4.0]} />
          <meshStandardMaterial color="#e8dfd5" roughness={0.9} />
        </mesh>
        {/* West Wall */}
        <mesh position={[13.6, 1.6, -17.5]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
          <planeGeometry args={[4.0, 3.2]} />
          <meshStandardMaterial color="#353f33" roughness={0.85} />
        </mesh>
        {/* East Wall */}
        <mesh position={[15.4, 1.6, -17.5]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
          <planeGeometry args={[4.0, 3.2]} />
          <meshStandardMaterial color="#353f33" roughness={0.85} />
        </mesh>
        {/* Passage Sconce */}
        <pointLight position={[14.5, 2.4, -17.5]} color="#b8e2f2" intensity={1.2} distance={4.5} />

        {/* DOOR 3: Door to Conservatory */}
        <Door 
          id={3} 
          position={[14.5, 0, -15.5]} 
          rotationY={0} 
          width={1.6} 
          height={2.6} 
          label="Door to the Conservatory" 
        />
      </group>

      {/* =====================================================================
          CORRIDOR 4: Conservatory to The Sanctuary (Corridor of Petals)
          X: [1.0, 8.5], Z: [-27.2, -24.8]
      ===================================================================== */}
      <group>
        {/* Floor: Polished Italian Marble */}
        <mesh position={[4.75, 0, -26.0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[7.5, 2.4]} />
          <meshStandardMaterial color="#f7f4ee" roughness={0.3} metalness={0.1} />
        </mesh>
        {/* Rose Petals scattered down corridor */}
        {Array.from({ length: 30 }).map((_, i) => {
          const px = 1.4 + (i / 30) * 6.8;
          const pz = -26.0 + (Math.sin(i * 1.5) * 0.7);
          return (
            <mesh key={i} position={[px, 0.008, pz]} rotation={[-Math.PI / 2, 0, i * 0.6]}>
              <planeGeometry args={[0.08, 0.05]} />
              <meshStandardMaterial color="#b3122c" roughness={0.6} />
            </mesh>
          );
        })}
        {/* Ceiling */}
        <mesh position={[4.75, 3.6, -26.0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[7.5, 2.4]} />
          <meshStandardMaterial color="#fcf8f2" roughness={0.9} />
        </mesh>
        {/* North Wall */}
        <mesh position={[4.75, 1.8, -27.2]} receiveShadow>
          <planeGeometry args={[7.5, 3.6]} />
          <meshStandardMaterial color="#d4c2be" roughness={0.75} />
        </mesh>
        {/* South Wall */}
        <mesh position={[4.75, 1.8, -24.8]} rotation={[0, Math.PI, 0]} receiveShadow>
          <planeGeometry args={[7.5, 3.6]} />
          <meshStandardMaterial color="#d4c2be" roughness={0.75} />
        </mesh>
        {/* Warm Petal Corridor Sconces */}
        <pointLight position={[3.0, 2.4, -26.0]} color="#ffd6e0" intensity={1.5} distance={5} />
        <pointLight position={[6.5, 2.4, -26.0]} color="#ffd6e0" intensity={1.5} distance={5} />

        {/* DOOR 4: Grand Double Doors to Sanctuary */}
        <Door 
          id={4} 
          position={[8.5, 0, -26.0]} 
          rotationY={-Math.PI / 2} 
          width={2.4} 
          height={2.8} 
          isDouble={true}
          label="Grand Doors to the Sanctuary" 
        />
      </group>
    </group>
  );
};
