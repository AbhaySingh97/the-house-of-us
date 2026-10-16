import { useState, useEffect } from 'react';
import type { GamePhase, RoomId, InventoryItem, ModalType, InteractionPrompt } from '../types';
import { GAME_CONFIG } from '../config/gameConfig';
import { soundEngine } from '../audio/soundEngine';

export interface GameState {
  phase: GamePhase;
  currentRoom: RoomId;
  previousRoom: RoomId | null;
  activeModal: ModalType;
  prompt: InteractionPrompt | null;
  
  // Inventory
  inventory: InventoryItem[];
  
  // Progression flags
  flags: {
    hasReadWelcomeNote: boolean;
    hasFoundHallwayKey: boolean;
    door1Unlocked: boolean; // Memory Room Door
    door1Open: boolean;
    
    hasReadMemoryLetter: boolean;
    memoryPuzzleSolved: boolean;
    hasOpenedMemoryBox: boolean;
    hasFoundLibraryKey: boolean;
    door2Unlocked: boolean; // Library Door
    door2Open: boolean;
    
    hasReadLibraryLetter: boolean;
    libraryPuzzleSolved: boolean;
    hasOpenedSecretDesk: boolean;
    hasFoundGardenKey: boolean;
    door3Unlocked: boolean; // Conservatory Door
    door3Open: boolean;
    
    hasReadGardenLetter: boolean;
    litLanterns: ('dawn' | 'meadow' | 'twilight' | 'starlight')[];
    gardenPuzzleSolved: boolean;
    door4Unlocked: boolean; // Sanctuary Grand Doors
    door4Open: boolean;
    
    finalPuzzleSolved: boolean;
    chestOpen: boolean;
    finalRevealTriggered: boolean;
    finalAnswer: string | null;
  };
  
  // Settings
  settings: {
    masterVolume: number;
    musicVolume: number;
    sfxVolume: number;
    muted: boolean;
    mouseSensitivity: number;
    reducedMotion: boolean;
    touchControls: boolean;
  };

  // Toast notifications
  toastMessage: string | null;
}

const initialGameState: GameState = {
  phase: 'MENU',
  currentRoom: 'ENTRANCE',
  previousRoom: null,
  activeModal: null,
  prompt: null,
  inventory: [],
  flags: {
    hasReadWelcomeNote: false,
    hasFoundHallwayKey: false,
    door1Unlocked: false,
    door1Open: false,
    
    hasReadMemoryLetter: false,
    memoryPuzzleSolved: false,
    hasOpenedMemoryBox: false,
    hasFoundLibraryKey: false,
    door2Unlocked: false,
    door2Open: false,
    
    hasReadLibraryLetter: false,
    libraryPuzzleSolved: false,
    hasOpenedSecretDesk: false,
    hasFoundGardenKey: false,
    door3Unlocked: false,
    door3Open: false,
    
    hasReadGardenLetter: false,
    litLanterns: [],
    gardenPuzzleSolved: false,
    door4Unlocked: false,
    door4Open: false,
    
    finalPuzzleSolved: false,
    chestOpen: false,
    finalRevealTriggered: false,
    finalAnswer: null,
  },
  settings: {
    masterVolume: GAME_CONFIG.defaultSettings.masterVolume,
    musicVolume: GAME_CONFIG.defaultSettings.musicVolume,
    sfxVolume: GAME_CONFIG.defaultSettings.sfxVolume,
    muted: false,
    mouseSensitivity: GAME_CONFIG.defaultSettings.mouseSensitivity,
    reducedMotion: GAME_CONFIG.defaultSettings.reducedMotion,
    touchControls: typeof window !== 'undefined' 
      ? ('ontouchstart' in window || (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0) || window.innerWidth <= 840)
      : false,
  },
  toastMessage: null,
};

// Global reactive store
let state: GameState = { ...initialGameState };
const listeners = new Set<(s: GameState) => void>();

function notify() {
  listeners.forEach(fn => fn(state));
}

export const gameStore = {
  getState: () => state,

  subscribe: (fn: (s: GameState) => void) => {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },

  setPhase: (phase: GamePhase) => {
    state = { ...state, phase };
    if (phase === 'PLAYING') {
      soundEngine.init();
    }
    notify();
  },

  setCurrentRoom: (room: RoomId) => {
    if (state.currentRoom !== room) {
      state = { ...state, previousRoom: state.currentRoom, currentRoom: room };
      notify();
    }
  },

  setPrompt: (prompt: InteractionPrompt | null) => {
    // Only update if changed to avoid continuous re-renders
    if (
      (prompt === null && state.prompt !== null) ||
      (prompt !== null && state.prompt === null) ||
      (prompt && state.prompt && prompt.id !== state.prompt.id)
    ) {
      state = { ...state, prompt };
      notify();
    }
  },

  openModal: (modal: ModalType) => {
    state = { ...state, activeModal: modal };
    if (modal === 'WELCOME_NOTE') state.flags.hasReadWelcomeNote = true;
    if (modal === 'LETTER_MEMORY') state.flags.hasReadMemoryLetter = true;
    if (modal === 'LETTER_LIBRARY') state.flags.hasReadLibraryLetter = true;
    if (modal === 'LETTER_GARDEN') state.flags.hasReadGardenLetter = true;
    soundEngine.playChime();
    notify();
  },

  closeModal: () => {
    state = { ...state, activeModal: null };
    notify();
  },

  showToast: (msg: string) => {
    state = { ...state, toastMessage: msg };
    notify();
    setTimeout(() => {
      if (state.toastMessage === msg) {
        state = { ...state, toastMessage: null };
        notify();
      }
    }, 3500);
  },

  // Inventory actions
  addItem: (item: InventoryItem) => {
    if (!state.inventory.find(i => i.id === item.id)) {
      state = {
        ...state,
        inventory: [...state.inventory, item]
      };
      soundEngine.playPickup();
      gameStore.showToast(`Found: ${item.name}`);
      notify();
    }
  },

  hasItem: (id: string) => {
    return !!state.inventory.find(i => i.id === id);
  },

  // Door operations
  toggleDoor: (doorId: 1 | 2 | 3 | 4) => {
    const f = state.flags;
    let unlocked = false;
    let isOpen = false;
    let reqKey = '';
    let keyName = '';

    if (doorId === 1) {
      unlocked = f.door1Unlocked;
      isOpen = f.door1Open;
      reqKey = 'key_memory';
      keyName = 'Ornate Brass Key';
    } else if (doorId === 2) {
      unlocked = f.door2Unlocked;
      isOpen = f.door2Open;
      reqKey = 'key_library';
      keyName = 'Silver Heart Key';
    } else if (doorId === 3) {
      unlocked = f.door3Unlocked;
      isOpen = f.door3Open;
      reqKey = 'key_garden';
      keyName = 'Verdant Conservatory Key';
    } else if (doorId === 4) {
      unlocked = f.door4Unlocked;
      isOpen = f.door4Open;
    }

    if (!unlocked) {
      if (doorId === 4) {
        soundEngine.playError();
        gameStore.showToast("The Grand Doors are held shut by sleeping conservatory lanterns.");
        return;
      }
      if (gameStore.hasItem(reqKey)) {
        // Unlock with key!
        soundEngine.playPickup();
        if (doorId === 1) state.flags.door1Unlocked = true;
        if (doorId === 2) state.flags.door2Unlocked = true;
        if (doorId === 3) state.flags.door3Unlocked = true;
        gameStore.showToast(`Unlocked with ${keyName}!`);
        // Immediately open
        if (doorId === 1) state.flags.door1Open = true;
        if (doorId === 2) state.flags.door2Open = true;
        if (doorId === 3) state.flags.door3Open = true;
        soundEngine.playDoorCreak(true);
        notify();
        return;
      } else {
        soundEngine.playError();
        gameStore.showToast(`Locked. Requires the ${keyName}.`);
        return;
      }
    }

    // Toggle open/close
    const nextOpen = !isOpen;
    if (doorId === 1) state.flags.door1Open = nextOpen;
    if (doorId === 2) state.flags.door2Open = nextOpen;
    if (doorId === 3) state.flags.door3Open = nextOpen;
    if (doorId === 4) state.flags.door4Open = nextOpen;

    soundEngine.playDoorCreak(nextOpen);
    notify();
  },

  // Hallway Key Pickup
  pickupHallwayKey: () => {
    if (!state.flags.hasFoundHallwayKey) {
      state.flags.hasFoundHallwayKey = true;
      gameStore.addItem({
        id: 'key_memory',
        name: 'Ornate Brass Key',
        description: 'An aged brass key inscribed with dried lavender, found on the entrance console.',
        icon: '🗝️',
        category: 'key'
      });
      notify();
    }
  },

  // Memory puzzle solve
  solveMemoryPuzzle: () => {
    state.flags.memoryPuzzleSolved = true;
    state.flags.hasOpenedMemoryBox = true;
    soundEngine.playSuccess();
    gameStore.addItem({
      id: 'key_library',
      name: 'Silver Heart Key',
      description: 'A finely crafted silver key resting on crimson velvet inside the memory box.',
      icon: '🗝️',
      category: 'key'
    });
    gameStore.showToast("The keepsake box unlocks! Found the Silver Heart Key.");
    notify();
  },

  // Library puzzle solve
  solveLibraryPuzzle: () => {
    state.flags.libraryPuzzleSolved = true;
    state.flags.hasOpenedSecretDesk = true;
    soundEngine.playSuccess();
    gameStore.addItem({
      id: 'key_garden',
      name: 'Verdant Conservatory Key',
      description: 'An engraved leaf-shaped emerald key retrieved from the hidden mahogany drawer.',
      icon: '🗝️',
      category: 'key'
    });
    gameStore.showToast("The secret compartment slides open! Found the Conservatory Key.");
    notify();
  },

  // Garden lantern interact
  touchLantern: (id: 'dawn' | 'meadow' | 'twilight' | 'starlight') => {
    if (state.flags.gardenPuzzleSolved) return;

    const currentLit = [...state.flags.litLanterns];
    const lanternData = GAME_CONFIG.puzzles.gardenPuzzle.lanterns.find(l => l.id === id);
    const title = lanternData ? lanternData.title : 'Lantern';

    // If already lit, do not penalize or reset
    if (currentLit.includes(id)) {
      soundEngine.playChime();
      gameStore.showToast(`${title} is already softly glowing.`);
      return;
    }

    const correctSeq = GAME_CONFIG.puzzles.gardenPuzzle.correctSequence;
    const expectedId = correctSeq[currentLit.length];

    if (id === expectedId) {
      currentLit.push(id);
      state.flags.litLanterns = currentLit;
      soundEngine.playLanternIgnite(0.9 + currentLit.length * 0.2);

      if (currentLit.length === correctSeq.length) {
        state.flags.gardenPuzzleSolved = true;
        state.flags.door4Unlocked = true;
        state.flags.door4Open = true;
        soundEngine.playSuccess();
        setTimeout(() => soundEngine.playDoorCreak(true), 1200);
        gameStore.showToast("All lanterns ignite! The Grand Doors to the Sanctuary swing open!");
      } else {
        gameStore.showToast(`${title} awakened! (${currentLit.length}/4)`);
      }
      notify();
    } else {
      // Wrong lantern: reset sequence
      state.flags.litLanterns = [];
      soundEngine.playError();
      gameStore.showToast("The lantern flickers and fades. The garden rhythm reset.");
      notify();
    }
  },

  // Final riddle solve
  solveFinalRiddle: () => {
    state.flags.finalPuzzleSolved = true;
    state.flags.chestOpen = true;
    soundEngine.playFinalReveal();
    setTimeout(() => {
      state = { ...state, phase: 'FINAL_REVEAL', activeModal: null };
      notify();
    }, 1800);
    notify();
  },

  setFinalAnswer: (answer: string) => {
    state.flags.finalAnswer = answer;
    soundEngine.playSuccess();
    notify();
  },

  updateSettings: (newSettings: Partial<GameState['settings']>) => {
    state.settings = { ...state.settings, ...newSettings };
    soundEngine.setVolumes(
      state.settings.masterVolume,
      state.settings.musicVolume,
      state.settings.sfxVolume,
      state.settings.muted
    );
    notify();
  },

  // Full restart game
  restartGame: () => {
    state = {
      ...initialGameState,
      settings: { ...state.settings }
    };
    soundEngine.init();
    notify();
  }
};

export function useGameStore(): GameState {
  const [s, setS] = useState<GameState>(gameStore.getState());

  useEffect(() => {
    return gameStore.subscribe(setS);
  }, []);

  return s;
}
