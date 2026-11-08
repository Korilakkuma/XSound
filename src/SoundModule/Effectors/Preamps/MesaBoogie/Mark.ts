import type { PreEqualizerParams, PostEqualizerParams, PreEqualizerFilterParams } from './MesaBoogie';

import { Effector } from '../../Effector';

import { PreEqualizer, PostEqualizer } from './MesaBoogie';

export type MarkParams = {
  state?: boolean,
  pre?: PreEqualizerParams,
  post?: PostEqualizerParams
};

/**
 * Effector's subclass for Preamplifier (Mesa/Boogie Mark Series).
 */
export class Mark extends Effector {
  private preEQ: PreEqualizer;
  private postEQ: PostEqualizer;
  private cabinetLowpass: BiquadFilterNode;
  private cabinetNotch: BiquadFilterNode;

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   */
  constructor(context: AudioContext) {
    super(context);

    const preEqualizerFilterParams: PreEqualizerFilterParams = {
      preHighpass : { frequency:   50, detune: 0, Q: -3,   gain: 0 },
      postHighpass: { frequency:   90, detune: 0, Q: -3,   gain: 0 },
      bass        : { frequency:  180, detune: 0, Q:  0,   gain: 0 },
      middle      : { frequency:  450, detune: 0, Q:  1.5, gain: 0 },
      treble      : { frequency: 1400, detune: 0, Q:  0,   gain: 0 },
      lowpass     : { frequency: 4500, detune: 0, Q: -3,   gain: 0 },
      highpass    : { frequency:   40, detune: 0, Q: -3,   gain: 0 },
    };

    this.preEQ  = new PreEqualizer(context, preEqualizerFilterParams);
    this.postEQ = new PostEqualizer(context);

    this.cabinetLowpass = context.createBiquadFilter();
    this.cabinetNotch   = context.createBiquadFilter();

    // Initialize parameters
    this.cabinetLowpass.type            = 'lowpass';
    this.cabinetLowpass.frequency.value = 3500;
    this.cabinetLowpass.Q.value         = 5;
    this.cabinetLowpass.gain.value      = 0;  // Not used

    this.cabinetNotch.type            = 'notch';
    this.cabinetNotch.frequency.value = 7500;
    this.cabinetNotch.Q.value         = 1;
    this.cabinetNotch.gain.value      = 0;  // Not used

    // `Preamp` is not connected by default
    this.deactivate();
  }

  /** @override */
  public override connect(): GainNode {
    // Clear connection
    this.input.disconnect(0);
    this.cabinetLowpass.disconnect(0);
    this.cabinetNotch.disconnect(0);

    if (this.isActive) {
      // GainNode (Input) -> Pre-Equalizer -> Cabinet (Notch -> Low-Pass) -> Post-Equalizer -> GainNode (Output)
      this.input.connect(this.preEQ.INPUT);
      this.preEQ.OUTPUT.connect(this.cabinetNotch);
      this.cabinetNotch.connect(this.cabinetLowpass);
      this.cabinetLowpass.connect(this.postEQ.INPUT);
      this.postEQ.OUTPUT.connect(this.output);
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
   * @param {keyof MarkParams|MarkParams} params This argument is string if getter. Otherwise, setter.
   * @return {MarkParams[keyof MarkParams]|Mesa} Return value is parameter for preamp effector if getter.
   *     Otherwise, return value is for method chain.
   */
  public param(params: 'state'): boolean;
  public param(params: 'pre'): MarkParams['pre'];
  public param(params: 'post'): MarkParams['post'];
  public param(params: MarkParams): Mark;
  public param(params: keyof MarkParams | MarkParams): MarkParams[keyof MarkParams] | Mark {
    if (typeof params === 'string') {
      switch (params) {
        case 'state': {
          return this.isActive;
        }

        case 'pre': {
          return this.preEQ.params();
        }

        case 'post': {
          return this.postEQ.params();
        }
      }
    }

    for (const [key, value] of Object.entries(params)) {
      switch (key) {
        case 'state': {
          if (typeof value === 'boolean') {
            if (value) {
              this.activate();
              this.preEQ.activate();
              this.postEQ.activate();
            } else {
              this.deactivate();
              this.preEQ.deactivate();
              this.postEQ.deactivate();
            }
          }

          break;
        }

        case 'pre': {
          if (typeof value === 'object') {
            this.preEQ.param(value);
          }

          break;
        }

        case 'post': {
          if (typeof value === 'object') {
            this.postEQ.param(value);
          }

          break;
        }
      }
    }

    return this;
  }

  /** @override */
  public override params(): Required<MarkParams> {
    return {
      state: this.isActive,
      pre  : this.preEQ.params(),
      post : this.postEQ.params()
    };
  }
}
