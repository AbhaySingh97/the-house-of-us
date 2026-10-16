export type GamePhase = 'MENU' | 'INTRO' | 'PLAYING' | 'PAUSED' | 'FINAL_REVEAL';

export type RoomId = 
  | 'ENTRANCE' 
  | 'CORRIDOR_1'
  | 'MEMORY_ROOM' 
  | 'CORRIDOR_2'
  | 'LIBRARY' 
  | 'CORRIDOR_3'
  | 'CONSERVATORY' 
  | 'CORRIDOR_4'
  | 'SANCTUARY';

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'key' | 'keepsake' | 'clue';
}

export type ModalType = 
  | null 
  | 'WELCOME_NOTE'
  | 'LETTER_MEMORY'
  | 'LETTER_LIBRARY'
  | 'LETTER_GARDEN'
  | 'MEMORY_PUZZLE'
  | 'LIBRARY_PUZZLE'
  | 'FINAL_PUZZLE'
  | 'SETTINGS'
  | 'INVENTORY'
  | 'HINTS';

export interface InteractionPrompt {
  id: string;
  label: string;
  subLabel?: string;
  type: 'inspect' | 'door' | 'pickup' | 'puzzle' | 'lantern';
  position: [number, number, number];
  distance?: number;
}

export interface DoorState {
  id: string;
  name: string;
  isLocked: boolean;
  isOpen: boolean;
  requiredKeyId?: string;
  lockedMessage: string;
  position: [number, number, number];
  rotationY: number; // base rotation
  width: number;
}

export interface MemoryObject {
  id: 'rose_quartz' | 'hourglass' | 'music_box';
  name: string;
  description: string;
  symbol: string;
  dateTag: string;
}

export interface LanternState {
  id: 'dawn' | 'meadow' | 'twilight' | 'starlight';
  name: string;
  color: string;
  emissiveColor: string;
  isLit: boolean;
  orderIndex: number;
}

export interface AudioSettings {
  muted: boolean;
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
}

export interface ControlSettings {
  mouseSensitivity: number;
  invertY: boolean;
  reducedMotion: boolean;
}

export interface GameSettings {
  audio: AudioSettings;
  controls: ControlSettings;
}
