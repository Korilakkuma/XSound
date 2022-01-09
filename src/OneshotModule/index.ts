import { BufferSize } from '../types';
import { SoundModule, SoundModuleParams } from '../SoundModule';

type OneshotErrorText = 'error' | 'timeout' | 'decode';

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

export type OneshotModuleParam = Partial<Pick<OneshotModuleParams, 'mastervolume' | 'transpose'>>;

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

  private transpose = 1;

  private paused = true;

  // If error occurs at least one, this method aborts the all of connections.
  // Therefore, this flag are shared with the all of `XMLHttpRequest` instances.
  private isLoadError = false;

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

    for (let i = 0, len = resources.length; i < len; i++) {
      this.resources[i] = resources[i];
      this.states[i]    = false;
      this.volumes[i]   = this.context.createGain();
      this.settings[i]  = settings[i];

      this.envelopegenerator.setGenerator(i);
    }

    for (let index = 0, len = this.resources.length; index < len; index++) {
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
   * @param {number} index This argument selects instance of `AudioBufferSourceNode`.
   * @return {OneshotModule} Return value is for method chain.
   */
  public start(index: number) {
    if ((index < 0) || (index >= this.settings.length)) {
      return this;
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

    // Set properties
    source.playbackRate.value = (playbackRate ?? 1) * this.transpose;
    source.loop               = loop ?? false;
    source.loopStart          = loopStart ?? 0;
    source.loopEnd            = loopEnd ?? source.buffer.duration;

    this.volumes[index].gain.value = volume ?? 1;

    this.envelopegenerator.clear(false);

    // AudioBufferSourceNode (Input) -> GainNode (Envelope Generator) -> GainNode (Volume) -> ScriptProcessorNode -> ... -> AudioDestinationNode (Output)
    this.envelopegenerator.ready(index, source, this.volumes[index]);
    this.volumes[index].connect(this.processor);
    this.connect(this.processor);

    const startTime = this.context.currentTime + this.startTime;

    if (source.loop) {
      source.start(startTime, (startTime + source.loopStart), (source.loopEnd - startTime));
    } else {
      source.start(startTime);
    }

    this.sources[index] = source;

    // Attack -> Decay -> Sustain
    this.envelopegenerator.start(startTime);

    this.on(startTime);

    if (!this.runningAnalyser) {
      this.analyser.start('time');
      this.analyser.start('fft');
      this.runningAnalyser = true;
    }

    this.states[index] = true;

    // Call on stopping audio
    source.onended = () => {
      this.states[index] = false;
    };

    this.processor.onaudioprocess = (event: AudioProcessingEvent) => {
      this.paused = !this.states.some((state: boolean) => state);

      if (this.paused) {
        // Stop

        this.stop(index);

        this.off(this.context.currentTime);

        this.envelopegenerator.clear(false);

        this.analyser.stop('time');
        this.analyser.stop('fft');
        this.runningAnalyser = false;

        // Stop `onaudioprocess` event
        this.processor.disconnect(0);
        this.processor.onaudioprocess = null;
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
   * @param {number} index This argument selects instance of `AudioBufferSourceNode`.
   * @return {OneshotModule} Return value is for method chain.
   */
  public stop(index: number): OneshotModule {
    if ((index < 0) || (index >= this.settings.length)) {
      return this;
    }

    const bufferIndex = this.settings[index].bufferIndex;

    if (typeof bufferIndex !== 'number') {
      return this;
    }

    const stopTime = this.context.currentTime + this.startTime + this.duration;

    // Attack or Decay or Sustain -> Release
    this.envelopegenerator.stop(stopTime);

    this.filter.stop(stopTime);

    return this;
  }

  /**
   * This method gets or sets parameters for one-shot module.
   * @param {keyof OneshotModuleParam|OneshotModuleParam} params This argument is string if getter. Otherwise, setter.
   * @return {OneshotModuleParam[keyof OneshotModuleParam]|OneshotModule} Return value is parameter for one-shot module if getter.
   *     Otherwise, return value is for method chain.
   */
  public param(params: keyof OneshotModuleParam | OneshotModuleParam): OneshotModuleParam[keyof OneshotModuleParam] | OneshotModule {
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
   * This method gets instance of `AudioBuffer` that is used in `OneshotModule`.
   * @param {number} index This argument selects instance of `AudioBuffer`.
   * @return {AudioBuffer|null}
   */
  public get(index: number): AudioBuffer | null {
    if ((index >= 0) && (index < this.buffers.length)) {
      return this.buffers[index];
    }

    return null;
  }

  /**
   * This method resets settings.
   * @param {number} index This argument selects target setting.
   * @param {OneshotSetting} key This argument is one-shot parameter.
   * @return {OneshotModule} Return value is for method chain.
   */
  public reset(index: number, params: OneshotSetting): OneshotModule {
    if ((index >= 0) && (index < this.settings.length)) {
      this.settings[index] = params;
    }

    return this;
  }

  /** @override */
  public params(): OneshotModuleParams {
    const params = super.params();

    return {
      ...params,
      transpose: this.transpose
    };
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
