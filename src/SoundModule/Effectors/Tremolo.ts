import { Effector } from './Effector';

export type TremoloParams = {
  state?: boolean,
  type?: OscillatorType,
  depth?: number,
  rate?: number
};

/**
 * Effector's subclass for Tremolo.
 */
export class Tremolo extends Effector {
  private amplitude: GainNode;

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   */
  constructor(context: AudioContext) {
    super(context);

    this.amplitude = context.createGain();

    // Initialize parameter
    this.amplitude.gain.value = 1;  // 1 +- depth
    this.lfo.type             = 'sine';
    this.depth.gain.value     = 0;
    this.rate.value           = 0;

    // `Tremolo` is not connected by default
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

    if (this.isActive) {
      // Effect ON

      // GainNode (Input) -> GainNode (Tremolo) -> GainNode (Output)
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
   * This method gets or sets parameters for tremolo effector.
   * This method is overloaded for type interface and type check.
   * @param {keyof TremoloParams|TremoloParams} params This argument is string if getter. Otherwise, setter.
   * @return {TremoloParams[keyof TremoloParams]|Tremolo} Return value is parameter for tremolo effector if getter.
   *     Otherwise, return value is for method chain.
   */
  public param(params: 'type'): OscillatorType;
  public param(params: 'depth'): number;
  public param(params: 'rate'): number;
  public param(params: TremoloParams): Tremolo;
  public param(params: keyof TremoloParams | TremoloParams): TremoloParams[keyof TremoloParams] | Tremolo {
    if (typeof params === 'string') {
      switch (params) {
        case 'state': {
          return this.isActive;
        }

        case 'type': {
          return this.lfo.type;
        }

        case 'depth': {
          return this.depth.gain.value;
        }

        case 'rate': {
          return this.rate.value;
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

        case 'type': {
          if (typeof value === 'string') {
            this.lfo.type = value;
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
      }
    }

    return this;
  }

  /** @override */
  public override params(): Required<TremoloParams> {
    return {
      state: this.isActive,
      type : this.lfo.type,
      depth: this.depth.gain.value,
      rate : this.rate.value
    };
  }
}
