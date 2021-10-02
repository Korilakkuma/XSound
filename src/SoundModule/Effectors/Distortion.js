'use strict';

import { Effector } from './Effector';

/**
 * Effector's subclass
 * @constructor
 * @extends {Effector}
 */
class PreEqualizer extends Effector {
    /**
     * @param {AudioContext} context This argument is in order to use the interfaces of Web Audio API.
     */
    constructor(context) {
        super(context, 0);

        this.preAmp = context.createWaveShaper();

        this.gain     = context.createGain();
        this.leadGain = context.createGain();

        this.lowpass   = context.createBiquadFilter();
        this.highpass1 = context.createBiquadFilter();
        this.highpass2 = context.createBiquadFilter();
        this.highpass3 = context.createBiquadFilter();

        this.gain.gain.value     = 0.5;
        this.leadGain.gain.value = 0.5;

        this.lowpass.type             = (typeof this.lowpass.type === 'string') ? 'lowpass' : (this.lowpass.LOWPASS || 0);
        this.lowpass.frequency.value  = 3200;
        this.lowpass.Q.value          = Math.SQRT1_2;
        this.lowpass.gain.value       = 0;  // Not used

        this.highpass1.type             = (typeof this.highpass1.type === 'string') ? 'highpass' : (this.highpass1.HIGHPASS || 1);
        this.highpass1.frequency.value  = 80;
        this.highpass1.Q.value          = Math.SQRT1_2;
        this.highpass1.gain.value       = 0;  // Not used

        this.highpass2.type             = (typeof this.highpass2.type === 'string') ? 'highpass' : (this.highpass2.HIGHPASS || 1);
        this.highpass2.frequency.value  = 640;
        this.highpass2.Q.value          = Math.SQRT1_2;
        this.highpass2.gain.value       = 0;  // Not used

        this.highpass3.type             = (typeof this.highpass3.type === 'string') ? 'highpass' : (this.highpass3.HIGHPASS || 1);
        this.highpass3.frequency.value  = 80;
        this.highpass3.Q.value          = Math.SQRT1_2;
        this.highpass3.gain.value       = 0;  // Not used

        this.state(false);
    }

    /** @override */
    param(key, value) {
        if (Object.prototype.toString.call(arguments[0]) === '[object Object]') {
            // Associative array
            for (const k in arguments[0]) {
                this.param(k, arguments[0][k]);
            }
        } else  {
            const k = String(key).replace(/-/g, '').toLowerCase();

            let v = null;

            switch (k) {
                case 'curve':
                    if (value === undefined) {
                        return this.preAmp.curve;
                    }

                    this.preAmp.curve = value;

                    break;
                case 'gain':
                    if (value === undefined) {
                        return this.gain.gain.value;
                    }

                    v = parseFloat(value);

                    if ((v >= 0) && (v <= 1)) {
                        this.gain.gain.value = v;
                    }

                    break;
                case 'lead':
                    if (value === undefined) {
                        return this.leadGain.gain.value;
                    }

                    v = parseFloat(value);

                    if ((v >= 0) && (v <= 1)) {
                        this.leadGain.gain.value = v;
                    }

                    break;
                default:
                    break;
            }
        }

        return this;
    }

    /** @override */
    connect() {
        this.input.disconnect(0);

        if (this.isActive) {
            // Effect ON

            // GainNode (Input) -> BiquadFilterNode (Highpass) -> GainNode (Gain) -> BiquadFilterNode (Highpass) -> GainNode (Output)
            this.input.connect(this.highpass1);
            this.highpass1.connect(this.gain);
            this.gain.connect(this.highpass3);

            // GainNode (Input) -> BiquadFilterNode (Highpass) -> GainNode (Lead Gain) -> BiquadFilterNode (Highpass)
            this.input.connect(this.highpass2);
            this.highpass2.connect(this.leadGain);
            this.leadGain.connect(this.highpass3);

            // BiquadFilterNode (Highpass) -> WaveShaperNode (Preamplifier) -> GainNode (Output)
            this.highpass3.connect(this.preAmp);
            this.preAmp.connect(this.output);
        } else {
            // Effect OFF

            // GainNode (Input) -> GainNode (Output)
            this.input.connect(this.output);
        }

        return this;
    }
}

/**
 * Effector's subclass
 * @constructor
 * @extends {Effector}
 */
class PostEqualizer extends Effector {
    /**
     * @param {AudioContext} context This argument is in order to use the interfaces of Web Audio API.
     */
    constructor(context) {
        super(context, 0);

        this.distortion = context.createWaveShaper();

        this.bass     = context.createBiquadFilter();
        this.middle   = context.createBiquadFilter();
        this.treble   = context.createBiquadFilter();

        this.bass.type   = (typeof this.bass.type     === 'string') ? 'lowshelf'  : (this.bass.LOWSHELF    || 3);
        this.middle.type = (typeof this.middle.type   === 'string') ? 'peaking'   : (this.middle.PEAKING   || 5);
        this.treble.type = (typeof this.treble.type   === 'string') ? 'highshelf' : (this.treble.HIGHSHELF || 4);

        // Set cutoff frequency
        this.bass.frequency.value   = 240;  // 240 Hz
        this.middle.frequency.value = 500;  // 500 Hz
        this.treble.frequency.value = 1600; // 1.6 kHz

        // Set Q
        // this.bass.Q.value   = Math.SQRT1_2;  // Not used
        this.middle.Q.value = Math.SQRT1_2;
        // this.treble.Q.value = Math.SQRT1_2;  // Not used

        // Set Gain
        this.bass.gain.value   = 0;
        this.middle.gain.value = 0;
        this.treble.gain.value = 0;

        this.lowpass  = context.createBiquadFilter();
        this.highpass = context.createBiquadFilter();

        this.lowpass.type             = (typeof this.lowpass.type === 'string') ? 'lowpass' : (this.lowpass.LOWPASS || 0);
        this.lowpass.frequency.value  = 24000;
        this.lowpass.Q.value          = Math.SQRT1_2;
        this.lowpass.gain.value       = 0;  // Not used

        this.highpass.type             = (typeof this.highpass.type === 'string') ? 'highpass' : (this.highpass.HIGHPASS || 1);
        this.highpass.frequency.value  = 40;
        this.highpass.Q.value          = Math.SQRT1_2;
        this.highpass.gain.value       = 0;  // Not used

        this.state(false);
    }

    /** @override */
    param(key, value) {
        if (Object.prototype.toString.call(arguments[0]) === '[object Object]') {
            // Associative array
            for (const k in arguments[0]) {
                this.param(k, arguments[0][k]);
            }
        } else  {
            const k = String(key).replace(/-/g, '').toLowerCase();

            let v   = null;
            let min = null;
            let max = null;

            switch (k) {
                case 'curve':
                    if (value === undefined) {
                        return this.distortion.curve;
                    }

                    this.distortion.curve = value;

                    break;
                case 'bass'  :
                case 'middle':
                case 'treble':
                    if (value === undefined) {
                        return this[k].gain.value;
                    }

                    v   = parseFloat(value);
                    min = -40;
                    max =  40;

                    if ((v >= min) && (v <= max)) {
                        this[k].gain.value = v;
                    }

                    break;
                case 'frequency':
                    if (value === undefined) {
                        return this.middle.frequency.value;
                    }

                    v   = parseFloat(value);
                    min = 10;
                    max = this.context.sampleRate / 2;

                    if ((v >= min) && (v <= max)) {
                        this.middle.frequency.value = v;
                    }

                    break;
                default:
                    break;
            }
        }

        return this;
    }

    /** @override */
    connect() {
        this.input.disconnect(0);

        if (this.isActive) {
            // Effect ON

            // GainNode (Input) -> BiquadFilterNode (Lowpass) -> BiquadFilterNode (Highpass) -> WaveShaperNode (Distortion) -> BiquadFilterNode (Bass) -> BiquadFilterNode (Middle) -> BiquadFilterNode (Treble) -> GainNode (Output)
            this.input.connect(this.lowpass);
            this.lowpass.connect(this.highpass);
            this.highpass.connect(this.distortion);
            this.distortion.connect(this.bass);
            this.bass.connect(this.middle);
            this.middle.connect(this.treble);
            this.treble.connect(this.output);
        } else {
            // Effect OFF

            // GainNode (Input) -> GainNode (Output)
            this.input.connect(this.output);
        }

        return this;
    }
}

/**
 * Effector's subclass
 * @constructor
 * @extends {Effector}
 */
export class Distortion extends Effector {
    static CLEAN      = 'clean';
    static CRUNCH     = 'crunch';
    static OVERDRIVE  = 'overdrive';
    static DISTORTION = 'distortion';
    static FUZZ       = 'fuzz';

    /**
     * This class (static) method creates the instance of `Float32Array` for distortion.
     * @param {number} drive This argument is an amount of distortion.
     * @param {number} numberOfSamples This argument is the size of distortion curve.
     * @return {Float32Array|null} This is `curve` property in `WaveShaperNode`.
     */
    static createCurve(drive, numberOfSamples) {
        const index = Math.floor((numberOfSamples - 1) / 2);

        const curves = new Float32Array(numberOfSamples);

        const d = Math.pow(10, ((drive / 5.0) - 1.0)) - 0.1;
        const c = (d / 5.0) + 1.0;

        let peak = 0.4;

        if (c === 1) {
            peak = 1.0;
        } else if ((c > 1) && (c < 1.04)) {
            peak = (-15.5 * c) + 16.52;
        }

        for (let i = 0; i < index; i++) {
            curves[index + i] = peak * (+1 - Math.pow(c, -i) + (i * Math.pow(c, -index)) / index);
            curves[index - i] = peak * (-1 + Math.pow(c, -i) - (i * Math.pow(c, -index)) / index);
        }

        curves[index] = 0;

        return curves;
    }

    /**
     * @param {AudioContext} context This argument is in order to use the interfaces of Web Audio API.
     * @param {number} bufferSize This argument is buffer size for `ScriptProcessorNode`.
     */
    constructor(context, bufferSize) {
        super(context, bufferSize);

        this.distortion = context.createWaveShaper();

        this.preEQ  = new PreEqualizer(context);
        this.postEQ = new PostEqualizer(context);

        // Distortion type
        this.type = Distortion.CLEAN;

        // for creating curve
        this.numberOfSamples = 256;

        this.param('curve', Distortion.CLEAN);

        // `Distortion` is not connected by default
        this.state(false);
    }

    /** @override */
    param(key, value) {
        if (Object.prototype.toString.call(arguments[0]) === '[object Object]') {
            // Associative array
            for (const k in arguments[0]) {
                this.param(k, arguments[0][k]);
            }
        } else  {
            const k = String(key).replace(/-/g, '').toLowerCase();

            let v = null;

            switch (k) {
                case 'curve':
                    let curve = null;

                    switch (String(value).toLowerCase()) {
                        case Distortion.CLEAN:
                            this.type = Distortion.CLEAN;
                            curve = Distortion.createCurve(0.0, this.numberOfSamples);
                            break;
                        case Distortion.CRUNCH:
                            this.type = Distortion.CRUNCH;
                            curve = Distortion.createCurve(3.0, this.numberOfSamples);
                            break;
                        case Distortion.OVERDRIVE:
                            this.type = Distortion.OVERDRIVE;
                            curve = Distortion.createCurve(5.0, this.numberOfSamples);
                            break;
                        case Distortion.DISTORTION:
                            this.type = Distortion.DISTORTION;
                            curve = Distortion.createCurve(8.0, this.numberOfSamples);
                            break;
                        case Distortion.FUZZ:
                            this.type = Distortion.FUZZ;
                            curve = Distortion.createCurve(10.0, this.numberOfSamples);
                            break;
                        default:
                            if (value === undefined) {
                                return this.postEQ.param('curve');
                            }

                            if (value instanceof Float32Array) {
                                curve = value;
                            }

                            break;
                    }

                    this.preEQ.param('curve', curve);
                    this.postEQ.param('curve', curve);

                    break;
                case 'samples':
                    if (value === undefined) {
                        return this.numberOfSamples;
                    }

                    v = parseInt(value, 10);

                    if (v >= 0) {
                        this.numberOfSamples = v;
                        this.param('curve', this.type);
                    }

                    break;
                case 'pre':
                    if (value === undefined) {
                        return this.preEQ.state();
                    }

                    this.preEQ.state(value);

                    break;
                case 'gain':
                case 'lead':
                    if (value === undefined) {
                        return this.preEQ.param(k);
                    }

                    this.preEQ.param(k, value);

                    break;
                case 'post':
                    if (value === undefined) {
                        return this.postEQ.state();
                    }

                    this.postEQ.state(value);

                    break;
                case 'bass'     :
                case 'middle'   :
                case 'treble'   :
                case 'frequency':
                    if (value === undefined) {
                        return this.postEQ.param(k);
                    }

                    this.postEQ.param(k, value);

                    break;
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

        if (this.isActive) {
            // Effect ON

            // GainNode (Input) -> Pre-Equalizer -> Preamplifier -> Distortion -> Post-Equalizer -> GainNode (Output)
            this.input.connect(this.preEQ.INPUT);
            this.preEQ.OUTPUT.connect(this.postEQ.INPUT);
            this.postEQ.OUTPUT.connect(this.output);
        } else {
            // Effect OFF

            // GainNode (Input) -> GainNode (Output)
            this.input.connect(this.output);
        }

        return this;
    }

    /** @override */
    params() {
        const params = {
            'state'     : this.isActive,
            'curve'     : this.type,
            'samples'   : this.numberOfSamples,
            'pre'       : this.preEQ.state(),
            'gain'      : this.preEQ.param('gain'),
            'lead'      : this.preEQ.param('lead'),
            'post'      : this.postEQ.state(),
            'bass'      : this.postEQ.param('bass'),
            'middle'    : this.postEQ.param('middle'),
            'treble'    : this.postEQ.param('treble'),
            'frequency' : this.postEQ.param('frequency')
        };

        return params;
    }

    /** @override */
    toString() {
        return '[SoundModule Distortion]';
    }
}
