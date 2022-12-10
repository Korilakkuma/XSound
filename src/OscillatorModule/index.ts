import { BufferSize } from '../types';
import { SoundModule, SoundModuleParams, Module, ModuleName } from '../SoundModule';
import { Analyser } from '../SoundModule/Analyser';
import { Recorder } from '../SoundModule/Recorder';
import { Session } from '../SoundModule/Session';
import { Autopanner } from '../SoundModule/Effectors/Autopanner';
import { BitCrusher } from '../SoundModule/Effectors/BitCrusher';
import { Chorus } from '../SoundModule/Effectors/Chorus';
import { Compressor } from '../SoundModule/Effectors/Compressor';
import { Delay } from '../SoundModule/Effectors/Delay';
import { Distortion } from '../SoundModule/Effectors/Distortion';
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
import { Reverb } from '../SoundModule/Effectors/Reverb';
import { Ringmodulator } from '../SoundModule/Effectors/Ringmodulator';
import { Stereo } from '../SoundModule/Effectors/Stereo';
import { Tremolo } from '../SoundModule/Effectors/Tremolo';
import { VocalCanceler } from '../SoundModule/Effectors/VocalCanceler';
import { Wah } from '../SoundModule/Effectors/Wah';
import { Glide, GlideParams, GlideType } from './Glide';
import { Oscillator, OscillatorParams, OscillatorCustomType } from './Oscillator';

export type {
  Glide,
  GlideParams,
  GlideType,
  Oscillator,
  OscillatorParams,
  OscillatorCustomType
};

export type OscillatorModuleParams = SoundModuleParams & {
  oscillator?: {
    glide: GlideParams,
    params: OscillatorParams[]
  }
};

/**
 * This class manages instances of `Oscillator` for creating sound.
 * @constructor
 * @extends {SoundModule}
 */
export class OscillatorModule extends SoundModule {
  private sources: Oscillator[] = [];
  private glide: Glide;

  private startTime = 0;
  private duration = 0;

  /**
   * @param {AudioContext} context This argument is in order to use the interfaces of Web Audio API.
   * @param {BufferSize} bufferSize This argument is buffer size for `ScriptProcessorNode`.
   */
  constructor(context: AudioContext, bufferSize: BufferSize) {
    super(context, bufferSize);

    this.glide = new Glide(context);
  }

  /**
   * This method creates instances of `Oscillator`.
   * @param {Array<boolean>} states This argument is array that contains initial state in instance of `Oscillator`.
   * @return {OscillatorModule} Return value is for method chain.
   */
  public setup(states: boolean[]): OscillatorModule {
    // Clear
    this.sources.length = 0;

    for (let i = 0, len = states.length; i < len; i++) {
      this.sources[i] = new Oscillator(this.context, states[i]);
      this.envelopegenerator.setGenerator(i);
    }

    return this;
  }

  /**
   * This method schedules the time of start and stop.
   * @param {number} startTime This argument is start time. The default value is `currentTime` in instance of `AudioContext`
   * @param {number} duration This argument is duration. The default value is 0.
   * @return {OscillatorModule} Return value is for method chain.
   */
  public ready(startTime?: number, duration?: number): OscillatorModule {
    this.startTime = startTime ?? this.context.currentTime;
    this.duration  = duration ?? 0;

    this.envelopegenerator.clear(true);

    return this;
  }

  /**
   * This method starts some sounds that are active at the same time.
   * @param {Array<number>} frequencies This argument each oscillator frequency. The default value is 0 Hz.
   * @return {OscillatorModule} Return value is for method chain.
   */
  public start(frequencies: number[]): OscillatorModule {
    const startTime = this.context.currentTime + this.startTime;

    if (!this.mixed) {
      // Clear previous
      this.envelopegenerator.clear(true);
      this.processor.disconnect(0);
      this.processor.onaudioprocess = null;

      // ScriptProcessorNode (Mix oscillators) -> ... -> AudioDestinationNode (Output)
      this.connect(this.processor);
    }

    for (let i = 0, len = frequencies.length; i < len; i++) {
      if (i >= this.sources.length) {
        break;
      }

      const oscillator = this.sources[i];
      const frequency  = frequencies[i];

      // GainNode (Volume) -> ScriptProcessorNode (Mix oscillators)
      oscillator.ready(this.processor);

      // OscillatorNode (Input) -> GainNode (Envelope Generator) -> GainNode (Volume)
      this.envelopegenerator.ready(i, oscillator.INPUT, oscillator.OUTPUT);

      this.glide.ready(frequency);
      this.glide.start(oscillator.INPUT, startTime);

      oscillator.start(startTime);
    }

    // Attack -> Decay -> Sustain
    this.envelopegenerator.start(startTime);

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

      // Stop ?
      if (this.envelopegenerator.paused()) {
        // Stop
        const stopTime = this.context.currentTime;

        for (const source of this.sources) {
          source.stop(stopTime);
        }

        this.off(stopTime);

        this.analyser.stop('time');
        this.analyser.stop('fft');
        this.runningAnalyser = false;

        if (!this.mixed) {
          // Stop `onaudioprocess` event
          this.processor.disconnect(0);
          this.processor.onaudioprocess = null;
        }
      } else {
        outputLs.set(inputLs);
        outputRs.set(inputRs);
      }
    };

    return this;
  }

  /**
   * This method stops active sounds.
   * @return {OscillatorModule} Return value is for method chain.
   */
  public stop(): OscillatorModule {
    const stopTime = this.context.currentTime + this.startTime + this.duration;

    // Attack or Decay or Sustain -> Release
    this.envelopegenerator.stop(stopTime, false);

    this.glide.stop();
    this.filter.stop(stopTime);

    return this;
  }

  /**
   * This method gets or sets parameters for oscillator module.
   * This method is overloaded for type interface and type check.
   * @param {keyof OscillatorModuleParams|OscillatorModuleParams} params This argument is string if getter. Otherwise, setter.
   * @return {OscillatorModuleParams[keyof OscillatorModuleParams]|OscillatorModule} Return value is parameter for oscillator module if getter.
   *     Otherwise, return value is for method chain.
   */
  public param(params: 'mastervolume'): number;
  public param(params: OscillatorModuleParams): OscillatorModule;
  public param(params: keyof OscillatorModuleParams | OscillatorModuleParams): OscillatorModuleParams[keyof OscillatorModuleParams] | OscillatorModule {
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
   * This method gets instance of `Oscillator` or array that contains the all of `Oscillator`s.
   * This method is overloaded for type interface and type check.
   * @param {number} index This argument selects instance of `Oscillator`.
   * @return {Oscillator|Array<Oscillator>}
   */
  public get(index: number): Oscillator;
  public get(): Oscillator[];
  public get(index?: number): Oscillator | Oscillator[] {
    if ((typeof index === 'number') && (index >= 0) && (index < this.sources.length)) {
      return this.sources[index];
    }

    return this.sources;
  }

  /**
   * This method returns the number of `Oscillator`s.
   * @return {number}
   */
  public length(): number {
    return this.sources.length;
  }

  /**
   * This method gets instance of `Module` (Analyser, Recorder, Effector ... etc).
   * @param {ModuleName|'glide'} moduleName This argument selects module.
   * @return {Module|Glide}
   */
  public module(moduleName: 'analyser'): Analyser;
  public module(moduleName: 'recorder'): Recorder;
  public module(moduleName: 'session'): Session;
  public module(moduleName: 'autopanner'): Autopanner;
  public module(moduleName: 'bitcrusher'): BitCrusher;
  public module(moduleName: 'chorus'): Chorus;
  public module(moduleName: 'compressor'): Compressor;
  public module(moduleName: 'delay'): Delay;
  public module(moduleName: 'distortion'): Distortion;
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
  public module(moduleName: 'reverb'): Reverb;
  public module(moduleName: 'ringmodulator'): Ringmodulator;
  public module(moduleName: 'stereo'): Stereo;
  public module(moduleName: 'tremolo'): Tremolo;
  public module(moduleName: 'vocalcanceler'): VocalCanceler;
  public module(moduleName: 'wah'): Wah;
  public module(moduleName: 'glide'): Glide;
  public module(moduleName: ModuleName | 'glide'): Module | Glide | null {
    switch (moduleName) {
      case 'analyser':
        return this.analyser;
      case 'recorder':
        return this.recorder;
      case 'session':
        return this.session;
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
      case 'distortion':
        return this.distortion;
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
      case 'glide':
        return this.glide;
      default:
        return null;
    }
  }

  /** @override */
  public override resize(bufferSize: BufferSize): OscillatorModule {
    super.init(this.context, bufferSize);
    return this;
  }

  /** @override */
  public override on(startTime?: number): OscillatorModule {
    super.on(startTime);
    return this;
  }

  /** @override */
  public override off(stopTime?: number): OscillatorModule {
    super.off(stopTime);
    return this;
  }

  /** @override */
  public override suspend(): OscillatorModule {
    super.suspend();
    return this;
  }

  /** @override */
  public override mix(): OscillatorModule {
    super.mix();
    return this;
  }

  /** @override */
  public override demix(): OscillatorModule {
    super.demix();
    return this;
  }

  /**
   * This method gets oscillator module parameters as associative array.
   * @return {OscillatorModuleParams}
   * @override
   */
  public override params(): Required<OscillatorModuleParams> {
    const params = super.params();

    return {
      ...params,
      oscillator: {
        glide : this.glide.params(),
        params: this.sources.map((source: Oscillator) => {
          return source.params();
        })
      }
    };
  }

  /** @override */
  public override get INPUT(): ScriptProcessorNode {
    return this.processor;
  }

  /** @override */
  public override get OUTPUT(): GainNode {
    return this.mastervolume;
  }
}
