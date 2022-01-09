import { BufferSize } from '../types';
import { SoundModule } from '../SoundModule';

export class ProcessorModule extends SoundModule {
  private worklet: AudioWorkletNode | ScriptProcessorNode | null = null;
  private workletName = '';
  private options: AudioWorkletNodeOptions = {};
  private moduleURL = '';

  private runningAnalyser = false;

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   * @param {BufferSize} bufferSize This argument is buffer size for `ScriptProcessorNode`.
   */
  constructor(context: AudioContext, bufferSize: BufferSize) {
    super(context, bufferSize);

    this.envelopegenerator.setGenerator(0);

    if (!window.AudioWorkletNode) {
      // Polyfill
      this.worklet = this.context.createScriptProcessor(bufferSize, SoundModule.NUMBER_OF_INPUTS, SoundModule.NUMBER_OF_OUTPUTS);
    }
  }

  /**
   * This method sets registered worklet and options for `AudioWorkletNode` constructor.
   * @param {string} name This argument is name of `AudioWorkletProcessor`.
   * @param {AudioWorkletNodeOptions} options This argument is object based on `AudioWorkletNodeOptions` dictionary.
   * @return {ProcessorModule} Return value is for method chain.
   */
  public setup(workletName: string, options?: AudioWorkletNodeOptions): ProcessorModule {
    this.workletName = workletName;
    this.options     = options ?? {};

    return this;
  }

  /**
   * This method adds module for worklet and creates the instance of `AudioWorkletNode`.
   * @param {string} moduleURL This argument is string that contains URL of file (.js) with module to add.
   * @param {WorkletOptions} options This argument is one of 'omit', 'same-origin', 'include'. The default value is 'same-origin'.
   * @return {Promise<void>} Return value is `Promise` that `addModule` returns.
   */
  public ready(moduleURL: string, options?: WorkletOptions): Promise<void> {
    if (!window.AudioWorkletNode) {
      return Promise.reject();
    }

    this.moduleURL = moduleURL;

    return this.context.audioWorklet.addModule(this.moduleURL, options ?? { credentials: 'same-origin' })
      .then(() => {
        this.worklet = new AudioWorkletNode(this.context, this.workletName, this.options);
      });
  }

  /**
   * This method starts sound by connecting to `AudioDestinationNode`.
   * @param {function} processCallback This argument is `onaudioprocess` event handler for `ScriptProcessorNode`.
   *     Therefore, if use AudioWorklet, this argument is unused.
   * @return {ProcessorModule} Return value is for method chain.
   */
  public start(processCallback?: (event: AudioProcessingEvent) => void): ProcessorModule {
    const generator = this.envelopegenerator.getGenerator(0);

    if ((this.worklet === null) || (generator === null)) {
      return this;
    }

    const startTime = this.context.currentTime;

    // Clear previous
    this.envelopegenerator.clear(true);
    this.worklet.disconnect(0);

    if (this.worklet instanceof ScriptProcessorNode) {
      this.worklet.onaudioprocess = null;
    }

    // GainNode (Envelope Generator) -> ... -> AudioDestinationNode (Output)
    this.connect(generator);

    // AudioWorkletNode (Input) -> GainNode (Envelope Generator)
    this.envelopegenerator.ready(0, this.worklet, null);

    this.envelopegenerator.start(startTime);

    if (!this.runningAnalyser) {
      this.analyser.start('time');
      this.analyser.start('fft');
      this.runningAnalyser = true;
    }

    this.on(startTime);

    if ((this.worklet instanceof ScriptProcessorNode) && processCallback) {
      this.worklet.onaudioprocess = processCallback;
    }

    return this;
  }

  /**
   * This method stops sound by disconnecting to `AudioDestinationNode`.
   * @return {ProcessorModule} Return value is for method chain.
   */
  public stop(): ProcessorModule {
    if (this.worklet === null) {
      return this;
    }

    const stopTime = this.context.currentTime;

    this.worklet.disconnect(0);
    this.envelopegenerator.stop(stopTime);
    this.off(stopTime);

    return this;
  }

  /**
   * This method sends message from `MessagePort` that `AudioWorkletNode` has.
   * @param {unknown} data This argument is sent as any data.
   * @return {ProcessorModule} Return value is for method chain.
   */
  public postMessage(data: unknown): ProcessorModule {
    if ((this.worklet === null) || (this.worklet instanceof ScriptProcessorNode)) {
      return this;
    }

    this.worklet.port.postMessage(data);

    return this;
  }

  /**
   * This method sets event handler that is invoked on receiving message.
   * @param {function} This argument is invoked on receiving message.
   * @return {ProcessorModule} Return value is for method chain.
   */
  public onMessage(callback: (event: MessageEvent) => void): ProcessorModule {
    if ((this.worklet === null) || (this.worklet instanceof ScriptProcessorNode)) {
      return this;
    }

    this.worklet.port.onmessage = callback;

    return this;
  }

  /**
   * This method sets event handler that is invoked on receiving message that cannot be deserialized.
   * @param {function} This argument is invoked on receiving message that cannot be deserialized.
   * @return {ProcessorModule} Return value is for method chain.
   */
  public onMessageError(callback: (event: MessageEvent) => void): ProcessorModule {
    if ((this.worklet === null) || (this.worklet instanceof ScriptProcessorNode)) {
      return this;
    }

    this.worklet.port.onmessageerror = callback;

    return this;
  }

  /**
   * This method gets map based on `AudioParamMap`.
   * @return {AudioParamMap|null}
   */
  public map(): AudioParamMap | null {
    if ((this.worklet === null) || (this.worklet instanceof ScriptProcessorNode)) {
      return null;
    }

    return this.worklet.parameters;
  }

  /**
   * This method gets instance of `AudioWorkletNode` (or `ScriptProcessorNode`).
   * @return {AudioWorkletNode|ScriptProcessorNode|null}
   */
  public get(): AudioWorkletNode | ScriptProcessorNode | null {
    return this.worklet;
  }
}
