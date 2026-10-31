import { Effector } from '../Effector';

export type GSP2101Params = {
  state?: boolean;
  air?: number;
  tone?: number;
  level?: number;
};

/**
 * Effector's subclass for Preamplifier (DigiTech GSP2101 Clean).
 */
export class GSP2101 extends Effector {
  private level: GainNode;

  private lowCut: BiquadFilterNode;
  private highCut: BiquadFilterNode;
  private presence: BiquadFilterNode;

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   */
  constructor(context: AudioContext) {
    super(context);

    this.level = this.context.createGain();

    this.lowCut   = this.context.createBiquadFilter();
    this.highCut  = this.context.createBiquadFilter();
    this.presence = this.context.createBiquadFilter();

    // Initialize parameters
    this.level.gain.value = 1;

    this.lowCut.type   = 'highpass';
    this.highCut.type  = 'lowpass';
    this.presence.type = 'peaking';

    this.lowCut.frequency.value   = 60;
    this.highCut.frequency.value  = 9000;
    this.presence.frequency.value = 7000;

    this.lowCut.Q.value   = Math.SQRT1_2;
    this.highCut.Q.value  = Math.SQRT1_2;
    this.presence.Q.value = 1.2;

    this.lowCut.gain.value   = 0;  // Not used
    this.highCut.gain.value  = 0;  // Not used
    this.presence.gain.value = 4;

    // `Preamp` is not connected by default
    this.deactivate();
  }

  /** @override */
  public override connect(): GainNode {
    this.input.disconnect(0);
    this.lowCut.disconnect(0);
    this.highCut.disconnect(0);
    this.presence.disconnect(0);
    this.level.disconnect(0);

    if (this.isActive) {
      // Effect ON

      // GainNode (Input) -> BiquadFilterNode (Low Cut) -> BiquadFilterNode (Air Boost) -> BiquadFilterNode (High Cut) -> GainNode (Level) -> GainNode (Output);
      this.input.connect(this.lowCut);
      this.lowCut.connect(this.presence);
      this.presence.connect(this.highCut);
      this.highCut.connect(this.level);
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
   * @param {keyof GSP2101Params|GSP2101Params} params This argument is string if getter. Otherwise, setter.
   * @return {GSP2101Params[keyof GSP2101Params]|GSP2101} Return value is parameter for preamp effector if getter.
   *     Otherwise, return value is for method chain.
   */
  public param(params: 'state'): boolean;
  public param(params: 'air'): number;
  public param(params: 'tone'): number;
  public param(params: 'level'): number;
  public param(params: GSP2101Params): GSP2101;
  public param(params: keyof GSP2101Params | GSP2101Params): GSP2101Params[keyof GSP2101Params] | GSP2101 {
    if (typeof params === 'string') {
      switch (params) {
        case 'state': {
          return this.isActive;
        }

        case 'air': {
          return this.presence.gain.value;
        }

        case 'tone': {
          return this.highCut.frequency.value;
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

        case 'air': {
          if (typeof value === 'number') {
            this.presence.gain.value = value;
          }

          break;
        }

        case 'tone': {
          if (typeof value === 'number') {
            this.highCut.frequency.value = value;
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
  public override params(): Required<GSP2101Params> {
    return {
      state: this.isActive,
      air  : this.presence.gain.value,
      tone : this.highCut.frequency.value,
      level: this.level.gain.value
    };
  }
}
