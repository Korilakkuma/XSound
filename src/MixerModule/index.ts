import { SoundModule, SoundModuleParams, Module, ModuleName } from '../SoundModule';
import { MixerModuleProcessor } from './MixerModuleProcessor';
import { Analyser } from '../SoundModule/Analyser';
import { Recorder } from '../SoundModule/Recorder';
import { Autopanner } from '../SoundModule/Effectors/Autopanner';
import { BitCrusher } from '../SoundModule/Effectors/BitCrusher';
import { Chorus } from '../SoundModule/Effectors/Chorus';
import { Compressor } from '../SoundModule/Effectors/Compressor';
import { Delay } from '../SoundModule/Effectors/Delay';
import { EnvelopeGenerator } from '../SoundModule/Effectors/EnvelopeGenerator';
import { Equalizer } from '../SoundModule/Effectors/Equalizer';
import { Filter } from '../SoundModule/Effectors/Filter';
import { Flanger } from '../SoundModule/Effectors/Flanger';
import { Fuzz } from '../SoundModule/Effectors/Fuzz';
import { Listener } from '../SoundModule/Effectors/Listener';
import { NoiseGate } from '../SoundModule/Effectors/NoiseGate';
import { NoiseSuppressor } from '../SoundModule/Effectors/NoiseSuppressor';
import { OverDrive } from '../SoundModule/Effectors/OverDrive';
import { Panner } from '../SoundModule/Effectors/Panner';
import { Phaser } from '../SoundModule/Effectors/Phaser';
import { PitchShifter } from '../SoundModule/Effectors/PitchShifter';
import { Preamp } from '../SoundModule/Effectors/Preamp';
import { Reverb } from '../SoundModule/Effectors/Reverb';
import { Ringmodulator } from '../SoundModule/Effectors/Ringmodulator';
import { Stereo } from '../SoundModule/Effectors/Stereo';
import { Tremolo } from '../SoundModule/Effectors/Tremolo';
import { VocalCanceler } from '../SoundModule/Effectors/VocalCanceler';
import { Wah } from '../SoundModule/Effectors/Wah';

export { MixerModuleProcessor };

/**
 * This class is for mixing sound sources (instance of `SoundModule` subclass).
 * @constructor
 * @extends {SoundModule}
 */
export class MixerModule extends SoundModule {
  private sources: SoundModule[] = [];
  private gainNodes: GainNode[] = [];

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   */
  constructor(context: AudioContext) {
    super(context);

    this.processor = new AudioWorkletNode(context, MixerModuleProcessor.name);
  }

  /**
   * This method defines noop for the same API.
   */
  public setup(): MixerModule {
    // Noop
    return this;
  }

  /**
   * This method defines noop for the same API.
   */
  public ready(): MixerModule {
    // Noop
    return this;
  }

  /**
   * This method mixes sound sources (instance of `SoundModule` subclass).
   * @param {Array<SoundModule>} sources This argument is array that contains sound sources.
   * @param {Array<number>} gains This argument is array for each sound source volume.
   * @return {MixerModule} Return value is for method chain.
   */
  public start(sources: SoundModule[], gains?: number[]): MixerModule {
    this.sources = sources;

    for (let i = 0, len = this.sources.length; i < len; i++) {
      const source = this.sources[i];

      const stopTime = this.context.currentTime;

      source.off(stopTime);
      source.suspend();
      source.mix();

      if (source.INPUT) {
        this.gainNodes[i] = this.context.createGain();

        this.gainNodes[i].gain.value = gains ? gains[i] : 1;

        // Disconnect each connection to `AudioDestinationNode`
        source.disconnect();

        // AudioWorkletNode (each sound source) -> GainNode (each sound source volume) -> AudioWorkletNode (Mix sound sources)
        source.INPUT.connect(this.gainNodes[i]);
        this.gainNodes[i].connect(this.processor);
      }
    }

    // (... ->) AudioWorkletNode (Mix sound sources) -> ... -> AudioDestinationNode (Output)
    this.connect(this.processor);

    const startTime = this.context.currentTime;

    this.on(startTime);

    if (!this.runningAnalyser) {
      this.analyser.start('time');
      this.analyser.start('fft');
      this.runningAnalyser = true;
    }

    return this;
  }

  /**
   * This method demixes sound sources (instance of `SoundModule` subclass).
   * @return {MixerModule} Return value is for method chain.
   */
  public stop(): MixerModule {
    const stopTime = this.context.currentTime;

    this.off(stopTime);
    this.suspend();

    // Revert connection
    for (const source of this.sources) {
      source.demix();

      if (source.INPUT) {
        source.disconnect();
        source.connect(source.INPUT);
      }
    }

    for (const gainNode of this.gainNodes) {
      gainNode.disconnect(0);
    }

    return this;
  }

  /**
   * This method gets or sets parameters for mixer module.
   * This method is overloaded for type interface and type check.
   * @param {keyof SoundModuleParams|SoundModuleParams} params This argument is string if getter. Otherwise, setter.
   * @return {SoundModuleParams[keyof SoundModuleParams]|MixerModule} Return value is parameter for mixer module if getter.
   *     Otherwise, return value is for method chain.
   */
  public param(params: 'mastervolume'): number;
  public param(params: SoundModuleParams): MixerModule;
  public param(params: keyof SoundModuleParams | SoundModuleParams): SoundModuleParams[keyof SoundModuleParams] | MixerModule {
    if (typeof params === 'string') {
      switch (params) {
        case 'mastervolume':
          return this.mastervolume.gain.value;
        default:
          return this;
      }
    }

    for (const [key, value] of Object.entries(params)) {
      switch (key) {
        case 'mastervolume':
          if (typeof value === 'number') {
            this.mastervolume.gain.value = value;
          }

          break;
        default:
          break;
      }
    }

    return this;
  }

  /**
   * This method gets array that contains instance of `SoundModule` subclass.
   * @return {Array<SoundModule>}
   */
  public get(): SoundModule[] {
    return this.sources;
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
  public module(moduleName: ModuleName): Module | null {
    switch (moduleName) {
      case 'analyser':
        return this.analyser;
      case 'recorder':
        return this.recorder;
      case 'autopanner':
        return this.autopanner;
      case 'bitcrusher':
        return this.bitcrusher;
      case 'chorus':
        return this.chorus;
      case 'compressor':
        return this.compressor;
      case 'delay':
        return this.delay;
      case 'envelopegenerator':
        return this.envelopegenerator;
      case 'equalizer':
        return this.equalizer;
      case 'filter':
        return this.filter;
      case 'flanger':
        return this.flanger;
      case 'fuzz':
        return this.fuzz;
      case 'listener':
        return this.listener;
      case 'noisegate':
        return this.noisegate;
      case 'noisesuppressor':
        return this.noisesuppressor;
      case 'overdrive':
        return this.overdrive;
      case 'panner':
        return this.panner;
      case 'phaser':
        return this.phaser;
      case 'pitchshifter':
        return this.pitchshifter;
      case 'preamp':
        return this.preamp;
      case 'reverb':
        return this.reverb;
      case 'ringmodulator':
        return this.ringmodulator;
      case 'stereo':
        return this.stereo;
      case 'tremolo':
        return this.tremolo;
      case 'vocalcanceler':
        return this.vocalcanceler;
      case 'wah':
        return this.wah;
      default:
        return null;
    }
  }

  /** @override */
  public override on(startTime?: number): MixerModule {
    super.on(startTime);
    return this;
  }

  /** @override */
  public override off(stopTime?: number): MixerModule {
    super.off(stopTime);
    return this;
  }

  /** @override */
  public override suspend(): MixerModule {
    super.suspend();
    return this;
  }

  /** @override */
  public override mix(): MixerModule {
    super.mix();
    return this;
  }

  /** @override */
  public override demix(): MixerModule {
    super.demix();
    return this;
  }

  /** @override */
  public override get INPUT(): AudioWorkletNode {
    return this.processor;
  }

  /** @override */
  public override get OUTPUT(): GainNode {
    return this.mastervolume;
  }
}
