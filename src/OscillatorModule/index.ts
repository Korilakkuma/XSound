import { BufferSize } from '../types';
import { SoundModule, SoundModuleParams, Module, ModuleName } from '../SoundModule';
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
import { Wah } from '../SoundModule/./Effectors/Wah';
import { Glide, GlideParams } from './Glide';
import { Oscillator, OscillatorParams } from './Oscillator';

export type OscillatorModuleParams = SoundModuleParams & {
  oscillator: {
    glide: GlideParams,
    params: OscillatorParams[]
  }
};

export type OscillatorModuleParam = Partial<Pick<OscillatorModuleParams, 'mastervolume'>>;

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

  private runningAnalyser = false;

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

    if (!Array.isArray(states)) {
      states = [states];
    }

    for (let i = 0, len = states.length; i < len; i++) {
      this.sources[i] = new Oscillator(this.context, Boolean(states[i]));
      this.envelopegenerator.setGenerator(i);
    }

    return this;
  }

  /**
   * This method schedules the time of start and stop.
   * @param {number} startTime This argument is the start time. The default value is 0.
   * @param {number} duration This argument is duration. The default value is 0.
   * @return {OscillatorModule} Return value is for method chain.
   */
  public ready(startTime: number, duration: number): OscillatorModule {
    this.startTime = startTime < 0 ? startTime : 0;
    this.duration  = duration  < 0 ? duration  : 0;

    this.envelopegenerator.clear(true);

    return this;
  }

  /**
   * This method starts some sounds that are active at the same time.
   * @param {Array<number>} frequencies This argument each oscillator frequency. The default value is 0 Hz.
   * @return {OscillatorModule} Return value is for method chain.
   */
  public start(frequencies: number[]) {
    const startTime = this.context.currentTime + this.startTime;

    // Clear previous
    this.envelopegenerator.clear(true);
    this.processor.disconnect(0);
    this.processor.onaudioprocess = null;

    // ScriptProcessorNode (Mix oscillators) -> ... -> AudioDestinationNode (Output)
    this.connect(this.processor);

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

        // Stop `onaudioprocess` event
        this.processor.disconnect(0);
        this.processor.onaudioprocess = null;
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
   * @param {keyof OscillatorModuleParam|OscillatorModuleParam} params This argument is string if getter. Otherwise, setter.
   * @return {OscillatorModuleParam[keyof OscillatorModuleParam]|OscillatorModule} Return value is parameter for oscillator module if getter.
   *     Otherwise, return value is for method chain.
   */
  public param(params: keyof OscillatorModuleParam | OscillatorModuleParam): OscillatorModuleParam[keyof OscillatorModuleParam] | OscillatorModule {
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
   * This method gets instance of `Oscillator`.
   * @param {number} index This argument selects instance of `Oscillator`.
   * @return {Oscillator|null}
   */
  public get(index: number): Oscillator | null {
    if ((index >= 0) && (index < this.sources.length)) {
      return this.sources[index];
    }

    return null;
  }

  /**
   * This method gets array that contains instance of `Oscillator`.
   * @return {Array<Oscillator>}
   */
  public getAll(): Oscillator[] {
    return this.sources;
  }

  /**
   * This method returns the number of `Oscillator`s.
   * @return {number}
   */
  public length(): number {
    return this.sources.length;
  }

  /** @override */
  override module(moduleName: 'analyser'): Analyser;
  override module(moduleName: 'recorder'): Recorder;
  override module(moduleName: 'session'): Session;
  override module(moduleName: 'autopanner'): Autopanner;
  override module(moduleName: 'chorus'): Chorus;
  override module(moduleName: 'compressor'): Compressor;
  override module(moduleName: 'delay'): Delay;
  override module(moduleName: 'distortion'): Distortion;
  override module(moduleName: 'equalizer'): Equalizer;
  override module(moduleName: 'filter'): Filter;
  override module(moduleName: 'flanger'): Flanger;
  override module(moduleName: 'listener'): Listener;
  override module(moduleName: 'panner'): Panner;
  override module(moduleName: 'phaser'): Phaser;
  override module(moduleName: 'pitchshifter'): PitchShifter;
  override module(moduleName: 'reverb'): Reverb;
  override module(moduleName: 'ringmodulator'): Ringmodulator;
  override module(moduleName: 'stereo'): Stereo;
  override module(moduleName: 'tremolo'): Tremolo;
  override module(moduleName: 'wah'): Wah;
  override module(moduleName: 'envelopegenerator'): EnvelopeGenerator;
  override module(moduleName: 'glide'): Glide;
  override module(moduleName: ModuleName | 'glide'): Module | Glide | null {
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
      case 'glide':
        return this.glide;
      default:
        return null;
    }
  }

  /** @override */
  public params(): OscillatorModuleParams {
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
  public toString(): string {
    return '[OscillatorModule]';
  }
}