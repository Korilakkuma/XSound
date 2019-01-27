'use strict';

import { Effector } from './Effector';

/**
 * Effector's subclass
 * @constructor
 * @extends {Effector}
 */
export class Filter extends Effector {
    // for legacy browsers
    static FILTER_TYPES = {
        'lowpass'   : 0,
        'highpass'  : 1,
        'bandpass'  : 2,
        'lowshelf'  : 3,
        'highshelf' : 4,
        'peaking'   : 5,
        'notch'     : 6,
        'allpass'   : 7
    };

    /**
     * @param {AudioContext} context This argument is in order to use the interfaces of Web Audio API.
     * @param {number} bufferSize This argument is buffer size for `ScriptProcessorNode`.
     */
    constructor(context, bufferSize) {
        super(context, bufferSize);

        this.filter = context.createBiquadFilter();

        // for legacy browsers
        this.filter.frequency.setTargetAtTime = this.filter.frequency.setTargetAtTime || this.filter.frequency.setTargetValueAtTime;

        // Initialize parameters
        this.filter.type            = (typeof this.filter.type === 'string') ? 'lowpass' : (this.filter.LOWPASS || 0);
        this.filter.frequency.value = 350;
        this.filter.Q.value         = 1;
        this.filter.gain.value      = 0;

        this.maxFrequency = this.filter.frequency.value;
        this.range        = 0.1;  // 10% -> between `this.maxFrequency * 0.1` and `this.maxFrequency`

        this.attack  = 0.01;
        this.decay   = 0.3;
        this.sustain = 1.0;
        this.release = 1.0;

        // `Filter` is not connected by default
        this.state(false);
    }

    /** @override */
    param(key, value) {
        if (Object.prototype.toString.call(arguments[0]) === '[object Object]') {
            // Associative array
            for (const k in arguments[0]) {
                this.param(k, arguments[0][k]);
            }
        } else {
            const k = String(key).replace(/-/g, '').toLowerCase();

            let v   = null;
            let min = null;
            let max = null;

            switch (k) {
                case 'type':
                    if (value === undefined) {
                        return this.filter.type;
                    }

                    v = String(value).toLowerCase();

                    if (v in Filter.FILTER_TYPES) {
                        this.filter.type = (typeof this.filter.type === 'string') ? v : Filter.FILTER_TYPES[v];
                    }

                    break;
                case 'frequency':
                case 'cutoff'   :
                    if (value === undefined) {
                        return this.filter.frequency.value;
                    }

                    v   = parseFloat(value);
                    min = 10;
                    max = this.context.sampleRate / 2;

                    if ((v >= min) && (v <= max)) {
                        this.maxFrequency           = v;
                        this.filter.frequency.value = v;
                    }

                    break;
                case 'gain':
                    if (value === undefined) {
                        return this.filter.gain.value;
                    }

                    v   = parseFloat(value);
                    min = -40;
                    max =  40;

                    if ((v >= min) && (v <= max)) {
                        this.filter.gain.value = v;
                    }

                    break;
                case 'q':
                    if (value === undefined) {
                        return this.filter.Q.value;
                    }

                    v   = parseFloat(value);
                    min = 0.0001;
                    max = 1000;

                    if ((v >= min) && (v <= max)) {
                        this.filter.Q.value = v;
                    }

                    break;
                case 'range':
                    if (value === undefined) {
                        return this.range;
                    }

                    v   = parseFloat(value);
                    min = 0;
                    max = 1;

                    if ((v >= min) && (v <= max)) {
                        this.range= v;
                    }

                    break;
                case 'attack' :
                case 'sustain':
                    if (value === undefined) {
                        return this[k];
                    }

                    v = parseFloat(value);

                    if (v >= 0) {
                        this[k] = v;
                    }

                    break;
                case 'decay'  :
                case 'release':
                    if (value === undefined) {
                        return this[k];
                    }

                    v = parseFloat(value);

                    if (v > 0) {
                        this[k] = v;
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
        this.filter.disconnect(0);

        if (this.isActive) {
            // Effector ON

            // GainNode (Input) -> BiquadFilterNode -> GainNode (Output)
            this.input.connect(this.filter);
            this.filter.connect(this.output);
        } else {
            // Effector OFF

            // GainNode (Input) -> GainNode (Output)
            this.input.connect(this.output);
        }

        return this;
    }

    /** @override */
    start(startTime) {
        if (this.isActive) {
            let s = parseFloat(startTime);

            if (isNaN(s) || (s < this.context.currentTime)) {
                s = this.context.currentTime;
            }

            const t0      = s;
            const t1      = t0 + this.attack;
            const t2      = this.decay;
            const t2Value = this.sustain * this.maxFrequency;

            const minFrequnecy = this.maxFrequency * this.range;

            // Envelope Generator for filter
            this.filter.frequency.cancelScheduledValues(t0);
            this.filter.frequency.setValueAtTime(minFrequnecy, t0);
            this.filter.frequency.linearRampToValueAtTime(this.maxFrequency, t1);  // Attack
            this.filter.frequency.setTargetAtTime(t2Value, t1, t2);  // Decay -> Sustain
        }

        return this;
    }

    /** @override */
    stop(stopTime) {
        if (this.isActive) {
            let s = parseFloat(stopTime) - this.release;

           if (isNaN(s) || (s < this.context.currentTime)) {
               s = this.context.currentTime;
           }

            const t3 = s;
            const t4 = this.release;

            const minFrequnecy = this.maxFrequency * this.range;

            // Envelope Generator for filter
            this.filter.frequency.cancelScheduledValues(t3);
            this.filter.frequency.setValueAtTime(this.filter.frequency.value, t3);
            this.filter.frequency.setTargetAtTime(minFrequnecy, t3, t4);  // Sustain -> Release
        }

        return this;
    }

    /** @override */
    state(state) {
        if (state === undefined) {
            return this.isActive;
        }

        if (String(state).toLowerCase() === 'toggle') {
            this.isActive = !this.isActive;
        } else {
            this.isActive = Boolean(state);
        }

        // Change connection
        this.connect();

        return this;
    }

    /** @override */
    params() {
        const params = {
            'state'     : this.isActive,
            'type'      : this.filter.type,
            'frequency' : this.filter.frequency.value,
            'Q'         : this.filter.Q.value,
            'gain'      : this.filter.gain.value,
            'range'     : this.range,
            'attack'    : this.attack,
            'decay'     : this.decay,
            'sustain'   : this.sustain,
            'release'   : this.release
        };

        return params;
    }

    /** @override */
    toString() {
        return '[SoundModule Filter]';
    }
}
