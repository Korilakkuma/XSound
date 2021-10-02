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

        this.highTrebleGain = context.createGain();
        this.normalGain     = context.createGain();

        this.lowpass   = context.createBiquadFilter();
        this.highpass1 = context.createBiquadFilter();
        this.highpass2 = context.createBiquadFilter();
        this.highpass3 = context.createBiquadFilter();

        this.highTrebleGain.gain.value = 1;
        this.normalGain.gain.value     = 1;

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
                case 'high':
                    if (value === undefined) {
                        return this.highTrebleGain.gain.value;
                    }

                    v = parseFloat(value);

                    if ((v >= 0) && (v <= 1)) {
                        this.highTrebleGain.gain.value = v;
                    }

                    break;
                case 'normal':
                    if (value === undefined) {
                        return this.normalGain.gain.value;
                    }

                    v = parseFloat(value);

                    if ((v >= 0) && (v <= 1)) {
                        this.normalGain.gain.value = v;
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
        if (this.isActive) {
            // Effect ON

            // GainNode (Input) -> BiquadFilterNode (Highpass) -> GainNode (Nomarl Gain) -> BiquadFilterNode (Highpass) -> GainNode (Output)
            this.input.connect(this.highpass1);
            this.highpass1.connect(this.normalGain);
            this.normalGain.connect(this.highpass3);

            // GainNode (Input) -> BiquadFilterNode (Highpass) -> GainNode (High Treble Gain) -> BiquadFilterNode (Highpass)
            this.input.connect(this.highpass2);
            this.highpass2.connect(this.highTrebleGain);
            this.highTrebleGain.connect(this.highpass3);

            // BiquadFilterNode (Highpass) -> WaveShaperNode  (Preamplifier) -> GainNode (Output)
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
        if (this.isActive) {
            // Effect ON

            // GainNode (Input) -> BiquadFilterNode (Lowpass) -> BiquadFilterNode (Highpass) -> WaveShaperNode (Distortion) -> BiquadFilterNode (Bass) -> BiquadFilterNode (Middle) => BiquadFilterNode (Treble) -> GainNode (Output)
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
     * @param {string} type This argument is one of 'clean', 'crunch', 'overdrive', 'distortion', 'fuzz'.
     * @param {number} amount This argument is the depth of distortion.
     * @param {number} numberOfSamples This argument is the size of `Float32Array`.
     * @return {Float32Array|null} This is `curve` property in `WaveShaperNode`.
     */
    static createCurve(type, amount, numberOfSamples) {
        // This algorithms are from https://github.com/Theodeus/tuna/blob/master/tuna.js#L1301,L1359
        if ((amount > 0) && (amount < 1)) {
            const curves = new Float32Array(numberOfSamples);

            let x   = 0;
            let y   = 0;
            let a   = 0;
            let k   = 0;
            let abx = 0;

            switch (type) {
                case Distortion.CRUNCH:
                    a = 1 - amount > 0.99 ? 0.99 : 1 - amount;

                    for (let i = 0; i < numberOfSamples; i++) {
                        x = i * 2 / numberOfSamples - 1;
                        abx = Math.abs(x);

                        if (abx < a) {
                            y = abx;
                        } else if (abx > a) {
                            y = a + (abx - a) / (1 + Math.pow((abx - a) / (1 - a), 2));
                        } else if (abx > 1) {
                            y = abx;
                        }

                        curves[i] = (x === 0 ? 1 : Math.abs(x) / x) * y * (1 / ((a + 1) / 2));
                    }

                    /*
                    const a    = 2 + Math.round(amount * 14);
                    const bits = Math.round(Math.pow(2, a - 1));

                    let x = 0;

                    for (let i = 0; i < numberOfSamples; i++) {
                        x = i * 2 / numberOfSamples - 1;
                        curves[i] = Math.round(x * bits) / bits;
                    }
                    */

                    break;
                case Distortion.OVERDRIVE:
                    k = (2 * amount) / (1 - amount);

                    for (let i = 0; i < numberOfSamples; i++) {
                        // LINEAR INTERPOLATION: x := (c - a) * (z - y) / (b - a) + y
                        // a = 0, b = 2048, z = 1, y = -1, c = i
                        const x = (((i - 0) * (1 - (-1))) / (numberOfSamples - 0)) + (-1);
                        curves[i] = ((1 + k) * x) / (1 + k * Math.abs(x));
                    }

                    /*
                    let x = 0;

                    for (let i = 0; i < numberOfSamples; i++) {
                        x = i * 2 / numberOfSamples - 1;

                        if (x < -0.08905) {
                            curves[i] = (-3 / 4) * (1 - (Math.pow((1 - (Math.abs(x) - 0.032857)), 12)) + (1 / 3) * (Math.abs(x) - 0.032847)) + 0.01;
                        } else if (x >= -0.08905 && x < 0.320018) {
                            curves[i] = (-6.153 * (x * x)) + 3.9375 * x;
                        } else {
                            curves[i] = 0.630035;
                        }
                    }
                    */

                    break;
                case Distortion.DISTORTION:
                    a = 1 - amount;

                    for (let i = 0; i < numberOfSamples; i++) {
                        x = i * 2 / numberOfSamples - 1;
                        y = x < 0 ? -Math.pow(Math.abs(x), a + 0.04) : Math.pow(x, a);
                        curves[i] = (Math.exp(2 * y) - Math.exp(-2 * y)) / (Math.exp(2 * y) + Math.exp(-2 * y));
                    }

                    break;
                case Distortion.FUZZ:
                    for (let i = 0; i < numberOfSamples; i++) {
                        x = ((i * 2) / numberOfSamples) - 1;
                        y = ((0.5 * Math.pow((x + 1.4), 2)) - 1) * y >= 0 ? 5.8 : 1.2;

                        curves[i] = (Math.exp(y) - Math.exp(-y)) / (Math.exp(y) + Math.exp(-y));
                    }

                    break;
                case Distortion.CLEAN:
                default:
                    return null;
            }

            return curves;
        }

        return null;  // Clean sound (default value)
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
        this.amount          = 0.5;
        this.numberOfSamples = 4096;

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

            let v   = null;
            let min = null;
            let max = null;

            switch (k) {
                case 'curve':
                    if (value === undefined) {
                        return this.distortion.curve;
                    }

                    let curve = null;

                    switch (String(value).toLowerCase()) {
                        case Distortion.CLEAN:
                            this.type = Distortion.CLEAN;
                            curve = Distortion.createCurve(Distortion.CLEAN, this.amount, this.numberOfSamples);
                            break;
                        case Distortion.CRUNCH:
                            this.type = Distortion.CRUNCH;
                            curve = Distortion.createCurve(Distortion.CRUNCH, this.amount, this.numberOfSamples);
                            break;
                        case Distortion.OVERDRIVE:
                            this.type = Distortion.OVERDRIVE;
                            curve = Distortion.createCurve(Distortion.OVERDRIVE, this.amount, this.numberOfSamples);
                            break;
                        case Distortion.DISTORTION:
                            this.type = Distortion.DISTORTION;
                            curve = Distortion.createCurve(Distortion.DISTORTION, this.amount, this.numberOfSamples);
                            break;
                        case Distortion.FUZZ:
                            this.type = Distortion.FUZZ;
                            curve = Distortion.createCurve(Distortion.FUZZ, this.amount, this.numberOfSamples);
                            break;
                        default:
                            if (value instanceof Float32Array) {
                                curve = value;
                            }

                            break;
                    }

                    this.preEQ.param('curve', curve);
                    this.postEQ.param('curve', curve);

                    break;
                case 'amount':
                    if (value === undefined) {
                        return this.amount;
                    }

                    v = parseFloat(value);

                    if ((v > 0) && (v < 1)) {
                        this.amount = v;
                        this.param('curve', this.type);
                    }

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
                case 'drive':
                    if (value === undefined) {
                        return this.drive.gain.value;
                    }

                    v   = parseFloat(value);
                    min = 0;
                    max = 100;

                    if ((v >= min) && (v <= max)) {
                        this.drive.gain.value = v;
                    }

                    break;
                case 'pre':
                    if (value === undefined) {
                        return this.preEQ.state();
                    }

                    this.preEQ.state(value);

                    break;
                case 'high'  :
                case 'normal':
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

            // GainNode (Input) -> Pre-Equalizer -> WaveShaperNode  (Preamplifier) -> Post-Equalizer -> GainNode (Output)
            this.input.connect(this.preEQ.INPUT);
            this.preEQ.OUTPUT.connect(this.preAmp);
            this.preAmp.connect(this.postEQ.OUTPUT);
            this.postEQ.INPUT.connect(this.output);
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
            'amount'    : this.amount,
            'samples'   : this.numberOfSamples,
            'pre'       : this.preEQ.state(),
            'high'      : this.preEQ.param('high'),
            'normal'    : this.preEQ.param('normal'),
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
