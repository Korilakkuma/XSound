'use strict';

import { Effector } from './Effector';

/**
 * Effector's subclass
 * @constructor
 * @extends {Effector}
 */
export class Phaser extends Effector {
    static MAXIMUM_STAGES = 24;  // The maximum number of All-Pass Filters

    /**
     * @param {AudioContext} context This argument is in order to use the interfaces of Web Audio API.
     * @param {number} bufferSize This argument is buffer size for `ScriptProcessorNode`.
     */
    constructor(context, bufferSize) {
        super(context, bufferSize);

        this.numberOfStages = 12;  // The default number of All-Pass Filters
        this.filters        = new Array(Phaser.MAXIMUM_STAGES);

        for (let i = 0; i < Phaser.MAXIMUM_STAGES; i++) {
            this.filters[i]                 = context.createBiquadFilter();
            this.filters[i].type            = (typeof this.filters[i].type === 'string') ? 'allpass' : (this.filters[i].ALLPASS || 7);
            this.filters[i].frequency.value = 350;
            this.filters[i].Q.value         = 1;
            this.filters[i].gain.value      = 0;  // Not used
        }

        this.mix      = context.createGain();
        this.feedback = context.createGain();

        // Initialize parameters
        this.depth.gain.value    = 0;
        this.rate.value          = 0;
        this.mix.gain.value      = 0;
        this.feedback.gain.value = 0;
        this.depthRate           = 0;

        // `Phaser` is not connected by default
        this.state(false);

        // LFO
        // GainNode (LFO) -> GainNode (Depth) -> AudioParam (frequency)
        this.lfo.connect(this.depth);

        for (let i = 0; i < Phaser.MAXIMUM_STAGES; i++) {
            this.depth.connect(this.filters[i].frequency);
        }
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
                case 'stage':
                    if (value === undefined) {
                        return this.numberOfStages;
                    }

                    v = parseInt(value, 10);

                    switch (v) {
                        case  0:
                        case  2:
                        case  4:
                        case  8:
                        case 12:
                        case 24:
                            this.numberOfStages = v;
                            this.connect();
                            break;
                        default:
                            break;
                    }

                    break;
                case 'frequency':
                case 'cutoff'   :
                    if (value === undefined) {
                        return this.filters[0].frequency.value;
                    }

                    v   = parseFloat(value);
                    min = 10;
                    max = this.context.sampleRate / 2;

                    if ((v >= min) && (v <= max)) {
                        for (let i = 0; i < Phaser.MAXIMUM_STAGES; i++) {
                            this.filters[i].frequency.value = v;
                        }

                        this.depth.gain.value = this.filters[0].frequency.value * this.depthRate;
                    }

                    break;
                case 'resonance':
                    if (value === undefined) {
                        return this.filters[0].Q.value;
                    }

                    v   = parseFloat(value);
                    min = 0.0001;
                    max = 1000;

                    if ((v >= min) && (v <= max)) {
                        for (let i = 0; i < Phaser.MAXIMUM_STAGES; i++) {
                            this.filters[0].Q.value = v;
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
                        this.depth.gain.value = this.filters[0].frequency.value * v;
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

        for (let i = 0; i < Phaser.MAXIMUM_STAGES; i++) {
            this.filters[i].disconnect(0);
        }

        this.mix.disconnect(0);
        this.feedback.disconnect(0);

        // GainNode (Input) -> GainNode (Output)
        this.input.connect(this.output);

        // Effect ON
        if (this.isActive && (this.numberOfStages > 0)) {
            // GainNode (Input) -> BiquadFilterNode (All-Pass Filter x N) -> GainNode (Mix) -> GainNode (Output)
            this.input.connect(this.filters[0]);

            for (let i = 0; i < this.numberOfStages; i++) {
                if (i < (this.numberOfStages - 1)) {
                    this.filters[i].connect(this.filters[i + 1]);
                } else {
                    this.filters[i].connect(this.mix);
                    this.mix.connect(this.output);

                    // Feedback
                    // GainNode (Input) -> BiquadFilterNode (All-Pass Filter x N) -> GainNode (Feedback) -> BiquadFilterNode (All-Pass Filter x N) ...
                    this.filters[i].connect(this.feedback);
                    this.feedback.connect(this.filters[0]);
                }
            }
        }

        return this;
    }

    /** @override */
    stop(stopTime, releaseTime) {
        super.stop(stopTime, releaseTime);

        if (this.isActive) {
           // Connect nodes again
           this.lfo.connect(this.depth);

           for (let i = 0; i < Phaser.MAXIMUM_STAGES; i++) {
               this.depth.connect(this.filters[i].frequency);
           }
        }

        return this;
    }

    /** @override */
    params() {
        const params = {
            'state'     : this.isActive,
            'stage'     : this.numberOfStages,
            'frequency' : this.filters[0].frequency.value,
            'resonance' : this.filters[0].Q.value,
            'depth'     : this.depthRate,
            'rate'      : this.rate.value,
            'mix'       : this.mix.gain.value,
            'feedback'  : this.feedback.gain.value
        };

        return params;
    }

    /** @override */
    toString() {
        return '[SoundModule Phaser]';
    }
}
