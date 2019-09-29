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

    static AMOUNTS = {
        'CLEAN'      : 0.0,
        'CRUNCH'     : 0.5,
        'OVERDRIVE'  : 0.7,
        'DISTORTION' : 0.8,
        'FUZZ'       : 0.9
    };

    /**
     * This class (static) method creates the instance of `Float32Array` for distortion.
     * @param {number} amount This argument is the depth of distortion.
     * @param {number} numberOfSamples This argument is the size of `Float32Array`.
     * @return {Float32Array|null} This is `curve` property in `WaveShaperNode`.
     */
    static createCurve = (amount, numberOfSamples) => {
        if ((amount > 0) && (amount < 1)) {
            const curves = new Float32Array(numberOfSamples);

            const k = (2 * amount) / (1 - amount);

            for (let i = 0; i < numberOfSamples; i++) {
                // LINEAR INTERPOLATION: x := (c - a) * (z - y) / (b - a) + y
                // a = 0, b = 2048, z = 1, y = -1, c = i
                const x = (((i - 0) * (1 - (-1))) / (numberOfSamples - 0)) + (-1);
                curves[i] = ((1 + k) * x) / (1 + k * Math.abs(x));
            }

            return curves;
        }

        return null;  // Clean sound (default value)
    };

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
                            curve = Distortion.createCurve(Distortion.AMOUNTS.CLEAN, this.numberOfSamples);
                            break;
                        case Distortion.CRUNCH:
                            this.type = Distortion.CRUNCH;
                            curve = Distortion.createCurve(Distortion.AMOUNTS.CRUNCH, this.numberOfSamples);
                            break;
                        case Distortion.OVERDRIVE:
                            this.type = Distortion.OVERDRIVE;
                            curve = Distortion.createCurve(Distortion.AMOUNTS.OVERDRIVE, this.numberOfSamples);
                            break;
                        case Distortion.DISTORTION:
                            this.type = Distortion.DISTORTION;
                            curve = Distortion.createCurve(Distortion.AMOUNTS.DISTORTION, this.numberOfSamples);
                            break;
                        case Distortion.FUZZ:
                            this.type = Distortion.FUZZ;
                            curve = Distortion.createCurve(Distortion.AMOUNTS.FUZZ, this.numberOfSamples);
                            break;
                        default:
                            if (value instanceof Float32Array) {
                                curve = value;
                            }

                            break;
                    }

                    this.distortion.curve = curve;

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
        this.distortion.disconnect(0);
        this.drive.disconnect(0);
        this.color.disconnect(0);
        this.tone.disconnect(0);

        if (this.isActive) {
            // Effect ON

            // GainNode (Input) -> BiquadFilterNode (Color) -> WaveShaperNode (Distortion) -> GainNode (Drive) -> BiquadFilterNode (Tone) -> GainNode (Output)
            this.input.connect(this.color);
            this.color.connect(this.distortion);
            this.distortion.connect(this.drive);
            this.drive.connect(this.tone);
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
