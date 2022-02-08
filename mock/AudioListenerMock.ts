import { AudioParamMock } from './AudioParamMock';

export class AudioListenerMock {
  positionX: AudioParamMock;
  positionY: AudioParamMock;
  positionZ: AudioParamMock;

  forwardX: AudioParamMock;
  forwardY: AudioParamMock;
  forwardZ: AudioParamMock;

  upX: AudioParamMock;
  upY: AudioParamMock;
  upZ: AudioParamMock;

  constructor() {
    this.positionX = new AudioParamMock(0);
    this.positionY = new AudioParamMock(0);
    this.positionZ = new AudioParamMock(0);

    this.forwardX = new AudioParamMock(0);
    this.forwardY = new AudioParamMock(0);
    this.forwardZ = new AudioParamMock(-1);

    this.upX = new AudioParamMock(0);
    this.upY = new AudioParamMock(1);
    this.upZ = new AudioParamMock(0);
  }
}

Object.defineProperty(window, 'AudioListener', {
  configurable: true,
  writable    : false,
  value       : AudioListenerMock
});
