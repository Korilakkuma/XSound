import { SoundModule, SoundModuleParams, Module, ModuleName } from '../SoundModule';
import { MediaModuleProcessor } from './MediaModuleProcessor';
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

export type MediaModuleParams = SoundModuleParams & {
  autoplay?: boolean,
  playbackRate?: number,
  currentTime?: number,
  controls?: boolean,
  loop?: boolean,
  muted?: boolean,
  readonly duration?: number
};

export { MediaModuleProcessor };

/**
 * This class processes sound data from `HTMLMediaElement`.
 * Namely, this class enables to create audio player that has higher features from `HTMLMediaElement`.
 * But, this class is disadvantage to play many one shot audios.
 * In that case, developer should use `OneshotModule`.
 * @constructor
 * @extends {SoundModule}
 */
export class MediaModule extends SoundModule {
  private source: MediaElementAudioSourceNode | null = null;
  private media: HTMLAudioElement | HTMLVideoElement | null = null;

  // 'wav', 'ogg', 'mp3, 'webm', 'ogv', 'mp4' ...etc
  private ext = '';

  // for Autoplay policy
  private autoplay = false;

  // for Audio Streaming
  private mediaSource: MediaSource | null = null;
  private sourceBuffer: SourceBuffer | null = null;
  private file = '';
  private mimeType = '';

  // Keys are event interfaces that are defined by `HTMLMediaElement` or `MediaSource` or `SourceBuffer`.
  // For example, `loadstart`, `loadedmetadata`, `loadeddata`, `canplay`, `canplaythrough`, `timeupdate`, `ended`,
  // `sourceopen`, `sourceended`, `sourceclose`, `updateend`, `error` ... etc
  private listeners: { [eventType: string]: (event: Event | Error) => void } = {};

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   */
  constructor(context: AudioContext) {
    super(context);

    this.processor = new AudioWorkletNode(context, MediaModuleProcessor.name);

    this.onSourceOpen  = this.onSourceOpen.bind(this);
    this.onSourceEnded = this.onSourceEnded.bind(this);
    this.onSourceClose = this.onSourceClose.bind(this);

    this.onSourceBufferUpdateEnd = this.onSourceBufferUpdateEnd.bind(this);
    this.onSourceBufferError     = this.onSourceBufferError.bind(this);
  }

  /**
   * This method gets `HTMLMediaElement` and selects media format. In addition, this method adds event listeners that are defined by `HTMLMediaElement`.
   * @property {HTMLAudioElement|HTMLVideoElement} media This argument is either `HTMLAudioElement` or `HTMLVideoElement`.
   * @property {Array<string>} formats This argument is usable media format. For example, 'wav', 'ogg', 'webm', 'mp4' ...etc.
   * @property {boolean} autoplay This argument is in order to determine autoplay. The default value is `false`.
   * @property {{ [eventType: string]: (event: Event | Error) => void }} listeners This argument is event listeners that are defined by `HTMLMediaElement`.
   * @return {MediaModule} Return value is for method chain.
   */
  public setup(params: {
    media: HTMLAudioElement | HTMLVideoElement;
    formats?: string[];
    autoplay?: boolean;
    listeners?: { [eventType: string]: (event: Event | Error) => void };
  }): MediaModule {
    this.envelopegenerator.setGenerator(0);
    this.envelopegenerator.param({
      attack : 0,
      decay  : 0.01,
      sustain: 1,
      release: 0.01
    });

    const { media, formats, listeners, autoplay } = params;

    if (!media) {
      return this;
    }

    this.media = media;

    for (const format of formats ?? []) {
      const audioMime = `audio/${format}`;
      const videoMime = `video/${format}`;

      const canAudio = this.media.canPlayType(audioMime);
      const canVideo = this.media.canPlayType(videoMime);

      if (/^(?:maybe|probably)/.test(canAudio) || /^(?:maybe|probably)/.test(canVideo)) {
        this.ext = format;
        break;
      }
    }

    if (listeners) {
      this.listeners = listeners;

      Object.keys(listeners).forEach((eventType: string) => {
        const listener = listeners[eventType];

        if (typeof listener === 'function') {
          listeners[eventType] = listener;
        }

        if (this.media) {
          this.media.addEventListener(eventType, listener, false);
        }
      });
    }

    this.media.addEventListener('loadstart', () => {
      if (this.media === null) {
        return;
      }

      // To create instance of `MediaElementAudioSourceNode` again causes error to occur
      if (this.source === null) {
        this.source = this.context.createMediaElementSource(this.media);
      }
    }, false);

    this.media.addEventListener('ended', () => {
      if (this.media === null) {
        return;
      }

      this.media.pause();

      this.off(this.context.currentTime);

      this.analyser.stop('time');
      this.analyser.stop('fft');
    }, false);

    this.autoplay = autoplay ?? false;

    // in case of autoplay, `loadstart` event not fire
    if (this.autoplay && (this.source === null)) {
      this.source = this.context.createMediaElementSource(this.media);
    }

    if (this.autoplay && this.media.src) {
      this.context.resume()
        .then(() => {
          this.start(this.media?.currentTime ?? 0);
        })
        .catch((error: Error) => {
          if (this.listeners.error) {
            this.listeners.error(error);
          }
        });
    }

    return this;
  }

  /**
   * This method prepares for playing media anytime after loading media resource.
   * @param {string} src This argument is Object URL or file name for media resource.
   * @param {string} mimeType This argument is required in case of audio streaming.
   * @return {MediaModule} Return value is for method chain.
   */
  public ready(src: string, mimeType?: string): MediaModule {
    if (this.media === null) {
      return this;
    }

    if (this.mediaSource && (this.mediaSource.readyState === 'open')) {
      this.mediaSource.endOfStream();
      window.URL.revokeObjectURL(this.media.src);

      this.mediaSource.removeEventListener('sourceopen',  this.onSourceOpen,  false);
      this.mediaSource.removeEventListener('sourceended', this.onSourceEnded, false);
      this.mediaSource.removeEventListener('sourceclose', this.onSourceClose, false);

      if (this.sourceBuffer) {
        this.sourceBuffer.removeEventListener('updateend', this.onSourceBufferUpdateEnd, false);
        this.sourceBuffer.removeEventListener('error',     this.onSourceBufferError,     false);
      }
    }

    if (mimeType) {
      // Audio Streaming
      if (!MediaSource || !MediaSource.isTypeSupported(mimeType)) {
        return this;
      }

      this.media.removeAttribute('src');

      this.media.load();

      this.mediaSource = new MediaSource();
      this.media.src   = window.URL.createObjectURL(this.mediaSource);
      this.mimeType    = mimeType;
      this.file        = src;

      this.mediaSource.addEventListener('sourceopen',  this.onSourceOpen,  false);
      this.mediaSource.addEventListener('sourceended', this.onSourceEnded, false);
      this.mediaSource.addEventListener('sourceclose', this.onSourceClose, false);
    } else if (src.startsWith('blob:') || (this.ext === '')) {
      // Object URL or file name
      this.media.src = src;
    } else {
      // file name (except extension)
      this.media.src = `${src}.${this.ext}`;
    }

    return this;
  }

  /**
   * This method starts media from designated time.
   * @param {number} position This argument is time that media is started at. The default value is `0`.
   * @param {function} errorCallback This argument is invoked on failure.
   * @return {MediaModule} Return value is for method chain.
   */
  public start(position?: number, errorCallback?: (error: Error) => void): MediaModule {
    if ((this.source === null) || (this.media === null)) {
      return this;
    }

    // MediaElementAudioSourceNode (Input) -> GainNode (Envelope Generator) -> AudioWorkletNode -> ... -> AudioDestinationNode (Output)
    this.envelopegenerator.ready(0, this.source, this.processor);
    this.connect(this.processor);

    this.media.play()
      .then(() => {
        if (this.media === null) {
          return;
        }

        const startTime = this.context.currentTime;

        this.media.currentTime = position ?? 0;

        this.envelopegenerator.start(startTime);

        // `duration` is infinite in case of audio streaming
        if (Number.isFinite(this.media.duration)) {
          this.envelopegenerator.stop((startTime + ((this.media.duration - this.media.currentTime) / this.media.playbackRate)), true);
        }

        this.on(startTime);

        this.analyser.start('time');
        this.analyser.start('fft');
      })
      .catch(() => {
        this.stop(() => {
          if (this.media === null) {
            return;
          }

          if (this.autoplay) {
            this.media.muted  = true;
            this.media.volume = 0;
          }

          this.start(position);
        }, errorCallback);
      });

    return this;
  }

  /**
   * This method stops media.
   * @param {function} successCallback This argument is invoked on success.
   * @param {function} errorCallback This argument is invoked on failure.
   * @return {MediaModule} Return value is for method chain.
   */
  public stop(successCallback?: () => void, errorCallback?: (error: Error) => void): MediaModule {
    if ((this.source === null) || (this.media === null)) {
      return this;
    }

    // ref: https://developers.google.com/web/updates/2017/06/play-request-was-interrupted
    this.media.play()
      .then(() => {
        if (this.media === null) {
          return;
        }

        this.media.pause();

        this.off(this.context.currentTime);

        this.analyser.stop('time');
        this.analyser.stop('fft');

        if (successCallback) {
          successCallback();
        }
      })
      .catch((error: Error) => {
        if (errorCallback) {
          errorCallback(error);
        }
      });

    return this;
  }

  /**
   * This method gets or sets parameters for media module.
   * This method is overloaded for type interface and type check.
   * @param {keyof MediaModuleParams|MediaModuleParams} params This argument is string if getter. Otherwise, setter.
   * @return {MediaModuleParams[keyof MediaModuleParams]|MediaModule} Return value is parameter for media module if getter.
   *     Otherwise, return value is for method chain.
   */
  public param(params: 'mastervolume'): number;
  public param(params: 'autoplay'): boolean;
  public param(params: 'playbackRate'): number;
  public param(params: 'currentTime'): number;
  public param(params: 'controls'): boolean;
  public param(params: 'loop'): boolean;
  public param(params: 'muted'): boolean;
  public param(params: 'duration'): boolean;
  public param(params: 'duration'): boolean;
  public param(params: MediaModuleParams): MediaModule;
  public param(params: keyof MediaModuleParams | MediaModuleParams): MediaModuleParams[keyof MediaModuleParams] | MediaModule {
    if (typeof params === 'string') {
      switch (params) {
        case 'mastervolume': {
          return this.mastervolume.gain.value;
        }

        case 'autoplay': {
          return this.autoplay;
        }

        case 'playbackRate': {
          return this.media?.playbackRate ?? 1;
        }

        case 'currentTime': {
          return this.media?.currentTime ?? 0;
        }

        case 'controls': {
          return this.media?.controls ?? false;
        }

        case 'loop': {
          return this.media?.loop ?? false;
        }

        case 'muted': {
          return this.media?.muted ?? false;
        }

        case 'duration': {
          // `duration` is infinite in case of audio streaming
          return Number.isNaN(this.media?.duration) ? 0 : (this.media?.duration ?? 0);  // Getter only
        }

        default: {
          return this;
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

        case 'playbackRate': {
          if (this.media && (typeof value === 'number')) {
            if (value > 0) {
              this.media.playbackRate = value;

              const startTime   = this.context.currentTime;
              const currentTime = this.media.currentTime;
              const duration    = this.media.duration;

              this.envelopegenerator.start(startTime);

              // `duration` is infinite in case of audio streaming
              if (Number.isFinite(duration)) {
                this.envelopegenerator.stop((startTime + ((duration - currentTime) / value)), true);
              }
            }
          }

          break;
        }

        case 'currentTime': {
          if (this.media && (typeof value === 'number')) {
            this.media.currentTime = value;

            const startTime    = this.context.currentTime;
            const duration     = this.media.duration;
            const playbackRate = this.media.playbackRate;

            this.envelopegenerator.start(startTime);

            // `duration` is infinite in case of audio streaming
            if (Number.isFinite(duration)) {
              this.envelopegenerator.stop((startTime + ((duration - value) / playbackRate)), true);
            }
          }

          break;
        }

        case 'controls': {
          if (this.media && (typeof value === 'boolean')) {
            this.media.controls = value;
          }

          break;
        }

        case 'loop': {
          if (this.media && (typeof value === 'boolean')) {
            this.media.loop = value;
          }

          break;
        }

        case 'muted': {
          if (this.media && (typeof value === 'boolean')) {
            this.media.muted = value;
          }

          break;
        }

        default: {
          break;
        }
      }
    }

    return this;
  }

  /**
   * This method gets instance of `MediaElementAudioSourceNode`.
   * @return {MediaElementAudioSourceNode|null}
   */
  public get(): MediaElementAudioSourceNode | null {
    return this.source;
  }

  /**
   * This method determines whether instance of `HTMLMediaElement` exists.
   * @return {boolean} If instance of `HTMLMediaElement` already exists, this value is `true`. Otherwise, this value is `false`.
   */
  public hasMedia(): boolean {
    return this.media !== null;
  }

  /**
   * This method determines whether instance of `MediaElementAudioSourceNode` exists.
   * @return {boolean} If instance of `MediaElementAudioSourceNode` already exists, this value is `true`. Otherwise, this value is `false`.
   */
  public hasSource(): boolean {
    return this.source !== null;
  }

  /**
   * This method determines whether media is paused.
   * @return {boolean} If media is paused, this value is `true`. Otherwise, this value is `false`.
   */
  public paused(): boolean {
    return (this.media === null) ? true : this.media.paused;
  }

  /**
   * This method gets or sets fade-in time.
   * @param {number} time This argument is fade-in time. If this argument is omitted, this method is getter.
   * @return {number|MediaModule} Return value is fade-in time. Otherwise, return value is for method chain.
   */
  public fadeIn(time?: number): number | MediaModule {
    if (typeof time !== 'number') {
      return this.envelopegenerator.param('attack');
    }

    this.envelopegenerator.param({ attack: time });

    const startTime    = this.context.currentTime;
    const currentTime  = this.media?.currentTime ?? 0;
    const duration     = this.media?.duration ?? 0;
    const playbackRate = this.media?.playbackRate ?? 1;

    this.envelopegenerator.start(startTime);
    this.envelopegenerator.stop((startTime + ((duration - currentTime) / playbackRate)), true);

    return this;
  }

  /**
   * This method gets or sets fade-out time.
   * @param {number} time This argument is fade-out time. If this argument is omitted, this method is getter.
   * @return {number|MediaModule} Return value is fade-out time. Otherwise, return value is for method chain.
   */
  public fadeOut(time?: number): number | MediaModule {
    if (typeof time !== 'number') {
      return this.envelopegenerator.param('release');
    }

    this.envelopegenerator.param({ release: time });

    const startTime    = this.context.currentTime;
    const currentTime  = this.media?.currentTime ?? 0;
    const duration     = this.media?.duration ?? 0;
    const playbackRate = this.media?.playbackRate ?? 1;

    this.envelopegenerator.start(startTime);
    this.envelopegenerator.stop((startTime + ((duration - currentTime) / playbackRate)), true);

    return this;
  }

  /**
   * This method requests Picture In Picture (PIP).
   * @return {Promise<PictureInPictureWindow>} Return value is `Promise`.
   */
  public requestPictureInPicture(): Promise<PictureInPictureWindow> {
    if (!(this.media instanceof HTMLVideoElement)) {
      return Promise.reject();
    }

    if (!('pictureInPictureEnabled' in document)) {
      return Promise.reject();
    }

    if (!document.pictureInPictureEnabled) {
      return Promise.reject();
    }

    if (this.media.disablePictureInPicture) {
      return Promise.reject();
    }

    if (this.media.readyState === 0) {
      return Promise.reject();
    }

    if (this.media === document.pictureInPictureElement) {
      return Promise.reject();
    }

    return this.media.requestPictureInPicture();
  }

  /**
   * This method exits from Picture In Picture (PIP).
   * @return {Promise<void>} Return value is `Promise`.
   */
  public exitPictureInPicture(): Promise<void> {
    if (!(this.media instanceof HTMLVideoElement)) {
      return Promise.reject();
    }

    if (!('pictureInPictureEnabled' in document)) {
      return Promise.reject();
    }

    if (!document.pictureInPictureEnabled) {
      return Promise.reject();
    }

    if (this.media.disablePictureInPicture) {
      return Promise.reject();
    }

    if (this.media.readyState === 0) {
      return Promise.reject();
    }

    if (this.media !== document.pictureInPictureElement) {
      return Promise.reject();
    }

    return document.exitPictureInPicture();
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

      default: {
        return null;
      }
    }
  }

  /** @override */
  public override on(startTime?: number): MediaModule {
    super.on(startTime);
    return this;
  }

  /** @override */
  public override off(stopTime?: number): MediaModule {
    super.off(stopTime);
    return this;
  }

  /** @override */
  public override suspend(): MediaModule {
    super.suspend();
    return this;
  }

  /** @override */
  public override mix(): MediaModule {
    super.mix();
    return this;
  }

  /** @override */
  public override demix(): MediaModule {
    super.demix();
    return this;
  }

  /**
   * This method gets media module parameters as associative array.
   * @return {MediaModuleParams}
   * @override
   */
  public override params(): Required<MediaModuleParams> {
    const params = super.params();

    return {
      ...params,
      autoplay     : this.autoplay,
      playbackRate : this.media?.playbackRate ?? 1,
      controls     : this.media?.controls ?? false,
      loop         : this.media?.loop ?? false,
      muted        : this.media?.muted ?? false,
      currentTime  : this.media?.currentTime ?? 0,
      duration     : Number.isNaN(this.media?.duration ?? 0) ? 0 : (this.media?.duration ?? 0),
      vocalcanceler: this.vocalcanceler.params()
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

  /**
   * This method is event listener for `MediaSource`
   * @param {Event} event This argument is instance of `Event`.
   */
  private onSourceOpen(event: Event): void {
    if (this.mediaSource === null) {
      return;
    }

    this.sourceBuffer = this.mediaSource.addSourceBuffer(this.mimeType);

    this.sourceBuffer.mode = 'sequence';

    this.sourceBuffer.addEventListener('updateend', this.onSourceBufferUpdateEnd, false);
    this.sourceBuffer.addEventListener('error',     this.onSourceBufferError,     false);

    const request = new Request(this.file);

    fetch(request)
      .then((response: Response) => {
        return response.arrayBuffer();
      })
      .then((data: ArrayBuffer) => {
        if (this.sourceBuffer) {
          this.sourceBuffer.appendBuffer(data);
        }
      })
      .catch((error: Error) => {
        if (this.listeners.error) {
          this.listeners.error(error);
        }
      })
      .finally(() => {
        if (this.listeners.sourceopen) {
          this.listeners.sourceopen(event);
        }
      });
  }

  /**
   * This method is event listener for `MediaSource`
   * @param {Event} event This argument is instance of `Event`.
   */
  private onSourceEnded(event: Event): void {
    if (this.listeners.sourceended) {
      this.listeners.sourceended(event);
    }
  }

  /**
   * This method is event listener for `MediaSource`
   * @param {Event} event This argument is instance of `Event`.
   */
  private onSourceClose(event: Event): void {
    if (this.listeners.sourceclose) {
      this.listeners.sourceclose(event);
    }
  }

  /**
   * This method is event listener for `SourceBuffer`
   * @param {Event} event This argument is instance of `Event`.
   */
  private onSourceBufferUpdateEnd(event: Event): void {
    if (this.listeners.updateend) {
      this.listeners.updateend(event);
    }
  }

  /**
   * This method is event listener for `SourceBuffer`
   * @param {Event} event This argument is instance of `Event`.
   */
  private onSourceBufferError(event: Event): void {
    if (this.listeners.error) {
      this.listeners.error(event);
    }
  }
}
