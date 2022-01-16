import { BufferSize } from '../../types';
import { FFT, IFFT } from '../../XSound';
import { Effector } from './Effector';

export type PitchShifterParams = {
  state?: boolean,
  pitch?: number
};

/**
 * Effector's subclass for Pitch Shifter.
 * @constructor
 * @extends {Effector}
 */
export class PitchShifter extends Effector {
  private pitch = 1.0;
  private gainCorrection = 2.0;

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   * @param {BufferSize} bufferSize This argument is buffer size for `ScriptProcessorNode`.
   */
  constructor(context: AudioContext, bufferSize: BufferSize) {
    super(context, bufferSize);

    // `PitchShifter` is not connected by default
    this.deactivate();

    this.connect();
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

      if (this.isActive && (this.pitch !== 1)) {
        const realLs = new Float32Array(inputLs);
        const realRs = new Float32Array(inputRs);
        const imagLs = new Float32Array(bufferSize);
        const imagRs = new Float32Array(bufferSize);

        FFT(realLs, imagLs, bufferSize);
        FFT(realRs, imagRs, bufferSize);

        const arealLs = new Float32Array(bufferSize);
        const arealRs = new Float32Array(bufferSize);
        const aimagLs = new Float32Array(bufferSize);
        const aimagRs = new Float32Array(bufferSize);

        for (let i = 0; i < bufferSize; i++) {
          const offset = Math.floor(this.pitch * i);

          let eq = 1;

          if (i > (bufferSize / 2)) {
            eq = 0;
          }

          if ((offset >= 0) && (offset < bufferSize)) {
            arealLs[offset] += this.gainCorrection * eq * realLs[i];
            aimagLs[offset] += this.gainCorrection * eq * imagLs[i];
            arealRs[offset] += this.gainCorrection * eq * realRs[i];
            aimagRs[offset] += this.gainCorrection * eq * imagRs[i];
          }
        }

        IFFT(arealLs, aimagLs, bufferSize);
        IFFT(arealRs, aimagRs, bufferSize);

        outputLs.set(inputLs);
        outputRs.set(inputRs);
      } else {
        outputLs.set(inputLs);
        outputRs.set(inputRs);
      }
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
      // GainNode (Input) -> ScriptProcessorNode (Pitch Shifter) -> GainNode (Output);
      this.input.connect(this.processor);
      this.processor.connect(this.output);
    } else {
      // GainNode (Input) -> GainNode (Output)
      this.input.connect(this.output);
    }

    return this.output;
  }

  /**
   * This method gets or sets parameters for pitch shifter.
   * This method is overloaded for type interface and type check.
   * @param {keyof PitchShifterParams|PitchShifterParams} params This argument is string if getter. Otherwise, setter.
   * @return {PitchShifterParams[keyof PitchShifterParams]|PitchShifter} Return value is parameter for pitch shifter if getter.
   *     Otherwise, return value is for method chain.
   */
  public param(params: 'pitch'): number;
  public param(params: PitchShifterParams): PitchShifter;
  public param(params: keyof PitchShifterParams | PitchShifterParams): PitchShifterParams[keyof PitchShifterParams] | PitchShifter {
    if (typeof params === 'string') {
      switch (params) {
        case 'pitch':
          return this.pitch;
        default:
          return this;
      }
    }

    for (const [key, value] of Object.entries(params)) {
      switch (key) {
        case 'pitch':
          if (typeof value === 'number') {
            if (value > 0) {
              this.pitch = value;
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
  public override params(): PitchShifterParams {
    return {
      state: this.isActive,
      pitch: this.pitch
    };
  }
}
