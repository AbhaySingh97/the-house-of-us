import React from 'react';
import { useGameStore, gameStore } from '../../state/gameStore';
import { GAME_CONFIG } from '../../config/gameConfig';
import { X, Feather } from 'lucide-react';

export const LetterModal: React.FC = () => {
  const { activeModal } = useGameStore();

  if (
    activeModal !== 'WELCOME_NOTE' &&
    activeModal !== 'LETTER_MEMORY' &&
    activeModal !== 'LETTER_LIBRARY' &&
    activeModal !== 'LETTER_GARDEN'
  ) {
    return null;
  }

  let title = '';
  let date = '';
  let paragraphs: string[] = [];
  let signature = '';
  let hint = '';

  if (activeModal === 'WELCOME_NOTE') {
    const data = GAME_CONFIG.narrative.welcomeNote;
    title = data.title;
    paragraphs = data.body;
    signature = data.signature;
  } else if (activeModal === 'LETTER_MEMORY') {
    const data = GAME_CONFIG.narrative.letters.memoryRoom;
    title = data.title;
    date = data.date;
    paragraphs = data.body;
    signature = `Yours, ${GAME_CONFIG.names.senderName}`;
    hint = data.hint;
  } else if (activeModal === 'LETTER_LIBRARY') {
    const data = GAME_CONFIG.narrative.letters.library;
    title = data.title;
    date = data.date;
    paragraphs = data.body;
    signature = `Yours, ${GAME_CONFIG.names.senderName}`;
    hint = data.hint;
  } else if (activeModal === 'LETTER_GARDEN') {
    const data = GAME_CONFIG.narrative.letters.conservatory;
    title = data.title;
    date = data.date;
    paragraphs = data.body;
    signature = `Yours, ${GAME_CONFIG.names.senderName}`;
    hint = data.hint;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-serif">
      <div 
        className="relative w-full max-w-lg max-h-[90dvh] overflow-y-auto modal-scrollable p-5 sm:p-8 rounded-2xl shadow-2xl border border-[#d4af37]/40"
        style={{
          background: 'linear-gradient(135deg, #fdfbf7 0%, #f4eee2 100%)',
          color: '#2d1810',
          fontFamily: 'Georgia, serif'
        }}
      >
        {/* Close Button */}
        <button
          onClick={() => gameStore.closeModal()}
          className="absolute top-3 right-3 w-10 h-10 flex items-center justify-center rounded-full text-[#7a4e32] hover:bg-[#ebdcc8] active:scale-90 transition-all"
          aria-label="Close letter"
        >
          <X size={22} />
        </button>

        {/* Wax Seal / Header Icon */}
        <div className="flex items-center gap-2 mb-3 text-[#8a3324]">
          <Feather size={18} />
          <span className="text-[11px] tracking-widest uppercase font-sans font-semibold">
            {date || "A Handwritten Note"}
          </span>
        </div>

        {/* Letter Title */}
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#3b1c11] mb-4 pb-2 border-b border-[#d8c2ad]">
          {title}
        </h2>

        {/* Letter Content */}
        <div className="space-y-3 text-sm sm:text-base leading-relaxed text-[#402217]">
          {paragraphs.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>

        {/* Optional Hint Callout */}
        {hint && (
          <div className="mt-5 p-3 rounded-xl bg-[#ebd7c2]/60 border-l-4 border-[#8a3324] text-xs sm:text-sm text-[#5a2e1d] italic">
            <span className="font-semibold not-italic font-sans">A Subtle Whisper: </span>
            {hint}
          </div>
        )}

        {/* Signature */}
        {signature && (
          <div className="mt-6 text-right font-serif italic text-base sm:text-lg text-[#5a2618]">
            {signature}
          </div>
        )}

        {/* Bottom Close Action */}
        <div className="mt-6 pt-4 border-t border-[#d8c2ad] flex justify-end">
          <button
            onClick={() => gameStore.closeModal()}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#3b1c11] text-[#f7eee2] font-sans text-sm tracking-wider hover:bg-[#522919] active:scale-95 transition-all text-center"
          >
            Fold and Return
          </button>
        </div>
      </div>
    </div>
  );
};
