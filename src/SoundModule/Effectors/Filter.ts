import { Effector } from './Effector';

export type FilterParams = {
  state?: boolean,
  type?: BiquadFilterType,
  frequency?: number,
  Q?: number,
  gain?: number,
  range?: number,
  attack?: number,
  decay?: number,
  sustain?: number,
  release?: number
};

/**
 * Effector's subclass for Filter.
 * @constructor
 * @extends {Effector}
 */
export class Filter extends Effector {
  private filter: BiquadFilterNode;

  private maxFrequency: number;
  private range = 0.1;  // 10% -> between `this.maxFrequency * 0.1` and `this.maxFrequency`

  private attack  = 0.01;
  private decay   = 0.3;
  private sustain = 1.0;
  private release = 1.0;

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   */
  constructor(context: AudioContext) {
    super(context, 0);

    this.filter = context.createBiquadFilter();

    // Initialize parameters
    this.filter.type            = 'lowpass';
    this.filter.frequency.value = 350;
    this.filter.Q.value         = 1;
    this.filter.gain.value      = 0;

    this.maxFrequency = this.filter.frequency.value;

    // `Filter` is not connected by default
    this.deactivate();
  }

  /** @override */
  public override start(startTime?: number): void {
    if (!this.isActive) {
      return;
    }

    const t0      = startTime ?? this.context.currentTime;
    const t1      = t0 + this.attack;
    const t2      = this.decay;
    const t2Value = this.sustain * this.maxFrequency;

    const minFrequnecy = this.maxFrequency * this.range;

    // Envelope Generator for filter
    this.filter.frequency.cancelScheduledValues(t0);
    this.filter.frequency.setValueAtTime(minFrequnecy, t0);
    this.filter.frequency.linearRampToValueAtTime(this.maxFrequency, t1);  // Attack
    this.filter.frequency.setTargetAtTime(t2Value, t1, t2);  // Decay -> Sustain
  }

  /** @override */
  public override stop(stopTime?: number): void {
    if (!this.isActive) {
      return;
    }

    const t3 = stopTime ?? this.context.currentTime;
    const t4 = this.release;

    const minFrequnecy = this.maxFrequency * this.range;

    // Envelope Generator for filter
    this.filter.frequency.cancelScheduledValues(t3);
    this.filter.frequency.setValueAtTime(this.filter.frequency.value, t3);
    this.filter.frequency.setTargetAtTime(minFrequnecy, t3, t4);  // Sustain -> Release
  }

  /** @override */
  public override connect(): GainNode {
    // Clear connection
    this.input.disconnect(0);
    this.filter.disconnect(0);

    if (this.isActive) {
      // Effector ON

      // GainNode (Input) -> BiquadFilterNode (Filter) -> GainNode (Output)
      this.input.connect(this.filter);
      this.filter.connect(this.output);
    } else {
      // Effector OFF

      // GainNode (Input) -> GainNode (Output)
      this.input.connect(this.output);
    }

    return this.output;
  }

  /**
   * This method gets or sets parameters for filter effector.
   * This method is overloaded for type interface and type check.
   * @param {keyof FilterParams|FilterParams} params This argument is string if getter. Otherwise, setter.
   * @return {FilterParams[keyof FilterParams]|Filter} Return value is parameter for filter effector if getter.
   *     Otherwise, return value is for method chain.
   */
  public param(params: 'type'): BiquadFilterType;
  public param(params: 'frequency'): number;
  public param(params: 'Q'): number;
  public param(params: 'gain'): number;
  public param(params: 'range'): number;
  public param(params: 'attack'): number;
  public param(params: 'decay'): number;
  public param(params: 'sustain'): number;
  public param(params: 'release'): number;
  public param(params: FilterParams): Filter;
  public param(params: keyof FilterParams | FilterParams): FilterParams[keyof FilterParams] | Filter {
    if (typeof params === 'string') {
      switch (params) {
        case 'type':
          return this.filter.type;
        case 'frequency':
          return this.filter.frequency.value;
        case 'Q':
          return this.filter.Q.value;
        case 'gain':
          return this.filter.gain.value;
        case 'range':
          return this.range;
        case 'attack':
          return this.attack;
        case 'decay':
          return this.decay;
        case 'sustain':
          return this.sustain;
        case 'release':
          return this.release;
        default:
          return this;
      }
    }

    for (const [key, value] of Object.entries(params)) {
      switch (key) {
        case 'type':
          if (typeof value === 'string') {
            this.filter.type = value;
          }

          break;
        case 'frequency':
          if (typeof value === 'number') {
            this.filter.frequency.value = value;
            this.maxFrequency           = value;
          }

          break;
        case 'Q':
          if (typeof value === 'number') {
            this.filter.Q.value = value;
          }

          break;
        case 'gain':
          if (typeof value === 'number') {
            this.filter.gain.value = value;
          }

          break;
        case 'range':
          if (typeof value === 'number') {
            this.range = value;
          }

          break;
        case 'attack':
          if (typeof value === 'number') {
            this.attack = value;
          }

          break;
        case 'decay':
          if (typeof value === 'number') {
            this.decay = value;
          }

          break;
        case 'sustain':
          if (typeof value === 'number') {
            this.sustain = value;
          }

          break;
        case 'release':
          if (typeof value === 'number') {
            this.release = value;
          }

          break;
        default:
          break;
      }
    }

    return this;
  }

  /** @override */
  public override params(): FilterParams {
    return {
      state    : this.isActive,
      type     : this.filter.type,
      frequency: this.filter.frequency.value,
      Q        : this.filter.Q.value,
      gain     : this.filter.gain.value,
      range    : this.range,
      attack   : this.attack,
      decay    : this.decay,
      sustain  : this.sustain,
      release  : this.release
    };
  }

  /** @override */
  public override activate(): Filter {
    this.isActive = true;

    // Update connection
    this.connect();

    return this;
  }

  /** @override */
  public override deactivate(): Filter {
    this.isActive = false;

    // Update connection
    this.connect();

    return this;
  }
}
