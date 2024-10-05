import { AudioNodeMock } from '/mock/AudioNodeMock';

export class IIRFilterNodeMock extends AudioNodeMock {
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    super();
  }
}

Object.defineProperty(window, 'IIRFilterNode', {
  configurable: true,
  writable    : false,
  value       : IIRFilterNodeMock
});
