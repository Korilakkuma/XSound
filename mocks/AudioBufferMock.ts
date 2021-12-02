export class AudioBufferMock {
  private dataL: Float32Array | null = null;
  private dataR: Float32Array | null = null;

  constructor(dataL: Float32Array, dataR?: Float32Array) {
    this.dataL = dataL;

    if (dataR) {
      this.dataR = dataR;
    }
  }

  get length(): number {
    if (this.dataL === null) {
      return 0;
    }

    return this.dataL.length;
  }

  get numberOfChannels(): 1 | 2 {
    if (this.dataR) {
      return 2;
    }

    return 1;
  }

  getChannelData(channel: 0 | 1): Float32Array {
    switch (channel) {
      case 0:
        if (this.dataL) {
          return this.dataL;
        }

        break;
      case 1:
        if (this.dataR) {
          return this.dataR;
        }

        break;
      default:
        break;
    }

    return new Float32Array([]);
  }
}

Object.defineProperty(window, 'AudioBuffer', {
  configurable: true,
  writable    : false,
  value       : AudioBufferMock
});
