import { Effector } from './Effector';

type ReverbErrorText = 'error' | 'timeout' | 'decode';

export type ReverbParams = {
  state?: boolean,
  buffer?: AudioBuffer | null,
  dry?: number,
  wet?: number,
  tone?: number
};

/**
 * Effector's subclass for Reverb.
 * @constructor
 * @extends {Effector}
 */
export class Reverb extends Effector {
  public static ERROR_AJAX: ReverbErrorText         = 'error';
  public static ERROR_AJAX_TIMEOUT: ReverbErrorText = 'timeout';
  public static ERROR_DECODE: ReverbErrorText       = 'decode';

  private convolver: ConvolverNode;
  private dry: GainNode;
  private wet: GainNode;
  private tone: BiquadFilterNode;

  private rirs: AudioBuffer[] = [];

  // If error occurs at least one, this method aborts the all of connections.
  // Therefore, this flag are shared with the all of `XMLHttpRequest` instances.
  private isLoadError = false;

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   */
  constructor(context: AudioContext) {
    super(context, 0);

    this.convolver = context.createConvolver();
    this.dry       = context.createGain();
    this.wet       = context.createGain();
    this.tone      = context.createBiquadFilter();

    // Initialize parameters
    this.dry.gain.value       = 1;
    this.wet.gain.value       = 0;
    this.tone.type            = 'lowpass';
    this.tone.frequency.value = 350;
    this.tone.Q.value         = Math.SQRT1_2;
    this.tone.gain.value      = 0;  // Not used

    // `Reverb` is not connected by default
    this.deactivate();
  }

  /** @override */
  public override connect(): GainNode {
    // Clear connection
    this.input.disconnect(0);
    this.convolver.disconnect(0);
    this.dry.disconnect(0);
    this.wet.disconnect(0);
    this.tone.disconnect(0);

    if (this.isActive) {
      // Effect ON

      // GainNode (Input) -> GainNode (Dry) -> GainNode (Output)
      this.input.connect(this.dry);
      this.dry.connect(this.output);

      // GainNode (Input) -> BiquadFilterNode (Tone) -> ConvolverNode (Reverb) -> GainNode (Mix) -> GainNode (Output)
      this.input.connect(this.tone);
      this.tone.connect(this.convolver);
      this.convolver.connect(this.wet);
      this.wet.connect(this.output);
    } else {
      // Effect OFF

      // GainNode (Input) -> GainNode (Output)
      this.input.connect(this.output);
    }

    return this.output;
  }

  /**
   * This method gets or sets parameters for reverb effector.
   * This method is overloaded for type interface and type check.
   * @param {keyof ReverbParams|ReverbParams} params This argument is string if getter. Otherwise, setter.
   * @return {ReverbParams[keyof ReverbParams]|Reverb} Return value is parameter for reverb effector if getter.
   *     Otherwise, return value is for method chain.
   */
  public param(params: 'buffer'): AudioBuffer | null;
  public param(params: 'dry'): number;
  public param(params: 'wet'): number;
  public param(params: 'tone'): number;
  public param(params: ReverbParams): Reverb;
  public param(params: keyof ReverbParams | ReverbParams): ReverbParams[keyof ReverbParams] | Reverb {
    if (typeof params === 'string') {
      switch (params) {
        case 'buffer':
          return this.convolver.buffer;
        case 'dry':
          return this.dry.gain.value;
        case 'wet':
          return this.wet.gain.value;
        case 'tone':
          return this.tone.frequency.value;
        default:
          return this;
      }
    }

    for (const [key, value] of Object.entries(params)) {
      switch (key) {
        case 'buffer':
          if (value === null) {
            this.convolver.buffer = null;

            // If `buffer` in `ConvolverNode` is `null` after setting instance of `AudioBuffer`, `Reverb` is not OFF (Maybe, it is bug ?)
            // Therefore, `Reverb` is OFF by disconnecting `AudioNode`s.
            this.input.disconnect(0);
            this.input.connect(this.output);
          } else if ((typeof value === 'number') && ((value >= 0) && (value < this.rirs.length))) {
            this.convolver.buffer = this.rirs[value];
            this.connect();
          }

          break;
        case 'dry':
          if (typeof value === 'number') {
            this.dry.gain.value = value;
          }

          break;
        case 'wet':
          if (typeof value === 'number') {
            this.wet.gain.value = value;
          }

          break;
        case 'tone':
          if (typeof value === 'number') {
            this.tone.frequency.value = value;
          }

          break;
        default:
          break;
      }
    }

    return this;
  }

  /**
   * This method sets instance of `AudioBuffer` to `ConvolverNode`.
   * @param {ArrayBuffer|AudioBuffer} impulse This argument is in order to convolve impulse response.
   *     This argument is instance of `AudioBuffer` or `ArrayBuffer` for impulse response.
   * @param {function} errorCallback This argument is invoked on decode failure.
   * @return {Reverb} Return value is for method chain.
   */
  public add(impulse: ArrayBuffer | AudioBuffer, errorCallback?: (error: Error) => void): Reverb {
    if (impulse instanceof AudioBuffer) {
      this.convolver.buffer = impulse;
      this.rirs.push(impulse);  // Add to preset
    } else if (impulse instanceof ArrayBuffer) {
      const successCallback = (buffer: AudioBuffer) => {
        this.convolver.buffer = buffer;
        this.rirs.push(buffer);  // Add to preset
      };

      this.context.decodeAudioData(impulse, successCallback, (errorCallback ?? (() => {})));
    }

    return this;
  }

  /**
   * This method creates and appends to Reverb presets instance of `AudioBuffer` by Ajax.
   * @param {Array<string>|Array<AudioBuffer>} rirs This argument is array that contains URL or instance of `AudioBuffer` for impulse response.
   * @param {number} timeout This argument is timeout of Ajax. The default value is 60000 msec (1 minutes).
   * @param {function} successCallback This argument is invoked on success.
   * @param {function} errorCallback This argument is invoked on failure.
   * @param {function} progressCallback This argument is invoked during receiving audio data.
   */
  public preset(params: {
      rirs: string[] | AudioBuffer[];
      timeout?: number;
      successCallback?(event: ProgressEvent): void;
      errorCallback?(event: ProgressEvent | Error, textStatus: ReverbErrorText): void;
      progressCallback?(event: ProgressEvent): void;
    }): void {
    const { rirs, timeout, successCallback, errorCallback, progressCallback } = params;

    for (let index = 0, len = rirs.length; index < len; index++) {
      const rir = rirs[index];

      if (typeof rir === 'string') {
        // Get instance of `AudioBuffer` from designated URLs.
        this.load({ rir, index, timeout, successCallback, errorCallback, progressCallback });
      } else {
        // Get instance of `AudioBuffer` directly
        this.rirs[index] = rir;
      }
    }
  }

  /** @override */
  public override params(): ReverbParams {
    return {
      state: this.isActive,
      dry  : this.dry.gain.value,
      wet  : this.wet.gain.value,
      tone : this.tone.frequency.value
    };
  }

  /** @override */
  public override activate(): Reverb {
    this.isActive = true;

    // Update connection
    this.connect();

    return this;
  }

  /** @override */
  public override deactivate(): Reverb {
    this.isActive = false;

    // Update connection
    this.connect();

    return this;
  }

  /**
   * This method retrives `ArrayBuffer` and creates instance of `AudioBuffer`.
   * @param {string} url This argument is resource URL for one-shot audio.
   * @param {number} index This argument is in order to assign instance of `AudioBuffer`.
   * @param {number} timeout This argument is Ajax timeout.
   * @param {function} successCallback This argument is invoked on success.
   * @param {function} errorCallback This argument is invoked on failure
   * @param {function} progressCallback This argument is invoked during receiving audio data.
   */
  private load(params: {
    rir: string;
    index: number;
    timeout?: number;
    successCallback?(event: ProgressEvent): void;
    errorCallback?(event: ProgressEvent | Error, textStatus: ReverbErrorText): void;
    progressCallback?(event: ProgressEvent): void;
  }): void {
    const { rir, index, timeout, successCallback, errorCallback, progressCallback } = params;

    const xhr = new XMLHttpRequest();

    xhr.timeout = timeout ?? 60000;

    xhr.ontimeout = (event: ProgressEvent) => {
      if (!this.isLoadError && errorCallback) {
        errorCallback(event, Reverb.ERROR_AJAX_TIMEOUT);
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
        errorCallback(event, Reverb.ERROR_AJAX);
      }

      this.isLoadError = true;
    };

    // Success
    xhr.onload = (event: ProgressEvent) => {
      if (xhr.status === 200) {
        const arrayBuffer = xhr.response;

        const decodeSuccessCallback = (buffer: AudioBuffer) => {
          this.rirs[index] = buffer;

          // Creating instance of `AudioBuffer` has completed ?
          for (const rir of this.rirs) {
            if (rir === undefined) {
              return;
            }
          }

          if (successCallback) {
            successCallback(event);
          }
        };

        const decodeErrorCallback = (error: Error) => {
          if (errorCallback) {
            errorCallback(error, Reverb.ERROR_DECODE);
          }
        };

        this.context.decodeAudioData(arrayBuffer, decodeSuccessCallback, decodeErrorCallback);
      }
    };

    xhr.open('GET', rir, true);
    xhr.responseType = 'arraybuffer';  // XMLHttpRequest Level 2
    xhr.send(null);
  }
}
