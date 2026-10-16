import React, { useState } from 'react';
import { useGameStore, gameStore } from '../../state/gameStore';
import { GAME_CONFIG } from '../../config/gameConfig';
import { Play, Sparkles, Volume2, Info } from 'lucide-react';

export const MainMenu: React.FC = () => {
  const { phase } = useGameStore();
  const [showStory, setShowStory] = useState(false);

  if (phase !== 'MENU') return null;

  const handleStart = () => {
    gameStore.setPhase('PLAYING');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-gradient-to-b from-[#140c0f] via-[#1a0e14] to-[#0d070a] text-[#f7ede2] font-sans overflow-y-auto modal-scrollable">
      {/* Subtle background glow */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-[#e03b62]/10 blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-xl max-h-[92dvh] overflow-y-auto modal-scrollable p-6 sm:p-12 rounded-3xl bg-[#1f1217]/95 backdrop-blur-xl border border-[#d4af37]/40 shadow-2xl text-center">
        {/* Top Emblem */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#331520] border border-[#d4af37]/40 text-[#f2cb6b] text-xs font-semibold uppercase tracking-widest mb-6">
          <Sparkles size={14} />
          {GAME_CONFIG.names.recipientName ? `Prepared for ${GAME_CONFIG.names.recipientName}` : 'A 3D Romantic Adventure'}
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl font-serif font-bold tracking-tight text-[#fff5ea] mb-3 drop-shadow-md">
          {GAME_CONFIG.meta.gameTitle}
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base font-serif italic text-[#e6b8c2] mb-8 max-w-md mx-auto leading-relaxed">
          {GAME_CONFIG.meta.subTitle}
        </p>

        {/* Narrative Preface Modal / View */}
        {showStory ? (
          <div className="p-6 rounded-2xl bg-[#2a141d] border border-[#d4af37]/30 text-left text-sm text-[#ecd0d8] space-y-3 mb-8 animate-fade-in font-serif leading-relaxed">
            <h3 className="text-base font-bold text-[#f7deb3] font-sans flex items-center gap-2">
              <Info size={16} />
              {GAME_CONFIG.narrative.introGreeting}
            </h3>
            {GAME_CONFIG.narrative.introParagraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <button
              onClick={() => setShowStory(false)}
              className="text-xs font-sans text-[#ffd700] underline mt-2 block"
            >
              Hide Story Overview
            </button>
          </div>
        ) : (
          <div className="flex justify-center mb-8">
            <button
              onClick={() => setShowStory(true)}
              className="text-xs text-[#d8a8b5] hover:text-[#ffd700] transition-colors flex items-center gap-1.5"
            >
              <Info size={14} />
              Read The Invitation Note
            </button>
          </div>
        )}

        {/* Controls Quick Summary Card */}
        <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-xs text-[#cfbcad] mb-8 text-left grid grid-cols-2 gap-3">
          <div>
            <span className="font-bold text-[#ffd700] block mb-1">🖥️ Desktop:</span>
            <ul className="space-y-0.5 text-[11px]">
              <li>• <strong>W, A, S, D</strong> to walk</li>
              <li>• <strong>Mouse</strong> to look</li>
              <li>• <strong>E</strong> to interact / inspect</li>
              <li>• <strong>Esc</strong> to pause</li>
            </ul>
          </div>
          <div>
            <span className="font-bold text-[#ffd700] block mb-1">📱 Mobile:</span>
            <ul className="space-y-0.5 text-[11px]">
              <li>• Left stick to walk</li>
              <li>• Right drag to look</li>
              <li>• Tap <strong>[Interact]</strong> button</li>
            </ul>
          </div>
        </div>

        {/* Main CTA: Begin Journey */}
        <button
          onClick={handleStart}
          className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-[#d4af37] via-[#f0ca65] to-[#d4af37] text-[#1f1217] font-bold text-base tracking-wider uppercase flex items-center justify-center gap-3 hover:brightness-110 shadow-xl shadow-[#d4af37]/25 transition-all active:scale-98 mx-auto"
        >
          <Play size={20} fill="currentColor" />
          Step Into The House
        </button>

        {/* Audio Notice */}
        <p className="text-[11px] text-[#8f757d] mt-4 flex items-center justify-center gap-1.5">
          <Volume2 size={13} />
          Includes procedural ambient rain and romantic music
        </p>
      </div>
    </div>
  );
};
