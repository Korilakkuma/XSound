import type { PreEqualizerParams, PostEqualizerParams } from './VOX';

import { Effector } from '../../Effector';
import { AmpSimulator } from '../../AmpSimulator';

import { PreEqualizer, PostEqualizer } from './VOX';

export type AC30Params = {
  state?: boolean,
  level?: number,
  samples?: number,
  pre?: PreEqualizerParams,
  post?: PostEqualizerParams
};

/**
 * Effector's subclass for Preamplifier (VOX AC30).
 */
export class AC30 extends Effector {
  private preEQ: PreEqualizer;
  private postEQ: PostEqualizer;

  // for creating curve
  private level           = 1;
  private numberOfSamples = 1024;

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   */
  constructor(context: AudioContext) {
    super(context);

    this.preEQ  = new PreEqualizer(context);
    this.postEQ = new PostEqualizer(context);

    // `Preamp` is not connected by default
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
   * @param {keyof AC30Params|AC30Params} params This argument is string if getter. Otherwise, setter.
   * @return {AC30Params[keyof AC30Params]|AC30} Return value is parameter for preamp effector if getter.
   *     Otherwise, return value is for method chain.
   */
  public param(params: 'state'): boolean;
  public param(params: 'level'): number;
  public param(params: 'samples'): number;
  public param(params: 'pre'): AC30Params['pre'];
  public param(params: 'post'): AC30Params['post'];
  public param(params: AC30Params): AC30;
  public param(params: keyof AC30Params | AC30Params): AC30Params[keyof AC30Params] | AC30 {
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
  public override params(): Required<AC30Params> {
    return {
      state  : this.isActive,
      level  : this.level,
      samples: this.numberOfSamples,
      pre    : this.preEQ.params(),
      post   : this.postEQ.params()
    };
  }
}
