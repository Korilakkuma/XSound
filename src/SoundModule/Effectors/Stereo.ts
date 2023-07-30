import { Effector } from '/src/SoundModule/Effectors/Effector';
import { StereoProcessor } from '/src/SoundModule/Effectors/AudioWorkletProcessors/StereoProcessor';

export type StereoParams = {
  state?: boolean,
  time?: number
};

/**
 * Effector's subclass for Stereo.
 * @constructor
 * @extends {Effector}
 */
export class Stereo extends Effector {
  public static MAX_DELAY_TIME = 1;  // Max delay time is 1000 [ms]

  private processor: AudioWorkletNode;

  private splitter: ChannelSplitterNode;
  private merger: ChannelMergerNode;
  private delayL: DelayNode;
  private delayR: DelayNode;

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   */
  constructor(context: AudioContext) {
    super(context);

    this.splitter = context.createChannelSplitter(2);
    this.merger   = context.createChannelMerger(2);
    this.delayL   = context.createDelay(Stereo.MAX_DELAY_TIME);
    this.delayR   = context.createDelay(Stereo.MAX_DELAY_TIME);

    // Initialize parameters
    this.delayL.delayTime.value = 0;
    this.delayR.delayTime.value = 0;

    this.processor = new AudioWorkletNode(this.context, StereoProcessor.name);
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
    this.splitter.disconnect(0);
    this.delayL.disconnect(0);
    this.delayR.disconnect(0);
    this.merger.disconnect(0);
    this.processor.disconnect(0);

    if (this.isActive) {
      // Effect ON

      // GainNode (Input) -> ChannelSplitterNode -> DelayNode (L) / (R) -> AudioWorkletNode (Stereo) -> ChannelMergerNode -> GainNode (Output)
      this.input.connect(this.splitter);
      this.splitter.connect(this.delayL, 0, 0);
      this.splitter.connect(this.delayR, 1, 0);
      this.delayL.connect(this.processor);
      this.delayR.connect(this.processor);
      this.processor.connect(this.merger);
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
        case 'state':
          return this.isActive;
        case 'time':
          return this.delayL.delayTime.value;
        default:
          return this;
      }
    }

    for (const [key, value] of Object.entries(params)) {
      switch (key) {
        case 'state':
          if (typeof value === 'boolean') {
            this.isActive = value;

            const message: StereoParams = { state: value };

            this.processor.port.postMessage(message);
          }

          break;
        case 'time':
          if (typeof value === 'number') {
            this.delayL.delayTime.value = value;
            this.delayR.delayTime.value = value;
          }

          break;
        default:
          break;
      }
    }

    return this;
  }

  /** @override */
  public override params(): Required<StereoParams> {
    return {
      state: this.isActive,
      time : this.delayL.delayTime.value
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
