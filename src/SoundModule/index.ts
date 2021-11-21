import { ScriptProcessorNodeBufferSize } from '../types';

/**
 * This class is superclass that is the top in this library.
 * This library's users do not create instance of `SoundModule`.
 * This class is used for inherit in subclass.
 * Therefore, this class defines common properties for each sound sources.
 * @constructor
 */
export class SoundModule {
  public static NUMBER_OF_INPUTS  = 2;
  public static NUMBER_OF_OUTPUTS = 2;

  private context: AudioContext | null = null;
  private mastervolume: GainNode | null = null;
  private processor: ScriptProcessorNode | null = null;

  /**
   * @param {AudioContext} context This argument is in order to use the interfaces of Web Audio API.
   * @param {number} bufferSize This argument is buffer size for `ScriptProcessorNode`.
   */
  constructor(context: AudioContext, bufferSize: ScriptProcessorNodeBufferSize) {
    this.init(context, bufferSize);
  }

  /** @abstract */
  public setup(): SoundModule {
    return this;
  }

  /** @abstract */
  public ready(): SoundModule {
    return this;
  }

  /** @abstract */
  public start(): SoundModule {
    return this;
  }

  /** @abstract */
  public stop(): SoundModule {
    return this;
  }

  /**
   * This method is getter or setter for parameters.
   * @param {string} key This argument is property name.
   * @param {number} value This argument is the value of designated property. If this argument is omitted, This method is getter.
   * @return {number} This is returned as the value of designated property in the case of getter.
   */
  public param(key: 'mastervolume', value: number): number | void {
    if (this.mastervolume === null) {
      return;
    }

    switch (key) {
      case 'mastervolume':
        if (value === undefined) {
          return this.mastervolume.gain.value;
        }

        this.mastervolume.gain.value = value;

        break;
      default:
        break;
    }
  }

  /** @abstract */
  public get(): SoundModule {
    return this;
  }

  /**
   * This method changes buffer size for `ScriptProcessorNode`.
   * @param {number} bufferSize This argument is buffer size for `ScriptProcessorNode`.
   *     This value is one of 0, 256, 512, 1024, 2048, 4096, 8192, 16384.
   * @return {SoundModule} This is returned for method chain.
   */
  public resize(bufferSize: ScriptProcessorNodeBufferSize): SoundModule {
    if (this.context) {
      this.init(this.context, bufferSize);
    }

    return this;
  }

  /**
   * This method gets buffer size for `ScriptProcessorNode`.
   * @return {number} This is returned as buffer size for `ScriptProcessorNode`.
   */
  public getBufferSize(): number {
    if (this.processor) {
      return this.processor.bufferSize;
    }

    return 0;
  }

  /**
   * This method installs customized effector.
   * @param {string} name This argument is in order to select effector.
   * @param {Effector} effector This argument is the subclass that extends `Effector` class.
   * @return {SoundModule} This is returned for method chain.
   */
  /*
    install(name, effector) {
        if (!(effector instanceof Effector)) {
            return this;
        }

        if (String(name) in this) {
            return this;
        }

        this[name] = effector;

        if (this.modules.every(module => module !== effector)) {
            this.modules.push(effector);
        }

        return this;
    }
    */

  /**
   * This method gets the instance of module that is defined by this library. This method enables to access the instance of module by unified call.
   * @param {string} module This argument is module's name.
   * @return {Analyser|Recorder|Session|Effector|Listener|EnvelopeGenerator|Glide|VocalCanceler|NoiseGate|NoiseSuppressor} This value is the instance of module.
   */
  public module() {
  }

  /**
   * This method gets effector's parameters as associative array.
   * @return {object}
   */
  public params() {
  }

  /**
   * This method gets effector's parameters as JSON.
   * @return {string}
   */
  public toJSON(): string {
    return JSON.stringify(this.params());
  }

  /** @override */
  public toString(): string {
    return '[SoundModule]';
  }

  /**
   * This method connects nodes that are defined by this library and Web Audio API.
   * @param {AudioNode} source This argument is `AudioNode` for input of sound.
   * @param {Array.<Effector>} connects This argument is array for changing the default connection.
   * @return {SoundModule} This is returned for method chain.
   */
  protected connect(): SoundModule {
    return this;
  }

  /**
   * This method starts effectors.
   * @param {number} startTime This argument is used for scheduling parameter.
   * @return {SoundModule} This is returned for method chain.
   */
  protected on(): SoundModule {
    if (this.context === null) {
      return this;
    }

    return this;
  }

  /**
   * This method stops effectors.
   * @param {number} stopTime This argument is used for scheduling parameter.
   * @return {SoundModule} This is returned for method chain.
   */
  protected off(): SoundModule {
    return this;
  }

  /**
   * This method initials modules.
   * @param {AudioContext} context This argument is in order to use the interfaces of Web Audio API.
   * @param {number} bufferSize This argument is buffer size for `ScriptProcessorNode`.
   *     However, the opportunity for designating buffer size is not so much.
   *     The reason why is that the constructor of `SoundModule` selects buffer size automaticly.
   *     This buffer size can be changed explicitly by calling `resize` method.
   */
  private init(context: AudioContext, bufferSize: ScriptProcessorNodeBufferSize): void {
    if (this.mastervolume && this.processor) {
      this.mastervolume.disconnect(0);
      this.mastervolume = null;

      this.processor.disconnect(0);
      this.processor = null;
    }

    this.context = context;

    this.mastervolume = context.createGain();
    this.processor    = context.createScriptProcessor(bufferSize, SoundModule.NUMBER_OF_INPUTS, SoundModule.NUMBER_OF_OUTPUTS);
  }
}
