import React, { useState } from 'react';
import { useGameStore, gameStore } from '../../../state/gameStore';
import { GAME_CONFIG } from '../../../config/gameConfig';
import { X, HelpCircle, CheckCircle2, RotateCcw } from 'lucide-react';
import { soundEngine } from '../../../audio/soundEngine';

type KeepsakeId = 'hourglass' | 'rose_quartz' | 'music_box';

export const MemoryPuzzleModal: React.FC = () => {
  const { activeModal, flags } = useGameStore();
  const [selectedSlots, setSelectedSlots] = useState<(KeepsakeId | null)[]>([null, null, null]);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);

  if (activeModal !== 'MEMORY_PUZZLE') return null;

  const puzzleData = GAME_CONFIG.puzzles.memoryPuzzle;
  const items = puzzleData.items;

  // If already solved, show solved view
  if (flags.memoryPuzzleSolved) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-sans">
        <div className="relative w-full max-w-md max-h-[92dvh] overflow-y-auto modal-scrollable p-5 sm:p-6 rounded-2xl bg-[#2a1216] border border-[#d4af37]/50 text-[#f7ede2] shadow-2xl text-center">
          <button
            onClick={() => gameStore.closeModal()}
            className="absolute top-4 right-4 p-2 text-[#d4af37] hover:text-white"
          >
            <X size={20} />
          </button>
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#3d1820] flex items-center justify-center text-3xl border border-[#d4af37]">
            🗝️
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#f2cb6b] mb-2">
            The Keepsake Box Unlocked
          </h2>
          <p className="text-sm text-[#ecd0c8] mb-6 leading-relaxed">
            The velvet compartments align in harmony. You have already recovered the 
            <strong className="text-[#ffd700]"> Silver Heart Key</strong>, which unlocks the door to the Secret Library.
          </p>
          <button
            onClick={() => gameStore.closeModal()}
            className="px-6 py-2.5 rounded-lg bg-[#d4af37] text-[#2a1216] font-semibold text-sm hover:bg-[#e6c158] transition-colors"
          >
            Close Box
          </button>
        </div>
      </div>
    );
  }

  // Handle selecting an item into the next available slot
  const handleSelectItem = (id: KeepsakeId) => {
    soundEngine.playChime();
    setFeedback(null);

    // If item is already placed, remove it
    if (selectedSlots.includes(id)) {
      setSelectedSlots(selectedSlots.map(s => s === id ? null : s));
      return;
    }

    // Place into first empty slot
    const firstEmptyIndex = selectedSlots.findIndex(s => s === null);
    if (firstEmptyIndex !== -1) {
      const next = [...selectedSlots];
      next[firstEmptyIndex] = id;
      setSelectedSlots(next);
    }
  };

  const handleClearSlot = (index: number) => {
    const next = [...selectedSlots];
    next[index] = null;
    setSelectedSlots(next);
    setFeedback(null);
  };

  const handleReset = () => {
    setSelectedSlots([null, null, null]);
    setFeedback(null);
  };

  const handleConfirm = () => {
    if (selectedSlots.some(s => s === null)) {
      setFeedback("Please place all three keepsakes into the velvet slots.");
      soundEngine.playError();
      return;
    }

    const isCorrect = 
      selectedSlots[0] === puzzleData.correctSequence[0] &&
      selectedSlots[1] === puzzleData.correctSequence[1] &&
      selectedSlots[2] === puzzleData.correctSequence[2];

    if (isCorrect) {
      gameStore.solveMemoryPuzzle();
    } else {
      setAttempts(a => a + 1);
      soundEngine.playError();
      setFeedback("The lock clicks back into place. The keepsakes did not follow the memory's gentle sequence.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-sans">
      <div className="relative w-full max-w-lg max-h-[92dvh] overflow-y-auto modal-scrollable p-4 sm:p-8 rounded-2xl bg-gradient-to-b from-[#241115] to-[#1a0a0d] border border-[#d4af37]/40 text-[#f7ede2] shadow-2xl">
        <button
          onClick={() => gameStore.closeModal()}
          className="absolute top-4 right-4 p-2 text-[#d4af37] hover:text-white"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-5">
          <span className="text-[11px] sm:text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
            Chapter II Puzzle
          </span>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#f7ede2] mt-1">
            {puzzleData.title}
          </h2>
          <p className="text-xs text-[#d8b8b0] mt-1 max-w-sm mx-auto">
            {puzzleData.description}
          </p>
        </div>

        {/* 3 Velvet Slots */}
        <div className="flex justify-center gap-2 sm:gap-4 mb-5">
          {[0, 1, 2].map((slotIdx) => {
            const placedId = selectedSlots[slotIdx];
            const item = placedId ? items.find(i => i.id === placedId) : null;

            return (
              <div
                key={slotIdx}
                onClick={() => handleClearSlot(slotIdx)}
                className={`relative w-[96px] h-[116px] sm:w-28 sm:h-32 rounded-xl border-2 flex flex-col items-center justify-center p-1.5 sm:p-2 cursor-pointer transition-all active:scale-95 ${
                  placedId
                    ? 'border-[#d4af37] bg-[#42131b] shadow-lg shadow-[#d4af37]/10'
                    : 'border-dashed border-[#61363e] bg-[#220d11]/70 hover:border-[#8e4854]'
                }`}
              >
                <span className="absolute top-1 left-2 text-[9px] sm:text-[10px] text-[#a88289] font-mono">
                  Slot #{slotIdx + 1}
                </span>

                {item ? (
                  <>
                    <span className="text-2xl mb-0.5 sm:mb-1">
                      {item.id === 'hourglass' ? '⌛' : item.id === 'rose_quartz' ? '💎' : '🎵'}
                    </span>
                    <span className="text-[11px] sm:text-xs font-semibold text-center text-[#ffdeb3] leading-tight">
                      {item.meaning}
                    </span>
                    <span className="text-[9px] text-[#c29ba2] text-center mt-0.5">
                      Tap to remove
                    </span>
                  </>
                ) : (
                  <span className="text-[11px] sm:text-xs text-[#7d5059] italic text-center">
                    Empty Velvet Slot
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Available Items to Pick */}
        <div className="mb-5">
          <span className="block text-xs uppercase tracking-wider text-[#d4af37] mb-2 text-center font-medium">
            Tap a keepsake to place or remove:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {items.map((it) => {
              const isPlaced = selectedSlots.includes(it.id);
              return (
                <button
                  key={it.id}
                  onClick={() => handleSelectItem(it.id)}
                  className={`p-3 rounded-xl border text-left transition-all flex sm:flex-col items-center sm:items-start gap-2.5 sm:gap-1 active:scale-95 min-h-[48px] ${
                    isPlaced
                      ? 'border-[#5e2730] bg-[#1a080c] opacity-50 cursor-pointer'
                      : 'border-[#7d3b46] bg-[#2e1318] hover:border-[#d4af37] hover:bg-[#3d1920]'
                  }`}
                >
                  <span className="text-2xl">
                    {it.id === 'hourglass' ? '⌛' : it.id === 'rose_quartz' ? '💎' : '🎵'}
                  </span>
                  <div>
                    <span className="block text-xs font-bold text-[#f7ede2]">
                      {it.label}
                    </span>
                    <span className="block text-[11px] text-[#d4af37]">
                      {it.meaning}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback Message */}
        {feedback && (
          <div className="mb-4 p-2.5 rounded-lg bg-[#3b1219] border border-[#a83244] text-xs text-[#fca5a5] text-center">
            {feedback}
          </div>
        )}

        {/* Optional Hint */}
        {showHint && (
          <div className="mb-4 p-3 rounded-lg bg-[#382015] border border-[#d4af37]/60 text-xs text-[#fed7aa] text-center italic">
            <span className="font-semibold not-italic">Hint from Chapter I Letter: </span>
            {puzzleData.hint}
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-[#4d2028]">
          <div className="flex items-center justify-between sm:justify-start gap-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs text-[#b88c94] hover:text-white hover:bg-[#38161e] active:scale-95 transition-all"
            >
              <RotateCcw size={14} />
              Reset Slots
            </button>
            {attempts >= 1 && !showHint && (
              <button
                onClick={() => setShowHint(true)}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs text-[#e6b84d] hover:bg-[#382618] active:scale-95 transition-all"
              >
                <HelpCircle size={14} />
                Need a Hint?
              </button>
            )}
          </div>

          <button
            onClick={handleConfirm}
            className="flex items-center justify-center gap-2 px-6 py-3 sm:py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#e6c158] text-[#241115] font-bold text-sm hover:brightness-110 shadow-lg shadow-[#d4af37]/20 transition-all active:scale-95"
          >
            <CheckCircle2 size={16} />
            Unlock Keepsake Box
          </button>
        </div>
      </div>
    </div>
  );
};
