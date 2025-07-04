import type { SoundModuleParams, Module, ModuleName } from '../SoundModule';
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
import { StreamModuleProcessor } from './StreamModuleProcessor';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface MediaStreamTrackAudioSourceNode extends AudioNode {
}

export type StreamModuleParams = SoundModuleParams & {
  output?: boolean,
  track?: boolean
};

export { StreamModuleProcessor };

/**
 * This class is for processing sound data from WebRTC.
 */
export class StreamModule extends SoundModule {
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

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   */
  constructor(context: AudioContext) {
    super(context);

    this.processor = new AudioWorkletNode(context, StreamModuleProcessor.name);
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
   * @property {MediaStream} stream This argument is instance of `MediaStream`.
   * @property {function} successCallback This argument is invoked on success.
   * @property {function} errorCallback This argument is invoked on failure.
   * @return {Promise<MediaStream|Error>} Return value is `Promise` that `getUserMedia` returns.
   */
  public ready(params?: {
    stream?: MediaStream;
    successCallback?: (stream: MediaStream) => void;
    errorCallback?: (error: Error) => void;
  }): Promise<MediaStream|Error> {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.MediaStream) {
      return Promise.reject();
    }

    this.paused = false;

    if (params?.stream) {
      this.stream = params.stream;
      return Promise.resolve(this.stream);
    }

    return navigator.mediaDevices.getUserMedia(this.constraints)
      .then((stream: MediaStream) => {
        if (this.paused) {
          return stream;
        }

        this.stream = stream;

        if (params?.successCallback) {
          params.successCallback(stream);
        }

        return stream;
      })
      .catch((error: Error) => {
        if (params?.errorCallback) {
          params.errorCallback(error);
        }

        return error;
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

    if (this.track) {
      // Get instance of `MediaStreamTrack` for audio
      const audioTracks = this.stream.getAudioTracks();

      for (let i = 0, len = audioTracks.length; i < len; i++) {
        // @ts-expect-error `createMediaStreamTrackSource` is not defined
        this.sources[i] = this.context.createMediaStreamTrackSource(audioTracks[i]);

        // MediaStreamTrackAudioSourceNode (Input) -> AudioWorkletNode -> ... -> AudioDestinationNode (Output)
        this.sources[i].connect(this.processor);
        this.connect(this.processor);
      }
    } else {
      this.sources[0] = this.context.createMediaStreamSource(this.stream);

      // MediaStreamAudioSourceNode (Input) -> AudioWorkletNode -> ... -> AudioDestinationNode (Output)
      this.sources[0].connect(this.processor);
      this.connect(this.processor);
    }

    if (!this.output) {
      this.mastervolume.disconnect(0);

      // for analyser
      this.mastervolume.connect(this.analyser.INPUT);

      // for recorder
      this.mastervolume.connect(this.recorder.INPUT);
      this.recorder.OUTPUT.connect(this.destination);
    }

    this.on(this.context.currentTime);

    this.analyser.start('time');
    this.analyser.start('fft');

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

    this.paused = true;

    return this;
  }

  /**
   * This method gets or sets parameters for stream module.
   * This method is overloaded for type interface and type check.
   * @param {keyof StreamModuleParams} params This argument is string if getter. Otherwise, setter.
   * @return {StreamModuleParams[keyof StreamModuleParams]|StreamModule} Return value is parameter for stream module if getter.
   *     Otherwise, return value is for method chain.
   */
  public param(params: 'mastervolume'): number;
  public param(params: 'output'): boolean;
  public param(params: 'track'): boolean;
  public param(params: StreamModuleParams): StreamModule;
  public param(params: keyof StreamModuleParams | StreamModuleParams): StreamModuleParams[keyof StreamModuleParams] | StreamModule {
    if (typeof params === 'string') {
      switch (params) {
        case 'mastervolume': {
          return this.mastervolume.gain.value;
        }

        case 'output': {
          return this.output;
        }

        case 'track': {
          return this.track;
        }
      }
    }

    for (const [key, value] of Object.entries(params)) {
      switch (key) {
        case 'mastervolume': {
          if (typeof value === 'number') {
            this.mastervolume.gain.value = value;
          }

          break;
        }

        case 'output': {
          if (typeof value === 'boolean') {
            this.output = value;
          }

          break;
        }

        case 'track': {
          if (typeof value === 'boolean') {
            this.track = value;
          }

          break;
        }
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
   * This method gets current `MediaStreamConstraints`.
   * @return {MediaStreamConstraints}
   */
  public getConstraints(): MediaStreamConstraints {
    return this.constraints;
  }

  /**
   * This method changes `MediaStreamConstraints`.
   * @param {MediaStreamConstraints} constraints This argument is object based on `MediaStreamConstraints` dictionary.
   * @return {StreamModule} Return value is for method chain.
   */
  public setConstraints(constraints: MediaStreamConstraints): StreamModule {
    this.constraints = constraints;
    return this;
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
   * This method enables to designate input device.
   * @param {string} deviceId This argument is string as input device ID.
   * @return {StreamModule} Return value is for method chain.
   */
  public setInputDeviceId(deviceId: string): StreamModule {
    const audioConstraints = this.constraints.audio ?? {};

    if (typeof audioConstraints === 'boolean') {
      this.constraints = {
        ...this.constraints,
        audio: {
          deviceId
        }
      };
    } else {
      this.constraints = {
        ...this.constraints,
        audio: {
          ...audioConstraints,
          deviceId
        }
      };
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

  /**
   * This method gets stream module parameters as associative array.
   * @return {StreamModuleParams}
   * @override
   */
  public override params(): Required<StreamModuleParams> {
    const params = super.params();

    return {
      ...params,
      output         : this.output,
      track          : this.track,
      noisegate      : this.noisegate.params(),
      noisesuppressor: this.noisesuppressor.params()
    };
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
