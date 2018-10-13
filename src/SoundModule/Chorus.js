'use strict';

import { Effector } from './Effector';

/**
 * Effector's subclass
 * @constructor
 * @extends {Effector}
 */
export class Chorus extends Effector {
    /**
     * @param {AudioContext} context This argument is in order to use the interfaces of Web Audio API.
     * @param {number} bufferSize This argument is buffer size for `ScriptProcessorNode`.
     */
    constructor(context, bufferSize) {
        super(context, bufferSize);

        this.delay    = context.createDelay();
        this.mix      = context.createGain();
        this.tone     = context.createBiquadFilter();
        this.feedback = context.createGain();

        // Initialize parameters
        this.delay.delayTime.value = 0;
        this.depth.gain.value      = 0;
        this.rate.value            = 0;
        this.mix.gain.value        = 0;
        this.tone.type             = (typeof this.tone.type === 'string') ? 'lowpass' : (this.tone.LOWPASS || 0);
        this.tone.frequency.value  = 350;
        this.tone.Q.value          = Math.SQRT1_2;
        this.tone.gain.value       = 0;  // Not used
        this.feedback.gain.value   = 0;
        this.depthRate             = 0;

        // `Chorus` is not connected by default
        this.state(false);

        // LFO
        // OscillatorNode (LFO) -> GainNode (Depth) -> AudioParam (elayTime)
        this.lfo.connect(this.depth);
        this.depth.connect(this.delay.delayTime);
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
                case 'delaytime':
                case 'time'     :
                    if (value === undefined) {
                        return this.delay.delayTime.value;
                    }

                    v   = parseFloat(value);
                    min = 0;
                    max = 1;

                    if ((v >= min) && (v <= max)) {
                        this.delay.delayTime.value = v;
                        this.depth.gain.value      = this.delay.delayTime.value * this.depthRate;
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
                        this.depth.gain.value = this.delay.delayTime.value * v;
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
                case 'mix'     :
                case 'feedback':
                    if (value === undefined) {
                        return this[k].gain.value;
                    }

                    v   = parseFloat(value);
                    min = 0;
                    max = 1;

                    if ((v >= min) && (v <= max)) {
                        this[k].gain.value = v;
                    }

                    break;
                case 'tone':
                    if (value === undefined) {
                        return this.tone.frequency.value;
                    }

                    v   = parseFloat(value);
                    min = 10;
                    max = this.context.sampleRate / 2;

                    if ((v >= min) && (v <= max)) {
                        this.tone.frequency.value = v;
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
        this.delay.disconnect(0);
        this.mix.disconnect(0);
        this.tone.disconnect(0);
        this.feedback.disconnect(0);

        // GainNode (Input) -> GainNode (Output)
        this.input.connect(this.output);

        // Effect ON
        if (this.isActive) {
            // GainNode (Input) -> BiquadFilterNode (Tone) -> DelayNode -> GainNode (Mix) -> GainNode (Output)
            this.input.connect(this.tone);
            this.tone.connect(this.delay);
            this.delay.connect(this.mix);
            this.mix.connect(this.output);

            // Feedback
            // GainNode (Input) -> DelayNode -> GainNode (Feedback) -> DelayNode ...
            this.delay.connect(this.feedback);
            this.feedback.connect(this.delay);
        }

        return this;
    }

    /** @override */
    stop(stopTime, releaseTime) {
        super.stop(stopTime, releaseTime);

        if (this.isActive) {
            // Connect nodes again
            this.lfo.connect(this.depth);
            this.depth.connect(this.delay.delayTime);
        }

        return this;
    }

    /** @override */
    params() {
        const params = {
            'state'    : this.isActive,
            'time'     : this.delay.delayTime.value,
            'depth'    : this.depthRate,
            'rate'     : this.rate.value,
            'mix'      : this.mix.gain.value,
            'tone'     : this.tone.frequency.value,
            'feedback' : this.feedback.gain.value
        };

        return params;
    }

    /** @override */
    toString() {
        return '[SoundModule Chorus]';
    }
}
