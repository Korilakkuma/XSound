'use strict';

import { SoundModule } from '../SoundModule';

export class ProcessorModule extends SoundModule {
    /**
     * @param {AudioContext} context This argument is in order to use the interfaces of Web Audio API.
     * @param {number} bufferSize This argument is buffer size for `ScriptProcessorNode`.
     */
    constructor(context, bufferSize) {
        super(context, bufferSize);

        this.envelopegenerator.setGenerator(0);

        this.isAnalyser = false;
    }

    /**
     * This method sets the instance of `ScriptProcessorNode` or `AudioWorkletNode`.
     * @param {ScriptProcessorNode|AudioWorkletNode} processor This argument is the instance of `ScriptProcessorNode` or `AudioWorkletNode`.
     * @return {ProcessorModule} This is returned for method chain.
     * @override
     */
    setup(processor) {
        if ((processor instanceof ScriptProcessorNode) || (processor instanceof AudioWorkletNode)) {
            this.processor = processor;
        }

        return this;
    }

    /**
     * This method starts `onaudioprocess` event in the instance of `ScriptProcessorNode`.
     * @param {function} processCallback This argument is in order to change `onaudioprocess` event handler in the instance of `ScriptProcessorNode`.
     * @param {Array.<Effector>} connects This argument is the array for changing the default connection.
     * @return {ProcessorModule} This is returned for method chain.
     * @override
     */
    start(processCallback, connects) {
        const startTime = this.context.currentTime;

        // Clear previous
        this.envelopegenerator.clear(true);
        this.processor.disconnect(0);
        this.processor.onaudioprocess = null;

        // GainNode (Envelope Generator) -> ... -> AudioDestinationNode (Output)
        this.connect(this.envelopegenerator.getGenerator(0), connects);

        // ScriptProcessorNode (Input) -> GainNode (Envelope Generator)
        this.envelopegenerator.ready(0, this.processor);

        this.envelopegenerator.start(startTime);

        if (!this.isAnalyser) {
            this.analyser.start('time');
            this.analyser.start('fft');
            this.isAnalyser = true;
        }

        this.on(startTime);

        if (Object.prototype.toString.call(processCallback) === '[object Function]') {
            this.processor.onaudioprocess = processCallback;
        }

        return this;
    }

    /**
     * This method stops `onaudioprocess` event in the instance of `ScriptProcessorNode`.
     * @param {function} processCallback This argument is in order to change `onaudioprocess` event handler in the instance of `ScriptProcessodNode`.
     * @return {ProcessorModule} This is returned for method chain.
     * @override
     */
    stop(processCallback) {
        const stopTime = this.context.currentTime;

        this.envelopegenerator.stop(stopTime);
        this.off(stopTime);

        if (Object.prototype.toString.call(processCallback) === '[object Function]') {
            this.processor.onaudioprocess = processCallback;
        }

        return this;
    }

    /** @override */
    toString() {
        return '[ProcessorModule]';
    }
}
