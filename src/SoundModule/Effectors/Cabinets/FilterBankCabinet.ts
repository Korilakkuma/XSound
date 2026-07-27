import { Effector } from '../Effector';

type FilterParams = {
  frequency?: number,
  gain?: number,
  Q?: number
};

export type FilterBankCabinetParams = {
  state?: boolean,
  notch?: FilterParams,
  preTone?: FilterParams,
  postTone?: FilterParams,
  preBass?: FilterParams,
  postBass?: FilterParams,
  middle?: FilterParams,
  treble?: FilterParams
};

/**
 * Effector's subclass for FilterBankCabinet.
 */
export class FilterBankCabinet extends Effector {
  /**
   * @see https://lazyecology.web.fc2.com/reverb/special/guitar_tone_process/web_guitar_amp_spk_sim.html
   */
  public static readonly FilterBankPresets = {
    default: {
      notch   : { frequency: 8800, gain: 0.0,  Q: 0.6 },
      preTone : { frequency: 4400, gain: 0.0,  Q: 0.0 },
      postTone: { frequency: 6400, gain: 0.0,  Q: 6.4 },
      preBass : { frequency: 120,  gain: 0.0,  Q: 2.0 },
      postBass: { frequency: 80,   gain: 0.0,  Q: 6.0 },
      middle  : { frequency: 1340, gain: -8.0, Q: 3.0 },
      treble  : { frequency: 1340, gain: 8.0,  Q: 3.0 }
    },
    treble: {
      notch   : { frequency: 10800, gain: 0.0,   Q: 2.0 },
      preTone : { frequency: 4000,  gain: 0.0,   Q: 1.5 },
      postTone: { frequency: 6000,  gain: 0.0,   Q: 8.0 },
      preBass : { frequency: 180,   gain: 0.0,   Q: -0.4 },
      postBass: { frequency: 90,    gain: 0.0,   Q: 6.0 },
      middle  : { frequency: 1600,  gain: -12.0, Q: 3.0 },
      treble  : { frequency: 680,   gain: 4.0,   Q: 0.0 }
    },
    middle: {
      notch   : { frequency: 8000, gain: 0.0,  Q: 1.2 },
      preTone : { frequency: 2800, gain: 0.0,  Q: 2.0 },
      postTone: { frequency: 5200, gain: 0.0,  Q: 10.0 },
      preBass : { frequency: 120,  gain: 0.0,  Q: 0.0 },
      postBass: { frequency: 80,   gain: 0.0,  Q: 12.0 },
      middle  : { frequency: 1000, gain: -3.0, Q: 1.4 },
      treble  : { frequency: 500,  gain: 3.0,  Q: 0.0 }
    }
  };

  private notch: BiquadFilterNode;
  private preTone: BiquadFilterNode;
  private postTone: BiquadFilterNode;
  private preBass: BiquadFilterNode;
  private postBass: BiquadFilterNode;
  private middle: BiquadFilterNode;
  private treble: BiquadFilterNode;

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   */
  constructor(context: AudioContext) {
    super(context);

    this.notch  = context.createBiquadFilter();
    this.preTone  = context.createBiquadFilter();
    this.postTone  = context.createBiquadFilter();
    this.preBass  = context.createBiquadFilter();
    this.postBass  = context.createBiquadFilter();
    this.middle = context.createBiquadFilter();
    this.treble = context.createBiquadFilter();

    // Initialize parameters
    this.notch.type            = 'notch';
    this.notch.frequency.value = 8800;
    this.notch.gain.value      = 0;
    this.notch.Q.value         = 0.6;

    this.preTone.type            = 'lowpass';
    this.preTone.frequency.value = 4400;
    this.preTone.gain.value      = 0;
    this.preTone.Q.value         = 0;

    this.postTone.type            = 'lowpass';
    this.postTone.frequency.value = 6400;
    this.postTone.gain.value      = 0;
    this.postTone.Q.value         = 6.4;

    this.preBass.type            = 'highpass';
    this.preBass.frequency.value = 120;
    this.preBass.gain.value      = 0;
    this.preBass.Q.value         = 2.0;

    this.postBass.type            = 'highpass';
    this.postBass.frequency.value = 80;
    this.postBass.gain.value      = 0;
    this.postBass.Q.value         = 6.0;

    this.middle.type            = 'peaking';
    this.middle.frequency.value = 1340;
    this.middle.gain.value      = -8.0;
    this.middle.Q.value         = 3.0;

    this.treble.type            = 'highshelf';
    this.treble.frequency.value = 1340;
    this.treble.gain.value      = 8.0;
    this.treble.Q.value         = 0;

    // `FilterBankCabinet` is connected by default
    this.activate();
  }

  /** @override */
  public override connect(): GainNode {
    // Clear connection
    this.input.disconnect(0);
    this.notch.disconnect(0);
    this.preTone.disconnect(0);
    this.postTone.disconnect(0);
    this.preBass.disconnect(0);
    this.postBass.disconnect(0);
    this.middle.disconnect(0);
    this.treble.disconnect(0);

    if (this.isActive) {
      // Effect ON

      // GainNode (Input) -> BiquadFilterNode (Notch) -> BiquadFilterNode (Low-Pass) -> BiquadFilterNode (Low-Pass) -> BiquadFilterNode (High-Pass) -> BiquadFilterNode (High-Pass) -> BiquadFilterNode (Peaking) -> BiquadFilterNode (High-Shelving) -> GainNode (Output)
      this.input.connect(this.notch);
      this.notch.connect(this.preTone);
      this.preTone.connect(this.postTone);
      this.postTone.connect(this.preBass);
      this.preBass.connect(this.postBass);
      this.postBass.connect(this.middle);
      this.middle.connect(this.treble);
      this.treble.connect(this.output);
    } else {
      // Effect OFF

      // GainNode (Input) -> GainNode (Output)
      this.input.connect(this.output);
    }

    return this.output;
  }

  /**
   * This method gets or sets parameters for cabinet.
   * This method is overloaded for type interface and type check.
   * @param {keyof FilterBankCabinetParams|FilterBankCabinetParams} params This argument is string if getter. Otherwise, setter.
   * @return {FilterBankCabinetParams[keyof FilterBankCabinetParams]|FilterBankCabinet} Return value is parameter for cabinet if getter.
   *     Otherwise, return value is for method chain.
   */
  public param(params: 'state'): boolean;
  public param(params: 'notch'): FilterParams;
  public param(params: 'preTone'): FilterParams;
  public param(params: 'postTone'): FilterParams;
  public param(params: 'preBass'): FilterParams;
  public param(params: 'postBass'): FilterParams;
  public param(params: 'middle'): FilterParams;
  public param(params: 'treble'): FilterParams;
  public param(params: FilterBankCabinetParams): FilterBankCabinet;
  public param(params: keyof FilterBankCabinetParams | FilterBankCabinetParams): FilterBankCabinetParams[keyof FilterBankCabinetParams] | FilterBankCabinet {
    if (typeof params === 'string') {
      switch (params) {
        case 'state': {
          return this.isActive;
        }

        case 'notch': {
          return { frequency: this.notch.frequency.value, gain: this.notch.gain.value, Q: this.notch.Q.value };
        }

        case 'preTone': {
          return { frequency: this.preTone.frequency.value, gain: this.preTone.gain.value, Q: this.preTone.Q.value };
        }

        case 'postTone': {
          return { frequency: this.postTone.frequency.value, gain: this.postTone.gain.value, Q: this.postTone.Q.value };
        }

        case 'preBass': {
          return { frequency: this.preBass.frequency.value, gain: this.preBass.gain.value, Q: this.preBass.Q.value };
        }

        case 'postBass': {
          return { frequency: this.postBass.frequency.value, gain: this.postBass.gain.value, Q: this.postBass.Q.value };
        }

        case 'middle': {
          return { frequency: this.middle.frequency.value, gain: this.middle.gain.value, Q: this.middle.Q.value };
        }

        case 'treble': {
          return { frequency: this.treble.frequency.value, gain: this.treble.gain.value, Q: this.treble.Q.value };
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

        case 'notch': {
          if (typeof value === 'object') {
            if (typeof value.frequency === 'number') {
              this.notch.frequency.value = value.frequency;
            }

            if (typeof value.gain === 'number') {
              this.notch.gain.value = value.gain;
            }

            if (typeof value.Q === 'number') {
              this.notch.Q.value = value.Q;
            }
          }

          break;
        }

        case 'preTone': {
          if (typeof value === 'object') {
            if (typeof value.frequency === 'number') {
              this.preTone.frequency.value = value.frequency;
            }

            if (typeof value.gain === 'number') {
              this.preTone.gain.value = value.gain;
            }

            if (typeof value.Q === 'number') {
              this.preTone.Q.value = value.Q;
            }
          }

          break;
        }

        case 'postTone': {
          if (typeof value === 'object') {
            if (typeof value.frequency === 'number') {
              this.postTone.frequency.value = value.frequency;
            }

            if (typeof value.gain === 'number') {
              this.postTone.gain.value = value.gain;
            }

            if (typeof value.Q === 'number') {
              this.postTone.Q.value = value.Q;
            }
          }

          break;
        }

        case 'preBass': {
          if (typeof value === 'object') {
            if (typeof value.frequency === 'number') {
              this.preBass.frequency.value = value.frequency;
            }

            if (typeof value.gain === 'number') {
              this.preBass.gain.value = value.gain;
            }

            if (typeof value.Q === 'number') {
              this.preBass.Q.value = value.Q;
            }
          }

          break;
        }

        case 'postBass': {
          if (typeof value === 'object') {
            if (typeof value.frequency === 'number') {
              this.postBass.frequency.value = value.frequency;
            }

            if (typeof value.gain === 'number') {
              this.postBass.gain.value = value.gain;
            }

            if (typeof value.Q === 'number') {
              this.postBass.Q.value = value.Q;
            }
          }

          break;
        }

        case 'middle': {
          if (typeof value === 'object') {
            if (typeof value.frequency === 'number') {
              this.middle.frequency.value = value.frequency;
            }

            if (typeof value.gain === 'number') {
              this.middle.gain.value = value.gain;
            }

            if (typeof value.Q === 'number') {
              this.middle.Q.value = value.Q;
            }
          }

          break;
        }

        case 'treble': {
          if (typeof value === 'object') {
            if (typeof value.frequency === 'number') {
              this.treble.frequency.value = value.frequency;
            }

            if (typeof value.gain === 'number') {
              this.treble.gain.value = value.gain;
            }

            if (typeof value.Q === 'number') {
              this.treble.Q.value = value.Q;
            }
          }

          break;
        }
      }
    }

    return this;
  }

  /** @override */
  public override params(): Required<FilterBankCabinetParams> {
    return {
      state   : this.isActive,
      notch   : { frequency: this.notch.frequency.value,    gain: this.notch.gain.value,    Q: this.notch.Q.value },
      preTone : { frequency: this.preTone.frequency.value,  gain: this.preTone.gain.value,  Q: this.preTone.Q.value },
      postTone: { frequency: this.postTone.frequency.value, gain: this.postTone.gain.value, Q: this.postTone.Q.value },
      preBass : { frequency: this.preBass.frequency.value,  gain: this.preBass.gain.value,  Q: this.preBass.Q.value },
      postBass: { frequency: this.postBass.frequency.value, gain: this.postBass.gain.value, Q: this.postBass.Q.value },
      middle  : { frequency: this.middle.frequency.value,   gain: this.middle.gain.value,   Q: this.middle.Q.value },
      treble  : { frequency: this.treble.frequency.value,   gain: this.treble.gain.value,   Q: this.treble.Q.value },
    };
  }
}
