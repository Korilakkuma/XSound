import { BufferSize } from '../../types';
import { Effector } from './Effector';

export type VocalCancelerParams = {
  state?: boolean,
  depth?: number
};

/**
 * This private class is for Vocal Canceler.
 * @constructor
 * @extends {Effector}
 */
export class VocalCanceler extends Effector {
  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   * @param {BufferSize} bufferSize This argument is buffer size for `ScriptProcessorNode`.
   */
  constructor(context: AudioContext, bufferSize: BufferSize) {
    super(context, bufferSize);

    this.depth.gain.value = 0;

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

      for (let i = 0; i < bufferSize; i++) {
        outputLs[i] = this.cancel(inputLs[i], inputRs[i]);
        outputRs[i] = this.cancel(inputRs[i], inputLs[i]);
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
      // GainNode (Input) -> ScriptProcessorNode (Vocal Canceler) -> GainNode (Output);
      this.input.connect(this.processor);
      this.processor.connect(this.output);
    } else {
      // GainNode (Input) -> GainNode (Output)
      this.input.connect(this.output);
    }

    return this.output;
  }
  /**
   * This method gets or sets parameters for vocal canceler.
   * @param {keyof VocalCancelerParams|VocalCancelerParams} params This argument is string if getter. Otherwise, setter.
   * @return {VocalCancelerParams[keyof VocalCancelerParams]|VocalCanceler} Return value is parameter for vocal canceler if getter.
   *     Otherwise, return value is for method chain.
   */
  public param(params: 'state'): boolean;
  public param(params: 'depth'): number;
  public param(params: VocalCancelerParams): VocalCanceler;
  public param(params: keyof VocalCancelerParams | VocalCancelerParams): VocalCancelerParams[keyof VocalCancelerParams] | VocalCanceler {
    if (typeof params === 'string') {
      switch (params) {
        case 'state':
          return this.isActive;
        case 'depth':
          return this.depth.gain.value;
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
        case 'depth':
          if (typeof value === 'number') {
            this.depth.gain.value = value;
          }

          break;
        default:
          break;
      }
    }

    return this;
  }

  /**
   * This method gets vocal canceler parameters as associative array.
   * @return {VocalCancelerParams}
   */
  public params(): Required<VocalCancelerParams> {
    return {
      state: this.isActive,
      depth: this.depth.gain.value
    };
  }

  /** @override */
  public override activate(): VocalCanceler {
    super.activate();
    return this;
  }

  /** @override */
  public override deactivate(): VocalCanceler {
    super.deactivate();
    return this;
  }

  /**
   * This method removes vocal part from audio on playing.
   * @param {number} dataL This argument is gain level for Left channel.
   * @param {number} dataR This argument is gain level for Right channel.
   * @return {number} Return value is audio data except vocal part.
   */
  private cancel(dataL: number, dataR: number): number {
    if (this.isActive) {
      return dataL - (this.depth.gain.value * dataR);
    }

    return dataL;
  }
}
