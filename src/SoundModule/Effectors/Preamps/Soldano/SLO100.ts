import type { PreEqualizerParams, PostEqualizerParams, PreEqualizerFilterParams, PostEqualizerFilterParams } from '../Marshall/Marshall';

import { Effector } from '../../Effector';
import { AmpSimulator } from '../../AmpSimulator';

import { PreEqualizer, PostEqualizer } from '../Marshall/Marshall';

export type SLO100Params = {
  state?: boolean,
  level?: number,
  samples?: number,
  pre?: PreEqualizerParams,
  post?: PostEqualizerParams
};

/**
 * Effector's subclass for Preamplifier (Soldano SLO-100).
 */
export class SLO100 extends Effector {
  private preEQ: PreEqualizer;
  private postEQ: PostEqualizer;

  // for creating curve
  private level           = 0;
  private numberOfSamples = 1024;

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   */
  constructor(context: AudioContext) {
    super(context);

    const preEqualizerFilterParams: PreEqualizerFilterParams = {
      lowpass   : { frequency: 4200, detune: 0, Q: -3, gain: 0 },
      highpasses: [
        { frequency:  85, detune: 0, Q: -3, gain: 0 },
        { frequency: 650, detune: 0, Q: -3, gain: 0 },
        { frequency:  85, detune: 0, Q: -3, gain: 0 }
      ]
    };

    const postEqualizerFilterParams: PostEqualizerFilterParams = {
      bass    : { frequency:  180, detune: 0, Q:  0,   gain: 0 },
      middle  : { frequency:  700, detune: 0, Q:  1.4, gain: 0 },
      treble  : { frequency: 2200, detune: 0, Q:  0,   gain: 0 },
      lowpass : { frequency: 5000, detune: 0, Q: -3,   gain: 0 },
      highpass: { frequency:   45, detune: 0, Q: -3,   gain: 0 }
    };

    this.preEQ  = new PreEqualizer(context, preEqualizerFilterParams);
    this.postEQ = new PostEqualizer(context, postEqualizerFilterParams);

    this.deactivate();
  }

  /** @override */
  public override connect(): GainNode {
    // Clear connection
    this.input.disconnect(0);

    if (this.isActive) {
      // Effect ON

      // GainNode (Input) -> Pre-Equalizer -> Post-Equalizer -> GainNode (Output)
      this.input.connect(this.preEQ.INPUT);
      this.preEQ.OUTPUT.connect(this.postEQ.INPUT);
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
   * @param {keyof SLO100Params|SLO100Params} params This argument is string if getter. Otherwise, setter.
   * @return {SLO100Params[keyof SLO100Params]|SLO100} Return value is parameter for preamp effector if getter.
   *     Otherwise, return value is for method chain.
   */
  public param(params: 'state'): boolean;
  public param(params: 'level'): number;
  public param(params: 'samples'): number;
  public param(params: 'pre'): SLO100Params['pre'];
  public param(params: 'post'): SLO100Params['post'];
  public param(params: SLO100Params): SLO100;
  public param(params: keyof SLO100Params | SLO100Params): SLO100Params[keyof SLO100Params] | SLO100 {
    if (typeof params === 'string') {
      switch (params) {
        case 'state': {
          return this.isActive;
        }

        case 'level': {
          return this.level;
        }

        case 'samples': {
          return this.numberOfSamples;
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

        case 'level': {
          if (typeof value === 'number') {
            this.level = value;

            const curve = AmpSimulator.createCurve(this.level, this.numberOfSamples);

            this.preEQ.param({ curve });
            this.postEQ.param({ curve });
          }

          break;
        }

        case 'samples': {
          if (typeof value === 'number') {
            this.numberOfSamples = value;

            const curve = AmpSimulator.createCurve(this.level, this.numberOfSamples);

            this.preEQ.param({ curve });
            this.postEQ.param({ curve });
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
  public override params(): Required<SLO100Params> {
    return {
      state  : this.isActive,
      level  : this.level,
      samples: this.numberOfSamples,
      pre    : this.preEQ.params(),
      post   : this.postEQ.params()
    };
  }
}
