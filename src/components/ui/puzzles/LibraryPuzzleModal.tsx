import React, { useState } from 'react';
import { useGameStore, gameStore } from '../../../state/gameStore';
import { GAME_CONFIG } from '../../../config/gameConfig';
import { X, ChevronUp, ChevronDown, HelpCircle, CheckCircle2 } from 'lucide-react';
import { soundEngine } from '../../../audio/soundEngine';

export const LibraryPuzzleModal: React.FC = () => {
  const { activeModal, flags } = useGameStore();
  const [dials, setDials] = useState<[number, number, number]>([0, 0, 0]);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);

  if (activeModal !== 'LIBRARY_PUZZLE') return null;

  const puzzleData = GAME_CONFIG.puzzles.libraryPuzzle;

  // If already solved, show solved view
  if (flags.libraryPuzzleSolved) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-sans">
        <div className="relative w-full max-w-md max-h-[92dvh] overflow-y-auto modal-scrollable p-5 sm:p-6 rounded-2xl bg-[#1c261e] border border-[#2ecc71]/40 text-[#f0fdf4] shadow-2xl text-center">
          <button
            onClick={() => gameStore.closeModal()}
            className="absolute top-4 right-4 p-2 text-[#2ecc71] hover:text-white"
          >
            <X size={20} />
          </button>
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#12301c] flex items-center justify-center text-3xl border border-[#2ecc71]">
            🌿
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#68d391] mb-2">
            Secret Compartment Opened
          </h2>
          <p className="text-sm text-[#c6f6d5] mb-6 leading-relaxed">
            The mechanical brass dials clicked into place at <strong>7 - 2 - 4</strong>. You have retrieved the 
            <strong className="text-[#a7f3d0]"> Verdant Conservatory Key</strong>, which unlocks the door into the indoor garden.
          </p>
          <button
            onClick={() => gameStore.closeModal()}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#2ecc71] text-[#0f2415] font-semibold text-sm hover:bg-[#34d399] transition-all active:scale-95"
          >
            Close Compartment
          </button>
        </div>
      </div>
    );
  }

  const changeDial = (dialIndex: number, delta: number) => {
    soundEngine.playChime();
    setFeedback(null);
    setDials(prev => {
      const next = [...prev] as [number, number, number];
      next[dialIndex] = (next[dialIndex] + delta + 10) % 10;
      return next;
    });
  };

  const handleUnlock = () => {
    const isCorrect =
      dials[0] === puzzleData.combination[0] &&
      dials[1] === puzzleData.combination[1] &&
      dials[2] === puzzleData.combination[2];

    if (isCorrect) {
      gameStore.solveLibraryPuzzle();
    } else {
      setAttempts(a => a + 1);
      soundEngine.playError();
      setFeedback("The brass tumblers remain locked tight. The chapter sequence does not match.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-sans">
      <div className="relative w-full max-w-lg max-h-[92dvh] overflow-y-auto modal-scrollable p-4 sm:p-8 rounded-2xl bg-gradient-to-b from-[#1b1c18] to-[#121410] border border-[#c59b27]/50 text-[#f7ede2] shadow-2xl">
        <button
          onClick={() => gameStore.closeModal()}
          className="absolute top-4 right-4 p-2 text-[#c59b27] hover:text-white"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-5">
          <span className="text-[11px] sm:text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
            Chapter III Puzzle
          </span>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#f7ede2] mt-1">
            {puzzleData.title}
          </h2>
          <p className="text-xs text-[#cfc5ba] mt-1 max-w-sm mx-auto">
            {puzzleData.description}
          </p>
        </div>

        {/* Clue Books Summary Banner */}
        <div className="mb-5 p-2.5 sm:p-3 rounded-xl bg-[#272115] border border-[#d4af37]/30 text-xs text-[#eedcc5] flex items-center justify-around">
          <div className="text-center">
            <span className="block font-serif italic text-[#f7b731]">Volume I</span>
            <span className="text-[10px] sm:text-[11px] text-[#b8a798]">The First Glance</span>
          </div>
          <span className="text-[#a89582]">•</span>
          <div className="text-center">
            <span className="block font-serif italic text-[#f7b731]">Volume II</span>
            <span className="text-[10px] sm:text-[11px] text-[#b8a798]">The Second Chance</span>
          </div>
          <span className="text-[#a89582]">•</span>
          <div className="text-center">
            <span className="block font-serif italic text-[#f7b731]">Volume III</span>
            <span className="text-[10px] sm:text-[11px] text-[#b8a798]">Four Seasons</span>
          </div>
        </div>

        {/* 3 Mechanical Tumbler Dials */}
        <div className="flex justify-center items-center gap-3 sm:gap-6 my-6">
          {[0, 1, 2].map((dialIdx) => (
            <div key={dialIdx} className="flex flex-col items-center">
              {/* Up button */}
              <button
                onClick={() => changeDial(dialIdx, 1)}
                className="w-14 h-11 sm:w-16 sm:h-12 rounded-t-xl bg-[#302618] hover:bg-[#473620] active:bg-[#d4af37] active:text-[#1b1c18] text-[#d4af37] flex items-center justify-center transition-all active:scale-95 touch-none"
                aria-label={`Increment dial ${dialIdx + 1}`}
              >
                <ChevronUp size={24} />
              </button>

              {/* Number Cylinder Display */}
              <div className="w-14 h-14 sm:w-16 sm:h-18 bg-gradient-to-b from-[#18130b] via-[#241c10] to-[#18130b] border-y-2 border-[#d4af37] flex items-center justify-center shadow-inner">
                <span className="text-3xl sm:text-4xl font-mono font-bold text-[#fffae0] drop-shadow-md select-none">
                  {dials[dialIdx]}
                </span>
              </div>

              {/* Down button */}
              <button
                onClick={() => changeDial(dialIdx, -1)}
                className="w-14 h-11 sm:w-16 sm:h-12 rounded-b-xl bg-[#302618] hover:bg-[#473620] active:bg-[#d4af37] active:text-[#1b1c18] text-[#d4af37] flex items-center justify-center transition-all active:scale-95 touch-none"
                aria-label={`Decrement dial ${dialIdx + 1}`}
              >
                <ChevronDown size={24} />
              </button>
            </div>
          ))}
        </div>

        {/* Feedback message */}
        {feedback && (
          <div className="mb-4 p-2.5 rounded-lg bg-[#331818] border border-[#a83232] text-xs text-[#fca5a5] text-center">
            {feedback}
          </div>
        )}

        {/* Optional Hint */}
        {showHint && (
          <div className="mb-4 p-3 rounded-lg bg-[#332514] border border-[#d4af37]/60 text-xs text-[#fed7aa] text-center italic">
            <span className="font-semibold not-italic">Scholar's Clue: </span>
            {puzzleData.hint}
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-[#3b3022]">
          {attempts >= 1 && !showHint ? (
            <button
              onClick={() => setShowHint(true)}
              className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-xs text-[#e6b84d] hover:bg-[#2b2214] active:scale-95 transition-all"
            >
              <HelpCircle size={14} />
              Reveal Book Numbers
            </button>
          ) : <div />}

          <button
            onClick={handleUnlock}
            className="flex items-center justify-center gap-2 px-6 py-3 sm:py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#e6c158] text-[#1b1c18] font-bold text-sm hover:brightness-110 shadow-lg shadow-[#d4af37]/20 transition-all active:scale-95"
          >
            <CheckCircle2 size={16} />
            Turn Brass Dials
          </button>
        </div>
      </div>
    </div>
  );
};
