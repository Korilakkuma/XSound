import { StereoEffector } from './StereoEffector';

export type PhaserType = 'standard' | 'stereo';

export type PhaserNumberOfStages = 0 | 2 | 4 | 8 | 12 | 24;

export type PhaserFilterConnectionType = 'serial' | 'parallel';

export type PhaserParams = {
  state?: boolean,
  type?: PhaserType,
  stage?: PhaserNumberOfStages,
  connectionType?: PhaserFilterConnectionType,
  frequency?: number | [number, number],
  resonance?: number | [number, number],
  depth?: number | [number, number],
  rate?: number | [number, number],
  mix?: number | [number, number],
  dry?: number,
  wet?: number | [number, number]
};

/**
 * Effector's subclass for Phaser.
 */
export class Phaser extends StereoEffector {
  public static MAX_STAGES = 24;  // The max number of All-Pass Filters

  private type: PhaserType = 'standard';

  private numberOfStages: PhaserNumberOfStages = 12;  // The default number of All-Pass Filters
  private connectionType: PhaserFilterConnectionType = 'serial';
  private filters: [BiquadFilterNode[], BiquadFilterNode[]] = [[], []];
  private dry: GainNode;
  private wets: [GainNode, GainNode];
  private splitter: ChannelSplitterNode;
  private merger: ChannelMergerNode;
  private depthRates: [number, number] = [0, 0];

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   */
  constructor(context: AudioContext) {
    super(context);

    const filter0s: BiquadFilterNode[] = [];
    const filter1s: BiquadFilterNode[] = [];

    for (let i = 0; i < Phaser.MAX_STAGES; i++) {
      const filter0 = context.createBiquadFilter();
      const filter1 = context.createBiquadFilter();

      filter0.type            = 'allpass';
      filter0.frequency.value = 350;
      filter0.Q.value         = 1;
      filter0.gain.value      = 0;  // Not used

      filter1.type            = 'allpass';
      filter1.frequency.value = 350;
      filter1.Q.value         = 1;
      filter1.gain.value      = 0;  // Not used

      filter0s.push(filter0);
      filter1s.push(filter1);
    }

    this.filters[0] = filter0s;
    this.filters[1] = filter1s;

    this.dry  = context.createGain();
    this.wets = [context.createGain(), context.createGain()];

    this.splitter  = context.createChannelSplitter(2);
    this.merger    = context.createChannelMerger(2);

    // Initialize parameters
    this.depths[0].gain.value = 0;
    this.depths[1].gain.value = 0;
    this.rates[0].value       = 0;
    this.rates[1].value       = 0;
    this.dry.gain.value       = 1;
    this.wets[0].gain.value   = 0;
    this.wets[1].gain.value   = 0;

    // `Phaser` is not connected by default
    this.deactivate();

    // LFO

    // Left Channel
    // GainNode (LFO) -> GainNode (Depth) -> AudioParam (frequency)
    this.lfos[0].connect(this.depths[0]);

    for (let i = 0; i < Phaser.MAX_STAGES; i++) {
      this.depths[0].connect(this.filters[0][i].frequency);
    }

    // Right Channel
    // GainNode (LFO) -> GainNode (Depth) -> AudioParam (frequency)
    this.lfos[1].connect(this.depths[1]);

    for (let i = 0; i < Phaser.MAX_STAGES; i++) {
      this.depths[1].connect(this.filters[1][i].frequency);
    }
  }

  /** @override */
  public override stop(stopTime?: number, releaseTime?: number): void {
    super.stop(stopTime, releaseTime);

    if (this.isActive) {
      this.lfos[0].connect(this.depths[0]);

      for (let i = 0; i < Phaser.MAX_STAGES; i++) {
        this.depths[0].connect(this.filters[0][i].frequency);
      }

      this.lfos[1].connect(this.depths[1]);

      for (let i = 0; i < Phaser.MAX_STAGES; i++) {
        this.depths[1].connect(this.filters[1][i].frequency);
      }
    }
  }

  /** @override */
  public override connect(): GainNode {
    // Clear connection
    this.input.disconnect(0);

    for (let i = 0; i < Phaser.MAX_STAGES; i++) {
      this.filters[0][i].disconnect(0);
      this.filters[1][i].disconnect(0);
    }

    this.dry.disconnect(0);
    this.wets[0].disconnect(0);
    this.wets[1].disconnect(0);
    this.splitter.disconnect(0);
    this.splitter.disconnect(1);
    this.merger.disconnect(0);

    if (this.isActive && (this.numberOfStages > 0)) {
      // Effect ON

      // GainNode (Input) -> GainNode (Dry) -> GainNode (Output)
      this.input.connect(this.dry);
      this.dry.connect(this.output);

      switch (this.type) {
        case 'standard': {
          switch (this.connectionType) {
            case 'serial': {
              // GainNode (Input) -> BiquadFilterNode (All-Pass Filter x N) -> GainNode (Wet) -> GainNode (Output)
              this.input.connect(this.filters[0][0]);

              for (let i = 0; i < this.numberOfStages; i++) {
                if (i < (this.numberOfStages - 1)) {
                  this.filters[0][i].connect(this.filters[0][i + 1]);
                } else {
                  this.filters[0][i].connect(this.wets[0]);
                  this.wets[0].connect(this.output);
                }
              }

              break;
            }

            case 'parallel': {
              //                     |-> BiquadFilterNode (All-Pass Filter) ->|
              //                     |-> BiquadFilterNode (All-Pass Filter) ->|
              // GainNode (Input) -> |-> BiquadFilterNode (All-Pass Filter) ->| -> GainNode (Wet) -> GainNode (Output)
              //                     |-> BiquadFilterNode (All-Pass Filter) ->|
              //                     |-> ... x N                            ->|
              for (let i = 0; i < this.numberOfStages; i++) {
                this.input.connect(this.filters[0][i]);
                this.filters[0][i].connect(this.wets[0]);
              }

              this.wets[0].connect(this.output);

              break;
            }
          }

          // Phaser don't work in Firefox if there is feedback connection.
          // GainNode (Input) -> BiquadFilterNode (All-Pass Filter x N) -> GainNode (Feedback) -> BiquadFilterNode (All-Pass Filter x N) ...

          break;
        }

        case 'stereo': {
          switch (this.connectionType) {
            case 'serial': {
              //                                            |-> Left Channel Phaser  (BiquadFilterNode (All-Pass Filter x N) (Serial) -> GainNode (Wet)) ->|
              // GainNode (Input) -> ChannelSplitterNode -> |                                                                                              | -> ChannelMergerNode
              //                                            |-> Right Channel Phaser (BiquadFilterNode (All-Pass Filter x N) (Serial) -> GainNode (Wet)) ->|
              this.input.connect(this.splitter);

              // Left Channel
              // ChannelSplitterNode (Left Channel) -> BiquadFilterNode (All-Pass Filter x N) -> GainNode (Wet) -> ChannelMergerNode
              this.splitter.connect(this.filters[0][0], 0, 0);

              for (let i = 0; i < this.numberOfStages; i++) {
                if (i < (this.numberOfStages - 1)) {
                  this.filters[0][i].connect(this.filters[0][i + 1]);
                } else {
                  this.filters[0][i].connect(this.wets[0]);
                  this.wets[0].connect(this.merger, 0, 0);
                }
              }

              // Right Channel
              // ChannelSplitterNode (Right Channel) -> BiquadFilterNode (All-Pass Filter x N) -> GainNode (Wet) -> ChannelMergerNode
              this.splitter.connect(this.filters[1][0], 1, 0);

              for (let i = 0; i < this.numberOfStages; i++) {
                if (i < (this.numberOfStages - 1)) {
                  this.filters[1][i].connect(this.filters[1][i + 1]);
                } else {
                  this.filters[1][i].connect(this.wets[1]);
                  this.wets[1].connect(this.merger, 0, 1);
                }
              }

              // ChannelMergerNode -> GainNode (Output);
              this.merger.connect(this.output);

              break;
            }

            case 'parallel': {
              //                                            |-> Left Channel Phaser  (BiquadFilterNode (All-Pass Filter x N) (Parallel) -> GainNode (Wet)) ->|
              // GainNode (Input) -> ChannelSplitterNode -> |                                                                                                | -> ChannelMergerNode
              //                                            |-> Right Channel Phaser (BiquadFilterNode (All-Pass Filter x N) (Parallel) -> GainNode (Wet)) ->|
              this.input.connect(this.splitter);

              // Left Channel
              //                                       |-> BiquadFilterNode (All-Pass Filter) ->|
              //                                       |-> BiquadFilterNode (All-Pass Filter) ->|
              // ChannelSplitterNode (Left Channel) -> |-> BiquadFilterNode (All-Pass Filter) ->| -> GainNode (Wet) -> ChannelMergerNode
              //                                       |-> BiquadFilterNode (All-Pass Filter) ->|
              //                                       |-> ... x N                            ->|
              for (let i = 0; i < this.numberOfStages; i++) {
                this.splitter.connect(this.filters[0][i], 0, 0);
                this.filters[0][i].connect(this.wets[0]);
              }

              this.wets[0].connect(this.merger, 0, 0);

              // Right Channel
              //                                        |-> BiquadFilterNode (All-Pass Filter) ->|
              //                                        |-> BiquadFilterNode (All-Pass Filter) ->|
              // ChannelSplitterNode (Right Channel) -> |-> BiquadFilterNode (All-Pass Filter) ->| -> GainNode (Wet) -> ChannelMergerNode
              //                                        |-> BiquadFilterNode (All-Pass Filter) ->|
              //                                        |-> ... x N                            ->|
              for (let i = 0; i < this.numberOfStages; i++) {
                this.splitter.connect(this.filters[1][i], 0, 1);
                this.filters[1][i].connect(this.wets[1]);
              }

              this.wets[1].connect(this.merger, 1, 0);

              // ChannelMergerNode -> GainNode (Output);
              this.merger.connect(this.output);

              break;
            }
          }

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
   * This method gets or sets parameters for phaser effector.
   * This method is overloaded for type interface and type check.
   * @param {keyof PhaserParams|PhaserParams} params This argument is string if getter. Otherwise, setter.
   * @return {PhaserParams[keyof PhaserParams]|Phaser} Return value is parameter for phaser effector if getter.
   *     Otherwise, return value is for method chain.
   */
  public param(params: 'state'): boolean;
  public param(params: 'type'): PhaserType;
  public param(params: 'stage'): PhaserNumberOfStages;
  public param(params: 'connectionType'): PhaserFilterConnectionType;
  public param(params: 'frequency'): number | [number, number];
  public param(params: 'resonance'): number | [number, number];
  public param(params: 'depth'): number | [number, number];
  public param(params: 'rate'): number | [number, number];
  public param(params: 'mix'): number | [number, number];
  public param(params: 'dry'): number;
  public param(params: 'wet'): number | [number, number];
  public param(params: PhaserParams): Phaser;
  public param(params: keyof PhaserParams | PhaserParams): PhaserParams[keyof PhaserParams] | Phaser {
    if (typeof params === 'string') {
      switch (params) {
        case 'state': {
          return this.isActive;
        }

        case 'type': {
          return this.type;
        }

        case 'stage': {
          return this.numberOfStages;
        }

        case 'connectionType': {
          return this.connectionType;
        }

        case 'frequency': {
          switch (this.type) {
            case 'standard': {
              return this.filters[0][0].frequency.value;
            }

            case 'stereo': {
              return [this.filters[0][0].frequency.value, this.filters[1][0].frequency.value];
            }
          }

          break;
        }

        case 'resonance': {
          switch (this.type) {
            case 'standard': {
              return this.filters[0][0].Q.value;
            }

            case 'stereo': {
              return [this.filters[0][0].Q.value, this.filters[1][0].Q.value];
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

              // Update connection
              this.connect();
            }
          }

          break;
        }

        case 'stage': {
          switch (value) {
            case  0:
            case  2:
            case  4:
            case  8:
            case 12:
            case 24: {
              this.numberOfStages = value;

              // Update connection
              this.connect();
              break;
            }
          }

          break;
        }

        case 'connectionType': {
          if (typeof value === 'string') {
            if ((value === 'serial') || (value === 'parallel')) {
              this.connectionType = value;

              // Update connection
              this.connect();
            }
          }

          break;
        }

        case 'frequency': {
          if (typeof value === 'number') {
            for (const filter of this.filters[0]) {
              filter.frequency.value = value;
            }

            this.depths[0].gain.value = value * this.depthRates[0];
          } else if (Array.isArray(value) && (value.length === 2)) {
            for (const filter of this.filters[0]) {
              filter.frequency.value = value[0];
            }

            for (const filter of this.filters[1]) {
              filter.frequency.value = value[1];
            }

            this.depths[0].gain.value = value[0] * this.depthRates[0];
            this.depths[1].gain.value = value[1] * this.depthRates[1];
          }

          break;
        }

        case 'resonance': {
          if (typeof value === 'number') {
            for (const filter of this.filters[0]) {
              filter.Q.value = value;
            }
          } else if (Array.isArray(value) && (value.length === 2)) {
            for (const filter of this.filters[0]) {
              filter.Q.value = value[0];
            }

            for (const filter of this.filters[1]) {
              filter.Q.value = value[1];
            }
          }

          break;
        }

        case 'depth': {
          if (typeof value === 'number') {
            this.depthRates[0]        = value;
            this.depths[0].gain.value = this.filters[0][0].frequency.value * value;
          } else if (Array.isArray(value) && (value.length === 2)) {
            this.depthRates[0]        = value[0];
            this.depthRates[1]        = value[1];
            this.depths[0].gain.value = this.filters[0][0].frequency.value * value[0];
            this.depths[1].gain.value = this.filters[1][0].frequency.value * value[1];
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
      }
    }

    return this;
  }

  /** @override */
  public override params(): Required<PhaserParams> {
    switch (this.type) {
      case 'standard': {
        return {
          state         : this.isActive,
          type          : this.type,
          stage         : this.numberOfStages,
          connectionType: this.connectionType,
          frequency     : this.filters[0][0].frequency.value,
          resonance     : this.filters[0][0].Q.value,
          depth         : this.depthRates[0],
          rate          : this.rates[0].value,
          mix           : this.wets[0].gain.value,
          dry           : this.dry.gain.value,
          wet           : this.wets[0].gain.value
        };
      }

      case 'stereo': {
        return {
          state         : this.isActive,
          type          : this.type,
          stage         : this.numberOfStages,
          connectionType: this.connectionType,
          frequency     : [this.filters[0][0].frequency.value, this.filters[1][0].frequency.value],
          resonance     : [this.filters[0][0].Q.value, this.filters[1][0].Q.value],
          depth         : [this.depthRates[0], this.depthRates[1]],
          rate          : [this.rates[0].value, this.rates[1].value],
          mix           : [this.wets[0].gain.value, this.wets[1].gain.value],
          dry           : this.dry.gain.value,
          wet           : [this.wets[0].gain.value, this.wets[1].gain.value]
        };
      }
    }
  }
}
