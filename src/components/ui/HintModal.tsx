import React, { useState } from 'react';
import { useGameStore, gameStore, getActionableObjective } from '../../state/gameStore';
import { Lightbulb, X, Lock, CheckCircle2, AlertTriangle, ChevronRight, HelpCircle } from 'lucide-react';
import { soundEngine } from '../../audio/soundEngine';

export const HintModal: React.FC = () => {
  const state = useGameStore();
  const { activeModal, unlockedHints } = state;
  const [confirmTier3, setConfirmTier3] = useState(false);

  if (activeModal !== 'HINTS') return null;

  const obj = getActionableObjective(state);
  const currentTier = unlockedHints[obj.hintKey] || 1; // Default to Tier 1 unlocked for immediate guidance

  const handleClose = () => {
    gameStore.closeModal();
  };

  const handleUnlock = (tier: number) => {
    if (tier === 3 && !confirmTier3 && currentTier < 3) {
      setConfirmTier3(true);
      return;
    }
    soundEngine.playChime();
    gameStore.unlockHintTier(obj.hintKey, tier);
    setConfirmTier3(false);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in font-sans"
      onClick={handleClose}
    >
      <div 
        className="relative w-full max-w-lg max-h-[92dvh] overflow-y-auto modal-scrollable p-5 sm:p-7 rounded-2xl bg-[#1c1514] border-2 border-[#d4af37]/60 text-[#f7ede2] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-[#d4af37] hover:text-white transition-colors cursor-pointer"
          aria-label="Close Hints"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-9 h-9 rounded-full bg-[#d4af37]/20 border border-[#d4af37] flex items-center justify-center text-[#d4af37]">
            <Lightbulb size={20} />
          </div>
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#d4af37]">
              {obj.chapter}
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#fff7ed]">
              Contextual Guidance
            </h2>
          </div>
        </div>

        {/* Current Objective Card */}
        <div className="my-4 p-3.5 rounded-xl bg-black/50 border border-white/10">
          <div className="flex items-center gap-1.5 text-xs text-[#d4af37] font-semibold mb-1">
            <HelpCircle size={14} />
            <span>Current Goal:</span>
          </div>
          <p className="text-sm text-[#f5ebe1] font-medium leading-relaxed">
            {obj.task}
          </p>
          <div className="mt-2 text-xs text-[#c9b5a5]">
            <span className="text-[#e6c158] font-semibold">Immediate Next Action: </span>
            {obj.nextAction}
          </div>
        </div>

        {/* 3-Tier Progressive Hint Levels */}
        <div className="space-y-3 my-4">
          {/* TIER 1: NUDGE */}
          <div className="p-3.5 rounded-xl bg-[#261b17] border border-[#d4af37]/30 transition-all">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#e6c158] flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-400" />
                Tier 1: Subtle Nudge
              </span>
              <span className="text-[10px] text-[#a89585]">Area Hint</span>
            </div>
            <p className="text-xs sm:text-sm text-[#f0e4d8] leading-relaxed">
              {obj.hints[0]}
            </p>
          </div>

          {/* TIER 2: DIRECTION */}
          <div className={`p-3.5 rounded-xl border transition-all ${
            currentTier >= 2 
              ? 'bg-[#261b17] border-[#d4af37]/30' 
              : 'bg-[#18110f] border-white/5 opacity-80'
          }`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#e6c158] flex items-center gap-1.5">
                {currentTier >= 2 ? (
                  <CheckCircle2 size={14} className="text-emerald-400" />
                ) : (
                  <Lock size={14} className="text-[#a89585]" />
                )}
                Tier 2: Guided Direction
              </span>
              <span className="text-[10px] text-[#a89585]">Mechanism Hint</span>
            </div>

            {currentTier >= 2 ? (
              <p className="text-xs sm:text-sm text-[#f0e4d8] leading-relaxed">
                {obj.hints[1]}
              </p>
            ) : (
              <button
                onClick={() => handleUnlock(2)}
                className="w-full mt-1 py-2 px-3 rounded-lg bg-[#38261e] hover:bg-[#4a3329] text-[#ffd700] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Reveal Guided Direction</span>
                <ChevronRight size={14} />
              </button>
            )}
          </div>

          {/* TIER 3: EXPLICIT SOLUTION */}
          <div className={`p-3.5 rounded-xl border transition-all ${
            currentTier >= 3 
              ? 'bg-[#261b17] border-rose-500/40' 
              : 'bg-[#18110f] border-white/5 opacity-80'
          }`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#ff99aa] flex items-center gap-1.5">
                {currentTier >= 3 ? (
                  <CheckCircle2 size={14} className="text-rose-400" />
                ) : (
                  <AlertTriangle size={14} className="text-amber-400" />
                )}
                Tier 3: Direct Solution
              </span>
              <span className="text-[10px] text-[#a89585]">Explicit Walkthrough</span>
            </div>

            {currentTier >= 3 ? (
              <p className="text-xs sm:text-sm text-[#ffe4ea] font-medium leading-relaxed bg-[#36161c] p-2.5 rounded-lg border border-rose-500/30">
                {obj.hints[2]}
              </p>
            ) : confirmTier3 ? (
              <div className="mt-2 p-2.5 rounded-lg bg-[#3b1c20] border border-rose-500/50 space-y-2 text-center animate-fade-in">
                <span className="text-xs text-[#fecdd3] block font-medium">
                  This will explicitly reveal the exact solution. Reveal now?
                </span>
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => setConfirmTier3(false)}
                    className="px-3 py-1 rounded bg-[#241215] text-xs text-[#e2c4c8]"
                  >
                    Keep Mystery
                  </button>
                  <button
                    onClick={() => handleUnlock(3)}
                    className="px-4 py-1 rounded bg-[#e03b62] hover:bg-[#ff4d79] text-white text-xs font-bold"
                  >
                    Show Solution
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => handleUnlock(3)}
                className="w-full mt-1 py-2 px-3 rounded-lg bg-[#3d1820] hover:bg-[#52202b] text-[#ff99aa] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Reveal Explicit Solution</span>
                <ChevronRight size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Footer Dismiss Button */}
        <div className="mt-5 pt-3 border-t border-[#3b2a24] flex justify-end">
          <button
            onClick={handleClose}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#e6c158] text-[#1c1412] font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-lg cursor-pointer"
          >
            Return to Exploration
          </button>
        </div>
      </div>
    </div>
  );
};
