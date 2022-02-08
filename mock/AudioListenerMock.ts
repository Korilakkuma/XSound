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

  setPosition(x: number, y: number, z: number): void {
    this.positionX.value = x;
    this.positionY.value = y;
    this.positionZ.value = z;
  }

  setOrientation(fx: number, fy: number, fz: number, ux: number, uy: number, uz: number): void {
    this.forwardX.value = fx;
    this.forwardY.value = fy;
    this.forwardZ.value = fz;

    this.upX.value = ux;
    this.upY.value = uy;
    this.upZ.value = uz;
  }
}

Object.defineProperty(window, 'AudioListener', {
  configurable: true,
  writable    : false,
  value       : AudioListenerMock
});
