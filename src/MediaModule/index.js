'use strict';

import { AudioModule }  from '../AudioModule';

/**
 * This class defines properties for processing sound data from `HTMLMediaElement`.
 * Namely, this class creates audio player that has higher features from `HTMLMediaElement`.
 * But, this class is disadvantage to play the many one shot audios.
 * In the case of that, developer should use `OneshotModule`.
 * @constructor
 * @extends {AudioModule}
 */
export class MediaModule extends AudioModule {
    static AUDIO = 'audio';
    static VIDEO = 'video';

    /**
     * @param {AudioContext} context This argument is in order to use the interfaces of Web Audio API.
     * @param {number} bufferSize This argument is buffer size for `ScriptProcessorNode`.
     */
    constructor(context, bufferSize) {
        super(context, bufferSize);

        this.source = null;  // for the instance of `MediaElementAudioSourceNode`
        this.media  = null;  // for the instance of `HTMLMediaElement`
        this.ext    = '';    // 'wav', 'ogg', 'mp3, 'webm', 'ogv', 'mp4' ...etc

        // for Audio Streaming
        this.mse      = null;  // for the instance of `MediaSource`
        this.sb       = null;  // for the instance of `SourceBuffer`
        this.file     = '';
        this.mimeType = '';

        this.playbackRate = 1;
        this.controls     = false;
        this.loop         = false;
        this.muted        = false;
        this.autoplay     = false;

        // The keys are the event interfaces that are defined by `HTMLMediaElement` or `MediaSource` or `SourceBuffer`.
        // For example, `loadstart`, `loadedmetadata`, `loadeddata`, `canplay`, `canplaythrough`, `timeupdate`, `ended`,
        // `sourceopen`, `sourceended`, `sourceclose`, `updateend`, `error` ... etc
        this.listeners = {};
    }

    /**
     * This method gets `HTMLMediaElement` and selects media format. In addition, this method adds event listeners that are defined by `HTMLMediaElement`.
     * @param {HTMLAudioElement|HTMLVideoElement} media This argument is either `HTMLAudioElement` or `HTMLVideoElement`.
     * @param {Array.<string>|string} formats This argument is usable media format. For example, 'wav', 'ogg', 'webm', 'mp4' ...etc.
     * @param {object} listeners This argument is event handlers that are defined by `HTMLMediaElement`.
     * @param {boolean} autoplay This argument is in order to determine autoplay. The default value is `false`.
     * @return {MediaModule} This is returned for method chain.
     * @override
     */
    setup(media, formats, listeners, autoplay) {
        this.envelopegenerator.setGenerator(0);
        this.envelopegenerator.param({
            'attack'  : 0,
            'decay'   : 0.01,
            'sustain' : 1,
            'release' : 0.01
        });

        // The argument is associative array ?
        if (Object.prototype.toString.call(arguments[0]) === '[object Object]') {
            const properties = arguments[0];

            if ('media' in properties) {
                media = properties.media;
            }

            if ('formats' in properties) {
                formats = properties.formats;
            }

            if ('listeners' in properties) {
                listeners = properties.listeners;
            }

            if ('autoplay' in properties) {
                autoplay = properties.autoplay;
            }
        }

        let type = '';

        if (media instanceof HTMLAudioElement) {
            type = MediaModule.AUDIO;
        } else if (media instanceof HTMLVideoElement) {
            type = MediaModule.VIDEO;
        } else {
            return this;
        }

        this.media = media;

        if (!Array.isArray(formats)) {
            formats = [formats];
        }

        for (const format of formats) {
            const f = `${type}/${String(format).toLowerCase()}`;

            if (/^(?:maybe|probably)/.test(this.media.canPlayType(f))) {
                this.ext = format;
                break;
            }
        }

        if (Object.prototype.toString.call(listeners) === '[object Object]') {
            for (const k in listeners) {
                this.listeners[k.toLowerCase()] = (Object.prototype.toString.call(listeners[k]) === '[object Function]') ? listeners[k] : () => {};
            }
        }

        this.autoplay = Boolean(autoplay);

        // in the case of autoplay, `loadstart` event not fire
        if (this.autoplay && !(this.source instanceof MediaElementAudioSourceNode)) {
            this.source = this.context.createMediaElementSource(this.media);
        }

        if (this.autoplay && this.media.src) {
            this.context.resume()
                .then(() => {
                    this.start(this.media.currentTime);
                })
                .catch(() => {
                    throw new Error('Autoplay is failed');
                });
        }

        this.media.addEventListener('loadstart', event => {
            // To create the instance of `MediaElementAudioSourceNode` again causes error to occur
            if (!(this.source instanceof MediaElementAudioSourceNode)) {
                this.source = this.context.createMediaElementSource(this.media);
            }

            if ('loadstart' in this.listeners) {
                this.listeners.loadstart(event);
            }
        }, false);

        this.media.addEventListener('ended', event => {
            this.media.pause();

            this.off(this.context.currentTime);

            this.analyser.stop('time');
            this.analyser.stop('fft');

            // Stop `onaudioprocess` event
            this.processor.disconnect(0);
            this.processor.onaudioprocess = null;

            if ('ended' in this.listeners) {
                this.listeners.ended(event);
            }
        }, false);

        for (const k in this.listeners) {
            this.media.addEventListener(k, event => {
                this.listeners[(event.type).toLowerCase()](event);
            }, false);
        }

        return this;
    }

    /**
     * This method is getter or setter for parameters.
     * @param {string|object} key This argument is property name in the case of string type.
     *     This argument is pair of property and value in the case of associative array.
     * @param {number|boolean} value This argument is the value of designated property. If this argument is omitted, This method is getter.
     * @return {number|boolean|MediaModule} This is returned as the value of designated property in the case of getter. Otherwise, this is returned for method chain.
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

            let r;

            if (k === 'mastervolume') {
                r = super.param(k, value);
            }

            if (r !== undefined) {
                return r;
            }

            let v   = null;
            let min = null;
            let max = null;

            switch (k) {
                case 'playbackrate':
                    if (value === undefined) {
                        return (this.media instanceof HTMLMediaElement) ? this.media.playbackRate : this.playbackRate;
                    }

                    v   = parseFloat(value);
                    min = 0.5;  // for Chrome

                    if (v >= min) {
                        if (this.media instanceof HTMLMediaElement) {
                            this.media.playbackRate = v;
                        }

                        this.playbackRate = v;

                        const startTime   = this.context.currentTime;
                        const currentTime = this.param('currentTime');
                        const duration    = this.param('duration');

                        this.envelopegenerator.start(startTime);

                        // `duration` is infinite in the case of audio streaming
                        if (isFinite(duration)) {
                            this.envelopegenerator.stop((startTime + ((duration - currentTime) / v)), true);
                        }
                    }

                    break;
                case 'currenttime':
                    if (value === undefined) {
                        return (this.media instanceof HTMLMediaElement) ? this.media.currentTime : 0;
                    }

                    if (this.media instanceof HTMLMediaElement) {
                        v   = parseFloat(value);
                        min = 0;
                        max = this.media.duration;

                        if ((v >= min) && (v <= max)) {
                            this.media.currentTime = v;

                            const startTime    = this.context.currentTime;
                            const duration     = this.param('duration');
                            const playbackRate = this.param('playbackRate');

                            this.envelopegenerator.start(startTime);

                            // `duration` is infinite in the case of audio streaming
                            if (isFinite(duration)) {
                                this.envelopegenerator.stop((startTime + ((duration - v) / playbackRate)), true);
                            }
                        }
                    }

                    break;
                case 'loop'    :
                case 'muted'   :
                case 'controls':
                    if (value === undefined) {
                        return (this.media instanceof HTMLMediaElement) ? this.media[k] : this[k];
                    }

                    if (this.media instanceof HTMLMediaElement) {
                        this.media[k] = Boolean(value);
                    }

                    this[k] = Boolean(value);

                    break;
                case 'width' :
                case 'height':
                    if (value === undefined) {
                        return (this.media instanceof HTMLVideoElement) ? this.media[k] : 0;
                    }

                    v   = parseInt(value, 10);
                    min = 0;

                    if (v >= min) {
                        if (this.media instanceof HTMLVideoElement) {
                            this.media[k] = v;
                        }
                    }

                    break;
                case 'duration':
                    return this.media && this.media.duration ? this.media.duration : 0;  // Getter only
                case 'channels':
                    return (this.source instanceof MediaElementAudioSourceNode) ? this.source.channelCount : 0;  // Getter only
                default:
                    break;
            }
        }

        return this;
    }

    /**
     * This method prepares for playing the media anytime after loading the media resource.
     * @param {string} source This argument is path name or `Data URL` or `Object URL` for the media resource.
     * @param {string} mimeType This argument is required in the case of audio streaming.
     * @return {MediaModule} This is returned for method chain.
     * @override
     */
    ready(source, mimeType) {
        const src = String(source);

        if (this.mse && (this.mse.readyState === 'open')) {
            this.mse.endOfStream();
            window.URL.revokeObjectURL(this.media.src);

            this.mse.removeEventListener('sourceopen',  this.onSourceOpen,  false);
            this.mse.removeEventListener('sourceended', this.onSourceEnded, false);
            this.mse.removeEventListener('sourceclose', this.onSourceClose, false);

            this.sb.removeEventListener('updateend', this.onSourceBufferUpdateEnd, false);
            this.sb.removeEventListener('error',     this.onSourceBufferError,     false);
        }

        try {
            if (mimeType) {
                // Audio Streaming
                if (!MediaSource || !MediaSource.isTypeSupported(mimeType)) {
                    throw new Error('This Browser does not support `MediaSource` or MIME type');
                }

                this.media.removeAttribute('src');

                this.media.load();

                this.mse       = new MediaSource();
                this.media.src = window.URL.createObjectURL(this.mse);
                this.mimeType  = mimeType;
                this.file      = src;

                this.onSourceOpen  = this.onSourceOpen.bind(this);
                this.onSourceEnded = this.onSourceEnded.bind(this);
                this.onSourceClose = this.onSourceClose.bind(this);

                this.mse.addEventListener('sourceopen',  this.onSourceOpen,  false);
                this.mse.addEventListener('sourceended', this.onSourceEnded, false);
                this.mse.addEventListener('sourceclose', this.onSourceClose, false);
            } else if ((src.indexOf('data:') !== -1) || (src.indexOf('blob:') !== -1) || (this.ext === '')) {
                // `Data URL` or `Object URL` or Full path
                this.media.src = src;
            } else {
                // Path
                this.media.src = `${src}.${this.ext}`;
            }
        } catch (error) {
            throw new Error(error.message);
        }

        return this;
    }

    /**
     * This method starts media from the designated time.
     * @param {number} position This argument is the time that media is started at. The default value is 0.
     * @param {Array.<Effector>} connects This argument is the array for changing the default connection.
     * @param {function} processCallback This argument is in order to change `onaudioprocess` event handler in the instance of `ScriptProcessorNode`.
     * @return {MediaModule} This is returned for method chain.
     * @override
     */
    start(position, connects, processCallback) {
        if (this.source instanceof MediaElementAudioSourceNode) {
            // MediaElementAudioSourceNode (Input) -> GainNode (Envelope Generator) -> ScriptProcessorNode -> ... -> AudioDestinationNode (Output)
            this.envelopegenerator.ready(0, this.source, this.processor);
            this.connect(this.processor, connects);

            const promise = this.media.play();

            promise.then(() => {
                const startTime = this.context.currentTime;

                const pos = parseFloat(position);

                this.media.currentTime  = ((pos >= 0) && (pos <= this.media.duration)) ? pos : 0;
                this.media.playbackRate = this.playbackRate;
                this.media.controls     = this.controls;
                this.media.loop         = this.loop;
                this.media.muted        = this.muted;

                this.envelopegenerator.start(startTime);

                // `duration` is infinite in the case of audio streaming
                if (isFinite(this.media.duration)) {
                    this.envelopegenerator.stop((startTime + ((this.media.duration - pos) / this.media.playbackRate)), true);
                }

                this.on(startTime);

                this.analyser.start('time');
                this.analyser.start('fft');

                const bufferSize = this.processor.bufferSize;

                if (Object.prototype.toString.call(processCallback) === '[object Function]') {
                    this.processor.onaudioprocess = processCallback;
                } else {
                    this.processor.onaudioprocess = event => {
                        const inputLs  = event.inputBuffer.getChannelData(0);
                        const inputRs  = event.inputBuffer.getChannelData(1);
                        const outputLs = event.outputBuffer.getChannelData(0);
                        const outputRs = event.outputBuffer.getChannelData(1);

                        for (let i = 0; i < bufferSize; i++) {
                            outputLs[i] = this.vocalcanceler.start(inputLs[i], inputRs[i]);
                            outputRs[i] = this.vocalcanceler.start(inputRs[i], inputLs[i]);
                        }
                    };
                }
            }).catch(() => {
                this.stop(() => {
                    if (this.autoplay) {
                        this.media.muted  = this.muted = true;
                        this.media.volume = 0;
                    }

                    this.start(position, connects, processCallback);
                }, () => {
                });
            });
        }

        return this;
    }

    /**
     * This method stops media.
     * @param {function} successCallback This argument is invoked when `HTMLMediaElement#play` is successful.
     * @param {function} errorCallback This argument is invoked when `HTMLMediaElement#play` is failure.
     * @return {MediaModule} This is returned for method chain.
     * @override
     */
    stop(successCallback, errorCallback) {
        if (this.source instanceof MediaElementAudioSourceNode) {
            // ref: https://developers.google.com/web/updates/2017/06/play-request-was-interrupted
            this.media.play()
                .then(() => {
                    this.media.pause();

                    this.off(this.context.currentTime);

                    this.analyser.stop('time');
                    this.analyser.stop('fft');

                    // Stop `onaudioprocess` event
                    this.processor.disconnect(0);
                    this.processor.onaudioprocess = null;

                    if (Object.prototype.toString.call(successCallback) === '[object Function]') {
                        successCallback();
                    }

                    return Promise.resolve();
                })
                .catch(error => {
                    if (Object.prototype.toString.call(errorCallback) === '[object Function]') {
                        errorCallback(error);
                    }

                    return Promise.reject(error);
                });
        }

        return this;
    }

    /**
     * This method gets the instance of `MediaElementAudioSourceNode`.
     * @return {MediaElementAudioSourceNode}
     * @override
     */
    get() {
        return this.source;
    }

    /**
     * This method starts or stops media according to media state.
     * @param {number} position This argument is time that media is started at.
     * @param {Array.<Effector>} connects This argument is the array for changing the default connection.
     * @param {function} processCallback This argument is in order to change `onaudioprocess` event handler in the instance of `ScriptProcessorNode`.
     * @return {MediaModule} This is returned for method chain.
     * @override
     */
    toggle(position, connects, processCallback) {
        if (this.media.paused) {
            this.start(position, connects, processCallback);
        } else {
            this.stop();
        }

        return this;
    }

    /**
     * This method determines whether the instance of `HTMLMediaElement` exists.
     * @return {boolean} If the instance of `HTMLMediaElement` already exists, this value is `true`. Otherwise, this value is `false`.
     */
    isMedia() {
        return this.media instanceof HTMLMediaElement;
    }

    /**
     * This method determines whether the instance of `MediaElementAudioSourceNode` exists.
     * @return {boolean} If the instance of `MediaElementAudioSourceNode` already exists, this value is `true`. Otherwise, this value is `false`.
     * @override
     */
    isSource() {
        return this.source instanceof MediaElementAudioSourceNode;
    }

    /**
     * This method determines whether the media is paused.
     * @return {boolean} If the media is paused or does not exists, this value is `true`. Otherwise, this value is `false`.
     * @override
     */
    isPaused() {
        return (this.media instanceof HTMLMediaElement) ? this.media.paused : true;
    }

    /**
     * This method is event listener for `MediaSource`
     * @param {Event} event This argument is the instance of `Event`.
     */
    onSourceOpen(event) {
        this.sb = this.mse.addSourceBuffer(this.mimeType);

        this.sb.mode = 'sequence';

        this.onSourceBufferUpdateEnd = this.onSourceBufferUpdateEnd.bind(this);
        this.onSourceBufferError     = this.onSourceBufferError.bind(this);

        this.sb.addEventListener('updateend', this.onSourceBufferUpdateEnd, false);
        this.sb.addEventListener('error',     this.onSourceBufferError,     false);

        if ('sourceopen' in this.listeners) {
            this.listeners.sourceopen(event);
        }

        const request = new Request(this.file);

        fetch(request)
            .then(response => {
                return response.arrayBuffer();
            })
            .then(data => {
                this.sb.appendBuffer(data);
            })
            .catch(error => {
                if ('error' in this.listeners) {
                    this.listeners.error(event, error);
                }
            });
    }

    /**
     * This method is event listener for `MediaSource`
     * @param {Event} event This argument is the instance of `Event`.
     */
    onSourceEnded(event) {
        if ('sourceended' in this.listeners) {
            this.listeners.sourceended(event);
        }
    }

    /**
     * This method is event listener for `MediaSource`
     * @param {Event} event This argument is the instance of `Event`.
     */
    onSourceClose(event) {
        if ('sourceclose' in this.listeners) {
            this.listeners.sourceclose(event);
        }
    }

    /**
     * This method is event listener for `SourceBuffer`
     * @param {Event} event This argument is the instance of `Event`.
     */
    onSourceBufferUpdateEnd(event) {
        if ('updateend' in this.listeners) {
            this.listeners.updateend(event);
        }
    }

    /**
     * This method is event listener for `SourceBuffer`
     * @param {Event} event This argument is the instance of `Event`.
     */
    onSourceBufferError(event) {
        if ('error' in this.listeners) {
            this.listeners.error(event);
        }
    }

    /** @override */
    params() {
        const params = super.params();

        params.media = {
            'playbackrate'  : this.playbackRate,
            'vocalcanceler' : {
                'depth' : this.vocalcanceler.param('depth')
            }
        };

        delete params.audio;

        return params;
    }

    /**
     * This method requests Picture In Picture (PIP).
     * @return {Promise} This is returned as `Promise`.
     */
    requestPictureInPicture() {
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
     * @return {Promise} This is returned as `Promise`.
     */
    exitPictureInPicture() {
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

    /** @override */
    toString() {
        return '[MediaModule]';
    }
}
