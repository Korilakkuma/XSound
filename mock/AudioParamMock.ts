export class AudioParamMock {
  value = 0;
  automationRate: 'a-rate' | 'k-rate';

  constructor(value: number, automationRate: 'a-rate' | 'k-rate' = 'a-rate') {
    this.value          = value;
    this.automationRate = automationRate;
  }

  setValueAtTime() {
  }

  linearRampToValueAtTime() {
  }

  exponentialRampToValueAtTime () {
  }

  setTargetAtTime() {
  }

  setValueCurveAtTime() {
  }

  cancelScheduledValues() {
  }

  cancelAndHoldAtTime() {
  }
}

Object.defineProperty(window, 'AudioParam', {
  configurable: true,
  writable    : false,
  value       : AudioParamMock
});
