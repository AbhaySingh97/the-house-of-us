export interface InteractiveItem {
  id: string;
  label: string;
  subLabel?: string;
  type: 'inspect' | 'door' | 'pickup' | 'puzzle' | 'lantern';
  position: [number, number, number];
  radius?: number; // max interaction distance, default 2.6m
  onInteract: () => void;
}

const items = new Map<string, InteractiveItem>();

export const interactiveRegistry = {
  register: (item: InteractiveItem) => {
    items.set(item.id, item);
  },

  unregister: (id: string) => {
    items.delete(id);
  },

  getAll: (): InteractiveItem[] => {
    return Array.from(items.values());
  },

  findClosestInView: (
    playerPos: [number, number, number],
    camForward: [number, number, number]
  ): InteractiveItem | null => {
    let closestItem: InteractiveItem | null = null;
    let highestScore = -Infinity;

    for (const item of items.values()) {
      const maxDist = item.radius || 2.8;
      const dx = item.position[0] - playerPos[0];
      const dy = item.position[1] - playerPos[1];
      const dz = item.position[2] - playerPos[2];
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (dist <= maxDist) {
        // Normalize direction
        const dirX = dx / dist;
        const dirY = dy / dist;
        const dirZ = dz / dist;
        const dot = dirX * camForward[0] + dirY * camForward[1] + dirZ * camForward[2];

        // Forgiving minimum angle when in close range (< 1.5m)
        const minDot = dist < 1.5 ? 0.15 : 0.38;

        if (dot > minDot) {
          // Combined score prioritizing both direct gaze and proximity
          const score = dot / (dist + 0.1);
          if (score > highestScore) {
            highestScore = score;
            closestItem = item;
          }
        }
      }
    }

    return closestItem;
  }
};
