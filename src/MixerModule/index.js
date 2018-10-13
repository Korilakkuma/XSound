'use strict';

import { SoundModule } from '../SoundModule';
import { OscillatorModule } from '../OscillatorModule';
import { OneshotModule } from '../OneshotModule';
import { AudioModule } from '../AudioModule';
import { MediaModule } from '../MediaModule';
import { StreamModule } from '../StreamModule';

/**
 * This class defines properties for mixing sound sources that is defined in this library.
 * @constructor
 * @extends {SoundModule}
 */
export class MixerModule extends SoundModule {
    /**
     * @param {AudioContext} context This argument is in order to use the interfaces of Web Audio API.
     */
    constructor(context) {
        super(context);

        /** @type {Array.<OscillatorModule>|Array.<OneshotModule>|Array.<AudioModule>|Array.<MediaModule>|Array.<StreamModule>} */
        this.sources = [];

        this.isAnalyser = false;
    }

    /**
     * This method mixes sound source.
     * @param {Array.<OscillatorModule>|Array.<OneshotModule>|Array.<AudioModule>|Array.<MediaModule>|Array.<StreamModule>} sources This argument is the array of sound source that is defined by this library.
     * @return {MixerModule} This is returned for method chain.
     */
    mix(sources) {
        if (!Array.isArray(sources)) {
            sources = [sources];
        }

        this.sources = sources;

        for (const source of this.sources) {
            if (!((source instanceof OscillatorModule) || (source instanceof OneshotModule) || (source instanceof AudioModule) || (source instanceof MediaModule) || (source instanceof StreamModule))) {
                return this;
            }

            const stopTime = this.context.currentTime;

            this.off(stopTime, false);

            source.analyser.stop('time');
            source.analyser.stop('fft');
            source.isAnalyser = false;

            source.recorder.stop();
            source.session.close();

            // ScriptProcessorNode (each sound source) -> ScriptProcessorNode (Mix sound sources)
            source.processor.disconnect(0);
            source.processor.connect(this.processor);
        }

        // (... ->) ScriptProcessorNode (Mix sound sources) -> ... -> AudioDestinationNode (Output)
        this.connect(this.processor);

        const startTime = this.context.currentTime;

        this.on(startTime);

        if (!this.isAnalyser) {
            this.analyser.start('time');
            this.analyser.start('fft');
            this.isAnalyser = true;
        }

        this.processor.onaudioprocess = event => {
            const inputLs  = event.inputBuffer.getChannelData(0);
            const inputRs  = event.inputBuffer.getChannelData(1);
            const outputLs = event.outputBuffer.getChannelData(0);
            const outputRs = event.outputBuffer.getChannelData(1);

            // Stop ?
            let isStop = false;

            for (const source of sources) {
                if ((source instanceof OscillatorModule) && source.envelopegenerator.isStop()) {
                    isStop = true;
                } else if ((source instanceof OneshotModule) && source.isStop) {
                    isStop = true;
                } else if ((source instanceof AudioModule) && source.paused) {
                    isStop = true;
                } else if ((source instanceof MediaModule) && source.media.paused) {
                    isStop = true;
                } else if ((source instanceof StreamModule) && source.isStop) {
                    isStop = true;
                }
            }

            if (isStop) {
                const stopTime = this.context.currentTime;

                this.on(stopTime, true);

                this.analyser.stop('time');
                this.analyser.stop('fft');
                this.isAnalyser = false;

                // Stop `onaudioprocess` event
                this.processor.disconnect(0);
                this.processor.onaudioprocess = null;
            } else {
                outputLs.set(inputLs);
                outputRs.set(inputRs);
            }
        };

        return this;
    }

    /**
     * This method gets the instance of sound source that is mixed in this class.
     * @param {number} index This argument is required in the case of designating sound source.
     * @return {Array.<OscillatorModule>|Array.<OneshotModule>|Array.<AudioModule>|Array.<MediaModule>|Array.<StreamModule>|OscillatorModule|OneshotModule|AudioModule|MediaModule|StreamModule}
     * @override
     */
    get(index) {
        const i = parseInt(index, 10);

        return ((i >= 0) && (i < this.sources.length)) ? this.sources[i] : this.sources;
    }

    /** @override */
    toString() {
        return '[MixerModule]';
    }
}
