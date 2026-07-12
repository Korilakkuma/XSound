import { StereoEffector } from './StereoEffector';

export type ChorusType = 'standard' | 'stereo';

export type ChorusParams = {
  state?: boolean,
  type?: ChorusType,
  time?: number | [number, number],
  depth?: number | [number, number],
  rate?: number | [number, number],
  mix?: number | [number, number],
  dry?: number,
  wet?: number | [number, number],
  tone?: number | [number, number],
  feedback?: number | [number, number]
};

/**
 * Effector's subclass for Chorus.
 */
export class Chorus extends StereoEffector {
  private type: ChorusType = 'standard';

  private delays: [DelayNode, DelayNode];
  private tones: [BiquadFilterNode, BiquadFilterNode];
  private dry: GainNode;
  private wets: [GainNode, GainNode];
  private feedbacks: [GainNode, GainNode];
  private splitter: ChannelSplitterNode;
  private merger: ChannelMergerNode;
  private depthRates: [number, number] = [0, 0];

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   */
  constructor(context: AudioContext) {
    super(context);

    this.delays    = [context.createDelay(), context.createDelay()];
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
    this.depths[0].gain.value      = 0;
    this.depths[1].gain.value      = 0;
    this.rates[0].value            = 0;
    this.rates[1].value            = 0;

    // `Chorus` is not connected by default
    this.deactivate();

    // LFO

    // Left Channel
    // OscillatorNode (LFO) -> GainNode (Depth) -> AudioParam (delayTime)
    this.lfos[0].connect(this.depths[0]);
    this.depths[0].connect(this.delays[0].delayTime);

    // Right Channel
    // OscillatorNode (LFO) -> GainNode (Depth) -> AudioParam (delayTime)
    this.lfos[0].connect(this.depths[0]);
    this.depths[0].connect(this.delays[1].delayTime);
  }

  /** @override */
  public override stop(stopTime?: number, releaseTime?: number): void {
    super.stop(stopTime, releaseTime);

    if (this.isActive) {
      // Connect `AudioNode's again
      this.lfos[0].connect(this.depths[0]);
      this.depths[0].connect(this.delays[0].delayTime);

      this.lfos[1].connect(this.depths[1]);
      this.depths[1].connect(this.delays[1].delayTime);
    }
  }

  /** @override */
  public override connect(): GainNode {
    // Clear connection
    this.input.disconnect(0);
    this.delays[0].disconnect(0);
    this.delays[1].disconnect(0);
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
          // GainNode (Input) -> DelayNode -> GainNode (Feedback) -> DelayNode ...
          this.delays[0].connect(this.feedbacks[0]);
          this.feedbacks[0].connect(this.delays[0]);

          break;
        }

        case 'stereo': {
          //                                            |-> Left Channel Chorus  (BiquadFilterNode (Tone) -> DelayNode (Delay) -> GainNode (Wet)) ->|
          // GainNode (Input) -> ChannelSplitterNode -> |                                                                                           | -> ChannelMergerNode
          //                                            |-> Right Channel Chorus (BiquadFilterNode (Tone) -> DelayNode (Delay) -> GainNode (Wet)) ->|
          this.input.connect(this.splitter);

          // Left Channel
          // ChannelSplitterNode (Left Channel) -> BiquadFilterNode (Tone) -> DelayNode (Delay) -> GainNode (Wet) -> ChannelMergerNode (Output)
          this.splitter.connect(this.tones[0], 0, 0);
          this.tones[0].connect(this.delays[0]);
          this.delays[0].connect(this.wets[0]);
          this.wets[0].connect(this.merger, 0, 0);

          // Feedback
          // GainNode (Input) -> DelayNode -> GainNode (Feedback) -> DelayNode ...
          this.delays[0].connect(this.feedbacks[0]);
          this.feedbacks[0].connect(this.delays[0]);

          // Right Channel
          // ChannelSplitterNode (Right Channel) -> BiquadFilterNode (Tone) -> DelayNode (Delay) -> GainNode (Wet) -> ChannelMergerNode (Output)
          this.splitter.connect(this.tones[1], 1, 0);
          this.tones[1].connect(this.delays[1]);
          this.delays[1].connect(this.wets[1]);
          this.wets[1].connect(this.merger, 0, 1);

          // Feedback
          // GainNode (Input) -> DelayNode -> GainNode (Feedback) -> DelayNode ...
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
   * This method gets or sets parameters for chorus effector.
   * This method is overloaded for type interface and type check.
   * @param {keyof ChorusParams|ChorusParams} params This argument is string if getter. Otherwise, setter.
   * @return {ChorusParams[keyof ChorusParams]|Chorus} Return value is parameter for chorus effector if getter.
   *     Otherwise, return value is for method chain.
   */
  public param(params: 'state'): boolean;
  public param(params: 'type'): ChorusType;
  public param(params: 'time'): number | [number, number];
  public param(params: 'depth'): number | [number, number];
  public param(params: 'rate'): number | [number, number];
  public param(params: 'mix'): number | [number, number];
  public param(params: 'dry'): number;
  public param(params: 'wet'): number | [number, number];
  public param(params: 'tone'): number | [number, number];
  public param(params: 'feedback'): number | [number, number];
  public param(params: ChorusParams): Chorus;
  public param(params: keyof ChorusParams | ChorusParams): ChorusParams[keyof ChorusParams] | Chorus {
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

            case 'stereo': {
              return [this.delays[0].delayTime.value, this.delays[1].delayTime.value];
            }
          }

          break;
        }

        case 'depth': {
          switch (this.type) {
            case 'standard': {
              return this.depthRates[0];
            }

            case 'stereo': {
              return [this.depthRates[0], this.depthRates[1]];
            }
          }

          break;
        }

        case 'rate': {
          switch (this.type) {
            case 'standard': {
              return this.rates[0].value;
            }

            case 'stereo': {
              return [this.rates[0].value, this.rates[1].value];
            }
          }

          break;
        }

        case 'mix': {
          switch (this.type) {
            case 'standard': {
              return this.wets[0].gain.value;
            }

            case 'stereo': {
              return [this.wets[0].gain.value, this.wets[1].gain.value];
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

            case 'stereo': {
              return [this.feedbacks[0].gain.value, this.feedbacks[1].gain.value];
            }
          }
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
            if ((value === 'standard') || (value === 'stereo')) {
              this.type = value;

              this.connect();
            }
          }

          break;
        }

        case 'time': {
          if (typeof value === 'number') {
            this.delays[0].delayTime.value = value;
            this.depths[0].gain.value      = this.delays[0].delayTime.value * this.depthRates[0];
          } else if (Array.isArray(value) && (value.length === 2)) {
            this.delays[0].delayTime.value = value[0];
            this.delays[1].delayTime.value = value[1];

            this.depths[0].gain.value = this.delays[0].delayTime.value * this.depthRates[0];
            this.depths[1].gain.value = this.delays[1].delayTime.value * this.depthRates[1];
          }

          break;
        }

        case 'depth': {
          if (typeof value === 'number') {
            this.depthRates[0]        = value;
            this.depths[0].gain.value = this.delays[0].delayTime.value * value;
          } else if (Array.isArray(value) && (value.length === 2)) {
            this.depthRates[0] = value[0];
            this.depthRates[1] = value[1];

            this.depths[0].gain.value = this.delays[0].delayTime.value * value[0];
            this.depths[1].gain.value = this.delays[1].delayTime.value * value[1];
          }

          break;
        }

        case 'rate': {
          if (typeof value === 'number') {
            this.rates[0].value = value;
          } else if (Array.isArray(value) && (value.length === 2)) {
            this.rates[0].value = value[0];
            this.rates[1].value = value[1];
          }

          break;
        }

        case 'mix': {
          if (typeof value === 'number') {
            this.wets[0].gain.value = value;
            this.dry.gain.value = 1 - this.wets[0].gain.value;
          } else if (Array.isArray(value) && (value.length === 2)) {
            this.wets[0].gain.value = value[0];
            this.wets[1].gain.value = value[1];

            this.dry.gain.value = 1 - this.wets[0].gain.value;
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
  public override params(): Required<ChorusParams> {
    switch (this.type) {
      case 'standard': {
        return {
          state   : this.isActive,
          type    : this.type,
          time    : this.delays[0].delayTime.value,
          depth   : this.depthRates[0],
          rate    : this.rates[0].value,
          mix     : this.wets[0].gain.value,
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
          depth   : [this.depthRates[0], this.depthRates[1]],
          rate    : [this.rates[0].value, this.rates[1].value],
          mix     : [this.wets[0].gain.value, this.wets[1].gain.value],
          dry     : this.dry.gain.value,
          wet     : [this.wets[0].gain.value, this.wets[1].gain.value],
          tone    : [this.tones[0].frequency.value, this.tones[1].frequency.value],
          feedback: [this.feedbacks[0].gain.value, this.feedbacks[1].gain.value]
        };
      }
    }
  }
}
