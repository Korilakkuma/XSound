export class AudioBufferMock {
  sampleRate = 44100;

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

  get duration(): number {
    if (this.dataL) {
      return this.dataL.length * (1 / this.sampleRate);
    }

    return 0;
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

  copyToChannel(source: Float32Array, channel: 0 | 1): void {
    switch (channel) {
      case 0:
        this.dataL = new Float32Array(source);
        break;
      case 1:
        this.dataR = new Float32Array(source);
        break;
      default:
        break;
    }
  }
}

Object.defineProperty(window, 'AudioBuffer', {
  configurable: true,
  writable    : false,
  value       : AudioBufferMock
});
