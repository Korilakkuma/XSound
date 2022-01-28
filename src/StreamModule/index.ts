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
import { NoiseGate, NoiseGateParams }  from './NoiseGate';
import { NoiseSuppressor, NoiseSuppressorParams }  from './NoiseSuppressor';

// HACK: `MediaStreamTrackAudioSourceNode` is not defined
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface MediaStreamTrackAudioSourceNode extends AudioNode {
}

export type StreamModuleParams = SoundModuleParams & {
  noisegate: NoiseGateParams,
  noisesuppressor: NoiseSuppressorParams,
  output?: boolean,
  track?: boolean
};

type Params = Partial<Pick<StreamModuleParams, 'mastervolume' | 'output' | 'track'>>;

/**
 * This class is for processing sound data from WebRTC.
 * @constructor
 * @extends {SoundModule}
 */
export class StreamModule extends SoundModule {
  // @ts-ignore (HACK: `MediaStreamTrackAudioSourceNode` is not defined)
  private sources: MediaStreamAudioSourceNode[] | MediaStreamTrackAudioSourceNode[] = [];
  private stream: MediaStream | null = null;
  private constraints: MediaStreamConstraints = {
    audio: true,
    video: false
  };

  // Parameters
  private output = true;
  private track = false;

  private paused = true;

  private noisegate: NoiseGate;
  private noisesuppressor: NoiseSuppressor;

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   * @param {BufferSize} bufferSize This argument is buffer size for `ScriptProcessorNode`.
   */
  constructor(context: AudioContext, bufferSize: BufferSize) {
    super(context, bufferSize);

    this.noisegate       = new NoiseGate();
    this.noisesuppressor = new NoiseSuppressor();
  }

  /**
   * This method sets up for using WebRTC.
   * @param {MediaStreamConstraints} constraints This argument is object based on `MediaStreamConstraints` dictionary.
   * @return {StreamModule} Return value is for method chain.
   */
  public setup(constraints?: MediaStreamConstraints): StreamModule {
    if (constraints) {
      this.constraints = { ...this.constraints, ...constraints };
    }

    return this;
  }

  /**
   * This method opens devices or sets instance of `MediaStream`.
   * @param {MediaStream} stream This argument is instance of `MediaStream`.
   * @param {function} successCallback This argument is invoked on success.
   * @param {function} errorCallback This argument is invoked on failure.
   * @return {Promise<void>} Return value is `Promise` that `getUserMedia` returns.
   */
  public ready(params?: {
    stream?: MediaStream;
    successCallback?: (stream: MediaStream) => void;
    errorCallback?: (error: Error) => void;
  }): Promise<void> {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.MediaStream) {
      return Promise.reject();
    }

    this.paused = false;

    if (params?.stream) {
      this.stream = params.stream;
      return Promise.resolve();
    }

    return navigator.mediaDevices.getUserMedia(this.constraints)
      .then((stream: MediaStream) => {
        if (this.paused) {
          return;
        }

        this.stream = stream;

        if (params?.successCallback) {
          params.successCallback(stream);
        }
      })
      .catch((error: Error) => {
        if (params?.errorCallback) {
          params.errorCallback(error);
        }
      });
  }

  /**
   * This method starts streaming.
   * @return {StreamModule} Return value is for method chain.
   */
  public start(): StreamModule {
    if (this.stream === null) {
      return this;
    }

    const bufferSize = this.processor.bufferSize;

    let runningAnalyser = false;

    if (this.track) {
      // Get instance of `MediaStreamTrack` for audio
      const audioTracks = this.stream.getAudioTracks();

      for (let i = 0, len = audioTracks.length; i < len; i++) {
        // @ts-ignore (HACK: `createMediaStreamTrackSource` is not defined)
        this.sources[i] = this.context.createMediaStreamTrackSource(audioTracks[i]);

        // MediaStreamTrackAudioSourceNode (Input) -> ScriptProcessorNode -> ... -> AudioDestinationNode (Output)
        this.sources[i].connect(this.processor);
        this.connect(this.processor);
      }
    } else {
      this.sources[0] = this.context.createMediaStreamSource(this.stream);

      // MediaStreamAudioSourceNode (Input) -> ScriptProcessorNode -> ... -> AudioDestinationNode (Output)
      this.sources[0].connect(this.processor);
      this.connect(this.processor);
    }

    if (!this.output) {
      this.mastervolume.disconnect(0);

      // for analyser
      this.mastervolume.connect(this.analyser.INPUT);

      // for recorder
      this.mastervolume.connect(this.recorder.INPUT);
      this.recorder.OUTPUT.connect(this.context.destination);

      // for session
      this.mastervolume.connect(this.session.INPUT);
      this.session.OUTPUT.connect(this.context.destination);
    }

    this.on(this.context.currentTime);

    if (!runningAnalyser) {
      this.analyser.start('time');
      this.analyser.start('fft');
      runningAnalyser = true;
    }

    this.processor.onaudioprocess = (event: AudioProcessingEvent) => {
      const inputLs  = event.inputBuffer.getChannelData(0);
      const inputRs  = event.inputBuffer.getChannelData(1);
      const outputLs = event.outputBuffer.getChannelData(0);
      const outputRs = event.outputBuffer.getChannelData(1);

      const threshold = this.noisesuppressor.param('threshold');
      const level     = this.noisegate.param('level');

      // Give priority to Noise Suppressor
      if ((typeof threshold === 'number') && (threshold > 0)) {
        this.noisesuppressor.start(inputLs, outputLs, bufferSize);
        this.noisesuppressor.start(inputRs, outputRs, bufferSize);
      } else if ((typeof level === 'number') && (level > 0)) {
        for (let i = 0; i < bufferSize; i++) {
          outputLs[i] = this.noisegate.start(inputLs[i]);
          outputRs[i] = this.noisegate.start(inputRs[i]);
        }
      } else {
        outputLs.set(inputLs);
        outputRs.set(inputRs);
      }
    };

    return this;
  }

  /**
   * This method stops streaming.
   * @return {StreamModule} Return value is for method chain.
   */
  public stop(): StreamModule {
    this.sources.length = 0;

    this.off(this.context.currentTime);

    this.analyser.stop('time');
    this.analyser.stop('fft');

    // Stop `onaudioprocess` event
    this.processor.disconnect(0);
    this.processor.onaudioprocess = null;

    this.paused = true;

    return this;
  }

  /**
   * This method gets or sets parameters for stream module.
   * This method is overloaded for type interface and type check.
   * @param {keyof Params} params This argument is string if getter. Otherwise, setter.
   * @return {Params[keyof Params]|StreamModule} Return value is parameter for stream module if getter.
   *     Otherwise, return value is for method chain.
   */
  public param(params: 'mastervolume'): number;
  public param(params: 'output'): boolean;
  public param(params: 'track'): boolean;
  public param(params: Params): StreamModule;
  public param(params: keyof Params | Params): Params[keyof Params] | StreamModule {
    if (typeof params === 'string') {
      switch (params) {
        case 'mastervolume':
          return this.mastervolume.gain.value;
        case 'output':
          return this.output;
        case 'track':
          return this.track;
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
        case 'output':
          if (typeof value === 'boolean') {
            this.output = value;
          }

          break;
        case 'track':
          if (typeof value === 'boolean') {
            this.track = value;
          }

          break;
        default:
          break;
      }
    }

    return this;
  }

  /**
   * This method gets instance of `MediaStreamAudioSourceNode` or `MediaStreamTrackAudioSourceNode` or that array contains these.
   * This method is overloaded for type interface and type check.
   * @param {number} index This argument selects instance of `MediaStreamAudioSourceNode` or `MediaStreamTrackAudioSourceNode`.
   * @return {MediaStreamAudioSourceNode|MediaStreamTrackAudioSourceNode}
   */
  // @ts-ignore (HACK: `MediaStreamTrackAudioSourceNode` is not defined)
  public get(index: number): MediaStreamAudioSourceNode | MediaStreamTrackAudioSourceNode;
  public get(): MediaStreamAudioSourceNode[] | MediaStreamTrackAudioSourceNode[];
  public get(index?: number): MediaStreamAudioSourceNode | MediaStreamTrackAudioSourceNode | MediaStreamAudioSourceNode[] | MediaStreamTrackAudioSourceNode[] {
    if ((typeof index === 'number') && (index >= 0) && (index < this.sources.length)) {
      return this.sources[index];
    }

    return this.sources;
  }

  /**
   * This method gets instance of `MediaStream`.
   * @return {MediaStream|null}
   */
  public getStream(): MediaStream | null {
    return this.stream;
  }

  /**
   * This method stops microphone and camera by stopping instances of `MediaStreamTrack`.
   * @return {StreamModule} Return value is for method chain.
   */
  public clear(): StreamModule {
    this.stop();

    this.clearAudioDevices();
    this.clearVideoDevices();

    this.stream = null;

    return this;
  }

  /**
   * This method stops microphone by stopping instances of `MediaStreamTrack`.
   * @return {StreamModule} Return value is for method chain.
   */
  public clearAudioDevices(): StreamModule {
    if (this.stream === null) {
      return this;
    }

    this.stop();

    // Get instance of `MediaStreamTrack` for audio
    const audioTracks = this.stream.getAudioTracks();

    for (const audioTrack of audioTracks) {
      audioTrack.stop();
    }

    return this;
  }

  /**
   * This method stops camera by stopping instances of `MediaStreamTrack`.
   * @return {StreamModule} Return value is for method chain.
   */
  public clearVideoDevices(): StreamModule {
    if (this.stream === null) {
      return this;
    }

    this.stop();

    // Get instance of `MediaStreamTrack` for video
    const videoTracks = this.stream.getVideoTracks();

    for (const videoTrack of videoTracks) {
      videoTrack.stop();
    }

    this.stream = null;

    return this;
  }

  /**
   * This method gets available devices as array that contains instance of `MediaDeviceInfo`.
   * @return {Promise<MediaDeviceInfo[]|void>} Return value is `Promise` that has array contains instance of `MediaDeviceInfo`.
   */
  public devices(): Promise<MediaDeviceInfo[]|void> {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      return Promise.reject();
    }

    return navigator.mediaDevices.enumerateDevices();
  }

  /**
   * This method determines whether streaming is active.
   * @return {boolean} If streaming is active, this value is `true`. Otherwise, this value is `false`.
   */
  public streaming(): boolean {
    return !this.paused;
  }

  /**
   * This method gets instance of `Module` (Analyser, Recorder, Effector ... etc).
   * @param {ModuleName|'noisegate'|'noisesuppressor'} moduleName This argument selects module.
   * @return {Module|NoiseGate|NoiseSuppressor}
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
  public module(moduleName: 'noisegate'): NoiseGate;
  public module(moduleName: 'noisesuppressor'): NoiseSuppressor;
  public module(moduleName: ModuleName | 'noisegate' | 'noisesuppressor'): Module | NoiseGate | NoiseSuppressor | null {
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
      case 'noisegate':
        return this.noisegate;
      case 'noisesuppressor':
        return this.noisesuppressor;
      default:
        return null;
    }
  }

  /** @override */
  public override resize(bufferSize: BufferSize): StreamModule {
    super.init(this.context, bufferSize);
    return this;
  }

  /** @override */
  public override on(startTime?: number): StreamModule {
    super.on(startTime);
    return this;
  }

  /** @override */
  public override off(stopTime?: number): StreamModule {
    super.off(stopTime);
    return this;
  }

  /** @override */
  public override suspend(): StreamModule {
    super.suspend();
    return this;
  }

  /**
   * This method gets stream module parameters as associative array.
   * @return {StreamModuleParams}
   * @override
   */
  public override params(): StreamModuleParams {
    const params = super.params();

    return {
      ...params,
      output         : this.output,
      track          : this.track,
      noisegate      : this.noisegate.params(),
      noisesuppressor: this.noisesuppressor.params()
    };
  }
}