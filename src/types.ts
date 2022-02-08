import { XSound } from './main';

declare global {
  interface Window {
    XSound?: typeof XSound;
    X?: typeof XSound;
    webkitAudioContext: typeof AudioContext;  // for legacy browsers
  }
}

export type BufferSize = 0 | 256 | 512 | 1024 | 2048 | 4096 | 8192 | 16384;

export type ChannelNumber = -1 | 0 | 1;
