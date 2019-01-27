'use strict';

import { Effector } from './Effector';

/**
 * Effector's subclass
 * @constructor
 * @extends {Effector}
 */
export class Tremolo extends Effector {
    // for legacy browsers
    static WAVE_TYPES = {
        'sine'     : 0,
        'square'   : 1,
        'sawtooth' : 2,
        'triangle' : 3
    };

    /**
     * @param {AudioContext} context This argument is in order to use the interfaces of Web Audio API.
     * @param {number} bufferSize This argument is buffer size for `ScriptProcessorNode`.
     */
    constructor(context, bufferSize) {
        super(context, bufferSize);

        this.amplitude = context.createGain();

        this.amplitude.gain.value = 1;  // 1 +- depth

        // Initialize parameter
        this.depth.gain.value = 0;
        this.rate.value       = 0;

        // `Tremolo` is not connected by default
        this.state(false);

        // LFO
        // OscillatorNode (LFO) -> GainNode (Depth) -> AudioParam (gain)
        this.lfo.connect(this.depth);
        this.depth.connect(this.amplitude.gain);
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
                case 'depth':
                    if (value === undefined) {
                        return this.depth.gain.value;
                    }

                    v   = parseFloat(value);
                    min = 0;
                    max = 1;

                    if ((v >= min) && (v <= max)) {
                        this.depth.gain.value = v;
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
                case 'wave':
                    if (value === undefined) {
                        return this.lfo.type;
                    }

                    v = String(value).toLowerCase();

                    if (v in Tremolo.WAVE_TYPES) {
                        this.lfo.type = (typeof this.lfo.type === 'string') ? v : Tremolo.WAVE_TYPES[v];
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
        this.amplitude.disconnect(0);

        if (this.isActive) {
            // Effect ON

            // GainNode (Input) -> GainNode -> GainNode (Output)
            this.input.connect(this.amplitude);
            this.amplitude.connect(this.output);
        } else {
            // Effect OFF

            // GainNode (Input) -> GainNode (Output)
            this.input.connect(this.output);
        }

        return this;
    }

    /** @override */
    stop(stopTime, releaseTime) {
        super.stop(stopTime, releaseTime);

        if (this.isActive) {
            // Connect nodes again
            this.lfo.connect(this.depth);
            this.depth.connect(this.amplitude.gain);
        }

        return this;
    }

    /** @override */
    params() {
        const params = {
            'state' : this.isActive,
            'depth' : this.depth.gain.value,
            'rate'  : this.rate.value,
            'wave'  : this.lfo.type
        };

        return params;
    }

    /** @override */
    toString() {
        return '[SoundModule Tremolo]';
    }
}
