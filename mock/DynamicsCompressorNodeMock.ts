import { AudioNodeMock } from '/mock/AudioNodeMock';
import { AudioParamMock } from '/mock/AudioParamMock';

export class DynamicsCompressorNodeMock extends AudioNodeMock {
  threshold: AudioParamMock;
  knee: AudioParamMock;
  ratio: AudioParamMock;
  attack: AudioParamMock;
  release: AudioParamMock;

  constructor() {
    super();

    this.threshold = new AudioParamMock(-24);
    this.knee      = new AudioParamMock(30);
    this.ratio     = new AudioParamMock(12);
    this.attack    = new AudioParamMock(0.003);
    this.release   = new AudioParamMock(0.25);
  }
}

Object.defineProperty(window, 'DynamicsCompressorNode', {
  configurable: true,
  writable    : false,
  value       : DynamicsCompressorNodeMock
});
