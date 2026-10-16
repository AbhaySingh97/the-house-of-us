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
    quality: 'low' | 'medium' | 'high';
  };

  // 3-Tier progressive hints tracking
  unlockedHints: Record<string, number>;

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
    quality: typeof window !== 'undefined' && window.innerWidth <= 840 ? 'medium' : 'high',
  },
  unlockedHints: {},
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

  // 3-Tier progressive hints
  unlockHintTier: (hintKey: string, tier: number) => {
    state = {
      ...state,
      unlockedHints: {
        ...state.unlockedHints,
        [hintKey]: Math.max(state.unlockedHints[hintKey] || 0, tier)
      }
    };
    soundEngine.playChime();
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

export interface ActionableObjectiveInfo {
  roomName: string;
  chapter: string;
  task: string;
  nextAction: string;
  hintKey: string;
  hints: [string, string, string]; // Tier 1 (Nudge), Tier 2 (Direction), Tier 3 (Solution)
}

export function getActionableObjective(state: GameState): ActionableObjectiveInfo {
  const f = state.flags;

  if (f.finalRevealTriggered || f.chestOpen) {
    return {
      chapter: 'Chapter V: The Sanctuary of Us',
      roomName: 'The Sanctuary',
      task: 'The Celestial Keepsake Chest has opened!',
      nextAction: 'Step into the radiant starlight and accept the invitation to forever.',
      hintKey: 'sanctuary_reveal',
      hints: [
        'The chest has opened, casting warm starlight throughout the sanctuary dome.',
        'Look upon the glowing ruby heart resting on the velvet pedestal.',
        'Interact with the opened chest to view the final reveal.'
      ]
    };
  }

  if (f.finalPuzzleSolved) {
    return {
      chapter: 'Chapter V: The Sanctuary of Us',
      roomName: 'The Sanctuary',
      task: 'Open the Celestial Keepsake Chest on the central marble pedestal.',
      nextAction: 'Approach the pedestal in the middle of the room and press [E] or tap to unlock it.',
      hintKey: 'sanctuary_open',
      hints: [
        'The three sacred pillars have aligned in harmony.',
        'The celestial lock is released, softly pulsing with golden light.',
        'Walk up to the center pedestal and press [E] or tap to open the chest.'
      ]
    };
  }

  if (f.door4Unlocked) {
    if (state.currentRoom === 'SANCTUARY') {
      return {
        chapter: 'Chapter V: The Sanctuary of Us',
        roomName: 'The Sanctuary',
        task: 'Solve the Celestial Riddle on the center marble pedestal.',
        nextAction: 'Approach the chest in the center of the room and press [E] or tap to inspect the three sacred pillars.',
        hintKey: 'sanctuary_riddle',
        hints: [
          'A grand dome of stars illuminates the central white marble rotunda with red rose petals.',
          'The chest asks for the three eternal pillars of our bond.',
          'Select the 3 sacred pillars in order: [ MEMORIES ] -> [ GROWTH ] -> [ FOREVER ], then unlock the chest.'
        ]
      };
    }
    return {
      chapter: 'Chapter IV: The Grand Passage',
      roomName: 'Conservatory / Petal Corridor',
      task: 'Step through the Grand Double Doors into The Sanctuary.',
      nextAction: 'Walk along the trail of red rose petals down Corridor 4 into the glowing sanctuary room.',
      hintKey: 'walk_to_sanctuary',
      hints: [
        'All four conservatory lanterns are awakened and softly humming with warm light.',
        'The double doors to the west are wide open.',
        'Follow the romantic trail of red rose petals west through the corridor into the dome sanctuary.'
      ]
    };
  }

  if (f.hasReadGardenLetter) {
    return {
      chapter: 'Chapter III: Conservatory of Seasons',
      roomName: 'Indoor Conservatory',
      task: `Kindle the 4 Conservatory Lanterns in order (${f.litLanterns.length}/4).`,
      nextAction: 'Find and kindle the next lantern in the cycle of dawn, meadow, twilight, and starlight.',
      hintKey: 'garden_lanterns',
      hints: [
        'Four stone pedestal lanterns surround the fountain, representing four moments in time.',
        'The letter on the bench describes the cycle: First dawn breaks, then flowers bloom in the meadow, sunset brings twilight, and the night settles into starlight.',
        'Kindle the lanterns in exact order: 1. Lantern of Dawn (South) -> 2. Lantern of Meadows (East) -> 3. Lantern of Twilight (North) -> 4. Lantern of Starlight (West).'
      ]
    };
  }

  if (f.door3Unlocked) {
    return {
      chapter: 'Chapter III: Conservatory of Seasons',
      roomName: 'Indoor Conservatory',
      task: 'Explore the Conservatory and read Chapter III Letter.',
      nextAction: 'Walk toward the tiered stone fountain and check the stone bench on the left.',
      hintKey: 'garden_letter',
      hints: [
        'The lush indoor greenhouse is filled with blooming roses, hanging ivy, and a tiered stone fountain.',
        'Look for a resting spot near the fountain where another letter awaits.',
        'Inspect Chapter III Letter resting on the carved stone bench to learn the secret rhythm of the four lanterns.'
      ]
    };
  }

  if (f.libraryPuzzleSolved) {
    return {
      chapter: 'Chapter II: Secret Library',
      roomName: 'Secret Library',
      task: 'Use the Verdant Conservatory Key to unlock the north door.',
      nextAction: 'Head to the north wall of the library and press [E] or tap to unlock the door to Corridor 3.',
      hintKey: 'door3_unlock',
      hints: [
        'You have retrieved the leaf-shaped Verdant Conservatory Key from the secret desk compartment.',
        'Head to the north exit of the library into the verdant passage corridor.',
        'Interact with the door to unlock and open the passageway to the conservatory.'
      ]
    };
  }

  if (f.hasReadLibraryLetter) {
    return {
      chapter: 'Chapter II: Secret Library',
      roomName: 'Secret Library',
      task: 'Find the 3 book chapter numbers and unlock the secret desk compartment.',
      nextAction: 'Examine the 3 numbered volumes stacked on the desk, then turn the 3-dial brass lock.',
      hintKey: 'library_puzzle',
      hints: [
        'Look closely at the three leather-bound books stacked right beside the desk letter.',
        'Examine each book spine: Vol. 7 (First Glance), Vol. 2 (Second Chance), and Vol. 4 (Four Seasons).',
        'Turn the 3 tumblers on the desk brass lock to [ 7 ] - [ 2 ] - [ 4 ] and click Unlock to open the secret compartment.'
      ]
    };
  }

  if (f.door2Unlocked) {
    return {
      chapter: 'Chapter II: Secret Library',
      roomName: 'Secret Library',
      task: 'Explore the Secret Library and examine the scholar desk.',
      nextAction: 'Walk past the reading chair to the large mahogany desk in the center of the library.',
      hintKey: 'library_letter',
      hints: [
        'The library is lined with towering bookshelves, a terrestrial globe, and a central scholar desk.',
        'A personal letter sits illuminated under the warm desk lamp.',
        'Read Chapter II Letter (\'Written in the Margins\') on the center desk to discover the clue for the locked compartment.'
      ]
    };
  }

  if (f.memoryPuzzleSolved) {
    return {
      chapter: 'Chapter I: Memory Room',
      roomName: 'Memory Room',
      task: 'Use the Silver Heart Key to unlock the door to the Secret Library.',
      nextAction: 'Walk to the door along the east wall of the Memory Room and press [E] or tap to unlock it.',
      hintKey: 'door2_unlock',
      hints: [
        'The keepsake box has opened, revealing the Silver Heart Key resting on crimson velvet.',
        'Look along the east wall of the Memory Room for the doorway leading into the East Gallery.',
        'Interact with the door to the Secret Library to unlock it with your Silver Heart Key.'
      ]
    };
  }

  if (f.hasReadMemoryLetter) {
    return {
      chapter: 'Chapter I: Memory Room',
      roomName: 'Memory Room',
      task: 'Align the 3 keepsakes in the velvet box using the letter\'s poem.',
      nextAction: 'Interact with the velvet box on the desk and place the three tokens in chronological order.',
      hintKey: 'memory_puzzle',
      hints: [
        'The velvet keepsake box on the desk requires three sentimental tokens in a specific order.',
        'The letter mentions: "When hours ceased to matter..." (Hourglass), "The crystal that warmed our hands..." (Rose Quartz), and "The gentle song that brought us close..." (Music Box).',
        'Open the Keepsake Box puzzle. Select: 1st Slot = Antique Hourglass, 2nd Slot = Rose Quartz, 3rd Slot = Enamelled Music Box. Click Unlock.'
      ]
    };
  }

  if (f.door1Unlocked) {
    return {
      chapter: 'Chapter I: Memory Room',
      roomName: 'Memory Room',
      task: 'Explore the Memory Room and read Chapter I Letter.',
      nextAction: 'Approach the heavy writing desk opposite the fireplace and press [E] or tap to read the letter.',
      hintKey: 'memory_letter',
      hints: [
        'A crackling fireplace warms this room. Someone left personal thoughts on a desk.',
        'Examine the heavy mahogany writing desk on the west side of the Memory Room.',
        'Read Chapter I Letter (\'The Echo of Beginning\') on the desk to discover the poem with the chronological sequence of our first memories.'
      ]
    };
  }

  if (f.hasFoundHallwayKey) {
    return {
      chapter: 'Prologue: Arrival',
      roomName: 'Entrance Hall',
      task: 'Use the Ornate Brass Key to unlock the Memory Room Door.',
      nextAction: 'Walk through the north archway to the wooden door and press [E] or tap to unlock it.',
      hintKey: 'door1_unlock',
      hints: [
        'You have the Ornate Brass Key in your pocket.',
        'Step through the archway into the short corridor leading north.',
        'Face the wooden door marked "Door to the Memory Room" and press [E] or tap to unlock and open it.'
      ]
    };
  }

  return {
    chapter: 'Prologue: Arrival',
    roomName: 'Entrance Hall',
    task: 'Explore the Entrance Hall and find the Ornate Brass Key.',
    nextAction: 'Inspect the console table on the east wall, read the Welcome Note, and take the brass key.',
    hintKey: 'entrance_welcome',
    hints: [
      'The entrance hall is where your journey begins. Look for words left to greet you.',
      'Check the wooden console table standing against the east wall beneath the ornate gilded mirror.',
      'Approach the console table and read the Welcome Note on parchment. Then take the glowing Ornate Brass Key beside the dried lavender.'
    ]
  };
}

export function useGameStore(): GameState {
  const [s, setS] = useState<GameState>(gameStore.getState());

  useEffect(() => {
    return gameStore.subscribe(setS);
  }, []);

  return s;
}
