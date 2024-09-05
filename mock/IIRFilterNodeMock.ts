import { AudioNodeMock } from '/mock/AudioNodeMock';

export class IIRFilterNodeMock extends AudioNodeMock {
  constructor() {
    super();
  }
}

Object.defineProperty(window, 'IIRFilterNode', {
  configurable: true,
  writable    : false,
  value       : IIRFilterNodeMock
});
