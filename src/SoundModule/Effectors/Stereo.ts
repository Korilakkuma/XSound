import { Effector } from './Effector';

export type StereoParams = {
  state?: boolean,
  time?: number
};

/**
 * Effector's subclass for Stereo.
 */
export class Stereo extends Effector {
  public static MAX_DELAY_TIME = 1;  // Max delay time is 1000 [ms]

  private splitter: ChannelSplitterNode;
  private merger: ChannelMergerNode;
  private delay: DelayNode;
  private gainL: GainNode;
  private gainR: GainNode;

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   */
  constructor(context: AudioContext) {
    super(context);

    this.splitter = context.createChannelSplitter(2);
    this.merger   = context.createChannelMerger(2);
    this.delay    = context.createDelay(Stereo.MAX_DELAY_TIME);
    this.gainL    = context.createGain();
    this.gainR    = context.createGain();

    // Initialize parameters
    this.delay.delayTime.value = 0;

    this.gainL.gain.value = +1;
    this.gainR.gain.value = -1;

    this.deactivate();
  }

  /** @override */
  public override start(): void {
  }

  /** @override */
  public override stop(): void {
  }

  /** @override */
  public override connect(): GainNode {
    // Clear connection
    this.input.disconnect(0);
    this.delay.disconnect(0);
    this.splitter.disconnect(0);
    this.splitter.disconnect(1);
    this.gainL.disconnect(0);
    this.gainR.disconnect(0);
    this.merger.disconnect(0);

    if (this.isActive) {
      // Effect ON

      // GainNode (Input) -> ChannelMergerNode
      this.input.connect(this.merger, 0, 0);
      this.input.connect(this.merger, 0, 1);

      // GainNode (Input) -> DelayNode -> ChannelSplitterNode -> GainNode (L) / (R) -> ChannelMergerNode -> GainNode (Output)
      this.input.connect(this.delay);
      this.delay.connect(this.splitter);
      this.splitter.connect(this.gainL, 0, 0);
      this.splitter.connect(this.gainR, 1, 0);
      this.gainL.connect(this.merger, 0, 0);
      this.gainR.connect(this.merger, 0, 1);
      this.merger.connect(this.output);
    } else {
      // Effect OFF

      // GainNode (Input) -> GainNode (Output)
      this.input.connect(this.output);
    }

    return this.output;
  }

  /**
   * This method gets or sets parameters for stereo effector
   * This method is overloaded for type interface and type check.
   * @param {keyof StereoParams|StereoParams} params This argument is string if getter. Otherwise, setter.
   * @return {StereoParams[keyof StereoParams]|Stereo} Return value is parameter for stereo effector if getter.
   *     Otherwise, return value is for method chain.
   */
  public param(params: 'state'): boolean;
  public param(params: 'time'): number;
  public param(params: StereoParams): Stereo;
  public param(params: keyof StereoParams | StereoParams): StereoParams[keyof StereoParams] | Stereo {
    if (typeof params === 'string') {
      switch (params) {
        case 'state': {
          return this.isActive;
        }

        case 'time': {
          return this.delay.delayTime.value;
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
          }

          break;
        }
      }
    }

    return this;
  }

  /** @override */
  public override params(): Required<StereoParams> {
    return {
      state: this.isActive,
      time : this.delay.delayTime.value
    };
  }

  /** @override */
  public override activate(): Stereo {
    super.activate();
    return this;
  }

  /** @override */
  public override deactivate(): Stereo {
    super.deactivate();
    return this;
  }
}
