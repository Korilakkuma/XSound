import { AudioNodeMock } from './AudioNodeMock';

export class AnalyserNodeMock extends AudioNodeMock {
  fftSize = 2048;
  frequencyBinCount = this.fftSize / 2;
  minDecibels = -100;
  maxDecibels = -30;
  smoothingTimeConstant = 0.8;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getByteTimeDomainData(data: Uint8Array) {
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getFloatTimeDomainData(data: Float32Array) {
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getByteFrequencyData(data: Uint8Array) {
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getFloatFrequencyData(data: Float32Array) {
  }
}

Object.defineProperty(window, 'AnalyserNode', {
  configurable: true,
  writable    : false,
  value       : AnalyserNodeMock
});
