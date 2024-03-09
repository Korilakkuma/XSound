import type { XSound } from './main';

declare global {
  interface Window {
    XSound?: typeof XSound;
    X?: typeof XSound;
    webkitAudioContext: typeof AudioContext;  // for legacy browsers
  }
}

// `-1` is inactive channel
export type ChannelNumber = -1 | 0 | 1;
