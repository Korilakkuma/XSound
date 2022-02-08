import { AudioNodeMock } from './AudioNodeMock';
import { AudioParamMock } from './AudioParamMock';

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
