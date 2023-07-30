import { AudioNodeMock } from '/mock/AudioNodeMock';
import { AudioParamMock } from '/mock/AudioParamMock';

export class StereoPannerNodeMock extends AudioNodeMock {
  pan: AudioParamMock;

  constructor() {
    super();

    this.pan = new AudioParamMock(0);
  }
}

Object.defineProperty(window, 'StereoPannerNode', {
  configurable: true,
  writable    : false,
  value       : StereoPannerNodeMock
});
