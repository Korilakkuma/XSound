'use strict';

import SoundModule from '../SoundModule';

export default class NoiseModule extends SoundModule {
    static WHITE_NOISE = 'whitenoise';

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
     * @param {number} value This argument is the value of designated property. If this argument is omitted, This method is getter.
     * @return {number|NoiseModule} This is returned as the value of designated property in the case of getter. Otherwise, this is returned for method chain.
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

            return (r === undefined) ? this : r;
        }
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
                for (let i = 0; i < bufferSize; i++) {
                    outputLs[i] = 2 * (Math.random() - 0.5);
                    outputRs[i] = 2 * (Math.random() - 0.5);
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
