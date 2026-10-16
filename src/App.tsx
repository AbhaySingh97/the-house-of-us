import React, { useEffect } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { HouseScene } from './components/canvas/HouseScene';
import { MainMenu } from './components/ui/MainMenu';
import { HUD } from './components/ui/HUD';
import { MobileControls } from './components/ui/MobileControls';
import { LetterModal } from './components/ui/LetterModal';
import { MemoryPuzzleModal } from './components/ui/puzzles/MemoryPuzzleModal';
import { LibraryPuzzleModal } from './components/ui/puzzles/LibraryPuzzleModal';
import { FinalPuzzleModal } from './components/ui/puzzles/FinalPuzzleModal';
import { HintModal } from './components/ui/HintModal';
import { PauseMenu } from './components/ui/PauseMenu';
import { FinalRevealScreen } from './components/ui/FinalRevealScreen';
import { gameStore, useGameStore } from './state/gameStore';

export const App: React.FC = () => {
  const { settings } = useGameStore();
  // Auto-detect mobile touch environment
  useEffect(() => {
    const enableTouch = () => {
      if (!gameStore.getState().settings.touchControls) {
        gameStore.updateSettings({ touchControls: true });
      }
    };

    window.addEventListener('touchstart', enableTouch, { passive: true, once: true });

    const handleResize = () => {
      if (window.innerWidth <= 840 && !gameStore.getState().settings.touchControls) {
        gameStore.updateSettings({ touchControls: true });
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('touchstart', enableTouch);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-[#0d070a]">
      {/* 3D Scene Viewport with adaptive performance & tone mapping */}
      <Canvas
        shadows={settings.quality !== 'low'}
        dpr={
          settings.quality === 'low'
            ? [1, 1.0]
            : settings.quality === 'medium'
            ? [1, 1.25]
            : [1, Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 1.75)]
        }
        camera={{
          fov: 72,
          near: 0.1,
          far: 90,
          position: [0, 1.65, 2.2]
        }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.18
        }}
        className="w-full h-full"
      >
        <HouseScene />
      </Canvas>

      {/* --- UI & MODAL LAYERS --- */}
      {/* Main Menu */}
      <MainMenu />

      {/* In-Game HUD (Reticle, Objectives, Room Pill, Prompts) */}
      <HUD />

      {/* Mobile Touch Controls (Virtual Joystick & Touch Look) */}
      <MobileControls />

      {/* Story Letter Inspector */}
      <LetterModal />

      {/* Chapter 2: Keepsake Box Puzzle */}
      <MemoryPuzzleModal />

      {/* Chapter 3: Combination Lock Puzzle */}
      <LibraryPuzzleModal />

      {/* Chapter 5: Final Sanctuary Puzzle */}
      <FinalPuzzleModal />

      {/* 3-Tier Progressive Hint Modal */}
      <HintModal />

      {/* Pause Menu */}
      <PauseMenu />

      {/* Chapter 5: Final Romantic Reveal & Proposal */}
      <FinalRevealScreen />
    </div>
  );
};

export default App;
