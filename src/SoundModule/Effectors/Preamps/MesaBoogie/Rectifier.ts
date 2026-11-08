import type { PreEqualizerParams, PostEqualizerParams, PreEqualizerFilterParams } from './MesaBoogie';

import { Effector } from '../../Effector';

import { PreEqualizer, PostEqualizer } from './MesaBoogie';

export type RectifierParams = {
  state?: boolean,
  pre?: PreEqualizerParams,
  post?: PostEqualizerParams
};

/**
 * Effector's subclass for Preamplifier (Mesa/Boogie Rectifier).
 */
export class Rectifier extends Effector {
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
      preHighpass : { frequency:   40, detune: 0, Q: -3,   gain: 0 },
      postHighpass: { frequency:   80, detune: 0, Q: -3,   gain: 0 },
      bass        : { frequency:  160, detune: 0, Q:  0,   gain: 0 },
      middle      : { frequency:  284, detune: 0, Q:  1.5, gain: 0 },
      treble      : { frequency: 1200, detune: 0, Q:  0,   gain: 0 },
      lowpass     : { frequency: 4000, detune: 0, Q: -3,   gain: 0 },
      highpass    : { frequency:   40, detune: 0, Q: -3,   gain: 0 },
    };

    this.preEQ  = new PreEqualizer(context, preEqualizerFilterParams);
    this.postEQ = new PostEqualizer(context);

    this.cabinetLowpass = context.createBiquadFilter();
    this.cabinetNotch   = context.createBiquadFilter();

    // Initialize parameters
    this.cabinetLowpass.type            = 'lowpass';
    this.cabinetLowpass.frequency.value = 3200;
    this.cabinetLowpass.Q.value         = 6;
    this.cabinetLowpass.gain.value      = 0;  // Not used

    this.cabinetNotch.type            = 'notch';
    this.cabinetNotch.frequency.value = 8000;
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
      // Effect ON

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
   * @param {keyof RectifierParams|RectifierParams} params This argument is string if getter. Otherwise, setter.
   * @return {RectifierParams[keyof RectifierParams]|Rectifier} Return value is parameter for preamp effector if getter.
   *     Otherwise, return value is for method chain.
   */
  public param(params: 'state'): boolean;
  public param(params: 'pre'): RectifierParams['pre'];
  public param(params: 'post'): RectifierParams['post'];
  public param(params: RectifierParams): Rectifier;
  public param(params: keyof RectifierParams | RectifierParams): RectifierParams[keyof RectifierParams] | Rectifier {
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
  public override params(): Required<RectifierParams> {
    return {
      state: this.isActive,
      pre  : this.preEQ.params(),
      post : this.postEQ.params()
    };
  }
}
