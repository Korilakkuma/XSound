'use strict';

import { Effector } from './Effector';

/**
 * Effector's subclass
 * @constructor
 * @extends {Effector}
 */
export class Reverb extends Effector {
    static ERROR_AJAX         = 'error';
    static ERROR_AJAX_TIMEOUT = 'timeout';
    static ERROR_DECODE       = 'decode';

    /**
     * @param {AudioContext} context This argument is in order to use the interfaces of Web Audio API.
     * @param {number} bufferSize This argument is buffer size for `ScriptProcessorNode`.
     */
    constructor(context, bufferSize) {
        super(context, bufferSize);

        this.rirs      = [];
        this.convolver = context.createConvolver();
        this.dry       = context.createGain();
        this.wet       = context.createGain();
        this.tone      = context.createBiquadFilter();

        // Initialize parameters
        this.dry.gain.value       = 1;
        this.wet.gain.value       = 0;
        this.tone.type            = (typeof this.tone.type === 'string') ? 'lowpass' : (this.tone.LOWPASS || 0);
        this.tone.frequency.value = 350;
        this.tone.Q.value         = Math.SQRT1_2;
        this.tone.gain.value      = 0;  // Not used

        // `Reverb` is not connected by default
        this.state(false);
    }

    /** @override */
    param(key, value) {
        if (Object.prototype.toString.call(arguments[0]) === '[object Object]') {
            // Associative array
            for (const k in arguments[0]) {
                this.param(k, arguments[0][k]);
            }
        } else {
            const k = String(key).replace(/-/g, '').toLowerCase();

            let v   = null;
            let min = null;
            let max = null;

            switch (k) {
                case 'type':
                    if (value === undefined) {
                        return this.convolver.buffer;
                    }

                    v   = parseInt(value, 10);
                    min = 0;
                    max = this.rirs.length - 1;

                    if (value === null) {
                        this.convolver.buffer = null;

                        // If `buffer` in `ConvolverNode` is `null` after setting the instance of `AudioBuffer`, `Reverb` is not OFF.
                        // Therefore, `Reverb` is OFF by disconnecting nodes.
                        this.input.disconnect(0);
                        this.input.connect(this.output);
                    } else if ((v >= min) && (v <= max)) {
                        this.convolver.buffer = this.rirs[v];
                        this.connect();
                    }

                    break;
                case 'dry':
                case 'wet':
                    if (value === undefined) {
                        return this[k].gain.value;
                    }

                    v   = parseFloat(value);
                    min = 0;
                    max = 1;

                    if ((v >= min) && (v <= max)) {
                        this[k].gain.value = v;
                    }

                    break;
                case 'tone':
                    if (value === undefined) {
                        return this.tone.frequency.value;
                    }

                    v   = parseFloat(value);
                    min = 10;
                    max = this.context.sampleRate / 2;

                    if ((v >= min) && (v <= max)) {
                        this.tone.frequency.value = v;
                    }

                    break;
                case 'rirs':
                    return this.rirs;  // Getter only
                default:
                    break;
            }
        }

        return this;
    }

    /** @override */
    connect() {
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

            // GainNode (Input) -> BiquadFilterNode (Tone) -> ConvolverNode -> GainNode (Mix) -> GainNode (Output)
            this.input.connect(this.tone);
            this.tone.connect(this.convolver);
            this.convolver.connect(this.wet);
            this.wet.connect(this.output);
        } else {
            // Effect OFF

            // GainNode (Input) -> GainNode (Output)
            this.input.connect(this.output);
        }

        return this;
    }

    /**
     * This method sets instance of `AudioBuffer` to `ConvolverNode`.
     * @param {AudioBuffer|ArrayBuffer} impulse This argument is in order to convolve impulse response.
     *     This argument is the instance of `AudioBuffer` or `ArrayBuffer` for impulse response.
     * @param {function} errorCallback This argument is in order to be invoked when error occurs.
     * @return {Reverb} This is returned for method chain.
     * @override
     */
    start(impulse, errorCallback) {
        if ((impulse instanceof AudioBuffer) || (impulse === null)) {
            this.convolver.buffer = impulse;
            this.rirs.push(impulse);  // Add to preset
        } else if (impulse instanceof ArrayBuffer) {
            const successCallback = buffer => {
                this.convolver.buffer = buffer;
                this.rirs.push(buffer);  // Add to preset
            };

            if (Object.prototype.toString.call(errorCallback) !== '[object Function]') {
                errorCallback = () => {};
            }

            this.context.decodeAudioData(impulse, successCallback, errorCallback);
        }

        return this;
    }

    /**
     * This method creates the instances of `AudioBuffer` by Ajax for Revreb presets.
     * @param {Array.<string>|Array.<AudioBuffer>} rirs This argument is either URLs or the instances of `AudioBuffer` for impulse response.
     * @param {number} timeout This argument is timeout of Ajax. The default value is 60000 msec (1 minutes).
     * @param {function} successCallback This argument is invoked when the creating the instances of `AudioBuffer` was completed.
     * @param {function} errorCallback This argument is invoked when error occurred.
     * @param {function} progressCallback This argument is invoked during receiving audio data.
     * @return {Reverb} This is returned for method chain.
     */
    preset(rirs, timeout, successCallback, errorCallback, progressCallback) {
        // The argument is associative array ?
        if (Object.prototype.toString.call(arguments[0]) === '[object Object]') {
            const properties = arguments[0];

            if ('rirs' in properties) {
                rirs = properties.rirs;
            }

            if ('timeout' in properties) {
                timeout = properties.timeout;
            }

            if ('success' in properties) {
                successCallback = properties.success;
            }

            if ('error' in properties) {
                errorCallback = properties.error;
            }

            if ('progress' in properties) {
                progressCallback = properties.progress;
            }
        }

        if (!Array.isArray(rirs)) {
            rirs = [rirs];
        }

        this.rirs = new Array(rirs.length);

        // If the error is at least 1, this method aborts the all of connections.
        // Therefore, this flag are shared with the all instances of `XMLHttpRequest`.
        let isError = false;

        const t = parseInt(timeout, 10);

        // Get `ArrayBuffer` by Ajax -> Create the instances of `AudioBuffer`
        const load = (url, index) => {
            const xhr = new XMLHttpRequest();

            xhr.timeout = (t > 0) ? t : 60000;

            xhr.ontimeout = event => {
                if (!isError && (Object.prototype.toString.call(errorCallback) === '[object Function]')) {
                    errorCallback(event, Reverb.ERROR_AJAX_TIMEOUT);
                }

                isError = true;
            };

            xhr.onprogresss = event => {
                if (isError) {
                    xhr.abort();
                } else if (Object.prototype.toString.call(progressCallback) === '[object Function]') {
                    progressCallback(event);
                }
            };

            xhr.onerror = event => {
                if (!isError && (Object.prototype.toString.call(errorCallback) === '[object Function]')) {
                    errorCallback(event, Reverb.ERROR_AJAX);
                }

                isError = true;
            };

            xhr.onload = event => {
                if (xhr.status === 200) {
                    const arrayBuffer = xhr.response;

                    if (!(arrayBuffer instanceof ArrayBuffer)) {
                        return;
                    }

                    const decodeSuccessCallback = audioBuffer => {
                        this.rirs[index] = audioBuffer;

                        // The creating the instances of `AudioBuffer` has completed ?
                        for (let i = 0, len = this.rirs.length; i < len; i++) {
                            if (this.rirs[i] === undefined) {
                                return;
                            }
                        }

                        if (Object.prototype.toString.call(successCallback) === '[object Function]') {
                            successCallback(event);
                        }
                    };

                    const decodeErrorCallback = error => {
                        if (Object.prototype.toString.call(errorCallback) === '[object Function]') {
                            errorCallback(error, Reverb.ERROR_DECODE);
                        }
                    };

                    this.context.decodeAudioData(arrayBuffer, decodeSuccessCallback, decodeErrorCallback);
                }
            };

            xhr.open('GET', url, true);
            xhr.responseType = 'arraybuffer';  // XMLHttpRequest Level 2
            xhr.send(null);
        };

        for (let i = 0, len = rirs.length; i < len; i++) {
            if (typeof rirs[i] === 'string') {
                // Get the instances of `AudioBuffer` from the designated URLs.
                load(rirs[i], i);
            } else if (rirs[i] instanceof AudioBuffer) {
                // Get the instances of `AudioBuffer` directly
                this.rirs[i] = rirs[i];
            }
        }

        return this;
    }

    /** @override */
    state(state) {
        if (state === undefined) {
            return this.isActive;
        }

        if (String(state).toLowerCase() === 'toggle') {
            this.isActive = !this.isActive;
        } else {
            this.isActive = Boolean(state);
        }

        // Change connection
        this.connect();

        return this;
    }

    /** @override */
    params() {
        const params = {
            'state' : this.isActive,
            'dry'   : this.dry.gain.value,
            'wet'   : this.wet.gain.value,
            'tone'  : this.tone.frequency.value
        };

        return params;
    }

    /** @override */
    toString() {
        return '[SoundModule Reverb]';
    }
}
