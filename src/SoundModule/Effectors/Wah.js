'use strict';

import { Effector }  from './Effector';

/**
 * Effector's subclass
 * @constructor
 * @extends {Effector}
 */
export class Wah extends Effector {
    /**
     * @param {AudioContext} context This argument is in order to use the interfaces of Web Audio API.
     * @param {number} bufferSize This argument is buffer size for `ScriptProcessorNode`.
     */
    constructor(context, bufferSize) {
        super(context, bufferSize);

        this.autoWah = false;

        this.lowpass          = context.createBiquadFilter();
        this.envelopeFollower = context.createWaveShaper();
        this.sensitivity      = context.createBiquadFilter();

        // Initialize parameters
        this.lowpass.type            = (typeof this.lowpass.type === 'string') ? 'lowpass' : (this.lowpass.LOWPASS || 0);
        this.lowpass.frequency.value = this.autoWah ? 20 : 350;
        this.lowpass.Q.value         = 1;
        this.lowpass.gain.value      = 0;  // Not used

        this.envelopeFollower.curve = new Float32Array([1, 0, 1]);

        this.sensitivity.type            = (typeof this.lowpass.type === 'string') ? 'lowpass' : (this.lowpass.LOWPASS || 0);
        this.sensitivity.frequency.value = 350;
        this.sensitivity.Q.value         = 1;
        this.sensitivity.gain.value      = 0;  // Not used

        this.depth.gain.value  = 0;
        this.rate.value        = 0;
        this.depthRate         = 0;

        // `Wah` is not connected by default
        this.state(false);
        this.connect();
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
                case 'auto':
                    if (value === undefined) {
                        return this.autoWah;
                    }

                    this.autoWah = Boolean(value);
                    this.connect();

                    break;
                case 'frequency':
                case 'cutoff'   :
                    if (value === undefined) {
                        return this.autoWah ? this.sensitivity.frequency.value : this.lowpass.frequency.value;
                    }

                    v   = parseFloat(value);
                    min = 10;
                    max = this.context.sampleRate / 2;

                    if ((v >= min) && (v <= max)) {
                        if (this.autoWah) {
                            this.sensitivity.frequency.value = v;
                            this.lowpass.frequency.value     = 20;
                        } else {
                            this.lowpass.frequency.value = v;
                        }
                    }

                    break;
                case 'depth':
                    if (value === undefined) {
                        return this.depthRate;
                    }

                    v   = parseFloat(value);
                    min = 0;
                    max = 1;

                    if ((v >= min) && (v <= max)) {
                        this.depth.gain.value = this.autoWah ? 10000 * v : this.lowpass.frequency.value * v;
                        this.depthRate        = v;
                    }

                    break;
                case 'rate':
                    if (value === undefined) {
                        return this.rate.value;
                    }

                    v   = parseFloat(value);
                    min = 0;
                    max = this.context.sampleRate / 2;

                    if ((v >= min) && (v <= max)) {
                        this.rate.value = v;
                    }

                    break;
                case 'resonance':
                    if (value === undefined) {
                        return this.autoWah ? this.sensitivity.Q.value : this.lowpass.Q.value;
                    }

                    v   = parseFloat(value);
                    min = 0.0001;
                    max = 1000;

                    if ((v >= min) && (v <= max)) {
                        if (this.autoWah) {
                            this.sensitivity.Q.value = v;
                            this.lowpass.Q.value     = 1;
                        } else {
                            this.lowpass.Q.value = v;
                        }
                    }

                    break;
                default:
                    break;
            }
        }

        return this;
    }

    /** @override */
    stop(stopTime, releaseTime) {
        super.stop(stopTime, releaseTime);

        if (!this.autoWah && this.isActive) {
            // Connect nodes again
            this.lfo.connect(this.depth);
            this.depth.connect(this.lowpass.frequency);
        }

        return this;
    }

    /** @override */
    connect() {
        // Clear connection
        this.input.disconnect(0);
        this.sensitivity.disconnect(0);
        this.envelopeFollower.disconnect(0);
        this.lowpass.disconnect(0);
        this.depth.disconnect(0);

        if (this.isActive) {
            // Effect ON

            if (this.autoWah) {
                // GainNode (Input) -> BiquadFilterNode (Sensitivity) -> GainNode (Output)
                this.input.connect(this.sensitivity);
                this.sensitivity.connect(this.output);

                // WaveShaperNode (Envelope Follower) -> BiquadFilterNode (Low-Pass Filter) -> GainNode (Depth) -> AudioParam (frequency)
                this.input.connect(this.envelopeFollower);
                this.envelopeFollower.connect(this.lowpass);
                this.lowpass.connect(this.depth);
                this.depth.connect(this.sensitivity.frequency);
            } else {
                // GainNode (Input) -> BiquadFilterNode (Low-Pass Filter) -> GainNode (Output)
                this.input.connect(this.lowpass);
                this.lowpass.connect(this.output);

                // LFO
                // OscillatorNode (LFO) -> GainNode (Depth) -> AudioParam (frequency)
                this.lfo.connect(this.depth);
                this.depth.connect(this.lowpass.frequency);
            }
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
            'auto'      : this.autoWah,
            'cutoff'    : this.autoWah ? this.sensitivity.frequency.value : this.lowpass.frequency.value,
            'depth'     : this.autoWah ? this.depth.gain.value : this.depthRate,
            'rate'      : this.rate.value,
            'resonance' : this.autoWah ? this.sensitivity.Q.value : this.lowpass.Q.value
        };

        return params;
    }

    /** @override */
    toString() {
        return '[SoundModule Wah]';
    }
}
