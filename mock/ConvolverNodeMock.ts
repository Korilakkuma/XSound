import { AudioNodeMock } from '/mock/AudioNodeMock';
import { AudioBufferMock } from '/mock/AudioBufferMock';

export class ConvolverNodeMock extends AudioNodeMock {
  buffer: AudioBufferMock | null;
  normalize = true;

  constructor(buffer: AudioBufferMock | null = null, normalize = true) {
    super();

    this.buffer    = buffer;
    this.normalize = normalize;
  }
}

Object.defineProperty(window, 'ConvolverNode', {
  configurable: true,
  writable    : false,
  value       : ConvolverNodeMock
});
