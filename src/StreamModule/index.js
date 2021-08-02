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

        this.sources = [];   /** @type {Array.<MediaStreamAudioSourceNode|MediaStreamTrackAudioSourceNode>} */

        this.stream = null;  // for the instance of `MediaStream`

        // for `navigator.mediaDevices.getUserMedia`
        this.constraints = {
            'audio' : true,
            'video' : false
        };

        this.callbacks = {
            'stream' : () => {},
            'error'  : () => {}
        };

        this.each   = false;
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
                case 'each':
                    if (value === undefined) {
                        return this.each;
                    }

                    this.each = Boolean(value);

                    break;
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

    /**
     * This method opens devices or sets the instance of `MediaStream`.
     * @param {MediaStream} stream This argument is the instance of `MediaStream`.
     * @return {Promise} This is returned as `Promise` of `getUserMedia`.
     * @override
     */
    ready(stream) {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.MediaStream) {
            return Promise.reject('Cannot use WebRTC.');
        }

        this.isStop = false;

        if (stream instanceof MediaStream) {
            this.stream = stream;
            return Promise.resolve();
        }

        return navigator.mediaDevices.getUserMedia(this.constraints)
            .then(stream => {
                if (this.isStop) {
                    return;
                }

                this.stream = stream;

                this.callbacks.stream(stream);
            }).catch(error => {
                this.callbacks.error(error);
            });
    }

    /**
     * This method starts streaming.
     * @param {Array.<Effector>} connects This argument is the array for changing the default connection.
     * @param {function} processCallback This argument is in order to change `onaudioprocess` event handler in the instance of `ScriptProcessorNode`.
     * @return {Promise} This is returned as `Promise` of `getUserMedia`.
     * @override
     */
    start(connects, processCallback) {
        const bufferSize = this.processor.bufferSize;

        let runAnalyser = false;

        if (this.each) {
            // Get the instance of `MediaStreamTrack` for audio
            const audioTracks = this.stream.getAudioTracks();

            for (let i = 0, len = audioTracks.length; i < len; i++) {
                this.sources[i] = this.context.createMediaStreamTrackSource(audioTracks[i]);

                // MediaStreamTrackAudioSourceNode (Input) -> ScriptProcessorNode -> ... -> AudioDestinationNode (Output)
                this.sources[i].connect(this.processor);
                this.connect(this.processor, connects);
            }
        } else {
            this.sources[0] = this.context.createMediaStreamSource(this.stream);

            // MediaStreamAudioSourceNode (Input) -> ScriptProcessorNode -> ... -> AudioDestinationNode (Output)
            this.sources[0].connect(this.processor);
            this.connect(this.processor, connects);
        }

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

        if (!runAnalyser) {
            this.analyser.start('time');
            this.analyser.start('fft');
            runAnalyser = true;
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

        return this;
    }

    /**
     * This method stops streaming.
     * @return {StreamModule} This is returned for method chain.
     * @override
     */
    stop() {
        this.sources.length = 0;

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
     * This method gets the instance of `MediaStreamAudioSourceNode` or `MediaStreamTrackAudioSourceNode`.
     * @param {number} index This argument is required in the case of designating track.
     * @return {MediaStreamAudioSourceNode|MediaStreamTrackAudioSourceNode|Array.<MediaStreamTrackAudioSourceNode>}
     * @override
     */
    get(index) {
        const i = parseInt(index, 10);

        return ((i >= 0) && (i < this.sources.length)) ? this.sources[i] : this.sources;
    }

    /**
     * This method gets the instance of `MediaStream`.
     * @return {MediaStream}
     * @override
     */
    getStream() {
        return this.stream;
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
     * This method stops microphone and camera by stopping the instances of `MediaStreamTrack`.
     * @param {boolean} clearVideo This argument is in order to stop video (camera) if it is `true`.
     * @return {StreamModule} This is returned for method chain.
     * @override
     */
    clear(clearVideo) {
        if (this.stream === null) {
            return this;
        }

        this.stop();

        // Get the instance of `MediaStreamTrack` for audio
        const audioTracks = this.stream.getAudioTracks();

        for (const audioTrack of audioTracks) {
            audioTrack.stop();
        }

        if (clearVideo) {
            // Get the instance of `MediaStreamTrack` for video
            const videoTracks = this.stream.getVideoTracks();

            for (const videoTrack of videoTracks) {
                videoTrack.stop();
            }

            this.stream = null;
        }

        return this;
    }

    /**
     * This method gets available devices as array that contains the instances of `MediaDeviceInfo`.
     * @return {Promise} This is returned as `Promise` of `enumerateDevices`.
     */
    devices() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
            return Promise.reject('No devices.');
        }

        return navigator.mediaDevices.enumerateDevices();
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
