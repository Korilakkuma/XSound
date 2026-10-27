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
  postMiddle?: FilterParams,
  postTreble?: FilterParams
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
      notch     : { frequency: 8800, gain: 0.0,  Q: 0.6 },
      preTone   : { frequency: 4400, gain: 0.0,  Q: 0.0 },
      postTone  : { frequency: 6400, gain: 0.0,  Q: 6.4 },
      preBass   : { frequency: 120,  gain: 0.0,  Q: 2.0 },
      postBass  : { frequency: 80,   gain: 0.0,  Q: 6.0 },
      postMiddle: { frequency: 1340, gain: -8.0, Q: 3.0 },
      postTreble: { frequency: 1340, gain: 8.0,  Q: 3.0 }
    },
    postTreble: {
      notch     : { frequency: 10800, gain: 0.0,   Q: 2.0 },
      preTone   : { frequency: 4000,  gain: 0.0,   Q: 1.5 },
      postTone  : { frequency: 6000,  gain: 0.0,   Q: 8.0 },
      preBass   : { frequency: 180,   gain: 0.0,   Q: -0.4 },
      postBass  : { frequency: 90,    gain: 0.0,   Q: 6.0 },
      postMiddle: { frequency: 1600,  gain: -12.0, Q: 3.0 },
      postTreble: { frequency: 680,   gain: 4.0,   Q: 0.0 }
    },
    postMiddle: {
      notch     : { frequency: 8000, gain: 0.0,  Q: 1.2 },
      preTone   : { frequency: 2800, gain: 0.0,  Q: 2.0 },
      postTone  : { frequency: 5200, gain: 0.0,  Q: 10.0 },
      preBass   : { frequency: 120,  gain: 0.0,  Q: 0.0 },
      postBass  : { frequency: 80,   gain: 0.0,  Q: 12.0 },
      postMiddle: { frequency: 1000, gain: -3.0, Q: 1.4 },
      postTreble: { frequency: 500,  gain: 3.0,  Q: 0.0 }
    }
  };

  private notch: BiquadFilterNode;
  private preTone: BiquadFilterNode;
  private postTone: BiquadFilterNode;
  private preBass: BiquadFilterNode;
  private postBass: BiquadFilterNode;
  private postMiddle: BiquadFilterNode;
  private postTreble: BiquadFilterNode;

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   */
  constructor(context: AudioContext) {
    super(context);

    this.notch      = context.createBiquadFilter();
    this.preTone    = context.createBiquadFilter();
    this.postTone   = context.createBiquadFilter();
    this.preBass    = context.createBiquadFilter();
    this.postBass   = context.createBiquadFilter();
    this.postMiddle = context.createBiquadFilter();
    this.postTreble = context.createBiquadFilter();

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

    this.postMiddle.type            = 'peaking';
    this.postMiddle.frequency.value = 1340;
    this.postMiddle.gain.value      = -8.0;
    this.postMiddle.Q.value         = 3.0;

    this.postTreble.type            = 'highshelf';
    this.postTreble.frequency.value = 1340;
    this.postTreble.gain.value      = 8.0;
    this.postTreble.Q.value         = 0;

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
    this.postMiddle.disconnect(0);
    this.postTreble.disconnect(0);

    if (this.isActive) {
      // Effect ON

      // GainNode (Input) -> BiquadFilterNode (Notch) -> BiquadFilterNode (Low-Pass) -> BiquadFilterNode (Low-Pass) -> BiquadFilterNode (High-Pass) -> BiquadFilterNode (High-Pass) -> BiquadFilterNode (Peaking) -> BiquadFilterNode (High-Shelving) -> GainNode (Output)
      this.input.connect(this.notch);
      this.notch.connect(this.preTone);
      this.preTone.connect(this.postTone);
      this.postTone.connect(this.preBass);
      this.preBass.connect(this.postBass);
      this.postBass.connect(this.postMiddle);
      this.postMiddle.connect(this.postTreble);
      this.postTreble.connect(this.output);
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
  public param(params: 'postMiddle'): FilterParams;
  public param(params: 'postTreble'): FilterParams;
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

        case 'postMiddle': {
          return { frequency: this.postMiddle.frequency.value, gain: this.postMiddle.gain.value, Q: this.postMiddle.Q.value };
        }

        case 'postTreble': {
          return { frequency: this.postTreble.frequency.value, gain: this.postTreble.gain.value, Q: this.postTreble.Q.value };
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

        case 'postMiddle': {
          if (typeof value === 'object') {
            if (typeof value.frequency === 'number') {
              this.postMiddle.frequency.value = value.frequency;
            }

            if (typeof value.gain === 'number') {
              this.postMiddle.gain.value = value.gain;
            }

            if (typeof value.Q === 'number') {
              this.postMiddle.Q.value = value.Q;
            }
          }

          break;
        }

        case 'postTreble': {
          if (typeof value === 'object') {
            if (typeof value.frequency === 'number') {
              this.postTreble.frequency.value = value.frequency;
            }

            if (typeof value.gain === 'number') {
              this.postTreble.gain.value = value.gain;
            }

            if (typeof value.Q === 'number') {
              this.postTreble.Q.value = value.Q;
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
      state     : this.isActive,
      notch     : { frequency: this.notch.frequency.value,      gain: this.notch.gain.value,      Q: this.notch.Q.value },
      preTone   : { frequency: this.preTone.frequency.value,    gain: this.preTone.gain.value,    Q: this.preTone.Q.value },
      postTone  : { frequency: this.postTone.frequency.value,   gain: this.postTone.gain.value,   Q: this.postTone.Q.value },
      preBass   : { frequency: this.preBass.frequency.value,    gain: this.preBass.gain.value,    Q: this.preBass.Q.value },
      postBass  : { frequency: this.postBass.frequency.value,   gain: this.postBass.gain.value,   Q: this.postBass.Q.value },
      postMiddle: { frequency: this.postMiddle.frequency.value, gain: this.postMiddle.gain.value, Q: this.postMiddle.Q.value },
      postTreble: { frequency: this.postTreble.frequency.value, gain: this.postTreble.gain.value, Q: this.postTreble.Q.value },
    };
  }
}
