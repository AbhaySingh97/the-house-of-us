import React, { useEffect, useState } from 'react';
import { useGameStore, gameStore } from '../../state/gameStore';
import { GAME_CONFIG } from '../../config/gameConfig';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, RotateCcw, Eye } from 'lucide-react';

export const FinalRevealScreen: React.FC = () => {
  const { phase, flags } = useGameStore();
  const [selectedResponse, setSelectedResponse] = useState<string | null>(flags.finalAnswer);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    if (phase === 'FINAL_REVEAL') {
      // Trigger rose gold / burgundy celebratory confetti shower!
      const duration = 4000;
      const end = Date.now() + duration;

      const colors = ['#e03b62', '#ff8da1', '#ffd700', '#f43f5e', '#ffe4e6'];

      (function frame() {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    }
  }, [phase]);

  if (phase !== 'FINAL_REVEAL') return null;

  const surprise = GAME_CONFIG.narrative.finalSurprise;
  const recipient = GAME_CONFIG.names.recipientName;
  const sender = GAME_CONFIG.names.senderName;

  const handleSelectOption = (opt: string) => {
    setSelectedResponse(opt);
    gameStore.setFinalAnswer(opt);
  };

  // Minimized banner allowing user to inspect the brightened 3D sanctuary room
  if (isMinimized) {
    return (
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-bounce">
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#e03b62] to-[#ff6688] text-white font-bold shadow-2xl hover:scale-105 transition-transform"
        >
          <Heart size={18} fill="currentColor" />
          Re-open The Final Letter
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto modal-scrollable animate-fade-in font-sans">
      <div 
        className="relative w-full max-w-2xl max-h-[92dvh] overflow-y-auto modal-scrollable my-auto p-5 sm:p-10 rounded-3xl shadow-2xl border border-[#ff99bb]/50 text-[#30161d]"
        style={{
          background: 'linear-gradient(135deg, #fffbf9 0%, #fdf2f4 50%, #fae6ea 100%)',
          fontFamily: 'Georgia, serif'
        }}
      >
        {/* Top badge */}
        <div className="flex items-center justify-center gap-2 text-[#d13359] mb-3">
          <Sparkles size={20} />
          <span className="text-xs uppercase tracking-widest font-sans font-bold">
            {surprise.title}
          </span>
          <Sparkles size={20} />
        </div>

        {/* Romantic Subtitle */}
        <h1 className="text-2xl sm:text-4xl text-center font-bold text-[#42131e] mb-6">
          {surprise.subtitle}
        </h1>

        {/* Personalized Salutation */}
        <div className="text-xl sm:text-2xl text-[#801b31] font-semibold mb-4">
          Dearest {recipient},
        </div>

        {/* Letter Paragraphs */}
        <div className="space-y-4 text-base sm:text-lg leading-relaxed text-[#4a232b]">
          {surprise.paragraphs.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>

        {/* Romantic Closing */}
        <div className="mt-8 text-right font-serif">
          <p className="italic text-[#801b31] text-lg">{surprise.closing}</p>
          <p className="font-bold text-xl text-[#521724] mt-1">{sender}</p>
        </div>

        {/* Optional Final Romantic Question */}
        {surprise.questionPrompt && (
          <div className="mt-10 p-6 rounded-xl bg-white/70 border border-[#f5b8c6] shadow-sm font-sans">
            <h3 className="text-base sm:text-lg font-bold text-[#801b31] text-center mb-4 flex items-center justify-center gap-2">
              <Heart size={20} fill="#e03b62" color="#e03b62" />
              {surprise.questionPrompt}
            </h3>

            {/* Answer buttons */}
            <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
              {surprise.questionOptions?.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleSelectOption(opt)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    selectedResponse === opt
                      ? 'bg-[#e03b62] text-white shadow-lg shadow-[#e03b62]/30 scale-102'
                      : 'bg-[#fff0f3] text-[#801b31] hover:bg-[#ffe0e6] border border-[#f5b8c6]'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            {/* Feedback Response */}
            {selectedResponse && surprise.responseFeedback?.[selectedResponse] && (
              <p className="mt-4 text-center text-sm font-serif italic text-[#801b31] animate-fade-in">
                "{surprise.responseFeedback[selectedResponse]}"
              </p>
            )}
          </div>
        )}

        {/* Action Controls */}
        <div className="mt-10 pt-6 border-t border-[#f0c2cd] flex flex-wrap items-center justify-between gap-4 font-sans text-sm">
          <button
            onClick={() => setIsMinimized(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/60 hover:bg-white text-[#801b31] font-medium border border-[#f5b8c6] transition-colors"
          >
            <Eye size={16} />
            Explore The Sunlit Sanctuary
          </button>

          <button
            onClick={() => gameStore.restartGame()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#521724] text-white font-medium hover:bg-[#691f30] transition-colors ml-auto shadow-md"
          >
            <RotateCcw size={16} />
            Walk The House Again (Restart)
          </button>
        </div>
      </div>
    </div>
  );
};
