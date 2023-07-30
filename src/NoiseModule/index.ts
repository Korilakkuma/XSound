import { SoundModule, SoundModuleParams, Module, ModuleName } from '/src/SoundModule';
import { NoiseModuleProcessor } from '/src/NoiseModule/NoiseModuleProcessor';
import { Analyser } from '/src/SoundModule/Analyser';
import { Recorder } from '/src/SoundModule/Recorder';
import { Autopanner } from '/src/SoundModule/Effectors/Autopanner';
import { BitCrusher } from '/src/SoundModule/Effectors/BitCrusher';
import { Chorus } from '/src/SoundModule/Effectors/Chorus';
import { Compressor } from '/src/SoundModule/Effectors/Compressor';
import { Delay } from '/src/SoundModule/Effectors/Delay';
import { EnvelopeGenerator } from '/src/SoundModule/Effectors/EnvelopeGenerator';
import { Equalizer } from '/src/SoundModule/Effectors/Equalizer';
import { Filter } from '/src/SoundModule/Effectors/Filter';
import { Flanger } from '/src/SoundModule/Effectors/Flanger';
import { Fuzz } from '/src/SoundModule/Effectors/Fuzz';
import { Listener } from '/src/SoundModule/Effectors/Listener';
import { NoiseGate } from '/src/SoundModule/Effectors/NoiseGate';
import { NoiseSuppressor } from '/src/SoundModule/Effectors/NoiseSuppressor';
import { OverDrive } from '/src/SoundModule/Effectors/OverDrive';
import { Panner } from '/src/SoundModule/Effectors/Panner';
import { Phaser } from '/src/SoundModule/Effectors/Phaser';
import { PitchShifter } from '/src/SoundModule/Effectors/PitchShifter';
import { Preamp } from '/src/SoundModule/Effectors/Preamp';
import { Reverb } from '/src/SoundModule/Effectors/Reverb';
import { Ringmodulator } from '/src/SoundModule/Effectors/Ringmodulator';
import { Stereo } from '/src/SoundModule/Effectors/Stereo';
import { Tremolo } from '/src/SoundModule/Effectors/Tremolo';
import { VocalCanceler } from '/src/SoundModule/Effectors/VocalCanceler';
import { Wah } from '/src/SoundModule/Effectors/Wah';

export type NoiseType = 'whitenoise' | 'pinknoise' | 'browniannoise';

export type NoiseModuleParams = SoundModuleParams & {
  type?: NoiseType
};

export { NoiseModuleProcessor };

/**
 * This subclass is for generating noise.
 * @constructor
 * @extends {SoundModule}
 */
export class NoiseModule extends SoundModule {
  private type: NoiseType = 'whitenoise';

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   */
  constructor(context: AudioContext) {
    super(context);

    this.processor = new AudioWorkletNode(context, NoiseModuleProcessor.name);

    this.envelopegenerator.setGenerator(0);
  }

  /**
   * This method defines noop for the same API.
   */
  public setup(): NoiseModule {
    // Noop
    return this;
  }

  /**
   * This method defines noop for the same API.
   */
  public ready(): NoiseModule {
    // Noop
    return this;
  }

  /**
   * This method starts noise.
   * @return {NoiseModule} Return value is for method chain.
   */
  public start(): NoiseModule {
    const startTime = this.context.currentTime;

    if (!this.mixed) {
      // AudioWorkletNode (Input) -> GainNode (Envelope Generator)
      const generator = this.envelopegenerator.getGenerator(0);

      if (generator) {
        this.connect(generator);
      }
    }

    this.envelopegenerator.ready(0, this.processor, null);

    this.envelopegenerator.start(startTime);

    if (!this.runningAnalyser) {
      this.analyser.start('time');
      this.analyser.start('fft');
      this.runningAnalyser = true;
    }

    this.on(startTime);

    return this;
  }

  /**
   * This method stops noise.
   * @return {NoiseModule} Return value is for method chain.
   */
  public stop(): NoiseModule {
    const stopTime = this.context.currentTime;

    // Attack or Decay or Sustain -> Release
    this.envelopegenerator.stop(stopTime);

    this.off(stopTime);

    return this;
  }

  /**
   * This method gets or sets parameters for noise module.
   * @param {keyof NoiseModuleParams|NoiseModuleParams} params This argument is string if getter. Otherwise, setter.
   * @return {NoiseModuleParams[keyof NoiseModuleParams]|NoiseModule} Return value is parameter for noise module if getter.
   *     Otherwise, return value is for method chain.
   */
  public param(params: 'mastervolume'): number;
  public param(params: 'type'): NoiseType;
  public param(params: NoiseModuleParams): NoiseModule;
  public param(params: keyof NoiseModuleParams | NoiseModuleParams): NoiseModuleParams[keyof NoiseModuleParams] | NoiseModule {
    if (typeof params === 'string') {
      switch (params) {
        case 'mastervolume':
          return this.mastervolume.gain.value;
        case 'type':
          return this.type;
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
        case 'type':
          if (typeof value === 'string') {
            this.type = value;

            const message: NoiseModuleParams = { type: value };

            this.processor.port.postMessage(message);
          }

          break;
        default:
          break;
      }
    }

    return this;
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
  public override disconnect() {
    const generator = this.envelopegenerator.getGenerator(0);

    if (generator) {
      generator.disconnect(0);
    }
  }

  /** @override */
  public override on(startTime?: number): NoiseModule {
    super.on(startTime);
    return this;
  }

  /** @override */
  public override off(stopTime?: number): NoiseModule {
    super.off(stopTime);
    return this;
  }

  /** @override */
  public override suspend(): NoiseModule {
    super.suspend();
    return this;
  }

  /** @override */
  public override mix(): NoiseModule {
    super.mix();
    return this;
  }

  /** @override */
  public override demix(): NoiseModule {
    super.demix();
    return this;
  }

  /**
   * This method gets noise module parameters as associative array.
   * @return {NoiseModuleParams}
   * @override
   */
  public override params(): Required<NoiseModuleParams> {
    const params = super.params();

    return {
      ...params,
      type: this.type
    };
  }

  /** @override */
  public override get INPUT(): GainNode | null {
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
