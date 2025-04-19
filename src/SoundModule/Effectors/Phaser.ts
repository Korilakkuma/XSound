import { Effector } from './Effector';

export type PhaserNumberOfStages = 0 | 2 | 4 | 8 | 12 | 24;

export type PhaserParams = {
  state?: boolean,
  stage?: PhaserNumberOfStages,
  frequency?: number,
  resonance?: number,
  depth?: number,
  rate?: number,
  mix?: number,
  dry?: number,
  wet?: number
};

/**
 * Effector's subclass for Phaser.
 */
export class Phaser extends Effector {
  public static MAX_STAGES = 24;  // The max number of All-pass Filters

  private numberOfStages: PhaserNumberOfStages = 12;  // The default number of All-pass Filters
  private filters: BiquadFilterNode[] = [];
  private dry: GainNode;
  private wet: GainNode;
  private depthRate = 0;

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   */
  constructor(context: AudioContext) {
    super(context);

    for (let i = 0; i < Phaser.MAX_STAGES; i++) {
      const filter = context.createBiquadFilter();

      filter.type            = 'allpass';
      filter.frequency.value = 350;
      filter.Q.value         = 1;
      filter.gain.value      = 0;  // Not used

      this.filters.push(filter);
    }

    this.dry = context.createGain();
    this.wet = context.createGain();

    // Initialize parameters
    this.depth.gain.value = 0;
    this.rate.value       = 0;
    this.dry.gain.value   = 1;
    this.wet.gain.value   = 0;

    // `Phaser` is not connected by default
    this.deactivate();

    // LFO
    // GainNode (LFO) -> GainNode (Depth) -> AudioParam (frequency)
    this.lfo.connect(this.depth);

    for (let i = 0; i < Phaser.MAX_STAGES; i++) {
      this.depth.connect(this.filters[i].frequency);
    }
  }

  /** @override */
  public override stop(stopTime?: number, releaseTime?: number): void {
    super.stop(stopTime, releaseTime);

    if (this.isActive) {
      // Connect `AudioNode`s again
      this.lfo.connect(this.depth);

      for (let i = 0; i < Phaser.MAX_STAGES; i++) {
        this.depth.connect(this.filters[i].frequency);
      }
    }
  }

  /** @override */
  public override connect(): GainNode {
    // Clear connection
    this.input.disconnect(0);

    for (let i = 0; i < Phaser.MAX_STAGES; i++) {
      this.filters[i].disconnect(0);
    }

    this.dry.disconnect(0);
    this.wet.disconnect(0);

    if (this.isActive && (this.numberOfStages > 0)) {
      // Effect ON

      // GainNode (Input) -> GainNode (Dry) -> GainNode (Output)
      this.input.connect(this.dry);
      this.dry.connect(this.output);

      // GainNode (Input) -> BiquadFilterNode (All-pass Filter x N) -> GainNode (Wet) -> GainNode (Output)
      this.input.connect(this.filters[0]);

      for (let i = 0; i < this.numberOfStages; i++) {
        if (i < (this.numberOfStages - 1)) {
          this.filters[i].connect(this.filters[i + 1]);
        } else {
          this.filters[i].connect(this.wet);
          this.wet.connect(this.output);
        }
      }

      // Phaser don't work in Firefox if there is feedback connection.
      // GainNode (Input) -> BiquadFilterNode (All-pass Filter x N) -> GainNode (Feedback) -> BiquadFilterNode (All-pass Filter x N) ...
    } else {
      // Effect OFF

      // GainNode (Input) -> GainNode (Output)
      this.input.connect(this.output);
    }

    return this.output;
  }

  /**
   * This method gets or sets parameters for phaser effector.
   * This method is overloaded for type interface and type check.
   * @param {keyof PhaserParams|PhaserParams} params This argument is string if getter. Otherwise, setter.
   * @return {PhaserParams[keyof PhaserParams]|Phaser} Return value is parameter for phaser effector if getter.
   *     Otherwise, return value is for method chain.
   */
  public param(params: 'state'): boolean;
  public param(params: 'stage'): PhaserNumberOfStages;
  public param(params: 'frequency'): number;
  public param(params: 'resonance'): number;
  public param(params: 'depth'): number;
  public param(params: 'rate'): number;
  public param(params: 'mix'): number;
  public param(params: 'dry'): number;
  public param(params: 'wet'): number;
  public param(params: PhaserParams): Phaser;
  public param(params: keyof PhaserParams | PhaserParams): PhaserParams[keyof PhaserParams] | Phaser {
    if (typeof params === 'string') {
      switch (params) {
        case 'state': {
          return this.isActive;
        }

        case 'stage': {
          return this.numberOfStages;
        }

        case 'frequency': {
          return this.filters[0].frequency.value;
        }

        case 'resonance': {
          return this.filters[0].Q.value;
        }

        case 'depth': {
          return this.depthRate;
        }

        case 'rate': {
          return this.rate.value;
        }

        case 'mix': {
          return this.wet.gain.value;
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

        case 'stage': {
          switch (value) {
            case  0:
            case  2:
            case  4:
            case  8:
            case 12:
            case 24: {
              this.numberOfStages = value;

              // Update connection
              this.connect();
              break;
            }
          }

          break;
        }

        case 'frequency': {
          if (typeof value === 'number') {
            for (const filter of this.filters) {
              filter.frequency.value = value;
            }

            this.depth.gain.value = value * this.depthRate;
          }

          break;
        }

        case 'resonance': {
          if (typeof value === 'number') {
            for (const filter of this.filters) {
              filter.Q.value = value;
            }
          }

          break;
        }

        case 'depth': {
          if (typeof value === 'number') {
            this.depthRate        = value;
            this.depth.gain.value = this.filters[0].frequency.value * value;
          }

          break;
        }

        case 'rate': {
          if (typeof value === 'number') {
            this.rate.value = value;
          }

          break;
        }

        case 'mix': {
          if (typeof value === 'number') {
            this.wet.gain.value = value;
            this.dry.gain.value = 1 - this.wet.gain.value;
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
  public override params(): Required<PhaserParams> {
    return {
      state    : this.isActive,
      stage    : this.numberOfStages,
      frequency: this.filters[0].frequency.value,
      resonance: this.filters[0].Q.value,
      depth    : this.depthRate,
      rate     : this.rate.value,
      mix      : this.wet.gain.value,
      dry      : this.dry.gain.value,
      wet      : this.wet.gain.value
    };
  }
}
