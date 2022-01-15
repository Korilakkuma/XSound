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
}
