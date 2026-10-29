import { Effector } from '../Effector';

export type JC120Params = {
  state?: boolean;
  volume?: number;
  bright?: number;
  bass?: number;
  middle?: number;
  treble?: number;
  level?: number;
};

/**
 * Effector's subclass for Preamplifier (Roland JC-120 (Jazz Chorus Guitar Amplifier)).
 */
export class JC120 extends Effector {
  private volume: GainNode;
  private level: GainNode;

  private bright: BiquadFilterNode;
  private bass: BiquadFilterNode;
  private middle: BiquadFilterNode;
  private treble: BiquadFilterNode;

  private volumeValue = 0.2;

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   */
  constructor(context: AudioContext) {
    super(context);

    this.volume = this.context.createGain();
    this.level  = this.context.createGain();

    this.bright = this.context.createBiquadFilter();
    this.bass   = this.context.createBiquadFilter();
    this.middle = this.context.createBiquadFilter();
    this.treble = this.context.createBiquadFilter();

    // Initialize parameters
    this.volume.gain.value = 5 * this.volumeValue;
    this.level.gain.value  = 1;

    this.bright.type = 'highshelf';
    this.bass.type   = 'lowshelf';
    this.middle.type = 'peaking';
    this.treble.type = 'highshelf';

    this.bright.frequency.value = 4000;
    this.bass.frequency.value   = 120;
    this.middle.frequency.value = 800;
    this.treble.frequency.value = 3500;

    this.bright.Q.value = 1;  // Not used
    this.bass.Q.value   = 1;  // Not used
    this.middle.Q.value = 1;
    this.treble.Q.value = 1;  // Not used

    this.bright.gain.value = 0;
    this.bass.gain.value   = 0;
    this.middle.gain.value = 0;
    this.treble.gain.value = 0;

    // `Preamp` is not connected by default
    this.deactivate();
  }

  /** @override */
  public override connect(): GainNode {
    this.input.disconnect(0);
    this.volume.disconnect(0);
    this.bright.disconnect(0);
    this.bass.disconnect(0);
    this.middle.disconnect(0);
    this.treble.disconnect(0);
    this.level.disconnect(0);

    if (this.isActive) {
      // Effect ON

      // GainNode (Input) -> GainNode (Volume) -> BiquadFilterNode (Bright) -> BiquadFilterNode (Bass) -> BiquadFilterNode (Middle) -> BiquadFilterNode (Treble) -> GainNode (Level) -> GainNode (Output);
      this.input.connect(this.volume);
      this.volume.connect(this.bright);
      this.bright.connect(this.bass);
      this.bass.connect(this.middle);
      this.middle.connect(this.treble);
      this.treble.connect(this.level);
      this.level.connect(this.output);
    } else {
      // Effect OFF

      // GainNode (Input) -> GainNode (Output)
      this.input.connect(this.output);
    }

    return this.output;
  }

  /**
   * This method gets or sets parameters for preamp effector.
   * This method is overloaded for type interface and type check.
   * @param {keyof JC120Params|JC120Params} params This argument is string if getter. Otherwise, setter.
   * @return {JC120Params[keyof JC120Params]|JC120} Return value is parameter for preamp effector if getter.
   *     Otherwise, return value is for method chain.
   */
  public param(params: 'state'): boolean;
  public param(params: 'volume'): number;
  public param(params: 'bright'): number;
  public param(params: 'bass'): number;
  public param(params: 'middle'): number;
  public param(params: 'treble'): number;
  public param(params: 'level'): number;
  public param(params: JC120Params): JC120;
  public param(params: keyof JC120Params | JC120Params): JC120Params[keyof JC120Params] | JC120 {
    if (typeof params === 'string') {
      switch (params) {
        case 'state': {
          return this.isActive;
        }

        case 'volume': {
          return this.volumeValue;
        }

        case 'bright': {
          return this.bright.gain.value;
        }

        case 'bass': {
          return this.bass.gain.value;
        }

        case 'middle': {
          return this.middle.gain.value;
        }

        case 'treble': {
          return this.treble.gain.value;
        }

        case 'level': {
          return this.level.gain.value;
        }
      }
    }

    for (const [key, value] of Object.entries(params)) {
      switch (key) {
        case 'state': {
          if (typeof value === 'boolean') {
            if (value) {
              this.activate();
            } else {
              this.deactivate();
            }
          }

          break;
        }

        case 'volume': {
          if (typeof value === 'number') {
            this.volumeValue       = value;
            this.volume.gain.value = 5 * value;

            if (this.volume.gain.value > 5) {
              this.volumeValue       = 1;
              this.volume.gain.value = 5;
            }
          }

          break;
        }

        case 'bright': {
          if (typeof value === 'number') {
            this.bright.gain.value = value;
          }

          break;
        }

        case 'bass': {
          if (typeof value === 'number') {
            this.bass.gain.value = value;
          }

          break;
        }

        case 'middle': {
          if (typeof value === 'number') {
            this.middle.gain.value = value;
          }

          break;
        }

        case 'treble': {
          if (typeof value === 'number') {
            this.treble.gain.value = value;
          }

          break;
        }

        case 'level': {
          if (typeof value === 'number') {
            this.level.gain.value = value;
          }

          break;
        }
      }
    }

    return this;
  }

  /** @override */
  public override params(): Required<JC120Params> {
    return {
      state : this.isActive,
      volume: this.volumeValue,
      bright: this.bright.gain.value,
      bass  : this.bass.gain.value,
      middle: this.middle.gain.value,
      treble: this.treble.gain.value,
      level : this.level.gain.value,
    };
  }
}
