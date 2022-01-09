import { BufferSize } from '../../types';
import { Effector } from './Effector';

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

  private splitter: ChannelSplitterNode;
  private merger: ChannelMergerNode;
  private delayL: DelayNode;
  private delayR: DelayNode;

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   * @param {BufferSize} bufferSize This argument is buffer size for `ScriptProcessorNode`.
   */
  constructor(context: AudioContext, bufferSize: BufferSize) {
    super(context, bufferSize);

    this.splitter = context.createChannelSplitter(2);
    this.merger   = context.createScriptProcessor(bufferSize, 2, 2);
    this.delayL   = context.createDelay(Stereo.MAX_DELAY_TIME);
    this.delayR   = context.createDelay(Stereo.MAX_DELAY_TIME);

    // Initialize parameters
    this.delayL.delayTime.value = 0;
    this.delayR.delayTime.value = 0;

    // `Stereo` is not connected by default
    this.deactivate();
  }

  /** @override */
  public start(): void {
    if (!this.isActive || !this.paused) {
      return;
    }

    this.paused = false;

    const bufferSize = this.processor.bufferSize;

    this.processor.onaudioprocess = (event: AudioProcessingEvent) => {
      const inputLs  = event.inputBuffer.getChannelData(0);
      const inputRs  = event.inputBuffer.getChannelData(1);
      const outputLs = event.outputBuffer.getChannelData(0);
      const outputRs = event.outputBuffer.getChannelData(1);

      if (this.isActive && (this.delayL.delayTime.value !== 0) && (this.delayR.delayTime.value !== 0)) {
        for (let i = 0; i < bufferSize; i++) {
          outputLs[i] =  inputLs[i];
          outputRs[i] = -inputRs[i];
        }
      } else {
        outputLs.set(inputLs);
        outputRs.set(inputRs);
      }
    };
  }

  /** @override */
  public stop(): void {
    // Effector's state is active ?
    if (!this.isActive) {
      return;
    }

    this.paused = true;

    // Stop `onaudioprocess` event
    this.processor.disconnect(0);
    this.processor.onaudioprocess = null;

    // Connect `AudioNode`s again
    this.connect();
  }

  /** @override */
  public connect(): GainNode {
    // Clear connection
    this.input.disconnect(0);
    this.splitter.disconnect(0);
    this.delayL.disconnect(0);
    this.delayR.disconnect(0);
    this.merger.disconnect(0);

    if (this.isActive) {
      // Effect ON

      // GainNode (Input) -> ChannelSplitterNode -> DelayNode (L) / (R) -> ScriptProcessorNode (Stereo) -> GainNode (Output)
      this.input.connect(this.splitter);
      this.splitter.connect(this.delayL, 0, 0);
      this.splitter.connect(this.delayR, 1, 0);
      this.delayL.connect(this.merger);
      this.delayR.connect(this.merger);
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
   * @param {keyof StereoParams|StereoParams} params This argument is string if getter. Otherwise, setter.
   * @return {StereoParams[keyof StereoParams]|Stereo} Return value is parameter for stereo effector if getter.
   *     Otherwise, return value is for method chain.
   */
  public param(params: keyof StereoParams | StereoParams): StereoParams[keyof StereoParams] | Stereo {
    if (typeof params === 'string') {
      switch (params) {
        case 'time':
          return this.delayL.delayTime.value;
        default:
          return this;
      }
    }

    for (const [key, value] of Object.entries(params)) {
      switch (key) {
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
  public params(): StereoParams {
    return {
      state: this.isActive,
      time : this.delayL.delayTime.value
    };
  }
}
