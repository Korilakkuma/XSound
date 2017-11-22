'use strict';

import AudioModule from '../AudioModule';

/**
 * This class defines properties for processing sound data from `HTMLMediaElement`.
 * Namely, this class creates audio player that has higher features from `HTMLMediaElement`.
 * But, this class is disadvantage to play the many one shot audios.
 * In the case of that, developer should use `OneshotModule`.
 * @constructor
 * @extends {AudioModule}
 */
export default class MediaModule extends AudioModule {
    static AUDIO = 'audio';
    static VIDEO = 'video';

    /**
     * @param {AudioContext} context This argument is in order to use the interfaces of Web Audio API.
     */
    constructor(context) {
        super(context);

        this.source = null;  // for the instance of `MediaElementAudioSourceNode`
        this.media  = null;  // for the instance of `HTMLMediaElement`
        this.ext    = '';    // 'wav', 'ogg', 'mp3, 'webm', 'ogv', 'mp4' ...etc

        this.playbackRate = 1;
        this.controls     = false;
        this.loop         = false;
        this.muted        = false;
        this.autoplay     = false;

        // The keys are the event interfaces that are defined by `HTMLMediaElement`.
        // For example, `loadstart`, `loadedmetadata`, `loadeddata`, `canplay`, `canplaythrough`, `timeupdate`, `ended` ...etc
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

        if (this.ext === '') {
            throw new Error('Media format that can be played does not exist.');
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
                    return this.media.duration;  // Getter only
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
     * @return {MediaModule} This is returned for method chain.
     * @override
     */
    ready(source) {
        const src = String(source);

        try {
            // `Data URL` or `Object URL` ?
            if ((src.indexOf('data:') !== -1) || (src.indexOf('blob:') !== -1)) {
                this.media.src = src;  // `Data URL` or `Object URL`
            } else {
                this.media.src = `${src}.${this.ext}`;  // Path
            }
        } catch (error) {
            throw new Error('The designated resource cannot be loaded.');
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
        if ((this.source instanceof MediaElementAudioSourceNode) && this.media.paused) {
            // MediaElementAudioSourceNode (Input) -> ScriptProcessorNode -> ... -> AudioDestinationNode (Output)
            this.source.connect(this.processor);
            this.connect(this.processor, connects);

            this.media.play();

            const pos = parseFloat(position);

            this.media.currentTime  = ((pos >= 0) && (pos <= this.media.duration)) ? pos : 0;
            this.media.playbackRate = this.playbackRate;
            this.media.controls     = this.controls;
            this.media.loop         = this.loop;
            this.media.muted        = this.muted;

            this.on(this.context.currentTime);

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
        }

        return this;
    }

    /**
     * This method stops media.
     * @return {MediaModule} This is returned for method chain.
     * @override
     */
    stop() {
        if ((this.source instanceof MediaElementAudioSourceNode) && !this.media.paused) {
            this.media.pause();

            this.off(this.context.currentTime);

            this.analyser.stop('time');
            this.analyser.stop('fft');

            // Stop `onaudioprocess` event
            this.processor.disconnect(0);
            this.processor.onaudioprocess = null;
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

    /** @override */
    toString() {
        return '[MediaModule]';
    }
}
