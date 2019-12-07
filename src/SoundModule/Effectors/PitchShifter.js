'use strict';

import { Effector } from './Effector';

/**
 * Effector's subclass
 * @constructor
 * @extends {Effector}
 */
export class PitchShifter extends Effector {
    static J = 48;

    static sinc(x) {
        if (x === 0) {
            return 1;
        }

        return Math.sin(x) / x;
    }

    /**
     * @param {AudioContext} context This argument is in order to use the interfaces of Web Audio API.
     * @param {number} bufferSize This argument is buffer size for `ScriptProcessorNode`.
     */
    constructor(context, bufferSize) {
        super(context, bufferSize);

        this.pitch = 1;

        // `PitchShifter` is not connected by default
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

            switch (k) {
                case 'pitch':
                    if (value === undefined) {
                        return this.pitch;
                    }

                    v   = parseFloat(value);
                    min = 0;

                    if (v > min) {
                        this.pitch = v;
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
        this.processor.disconnect(0);

        if (this.isActive) {
            // GainNode (Input) -> ScriptProcessorNode -> GainNode (Output);
            this.input.connect(this.processor);
            this.processor.connect(this.output);
        } else {
            // GainNode (Input) -> GainNode (Output)
            this.input.connect(this.output);
        }

        return this;
    }

    /** @override */
    start() {
        if (this.isActive && this.isStop) {
            this.isStop = false;

            const bufferSize = this.processor.bufferSize;

            this.processor.onaudioprocess = event => {
                const inputLs  = event.inputBuffer.getChannelData(0);
                const inputRs  = event.inputBuffer.getChannelData(1);
                const outputLs = event.outputBuffer.getChannelData(0);
                const outputRs = event.outputBuffer.getChannelData(1);

                if (this.isActive) {
                    for (let i = 0; i < bufferSize; i++) {
                        const t      = this.pitch * i;
                        const offset = Math.floor(t);

                        let outputL = 0;
                        let outputR = 0;

                        for (let j = offset - (PitchShifter.J / 2); j <= offset + (PitchShifter.J / 2); j++) {
                            if ((j > 0) && (j < bufferSize)) {
                                outputL += inputLs[j] * PitchShifter.sinc(Math.PI * (t - j));
                                outputR += inputRs[j] * PitchShifter.sinc(Math.PI * (t - j));
                            }
                        }

                        outputLs[i] = outputL;
                        outputRs[i] = outputR;
                    }
                } else {
                    outputLs.set(inputLs);
                    outputRs.set(inputRs);
                }
            };
        }

        return this;
    }

    /** @override */
    stop() {
        // Effector's state is active ?
        if (this.isActive) {
            // Stop `onaudioprocess` event
            this.processor.disconnect(0);
            this.processor.onaudioprocess = null;

            // Connect nodes again
            this.connect();
        }

        return this;
    }

    /** @override */
    params() {
        const params = {
            'state' : this.isActive,
            'pitch' : this.pitch
        };

        return params;
    }

    /** @override */
    toString() {
        return '[SoundModule PitchShifter]';
    }
}
