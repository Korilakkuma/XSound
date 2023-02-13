import { Effector } from './Effector';
import { PitchShifterProcessor } from './AudioWorkletProcessors/PitchShifterProcessor';

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
  private processor: AudioWorkletNode;

  private pitch = 1;

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   */
  constructor(context: AudioContext) {
    super(context);

    this.processor = new AudioWorkletNode(this.context, PitchShifterProcessor.name);
    this.activate();
  }

  /** @override */
  public override start(): void {
  }

  /** @override */
  public override stop(): void {
  }

  /** @override */
  public override connect(): GainNode {
    // Clear connection
    this.input.disconnect(0);
    this.processor.disconnect(0);

    this.processor = new AudioWorkletNode(this.context, PitchShifterProcessor.name);

    const message: PitchShifterParams = {
      pitch: this.pitch
    };

    this.processor.port.postMessage(message);

    if (this.isActive) {
      // GainNode (Input) -> AudioWorkletNode (Pitch Shifter) -> GainNode (Output);
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
  public param(params: 'state'): boolean;
  public param(params: 'pitch'): number;
  public param(params: PitchShifterParams): PitchShifter;
  public param(params: keyof PitchShifterParams | PitchShifterParams): PitchShifterParams[keyof PitchShifterParams] | PitchShifter {
    if (typeof params === 'string') {
      switch (params) {
        case 'state':
          return this.isActive;
        case 'pitch':
          return this.pitch;
        default:
          return this;
      }
    }

    for (const [key, value] of Object.entries(params)) {
      switch (key) {
        case 'state':
          if (typeof value === 'boolean') {
            this.isActive = value;

            if (this.processor) {
              const message: PitchShifterParams = { state: value };

              this.processor.port.postMessage(message);
            }
          }

          break;
        case 'pitch':
          if (typeof value === 'number') {
            if (value > 0) {
              this.pitch = value;

              if (this.processor) {
                const message: PitchShifterParams = { pitch: value };

                this.processor.port.postMessage(message);
              }
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
  public override params(): Required<PitchShifterParams> {
    return {
      state: this.isActive,
      pitch: this.pitch
    };
  }

  /** @override */
  public override activate(): PitchShifter {
    super.activate();
    return this;
  }

  /** @override */
  public override deactivate(): PitchShifter {
    super.deactivate();
    return this;
  }
}
