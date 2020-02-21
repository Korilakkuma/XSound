'use strict';

/**
 * This private class defines properties for NoiseSuppressor.
 * @constructor
 */
export class NoiseSuppressor {
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

    /** @constructor */
    constructor() {
        this.threshold = 0;
    }

    /**
     * This method is getter or setter for parameters.
     * @param {string|object} key This argument is property name in the case of string type.
     *     This argument is pair of property and value in the case of associative array.
     * @param {number} value This argument is the value of designated property. If this argument is omitted, This method is getter.
     * @return {number|NoiseSuppressor} This is returned as the value of designated property in the case of getter. Otherwise, this is returned for method chain.
     */
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
                case 'threshold':
                    if (value === undefined) {
                        return this.threshold;
                    }

                    v   = parseFloat(value);
                    min = 0;
                    max = 1;

                    if ((v >= min) && (v <= max)) {
                        this.threshold = v;
                    }

                    break;
                default:
                    break;
            }
        }

        return this;
    }

    /**
     * This method detects background noise and removes this.
     * @param {Float32Array} inputs This argument is the instance of `Float32Array` for `ScriptProcessorNode`.
     * @param {Float32Array} outpus This argument is the instance of `Float32Array` for `ScriptProcessorNode`.
     * @param {number} bufferSize This argument is buffer size for `ScriptProcessorNode`.
     * @return {NoiseSuppressor} This is returned for method chain.
     */
    start(inputs, outputs, bufferSize) {
        if (this.threshold > 0) {
            const xreals = new Float32Array(inputs);
            const ximags = new Float32Array(bufferSize);

            const yreals = new Float32Array(bufferSize);
            const yimags = new Float32Array(bufferSize);

            const amplitudes = new Float32Array(bufferSize);
            const phases     = new Float32Array(bufferSize);

            NoiseSuppressor.FFT(xreals, ximags, bufferSize);

            for (let k = 0; k < bufferSize; k++) {
                amplitudes[k] = Math.sqrt(Math.pow(xreals[k], 2) + Math.pow(ximags[k], 2));

                if ((xreals[k] !== 0) && (ximags[k] !== 0)) {
                    phases[k] = Math.atan2(ximags[k], xreals[k]);
                }

                amplitudes[k] -= this.threshold;

                if (amplitudes[k] < 0) {
                    amplitudes[k] = 0;
                }

                yreals[k] = amplitudes[k] * Math.cos(phases[k]);
                yimags[k] = amplitudes[k] * Math.sin(phases[k]);
            }

            NoiseSuppressor.IFFT(yreals, yimags, bufferSize);

            outputs.set(yreals);
        } else {
            outputs.set(inputs);
        }

        return this;
    }

    /** @override */
    toString() {
        return '[StreamModule NoiseSuppressor]';
    }
}
