import { AudioNodeMock } from '/mock/AudioNodeMock';
import { AudioParamMock } from '/mock/AudioParamMock';

export class DelayNodeMock extends AudioNodeMock {
  delayTime: AudioParamMock;

  constructor() {
    super();

    this.delayTime = new AudioParamMock(0);
  }
}

Object.defineProperty(window, 'DelayNode', {
  configurable: true,
  writable    : false,
  value       : DelayNodeMock
});
