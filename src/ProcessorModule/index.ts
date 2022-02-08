import { BufferSize } from '../types';
import { SoundModule, Module, ModuleName } from '../SoundModule';
import { Analyser } from '../SoundModule/Analyser';
import { Recorder } from '../SoundModule/Recorder';
import { Session } from '../SoundModule/Session';
import { Autopanner } from '../SoundModule/Effectors/Autopanner';
import { Chorus } from '../SoundModule/Effectors/Chorus';
import { Compressor } from '../SoundModule/Effectors/Compressor';
import { Delay } from '../SoundModule/Effectors/Delay';
import { Distortion } from '../SoundModule/Effectors/Distortion';
import { EnvelopeGenerator } from '../SoundModule/Effectors/EnvelopeGenerator';
import { Equalizer } from '../SoundModule/Effectors/Equalizer';
import { Filter } from '../SoundModule/Effectors/Filter';
import { Flanger } from '../SoundModule/Effectors/Flanger';
import { Listener } from '../SoundModule/Effectors/Listener';
import { Panner } from '../SoundModule/Effectors/Panner';
import { Phaser } from '../SoundModule/Effectors/Phaser';
import { PitchShifter } from '../SoundModule/Effectors/PitchShifter';
import { Reverb } from '../SoundModule/Effectors/Reverb';
import { Ringmodulator } from '../SoundModule/Effectors/Ringmodulator';
import { Stereo } from '../SoundModule/Effectors/Stereo';
import { Tremolo } from '../SoundModule/Effectors/Tremolo';
import { Wah } from '../SoundModule/Effectors/Wah';

export class ProcessorModule extends SoundModule {
  private worklet: AudioWorkletNode | ScriptProcessorNode | null = null;
  private workletName = '';
  private options: AudioWorkletNodeOptions = {};
  private moduleURL = '';

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

    if (!this.mixed) {
      // Clear previous
      this.envelopegenerator.clear(true);
      this.worklet.disconnect(0);

      if (this.worklet instanceof ScriptProcessorNode) {
        this.worklet.onaudioprocess = null;
      }

      // GainNode (Envelope Generator) -> ... -> AudioDestinationNode (Output)
      this.connect(generator);
    }

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

    if (!this.mixed) {
      this.worklet.disconnect(0);
    }

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

  /**
   * This method gets instance of `Module` (Analyser, Recorder, Effector ... etc).
   * @param {ModuleName} moduleName This argument selects module.
   * @return {Module}
   */
  public module(moduleName: 'analyser'): Analyser;
  public module(moduleName: 'recorder'): Recorder;
  public module(moduleName: 'session'): Session;
  public module(moduleName: 'autopanner'): Autopanner;
  public module(moduleName: 'chorus'): Chorus;
  public module(moduleName: 'compressor'): Compressor;
  public module(moduleName: 'delay'): Delay;
  public module(moduleName: 'distortion'): Distortion;
  public module(moduleName: 'equalizer'): Equalizer;
  public module(moduleName: 'filter'): Filter;
  public module(moduleName: 'flanger'): Flanger;
  public module(moduleName: 'listener'): Listener;
  public module(moduleName: 'panner'): Panner;
  public module(moduleName: 'phaser'): Phaser;
  public module(moduleName: 'pitchshifter'): PitchShifter;
  public module(moduleName: 'reverb'): Reverb;
  public module(moduleName: 'ringmodulator'): Ringmodulator;
  public module(moduleName: 'stereo'): Stereo;
  public module(moduleName: 'tremolo'): Tremolo;
  public module(moduleName: 'wah'): Wah;
  public module(moduleName: 'envelopegenerator'): EnvelopeGenerator;
  public module(moduleName: ModuleName): Module | null {
    switch (moduleName) {
      case 'analyser':
        return this.analyser;
      case 'recorder':
        return this.recorder;
      case 'session':
        return this.session;
      case 'autopanner':
        return this.autopanner;
      case 'chorus':
        return this.chorus;
      case 'compressor':
        return this.compressor;
      case 'delay':
        return this.delay;
      case 'distortion':
        return this.distortion;
      case 'equalizer':
        return this.equalizer;
      case 'filter':
        return this.filter;
      case 'flanger':
        return this.flanger;
      case 'listener':
        return this.listener;
      case 'panner':
        return this.panner;
      case 'phaser':
        return this.phaser;
      case 'pitchshifter':
        return this.pitchshifter;
      case 'reverb':
        return this.reverb;
      case 'ringmodulator':
        return this.ringmodulator;
      case 'stereo':
        return this.stereo;
      case 'tremolo':
        return this.tremolo;
      case 'wah':
        return this.wah;
      case 'envelopegenerator':
        return this.envelopegenerator;
      default:
        return null;
    }
  }

  /** @override */
  public override resize(bufferSize: BufferSize): ProcessorModule {
    super.init(this.context, bufferSize);
    return this;
  }

  /** @override */
  public override on(startTime?: number): ProcessorModule {
    super.on(startTime);
    return this;
  }

  /** @override */
  public override off(stopTime?: number): ProcessorModule {
    super.off(stopTime);
    return this;
  }

  /** @override */
  public override suspend(): ProcessorModule {
    super.suspend();

    const generator = this.envelopegenerator.getGenerator(0);

    if (this.worklet && generator) {
      generator.disconnect(0);
      this.worklet.connect(generator);
    }

    return this;
  }

  /** @override */
  public override mix(): ProcessorModule {
    super.mix();
    return this;
  }

  /** @override */
  public override demix(): ProcessorModule {
    super.demix();
    return this;
  }

  /** @override */
  public override get INPUT(): GainNode |  null {
    const generator = this.envelopegenerator.getGenerator(0);

    if (generator) {
      return generator;
    }

    return null;
  }

  /** @override */
  public override get OUTPUT(): GainNode {
    return this.mastervolume;
  }
}
