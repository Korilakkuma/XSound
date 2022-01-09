import { Effector } from './Effector';

export type RingmodulatorParams = {
  state?: boolean,
  depth?: number,
  rate?: number
};

/**
 * Effector's subclass for Ring Modulator.
 * @constructor
 * @extends {Effector}
 */
export class Ringmodulator extends Effector {
  private amplitude: GainNode;

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   */
  constructor(context: AudioContext) {
    super(context, 0);

    this.amplitude = context.createGain();

    // Initialize parameter
    this.amplitude.gain.value = 0;  // 0 +- depth
    this.depth.gain.value     = 1;
    this.rate.value           = 0;

    // `Ringmodulator` is not connected by default
    this.deactivate();

    // LFO
    // OscillatorNode (LFO) -> GainNode (Depth) -> AudioParam (gain)
    this.lfo.connect(this.depth);
    this.depth.connect(this.amplitude.gain);
  }

  /** @override */
  public stop(stopTime?: number, releaseTime?: number): void {
    super.stop(stopTime, releaseTime);

    if (this.isActive) {
      // Connect `AudioNode`s again
      this.lfo.connect(this.depth);
      this.depth.connect(this.amplitude.gain);
    }
  }

  /** @override */
  public connect(): GainNode {
    // Clear connection
    this.input.disconnect(0);
    this.amplitude.disconnect(0);

    if (this.isActive) {
      // Effect ON

      // GainNode (Input) -> GainNode (Ring Modulator) -> GainNode (Output)
      this.input.connect(this.amplitude);
      this.amplitude.connect(this.output);
    } else {
      // Effect OFF

      // GainNode (Input) -> GainNode (Output)
      this.input.connect(this.output);
    }

    return this.output;
  }

  /**
   * This method gets or sets parameters for ring modulator effector.
   * @param {keyof RingmodulatorParams|RingmodulatorParams} params This argument is string if getter. Otherwise, setter.
   * @return {RingmodulatorParams[keyof RingmodulatorParams]|Autopanner} Return value is parameter for ring modulator effector if getter.
   *     Otherwise, return value is for method chain.
   */
  public param(params: keyof RingmodulatorParams | RingmodulatorParams): RingmodulatorParams[keyof RingmodulatorParams] | Ringmodulator {
    if (typeof params === 'string') {
      switch (params) {
        case 'depth':
          return this.depth.gain.value;
        case 'rate':
          return this.rate.value;
        default:
          return this;
      }
    }

    for (const [key, value] of Object.entries(params)) {
      switch (key) {
        case 'depth':
          if (typeof value === 'number') {
            this.depth.gain.value = value;
          }

          break;
        case 'rate':
          if (typeof value === 'number') {
            this.rate.value = value;
          }

          break;
        default:
          break;
      }
    }

    return this;
  }

  /** @override */
  public params(): RingmodulatorParams {
    return {
      state: this.isActive,
      depth: this.depth.gain.value,
      rate : this.rate.value
    };
  }
}
