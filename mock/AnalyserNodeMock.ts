import { AudioNodeMock } from '/mock/AudioNodeMock';

export class AnalyserNodeMock extends AudioNodeMock {
  fftSize = 2048;
  frequencyBinCount = this.fftSize / 2;
  minDecibels = -100;
  maxDecibels = -30;
  smoothingTimeConstant = 0.8;

  getByteTimeDomainData() {
  }

  getFloatTimeDomainData() {
  }

  getByteFrequencyData() {
  }

  getFloatFrequencyData() {
  }
}

Object.defineProperty(window, 'AnalyserNode', {
  configurable: true,
  writable    : false,
  value       : AnalyserNodeMock
});
