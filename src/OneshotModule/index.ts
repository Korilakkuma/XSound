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

export type OneshotErrorText = 'error' | 'timeout' | 'decode';

export type OneshotSetting = {
  bufferIndex: number,
  playbackRate?: number,
  loop?: boolean,
  loopStart?: number,
  loopEnd?: number,
  volume?: number
};

export type OneshotSettings = OneshotSetting[];

export type OneshotModuleParams = SoundModuleParams & {
  transpose?: number
};

type Params = Partial<Pick<OneshotModuleParams, 'mastervolume' | 'transpose'>>;

/**
 * This subclass is for playing one-shot audio
 * @constructor
 * @extends {SoundModule}
 */
export class OneshotModule extends SoundModule {
  private sources: AudioBufferSourceNode[] = [];
  private resources: string[] | AudioBuffer[] = [];
  private buffers: AudioBuffer[] = [];
  private volumes: GainNode[] = [];
  private states: boolean[] = [];
  private settings: OneshotSettings = [];

  private startTime = 0;
  private duration = 0;

  private transpose = 0;

  private paused = true;

  // If error occurs at least one, this method aborts the all of connections.
  // Therefore, this flag are shared with the all of `XMLHttpRequest` instances.
  private isLoadError = false;

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   * @param {BufferSize} bufferSize This argument is buffer size for `ScriptProcessorNode`.
   */
  // eslint-disable-next-line no-useless-constructor
  constructor(context: AudioContext, bufferSize: BufferSize) {
    super(context, bufferSize);
  }

  /**
   * This method creates instances of `AudioBuffer` by Ajax.
   * @param {Array<string>|Array<AudioBuffer>} resources This argument is array that contains URL or instance of `AudioBuffer` for audio resources.
   * @param {OneshotSettings} settings This argument is settings (such as `playbackRate`, `loop` ... etc) each audio sources.
   * @param {number} timeout This argument is timeout of Ajax. The default value is 60000 msec (1 minutes).
   * @param {function} successCallback This argument is invoked on success;
   * @param {function} errorCallback This argument is invoked on failure.
   * @param {function} progressCallback This argument is invoked during receiving audio data.
   * @return {OneshotModule} Return value is for method chain.
   */
  public setup(params: {
    resources: string[] | AudioBuffer[];
    settings: OneshotSettings;
    timeout?: number;
    successCallback?(event: ProgressEvent, buffers: AudioBuffer[]): void;
    errorCallback?(event: ProgressEvent | Error, textStatus: OneshotErrorText): void;
    progressCallback?(event: ProgressEvent): void;
  }): OneshotModule {
    const { resources, settings, timeout, successCallback, errorCallback, progressCallback } = params;

    for (let i = 0, len = settings.length; i < len; i++) {
      this.states[i]    = false;
      this.volumes[i]   = this.context.createGain();
      this.settings[i]  = settings[i];

      this.envelopegenerator.setGenerator(i);
    }

    for (let index = 0, len = resources.length; index < len; index++) {
      this.resources[index] = resources[index];

      const url = this.resources[index];

      if (typeof url === 'string') {
        // Get instance of `AudioBuffer` from designated URL.
        this.load({ url, index, timeout, successCallback, errorCallback, progressCallback });
      } else {
        this.buffers[index] = url;
      }
    }

    return this;
  }

  /**
   * This method schedules playing audio.
   * @param {number} startTime This argument is start time. The default value is `currentTime` in instance of `AudioContext`
   * @param {number} duration This argument is duration. The default value is 0.
   * @return {OneshotModule} Return value is for method chain.
   */
  public ready(startTime?: number, duration?: number): OneshotModule {
    this.startTime = startTime ?? this.context.currentTime;
    this.duration  = duration ?? 0;

    this.envelopegenerator.clear(false);

    return this;
  }

  /**
   * This method starts one-shot audio.
   * @param {Array<number>} indexes This argument selects instance of `AudioBufferSourceNode`.
   * @return {OneshotModule} Return value is for method chain.
   */
  public start(indexes: number[]): OneshotModule {
    const startTime = this.context.currentTime + this.startTime;

    if (!this.mixed) {
      this.envelopegenerator.clear(false);

      // ScriptProcessorNode (Mix one-shots) -> ... -> AudioDestinationNode (Output)
      this.connect(this.processor);
    }

    for (const index of indexes) {
      if ((index < 0) || (index >= this.settings.length)) {
        continue;
      }

      const { bufferIndex, playbackRate, loop, loopStart, loopEnd, volume } = this.settings[index];

      // The following code is unnecessary, because `AudioBufferSourceNode` is the target of garbage collection in case of no references and no sound
      // (If there is this code, application cannot repeat hits).

      // if (this.sources[index]) {
      //     this.sources[index].stop(this.context.currentTime);
      //     this.sources[index].disconnect(0);
      // }

      const source = this.context.createBufferSource();

      source.buffer = this.buffers[bufferIndex];

      source.playbackRate.value = playbackRate ?? 1;
      source.detune.value       = this.transpose * 100;
      source.loop               = loop ?? false;
      source.loopStart          = loopStart ?? 0;
      source.loopEnd            = loopEnd ?? source.buffer.duration;

      this.volumes[index].gain.value = volume ?? 1;

      // AudioBufferSourceNode (Input) -> GainNode (Envelope Generator) -> GainNode (Volume) -> ScriptProcessorNode (Mix one-shots)
      this.envelopegenerator.ready(index, source, this.volumes[index]);
      this.volumes[index].connect(this.processor);

      if (source.loop) {
        source.start(startTime, (startTime + source.loopStart), (source.loopEnd - startTime));
      } else {
        source.start(startTime);
      }

      this.sources[index] = source;

      this.states[index] = true;

      // Call on stopping audio
      source.onended = () => {
        this.states[index] = false;
      };
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
      this.paused = !this.states.some((state: boolean) => state);

      if (this.paused) {
        // Stop

        this.stop(indexes);

        this.off(this.context.currentTime);

        this.envelopegenerator.clear(false);

        this.analyser.stop('time');
        this.analyser.stop('fft');
        this.runningAnalyser = false;

        if (!this.mixed) {
          // Stop `onaudioprocess` event
          this.processor.disconnect(0);
          this.processor.onaudioprocess = null;
        }
      } else {
        const inputLs  = event.inputBuffer.getChannelData(0);
        const inputRs  = event.inputBuffer.getChannelData(1);
        const outputLs = event.outputBuffer.getChannelData(0);
        const outputRs = event.outputBuffer.getChannelData(1);

        outputLs.set(inputLs);
        outputRs.set(inputRs);
      }
    };

    return this;
  }

  /**
   * This method stops one-shot audio.
   * @param {Array<number>} index This argument selects instance of `AudioBufferSourceNode`.
   * @return {OneshotModule} Return value is for method chain.
   */
  public stop(indexes: number[]): OneshotModule {
    const canStop = indexes.every((index: number) => {
      if ((index < 0) || (index >= this.settings.length)) {
        return false;
      }

      const bufferIndex = this.settings[index].bufferIndex;

      if (typeof bufferIndex !== 'number') {
        return false;
      }

      return true;
    });

    if (canStop) {
      const stopTime = this.context.currentTime + this.startTime + this.duration;

      // Attack or Decay or Sustain -> Release
      this.envelopegenerator.stop(stopTime);

      this.filter.stop(stopTime);
    }

    return this;
  }

  /**
   * This method gets or sets parameters for one-shot module.
   * This method is overloaded for type interface and type check.
   * @param {keyof Params|Params} params This argument is string if getter. Otherwise, setter.
   * @return {Params[keyof Params]|Params} Return value is parameter for one-shot module if getter.
   *     Otherwise, return value is for method chain.
   */
  public param(params: 'mastervolume'): number;
  public param(params: 'transpose'): number;
  public param(params: Params): Params[keyof Params];
  public param(params: keyof Params | Params): Params[keyof Params] | OneshotModule {
    if (typeof params === 'string') {
      switch (params) {
        case 'mastervolume':
          return this.mastervolume.gain.value;
        case 'transpose':
          return this.transpose;
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
        case 'transpose':
          if (typeof value === 'number') {
            this.transpose = value;
          }

          break;
        default:
          break;
      }
    }

    return this;
  }

  /**
   * This method gets instance of `AudioBuffer` or array that contains the all of `AudioBuffer`s.
   * This method is overloaded for type interface and type check.
   * @param {number} index This argument selects instance of `AudioBuffer`.
   * @return {AudioBuffer|AudioBuffer[]}
   */
  public get(index: number): AudioBuffer;
  public get(): AudioBuffer[];
  public get(index?: number): AudioBuffer | AudioBuffer[] {
    if ((typeof index === 'number') && (index >= 0) && (index < this.buffers.length)) {
      return this.buffers[index];
    }

    return this.buffers;
  }

  /**
   * This method resets settings.
   * @param {number} index This argument selects target setting.
   * @param {keyof OneshotSetting} paramName This argument is one-shot parameter name.
   * @param {OneshotSetting} param This argument is one-shot parameter value.
   * @return {OneshotModule} Return value is for method chain.
   */
  public reset(index: number, paramName: keyof OneshotSetting, param: number | boolean): OneshotModule {
    if ((index >= 0) && (index < this.settings.length)) {
      switch (paramName) {
        case 'bufferIndex' :
        case 'playbackRate':
        case 'loopStart'   :
        case 'loopEnd'     :
        case 'volume'      :
          if (typeof param === 'number') {
            this.settings[index][paramName] = param;
          }

          break;
        case 'loop':
          if (typeof param === 'boolean') {
            this.settings[index][paramName] = param;
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
  public override resize(bufferSize: BufferSize): OneshotModule {
    super.init(this.context, bufferSize);
    return this;
  }

  /** @override */
  public override on(startTime?: number): OneshotModule {
    super.on(startTime);
    return this;
  }

  /** @override */
  public override off(stopTime?: number): OneshotModule {
    super.off(stopTime);
    return this;
  }

  /** @override */
  public override suspend(): OneshotModule {
    super.suspend();
    return this;
  }

  /** @override */
  public override mix(): OneshotModule {
    super.mix();
    return this;
  }

  /** @override */
  public override demix(): OneshotModule {
    super.demix();
    return this;
  }

  /**
   * This method gets one-shot module parameters as associative array.
   * @return {OneshotModuleParams}
   * @override
   */
  public override params(): OneshotModuleParams {
    const params = super.params();

    return {
      ...params,
      transpose: this.transpose
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

  /**
   * This method gets `ArrayBuffer` and creates instance of `AudioBuffer`.
   * @param {string} url This argument is resource URL for one-shot audio.
   * @param {number} index This argument is in order to assign instance of `AudioBuffer`.
   * @param {number} timeout This argument is timeout of Ajax. The default value is 60000 msec (1 minutes).
   * @param {function} successCallback This argument is invoked on success;
   * @param {function} errorCallback This argument is invoked on failure.
   * @param {function} progressCallback This argument is invoked during receiving audio data.
   */
  private load(params: {
    url: string;
    index: number;
    timeout?: number;
    successCallback?(event: ProgressEvent, buffers: AudioBuffer[]): void;
    errorCallback?(event: ProgressEvent | Error, textStatus: OneshotErrorText): void;
    progressCallback?(event: ProgressEvent): void;
  }): void {
    const { url, index, timeout, successCallback, errorCallback, progressCallback } = params;

    const xhr = new XMLHttpRequest();

    xhr.timeout = timeout ?? 60000;

    xhr.ontimeout = (event: ProgressEvent) => {
      if (!this.isLoadError && errorCallback) {
        errorCallback(event, 'timeout');
      }

      this.isLoadError = true;
    };

    xhr.onprogress = (event: ProgressEvent) => {
      if (this.isLoadError) {
        xhr.abort();
      } else if (progressCallback) {
        progressCallback(event);
      }
    };

    xhr.onerror = (event: ProgressEvent) => {
      if (!this.isLoadError && errorCallback) {
        errorCallback(event, 'error');
      }

      this.isLoadError = true;
    };

    // Success
    xhr.onload = (event: ProgressEvent) => {
      if (xhr.status === 200) {
        const arrayBuffer = xhr.response;

        if (!(arrayBuffer instanceof ArrayBuffer)) {
          return;
        }

        const decodeSuccessCallback = (buffer: AudioBuffer) => {
          this.buffers[index] = buffer;

          // Creating instance of `AudioBuffer` has completed ?
          for (const buffer of this.buffers) {
            if (buffer === undefined) {
              return;
            }
          }

          if (successCallback) {
            successCallback(event, this.buffers);
          }
        };

        const decodeErrorCallback = (error: Error) => {
          if (errorCallback) {
            errorCallback(error, 'decode');
          }
        };

        this.context.decodeAudioData(arrayBuffer, decodeSuccessCallback, decodeErrorCallback);
      }
    };

    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';  // XMLHttpRequest Level 2
    xhr.send(null);
  }
}
