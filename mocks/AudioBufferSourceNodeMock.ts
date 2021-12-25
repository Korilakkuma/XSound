import { AudioNodeMock } from './AudioNodeMock';
import { AudioParamMock } from './AudioParamMock';
import { AudioBufferMock } from './AudioBufferMock';

export class AudioBufferSourceNodeMock extends AudioNodeMock {
  buffer: AudioBufferMock;
  playbackRate: AudioParamMock;
  detune: AudioParamMock;
  loop: boolean;

  constructor(buffer: AudioBufferMock) {
    super();

    this.buffer       = buffer;
    this.playbackRate = new AudioParamMock(1);
    this.detune       = new AudioParamMock(0);
    this.loop         = false;
  }

  start() {
  }

  stop() {
  }
}

Object.defineProperty(window, 'AudioBufferSourceNode', {
  configurable: true,
  writable    : false,
  value       : AudioBufferSourceNodeMock
});
