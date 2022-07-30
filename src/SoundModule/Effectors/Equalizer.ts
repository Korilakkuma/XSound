import { Effector } from './Effector';

export type EqualizerParams = {
  state?: boolean,
  bass?: number,
  middle?: number,
  treble?: number,
  presence?: number
};

/**
 * Effector's subclass for Equalizer.
 * @constructor
 * @extends {Effector}
 */
export class Equalizer extends Effector {
  private bass: BiquadFilterNode;
  private middle: BiquadFilterNode;
  private treble: BiquadFilterNode;
  private presence: BiquadFilterNode;

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   **/
  constructor(context: AudioContext) {
    super(context, 0);

    this.bass     = context.createBiquadFilter();
    this.middle   = context.createBiquadFilter();
    this.treble   = context.createBiquadFilter();
    this.presence = context.createBiquadFilter();

    // Initialize parameters

    // Set filter type
    this.bass.type     = 'lowshelf';
    this.middle.type   = 'peaking';
    this.treble.type   = 'highshelf';
    this.presence.type = 'highshelf';

    // Set cutoff frequency
    this.bass.frequency.value     =  500;  // 500 Hz
    this.middle.frequency.value   = 1000;  // 1 kHz
    this.treble.frequency.value   = 2000;  // 2 kHz
    this.presence.frequency.value = 4000;  // 4 kHz

    // Set Q
    this.bass.Q.value     = Math.SQRT1_2;  // Not used
    this.middle.Q.value   = Math.SQRT1_2;
    this.treble.Q.value   = Math.SQRT1_2;  // Not used
    this.presence.Q.value = Math.SQRT1_2;  // Not used

    // Set Gain
    this.bass.gain.value     = 0;
    this.middle.gain.value   = 0;
    this.treble.gain.value   = 0;
    this.presence.gain.value = 0;

    // `Equalizer` is not connected by default
    this.deactivate();
  }

  /** @override */
  public override connect(): GainNode {
    // Clear connection
    this.input.disconnect(0);
    this.bass.disconnect(0);
    this.middle.disconnect(0);
    this.treble.disconnect(0);
    this.presence.disconnect(0);

    if (this.isActive) {
      // Effect ON

      // GainNode (Input) -> BiquadFilterNode (Bass: Low-shelving) -> BiquadFilterNode (Middle: Peaking) -> BiquadFilterNode (Treble: Peaking) -> BiquadFilterNode (Presence: High-shelving) -> GainNode (Output)
      this.input.connect(this.bass);
      this.bass.connect(this.middle);
      this.middle.connect(this.treble);
      this.treble.connect(this.presence);
      this.presence.connect(this.output);
    } else {
      // Effect OFF

      // GainNode (Input) -> GainNode (Output)
      this.input.connect(this.output);
    }

    return this.output;
  }

  /**
   * This method gets or sets parameters for equalizer.
   * This method is overloaded for type interface and type check.
   * @param {keyof EqualizerParams|EqualizerParams} params This argument is string if getter. Otherwise, setter.
   * @return {EqualizerParams[keyof EqualizerParams]|Equalizer} Return value is parameter for equalizer if getter.
   *     Otherwise, return value is for method chain.
   */
  public param(params: 'state'): boolean;
  public param(params: 'bass'): number;
  public param(params: 'middle'): number;
  public param(params: 'treble'): number;
  public param(params: 'presence'): number;
  public param(params: EqualizerParams): Equalizer;
  public param(params: keyof EqualizerParams | EqualizerParams): EqualizerParams[keyof EqualizerParams] | Equalizer {
    if (typeof params === 'string') {
      switch (params) {
        case 'state':
          return this.isActive;
        case 'bass':
          return this.bass.gain.value;
        case 'middle':
          return this.middle.gain.value;
        case 'treble':
          return this.treble.gain.value;
        case 'presence':
          return this.presence.gain.value;
        default:
          return this;
      }
    }

    for (const [key, value] of Object.entries(params)) {
      switch (key) {
        case 'state':
          if (typeof value === 'boolean') {
            this.isActive = value;
          }

          break;
        case 'bass':
          if (typeof value === 'number') {
            this.bass.gain.value = value;
          }

          break;
        case 'middle':
          if (typeof value === 'number') {
            this.middle.gain.value = value;
          }

          break;
        case 'treble':
          if (typeof value === 'number') {
            this.treble.gain.value = value;
          }

          break;
        case 'presence':
          if (typeof value === 'number') {
            this.presence.gain.value = value;
          }

          break;
        default:
          break;
      }
    }

    return this;
  }

  /** @override */
  public override params(): Required<EqualizerParams> {
    return {
      state   : this.isActive,
      bass    : this.bass.gain.value,
      middle  : this.middle.gain.value,
      treble  : this.treble.gain.value,
      presence: this.presence.gain.value
    };
  }

  /** @override */
  public override activate(): Equalizer {
    super.activate();
    return this;
  }

  /** @override */
  public override deactivate(): Equalizer {
    super.deactivate();
    return this;
  }
}
