import { Effector } from './Effector';

export type DelayType = 'standard' | 'pingpong';

export type DelayParams = {
  state?: boolean,
  type?: DelayType,
  time?: number,
  dry?: number,
  wet?: number,
  tone?: number,
  feedback?: number
};

/**
 * Effector's subclass for Delay.
 */
export class Delay extends Effector {
  public static MAX_DELAY_TIME = 5;  // Max delay time is 5000 [ms]

  private type: DelayType = 'standard';

  private delay: DelayNode;
  private postDelay: DelayNode;
  private dry: GainNode;
  private wet: GainNode;
  private tone: BiquadFilterNode;
  private feedback: GainNode;
  private splitter: ChannelSplitterNode;
  private merger: ChannelMergerNode;

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   */
  constructor(context: AudioContext) {
    super(context);

    this.delay     = context.createDelay(Delay.MAX_DELAY_TIME);
    this.postDelay = context.createDelay(Delay.MAX_DELAY_TIME);
    this.dry       = context.createGain();
    this.wet       = context.createGain();
    this.tone      = context.createBiquadFilter();
    this.feedback  = context.createGain();
    this.splitter  = context.createChannelSplitter(2);
    this.merger    = context.createChannelMerger(2);

    // Initialize parameters
    this.delay.delayTime.value     = 0;
    this.postDelay.delayTime.value = 0;
    this.dry.gain.value            = 1;
    this.wet.gain.value            = 0;
    this.tone.type                 = 'lowpass';
    this.tone.frequency.value      = 350;
    this.tone.Q.value              = Math.SQRT1_2;
    this.tone.gain.value           = 0;  // Not used
    this.feedback.gain.value       = 0;

    // `Delay` is not connected by default
    this.deactivate();
  }

  /** @override */
  public override connect(): GainNode {
    // Clear connection
    this.input.disconnect(0);
    this.delay.disconnect(0);
    this.postDelay.disconnect(0);
    this.dry.disconnect(0);
    this.wet.disconnect(0);
    this.tone.disconnect(0);
    this.feedback.disconnect(0);
    this.splitter.disconnect(0);
    this.merger.disconnect(0);

    if (this.isActive) {
      // Effect ON

      // GainNode (Input) -> GainNode (Dry) -> GainNode (Output)
      this.input.connect(this.dry);
      this.dry.connect(this.output);

      switch (this.type) {
        case 'standard': {
          // GainNode (Input) -> BiquadFilterNode (Tone) -> DelayNode (Delay) -> GainNode (Wet) -> GainNode (Output)
          this.input.connect(this.tone);
          this.tone.connect(this.delay);
          this.delay.connect(this.wet);
          this.wet.connect(this.output);

          // Feedback
          // GainNode (Input) -> DelayNode -> GainNode (Feedback) -> DelayNode ...
          this.delay.connect(this.feedback);
          this.feedback.connect(this.delay);

          break;
        }

        case 'pingpong': {
          //                                                                       |-> DelayNode (Pre Delay) --------------------------->|
          // GainNode (Input) -> BiquadFilterNode (Tone) -> ChannelSplitterNode -> |                                                     | -> ChannelMergerNode
          //                                                                       |-> DelayNode (Pre Delay) -> DelayNode (Post Delay) ->|
          this.input.connect(this.tone);
          this.tone.connect(this.splitter);

          // Left Channel
          // ChannelMergerNode -> DelayNode (Pre Delay) -> ChannelMergerNode
          this.splitter.connect(this.delay, 0, 0);
          this.delay.connect(this.merger, 0, 0);

          // Right Channel
          // ChannelMergerNode -> DelayNode (Pre Delay) -> DelayNode (Post DelayNode) -> ChannelMergerNode
          this.splitter.connect(this.delay, 1, 0);
          this.delay.connect(this.postDelay);
          this.postDelay.connect(this.merger, 0, 1);

          // ChannelMergerNode -> GainNode (Wet) -> GainNode (Output)
          this.merger.connect(this.wet);
          this.wet.connect(this.output);

          // Feedback
          // (DelayNode (Pre Delay) ->) DelayNode (Post Delay) -> GainNode (Feedback) -> DelayNode (Pre Delay) -> DelayNode (Post Delay) -> GainNode (Feedback) ->  ...
          this.postDelay.connect(this.feedback);
          this.feedback.connect(this.delay);

          break;
        }
      }
    } else {
      // Effect OFF

      // GainNode (Input) -> GainNode (Output)
      this.input.connect(this.output);
    }

    return this.output;
  }

  /**
   * This method gets or sets parameters for delay effector.
   * This method is overloaded for type interface and type check.
   * @param {keyof DelayParams|DelayParams} params This argument is string if getter. Otherwise, setter.
   * @return {DelayParams[keyof DelayParams]|Delay} Return value is parameter for delay effector if getter.
   *     Otherwise, return value is for method chain.
   */
  public param(params: 'state'): boolean;
  public param(params: 'type'): DelayType;
  public param(params: 'time'): number;
  public param(params: 'dry'): number;
  public param(params: 'wet'): number;
  public param(params: 'tone'): number;
  public param(params: 'feedback'): number;
  public param(params: DelayParams): Delay;
  public param(params: keyof DelayParams | DelayParams): DelayParams[keyof DelayParams] | Delay {
    if (typeof params === 'string') {
      switch (params) {
        case 'state': {
          return this.isActive;
        }

        case 'type': {
          return this.type;
        }

        case 'time': {
          return this.delay.delayTime.value;
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

        case 'type': {
          if (typeof value === 'string') {
            if ((value === 'standard') || (value === 'pingpong')) {
              this.type = value;

              this.connect();
            }
          }

          break;
        }

        case 'time': {
          if (typeof value === 'number') {
            this.delay.delayTime.value     = value;
            this.postDelay.delayTime.value = value;
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
  public override params(): Required<DelayParams> {
    return {
      state   : this.isActive,
      type    : this.type,
      time    : this.delay.delayTime.value,
      dry     : this.dry.gain.value,
      wet     : this.wet.gain.value,
      tone    : this.tone.frequency.value,
      feedback: this.feedback.gain.value
    };
  }
}
