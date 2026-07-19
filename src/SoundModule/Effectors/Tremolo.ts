import { StereoEffector } from './StereoEffector';

export type TremoloType = 'standard' | 'stereo';

export type TremoloParams = {
  state?: boolean,
  type?: TremoloType,
  waveType?: OscillatorType | [OscillatorType, OscillatorType],
  depth?: number | [number, number],
  rate?: number | [number, number]
};

/**
 * Effector's subclass for Tremolo.
 */
export class Tremolo extends StereoEffector {
  private type: TremoloType = 'standard';

  private amplitudes: [GainNode, GainNode];
  private splitter: ChannelSplitterNode;
  private merger: ChannelMergerNode;

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   */
  constructor(context: AudioContext) {
    super(context);

    this.amplitudes = [context.createGain(), context.createGain()];
    this.splitter   = context.createChannelSplitter(2);
    this.merger     = context.createChannelMerger(2);

    // Initialize parameter
    this.amplitudes[0].gain.value = 1;  // 1 +- depth
    this.amplitudes[1].gain.value = 1;  // 1 +- depth
    this.lfos[0].type             = 'sine';
    this.lfos[1].type             = 'sine';
    this.depths[0].gain.value     = 0;
    this.depths[1].gain.value     = 0;
    this.rates[0].value           = 0;
    this.rates[1].value           = 0;

    // `Tremolo` is not connected by default
    this.deactivate();

    // LFO

    // Left Channel
    // OscillatorNode (LFO) -> GainNode (Depth) -> AudioParam (gain)
    this.lfos[0].connect(this.depths[0]);
    this.depths[0].connect(this.amplitudes[0].gain);

    // Right Channel
    // OscillatorNode (LFO) -> GainNode (Depth) -> AudioParam (gain)
    this.lfos[1].connect(this.depths[1]);
    this.depths[1].connect(this.amplitudes[1].gain);
  }

  /** @override */
  public override stop(stopTime?: number, releaseTime?: number): void {
    super.stop(stopTime, releaseTime);

    if (this.isActive) {
      // Connect `AudioNode`s again
      this.lfos[0].connect(this.depths[0]);
      this.depths[0].connect(this.amplitudes[0].gain);

      this.lfos[1].connect(this.depths[1]);
      this.depths[1].connect(this.amplitudes[1].gain);
    }
  }

  /** @override */
  public override connect(): GainNode {
    // Clear connection
    this.input.disconnect(0);
    this.amplitudes[0].disconnect(0);
    this.amplitudes[1].disconnect(0);
    this.splitter.disconnect(0);
    this.splitter.disconnect(1);
    this.merger.disconnect(0);

    if (this.isActive) {
      // Effect ON

      switch (this.type) {
        case 'standard': {
          // GainNode (Input) -> GainNode (Tremolo) -> GainNode (Output)
          this.input.connect(this.amplitudes[0]);
          this.amplitudes[0].connect(this.output);

          break;
        }

        case 'stereo': {
          //                                            |-> Left Channel Tremolo  (GainNode (Tremolo)) ->|
          // GainNode (Input) -> ChannelSplitterNode -> |                                                | -> ChannelMergerNode
          //                                            |-> Right Channel Tremolo (GainNode (Tremolo)) ->|
          this.input.connect(this.splitter);

          // Left Channel
          // ChannelSplitterNode (Left Channel) -> GainNode (Tremolo) -> ChannelMergerNode
          this.splitter.connect(this.amplitudes[0], 0, 0);
          this.amplitudes[0].connect(this.merger, 0, 0);

          // Right Channel
          // ChannelSplitterNode (Right Channel) -> GainNode (Tremolo) -> ChannelMergerNode
          this.splitter.connect(this.amplitudes[1], 1, 0);
          this.amplitudes[1].connect(this.merger, 0, 1);

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
   * This method gets or sets parameters for tremolo effector.
   * This method is overloaded for type interface and type check.
   * @param {keyof TremoloParams|TremoloParams} params This argument is string if getter. Otherwise, setter.
   * @return {TremoloParams[keyof TremoloParams]|Tremolo} Return value is parameter for tremolo effector if getter.
   *     Otherwise, return value is for method chain.
   */
  public param(params: 'type'): TremoloType;
  public param(params: 'waveType'): OscillatorType | [OscillatorType, OscillatorType];
  public param(params: 'depth'): number | [number, number];
  public param(params: 'rate'): number | [number, number];
  public param(params: TremoloParams): Tremolo;
  public param(params: keyof TremoloParams | TremoloParams): TremoloParams[keyof TremoloParams] | Tremolo {
    if (typeof params === 'string') {
      switch (params) {
        case 'state': {
          return this.isActive;
        }

        case 'type': {
          return this.type;
        }

        case 'waveType': {
          switch (this.type) {
            case 'standard': {
              return this.lfos[0].type;
            }

            case 'stereo': {
              return [this.lfos[0].type, this.lfos[1].type];
            }
          }

          break;
        }

        case 'depth': {
          switch (this.type) {
            case 'standard': {
              return this.depths[0].gain.value;
            }

            case 'stereo': {
              return [this.depths[0].gain.value, this.depths[1].gain.value];
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

        case 'waveType': {
          if (typeof value === 'string') {
            if ((value === 'sine') || (value === 'square') || (value === 'sawtooth') || (value === 'triangle')) {
              this.lfos[0].type = value;
            }
          } else if (Array.isArray(value) && (value.length === 2)) {
            if ((value[0] === 'sine') || (value[0] === 'square') || (value[0] === 'sawtooth') || (value[0] === 'triangle')) {
              this.lfos[0].type = value[0];
            }

            if ((value[1] === 'sine') || (value[1] === 'square') || (value[1] === 'sawtooth') || (value[1] === 'triangle')) {
              this.lfos[1].type = value[1];
            }
          }

          break;
        }

        case 'depth': {
          if (typeof value === 'number') {
            this.depths[0].gain.value = value;
          } else if (Array.isArray(value) && (value.length === 2)) {
            this.depths[0].gain.value = value[0];
            this.depths[1].gain.value = value[1];
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
      }
    }

    return this;
  }

  /** @override */
  public override params(): Required<TremoloParams> {
    switch (this.type) {
      case 'standard': {
        return {
          state   : this.isActive,
          type    : this.type,
          waveType: this.lfos[0].type,
          depth   : this.depths[0].gain.value,
          rate    : this.rates[0].value
        };
      }

      case 'stereo': {
        return {
          state   : this.isActive,
          type    : this.type,
          waveType: [this.lfos[0].type, this.lfos[1].type],
          depth   : [this.depths[0].gain.value, this.depths[1].gain.value],
          rate    : [this.rates[0].value, this.rates[1].value]
        };
      }
    }
  }
}
