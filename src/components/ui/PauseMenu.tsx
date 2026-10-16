import React, { useState } from 'react';
import { useGameStore, gameStore } from '../../state/gameStore';
import { Play, Volume2, VolumeX, RotateCcw, X, Smartphone, Sparkles } from 'lucide-react';

export const PauseMenu: React.FC = () => {
  const { phase, settings } = useGameStore();
  const [confirmRestart, setConfirmRestart] = useState(false);

  if (phase !== 'PAUSED') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in font-sans">
      <div className="relative w-full max-w-md max-h-[92dvh] overflow-y-auto modal-scrollable p-5 sm:p-8 rounded-2xl bg-[#1c1412] border border-[#d4af37]/40 text-[#f7ede2] shadow-2xl">
        <button
          onClick={() => gameStore.setPhase('PLAYING')}
          className="absolute top-4 right-4 p-2 text-[#d4af37] hover:text-white"
          aria-label="Resume"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-6">
          <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
            Game Paused
          </span>
          <h2 className="text-2xl font-serif font-bold text-[#fff5ea] mt-1">
            The House of Us
          </h2>
        </div>

        {/* Audio and Sensitivity Settings */}
        <div className="space-y-4 mb-6 text-sm">
          {/* Master Volume */}
          <div>
            <div className="flex justify-between text-xs text-[#d8c7b8] mb-1">
              <span>Master Volume</span>
              <span>{Math.round(settings.masterVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.masterVolume}
              onChange={(e) => gameStore.updateSettings({ masterVolume: parseFloat(e.target.value) })}
              className="w-full accent-[#d4af37]"
            />
          </div>

          {/* Music Volume */}
          <div>
            <div className="flex justify-between text-xs text-[#d8c7b8] mb-1">
              <span>Music & Ambience</span>
              <span>{Math.round(settings.musicVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.musicVolume}
              onChange={(e) => gameStore.updateSettings({ musicVolume: parseFloat(e.target.value) })}
              className="w-full accent-[#d4af37]"
            />
          </div>

          {/* Mouse / Touch Look Sensitivity */}
          <div>
            <div className="flex justify-between text-xs text-[#d8c7b8] mb-1">
              <span>Look Sensitivity</span>
              <span>{settings.mouseSensitivity.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.4"
              max="2.5"
              step="0.1"
              value={settings.mouseSensitivity}
              onChange={(e) => gameStore.updateSettings({ mouseSensitivity: parseFloat(e.target.value) })}
              className="w-full accent-[#d4af37]"
            />
          </div>

          {/* Toggles */}
          <div className="pt-2 border-t border-[#3b2a24] space-y-2">
            {/* Mute Toggle */}
            <label className="flex items-center justify-between cursor-pointer text-xs text-[#d8c7b8]">
              <span className="flex items-center gap-2">
                {settings.muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                Mute All Audio
              </span>
              <input
                type="checkbox"
                checked={settings.muted}
                onChange={(e) => gameStore.updateSettings({ muted: e.target.checked })}
                className="accent-[#d4af37] w-4 h-4 rounded"
              />
            </label>

            {/* Mobile Touch Controls On/Off */}
            <label className="flex items-center justify-between cursor-pointer text-xs text-[#d8c7b8]">
              <span className="flex items-center gap-2">
                <Smartphone size={16} />
                On-screen Touch Joystick
              </span>
              <input
                type="checkbox"
                checked={settings.touchControls}
                onChange={(e) => gameStore.updateSettings({ touchControls: e.target.checked })}
                className="accent-[#d4af37] w-4 h-4 rounded"
              />
            </label>

            {/* Graphics Performance Quality */}
            <div className="pt-2 border-t border-[#3b2a24]/60">
              <div className="flex justify-between text-xs text-[#d8c7b8] mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Sparkles size={14} className="text-[#d4af37]" />
                  Graphics Quality
                </span>
                <span className="uppercase font-mono text-[10px] text-[#d4af37]">
                  {settings.quality}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {(['low', 'medium', 'high'] as const).map((q) => (
                  <button
                    key={q}
                    onClick={() => gameStore.updateSettings({ quality: q })}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                      settings.quality === q
                        ? 'bg-[#d4af37] text-[#1c1412] shadow-md font-bold'
                        : 'bg-[#2a1c18] hover:bg-[#382620] text-[#c9b5a5]'
                    }`}
                  >
                    {q === 'low' ? 'Low' : q === 'medium' ? 'Medium' : 'High'}
                  </button>
                ))}
              </div>
              <div className="text-[10px] text-[#a89585] mt-1 text-center">
                {settings.quality === 'low' && 'Optimized for smooth framerate on all devices (Shadows off).'}
                {settings.quality === 'medium' && 'Balanced visuals and performance.'}
                {settings.quality === 'high' && 'Full soft shadows, max dynamic range, and particles.'}
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={() => gameStore.setPhase('PLAYING')}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#e6c158] text-[#1c1412] font-bold text-sm flex items-center justify-center gap-2 hover:brightness-110 shadow-lg shadow-[#d4af37]/20 transition-all"
          >
            <Play size={18} fill="currentColor" />
            Resume Journey
          </button>

          {!confirmRestart ? (
            <button
              onClick={() => setConfirmRestart(true)}
              className="w-full py-2.5 rounded-xl bg-[#2a1c18] hover:bg-[#382620] text-[#c9b5a5] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw size={14} />
              Restart Game From Beginning
            </button>
          ) : (
            <div className="p-3 rounded-xl bg-[#36161b] border border-[#a83244] text-center space-y-2 animate-fade-in">
              <span className="text-xs text-[#fca5a5] block font-medium">
                Restart will reset all doors and puzzles. Are you sure?
              </span>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => setConfirmRestart(false)}
                  className="px-3 py-1 rounded bg-[#2b181c] text-xs text-[#e2c4c8]"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setConfirmRestart(false);
                    gameStore.restartGame();
                  }}
                  className="px-4 py-1 rounded bg-[#e03b62] text-white text-xs font-bold"
                >
                  Yes, Restart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
