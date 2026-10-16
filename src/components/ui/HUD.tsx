import React from 'react';
import { useGameStore, gameStore } from '../../state/gameStore';
import { getRoomDisplayName } from '../../utils/collision';
import { Pause, Key, Compass } from 'lucide-react';

import { inputStore } from '../../state/inputStore';

export const HUD: React.FC = () => {
  const { 
    phase, 
    currentRoom, 
    prompt, 
    inventory, 
    toastMessage, 
    flags, 
    activeModal, 
    settings 
  } = useGameStore();

  if (phase !== 'PLAYING') return null;

  // Determine current quest objective
  let currentObjective = "Explore the Entrance Hall and read the welcome note.";
  if (flags.finalPuzzleSolved) {
    currentObjective = "The Sanctuary is unlocked! Open the Celestial Chest.";
  } else if (flags.door4Unlocked) {
    currentObjective = "The Grand Double Doors are open. Step into the Sanctuary of Us.";
  } else if (flags.hasReadGardenLetter) {
    currentObjective = `Kindle the 4 Conservatory Lanterns in order (${flags.litLanterns.length}/4).`;
  } else if (flags.door3Unlocked) {
    currentObjective = "Enter the Conservatory of Seasons.";
  } else if (flags.libraryPuzzleSolved) {
    currentObjective = "Use the Verdant Key to unlock the Conservatory Door.";
  } else if (flags.hasReadLibraryLetter) {
    currentObjective = "Find the 3 book chapter numbers and unlock the secret desk compartment.";
  } else if (flags.door2Unlocked) {
    currentObjective = "Enter the Secret Library.";
  } else if (flags.memoryPuzzleSolved) {
    currentObjective = "Take the Silver Heart Key and unlock the Library Door.";
  } else if (flags.hasReadMemoryLetter) {
    currentObjective = "Align the 3 keepsakes in the velvet box using the letter's clue.";
  } else if (flags.hasFoundHallwayKey) {
    currentObjective = "Use the Ornate Brass Key to unlock the Memory Room Door.";
  } else if (flags.hasReadWelcomeNote) {
    currentObjective = "Search the console table for the hidden brass key.";
  }

  const roomName = getRoomDisplayName(currentRoom);

  const handlePromptTap = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try { navigator.vibrate(20); } catch {}
    }
    inputStore.requestInteract();
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-30 flex flex-col justify-between p-3 sm:p-6 font-sans select-none">
      {/* --- TOP BAR --- */}
      <div className="flex items-start justify-between w-full">
        {/* Room Title and Objective Banner */}
        <div className="flex flex-col gap-1.5 flex-1 mr-3 max-w-[210px] sm:max-w-md">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-[#ffd700]/30 text-white shadow-lg w-fit">
            <Compass size={13} className="text-[#ffd700]" />
            <span className="text-[11px] sm:text-xs font-serif tracking-wider font-semibold">
              {roomName}
            </span>
          </div>

          {/* Current Objective */}
          <div className="px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[11px] sm:text-xs text-[#ebd8c5] shadow-sm leading-tight">
            <span className="text-[9px] uppercase font-bold tracking-wider text-[#ffd700] block mb-0.5">
              Goal
            </span>
            {currentObjective}
          </div>
        </div>

        {/* Top Right Controls & Inventory */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Inventory Pills */}
          {inventory.length > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-[#ffd700]/30 text-white shadow-lg">
              <Key size={13} className="text-[#ffd700]" />
              <div className="flex items-center gap-1 text-xs">
                {inventory.map(item => (
                  <span key={item.id} title={item.name} className="text-sm">
                    {item.icon}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Large Mobile-Friendly Pause Button */}
          <button
            onClick={() => gameStore.setPhase('PAUSED')}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/70 hover:bg-black/90 active:bg-[#ffd700]/20 backdrop-blur-md border border-[#ffd700]/40 text-white shadow-xl flex items-center justify-center transition-all active:scale-90 cursor-pointer touch-none"
            aria-label="Pause Menu"
          >
            <Pause size={18} className="text-[#ffd700]" />
          </button>
        </div>
      </div>

      {/* --- CENTER CROSSHAIR --- */}
      {activeModal === null && !settings.touchControls && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className={`w-2 h-2 rounded-full transition-all duration-150 ${
            prompt 
              ? 'w-3 h-3 bg-[#ffd700] ring-4 ring-[#ffd700]/30 shadow-lg' 
              : 'bg-white/50'
          }`} />
        </div>
      )}

      {/* --- TOAST NOTIFICATION --- */}
      {toastMessage && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-[#1f1510]/95 backdrop-blur-md border border-[#ffd700]/50 text-[#fff5ea] text-xs sm:text-sm font-medium shadow-2xl animate-fade-in flex items-center gap-2 max-w-[90vw] text-center">
          <span>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* --- BOTTOM INTERACTION PROMPT PILL (Directly Tappable on Mobile) --- */}
      <div className="flex justify-center w-full mb-16 sm:mb-2 pointer-events-none">
        {prompt && activeModal === null && (
          <div 
            onClick={handlePromptTap}
            onTouchStart={handlePromptTap}
            className="pointer-events-auto cursor-pointer px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-black/85 backdrop-blur-md border-2 border-[#ffd700] text-white shadow-2xl flex items-center gap-2.5 animate-pulse active:scale-95 transition-transform"
          >
            <span className="px-2 py-0.5 rounded bg-[#ffd700] text-black font-mono font-bold text-xs uppercase">
              {settings.touchControls ? 'TAP' : 'E'}
            </span>
            <div className="text-left">
              <span className="block text-xs sm:text-sm font-semibold text-[#fff5ea]">
                {prompt.label}
              </span>
              {prompt.subLabel && (
                <span className="block text-[10px] text-[#e0cfbe]">
                  {prompt.subLabel}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
