'use strict';

import SoundModule from '../SoundModule';
import VocalCanceler from './VocalCanceler';

/**
 * This subclass defines properties for playing the single audio.
 * This class creates audio player that has higher features than `HTMLAudioElment`.
 * But, this class is disadvantage to play the many one shot audios.
 * In the case of that, developer should use `OneshotModule`.
 * @constructor
 * @extends {SoundModule}
 */
export default class AudioModule extends SoundModule {
    /**
     * @param {AudioContext} context This argument is in order to use the interfaces of Web Audio API.
     */
    constructor(context) {
        super(context);

        this.source = context.createBufferSource();  // for the instance of `AudioBufferSourceNode`
        this.buffer = null;                          // for the instance of `AudioBuffer`

        this.currentTime = 0;

        this.paused = true;

        this.callbacks = {
            'decode' : () => {},
            'ready'  : () => {},
            'start'  : () => {},
            'stop'   : () => {},
            'update' : () => {},
            'ended'  : () => {},
            'error'  : () => {}
        };

        this.vocalcanceler = new VocalCanceler();
    }

    /**
     * This method sets callback functions.
     * @param {string|object} key This argument is property name.
     *     This argument is pair of property and value in the case of associative array.
     * @param {function} value This argument is callback function.
     * @return {AudioModule} This is returned for method chain.
     * @override
     */
    setup(key, value) {
        if (Object.prototype.toString.call(arguments[0]) === '[object Object]') {
            // Associative array
            for (const k in arguments[0]) {
                this.setup(k, arguments[0][k]);
            }
        } else {
            const k = String(key).replace(/-/g, '').toLowerCase();

            if (k in this.callbacks) {
                if (Object.prototype.toString.call(value) === '[object Function]') {
                    this.callbacks[k] = value;
                }
            }
        }

        return this;
    }

    /**
     * This method is getter or setter for parameters.
     * @param {string|object} key This argument is property name in the case of string type.
     *     This argument is pair of property and value in the case of associative array.
     * @param {number|boolean} value This argument is the value of designated property. If this argument is omitted, This method is getter.
     * @return {number|AudioModule} This is returned as the value of designated property in the case of getter. Otherwise, this is returned for method chain.
     * @override
     */
    param(key, value) {
        if (Object.prototype.toString.call(arguments[0]) === '[object Object]') {
            // Associative array
            for (const k in arguments[0]) {
                this.param(k, arguments[0][k]);
            }
        } else {
            const k = String(key).replace(/-/g, '').toLowerCase();

            const r = super.param(k, value);

            if (r !== undefined) {
                return r;
            }

            let v   = 0;
            let min = 0;
            let max = 0;

            switch (k) {
                case 'playbackrate':
                    if (value === undefined) {
                        return this.source.playbackRate.value;
                    }

                    v   = parseFloat(value);
                    min = 0;
                    max = 1024;

                    if ((v >= min) && (v <= max)) {
                        this.source.playbackRate.value = v;
                    }

                    break;
                case 'loop'   :
                case 'looping':
                    if (value === undefined) {
                        return this.source.loop;
                    }

                    this.source.loop = Boolean(value);

                    break;
                case 'currenttime':
                    if (value === undefined) {
                        return this.currentTime;
                    }

                    if (this.buffer instanceof AudioBuffer) {
                        v   = parseFloat(value);
                        max = this.buffer.duration;
                        min = 0;

                        if ((v >= min) && (v <= max)) {
                            if (this.paused) {
                                this.currentTime = v;
                            } else {
                                this.stop();
                                this.start(v);
                            }
                        }
                    } else {
                        this.currentTime = 0;
                    }

                    break;
                case 'duration':
                    return (this.buffer instanceof AudioBuffer) ? this.buffer.duration : 0;  // Getter only
                case 'samplerate':
                    return (this.buffer instanceof AudioBuffer) ? this.buffer.sampleRate : this.sampleRate;  // Getter only
                case 'channels':
                    return (this.buffer instanceof AudioBuffer) ? this.buffer.numberOfChannels : 0;  // Getter only
                default:
                    break;
            }
        }

        return this;
    }

    /**
     * This method creates the instance of `AudioBuffer` from `ArrayBuffer`.
     * @param {ArrayBuffer} arrayBuffer This argument is the instance of `ArrayBuffer`.
     * @return {AudioModule} This is returned for method chain.
     * @override
     */
    ready(arrayBuffer) {
        if (arrayBuffer instanceof ArrayBuffer) {
            const successCallback = buffer => {
                this.buffer = buffer;

                this.analyser.start('timeOverviewL', buffer);
                this.analyser.start('timeOverviewR', buffer);

                this.callbacks.ready(buffer);
            };

            this.context.decodeAudioData(arrayBuffer, successCallback, this.callbacks.error);

            this.callbacks.decode(arrayBuffer);
        }

        return this;
    }

    /**
     * This method starts audio from the designated time.
     * @param {number} position This argument is the time that audio is started at. The default value is 0.
     * @param {Array.<Effector>} connects This argument is the array for changing the default connection.
     * @param {function} processCallback This argument is in order to change `onaudioprocess` event handler in the instance of `ScriptProcessorNode`.
     * @return {AudioModule} This is returned for method chain.
     * @override
     */
    start(position, connects, processCallback) {
        if ((this.buffer instanceof AudioBuffer) && this.paused) {
            const startTime = this.context.currentTime;

            const pos = parseFloat(position);

            this.currentTime = ((pos >= 0) && (pos <= this.buffer.duration)) ? pos : 0;

            const playbackRate = this.source.playbackRate.value;
            const loop         = this.source.loop;

            this.source = this.context.createBufferSource();

            // for legacy browsers
            this.source.start = this.source.start || this.source.noteGrainOn;
            this.source.stop  = this.source.stop  || this.source.noteOff;

            this.source.buffer             = this.buffer;
            this.source.playbackRate.value = playbackRate;
            this.source.loop               = loop;

            // AudioBufferSourceNode (Input) -> ScriptProcessorNode -> ... -> AudioDestinationNode (Output)
            this.source.connect(this.processor);
            this.connect(this.processor, connects);

            this.source.start(startTime, pos, (this.buffer.duration - pos));

            this.analyser.start('time');
            this.analyser.start('fft');

            this.paused = false;

            this.on(startTime);

            this.callbacks.start(this.source, this.currentTime);

            const bufferSize = this.processor.bufferSize;

            if (Object.prototype.toString.call(processCallback) === '[object Function]') {
                this.processor.onaudioprocess = processCallback;
            } else {
                this.processor.onaudioprocess = event => {
                    const inputLs  = event.inputBuffer.getChannelData(0);
                    const inputRs  = event.inputBuffer.getChannelData(1);
                    const outputLs = event.outputBuffer.getChannelData(0);
                    const outputRs = event.outputBuffer.getChannelData(1);

                    if (this.currentTime < Math.floor(this.source.buffer.duration)) {
                        for (let i = 0; i < bufferSize; i++) {
                            outputLs[i] = this.vocalcanceler.start(inputLs[i], inputRs[i]);
                            outputRs[i] = this.vocalcanceler.start(inputRs[i], inputLs[i]);

                            this.currentTime += ((1 * this.source.playbackRate.value) / this.source.buffer.sampleRate);

                            const index = Math.floor(this.currentTime * this.source.buffer.sampleRate);
                            const n100msec = 0.100 * this.source.buffer.sampleRate;

                            // Invoke callback every 100 msec
                            if ((index % n100msec) === 0) {
                                this.callbacks.update(this.source, this.currentTime);
                            }
                        }

                        this.analyser.timeOverviewL.update(this.currentTime);
                        this.analyser.timeOverviewR.update(this.currentTime);
                    } else {
                        if (this.source.loop) {
                            this.currentTime = 0;
                        } else {
                            this.end();
                        }
                    }
                };
            }
        }

        return this;
    }

    /**
     * This method stops audio.
     * @return {AudioModule} This is returned for method chain.
     * @override
     */
    stop() {
        if ((this.buffer instanceof AudioBuffer) && !this.paused) {
            const stopTime = this.context.currentTime;

            this.source.stop(stopTime);

            this.off(stopTime);

            this.analyser.stop('time');
            this.analyser.stop('fft');

            // Clear

            // Stop `onaudioprocess` event
            this.processor.disconnect(0);
            this.processor.onaudioprocess = null;

            this.paused = true;
            this.callbacks.stop(this.source, this.currentTime);
        }

        return this;
    }

    /**
     * This method gets the instance of `AudioBufferSourceNode`.
     * @return {AudioBufferSourceNode}
     * @override
     */
    get() {
        return this.source;
    }

    /**
     * This method starts or stops audio according to audio state.
     * @param {number} position This argument is the time that audio is started at. The default value is 0.
     * @param {Array.<Effector>} connects This argument is the array for changing the default connection.
     * @param {function} processCallback This argument is in order to change `onaudioprocess` event handler in the instance of `ScriptProcessorNode`.
     * @return {AudioModule} This is returned for method chain.
     */
    toggle(position, connects, processCallback) {
        if (this.paused) {
            this.start(position, connects, processCallback);
        } else {
            this.stop();
        }

        return this;
    }

    /**
     * This method rewinds audio.
     * @return {AudioModule} This is returned for method chain.
     */
    end() {
        this.stop();
        this.currentTime = 0;
        this.callbacks.ended(this.source, this.currentTime);

        return this;
    }

    /**
     * This method determines whether the instance of `AudioBuffer` exists.
     * @return {boolean} If the instance of `AudioBuffer` already exists, this value is `true`. Otherwise, this value is `false`.
     */
    isBuffer() {
        return this.buffer instanceof AudioBuffer;
    }

    /**
     * This method determines whether the instance of `AudioBufferSourceNode` exists.
     * @return {boolean} If the instance of `AudioBufferSourceNode` already exists, this value is `true`. Otherwise, this value is `false`.
     */
    isSource() {
        return (this.source instanceof AudioBufferSourceNode) && (this.source.buffer instanceof AudioBuffer);
    }

    /**
     * This method determines whether the audio is paused.
     * @return {boolean} If the audio is paused, this value is `true`. Otherwise, this value is `false`.
     */
    isPaused() {
        return this.paused;
    }

    /** @override */
    params() {
        const params = super.params();

        params.audio = {
            'playbackrate'  : this.isSource() ? this.source.playbackRate.value : 1,
            'vocalcanceler' : {
                'depth' : this.vocalcanceler.param('depth')
            }
        };

        return params;
    }

    /** @override */
    toString() {
        return '[AudioModule]';
    }
}
