import React, { useState } from 'react';
import { useGameStore, gameStore } from '../../../state/gameStore';
import { GAME_CONFIG } from '../../../config/gameConfig';
import { X, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';
import { soundEngine } from '../../../audio/soundEngine';

export const FinalPuzzleModal: React.FC = () => {
  const { activeModal } = useGameStore();
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);

  if (activeModal !== 'FINAL_PUZZLE') return null;

  const puzzleData = GAME_CONFIG.puzzles.finalRiddle;

  const handleToggleWord = (wordId: string) => {
    soundEngine.playChime();
    setFeedback(null);

    if (selectedWords.includes(wordId)) {
      setSelectedWords(selectedWords.filter(w => w !== wordId));
      return;
    }

    if (selectedWords.length < 3) {
      setSelectedWords([...selectedWords, wordId]);
    }
  };

  const handleConfirm = () => {
    if (selectedWords.length < 3) {
      setFeedback("Please choose the three pillars that define our journey.");
      soundEngine.playError();
      return;
    }

    const isCorrect =
      selectedWords[0] === puzzleData.correctSequence[0] &&
      selectedWords[1] === puzzleData.correctSequence[1] &&
      selectedWords[2] === puzzleData.correctSequence[2];

    if (isCorrect) {
      gameStore.solveFinalRiddle();
    } else {
      soundEngine.playError();
      setFeedback("The chest pulses with a gentle glow, waiting for the true pillars of our path.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in font-sans">
      <div className="relative w-full max-w-lg max-h-[92dvh] overflow-y-auto modal-scrollable p-4 sm:p-8 rounded-2xl bg-gradient-to-b from-[#2a131b] via-[#1a0a10] to-[#12050b] border border-[#ff99bb]/40 text-[#fdf2f4] shadow-2xl">
        <button
          onClick={() => gameStore.closeModal()}
          className="absolute top-4 right-4 p-2 text-[#ff99bb] hover:text-white"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3d1825] border border-[#ff80a0]/30 text-xs font-semibold text-[#ffc2d1] mb-2">
            <Sparkles size={14} />
            Chapter V: The Sanctuary of Us
          </div>
          <h2 className="text-xl sm:text-3xl font-serif font-bold text-[#ffccd7]">
            {puzzleData.title}
          </h2>
          <p className="text-xs text-[#eed0d7] mt-1.5 max-w-sm mx-auto leading-relaxed">
            {puzzleData.prompt}
          </p>
        </div>

        {/* Selected Sequence Slots */}
        <div className="flex justify-center gap-2 sm:gap-4 mb-5">
          {[0, 1, 2].map((idx) => {
            const wordId = selectedWords[idx];
            const opt = wordId ? puzzleData.options.find(o => o.id === wordId) : null;

            return (
              <div
                key={idx}
                onClick={() => {
                  if (wordId) setSelectedWords(selectedWords.filter(w => w !== wordId));
                }}
                className={`w-[96px] h-[112px] sm:w-28 sm:h-32 rounded-xl border-2 flex flex-col items-center justify-center p-1.5 sm:p-2 text-center transition-all cursor-pointer active:scale-95 ${
                  opt
                    ? 'border-[#ff80a0] bg-[#421626] shadow-lg shadow-[#ff80a0]/20'
                    : 'border-dashed border-[#592636] bg-[#210912]/80 hover:border-[#8c3552]'
                }`}
              >
                <span className="text-[9px] sm:text-[10px] text-[#cca0ac] uppercase tracking-wider mb-0.5 font-mono">
                  Pillar {idx + 1}
                </span>

                {opt ? (
                  <>
                    <span className="text-2xl mb-0.5">{opt.symbol}</span>
                    <span className="text-xs font-bold text-[#ffe0e8] tracking-wider leading-tight">
                      {opt.word}
                    </span>
                    <span className="text-[9px] sm:text-[10px] text-[#ff99bb] mt-0.5">
                      {opt.theme}
                    </span>
                  </>
                ) : (
                  <span className="text-[11px] sm:text-xs text-[#733647] italic">
                    Touch a Pillar
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Available Options to Select */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5 mb-5">
          {puzzleData.options.map((opt) => {
            const isSelected = selectedWords.includes(opt.id);
            return (
              <button
                key={opt.id}
                onClick={() => handleToggleWord(opt.id)}
                className={`p-2.5 sm:p-3 rounded-xl border text-center transition-all flex flex-col items-center min-h-[50px] active:scale-95 ${
                  isSelected
                    ? 'border-[#ff80a0] bg-[#3b1220] opacity-60'
                    : 'border-[#592636] bg-[#2b0e1a] hover:border-[#ff99bb] hover:bg-[#381423]'
                }`}
              >
                <span className="text-2xl mb-0.5">{opt.symbol}</span>
                <span className="text-xs font-bold text-[#fce7ec] tracking-wider">
                  {opt.word}
                </span>
                <span className="text-[10px] text-[#cca0ac]">
                  {opt.theme}
                </span>
              </button>
            );
          })}
        </div>

        {/* Feedback message */}
        {feedback && (
          <div className="mb-4 p-2.5 rounded-lg bg-[#3b101c] border border-[#a82540] text-xs text-[#fca5a5] text-center">
            {feedback}
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-[#4d1928]">
          <button
            onClick={() => setSelectedWords([])}
            className="flex items-center justify-center gap-1 px-4 py-2 rounded-xl text-xs text-[#cca0ac] hover:text-white hover:bg-[#381220] active:scale-95 transition-all"
          >
            <RotateCcw size={14} />
            Clear
          </button>

          <button
            onClick={handleConfirm}
            className="flex items-center justify-center gap-2 px-6 py-3 sm:py-2.5 rounded-xl bg-gradient-to-r from-[#e03b62] via-[#ff6688] to-[#ff85a1] text-white font-bold text-sm hover:brightness-110 shadow-lg shadow-[#ff4d79]/30 transition-all active:scale-95"
          >
            <CheckCircle2 size={16} />
            Awaken Celestial Chest
          </button>
        </div>
      </div>
    </div>
  );
};
