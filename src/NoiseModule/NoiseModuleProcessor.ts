import { AudioWorkletProcessor, Inputs, Outputs } from '../worklet';
import { NoiseType, NoiseModuleParams } from './';

/**
 * @constructor
 * @extends {AudioWorkletGlobalScope.AudioWorkletProcessor}
 */
export class NoiseModuleProcessor extends AudioWorkletProcessor {
  private type: NoiseType = 'whitenoise';

  private b0 = 0;
  private b1 = 0;
  private b2 = 0;
  private b3 = 0;
  private b4 = 0;
  private b5 = 0;
  private b6 = 0;

  private lastOut = 0;

  constructor() {
    super();

    this.port.onmessage = (event: MessageEvent<NoiseModuleParams>) => {
      if (event.data.type) {
        this.type = event.data.type;
      }
    };
  }

  /** @override */
  protected override process(_inputs: Inputs, outputs: Outputs): boolean {
    const output = outputs[0];

    for (let channelNumber = 0, numberOfChannels = output.length; channelNumber < numberOfChannels; channelNumber++) {
      const bufferSize = output[channelNumber].length;

      switch (this.type) {
        case 'whitenoise': {
          this.generateWhiteNoise(output[channelNumber], bufferSize);
          break;
        }

        case 'pinknoise': {
          // ref: https://noisehack.com/generate-noise-web-audio-api/#pink-noise
          this.b0 = 0;
          this.b1 = 0;
          this.b2 = 0;
          this.b3 = 0;
          this.b4 = 0;
          this.b5 = 0;
          this.b6 = 0;

          this.generatePinkNoise(output[channelNumber], bufferSize);
          break;
        }

        case 'browniannoise': {
          // ref: https://noisehack.com/generate-noise-web-audio-api/#brownian-noise
          this.lastOut = 0;

          this.generateBrownianNoise(output[channelNumber], bufferSize);
          break;
        }

        default:
          break;
      }
    }

    return true;
  }

  /**
   * This method generates white noise.
   * @param {Float32Array} outputs This argument is instance of `Float32Array` for output.
   * @param {number} bufferSize This argument is buffer size for instance of `Float32Array`.
   */
  private generateWhiteNoise(outputs: Float32Array, bufferSize: number): void {
    for (let i = 0; i < bufferSize; i++) {
      outputs[i] = (2 * Math.random()) - 1;
    }
  }

  /**
   * This method generates pink noise.
   * @param {Float32Array} outputs This argument is instance of `Float32Array` for output.
   * @param {number} bufferSize This argument is buffer size for instance of `Float32Array`.
   */
  private generatePinkNoise(outputs: Float32Array, bufferSize: number): void {
    for (let i = 0; i < bufferSize; i++) {
      const white = (2 * Math.random()) - 1;

      this.b0 = (0.99886 * this.b0) + (white * 0.0555179);
      this.b1 = (0.99332 * this.b1) + (white * 0.0750759);
      this.b2 = (0.96900 * this.b2) + (white * 0.1538520);
      this.b3 = (0.86650 * this.b3) + (white * 0.3104856);
      this.b4 = (0.55000 * this.b4) + (white * 0.5329522);
      this.b5 = (-0.7616 * this.b5) - (white * 0.0168980);

      outputs[i] = this.b0 + this.b1 + this.b2 + this.b3 + this.b4 + this.b5 + this.b6 + (white * 0.5362);
      outputs[i] *= 0.11;

      this.b6 = white * 0.115926;
    }
  }

  /**
   * This method generates brownian noise.
   * @param {Float32Array} outputs This argument is instance of `Float32Array` for output.
   * @param {number} bufferSize This argument is buffer size for instance of `Float32Array`.
   */
  private generateBrownianNoise(outputs: Float32Array, bufferSize: number): void {
    for (let i = 0; i < bufferSize; i++) {
      const white = (2 * Math.random()) - 1;

      outputs[i] = (this.lastOut + (0.02 * white)) / 1.02;

      this.lastOut = (this.lastOut + (0.02 * white)) / 1.02;

      outputs[i] *= 3.5;
    }
  }
}
