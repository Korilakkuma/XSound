import { AudioNodeMock } from './AudioNodeMock';
import { AudioParamMock } from './AudioParamMock';

export class GainNodeMock extends AudioNodeMock {
  gain: AudioParamMock;

  constructor() {
    super();

    this.gain = new AudioParamMock(1);
  }
}

Object.defineProperty(window, 'GainNode', {
  configurable: true,
  writable    : false,
  value       : GainNodeMock
});
