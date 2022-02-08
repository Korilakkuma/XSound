import { XSound } from './main';

declare global {
  interface Window {
    XSound?: typeof XSound;
    X?: typeof XSound;
    webkitAudioContext: typeof AudioContext;  // for legacy browsers
  }
}

// auto | 8 bits | 9 bits | 10 bits | 11 bits | 12 bits | 13 bits | 14 bits
export type BufferSize = 0 | 256 | 512 | 1024 | 2048 | 4096 | 8192 | 16384;

// `-1` is inactive channel
export type ChannelNumber = -1 | 0 | 1;
