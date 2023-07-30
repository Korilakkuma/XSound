import { AudioNodeMock } from '/mock/AudioNodeMock';
import { AudioParamMock } from '/mock/AudioParamMock';

export class ConstantSourceNodeMock extends AudioNodeMock {
  offset: AudioParamMock;

  constructor() {
    super();

    this.offset = new AudioParamMock(1);
  }

  start() {
  }

  stop() {
  }
}

Object.defineProperty(window, 'ConstantSourceNode', {
  configurable: true,
  writable    : false,
  value       : ConstantSourceNodeMock
});
