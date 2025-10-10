import type { Module, ModuleName } from '../SoundModule';
import type { Analyser } from '../SoundModule/Analyser';
import type { Recorder } from '../SoundModule/Recorder';
import type { Autopanner } from '../SoundModule/Effectors/Autopanner';
import type { BitCrusher } from '../SoundModule/Effectors/BitCrusher';
import type { Chorus } from '../SoundModule/Effectors/Chorus';
import type { Compressor } from '../SoundModule/Effectors/Compressor';
import type { Delay } from '../SoundModule/Effectors/Delay';
import type { EnvelopeGenerator } from '../SoundModule/Effectors/EnvelopeGenerator';
import type { Equalizer } from '../SoundModule/Effectors/Equalizer';
import type { Filter } from '../SoundModule/Effectors/Filter';
import type { Flanger } from '../SoundModule/Effectors/Flanger';
import type { Fuzz } from '../SoundModule/Effectors/Fuzz';
import type { Listener } from '../SoundModule/Effectors/Listener';
import type { NoiseGate } from '../SoundModule/Effectors/NoiseGate';
import type { NoiseSuppressor } from '../SoundModule/Effectors/NoiseSuppressor';
import type { OverDrive } from '../SoundModule/Effectors/OverDrive';
import type { Panner } from '../SoundModule/Effectors/Panner';
import type { Phaser } from '../SoundModule/Effectors/Phaser';
import type { PitchShifter } from '../SoundModule/Effectors/PitchShifter';
import type { Preamp } from '../SoundModule/Effectors/Preamp';
import type { Reverb } from '../SoundModule/Effectors/Reverb';
import type { Ringmodulator } from '../SoundModule/Effectors/Ringmodulator';
import type { Stereo } from '../SoundModule/Effectors/Stereo';
import type { Tremolo } from '../SoundModule/Effectors/Tremolo';
import type { VocalCanceler } from '../SoundModule/Effectors/VocalCanceler';
import type { Wah } from '../SoundModule/Effectors/Wah';

import { SoundModule } from '../SoundModule';

/**
 * This subclass is for using `AudioWorkletNode` as sound source.
 */
export class ProcessorModule extends SoundModule {
  private processorName = '';
  private options: AudioWorkletNodeOptions = {};
  private moduleURL = '';

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   */
  constructor(context: AudioContext) {
    super(context);

    this.envelopegenerator.setGenerator(0);
  }

  /**
   * This method sets registered processor name and options for `AudioWorkletNode` constructor.
   * @param {string} processorName This argument is name of `AudioWorkletProcessor`.
   * @param {AudioWorkletNodeOptions} options This argument is object based on `AudioWorkletNodeOptions` dictionary.
   * @return {ProcessorModule} Return value is for method chain.
   */
  public setup(processorName: string, options?: AudioWorkletNodeOptions): ProcessorModule {
    this.processorName = processorName;
    this.options       = options ?? {};

    return this;
  }

  /**
   * This method adds module for AudioWorklet and creates instance of `AudioWorkletNode`.
   * @param {string} moduleURL This argument is string that contains URL of file (.js) with module to add.
   * @param {WorkletOptions} options This argument is one of 'omit', 'same-origin', 'include'. The default value is 'same-origin'.
   * @return {Promise<void>} Return value is `Promise` that `addModule` returns.
   */
  public ready(moduleURL: string, options?: WorkletOptions): Promise<void> {
    this.moduleURL = moduleURL;

    return this.context.audioWorklet.addModule(this.moduleURL, options ?? { credentials: 'same-origin' })
      .then(() => {
        this.processor = new AudioWorkletNode(this.context, this.processorName, this.options);
      });
  }

  /**
   * This method starts sound by connecting to `AudioDestinationNode`.
   * @return {ProcessorModule} Return value is for method chain.
   */
  public start(): ProcessorModule {
    const generator = this.envelopegenerator.getGenerator(0);

    if (generator === null) {
      return this;
    }

    const startTime = this.context.currentTime;

    if (!this.mixed) {
      // Clear previous
      this.envelopegenerator.clear(true);
      this.processor.disconnect(0);

      // GainNode (Envelope Generator) -> ... -> AudioDestinationNode (Output)
      this.connect(generator);
    }

    // AudioWorkletNode (Input) -> GainNode (Envelope Generator)
    this.envelopegenerator.ready(0, this.processor, null);

    this.envelopegenerator.start(startTime);

    if (!this.runningAnalyser) {
      this.analyser.start('time', 0);
      this.analyser.start('time', 1);
      this.analyser.start('fft', 0);
      this.analyser.start('fft', 1);
      this.analyser.start('spectrogram', 0);
      this.analyser.start('spectrogram', 1);

      this.runningAnalyser = true;
    }

    this.on(startTime);

    return this;
  }

  /**
   * This method stops sound by disconnecting to `AudioDestinationNode`.
   * @return {ProcessorModule} Return value is for method chain.
   */
  public stop(): ProcessorModule {
    const stopTime = this.context.currentTime;

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
    this.processor.port.postMessage(data);

    return this;
  }

  /**
   * This method sets event handler that is invoked on receiving message.
   * @param {function} callback This argument is invoked on receiving message.
   * @return {ProcessorModule} Return value is for method chain.
   */
  public onMessage(callback: (event: MessageEvent) => void): ProcessorModule {
    this.processor.port.onmessage = callback;

    return this;
  }

  /**
   * This method sets event handler that is invoked on receiving message that cannot be deserialized.
   * @param {function} callback This argument is invoked on receiving message that cannot be deserialized.
   * @return {ProcessorModule} Return value is for method chain.
   */
  public onMessageError(callback: (event: MessageEvent) => void): ProcessorModule {
    this.processor.port.onmessageerror = callback;

    return this;
  }

  /**
   * This method gets map based on `AudioParamMap`.
   * @return {AudioParamMap|null}
   */
  public map(): AudioParamMap {
    return this.processor.parameters;
  }

  /**
   * This method gets instance of `AudioWorkletNode`.
   * @return {AudioWorkletNode|null}
   */
  public get(): AudioWorkletNode {
    return this.processor;
  }

  /**
   * This method gets instance of `Module` (Analyser, Recorder, Effector ... etc).
   * @param {ModuleName} moduleName This argument selects module.
   * @return {Module}
   */
  public module(moduleName: 'analyser'): Analyser;
  public module(moduleName: 'recorder'): Recorder;
  public module(moduleName: 'autopanner'): Autopanner;
  public module(moduleName: 'bitcrusher'): BitCrusher;
  public module(moduleName: 'chorus'): Chorus;
  public module(moduleName: 'compressor'): Compressor;
  public module(moduleName: 'delay'): Delay;
  public module(moduleName: 'envelopegenerator'): EnvelopeGenerator;
  public module(moduleName: 'equalizer'): Equalizer;
  public module(moduleName: 'filter'): Filter;
  public module(moduleName: 'flanger'): Flanger;
  public module(moduleName: 'fuzz'): Fuzz;
  public module(moduleName: 'listener'): Listener;
  public module(moduleName: 'noisegate'): NoiseGate;
  public module(moduleName: 'noisesuppressor'): NoiseSuppressor;
  public module(moduleName: 'overdrive'): OverDrive;
  public module(moduleName: 'panner'): Panner;
  public module(moduleName: 'phaser'): Phaser;
  public module(moduleName: 'pitchshifter'): PitchShifter;
  public module(moduleName: 'preamp'): Preamp;
  public module(moduleName: 'reverb'): Reverb;
  public module(moduleName: 'ringmodulator'): Ringmodulator;
  public module(moduleName: 'stereo'): Stereo;
  public module(moduleName: 'tremolo'): Tremolo;
  public module(moduleName: 'vocalcanceler'): VocalCanceler;
  public module(moduleName: 'wah'): Wah;
  public module(moduleName: ModuleName): Module {
    switch (moduleName) {
      case 'analyser': {
        return this.analyser;
      }

      case 'recorder': {
        return this.recorder;
      }

      case 'autopanner': {
        return this.autopanner;
      }

      case 'bitcrusher': {
        return this.bitcrusher;
      }

      case 'chorus': {
        return this.chorus;
      }

      case 'compressor': {
        return this.compressor;
      }

      case 'delay': {
        return this.delay;
      }

      case 'envelopegenerator': {
        return this.envelopegenerator;
      }

      case 'equalizer': {
        return this.equalizer;
      }

      case 'filter': {
        return this.filter;
      }

      case 'flanger': {
        return this.flanger;
      }

      case 'fuzz': {
        return this.fuzz;
      }

      case 'listener': {
        return this.listener;
      }

      case 'noisegate': {
        return this.noisegate;
      }

      case 'noisesuppressor': {
        return this.noisesuppressor;
      }

      case 'overdrive': {
        return this.overdrive;
      }

      case 'panner': {
        return this.panner;
      }

      case 'phaser': {
        return this.phaser;
      }

      case 'pitchshifter': {
        return this.pitchshifter;
      }

      case 'preamp': {
        return this.preamp;
      }

      case 'reverb': {
        return this.reverb;
      }

      case 'ringmodulator': {
        return this.ringmodulator;
      }

      case 'stereo': {
        return this.stereo;
      }

      case 'tremolo': {
        return this.tremolo;
      }

      case 'vocalcanceler': {
        return this.vocalcanceler;
      }

      case 'wah': {
        return this.wah;
      }
    }
  }

  /** @override */
  public override suspend() {
    super.suspend();

    const generator = this.envelopegenerator.getGenerator(0);

    if (this.processor && generator) {
      generator.disconnect(0);
      this.processor.connect(generator);
    }

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
