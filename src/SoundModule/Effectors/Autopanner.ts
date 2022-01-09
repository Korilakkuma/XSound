import { Effector } from './Effector';

export type AutopannerParams = {
  state?: boolean,
  depth?: number,
  rate?: number
};

/**
 * Effector's subclass for Autopanner.
 * @constructor
 * @extends {Effector}
 */
export class Autopanner extends Effector {
  private panner: StereoPannerNode;

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   */
  constructor(context: AudioContext) {
    super(context, 0);

    this.panner = this.context.createStereoPanner();

    // Initialize parameters
    this.panner.pan.value = 0;
    this.depth.gain.value = 0;
    this.rate.value       = 0;

    // `Autopanner` is not connected by default
    this.deactivate();

    // LFO
    // OscillatorNode (LFO) -> GainNode (Depth) -> AudioParam (pan)
    this.lfo.connect(this.depth);
    this.depth.connect(this.panner.pan);
  }

  /** @override */
  public stop(stopTime?: number, releaseTime?: number): void {
    super.stop(stopTime, releaseTime);

    if (this.isActive) {
      // Connect again
      this.lfo.connect(this.depth);
      this.depth.connect(this.panner.pan);
    }
  }

  /** @override */
  public connect(): GainNode {
    // Clear connection
    this.input.disconnect(0);
    this.panner.disconnect(0);

    if (this.isActive) {
      // Effect ON

      // GainNode (Input) -> StereoPannerNode -> GainNode (Output)
      this.input.connect(this.panner);
      this.panner.connect(this.output);
    } else {
      // Effect OFF

      // GainNode (Input) -> GainNode (Output)
      this.input.connect(this.output);
    }

    return this.output;
  }

  /**
   * This method gets or sets parameters for autopanner effector.
   * @param {keyof AutopannerParams|AutopannerParams} params This argument is string if getter. Otherwise, setter.
   * @return {AutopannerParams[keyof AutopannerParams]|Autopanner} Return value is parameter for autopanner effector if getter.
   *     Otherwise, return value is for method chain.
   */
  public param(params: keyof AutopannerParams | AutopannerParams): AutopannerParams[keyof AutopannerParams] | Autopanner {
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
  public params(): AutopannerParams {
    return {
      state: this.isActive,
      depth: this.depth.gain.value,
      rate : this.rate.value
    };
  }
}
