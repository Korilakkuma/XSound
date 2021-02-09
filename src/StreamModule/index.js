'use strict';

import { SoundModule } from '../SoundModule';
import { NoiseGate }  from './NoiseGate';
import { NoiseSuppressor }  from './NoiseSuppressor';

/**
 * This class defines properties that processes sound data from WebRTC in Web Audio API.
 * @constructor
 * @extends {SoundModule}
 */
export class StreamModule extends SoundModule {
    /**
     * @param {AudioContext} context This argument is in order to use the interfaces of Web Audio API.
     * @param {number} bufferSize This argument is buffer size for `ScriptProcessorNode`.
     */
    constructor(context, bufferSize) {
        super(context, bufferSize);

        // for the instance of `MediaStreamAudioSourceNode`
        this.source = null;

        // for `navigator.mediaDevices.getUserMedia`
        this.constraints = {
            'audio' : true,
            'video' : false
        };

        this.callbacks = {
            'stream' : () => {},
            'error'  : () => {}
        };

        this.output = true;

        this.isStop = true;

        this.noisegate       = new NoiseGate();
        this.noisesuppressor = new NoiseSuppressor();
    }

    /**
     * This method sets up for using WebRTC.
     * @param {object} constraints This argument is the 1st argument for `getUserMedia`.
     * @param {function} streamCallback This argument is invoked on streaming.
     * @param {function} errorCallback This argument is invoked when error occurs on streaming.
     * @return {StreamModule} This is returned for method chain.
     * @override
     */
    setup(constraints, streamCallback, errorCallback) {
        if (Object.prototype.toString.call(constraints) === '[object Object]') {
            this.constraints = constraints;
        }

        if (Object.prototype.toString.call(streamCallback) === '[object Function]') {
            this.callbacks.stream = streamCallback;
        }

        if (Object.prototype.toString.call(errorCallback) === '[object Function]') {
            this.callbacks.error = errorCallback;
        }

        return this;
    }

    /**
     * This method is getter or setter for parameters.
     * @param {string|object} key This argument is property name in the case of string type.
     *     This argument is pair of property and value in the case of associative array.
     * @param {number|boolean} value This argument is the value of designated property. If this argument is omitted, This method is getter.
     * @return {number|boolean|StreamModule} This is returned as the value of designated property in the case of getter. Otherwise, this is returned for method chain.
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

            switch (k) {
                case 'output':
                    if (value === undefined) {
                        return this.output;
                    }

                    this.output = Boolean(value);

                    break;
                default:
                    break;
            }
        }

        return this;
    }

    /** @override */
    ready() {
        return this;
    }

    /**
     * This method starts streaming.
     * @param {Array.<Effector>} connects This argument is the array for changing the default connection.
     * @param {function} processCallback This argument is in order to change `onaudioprocess` event handler in the instance of `ScriptProcessorNode`.
     * @return {Promise} This is returned as `Promise` of `getUserMedia`.
     * @override
     */
    start(connects, processCallback) {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            return Promise.reject('Cannot use WebRTC.');
        }

        const bufferSize = this.processor.bufferSize;

        let isAnalyser = false;

        const start = (stream, connects, processCallback) => {
            this.source = this.context.createMediaStreamSource(stream);

            // MediaStreamAudioSourceNode (Input) -> ScriptProcessorNode -> ... -> AudioDestinationNode (Output)
            this.source.connect(this.processor);
            this.connect(this.processor, connects);

            if (!this.output) {
                this.mastervolume.disconnect(0);

                // for analyser
                this.mastervolume.connect(this.analyser.input);

                // for recording
                this.mastervolume.connect(this.recorder.processor);
                this.recorder.processor.connect(this.context.destination);

                // for session
                this.mastervolume.connect(this.session.sender);
                this.session.sender.connect(this.context.destination);
            }

            this.on(this.context.currentTime);

            if (!isAnalyser) {
                this.analyser.start('time');
                this.analyser.start('fft');
                isAnalyser = true;
            }

            if (Object.prototype.toString.call(processCallback) === '[object Function]') {
                this.processor.onaudioprocess = processCallback;
            } else {
                this.processor.onaudioprocess = event => {
                    const inputLs  = event.inputBuffer.getChannelData(0);
                    const inputRs  = event.inputBuffer.getChannelData(1);
                    const outputLs = event.outputBuffer.getChannelData(0);
                    const outputRs = event.outputBuffer.getChannelData(1);

                    for (let i = 0; i < bufferSize; i++) {
                        outputLs[i] = this.noisegate.start(inputLs[i]);
                        outputRs[i] = this.noisegate.start(inputRs[i]);
                    }

                    this.noisesuppressor.start(inputLs, outputLs, bufferSize);
                    this.noisesuppressor.start(inputRs, outputRs, bufferSize);
                };
            }
        };

        this.isStop = false;

        return navigator.mediaDevices.getUserMedia(this.constraints)
            .then(stream => {
                if (this.isStop) {
                    return;
                }

                start(stream, connects, processCallback);
                this.callbacks.stream(stream);
            }).catch(error => {
                this.callbacks.error(error);
            });
    }

    /**
     * This method stops streaming.
     * @return {StreamModule} This is returned for method chain.
     * @override
     */
    stop() {
        this.source = null;

        this.off(this.context.currentTime, true);

        this.analyser.stop('time');
        this.analyser.stop('fft');

        // Stop `onaudioprocess` event
        this.processor.disconnect(0);
        this.processor.onaudioprocess = null;

        this.isStop = true;

        return this;
    }

    /**
     * This method gets the instance of `MediaStreamAudioSourceNode`.
     * @return {MediaStreamAudioSourceNode}
     * @override
     */
    get() {
        return this.source;
    }

    /**
     * This method starts or stops streaming according to current state.
     * @param {Array.<Effector>} connects This argument is the array for changing the default connection.
     * @param {function} processCallback This argument is in order to change `onaudioprocess` event handler in the instance of `ScriptProcessorNode`.
     * @return {StreamModule} This is returned for method chain.
     */
    toggle(connects, processCallback) {
        if (this.isStreaming()) {
            this.stop();
        } else {
            this.start(connects, processCallback);
        }

        return this;
    }

    /**
     * This method determines whether streaming is active.
     * @return {boolean} If streaming is active, this value is `true`. Otherwise, this value is `false`.
     */
    isStreaming() {
        return !this.isStop;
    }

    /** @override */
    params() {
        const params = super.params();

        params.stream = {
            'output'          : this.output,
            'noisegate'       : { 'level'     : this.noisegate.param('level') },
            'noisesuppressor' : { 'threshold' : this.noisesuppressor.param('threshold') }
        };

        return params;
    }

    /** @override */
    toString() {
        return '[StreamModule]';
    }
}
