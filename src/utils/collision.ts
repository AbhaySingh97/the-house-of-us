import type { RoomId } from '../types';

export interface BoxCollider {
  id: string;
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

export interface CylinderCollider {
  id: string;
  x: number;
  z: number;
  radius: number;
}

// Static walls of the interconnected house
export const STATIC_WALLS: BoxCollider[] = [
  // --- ENTRANCE HALL ---
  { id: 'ent_s', minX: -3.8, maxX: 3.8, minZ: 3.4, maxZ: 3.8 }, // South wall
  { id: 'ent_w', minX: -3.8, maxX: -3.4, minZ: -3.8, maxZ: 3.8 }, // West wall
  { id: 'ent_e', minX: 3.4, maxX: 3.8, minZ: -3.8, maxZ: 3.8 }, // East wall
  { id: 'ent_n_l', minX: -3.8, maxX: -1.0, minZ: -3.8, maxZ: -3.4 }, // North left
  { id: 'ent_n_r', minX: 1.0, maxX: 3.8, minZ: -3.8, maxZ: -3.4 }, // North right

  // --- CORRIDOR 1 ---
  { id: 'c1_w', minX: -1.3, maxX: -1.0, minZ: -6.2, maxZ: -3.5 },
  { id: 'c1_e', minX: 1.0, maxX: 1.3, minZ: -6.2, maxZ: -3.5 },

  // --- MEMORY ROOM ---
  { id: 'mem_s_l', minX: -4.8, maxX: -0.9, minZ: -6.3, maxZ: -5.9 },
  { id: 'mem_s_r', minX: 0.9, maxX: 4.8, minZ: -6.3, maxZ: -5.9 },
  { id: 'mem_w', minX: -4.8, maxX: -4.4, minZ: -15.3, maxZ: -6.0 },
  { id: 'mem_n', minX: -4.8, maxX: 4.8, minZ: -15.4, maxZ: -15.0 },
  { id: 'mem_e_n', minX: 4.4, maxX: 4.8, minZ: -15.3, maxZ: -11.4 },
  { id: 'mem_e_s', minX: 4.4, maxX: 4.8, minZ: -9.6, maxZ: -6.0 },

  // --- CORRIDOR 2 ---
  { id: 'c2_n', minX: 4.5, maxX: 9.6, minZ: -11.7, maxZ: -11.3 },
  { id: 'c2_s', minX: 4.5, maxX: 9.6, minZ: -9.7, maxZ: -9.3 },

  // --- SECRET LIBRARY ---
  { id: 'lib_w_s', minX: 9.3, maxX: 9.7, minZ: -9.6, maxZ: -5.3 },
  { id: 'lib_w_n', minX: 9.3, maxX: 9.7, minZ: -15.8, maxZ: -11.4 },
  { id: 'lib_s', minX: 9.3, maxX: 19.8, minZ: -5.7, maxZ: -5.3 },
  { id: 'lib_e', minX: 19.4, maxX: 19.8, minZ: -15.8, maxZ: -5.4 },
  { id: 'lib_n_l', minX: 9.3, maxX: 13.6, minZ: -15.8, maxZ: -15.4 },
  { id: 'lib_n_r', minX: 15.4, maxX: 19.8, minZ: -15.8, maxZ: -15.4 },

  // --- CORRIDOR 3 ---
  { id: 'c3_w', minX: 13.3, maxX: 13.7, minZ: -19.7, maxZ: -15.5 },
  { id: 'c3_e', minX: 15.3, maxX: 15.7, minZ: -19.7, maxZ: -15.5 },

  // --- CONSERVATORY / GARDEN ---
  { id: 'con_s_l', minX: 8.3, maxX: 13.6, minZ: -19.8, maxZ: -19.4 },
  { id: 'con_s_r', minX: 15.4, maxX: 20.8, minZ: -19.8, maxZ: -19.4 },
  { id: 'con_n', minX: 8.3, maxX: 20.8, minZ: -32.8, maxZ: -32.4 },
  { id: 'con_e', minX: 20.4, maxX: 20.8, minZ: -32.8, maxZ: -19.5 },
  { id: 'con_w_n', minX: 8.3, maxX: 8.7, minZ: -32.8, maxZ: -27.3 },
  { id: 'con_w_s', minX: 8.3, maxX: 8.7, minZ: -24.7, maxZ: -19.5 },

  // --- CORRIDOR 4 ---
  { id: 'c4_n', minX: 0.8, maxX: 8.6, minZ: -27.5, maxZ: -27.1 },
  { id: 'c4_s', minX: 0.8, maxX: 8.6, minZ: -24.9, maxZ: -24.5 },

  // --- SANCTUARY OF US ---
  { id: 'sanc_e_n', minX: 0.8, maxX: 1.2, minZ: -32.8, maxZ: -27.2 },
  { id: 'sanc_e_s', minX: 0.8, maxX: 1.2, minZ: -24.8, maxZ: -19.3 },
  { id: 'sanc_n', minX: -12.3, maxX: 1.2, minZ: -32.8, maxZ: -32.4 },
  { id: 'sanc_s', minX: -12.3, maxX: 1.2, minZ: -19.7, maxZ: -19.3 },
  { id: 'sanc_w', minX: -12.3, maxX: -11.9, minZ: -32.8, maxZ: -19.4 },
];

// Obstacles like the Central Fountain in the conservatory and pedestal in sanctuary
export const STATIC_CYLINDERS: CylinderCollider[] = [
  { id: 'fountain', x: 14.5, z: -26.0, radius: 1.6 },
  { id: 'sanctuary_pedestal', x: -5.5, z: -26.0, radius: 1.2 }
];

// Door collision boxes when doors are CLOSED
export const DOOR_COLLIDERS = {
  door1: { id: 'door_1', minX: -0.9, maxX: 0.9, minZ: -6.15, maxZ: -5.85 },
  door2: { id: 'door_2', minX: 4.45, maxX: 4.75, minZ: -11.3, maxZ: -9.7 },
  door3: { id: 'door_3', minX: 13.6, maxX: 15.4, minZ: -15.65, maxZ: -15.35 },
  door4: { id: 'door_4', minX: 8.45, maxX: 8.75, minZ: -27.2, maxZ: -24.8 },
};

/**
 * Resolves player motion with smooth sliding along wall boundaries.
 */
export function resolveCollision(
  currentPos: [number, number, number],
  targetPos: [number, number, number],
  doorStates: { door1Open: boolean; door2Open: boolean; door3Open: boolean; door4Open: boolean },
  playerRadius: number = 0.35
): [number, number, number] {
  let [newX, , newZ] = targetPos;
  const originalY = currentPos[1];

  // Active colliders list
  const activeBoxes: BoxCollider[] = [...STATIC_WALLS];
  if (!doorStates.door1Open) activeBoxes.push(DOOR_COLLIDERS.door1);
  if (!doorStates.door2Open) activeBoxes.push(DOOR_COLLIDERS.door2);
  if (!doorStates.door3Open) activeBoxes.push(DOOR_COLLIDERS.door3);
  if (!doorStates.door4Open) activeBoxes.push(DOOR_COLLIDERS.door4);

  const oldX = currentPos[0];
  const oldZ = currentPos[2];

  // 1. Resolve X movement using oldZ
  for (const box of activeBoxes) {
    if (
      oldZ + playerRadius > box.minZ &&
      oldZ - playerRadius < box.maxZ
    ) {
      if (newX + playerRadius > box.minX && newX - playerRadius < box.maxX) {
        if (oldX <= box.minX) {
          newX = box.minX - playerRadius;
        } else if (oldX >= box.maxX) {
          newX = box.maxX + playerRadius;
        } else {
          newX = oldX;
        }
        break;
      }
    }
  }

  // 2. Resolve Z movement using resolved newX
  for (const box of activeBoxes) {
    if (
      newX + playerRadius > box.minX &&
      newX - playerRadius < box.maxX
    ) {
      if (newZ + playerRadius > box.minZ && newZ - playerRadius < box.maxZ) {
        if (oldZ <= box.minZ) {
          newZ = box.minZ - playerRadius;
        } else if (oldZ >= box.maxZ) {
          newZ = box.maxZ + playerRadius;
        } else {
          newZ = oldZ;
        }
        break;
      }
    }
  }

  // 3. Resolve Cylinder Obstacles (Fountain, Pedestal)
  for (const cyl of STATIC_CYLINDERS) {
    const dx = newX - cyl.x;
    const dz = newZ - cyl.z;
    const distSq = dx * dx + dz * dz;
    const minDist = cyl.radius + playerRadius;
    if (distSq < minDist * minDist) {
      const dist = Math.sqrt(distSq);
      if (dist > 0.0001) {
        newX = cyl.x + (dx / dist) * minDist;
        newZ = cyl.z + (dz / dist) * minDist;
      } else {
        newX = currentPos[0];
        newZ = currentPos[2];
      }
    }
  }

  return [newX, originalY, newZ];
}

/**
 * Determine which room the player is currently inside
 */
export function detectCurrentRoom(x: number, z: number): RoomId {
  // Entrance
  if (z >= -3.5) return 'ENTRANCE';
  if (z >= -6.0 && Math.abs(x) <= 1.5) return 'CORRIDOR_1';
  
  // Memory Room
  if (z >= -15.2 && z <= -6.0 && x <= 4.6) return 'MEMORY_ROOM';
  if (z >= -12.0 && z <= -9.0 && x > 4.5 && x < 9.5) return 'CORRIDOR_2';

  // Library
  if (z >= -15.6 && z <= -5.4 && x >= 9.4 && x <= 19.6) return 'LIBRARY';
  if (z < -15.5 && z >= -19.6 && x >= 13.0 && x <= 16.0) return 'CORRIDOR_3';

  // Conservatory
  if (z <= -19.4 && z >= -32.6 && x >= 8.4 && x <= 20.6) return 'CONSERVATORY';
  if (z <= -24.4 && z >= -27.6 && x > 0.8 && x < 8.6) return 'CORRIDOR_4';

  // Sanctuary
  if (x <= 1.1 && z <= -19.4 && z >= -32.6) return 'SANCTUARY';

  return 'ENTRANCE';
}

/**
 * Friendly room title mapper
 */
export function getRoomDisplayName(roomId: RoomId): string {
  switch (roomId) {
    case 'ENTRANCE': return 'Entrance Hall';
    case 'CORRIDOR_1': return 'Hallway of Beginnings';
    case 'MEMORY_ROOM': return 'The Memory Room';
    case 'CORRIDOR_2': return 'The East Gallery';
    case 'LIBRARY': return 'The Secret Library';
    case 'CORRIDOR_3': return 'The Verdant Passage';
    case 'CONSERVATORY': return 'The Conservatory of Seasons';
    case 'CORRIDOR_4': return 'Corridor of Petals';
    case 'SANCTUARY': return 'The Sanctuary of Us';
    default: return 'The House of Us';
  }
}
