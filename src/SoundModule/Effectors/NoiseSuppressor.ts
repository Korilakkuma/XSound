import { BufferSize } from '../../types';
import { fft, ifft } from '../../XSound';
import { Effector } from './Effector';

export type NoiseSuppressorParams = {
  state?: boolean,
  threshold?: number
};

/**
 * This private class is for Noise Suppressor.
 * @constructor
 * @extends {Effector}
 */
export class NoiseSuppressor extends Effector {
  private threshold = 0;

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   * @param {BufferSize} bufferSize This argument is buffer size for `ScriptProcessorNode`.
   */
  constructor(context: AudioContext, bufferSize: BufferSize) {
    super(context, bufferSize);

    this.activate();
  }

  /** @override */
  public override start(): void {
    if (!this.isActive || !this.paused) {
      return;
    }

    this.paused = false;

    const bufferSize = this.processor.bufferSize;

    this.processor.onaudioprocess = (event: AudioProcessingEvent) => {
      const inputLs  = event.inputBuffer.getChannelData(0);
      const inputRs  = event.inputBuffer.getChannelData(1);
      const outputLs = event.outputBuffer.getChannelData(0);
      const outputRs = event.outputBuffer.getChannelData(1);

      this.suppress(inputLs, outputLs, bufferSize);
      this.suppress(inputRs, outputRs, bufferSize);
    };
  }

  /** @override */
  public override stop(): void {
    // Effector's state is active ?
    if (!this.isActive) {
      return;
    }

    this.paused = true;

    // Stop `onaudioprocess` event
    this.processor.disconnect(0);
    this.processor.onaudioprocess = null;

    // Connect `AudioNode`s again
    this.connect();
  }

  /** @override */
  public override connect(): GainNode {
    // Clear connection
    this.input.disconnect(0);
    this.processor.disconnect(0);

    if (this.isActive) {
      // GainNode (Input) -> ScriptProcessorNode (Noise Suppressor) -> GainNode (Output);
      this.input.connect(this.processor);
      this.processor.connect(this.output);
    } else {
      // GainNode (Input) -> GainNode (Output)
      this.input.connect(this.output);
    }

    return this.output;
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

  /** @override */
  public override params(): Required<NoiseSuppressorParams> {
    return {
      state    : this.isActive,
      threshold: this.threshold
    };
  }

  /** @override */
  public override activate(): NoiseSuppressor {
    super.activate();
    return this;
  }

  /** @override */
  public override deactivate(): NoiseSuppressor {
    super.deactivate();
    return this;
  }

  /**
   * This method detects background noise and removes this.
   * @param {Float32Array} inputs This argument is instance of `Float32Array` for FFT/IFFT.
   * @param {Float32Array} outputs This argument is instance of `Float32Array` for FFT/IFFT.
   * @param {number} fftSize This argument is FFT/IFFT size (power of two).
   */
  private suppress(inputs: Float32Array, outputs: Float32Array, fftSize: number): void {
    if (!this.isActive || (this.threshold === 0)) {
      outputs.set(inputs);
      return;
    }

    const xreals = new Float32Array(inputs);
    const ximags = new Float32Array(fftSize);

    const yreals = new Float32Array(fftSize);
    const yimags = new Float32Array(fftSize);

    const amplitudes = new Float32Array(fftSize);
    const phases     = new Float32Array(fftSize);

    fft(xreals, ximags, fftSize);

    for (let k = 0; k < fftSize; k++) {
      amplitudes[k] = Math.sqrt((xreals[k] ** 2) + (ximags[k] ** 2));

      if ((xreals[k] !== 0) && (ximags[k] !== 0)) {
        phases[k] = Math.atan2(ximags[k], xreals[k]);
      }
    }

    for (let k = 0; k < fftSize; k++) {
      amplitudes[k] -= this.threshold;

      if (amplitudes[k] < 0) {
        amplitudes[k] = 0;
      }
    }

    for (let k = 0; k < fftSize; k++) {
      yreals[k] = amplitudes[k] * Math.cos(phases[k]);
      yimags[k] = amplitudes[k] * Math.sin(phases[k]);
    }

    ifft(yreals, yimags, fftSize);

    outputs.set(yreals);
  }
}
