import React, { useRef, useState, useEffect } from 'react';
import { useGameStore } from '../../state/gameStore';
import { inputStore } from '../../state/inputStore';
import { Hand, Key, Eye, Sparkles, Zap } from 'lucide-react';

export const MobileControls: React.FC = () => {
  const { phase, settings, prompt, activeModal } = useGameStore();
  const [showTutorial, setShowTutorial] = useState(true);
  const [isSprintingManual, setIsSprintingManual] = useState(false);

  // Joystick state & tracking
  const joystickCenterRef = useRef<{ x: number; y: number } | null>(null);
  const joystickPointerIdRef = useRef<number | null>(null);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(false);

  // Look tracking
  const lookPointerIdRef = useRef<number | null>(null);
  const lastLookPosRef = useRef<{ x: number; y: number } | null>(null);

  // Auto-dismiss mobile tutorial after 7 seconds
  useEffect(() => {
    const t = setTimeout(() => setShowTutorial(false), 7000);
    return () => clearTimeout(t);
  }, []);

  // Cleanup on modal open or pause
  useEffect(() => {
    if (phase !== 'PLAYING' || activeModal !== null) {
      joystickPointerIdRef.current = null;
      lookPointerIdRef.current = null;
      lastLookPosRef.current = null;
      joystickCenterRef.current = null;
      setKnobPos({ x: 0, y: 0 });
      setIsMoving(false);
      inputStore.setMove(0, 0);
      inputStore.setSprint(false);
    }
  }, [phase, activeModal]);

  if (phase !== 'PLAYING' || !settings.touchControls || activeModal !== null) {
    return null;
  }

  // --- VIRTUAL JOYSTICK HANDLERS (Left Half) ---
  const handleJoystickPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (joystickPointerIdRef.current !== null) return;
    joystickPointerIdRef.current = e.pointerId;
    e.currentTarget.setPointerCapture(e.pointerId);

    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    joystickCenterRef.current = { x: cx, y: cy };

    updateJoystick(e.clientX, e.clientY);
  };

  const handleJoystickPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerId !== joystickPointerIdRef.current) return;
    updateJoystick(e.clientX, e.clientY);
  };

  const handleJoystickPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerId !== joystickPointerIdRef.current) return;
    joystickPointerIdRef.current = null;
    joystickCenterRef.current = null;
    setKnobPos({ x: 0, y: 0 });
    setIsMoving(false);
    inputStore.setMove(0, 0);
    if (!isSprintingManual) {
      inputStore.setSprint(false);
    }
  };

  const updateJoystick = (clientX: number, clientY: number) => {
    if (!joystickCenterRef.current) return;
    const dx = clientX - joystickCenterRef.current.x;
    const dy = clientY - joystickCenterRef.current.y;
    const maxRadius = 46;
    const deadzone = 5;

    const dist = Math.hypot(dx, dy);

    if (dist < deadzone) {
      setKnobPos({ x: 0, y: 0 });
      setIsMoving(false);
      inputStore.setMove(0, 0);
      return;
    }

    setIsMoving(true);

    let clampedX = dx;
    let clampedY = dy;
    if (dist > maxRadius) {
      clampedX = (dx / dist) * maxRadius;
      clampedY = (dy / dist) * maxRadius;
    }

    setKnobPos({ x: clampedX, y: clampedY });

    // Normalize: -1 to 1 (Y is inverted: up is forward)
    const normX = clampedX / maxRadius;
    const normY = -clampedY / maxRadius;

    // Auto-sprint if pushed near outer perimeter (>85%)
    const isPushedFar = dist >= maxRadius * 0.85;
    inputStore.setSprint(isSprintingManual || isPushedFar);

    inputStore.setMove(normY, normX);
  };

  // --- TOUCH LOOK CAMERA HANDLERS (Right Half) ---
  const handleLookPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (lookPointerIdRef.current !== null) return;
    lookPointerIdRef.current = e.pointerId;
    e.currentTarget.setPointerCapture(e.pointerId);
    lastLookPosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleLookPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerId !== lookPointerIdRef.current || !lastLookPosRef.current) return;
    const dx = e.clientX - lastLookPosRef.current.x;
    const dy = e.clientY - lastLookPosRef.current.y;
    lastLookPosRef.current = { x: e.clientX, y: e.clientY };

    // Feed camera rotation delta
    inputStore.addLookDelta(dx, dy);
  };

  const handleLookPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerId !== lookPointerIdRef.current) return;
    lookPointerIdRef.current = null;
    lastLookPosRef.current = null;
  };

  // --- INTERACTION BUTTON TRIGGER ---
  const handleInteractTap = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try { navigator.vibrate(25); } catch {}
    }
    inputStore.requestInteract();
  };

  const toggleSprintManual = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !isSprintingManual;
    setIsSprintingManual(next);
    inputStore.setSprint(next);
  };

  // Derive interaction prompt label & icon
  let promptVerb = 'INTERACT';
  let ActionIcon = Hand;
  if (prompt) {
    const lbl = prompt.label.toLowerCase();
    if (lbl.includes('key') || lbl.includes('unlock')) {
      ActionIcon = Key;
      promptVerb = 'UNLOCK';
    } else if (lbl.includes('read') || lbl.includes('letter') || lbl.includes('note')) {
      ActionIcon = Eye;
      promptVerb = 'READ';
    } else if (lbl.includes('examine') || lbl.includes('inspect')) {
      ActionIcon = Eye;
      promptVerb = 'INSPECT';
    } else if (lbl.includes('chest') || lbl.includes('door') || lbl.includes('box')) {
      ActionIcon = Sparkles;
      promptVerb = 'OPEN';
    } else if (lbl.includes('light') || lbl.includes('lantern') || lbl.includes('turn')) {
      ActionIcon = Sparkles;
      promptVerb = 'KINDLE';
    }
  }

  return (
    <div className="fixed inset-0 z-40 pointer-events-none select-none font-sans overflow-hidden">
      {/* Mobile Control Guide Pill */}
      {showTutorial && (
        <div 
          onClick={() => setShowTutorial(false)}
          className="pointer-events-auto absolute top-20 left-1/2 -translate-x-1/2 px-4 py-2.5 rounded-full bg-black/85 backdrop-blur-md border border-[#ffd700]/50 text-white text-xs flex items-center gap-2 cursor-pointer shadow-2xl animate-fade-in"
        >
          <span>🕹️ Left thumb to walk • Right thumb to look</span>
          <span className="text-[#ffd700] font-bold underline ml-1">Dismiss</span>
        </div>
      )}

      {/* LEFT HALF: Virtual Joystick Area */}
      <div className="pointer-events-auto absolute bottom-6 left-6 flex flex-col items-center gap-2">
        {/* Sprint Toggle Pill */}
        <button
          onClick={toggleSprintManual}
          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 backdrop-blur-md border transition-all ${
            isSprintingManual 
              ? 'bg-[#ffd700] text-black border-[#ffd700] shadow-md shadow-[#ffd700]/40' 
              : 'bg-black/50 text-white/70 border-white/20'
          }`}
          aria-label="Toggle Sprint"
        >
          <Zap size={11} fill={isSprintingManual ? 'currentColor' : 'none'} />
          Sprint {isSprintingManual ? 'ON' : 'OFF'}
        </button>

        {/* Joystick Base Ring */}
        <div
          onPointerDown={handleJoystickPointerDown}
          onPointerMove={handleJoystickPointerMove}
          onPointerUp={handleJoystickPointerUp}
          onPointerCancel={handleJoystickPointerUp}
          className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-black/45 backdrop-blur-md border-2 border-white/25 flex items-center justify-center shadow-2xl touch-none active:border-[#ffd700]/60"
        >
          {/* Inner Deadzone Ring Guide */}
          <div className="absolute w-12 h-12 rounded-full border border-white/10 pointer-events-none" />

          {/* Movable Thumb Knob */}
          <div
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-lg flex items-center justify-center transition-transform duration-75 pointer-events-none ${
              isMoving
                ? 'bg-gradient-to-tr from-[#ffd700] via-[#f59e0b] to-[#d97706] ring-2 ring-white/50 scale-105'
                : 'bg-gradient-to-tr from-[#d4af37] to-[#8c7324] ring-1 ring-white/30'
            }`}
            style={{
              transform: `translate3d(${knobPos.x}px, ${knobPos.y}px, 0)`
            }}
          >
            <div className="w-5 h-5 rounded-full bg-black/20" />
          </div>
        </div>
      </div>

      {/* RIGHT HALF: Drag-to-Look Region (Excludes button zone) */}
      <div
        onPointerDown={handleLookPointerDown}
        onPointerMove={handleLookPointerMove}
        onPointerUp={handleLookPointerUp}
        onPointerCancel={handleLookPointerUp}
        className="pointer-events-auto absolute top-16 right-0 bottom-28 w-1/2 touch-none cursor-grab active:cursor-grabbing"
      />

      {/* DEDICATED LARGE INTERACTION BUTTON (Lower Right Thumb Reach) */}
      <div className="pointer-events-auto absolute bottom-6 right-6 sm:bottom-8 sm:right-8">
        <button
          onClick={handleInteractTap}
          onTouchStart={handleInteractTap}
          className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all duration-150 active:scale-90 touch-none select-none ${
            prompt
              ? 'bg-gradient-to-tr from-[#ffd700] via-[#f59e0b] to-[#d97706] text-[#1c120c] ring-4 ring-[#ffd700]/60 shadow-[0_0_28px_rgba(255,215,0,0.6)] scale-105 animate-pulse'
              : 'bg-black/65 backdrop-blur-md text-white/70 border-2 border-white/20 active:border-[#ffd700]/50'
          }`}
          aria-label={prompt ? prompt.label : "Look around"}
        >
          <ActionIcon size={prompt ? 26 : 22} />
          <span className="text-[10px] font-black uppercase tracking-wider mt-1 text-center px-1 leading-none">
            {prompt ? promptVerb : 'LOOK'}
          </span>
        </button>
      </div>
    </div>
  );
};
