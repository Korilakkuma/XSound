export class AudioParamMock {
  value = 0;

  constructor(value: number) {
    this.value = value;
  }
}

Object.defineProperty(window, 'AudioParam', {
  configurable: true,
  writable    : false,
  value       : AudioParamMock
});
