import { Effector } from '/src/SoundModule/Effectors/Effector';
import { VocalCancelerProcessor } from '/src/SoundModule/Effectors/AudioWorkletProcessors/VocalCancelerProcessor';

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
  private processor: AudioWorkletNode;

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   */
  constructor(context: AudioContext) {
    super(context);

    this.depth.gain.value = 0;

    this.processor = new AudioWorkletNode(this.context, VocalCancelerProcessor.name);
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

    if (this.isActive) {
      // GainNode (Input) -> AudioWorkletNode (Vocal Canceler) -> GainNode (Output);
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
        case 'state': {
          return this.isActive;
        }

        case 'depth': {
          return this.depth.gain.value;
        }

        default: {
          return this;
        }
      }
    }

    for (const [key, value] of Object.entries(params)) {
      switch (key) {
        case 'state': {
          if (typeof value === 'boolean') {
            this.isActive = value;

            const message: VocalCancelerParams = { state: value };

            this.processor.port.postMessage(message);
          }

          break;
        }

        case 'depth': {
          if (typeof value === 'number') {
            this.depth.gain.value = value;

            const message: VocalCancelerParams = { depth: value };

            this.processor.port.postMessage(message);
          }

          break;
        }

        default: {
          break;
        }
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
}
