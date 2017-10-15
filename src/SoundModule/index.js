'use strict';

import Analyser from './Analyser';
import Recorder from './Recorder';
import Session from './Session';
import Compressor from './Compressor';
import Distortion from './Distortion';
import Wah from './Wah';
import Equalizer from './Equalizer';
import Filter from './Filter';
import Autopanner from './Autopanner';
import AutopannerFallback from './AutopannerFallback';
import Tremolo from './Tremolo';
import Ringmodulator from './Ringmodulator';
import Phaser from './Phaser';
import Flanger from './Flanger';
import Chorus from './Chorus';
import Delay from './Delay';
import Reverb from './Reverb';
import Panner from './Panner';
import Listener from './Listener';
import EnvelopeGenerator from './EnvelopeGenerator';

/**
 * This class is superclass that is the top in this library.
 * This library's users do not create the instance of `SoundModule`.
 * This class is used for inherit in subclass (`OscillatorModule`, `OneshotModule`, `AudioModule`, `MediaModule`, `StreamModule`, `MixerModule`).
 * Therefore, this class defines the common properties for each sound sources.
 * @constructor
 */
export default class SoundModule {
    static NUMBER_OF_INPUTS  = 2;
    static NUMBER_OF_OUTPUTS = 2;

    /**
     * @param {AudioContext} context This argument is in order to use the interfaces of Web Audio API.
     * @param {number} bufferSize This argument is buffer size for `ScriptProcessorNode`.
     *     This value is one of 256, 512, 1024, 2048, 4096, 8192, 16384.
     *     However, the opportunity for designating buffer size is not so much.
     *     The reason why is that the constructor of `SoundModule` selects buffer size automaticly.
     *     This buffer size can be changed explicitly by calling `resize` method.
     */
    constructor(context, bufferSize) {
        this.context    = context;
        this.sampleRate = context.sampleRate;

        const userAgent = navigator.userAgent;

        if (bufferSize !== undefined) {
            switch (parseInt(bufferSize, 10)) {
                case   256:
                case   512:
                case  1024:
                case  2048:
                case  4096:
                case  8192:
                case 16384:
                    this.bufferSize = parseInt(bufferSize, 10);
                    break;
                default:
                    return;
            }
        } else if (/(Win(dows )?NT 6\.2)/.test(userAgent)) {
            this.bufferSize = 1024;  // Windows 8
        } else if (/(Win(dows )?NT 6\.1)/.test(userAgent)) {
            this.bufferSize = 1024;  // Windows 7
        } else if (/(Win(dows )?NT 6\.0)/.test(userAgent)) {
            this.bufferSize = 2048;  // Windows Vista
        } else if (/Win(dows )?(NT 5\.1|XP)/.test(userAgent)) {
            this.bufferSize = 4096;  // Windows XP
        } else if (/Mac|PPC/.test(userAgent)) {
            this.bufferSize = 1024;  // Mac OS X
        } else if (/Linux/.test(userAgent)) {
            this.bufferSize = 8192;  // Linux
        } else if (/iPhone|iPad|iPod/.test(userAgent)) {
            this.bufferSize = 2048;  // iOS
        } else {
            this.bufferSize = 16384;  // Otherwise
        }

        this.mastervolume = context.createGain();
        this.processor    = context.createScriptProcessor(this.bufferSize, SoundModule.NUMBER_OF_INPUTS, SoundModule.NUMBER_OF_OUTPUTS);

        this.analyser          = new Analyser(context);
        this.recorder          = new Recorder(context, this.bufferSize, SoundModule.NUMBER_OF_INPUTS, SoundModule.NUMBER_OF_OUTPUTS);
        this.session           = new Session(context, this.bufferSize, SoundModule.NUMBER_OF_INPUTS, SoundModule.NUMBER_OF_OUTPUTS, this.analyser);
        this.compressor        = new Compressor(context, this.bufferSize);
        this.distortion        = new Distortion(context, this.bufferSize);
        this.wah               = new Wah(context, this.bufferSize);
        this.equalizer         = new Equalizer(context, this.bufferSize);
        this.filter            = new Filter(context, this.bufferSize);
        this.autopanner        = context.createStereoPanner ? new Autopanner(context, this.bufferSize) : new AutopannerFallback(context, this.bufferSize);
        this.tremolo           = new Tremolo(context, this.bufferSize);
        this.ringmodulator     = new Ringmodulator(context, this.bufferSize);
        this.phaser            = new Phaser(context, this.bufferSize);
        this.flanger           = new Flanger(context, this.bufferSize);
        this.chorus            = new Chorus(context, this.bufferSize);
        this.delay             = new Delay(context, this.bufferSize);
        this.reverb            = new Reverb(context, this.bufferSize);
        this.panner            = new Panner(context, this.bufferSize);
        this.listener          = new Listener(context);
        this.envelopegenerator = new EnvelopeGenerator(context);  // for `OscillatorModule`, `OneshotModule`

        // The default order for connection
        this.modules = [
            this.compressor,
            this.distortion,
            this.wah,
            this.equalizer,
            this.filter,
            this.autopanner,
            this.tremolo,
            this.ringmodulator,
            this.phaser,
            this.flanger,
            this.chorus,
            this.delay,
            this.reverb,
            this.panner
        ];
    }

    /** @abstract */
    setup() {
    }

    /**
     * This method is getter or setter for parameters.
     * @param {string} key This argument is property name.
     * @param {number} value This argument is the value of designated property. If this argument is omitted, This method is getter.
     * @return {number} This is returned as the value of designated property in the case of getter.
     */
    param(key, value) {
        const k = String(key).replace(/-/g, '').toLowerCase();

        let v   = null;
        let min = null;
        let max = null;

        switch (k) {
            case 'mastervolume':
                if (value === undefined) {
                    return this.mastervolume.gain.value;
                }

                v   = parseFloat(value);
                min = 0;
                max = 1;

                if ((v >= min) && (v <= max)) {
                    this.mastervolume.gain.value = v;
                }

                break;
            default:
                break;
        }
    }

    /** @abstract */
    ready() {
    }

    /** @abstract */
    start() {
    }

    /** @abstract */
    stop() {
    }

    /** @abstract */
    get() {
    }

    /**
     * This method changes buffer size for `ScriptProcessorNode`.
     * @param {number} bufferSize This argument is buffer size for `ScriptProcessorNode`.
     *     This value is one of 256, 512, 1024, 2048, 4096, 8192, 16384.
     * @return {SoundModule} This is returned for method chain.
     */
    resize(bufferSize) {
        this.processor = this.context.createScriptProcessor(bufferSize, SoundModule.NUMBER_OF_INPUTS, SoundModule.NUMBER_OF_OUTPUTS);
        return this;
    }

    /**
     * This method gets buffer size for `ScriptProcessorNode`.
     * @return {number} This is returned as buffer size for `ScriptProcessorNode`.
     */
    getBufferSize() {
        return this.processor.bufferSize;
    }

    /**
     * This method connects nodes that are defined by this library and Web Audio API.
     * @param {AudioNode} source This argument is `AudioNode` for input of sound.
     * @param {Array.<Effector>} connects This argument is array for changing the default connection.
     * @return {SoundModule} This is returned for method chain.
     */
    connect(source, connects) {
        // Customize connection ?
        if (Array.isArray(connects)) {
            this.modules = connects;
        }

        // Start connection
        // AudioSourceNode (Input)-> node -> ... -> node -> GainNode (Master Volume) -> AnalyserNode  -> AudioDestinationNode (Output)
        source.disconnect(0);  // Clear connection

        if (this.modules.length > 0) {
            source.connect(this.modules[0].input);
        } else {
            source.connect(this.mastervolume);
        }

        for (let i = 0, len = this.modules.length; i < len; i++) {
            // Clear connection
            this.modules[i].output.disconnect(0);

            if (i < (this.modules.length - 1)) {
                // Connect to next node
                this.modules[i].output.connect(this.modules[i + 1].input);
            } else {
                this.modules[i].output.connect(this.mastervolume);
            }
        }

        this.mastervolume.connect(this.context.destination);

        // for analyser
        this.mastervolume.connect(this.analyser.input);

        // for recording
        this.mastervolume.connect(this.recorder.processor);
        this.recorder.processor.connect(this.context.destination);

        // for session
        this.mastervolume.connect(this.session.sender);
        this.session.sender.connect(this.context.destination);

        return this;
    }

    /**
     * This method gets the instance of module that is defined by this library. This method enables to access the instance of module by unified call.
     * @param {string} module This argument is module's name.
     * @return {Analyser|Recorder|Session|Effector|Listener|EnvelopeGenerator|Glide|VocalCanceler|NoiseGate} This value is the instance of module.
     */
    module(module) {
        const m = String(module).replace(/-/g, '').toLowerCase();

        switch (m) {
            case 'analyser'     :
            case 'recorder'     :
            case 'session'      :
            case 'compressor'   :
            case 'distortion'   :
            case 'wah'          :
            case 'equalizer'    :
            case 'filter'       :
            case 'autopanner'   :
            case 'tremolo'      :
            case 'ringmodulator':
            case 'phaser'       :
            case 'flanger'      :
            case 'chorus'       :
            case 'delay'        :
            case 'reverb'       :
            case 'panner'       :
            case 'listener'     :
                return this[m];
            case 'envelopegenerator':
            case 'eg'               :
                // OscillatorModule, OneshotModule
                return this.envelopegenerator;
            case 'glide':
                if (m in this) {
                    return this[m];  // OscillatorModule
                }

                // fall through
            case 'vocalcanceler':
                if (m in this) {
                    return this[m];  // AudioModule, MediaModule
                }

                // fall through
            case 'noisegate':
                if (m in this) {
                    return this[m];  // StreamModule
                }

                // fall through
            default:
                break;
        }
    }

    /**
     * This method starts effectors.
     * @param {number} startTime This argument is used for scheduling parameter.
     * @return {SoundModule} This is returned for method chain.
     */
    on(startTime) {
        let s = parseFloat(startTime);

        if (isNaN(s) || (s < this.context.currentTime)) {
            s = this.context.currentTime;
        }

        this.chorus.start(s);
        this.flanger.start(s);
        this.phaser.start(s);
        this.autopanner.start(s);
        this.tremolo.start(s);
        this.ringmodulator.start(s);
        this.wah.start(s);
        this.filter.start(s);

        return this;
    }

    /**
     * This method stops effectors.
     * @param {number} stopTime This argument is used for scheduling parameter.
     * @return {SoundModule} This is returned for method chain.
     */
    off(stopTime) {
        let s = parseFloat(stopTime);

        if (isNaN(s) || (s < this.context.currentTime)) {
            s = this.context.currentTime;
        }

        this.chorus.stop(s);
        this.flanger.stop(s);
        this.phaser.stop(s);
        this.autopanner.stop(s);
        this.tremolo.stop(s);
        this.ringmodulator.stop(s);
        this.wah.stop(s);
        // this.filter.stop(s);

        return this;
    }

    /**
     * This method gets effecter's parameters as associative array.
     * @return {object}
     */
    params() {
        const params = {};

        for (const module in this) {
            if (Object.prototype.toString.call(this[module]) === '[object Function]') {
                continue;
            }

            const m = module.toLowerCase();

            if (m === 'mastervolume') {
                params[m] = this[module].gain.value;  // AudioParam
            } else if ((Object.prototype.toString.call(this[module]) === '[object Object]') && ('params' in this[module])) {
                params[m] = this[module].params();
            }
        }

        return params;
    }

    /**
     * This method gets effecter's parameters as JSON.
     * @return {string}
     */
    toJSON() {
        return JSON.stringify(this.params());
    }

    /** @override */
    toString() {
        return '[SoundModule]';
    }
}
