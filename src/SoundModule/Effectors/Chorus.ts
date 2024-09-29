import { Effector } from './Effector';

export type ChorusParams = {
  state?: boolean,
  time?: number,
  depth?: number,
  rate?: number,
  mix?: number,
  dry?: number,
  wet?: number,
  tone?: number,
  feedback?: number
};

/**
 * Effector's subclass for Chorus.
 */
export class Chorus extends Effector {
  private delay: DelayNode;
  private tone: BiquadFilterNode;
  private dry: GainNode;
  private wet: GainNode;
  private feedback: GainNode;
  private depthRate = 0;

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   */
  constructor(context: AudioContext) {
    super(context);

    this.delay    = context.createDelay();
    this.dry      = context.createGain();
    this.wet      = context.createGain();
    this.tone     = context.createBiquadFilter();
    this.feedback = context.createGain();

    // Initialize parameters
    this.delay.delayTime.value = 0;
    this.depth.gain.value      = 0;
    this.rate.value            = 0;
    this.dry.gain.value        = 1;
    this.wet.gain.value        = 0;
    this.tone.type             = 'lowpass';
    this.tone.frequency.value  = 350;
    this.tone.Q.value          = Math.SQRT1_2;
    this.tone.gain.value       = 0;  // Not used
    this.feedback.gain.value   = 0;
    this.depthRate             = 0;

    // `Chorus` is not connected by default
    this.deactivate();

    // LFO
    // OscillatorNode (LFO) -> GainNode (Depth) -> AudioParam (delayTime)
    this.lfo.connect(this.depth);
    this.depth.connect(this.delay.delayTime);
  }

  /** @override */
  public override stop(stopTime?: number, releaseTime?: number): void {
    super.stop(stopTime, releaseTime);

    if (this.isActive) {
      // Connect `AudioNode's again
      this.lfo.connect(this.depth);
      this.depth.connect(this.delay.delayTime);
    }
  }

  /** @override */
  public override connect(): GainNode {
    // Clear connection
    this.input.disconnect(0);
    this.delay.disconnect(0);
    this.dry.disconnect(0);
    this.wet.disconnect(0);
    this.tone.disconnect(0);
    this.feedback.disconnect(0);

    // GainNode (Input) -> GainNode (Dry) -> GainNode (Output)
    this.input.connect(this.dry);
    this.dry.connect(this.output);

    // Effect ON
    if (this.isActive) {
      // GainNode (Input) -> BiquadFilterNode (Tone) -> DelayNode (Delay) -> GainNode (Wet) -> GainNode (Output)
      this.input.connect(this.tone);
      this.tone.connect(this.delay);
      this.delay.connect(this.wet);
      this.wet.connect(this.output);

      // Feedback
      // GainNode (Input) -> DelayNode -> GainNode (Feedback) -> DelayNode ...
      this.delay.connect(this.feedback);
      this.feedback.connect(this.delay);
    }

    return this.output;
  }

  /**
   * This method gets or sets parameters for chorus effector.
   * This method is overloaded for type interface and type check.
   * @param {keyof ChorusParams|ChorusParams} params This argument is string if getter. Otherwise, setter.
   * @return {ChorusParams[keyof ChorusParams]|Chorus} Return value is parameter for chorus effector if getter.
   *     Otherwise, return value is for method chain.
   */
  public param(params: 'state'): boolean;
  public param(params: 'time'): number;
  public param(params: 'depth'): number;
  public param(params: 'rate'): number;
  public param(params: 'mix'): number;
  public param(params: 'dry'): number;
  public param(params: 'wet'): number;
  public param(params: 'tone'): number;
  public param(params: 'feedback'): number;
  public param(params: ChorusParams): Chorus;
  public param(params: keyof ChorusParams | ChorusParams): ChorusParams[keyof ChorusParams] | Chorus {
    if (typeof params === 'string') {
      switch (params) {
        case 'state': {
          return this.isActive;
        }

        case 'time': {
          return this.delay.delayTime.value;
        }

        case 'depth': {
          return this.depthRate;
        }

        case 'rate': {
          return this.rate.value;
        }

        case 'mix': {
          return this.wet.gain.value;
        }

        case 'dry': {
          return this.dry.gain.value;
        }

        case 'wet': {
          return this.wet.gain.value;
        }

        case 'tone': {
          return this.tone.frequency.value;
        }

        case 'feedback': {
          return this.feedback.gain.value;
        }
      }
    }

    for (const [key, value] of Object.entries(params)) {
      switch (key) {
        case 'state': {
          if (typeof value === 'boolean') {
            this.isActive = value;
          }

          break;
        }

        case 'time': {
          if (typeof value === 'number') {
            this.delay.delayTime.value = value;
            this.depth.gain.value      = this.delay.delayTime.value * this.depthRate;
          }

          break;
        }

        case 'depth': {
          if (typeof value === 'number') {
            this.depthRate        = value;
            this.depth.gain.value = this.delay.delayTime.value * value;
          }

          break;
        }

        case 'rate': {
          if (typeof value === 'number') {
            this.rate.value = value;
          }

          break;
        }

        case 'mix': {
          if (typeof value === 'number') {
            this.wet.gain.value = value;
            this.dry.gain.value = 1 - this.wet.gain.value;
          }

          break;
        }

        case 'dry': {
          if (typeof value === 'number') {
            this.dry.gain.value = value;
          }

          break;
        }

        case 'wet': {
          if (typeof value === 'number') {
            this.wet.gain.value = value;
          }

          break;
        }

        case 'tone': {
          if (typeof value === 'number') {
            this.tone.frequency.value = value;
          }

          break;
        }

        case 'feedback': {
          if (typeof value === 'number') {
            this.feedback.gain.value = value;
          }

          break;
        }
      }
    }

    return this;
  }

  /** @override */
  public override params(): Required<ChorusParams> {
    return {
      state   : this.isActive,
      time    : this.delay.delayTime.value,
      depth   : this.depthRate,
      rate    : this.rate.value,
      mix     : this.wet.gain.value,
      dry     : this.dry.gain.value,
      wet     : this.wet.gain.value,
      tone    : this.tone.frequency.value,
      feedback: this.feedback.gain.value
    };
  }

  /** @override */
  public override activate(): Chorus {
    super.activate();
    return this;
  }

  /** @override */
  public override deactivate(): Chorus {
    super.deactivate();
    return this;
  }
}
