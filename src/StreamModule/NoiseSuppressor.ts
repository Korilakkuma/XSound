import { Statable } from '../interfaces';
import { fft, ifft } from '../XSound';

export type NoiseSuppressorParams = {
  state?: boolean,
  threshold?: number
};

/**
 * This private class is for Noise Suppressor.
 * @constructor
 * @implements {Statable}
 */
export class NoiseSuppressor implements Statable {
  private threshold = 0;
  private isActive = true;

  // eslint-disable-next-line no-useless-constructor
  constructor() {
  }

  /**
   * This method detects background noise and removes this.
   * @param {Float32Array} inputs This argument is instance of `Float32Array` for FFT/IFFT.
   * @param {Float32Array} outputs This argument is instance of `Float32Array` for FFT/IFFT.
   * @param {number} size This argument is FFT/IFFT size (power of two).
   */
  public start(inputs: Float32Array, outputs: Float32Array, bufferSize: number): void {
    if (!this.isActive || (this.threshold === 0)) {
      outputs.set(inputs);
      return;
    }

    const xreals = new Float32Array(inputs);
    const ximags = new Float32Array(bufferSize);

    const yreals = new Float32Array(bufferSize);
    const yimags = new Float32Array(bufferSize);

    const amplitudes = new Float32Array(bufferSize);
    const phases     = new Float32Array(bufferSize);

    fft(xreals, ximags, bufferSize);

    for (let k = 0; k < bufferSize; k++) {
      amplitudes[k] = Math.sqrt((xreals[k] ** 2) + (ximags[k] ** 2));

      if ((xreals[k] !== 0) && (ximags[k] !== 0)) {
        phases[k] = Math.atan2(ximags[k], xreals[k]);
      }
    }

    for (let k = 0; k < bufferSize; k++) {
      amplitudes[k] -= this.threshold;

      if (amplitudes[k] < 0) {
        amplitudes[k] = 0;
      }
    }

    for (let k = 0; k < bufferSize; k++) {
      yreals[k] = amplitudes[k] * Math.cos(phases[k]);
      yimags[k] = amplitudes[k] * Math.sin(phases[k]);
    }

    ifft(yreals, yimags, bufferSize);

    outputs.set(yreals);
  }

  /**
   * This method gets or sets parameters for noise suppressor.
   * @param {keyof NoiseSuppressorParams|NoiseSuppressorParams} params This argument is string if getter. Otherwise, setter.
   * @return {NoiseSuppressorParams[keyof NoiseSuppressorParams]|NoiseSuppressor} Return value is parameter for noise suppressor if getter.
   *     Otherwise, return value is for method chain.
   */
  public param(params: 'state'): boolean;
  public param(params: 'threshold'): number;
  public param(params: NoiseSuppressorParams): NoiseSuppressor;
  public param(params: keyof NoiseSuppressorParams | NoiseSuppressorParams): NoiseSuppressorParams[keyof NoiseSuppressorParams] | NoiseSuppressor {
    if (typeof params === 'string') {
      switch (params) {
        case 'state':
          return this.isActive;
        case 'threshold':
          return this.threshold;
        default:
          return this;
      }
    }

    for (const [key, value] of Object.entries(params)) {
      switch (key) {
        case 'state':
          if (typeof value === 'boolean') {
            this.isActive = value;
          }

          break;
        case 'threshold':
          if (typeof value === 'number') {
            if (value >= 0) {
              this.threshold = value;
            }
          }

          break;
        default:
          break;
      }
    }

    return this;
  }

  /**
   * This method gets noise suppressor parameters as associative array.
   * @return {NoiseSuppressorParams}
   */
  public params(): Required<NoiseSuppressorParams> {
    return {
      state    : this.isActive,
      threshold: this.threshold
    };
  }

  /**
   * This method gets noise suppressor state. If returns `true`, noise suppressor is active.
   * @return {boolean}
   */
  public state(): boolean {
    return this.isActive;
  }

  /**
   * This method activates noise suppressor.
   * @return {NoiseSuppressor} Return value is for method chain.
   */
  public activate(): NoiseSuppressor {
    this.isActive = true;
    return this;
  }

  /**
   * This method deactivates noise suppressor.
   * @return {NoiseSuppressor} Return value is for method chain.
   */
  public deactivate(): NoiseSuppressor {
    this.isActive = false;
    return this;
  }
}
