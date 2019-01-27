'use strict';

import { Analyser } from './Analyser';
import { Recorder } from './Recorder';
import { Session } from './Session';
import { Effector } from './Effectors/Effector';
import { Compressor } from './Effectors/Compressor';
import { Distortion } from './Effectors/Distortion';
import { Wah } from './Effectors/Wah';
import { Equalizer } from './Effectors/Equalizer';
import { Filter } from './Effectors/Filter';
import { Autopanner } from './Effectors/Autopanner';
import { AutopannerFallback } from './Effectors/AutopannerFallback';
import { Tremolo } from './Effectors/Tremolo';
import { Ringmodulator } from './Effectors/Ringmodulator';
import { Phaser } from './Effectors/Phaser';
import { Flanger } from './Effectors/Flanger';
import { Chorus } from './Effectors/Chorus';
import { Delay } from './Effectors/Delay';
import { Reverb } from './Effectors/Reverb';
import { Panner } from './Effectors/Panner';
import { Listener } from './Effectors/Listener';
import { EnvelopeGenerator } from './Effectors/EnvelopeGenerator';

/**
 * This class is superclass that is the top in this library.
 * This library's users do not create the instance of `SoundModule`.
 * This class is used for inherit in subclass (`OscillatorModule`, `OneshotModule`, `AudioModule`, `MediaModule`, `StreamModule`, `MixerModule`).
 * Therefore, this class defines the common properties for each sound sources.
 * @constructor
 */
export class SoundModule {
    static NUMBER_OF_INPUTS  = 2;
    static NUMBER_OF_OUTPUTS = 2;

    /**
     * @param {AudioContext} context This argument is in order to use the interfaces of Web Audio API.
     * @param {number} bufferSize This argument is buffer size for `ScriptProcessorNode`.
     */
    constructor(context, bufferSize) {
        this.init(context, bufferSize);
    }

    /**
     * This method initials modules.
     * @param {AudioContext} context This argument is in order to use the interfaces of Web Audio API.
     * @param {number} bufferSize This argument is buffer size for `ScriptProcessorNode`.
     *     However, the opportunity for designating buffer size is not so much.
     *     The reason why is that the constructor of `SoundModule` selects buffer size automaticly.
     *     This buffer size can be changed explicitly by calling `resize` method.
     */
    init(context, bufferSize) {
        if (Array.isArray(this.modules) && (this.modules.length > 0)) {
            this.mastervolume.disconnect(0);
            this.mastervolume = null;

            this.processor.disconnect(0);
            this.processor = null;

            this.analyser.input.disconnect(0);
            this.analyser = null;

            this.recorder.processor.disconnect(0);
            this.recorder = null;

            this.session.sender.disconnect(0);
            this.session  = null;

            this.modules.forEach(module => {
                module.input.disconnect(0);
                module.output.disconnect(0);
                module = null;
            });

            this.modules = [];
        }

        this.context    = context;
        this.sampleRate = context.sampleRate;

        let size = parseInt(bufferSize, 10);

        switch (size) {
            case   256:
            case   512:
            case  1024:
            case  2048:
            case  4096:
            case  8192:
            case 16384:
                break;
            default:
                size = 0;
                break;
        }

        this.mastervolume = context.createGain();
        this.processor    = context.createScriptProcessor(size, SoundModule.NUMBER_OF_INPUTS, SoundModule.NUMBER_OF_OUTPUTS);

        this.analyser          = new Analyser(context);
        this.recorder          = new Recorder(context, size, SoundModule.NUMBER_OF_INPUTS, SoundModule.NUMBER_OF_OUTPUTS);
        this.session           = new Session(context, size, SoundModule.NUMBER_OF_INPUTS, SoundModule.NUMBER_OF_OUTPUTS, this.analyser);
        this.compressor        = new Compressor(context, size);
        this.distortion        = new Distortion(context, size);
        this.wah               = new Wah(context, size);
        this.equalizer         = new Equalizer(context, size);
        this.filter            = new Filter(context, size);
        this.autopanner        = context.createStereoPanner ? new Autopanner(context, size) : new AutopannerFallback(context, size);
        this.tremolo           = new Tremolo(context, size);
        this.ringmodulator     = new Ringmodulator(context, size);
        this.phaser            = new Phaser(context, size);
        this.flanger           = new Flanger(context, size);
        this.chorus            = new Chorus(context, size);
        this.delay             = new Delay(context, size);
        this.reverb            = new Reverb(context, size);
        this.panner            = new Panner(context, size);
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
     *     This value is one of 0, 256, 512, 1024, 2048, 4096, 8192, 16384.
     * @return {SoundModule} This is returned for method chain.
     */
    resize(bufferSize) {
        this.init(this.context, bufferSize);
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
     * This method installs customized effector.
     * @param {string} name This argument is in order to select effector.
     * @param {Effector} effector This argument is the subclass that extends `Effector` class.
     * @return {SoundModule} This is returned for method chain.
     */
    install(name, effector) {
        if (!(effector instanceof Effector)) {
            return this;
        }

        if (!(String(name) in this)) {
            return this;
        }

        this[name] = effector;

        if (this.modules.every(module => module !== effector)) {
            this.modules.push(effector);
        }

        return this;
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
                // OscillatorModule, OneshotModule, NoiseModule
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
                return this[m];  // Installed effector
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
     * This method gets effector's parameters as associative array.
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
     * This method gets effector's parameters as JSON.
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
