'use strict';

import { Effector } from './Effector';

/**
 * Effector's subclass
 * @constructor
 * @extends {Effector}
 */
export class PitchShifter extends Effector {
    /**
     * This class (static) method executes FFT.
     * @param {Float32Array} reals This argument is the instance of `Float32Array` for real number.
     * @param {Float32Array} imags This argument is the instance of `Float32Array` for imaginary number.
     * @param {number} size This argument is FFT size (power of two).
     */
    static FFT(reals, imags, size) {
        const pow2 = n => Math.pow(2, n);

        const indexes = new Float32Array(size);

        const numberOfStages = Math.log2(size);

        for (let stage = 1; stage <= numberOfStages; stage++) {
            for (let i = 0; i < pow2(stage - 1); i++) {
                const rest = numberOfStages - stage;

                for (let j = 0; j < pow2(rest); j++) {
                    const n = i * pow2(rest + 1) + j;
                    const m = pow2(rest) + n;
                    const r = j * pow2(stage - 1);

                    const areal = reals[n];
                    const aimag = imags[n];
                    const breal = reals[m];
                    const bimag = imags[m];
                    const creal = Math.cos((2.0 * Math.PI * r) / size);
                    const cimag = -1 * Math.sin((2.0 * Math.PI * r) / size);

                    if (stage < numberOfStages) {
                        reals[n] = areal + breal;
                        imags[n] = aimag + bimag;
                        reals[m] = (creal * (areal - breal)) - (cimag * (aimag - bimag));
                        imags[m] = (creal * (aimag - bimag)) + (cimag * (areal - breal));
                    } else {
                        reals[n] = areal + breal;
                        imags[n] = aimag + bimag;
                        reals[m] = areal - breal;
                        imags[m] = aimag - bimag;
                    }
                }
            }
        }

        for (let stage = 1; stage <= numberOfStages; stage++) {
            const rest = numberOfStages - stage;

            for (let i = 0; i < pow2(stage - 1); i++) {
                indexes[pow2(stage - 1) + i] = indexes[i] + pow2(rest);
            }
        }

        for (let k = 0; k < size; k++) {
            if (indexes[k] <= k) {
                continue;
            }

            const real = reals[indexes[k]];
            const imag = imags[indexes[k]];

            reals[indexes[k]] = reals[k];
            imags[indexes[k]] = imags[k];

            reals[k] = real;
            imags[k] = imag;
        }
    }

    /**
     * This class (static) method executes IFFT.
     * @param {Float32Array} reals This argument is the instance of `Float32Array` for real number.
     * @param {Float32Array} imags This argument is the instance of `Float32Array` for imaginary number.
     * @param {number} size This argument is IFFT size (power of two).
     */
    static IFFT(reals, imags, size) {
        const pow2 = n => Math.pow(2.0, n);

        const indexes = new Float32Array(size);

        const numberOfStages = Math.log2(size);

        for (let stage = 1; stage <= numberOfStages; stage++) {
            for (let i = 0; i < pow2(stage - 1); i++) {
                const rest = numberOfStages - stage;

                for (let j = 0; j < pow2(rest, 2); j++) {
                    const n = i * pow2(rest + 1) + j;
                    const m = pow2(rest) + n;
                    const r = j * pow2(stage - 1);

                    const areal = reals[n];
                    const aimag = imags[n];
                    const breal = reals[m];
                    const bimag = imags[m];
                    const creal = Math.cos((2.0 * Math.PI * r) / size);
                    const cimag = Math.sin((2.0 * Math.PI * r) / size);

                    if (stage < numberOfStages) {
                        reals[n] = areal + breal;
                        imags[n] = aimag + bimag;
                        reals[m] = (creal * (areal - breal)) - (cimag * (aimag - bimag));
                        imags[m] = (creal * (aimag - bimag)) + (cimag * (areal - breal));
                    } else {
                        reals[n] = areal + breal;
                        imags[n] = aimag + bimag;
                        reals[m] = areal - breal;
                        imags[m] = aimag - bimag;
                    }
                }
            }
        }

        for (let stage = 1; stage <= numberOfStages; stage++) {
            const rest = numberOfStages - stage;

            for (let i = 0; i < pow2(stage - 1); i++) {
                indexes[pow2(stage - 1) + i] = indexes[i] + pow2(rest);
            }
        }

        for (let k = 0; k < size; k++) {
            if (indexes[k] <= k) {
                continue;
            }

            const real = reals[indexes[k]];
            const imag = imags[indexes[k]];

            reals[indexes[k]] = reals[k];
            imags[indexes[k]] = imags[k];

            reals[k] = real;
            imags[k] = imag;
        }

        for (let k = 0; k < size; k++) {
            reals[k] /= size;
            imags[k] /= size;
        }
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
                const realLs   = event.inputBuffer.getChannelData(0);
                const realRs   = event.inputBuffer.getChannelData(1);
                const outputLs = event.outputBuffer.getChannelData(0);
                const outputRs = event.outputBuffer.getChannelData(1);

                if (this.isActive && (this.pitch !== 1)) {
                    const imagLs = new Float32Array(bufferSize);
                    const imagRs = new Float32Array(bufferSize);

                    PitchShifter.FFT(realLs, imagLs, bufferSize);
                    PitchShifter.FFT(realRs, imagRs, bufferSize);

                    const arealLs = new Float32Array(bufferSize);
                    const arealRs = new Float32Array(bufferSize);
                    const aimagLs = new Float32Array(bufferSize);
                    const aimagRs = new Float32Array(bufferSize);

                    for (let i = 0; i < bufferSize; i++) {
                        const offset = Math.floor(this.pitch * i);

                        let eq = 1;

                        if (i > (bufferSize / 2)) {
                            eq = 0;
                        }

                        if ((offset >= 0) && (offset < bufferSize)) {
                            arealLs[offset] += eq * realLs[i];
                            aimagLs[offset] += eq * imagLs[i];
                            arealRs[offset] += eq * realRs[i];
                            aimagRs[offset] += eq * imagRs[i];
                        }
                    }

                    PitchShifter.IFFT(arealLs, aimagLs, bufferSize);
                    PitchShifter.IFFT(arealRs, aimagRs, bufferSize);

                    outputLs.set(arealLs);
                    outputRs.set(arealRs);
                } else {
                    outputLs.set(realLs);
                    outputRs.set(realRs);
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
