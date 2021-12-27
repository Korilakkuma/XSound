import { BufferSize } from '../types';
import { SoundModule } from '../SoundModule';

/**
 * This class is for mixing sound sources (instance of `SoundModule` subclass).
 * @constructor
 * @extends {SoundModule}
 */
export class MixerModule extends SoundModule {
  private sources: SoundModule[] = [];
  private runningAnalyser = false;

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   * @param {BufferSize} bufferSize This argument is buffer size for `ScriptProcessorNode`.
   */
  // eslint-disable-next-line no-useless-constructor
  constructor(context: AudioContext, bufferSize: BufferSize) {
    super(context, bufferSize);
  }

  /**
   * This method mixes sound sources (instance of `SoundModule` subclass).
   * @param {Array<SoundModule>} sources This argument is array that contains sound sources.
   * @return {MixerModule} Return value is for method chain.
   */
  public mix(sources: SoundModule[]): MixerModule {
    this.sources = sources;

    for (const source of this.sources) {
      const stopTime = this.context.currentTime;

      this.off(stopTime);

      source.suspend();

      // ScriptProcessorNode (each sound source) -> ScriptProcessorNode (Mix sound sources)
      source.INPUT.connect(this.processor);
    }

    // (... ->) ScriptProcessorNode (Mix sound sources) -> ... -> AudioDestinationNode (Output)
    this.connect(this.processor);

    const startTime = this.context.currentTime;

    this.on(startTime);

    if (!this.runningAnalyser) {
      this.analyser.start('time');
      this.analyser.start('fft');
      this.runningAnalyser = true;
    }

    this.processor.onaudioprocess = (event: AudioProcessingEvent) => {
      const inputLs  = event.inputBuffer.getChannelData(0);
      const inputRs  = event.inputBuffer.getChannelData(1);
      const outputLs = event.outputBuffer.getChannelData(0);
      const outputRs = event.outputBuffer.getChannelData(1);

      outputLs.set(inputLs);
      outputRs.set(inputRs);
    };

    return this;
  }

  /**
   * This method gets array that contains instance of `SoundModule` subclass.
   * @return {Array<SoundModule>}
   */
  public get(): SoundModule[] {
    return this.sources;
  }

  /** @override */
  public toString(): string {
    return '[MixerModule]';
  }
}
