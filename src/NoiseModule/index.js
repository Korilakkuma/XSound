'use strict';

import SoundModule from '../SoundModule';

export default class NoiseModule extends SoundModule {
    static WHITE_NOISE = 'whitenoise';
    static PINK_NOISE  = 'pinknoise';

    /**
     * @param {AudioContext} context This argument is in order to use the interfaces of Web Audio API.
     */
    constructor(context) {
        super(context);

        this.type = NoiseModule.WHITE_NOISE;

        this.envelopegenerator.setGenerator(0);

        this.isAnalyser = false;
    }

    /**
     * This method is getter or setter for parameters.
     * @param {string|object} key This argument is property name in the case of string type.
     *     This argument is pair of property and value in the case of associative array.
     * @param {number|string} value This argument is the value of designated property. If this argument is omitted, This method is getter.
     * @return {number|string|NoiseModule} This is returned as the value of designated property in the case of getter. Otherwise, this is returned for method chain.
     * @override
     */
    param(key, value) {
        if (Object.prototype.toString.call(arguments[0]) === '[object Object]') {
            // Associative array
            for (const k in arguments[0]) {
                this.param(k, arguments[0][k]);
            }
        } else {
            const k = String(key).replace(/-/g, '').toLowerCase();

            const r = super.param(k, value);

            if (r !== undefined) {
                return r;
            }

            let v = '';

            switch (k) {
                case 'type':
                    if (value === undefined) {
                        return this.type;
                    }

                    v = String(value).toLowerCase();

                    if ((v === NoiseModule.WHITE_NOISE) || (v === NoiseModule.PINK_NOISE)) {
                        this.type = v;
                    }

                    break;
                default:
                    break;
            }
        }

        return this;
    }

    /** @override */
    start(connects) {
        // Clear previous
        this.envelopegenerator.clear(true);
        this.processor.disconnect(0);
        this.processor.onaudioprocess = null;

        // GainNode (Envelope Generator) -> ... -> AudioDestinationNode (Output)
        this.connect(this.envelopegenerator.getGenerator(0), connects);

        // ScriptProcessorNode (Input) -> GainNode (Envelope Generator)
        this.envelopegenerator.ready(0, this.processor);

        this.envelopegenerator.start(this.context.currentTime);

        if (!this.isAnalyser) {
            this.analyser.start('time');
            this.analyser.start('fft');
            this.isAnalyser = true;
        }

        const bufferSize = this.processor.bufferSize;

        this.processor.onaudioprocess = event => {
            const outputLs = event.outputBuffer.getChannelData(0);
            const outputRs = event.outputBuffer.getChannelData(1);

            if (this.envelopegenerator.isStop()) {
                this.processor.disconnect(0);
                this.processor.onaudioprocess = null;

                this.analyser.stop('time');
                this.analyser.stop('fft');
                this.isAnalyser = false;
            } else {
                switch (this.type) {
                    case NoiseModule.WHITE_NOISE:
                        for (let i = 0; i < bufferSize; i++) {
                            outputLs[i] = 2 * (Math.random() - 0.5);
                            outputRs[i] = 2 * (Math.random() - 0.5);
                        }

                        break;
                    case NoiseModule.PINK_NOISE:
                        // ref: https://noisehack.com/generate-noise-web-audio-api/
                        let b0 = 0;
                        let b1 = 0;
                        let b2 = 0;
                        let b3 = 0;
                        let b4 = 0;
                        let b5 = 0;
                        let b6 = 0;

                        for (let i = 0; i < bufferSize; i++) {
                            const white = (Math.random() * 2) - 1;

                            b0 = (0.99886 * b0) + (white * 0.0555179);
                            b1 = (0.99332 * b1) + (white * 0.0750759);
                            b2 = (0.96900 * b2) + (white * 0.1538520);
                            b3 = (0.86650 * b3) + (white * 0.3104856);
                            b4 = (0.55000 * b4) + (white * 0.5329522);
                            b5 = (-0.7616 * b5) - (white * 0.0168980);

                            outputLs[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + (white * 0.5362);
                            outputRs[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + (white * 0.5362);

                            outputLs[i] *= 0.11;
                            outputRs[i] *= 0.11;

                            b6 = white * 0.115926;
                        }

                        break;
                    default:
                        break;
                }
            }
        };

        return this;
    }

    /** @override */
    stop() {
        this.envelopegenerator.stop(this.context.currentTime);

        return this;
    }

    /** @override */
    toString() {
        return '[NoiseModule]';
    }
}
