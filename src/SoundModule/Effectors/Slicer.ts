import { StereoEffector } from './StereoEffector';

export type SlicerType = 'standard' | 'stereo';

export type SlicerParams = {
  state?: boolean,
  type?: SlicerType,
  depth?: number | [number, number],
  rate?: number | [number, number],
  dry?: number,
  wet?: number | [number, number]
};

/**
 * Effector's subclass for Slicer.
 */
export class Slicer extends StereoEffector {
  private type: SlicerType = 'standard';

  private amplitudes: [GainNode, GainNode];
  private dry: GainNode;
  private wets: [GainNode, GainNode];
  private splitter: ChannelSplitterNode;
  private merger: ChannelMergerNode;

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   */
  constructor(context: AudioContext) {
    super(context);

    this.amplitudes = [context.createGain(), context.createGain()];
    this.dry        = context.createGain();
    this.wets       = [context.createGain(), context.createGain()];
    this.splitter   = context.createChannelSplitter(2);
    this.merger     = context.createChannelMerger(2);

    // Initialize parameter
    this.amplitudes[0].gain.value = 1;  // 1 +- depth
    this.amplitudes[1].gain.value = 1;  // 1 +- depth
    this.dry.gain.value           = 1;
    this.wets[0].gain.value       = 0;
    this.wets[1].gain.value       = 0;
    this.lfos[0].type             = 'square';
    this.lfos[1].type             = 'square';
    this.depths[0].gain.value     = 0;
    this.depths[1].gain.value     = 0;
    this.rates[0].value           = 0;
    this.rates[1].value           = 0;

    // `Slicer` is not connected by default
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
    this.dry.disconnect(0);
    this.wets[0].disconnect(0);
    this.splitter.disconnect(0);
    this.splitter.disconnect(1);
    this.merger.disconnect(0);

    if (this.isActive) {
      // Effect ON

      // GainNode (Input) -> GainNode (Dry) -> GainNode (wet)
      this.input.connect(this.dry);
      this.dry.connect(this.output);

      switch (this.type) {
        case 'standard': {
          // GainNode (Input) -> GainNode (Slicer) -> GainNode (Wet) -> GainNode (Output)
          this.input.connect(this.amplitudes[0]);
          this.amplitudes[0].connect(this.wets[0]);
          this.wets[0].connect(this.output);

          break;
        }

        case 'stereo': {
          //                                            |-> Left Channel Slicer  (GainNode (Slicer)) ->|
          // GainNode (Input) -> ChannelSplitterNode -> |                                              | -> ChannelMergerNode
          //                                            |-> Right Channel Slicer (GainNode (Slicer)) ->|
          this.input.connect(this.splitter);

          // Left Channel
          // ChannelSplitterNode (Left Channel) -> GainNode (Slicer) -> ChannelMergerNode
          this.splitter.connect(this.amplitudes[0], 0, 0);
          this.amplitudes[0].connect(this.wets[0]);
          this.wets[0].connect(this.merger, 0, 0);

          // Right Channel
          // ChannelSplitterNode (Right Channel) -> GainNode (Slicer) -> ChannelMergerNode
          this.splitter.connect(this.amplitudes[1], 1, 0);
          this.amplitudes[1].connect(this.wets[1]);
          this.wets[1].connect(this.merger, 0, 1);

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
   * This method gets or sets parameters for slicer effector.
   * This method is overloaded for type interface and type check.
   * @param {keyof SlicerParams|SlicerParams} params This argument is string if getter. Otherwise, setter.
   * @return {SlicerParams[keyof SlicerParams]|Slicer} Return value is parameter for slicer effector if getter.
   *     Otherwise, return value is for method chain.
   */
  public param(params: 'type'): SlicerType;
  public param(params: 'depth'): number | [number, number];
  public param(params: 'rate'): number | [number, number];
  public param(params: 'dry'): number;
  public param(params: 'wet'): number | [number, number];
  public param(params: SlicerParams): Slicer;
  public param(params: keyof SlicerParams | SlicerParams): SlicerParams[keyof SlicerParams] | Slicer {
    if (typeof params === 'string') {
      switch (params) {
        case 'state': {
          return this.isActive;
        }

        case 'type': {
          return this.type;
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

              this.connect();
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
  public override params(): Required<SlicerParams> {
    switch (this.type) {
      case 'standard': {
        return {
          state: this.isActive,
          type : this.type,
          depth: this.depths[0].gain.value,
          rate : this.rates[0].value,
          dry  : this.dry.gain.value,
          wet  : this.wets[0].gain.value
        };
      }

      case 'stereo': {
        return {
          state: this.isActive,
          type : this.type,
          depth: [this.depths[0].gain.value, this.depths[1].gain.value],
          rate : [this.rates[0].value, this.rates[1].value],
          dry  : this.dry.gain.value,
          wet  : [this.wets[0].gain.value, this.wets[1].gain.value]
        };
      }
    }
  }
}
