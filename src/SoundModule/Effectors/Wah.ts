import { Effector }  from './Effector';

export type WahParams = {
  state?: boolean,
  auto?: boolean,
  cutoff?: number,
  depth?: number,
  rate?: number,
  resonance?: number
};

/**
 * Effector's subclass for Wah.
 */
export class Wah extends Effector {
  private auto = false;

  private lowpass: BiquadFilterNode;
  private envelopeFollower: WaveShaperNode;
  private sensitivity: BiquadFilterNode;

  private depthRate = 0;

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   */
  constructor(context: AudioContext) {
    super(context);

    this.lowpass          = context.createBiquadFilter();
    this.envelopeFollower = context.createWaveShaper();
    this.sensitivity      = context.createBiquadFilter();

    // Initialize parameters
    this.lowpass.type            = 'lowpass';
    this.lowpass.frequency.value = this.auto ? 20 : 350;
    this.lowpass.Q.value         = 1;
    this.lowpass.gain.value      = 0;  // Not used

    this.envelopeFollower.curve = new Float32Array([1, 0, 1]);

    this.sensitivity.type            = 'lowpass';
    this.sensitivity.frequency.value = 350;
    this.sensitivity.Q.value         = 1;
    this.sensitivity.gain.value      = 0;  // Not used

    this.depth.gain.value = 0;
    this.rate.value       = 0;

    // `Wah` is not connected by default
    this.deactivate();

    this.connect();
  }

  /** @override */
  public override stop(stopTime?: number, releaseTime?: number): void {
    super.stop(stopTime, releaseTime);

    if (!this.auto && this.isActive) {
      // Connect `AudioNode`s again
      this.lfo.connect(this.depth);
      this.depth.connect(this.lowpass.frequency);
    }
  }

  /** @override */
  public override connect(): GainNode {
    // Clear connection
    this.input.disconnect(0);
    this.sensitivity.disconnect(0);
    this.envelopeFollower.disconnect(0);
    this.lowpass.disconnect(0);
    this.depth.disconnect(0);

    if (this.isActive) {
      // Effect ON

      if (this.auto) {
        // GainNode (Input) -> BiquadFilterNode (Sensitivity) -> GainNode (Output)
        this.input.connect(this.sensitivity);
        this.sensitivity.connect(this.output);

        // WaveShaperNode (Envelope Follower) -> BiquadFilterNode (Low-Pass filter) -> GainNode (Depth) -> AudioParam (frequency) ->  GainNode (Depth) -> AudioParam (frequency)
        this.input.connect(this.envelopeFollower);
        this.envelopeFollower.connect(this.lowpass);
        this.lowpass.connect(this.depth);
        this.depth.connect(this.sensitivity.frequency);
      } else {
        // GainNode (Input) -> BiquadFilterNode (Low-pass Filter) -> GainNode (Output)
        this.input.connect(this.lowpass);
        this.lowpass.connect(this.output);

        // LFO
        // OscillatorNode (LFO) -> GainNode (Depth) -> AudioParam (frequency)
        this.lfo.connect(this.depth);
        this.depth.connect(this.lowpass.frequency);
      }
    } else {
      // Effect OFF

      // GainNode (Input) -> GainNode (Output)
      this.input.connect(this.output);
    }

    return this.output;
  }

  /**
   * This method gets or sets parameters for wah effector.
   * This method is overloaded for type interface and type check.
   * @param {keyof WahParams|WahParams} params This argument is string if getter. Otherwise, setter.
   * @return {WahParams[keyof WahParams]|Wah} Return value is parameter for wah effector if getter.
   *     Otherwise, return value is for method chain.
   */
  public param(params: 'state'): boolean;
  public param(params: 'auto'): boolean;
  public param(params: 'cutoff'): number;
  public param(params: 'depth'): number;
  public param(params: 'rate'): number;
  public param(params: 'resonance'): number;
  public param(params: WahParams): Wah;
  public param(params: keyof WahParams | WahParams): WahParams[keyof WahParams] | Wah {
    if (typeof params === 'string') {
      switch (params) {
        case 'state': {
          return this.isActive;
        }

        case 'auto': {
          return this.auto;
        }

        case 'cutoff': {
          return this.auto ? this.sensitivity.frequency.value : this.lowpass.frequency.value;
        }

        case 'depth': {
          return this.depthRate;
        }

        case 'rate': {
          return this.rate.value;
        }

        case 'resonance': {
          return this.auto ? this.sensitivity.Q.value : this.lowpass.Q.value;
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

        case 'auto': {
          if (typeof value === 'boolean') {
            this.auto = value;
            this.connect();
          }

          break;
        }

        case 'cutoff': {
          if (typeof value === 'number') {
            if (this.auto) {
              this.sensitivity.frequency.value = value;
              this.lowpass.frequency.value     = 20;
            } else {
              this.lowpass.frequency.value = value;
            }
          }

          break;
        }

        case 'depth': {
          if (typeof value === 'number') {
            this.depthRate        = value;
            this.depth.gain.value = this.auto ? 10000 * value : this.lowpass.frequency.value * value;
          }

          break;
        }

        case 'rate': {
          if (typeof value === 'number') {
            this.rate.value = value;
          }

          break;
        }

        case 'resonance': {
          if (typeof value === 'number') {
            if (this.auto) {
              this.sensitivity.Q.value = value;
              this.lowpass.Q.value     = 1;
            } else {
              this.lowpass.Q.value = value;
            }
          }

          break;
        }
      }
    }

    return this;
  }

  /** @override */
  public override params(): Required<WahParams> {
    return {
      state    : this.isActive,
      auto     : this.auto,
      cutoff   : this.auto ? this.sensitivity.frequency.value : this.lowpass.frequency.value,
      depth    : this.auto ? this.depth.gain.value : this.depthRate,
      rate     : this.rate.value,
      resonance: this.auto ? this.sensitivity.Q.value : this.lowpass.Q.value
    };
  }

  /** @override */
  public override activate(): Wah {
    super.activate();
    return this;
  }

  /** @override */
  public override deactivate(): Wah {
    super.deactivate();
    return this;
  }
}
