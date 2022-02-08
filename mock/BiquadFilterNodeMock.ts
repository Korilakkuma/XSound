import { AudioNodeMock } from './AudioNodeMock';
import { AudioParamMock } from './AudioParamMock';

export class BiquadFilterNodeMock extends AudioNodeMock {
  type: 'lowpass' | 'highpass' | 'bandpass' | 'lowshelf' | 'highshelf' | 'peaking' | 'notch' | 'allpass';
  frequency: AudioParamMock;
  Q: AudioParamMock;
  gain: AudioParamMock;

  constructor() {
    super();

    this.type      = 'lowpass';
    this.frequency = new AudioParamMock(350);
    this.Q         = new AudioParamMock(1);
    this.gain      = new AudioParamMock(0);
  }
}

Object.defineProperty(window, 'BiquadFilterNode', {
  configurable: true,
  writable    : false,
  value       : BiquadFilterNodeMock
});
