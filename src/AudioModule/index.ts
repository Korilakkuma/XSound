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
import { Wah } from '../SoundModule/Effectors/Wah';
import { VocalCanceler, VocalCancelerParams } from '../SoundModule/Effectors/VocalCanceler';

export type AudioBufferSprite = { [spriteName: string]: AudioBuffer };

export type AudioModuleParams = SoundModuleParams & {
  vocalcanceler: VocalCancelerParams,
  playbackRate?: number,
  detune?: number,
  loop?: boolean,
  currentTime?: number,
  readonly duration?: number,
  readonly sampleRate?: number,
  readonly numberOfChannels?: number
};

type Params = Partial<Pick<AudioModuleParams, 'mastervolume' | 'playbackRate' | 'detune' | 'loop' | 'currentTime' | 'duration' | 'sampleRate' | 'numberOfChannels'>>;

/**
 * This subclass is for playing single audio.
 * This class enables to create audio player that has higher features than `HTMLAudioElement`.
 * But, this class is disadvantage to play many one shot audios.
 * In that case, developer should use `OneshotModule`.
 * @constructor
 * @extends {SoundModule}
 */
export class AudioModule extends SoundModule {
  private source: AudioBufferSourceNode;
  private buffer: AudioBuffer | null = null;

  private vocalcanceler: VocalCanceler;

  private currentTime = 0;
  private stopped = true;

  private decodeCallback?(buffer: AudioBuffer): void;
  private updateCallback?(source: AudioBufferSourceNode, currentTime: number): void;
  private endedCallback?(source: AudioBufferSourceNode, currentTime: number): void;
  private errorCallback?(error: Error): void;

  /**
   * @param {AudioContext} context This argument is in order to use the interfaces of Web Audio API.
   * @param {BufferSize} bufferSize This argument is buffer size for `ScriptProcessorNode`.
   */
  constructor(context: AudioContext, bufferSize: BufferSize) {
    super(context, bufferSize);

    this.source        = context.createBufferSource();
    this.vocalcanceler = new VocalCanceler();
  }

  /**
   * This method sets up envelope generator for fade-in and fade-out.
   * @return {AudioModule} Return value is for method chain.
   */
  public setup(callbacks?: {
    decodeCallback?(buffer: AudioBuffer): void;
    updateCallback?(source: AudioBufferSourceNode, currentTime: number): void;
    endedCallback?(source: AudioBufferSourceNode, currentTime: number): void;
    errorCallback?(error: Error): void;
  }): AudioModule {
    const { decodeCallback, updateCallback, endedCallback, errorCallback } = callbacks ?? {};

    if (decodeCallback) {
      this.decodeCallback = decodeCallback;
    }

    if (updateCallback) {
      this.updateCallback = updateCallback;
    }

    if (endedCallback) {
      this.endedCallback = endedCallback;
    }

    if (errorCallback) {
      this.errorCallback = errorCallback;
    }

    this.envelopegenerator.setGenerator(0);
    this.envelopegenerator.param({
      attack : 0,
      decay  : 0.01,
      sustain: 1,
      release: 0.01
    });

    return this;
  }

  /**
   * This method decodes instance of `ArrayBuffer` to `ArrayBuffer` or sets instanceof `AudioBuffer`.
   * @param {ArrayBuffer|AudioBuffer} buffer This argument is instance of `ArrayBuffer` or `AudioBuffer`.
   *     If this is `ArrayBuffer`, this method executes decode.
   * @return {AudioModule} Return value is for method chain.
   */
  public ready(buffer: ArrayBuffer | AudioBuffer): AudioModule {
    if (buffer instanceof ArrayBuffer) {
      this.buffer = null;

      const successCallback = (audiobuffer: AudioBuffer) => {
        this.buffer = audiobuffer;

        this.analyser.start('timeoverview', 0, this.buffer);
        this.analyser.start('timeoverview', 1, this.buffer);

        if (this.decodeCallback) {
          this.decodeCallback(this.buffer);
        }
      };

      this.context.decodeAudioData(buffer, successCallback, this.errorCallback);
    } else if (buffer instanceof AudioBuffer) {
      this.buffer = buffer;
    }

    return this;
  }

  /**
   * This method starts audio from designated time.
   * @param {number} startTime This argument is time that audio is started at. The default value is `0`.
   * @param {number} endTime This argument is time that audio is ended at. The default value is audio duration.
   * @return {AudioModule} This is returned for method chain.
   */
  public start(startTime?: number, endTime?: number): AudioModule {
    if ((this.buffer === null) || !this.stopped) {
      return this;
    }

    const currentTime = this.context.currentTime;

    const start = startTime ?? 0;
    const end   = endTime ?? this.buffer.duration;

    if (end >= 0) {
      this.currentTime = ((start >= 0) && (start <= end)) ? start : 0;
    } else {
      this.currentTime = ((start >= 0) && (start <= this.buffer.duration)) ? start : 0;
    }

    const playbackRate = this.source.playbackRate.value;
    const detune       = this.source.detune.value;
    const loop         = this.source.loop;

    this.source = this.context.createBufferSource();

    this.source.buffer             = this.buffer;
    this.source.playbackRate.value = playbackRate;
    this.source.detune.value       = detune;
    this.source.loop               = loop;
    this.source.loopStart          = this.currentTime;
    this.source.loopEnd            = (end >= 0) ? end : this.buffer.duration;

    // AudioBufferSourceNode (Input) -> GainNode (Envelope Generator) -> ScriptProcessorNode -> ... -> AudioDestinationNode (Output)
    this.envelopegenerator.ready(0, this.source, this.processor);
    this.connect(this.processor);

    if (end >= 0) {
      this.source.start(currentTime, this.currentTime, (end - start));
    } else {
      this.source.start(currentTime, this.currentTime, (this.buffer.duration - this.currentTime));
    }

    this.analyser.start('time');
    this.analyser.start('fft');

    this.stopped = false;

    this.envelopegenerator.start(currentTime);

    if (end >= 0) {
      this.envelopegenerator.stop((currentTime + ((end - start) / this.source.playbackRate.value)), true);
    } else {
      this.envelopegenerator.stop((currentTime + ((this.buffer.duration - start) / this.source.playbackRate.value)), true);
    }

    this.on(currentTime);

    const bufferSize = this.processor.bufferSize;

    const timeoverviewL = this.analyser.domain('timeoverview', 0);
    const timeoverviewR = this.analyser.domain('timeoverview', 1);

    this.processor.onaudioprocess = (event: AudioProcessingEvent) => {
      const inputLs  = event.inputBuffer.getChannelData(0);
      const inputRs  = event.inputBuffer.getChannelData(1);
      const outputLs = event.outputBuffer.getChannelData(0);
      const outputRs = event.outputBuffer.getChannelData(1);

      if (this.buffer === null) {
        this.end();
        return;
      }

      if (this.currentTime < Math.trunc(this.source.loopEnd)) {
        for (let i = 0; i < bufferSize; i++) {
          outputLs[i] = this.vocalcanceler.start(inputLs[i], inputRs[i]);
          outputRs[i] = this.vocalcanceler.start(inputRs[i], inputLs[i]);

          this.currentTime += ((1 * this.source.playbackRate.value) / this.buffer.sampleRate);

          if (this.updateCallback) {
            this.updateCallback(this.source, this.currentTime);
          }
        }

        timeoverviewL.update(this.currentTime);
        timeoverviewR.update(this.currentTime);
      } else {
        if (this.source.loop) {
          this.stop();

          if (timeoverviewL.param('mode') === 'sprite') {
            this.start(this.source.loopStart, this.source.loopEnd);
          } else {
            this.start(0, this.buffer.duration);
          }
        } else {
          this.end();
        }
      }
    };

    return this;
  }

  /**
   * This method stops audio.
   * @return {AudioModule} Return value is for method chain.
   */
  public stop(): AudioModule {
    if ((this.buffer === null) || this.stopped) {
      return this;
    }

    const stopTime = this.context.currentTime;

    this.source.stop(stopTime);

    this.off(stopTime);

    this.analyser.stop('time');
    this.analyser.stop('fft');

    // Clear

    // Stop `onaudioprocess` event
    this.processor.disconnect(0);
    this.processor.onaudioprocess = null;

    this.stopped = true;

    return this;
  }

  /**
   * This method gets or sets parameters for audio module.
   * This method is overloaded for type interface and type check.
   * @param {keyof Params|Params} params This argument is string if getter. Otherwise, setter.
   * @return {Params[keyof Params]|Params} Return value is parameter for audio module if getter.
   *     Otherwise, return value is for method chain.
   */
  public param(params: 'mastervolume'): number;
  public param(params: 'playbackRate'): number;
  public param(params: 'detune'): number;
  public param(params: 'loop'): boolean;
  public param(params: 'currentTime'): number;
  public param(params: 'duration'): number;
  public param(params: 'sampleRate'): number;
  public param(params: 'numberOfChannels'): number;
  public param(params: 'numberOfChannels'): number;
  public param(params: Params): AudioModule;
  public param(params: keyof Params | Params): Params[keyof Params] | AudioModule {
    if (typeof params === 'string') {
      switch (params) {
        case 'mastervolume':
          return this.mastervolume.gain.value;
        case 'playbackRate':
          return this.source.playbackRate.value;
        case 'detune':
          return this.source.detune.value;
        case 'loop':
          return this.source.loop;
        case 'currentTime':
          return this.currentTime;
        case 'duration':
          return this.source.buffer?.duration ?? 0;  // Getter only
        case 'sampleRate':
          return this.source.buffer?.sampleRate ?? this.context.sampleRate;  // Getter only
        case 'numberOfChannels':
          return this.source.buffer?.numberOfChannels ?? 0;  // Getter only
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
        case 'playbackRate':
          if (typeof value === 'number') {
            if (value > 0) {
              this.source.playbackRate.value = value;

              const startTime   = this.context.currentTime;
              const currentTime = this.currentTime;
              const duration    = this.source.buffer?.duration ?? 0;

              this.envelopegenerator.start(startTime);
              this.envelopegenerator.stop((startTime + ((duration - currentTime) / value)), true);
            }
          }

          break;
        case 'detune':
          if (typeof value === 'number') {
            this.source.detune.value = value;

            const playbackRate = (value > 0) ? ((value / 1200) + 1) : Math.abs(1 / ((value / 1200) - 1));
            const startTime    = this.context.currentTime;
            const currentTime  = this.currentTime;
            const duration     = this.source.buffer?.duration ?? 0;

            this.envelopegenerator.start(startTime);
            this.envelopegenerator.stop((startTime + ((duration - currentTime) / playbackRate)), true);
          }

          break;
        case 'loop':
          if (typeof value === 'boolean') {
            this.source.loop = value;
          }

          break;
        case 'currentTime':
          if (typeof value === 'number') {
            this.currentTime = value;

            if (!this.stopped) {
              this.stop();
              this.start(value);
            }
          }

          break;
        default:
          break;
      }
    }

    return this;
  }

  /**
   * This method gets instance of `AudioBufferSourceNode`.
   * @return {AudioBufferSourceNode}
   */
  public get(): AudioBufferSourceNode {
    return this.source;
  }

  /**
   * This method rewinds audio.
   * @return {AudioModule} Return value is for method chain.
   */
  public end(): AudioModule {
    this.stop();
    this.currentTime = 0;

    if (this.endedCallback) {
      this.endedCallback(this.source, 0);
    }

    return this;
  }

  /**
   * This method determines whether instance of `AudioBuffer` exists.
   * @return {boolean} If instance of `AudioBuffer` already exists, this value is `true`. Otherwise, this value is `false`.
   */
  public has(): boolean {
    return this.buffer !== null;
  }

  /**
   * This method determines whether audio is paused.
   * @return {boolean} If audio is paused, this value is `true`. Otherwise, this value is `false`.
   */
  public paused(): boolean {
    return this.stopped;
  }

  /**
   * This method gets or sets fade-in time.
   * @param {number} time This argument is fade-in time. If this argument is omitted, this method is getter.
   * @return {number|AudioModule} Return value is fade-in time. Otherwise, return value is for method chain.
   */
  public fadeIn(time?: number): number | AudioModule {
    if (typeof time !== 'number') {
      return this.envelopegenerator.param('attack');
    }

    this.envelopegenerator.param({ attack: time });

    const startTime    = this.context.currentTime;
    const currentTime  = this.currentTime;
    const duration     = this.source.buffer?.duration ?? 0;
    const playbackRate = this.source.playbackRate.value;

    this.envelopegenerator.start(startTime);
    this.envelopegenerator.stop((startTime + ((duration - currentTime) / playbackRate)), true);

    return this;
  }

  /**
   * This method gets or sets fade-out time.
   * @param {number} time This argument is fade-out time. If this argument is omitted, this method is getter.
   * @return {number|AudioModule} Return value is fade-out time. Otherwise, return value is for method chain.
   */
  public fadeOut(time?: number): number | AudioModule {
    if (typeof time !== 'number') {
      return this.envelopegenerator.param('release');
    }

    this.envelopegenerator.param({ release: time });

    const startTime    = this.context.currentTime;
    const currentTime  = this.currentTime;
    const duration     = this.source.buffer?.duration ?? 0;
    const playbackRate = this.source.playbackRate.value;

    this.envelopegenerator.start(startTime);
    this.envelopegenerator.stop((startTime + ((duration - currentTime) / playbackRate)), true);

    return this;
  }

  /**
   *  This method slices instance of `AudioBuffer`.
   *  @param {number} startTime This argument is start time [sec] on `AudioBuffer`.
   *  @param {number} endTime This argument is end time [sec] on `AudioBuffer`.
   *  @return {AudioBuffer} Return value is sliced `AudioBuffer`.
   */
  public slice(startTime?: number, endTime?: number): AudioBuffer | null {
    if (this.buffer === null) {
      return null;
    }

    const duration         = this.buffer.duration;
    const sampleRate       = this.buffer.sampleRate;
    const numberOfChannels = this.buffer.numberOfChannels;

    const start = Math.trunc((startTime ?? 0) * sampleRate);
    const end   = Math.trunc((endTime ?? duration) * sampleRate);

    const dataLs = (numberOfChannels > 0) ? this.buffer.getChannelData(0) : null;
    const dataRs = (numberOfChannels > 1) ? this.buffer.getChannelData(1) : null;

    const bufferSize = end - start;

    switch (numberOfChannels) {
      case 1: {
        if (dataLs === null) {
          return null;
        }

        const bufferLs = new Float32Array(bufferSize);

        for (let i = start; i < end; i++) {
          bufferLs[i - start] = dataLs[i];
        }

        const buffer = this.context.createBuffer(1, bufferSize, sampleRate);

        buffer.copyToChannel(bufferLs, 0);

        return buffer;
      }

      case 2: {
        if ((dataLs === null) || (dataRs === null)) {
          return null;
        }

        const bufferLs = new Float32Array(bufferSize);
        const bufferRs = new Float32Array(bufferSize);

        for (let i = start; i < end; i++) {
          bufferLs[i - start] = dataLs[i];
          bufferRs[i - start] = dataRs[i];
        }

        const buffer = this.context.createBuffer(2, bufferSize, sampleRate);

        buffer.copyToChannel(bufferLs, 0);
        buffer.copyToChannel(bufferRs, 1);

        return buffer;
      }

      default:
        return null;
    }
  }

  /**
   *  This method sprites audio.
   *  @param {Object<string, Array<number>>} sprites This argument is associative array that contains sprite times.
   *  @return {AudioBufferSprite} Return value is associative array that contains sprited `AudioBuffer`.
   */
  public sprite(sprites: { [spriteName: string]: [number, number] }): AudioBufferSprite | null {
    if (this.buffer === null) {
      return null;
    }

    return Object.keys(sprites).reduce((audioSprite: AudioBufferSprite, spriteName: string) => {
      const times: [number, number] = sprites[spriteName];

      const audiobuffer = this.slice(...times);

      if (audiobuffer !== null) {
        audioSprite[spriteName] = audiobuffer;
      }

      return audioSprite;
    }, {});
  }

  /**
   * This method gets instance of `Module` (Analyser, Recorder, Effector ... etc).
   * @param {ModuleName|'vocalcanceler'} moduleName This argument selects module.
   * @return {Module|VocalCanceler}
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
  public module(moduleName: 'vocalcanceler'): VocalCanceler;
  public module(moduleName: ModuleName | 'vocalcanceler'): Module | VocalCanceler | null {
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
      case 'vocalcanceler':
        return this.vocalcanceler;
      default:
        return null;
    }
  }

  /** @override */
  public override resize(bufferSize: BufferSize): AudioModule {
    super.init(this.context, bufferSize);
    return this;
  }

  /** @override */
  public override on(startTime?: number): AudioModule {
    super.on(startTime);
    return this;
  }

  /** @override */
  public override off(stopTime?: number): AudioModule {
    super.off(stopTime);
    return this;
  }

  /** @override */
  public override suspend(): AudioModule {
    super.suspend();
    return this;
  }

  /**
   * This method gets audio module parameters as associative array.
   * @return {AudioModuleParams}
   * @override
   */
  public override params(): AudioModuleParams {
    const params = super.params();

    return {
      ...params,
      playbackRate    : this.source.playbackRate.value,
      detune          : this.source.detune.value,
      loop            : this.source.loop,
      currentTime     : this.currentTime,
      duration        : this.buffer?.duration ?? 0,
      sampleRate      : this.buffer?.sampleRate ?? this.context.sampleRate,
      numberOfChannels: this.buffer?.numberOfChannels ?? 0,
      vocalcanceler   : this.vocalcanceler.params()
    };
  }
}
