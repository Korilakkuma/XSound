import { AudioNodeMock } from './AudioNodeMock';

export class AnalyserNodeMock extends AudioNodeMock {
  fftSize = 2048;
  frequencyBinCount = this.fftSize / 2;
  minDecibels = -100;
  maxDecibels = -30;
  smoothingTimeConstant = 0.8;
}

Object.defineProperty(window, 'AnalyserNode', {
  configurable: true,
  writable    : false,
  value       : AnalyserNodeMock
});
