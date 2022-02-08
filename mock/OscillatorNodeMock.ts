import { AudioNodeMock } from './AudioNodeMock';
import { AudioParamMock } from './AudioParamMock';

export class OscillatorNodeMock extends AudioNodeMock {
  type: 'sine' | 'square' | 'sawtooth' | 'triangle' | 'custom';
  frequency: AudioParamMock;
  detune: AudioParamMock;

  constructor() {
    super();

    this.type      = 'sine';
    this.frequency = new AudioParamMock(440);
    this.detune    = new AudioParamMock(0);
  }

  start() {
  }

  stop() {
  }

  setPeriodicWave() {
  }
}

Object.defineProperty(window, 'OscillatorNode', {
  configurable: true,
  writable    : false,
  value       : OscillatorNodeMock
});
