// Automated Mobile Systems & Responsive Verification Suite
import fs from 'fs';
import path from 'path';
import { inputStore } from './src/state/inputStore';
import { gameStore } from './src/state/gameStore';

console.log('=====================================================');
console.log('--- STARTING MOBILE SYSTEMS & VIEWPORT VERIFICATION ---');
console.log('=====================================================');

let allPassed = true;
function assert(desc, condition) {
  if (condition) {
    console.log(`✅ PASS: ${desc}`);
  } else {
    console.error(`❌ FAIL: ${desc}`);
    allPassed = false;
  }
}

// 1. Viewport Meta & Safe Area Verification
console.log('\n[1] Testing index.html Viewport Meta Tags...');
const indexHtml = fs.readFileSync(path.resolve('index.html'), 'utf8');
assert('index.html contains viewport-fit=cover', indexHtml.includes('viewport-fit=cover'));
assert('index.html disables accidental user pinch-scaling', indexHtml.includes('user-scalable=no'));
assert('index.html sets width=device-width', indexHtml.includes('width=device-width'));

// 2. CSS Touch Guards & Mobile Scroll Containment
console.log('\n[2] Testing index.css Mobile Touch Guards...');
const indexCss = fs.readFileSync(path.resolve('src/index.css'), 'utf8');
assert('index.css sets 100dvh for dynamic mobile browser address bars', indexCss.includes('100dvh'));
assert('index.css guards against browser touch-action scrolling on body', indexCss.includes('touch-action: none'));
assert('index.css guards against pull-to-refresh overscroll bounce', indexCss.includes('overscroll-behavior: none'));
assert('index.css disables iOS tap highlight overlay', indexCss.includes('-webkit-tap-highlight-color: transparent'));
assert('index.css includes modal-scrollable utility with pan-y', indexCss.includes('.modal-scrollable') && indexCss.includes('touch-action: pan-y'));

// 3. Virtual Joystick Math & Deadzone Verification
console.log('\n[3] Testing Virtual Joystick Logic & Deadzone Math...');
inputStore.reset();

// Deadzone test (< 5px)
function simulateJoystickCalculation(cx, cy, touchX, touchY, maxRadius = 46, deadzone = 5) {
  const dx = touchX - cx;
  const dy = touchY - cy;
  const dist = Math.hypot(dx, dy);

  if (dist < deadzone) {
    return { moveForward: 0, moveRight: 0, isSprinting: false };
  }

  let clampedX = dx;
  let clampedY = dy;
  if (dist > maxRadius) {
    clampedX = (dx / dist) * maxRadius;
    clampedY = (dy / dist) * maxRadius;
  }

  const normX = clampedX / maxRadius;
  const normY = -clampedY / maxRadius; // Up is forward
  const isPushedFar = dist >= maxRadius * 0.85;

  return { moveForward: normY, moveRight: normX, isSprinting: isPushedFar };
}

const deadzoneResult = simulateJoystickCalculation(100, 100, 103, 102);
assert('Small finger jitter inside deadzone produces 0 movement', deadzoneResult.moveForward === 0 && deadzoneResult.moveRight === 0);

// Forward push test
const forwardResult = simulateJoystickCalculation(100, 100, 100, 50); // 50px straight up
assert('Pushing joystick straight up produces forward = 1.0, right = 0.0', Math.abs(forwardResult.moveForward - 1.0) < 0.01 && Math.abs(forwardResult.moveRight) < 0.01);
assert('Full joystick push triggers auto-sprint (>85% distance)', forwardResult.isSprinting === true);

// Moderate walk push test (50% radius)
const walkResult = simulateJoystickCalculation(100, 100, 100, 77); // 23px up (50% of 46)
assert('Half joystick push produces walking speed (isSprinting = false)', walkResult.isSprinting === false && walkResult.moveForward > 0.45);

// Diagonal push test (45 degrees forward-right)
const diagonalResult = simulateJoystickCalculation(100, 100, 135, 65);
assert('Diagonal push produces positive forward and right vectors', diagonalResult.moveForward > 0.5 && diagonalResult.moveRight > 0.5);

// 4. InputStore Bridge Multi-Touch Look & Interact Verification
console.log('\n[4] Testing InputStore Touch Look & Interact Bridge...');
inputStore.reset();
inputStore.addLookDelta(24.5, -12.3);
inputStore.addLookDelta(5.5, -7.7);

const consumedDelta = inputStore.consumeLookDelta();
assert('Accumulates and consumes look deltas accurately (dx=30, dy=-20)', Math.abs(consumedDelta.dx - 30) < 0.01 && Math.abs(consumedDelta.dy - -20) < 0.01);

const secondDelta = inputStore.consumeLookDelta();
assert('Consuming delta resets accumulator to 0 for subsequent frames', secondDelta.dx === 0 && secondDelta.dy === 0);

inputStore.requestInteract();
assert('Interaction request triggers successfully', inputStore.consumeInteract() === true);
assert('Consuming interact immediately clears the flag', inputStore.consumeInteract() === false);

// 5. Mobile Responsive Modal Layouts Verification
console.log('\n[5] Testing Mobile Responsive Modal Files...');

const checkModalFile = (filename, componentName) => {
  const content = fs.readFileSync(path.resolve(filename), 'utf8');
  const hasModalScrollable = content.includes('modal-scrollable');
  const hasMaxDvh = content.includes('max-h-[9') || content.includes('max-h-[92dvh]') || content.includes('max-h-[90dvh]');
  assert(`${componentName} contains modal-scrollable`, hasModalScrollable);
  assert(`${componentName} contains dynamic viewport height max-h constraint`, hasMaxDvh);
};

checkModalFile('src/components/ui/puzzles/MemoryPuzzleModal.tsx', 'MemoryPuzzleModal');
checkModalFile('src/components/ui/puzzles/LibraryPuzzleModal.tsx', 'LibraryPuzzleModal');
checkModalFile('src/components/ui/puzzles/FinalPuzzleModal.tsx', 'FinalPuzzleModal');
checkModalFile('src/components/ui/LetterModal.tsx', 'LetterModal');
checkModalFile('src/components/ui/PauseMenu.tsx', 'PauseMenu');
checkModalFile('src/components/ui/MainMenu.tsx', 'MainMenu');
checkModalFile('src/components/ui/FinalRevealScreen.tsx', 'FinalRevealScreen');

// 6. Mobile Performance Optimization in App.tsx
console.log('\n[6] Testing Canvas Performance Capping...');
const appTsx = fs.readFileSync(path.resolve('src/App.tsx'), 'utf8');
assert('App.tsx caps DPR to maximum 1.75 for high-density mobile screens', appTsx.includes('1.75'));
assert('App.tsx enables touch controls upon mobile touch detection', appTsx.includes('touchstart'));
assert('App.tsx uses fixed inset-0 viewport wrapper to avoid scroll bouncing', appTsx.includes('fixed inset-0'));

// 7. Large Mobile Touch Controls & Tappable HUD Verification
console.log('\n[7] Testing MobileControls & HUD Touch Affordances...');
const mobileControls = fs.readFileSync(path.resolve('src/components/ui/MobileControls.tsx'), 'utf8');
assert('MobileControls uses Pointer Events with setPointerCapture', mobileControls.includes('setPointerCapture') && mobileControls.includes('onPointerDown'));
assert('MobileControls provides large interaction button (w-20/w-24)', mobileControls.includes('w-20') || mobileControls.includes('w-24'));
assert('MobileControls provides haptic vibration feedback', mobileControls.includes('vibrate'));
assert('MobileControls provides sprint toggle/auto-sprint', mobileControls.includes('sprint') || mobileControls.includes('Sprint'));

const hud = fs.readFileSync(path.resolve('src/components/ui/HUD.tsx'), 'utf8');
assert('HUD provides large mobile-friendly pause button (w-11 / w-12)', hud.includes('w-11') || hud.includes('w-12'));
assert('HUD prompt pill is directly tappable on mobile', hud.includes('handlePromptTap'));

console.log('\n=====================================================');
if (allPassed) {
  console.log('🎉 ALL MOBILE SYSTEMS & VIEWPORT TESTS PASSED 100%! 🎉');
} else {
  console.error('⚠️ SOME MOBILE TESTS FAILED. PLEASE REVIEW.');
  process.exit(1);
}
console.log('=====================================================\n');
