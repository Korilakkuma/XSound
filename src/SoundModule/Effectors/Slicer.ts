import { Effector } from './Effector';

export type SlicerParams = {
  state?: boolean,
  depth?: number,
  rate?: number,
  dry?: number,
  wet?: number
};

/**
 * Effector's subclass for Slicer.
 */
export class Slicer extends Effector {
  private amplitude: GainNode;
  private dry: GainNode;
  private wet: GainNode;

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   */
  constructor(context: AudioContext) {
    super(context);

    this.amplitude = context.createGain();
    this.dry       = context.createGain();
    this.wet       = context.createGain();

    // Initialize parameter
    this.amplitude.gain.value = 1;  // 1 +- depth
    this.dry.gain.value       = 1;
    this.wet.gain.value       = 0;
    this.lfo.type             = 'square';
    this.depth.gain.value     = 0;
    this.rate.value           = 0;

    // `Slicer` is not connected by default
    this.deactivate();

    // LFO
    // OscillatorNode (LFO) -> GainNode (Depth) -> AudioParam (gain)
    this.lfo.connect(this.depth);
    this.depth.connect(this.amplitude.gain);
  }

  /** @override */
  public override stop(stopTime?: number, releaseTime?: number): void {
    super.stop(stopTime, releaseTime);

    if (this.isActive) {
      // Connect `AudioNode`s again
      this.lfo.connect(this.depth);
      this.depth.connect(this.amplitude.gain);
    }
  }

  /** @override */
  public override connect(): GainNode {
    // Clear connection
    this.input.disconnect(0);
    this.amplitude.disconnect(0);
    this.dry.disconnect(0);
    this.wet.disconnect(0);

    if (this.isActive) {
      // Effect ON

      this.input.connect(this.dry);
      this.dry.connect(this.output);

      // GainNode (Input) -> GainNode (Slicer) -> GainNode (Wet) -> GainNode (Output)
      this.input.connect(this.amplitude);
      this.amplitude.connect(this.wet);
      this.wet.connect(this.output);
    } else {
      // Effect OFF

      // GainNode (Input) -> GainNode (Output)
      this.input.connect(this.output);
    }

    return this.output;
  }

  /**
   * This method gets or sets parameters for slicer effector.
   * This method is overloaded for type interface and type check.
   * @param {keyof SlicerParams|SlicerParams} params This argument is string if getter. Otherwise, setter.
   * @return {SlicerParams[keyof SlicerParams]|Slicer} Return value is parameter for slicer effector if getter.
   *     Otherwise, return value is for method chain.
   */
  public param(params: 'depth'): number;
  public param(params: 'rate'): number;
  public param(params: 'dry'): number;
  public param(params: 'wet'): number;
  public param(params: SlicerParams): Slicer;
  public param(params: keyof SlicerParams | SlicerParams): SlicerParams[keyof SlicerParams] | Slicer {
    if (typeof params === 'string') {
      switch (params) {
        case 'state': {
          return this.isActive;
        }

        case 'depth': {
          return this.depth.gain.value;
        }

        case 'rate': {
          return this.rate.value;
        }

        case 'dry': {
          return this.dry.gain.value;
        }

        case 'wet': {
          return this.wet.gain.value;
        }
      }
    }

    for (const [key, value] of Object.entries(params)) {
      switch (key) {
        case 'state': {
          if (typeof value === 'boolean') {
            this.isActive = value;
          }

          break;
        }

        case 'depth': {
          if (typeof value === 'number') {
            this.depth.gain.value = value;
          }

          break;
        }

        case 'rate': {
          if (typeof value === 'number') {
            this.rate.value = value;
          }

          break;
        }

        case 'dry': {
          if (typeof value === 'number') {
            this.dry.gain.value = value;
          }

          break;
        }

        case 'wet': {
          if (typeof value === 'number') {
            this.wet.gain.value = value;
          }

          break;
        }
      }
    }

    return this;
  }

  /** @override */
  public override params(): Required<SlicerParams> {
    return {
      state: this.isActive,
      depth: this.depth.gain.value,
      rate : this.rate.value,
      dry  : this.dry.gain.value,
      wet  : this.wet.gain.value
    };
  }
}
