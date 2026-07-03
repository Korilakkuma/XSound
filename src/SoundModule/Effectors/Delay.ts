import { Effector } from './Effector';

export type DelayType = 'standard' | 'pingpong' | 'stereo';

export type DelayParams = {
  state?: boolean,
  type?: DelayType,
  time?: number | [number, number],
  dry?: number,
  wet?: number | [number, number],
  tone?: number | [number, number],
  feedback?: number | [number, number]
};

/**
 * Effector's subclass for Delay.
 */
export class Delay extends Effector {
  public static MAX_DELAY_TIME = 5;  // Max delay time is 5000 [ms]

  private type: DelayType = 'standard';

  private delays: [DelayNode, DelayNode];
  private dry: GainNode;
  private wets: [GainNode, GainNode];
  private tones: [BiquadFilterNode, BiquadFilterNode];
  private feedbacks: [GainNode, GainNode];
  private splitter: ChannelSplitterNode;
  private merger: ChannelMergerNode;

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   */
  constructor(context: AudioContext) {
    super(context);

    this.delays    = [context.createDelay(Delay.MAX_DELAY_TIME), context.createDelay(Delay.MAX_DELAY_TIME)];
    this.dry       = context.createGain();
    this.wets      = [context.createGain(), context.createGain()];
    this.tones     = [context.createBiquadFilter(), context.createBiquadFilter()];
    this.feedbacks = [context.createGain(), context.createGain()];
    this.splitter  = context.createChannelSplitter(2);
    this.merger    = context.createChannelMerger(2);

    // Initialize parameters
    this.delays[0].delayTime.value = 0;
    this.delays[1].delayTime.value = 0;
    this.dry.gain.value            = 1;
    this.wets[0].gain.value        = 0;
    this.wets[1].gain.value        = 0;
    this.tones[0].type             = 'lowpass';
    this.tones[0].frequency.value  = 350;
    this.tones[0].Q.value          = Math.SQRT1_2;
    this.tones[0].gain.value       = 0;  // Not used
    this.tones[1].type             = 'lowpass';
    this.tones[1].frequency.value  = 350;
    this.tones[1].Q.value          = Math.SQRT1_2;
    this.tones[1].gain.value       = 0;  // Not used
    this.feedbacks[0].gain.value   = 0;
    this.feedbacks[0].gain.value   = 0;
    this.feedbacks[1].gain.value   = 0;
    this.feedbacks[1].gain.value   = 0;

    // `Delay` is not connected by default
    this.deactivate();
  }

  /** @override */
  public override connect(): GainNode {
    // Clear connection
    this.input.disconnect(0);
    this.delays[0].disconnect(0);
    // this.delays[0].disconnect(1);
    this.delays[1].disconnect(0);
    // this.delays[1].disconnect(1);
    this.dry.disconnect(0);
    this.wets[0].disconnect(0);
    // this.wets[0].disconnect(1);
    this.wets[1].disconnect(0);
    // this.wets[1].disconnect(1);
    this.tones[0].disconnect(0);
    this.tones[1].disconnect(0);
    this.feedbacks[0].disconnect(0);
    this.feedbacks[1].disconnect(0);
    this.splitter.disconnect(0);
    this.splitter.disconnect(1);
    this.merger.disconnect(0);

    if (this.isActive) {
      // Effect ON

      // GainNode (Input) -> GainNode (Dry) -> GainNode (Output)
      this.input.connect(this.dry);
      this.dry.connect(this.output);

      switch (this.type) {
        case 'standard': {
          // GainNode (Input) -> BiquadFilterNode (Tone) -> DelayNode (Delay) -> GainNode (Wet) -> GainNode (Output)
          this.input.connect(this.tones[0]);
          this.tones[0].connect(this.delays[0]);
          this.delays[0].connect(this.wets[0]);
          this.wets[0].connect(this.output);

          // Feedback
          // DelayNode -> GainNode (Feedback) -> DelayNode -> GainNode (Feedback) -> ...
          this.delays[0].connect(this.feedbacks[0]);
          this.feedbacks[0].connect(this.delays[0]);

          break;
        }

        case 'pingpong': {
          //                                                                       |-> DelayNode (Pre Delay) --------------------------->|
          // GainNode (Input) -> BiquadFilterNode (Tone) -> ChannelSplitterNode -> |                                                     | -> ChannelMergerNode
          //                                                                       |-> DelayNode (Pre Delay) -> DelayNode (Post Delay) ->|
          this.input.connect(this.tones[0]);
          this.tones[0].connect(this.splitter);

          // Left Channel
          // ChannelMergerNode -> DelayNode (Pre Delay) -> ChannelMergerNode
          this.splitter.connect(this.delays[0], 0, 0);
          this.delays[0].connect(this.merger, 0, 0);

          // Right Channel
          // ChannelMergerNode -> DelayNode (Pre Delay) -> DelayNode (Post DelayNode) -> ChannelMergerNode
          this.splitter.connect(this.delays[0], 1, 0);
          this.delays[0].connect(this.delays[1]);
          this.delays[1].connect(this.merger, 0, 1);

          // ChannelMergerNode -> GainNode (Wet) -> GainNode (Output)
          this.merger.connect(this.wets[0]);
          this.wets[0].connect(this.output);

          // Feedback
          // (DelayNode (Pre Delay) ->) DelayNode (Post Delay) -> GainNode (Feedback) -> DelayNode (Pre Delay) -> DelayNode (Post Delay) -> GainNode (Feedback) -> ...
          this.delays[1].connect(this.feedbacks[0]);
          this.feedbacks[0].connect(this.delays[0]);

          break;
        }

        case 'stereo': {
          //                                            |-> Left Channel Delay  (BiquadFilterNode (Tone) -> DelayNode (Delay) -> GainNode (Wet)) ->|
          // GainNode (Input) -> ChannelSplitterNode -> |                                                                                          | -> ChannelMergerNode
          //                                            |-> Right Channel Delay (BiquadFilterNode (Tone) -> DelayNode (Delay) -> GainNode (Wet)) ->|
          this.input.connect(this.splitter);

          // Left Channel
          // ChannelSplitterNode (Left Channel) -> BiquadFilterNode (Tone) -> DelayNode (Delay) -> GainNode (Wet) -> GainNode (Output)
          this.splitter.connect(this.tones[0], 0, 0);
          this.tones[0].connect(this.delays[0]);
          this.delays[0].connect(this.wets[0]);
          this.wets[0].connect(this.merger, 0, 0);

          // Feedback
          // DelayNode -> GainNode (Feedback) -> DelayNode -> GainNode (Feedback) -> ...
          this.delays[0].connect(this.feedbacks[0]);
          this.feedbacks[0].connect(this.delays[0]);

          // Right Channel
          // ChannelSplitterNode (Right Channel) -> BiquadFilterNode (Tone) -> DelayNode (Delay) -> GainNode (Wet) -> GainNode (Output)
          this.splitter.connect(this.tones[1], 1, 0);
          this.tones[1].connect(this.delays[1]);
          this.delays[1].connect(this.wets[1]);
          this.wets[1].connect(this.merger, 0, 1);

          // Feedback
          // DelayNode -> GainNode (Feedback) -> DelayNode -> GainNode (Feedback) -> ...
          this.delays[1].connect(this.feedbacks[1]);
          this.feedbacks[1].connect(this.delays[1]);

          // ChannelMergerNode -> GainNode (Output)
          this.merger.connect(this.output);

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
  public param(params: 'time'): number | [number, number];
  public param(params: 'dry'): number;
  public param(params: 'wet'): number | [number, number];
  public param(params: 'tone'): number | [number, number];
  public param(params: 'feedback'): number | [number, number];
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
          switch (this.type) {
            case 'standard': {
              return this.delays[0].delayTime.value;
            }

            case 'pingpong': {
              return this.delays[0].delayTime.value;
            }

            case 'stereo': {
              return [this.delays[0].delayTime.value, this.delays[1].delayTime.value];
            }
          }

          break;
        }

        case 'dry': {
          return this.dry.gain.value;
        }

        case 'wet': {
          switch (this.type) {
            case 'standard': {
              return this.wets[0].gain.value;
            }

            case 'pingpong': {
              return this.wets[0].gain.value;
            }

            case 'stereo': {
              return [this.wets[0].gain.value, this.wets[1].gain.value];
            }
          }

          break;
        }

        case 'tone': {
          switch (this.type) {
            case 'standard': {
              return this.tones[0].frequency.value;
            }

            case 'pingpong': {
              return this.tones[0].frequency.value;
            }

            case 'stereo': {
              return [this.tones[0].frequency.value, this.tones[1].frequency.value];
            }
          }

          break;
        }

        case 'feedback': {
          switch (this.type) {
            case 'standard': {
              return this.feedbacks[0].gain.value;
            }

            case 'pingpong': {
              return this.feedbacks[0].gain.value;
            }

            case 'stereo': {
              return [this.feedbacks[0].gain.value, this.feedbacks[1].gain.value];
            }
          }

          break;
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
            if ((value === 'standard') || (value === 'pingpong') || (value === 'stereo')) {
              this.type = value;

              this.connect();
            }
          }

          break;
        }

        case 'time': {
          if (typeof value === 'number') {
            this.delays[0].delayTime.value = value;
            this.delays[1].delayTime.value = value;
          } else if (Array.isArray(value) && (value.length === 2)) {
            this.delays[0].delayTime.value = value[0];
            this.delays[1].delayTime.value = value[1];
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
            this.wets[0].gain.value = value;
          } else if (Array.isArray(value) && (value.length === 2)) {
            this.wets[0].gain.value = value[0];
            this.wets[1].gain.value = value[1];
          }

          break;
        }

        case 'tone': {
          if (typeof value === 'number') {
            this.tones[0].frequency.value = value;
          } else if (Array.isArray(value) && (value.length === 2)) {
            this.tones[0].frequency.value = value[0];
            this.tones[1].frequency.value = value[1];
          }

          break;
        }

        case 'feedback': {
          if (typeof value === 'number') {
            this.feedbacks[0].gain.value = value;
          } else if (Array.isArray(value) && (value.length === 2)) {
            this.feedbacks[0].gain.value = value[0];
            this.feedbacks[1].gain.value = value[1];
          }

          break;
        }
      }
    }

    return this;
  }

  /** @override */
  public override params(): Required<DelayParams> {
    switch (this.type) {
      case 'standard': {
        return {
          state   : this.isActive,
          type    : this.type,
          time    : this.delays[0].delayTime.value,
          dry     : this.dry.gain.value,
          wet     : this.wets[0].gain.value,
          tone    : this.tones[0].frequency.value,
          feedback: this.feedbacks[0].gain.value
        };
      }

      case 'pingpong': {
        return {
          state   : this.isActive,
          type    : this.type,
          time    : this.delays[0].delayTime.value,
          dry     : this.dry.gain.value,
          wet     : this.wets[0].gain.value,
          tone    : this.tones[0].frequency.value,
          feedback: this.feedbacks[0].gain.value
        };
      }

      case 'stereo': {
        return {
          state   : this.isActive,
          type    : this.type,
          time    : [this.delays[0].delayTime.value, this.delays[1].delayTime.value],
          dry     : this.dry.gain.value,
          wet     : [this.wets[0].gain.value, this.wets[1].gain.value],
          tone    : [this.tones[0].frequency.value, this.tones[1].frequency.value],
          feedback: [this.feedbacks[0].gain.value, this.feedbacks[1].gain.value]
        };
      }
    }
  }
}
