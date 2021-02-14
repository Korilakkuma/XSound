'use strict';

import { Effector } from './Effector';

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
        this.drive      = context.createGain();
        this.color      = context.createBiquadFilter();
        this.tone       = context.createBiquadFilter();

        // Distortion type
        this.type = Distortion.CLEAN;

        // for creating curve
        this.amount          = 0.5;
        this.numberOfSamples = 4096;

        // Initialize parameters
        this.drive.gain.value      = 1;
        this.color.type            = (typeof this.color.type === 'string') ? 'bandpass' : (this.color.BANDPASS || 2);
        this.color.frequency.value = 350;
        this.color.Q.value         = Math.SQRT1_2;
        this.color.gain.value      = 0;  // Not used
        this.tone.type             = (typeof this.tone.type === 'string') ? 'lowpass' : (this.tone.LOWPASS || 0);
        this.tone.frequency.value  = 350;
        this.tone.Q.value          = Math.SQRT1_2;
        this.tone.gain.value       = 0;  // Not used

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

                    this.distortion.curve = curve;

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
                case 'color':
                case 'tone' :
                    if (value === undefined) {
                        return this[k].frequency.value;
                    }

                    v   = parseFloat(value);
                    min = 10;
                    max = this.context.sampleRate / 2;

                    if ((v >= min) && (v <= max)) {
                        this[k].frequency.value = v;
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
        // Clear connection
        this.input.disconnect(0);
        this.color.disconnect(0);
        this.drive.disconnect(0);
        this.distortion.disconnect(0);
        this.tone.disconnect(0);

        if (this.isActive) {
            // Effect ON

            // GainNode (Input) -> BiquadFilterNode (Color) -> WaveShaperNode (Distortion) -> GainNode (Drive) -> BiquadFilterNode (Tone) -> GainNode (Output)
            this.input.connect(this.color);
            this.color.connect(this.drive);
            this.drive.connect(this.distortion);
            this.distortion.connect(this.tone);
            this.tone.connect(this.output);
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
            'state'   : this.isActive,
            'curve'   : this.type,
            'amount'  : this.amount,
            'samples' : this.numberOfSamples,
            'drive'   : this.drive.gain.value,
            'color'   : this.color.frequency.value,
            'tone'    : this.tone.frequency.value
        };

        return params;
    }

    /** @override */
    toString() {
        return '[SoundModule Distortion]';
    }
}
