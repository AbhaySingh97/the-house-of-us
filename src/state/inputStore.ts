/**
 * Input state bridge for Keyboard, Mouse, and Mobile Virtual Joystick / Touch
 */

export interface InputState {
  // Movement vector: [-1..1]
  moveForward: number; // 1 = forward, -1 = backward
  moveRight: number;   // 1 = right, -1 = left
  isSprinting: boolean;

  // Look delta for touch / drag
  lookDeltaX: number;
  lookDeltaY: number;

  // Interact trigger
  interactRequested: boolean;
}

const inputState: InputState = {
  moveForward: 0,
  moveRight: 0,
  isSprinting: false,
  lookDeltaX: 0,
  lookDeltaY: 0,
  interactRequested: false,
};

export const inputStore = {
  getState: () => inputState,

  setMove: (forward: number, right: number) => {
    inputState.moveForward = forward;
    inputState.moveRight = right;
  },

  setSprint: (sprint: boolean) => {
    inputState.isSprinting = sprint;
  },

  addLookDelta: (dx: number, dy: number) => {
    inputState.lookDeltaX += dx;
    inputState.lookDeltaY += dy;
  },

  consumeLookDelta: () => {
    const dx = inputState.lookDeltaX;
    const dy = inputState.lookDeltaY;
    inputState.lookDeltaX = 0;
    inputState.lookDeltaY = 0;
    return { dx, dy };
  },

  requestInteract: () => {
    inputState.interactRequested = true;
  },

  consumeInteract: () => {
    const val = inputState.interactRequested;
    inputState.interactRequested = false;
    return val;
  },

  reset: () => {
    inputState.moveForward = 0;
    inputState.moveRight = 0;
    inputState.isSprinting = false;
    inputState.lookDeltaX = 0;
    inputState.lookDeltaY = 0;
    inputState.interactRequested = false;
  }
};
