import type { PreEqualizerParams, PostFilterParams, PreEqualizerFilterParams, PostParams } from './Fender';

import { Effector } from '../../Effector';

import { PreEqualizer, PostFilter } from './Fender';

export type BassmanParams = {
  state?: boolean,
  pre?: PreEqualizerParams,
  post?: PostFilterParams
};

/**
 * Effector's subclass for Preamplifier (Fender Bassman Tweed Style).
 */
export class Bassman extends Effector {
  private preEQ: PreEqualizer;
  private postFilter: PostFilter;

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   */
  constructor(context: AudioContext) {
    super(context);

    const preEqualizerFilterParams: PreEqualizerFilterParams = {
      highpass: { frequency:   45, detune: 0, Q: 1,   gain: 0 },
      bass    : { frequency:  120, detune: 0, Q: 1,   gain: 0 },
      middle  : { frequency:  500, detune: 0, Q: 1.2, gain: 0 },
      treble  : { frequency: 1500, detune: 0, Q: 1,   gain: 0 },
    };

    const postParams: PostParams = {
      lowpass: { frequency: 3500, detune: 0, Q:            5, gain: 0 },
      notch  : { frequency: 7500, detune: 0, Q:            1, gain: 0 },
      peaking: { frequency:  110, detune: 0, Q:            3, gain: 0 },
      tilt   : { frequency: 3000, detune: 0, Q: Math.SQRT1_2, gain: 0 },
      speaker: 10
    };

    this.preEQ      = new PreEqualizer(context, preEqualizerFilterParams);
    this.postFilter = new PostFilter(context, postParams);

    // `Preamp` is not connected by default
    this.deactivate();
  }

  /** @override */
  public override connect(): GainNode {
    // Clear connection
    this.input.disconnect(0);

    if (this.isActive) {
      // Effect ON

      // GainNode (Input) -> Pre-Equalizer -> Post-Filter (-> Cabinet) -> GainNode (Output)
      this.input.connect(this.preEQ.INPUT);
      this.preEQ.OUTPUT.connect(this.postFilter.INPUT);
      this.postFilter.OUTPUT.connect(this.output);
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
   * @param {keyof BassmanParams|BassmanParams} params This argument is string if getter. Otherwise, setter.
   * @return {BassmanParams[keyof BassmanParams]|TwinReverb} Return value is parameter for preamp effector if getter.
   *     Otherwise, return value is for method chain.
   */
  public param(params: 'state'): boolean;
  public param(params: 'pre'): BassmanParams['pre']
  public param(params: 'post'): BassmanParams['post']
  public param(params: BassmanParams): Bassman;
  public param(params: keyof BassmanParams | BassmanParams): BassmanParams[keyof BassmanParams] | Bassman {
    if (typeof params === 'string') {
      switch (params) {
        case 'state': {
          return this.isActive;
        }

        case 'pre': {
          return this.preEQ.params();
        }

        case 'post': {
          return this.postFilter.params();
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
              this.postFilter.activate();
            } else {
              this.deactivate();
              this.preEQ.deactivate();
              this.postFilter.deactivate();
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
            this.postFilter.param(value);
          }

          break;
        }
      }
    }

    return this;
  }

  /** @override */
  public override params(): Required<BassmanParams> {
    return {
      state: this.isActive,
      pre  : this.preEQ.params(),
      post : this.postFilter.params()
    };
  }
}
