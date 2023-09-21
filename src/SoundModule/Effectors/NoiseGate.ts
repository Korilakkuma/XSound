import { Effector } from './Effector';
import { NoiseGateProcessor } from './AudioWorkletProcessors/NoiseGateProcessor';

export type NoiseGateParams = {
  state?: boolean,
  level?: number
};

/**
 * This private class is for Noise Gate.
 * @constructor
 * @extends {Effector}
 */
export class NoiseGate extends Effector {
  private processor: AudioWorkletNode;

  private level = 0;

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   */
  constructor(context: AudioContext) {
    super(context);

    this.processor = new AudioWorkletNode(this.context, NoiseGateProcessor.name);
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
      // GainNode (Input) -> AudioWorkletNode (Noise Gate) -> GainNode (Output);
      this.input.connect(this.processor);
      this.processor.connect(this.output);
    } else {
      // GainNode (Input) -> GainNode (Output)
      this.input.connect(this.output);
    }

    return this.output;
  }

  /**
   * This method gets or sets parameters for noise gate.
   * @param {keyof NoiseGateParams|NoiseGateParams} params This argument is string if getter. Otherwise, setter.
   * @return {NoiseGateParams[keyof NoiseGateParams]|NoiseGate} Return value is parameter for noise gate if getter.
   *     Otherwise, return value is for method chain.
   */
  public param(params: 'state'): boolean;
  public param(params: 'level'): number;
  public param(params: NoiseGateParams): NoiseGate;
  public param(params: keyof NoiseGateParams | NoiseGateParams): NoiseGateParams[keyof NoiseGateParams] | NoiseGate {
    if (typeof params === 'string') {
      switch (params) {
        case 'state': {
          return this.isActive;
        }

        case 'level': {
          return this.level;
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

            const message: NoiseGateParams = { state: value };

            this.processor.port.postMessage(message);
          }

          break;
        }

        case 'level': {
          if (typeof value === 'number') {
            this.level = value;

            const message: NoiseGateParams = { level: value };

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

  /** @override */
  public params(): Required<NoiseGateParams> {
    return {
      state: this.isActive,
      level: this.level
    };
  }

  /** @override */
  public override activate(): NoiseGate {
    super.activate();
    return this;
  }

  /** @override */
  public override deactivate(): NoiseGate {
    super.deactivate();
    return this;
  }
}
