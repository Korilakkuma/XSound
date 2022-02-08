import { AudioNodeMock } from './AudioNodeMock';

export class WaveShaperNodeMock extends AudioNodeMock {
  curve: Float32Array | null;
  oversample: 'none' | '2x' | '4x';

  constructor() {
    super();

    this.curve      = null;
    this.oversample = 'none';
  }
}

Object.defineProperty(window, 'WaveShaperNode', {
  configurable: true,
  writable    : false,
  value       : WaveShaperNodeMock
});
