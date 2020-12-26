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

        this.processor = null;
        this.name      = '';
        this.options   = {};
        this.moduleURL = '';
        this.promise   = null;

        this.runAnalyser = false;
    }

    /**
     * This method sets registered processor and options for `AudioWorkletNode` constructor.
     * @param {string} name This argument is he name of the `AudioWorkletProcessor` this node will be based on.
     * @param {object} options This argument is an object based on the `AudioWorkletNodeOptions` dictionary.
     * @return {ProcessorModule} This is returned for method chain.
     * @override
     */
    setup(name, options) {
        this.name = String(name);

        if (Object.prototype.toString.call(options) === '[object Object]') {
            this.options = options;
        }

        if (!window.AudioWorkletNode) {
            // Polyfill
            this.processor = this.context.createScriptProcessor(this.bufferSize, SoundModule.NUMBER_OF_INPUTS, SoundModule.NUMBER_OF_OUTPUTS);
        }

        return this;
    }

    /**
     * This method adds module for worklet and creates the instance of `AudioWorkletNode`.
     * @param {string} moduleURL This argument is the string containing the URL of a JavaScript file with the module to add.
     * @param {object} options This argument is one of 'omit', 'same-origin', 'include'. The default value is 'same-origin'.
     * @return {Promise} This is returned as `Promise` of `addModule`.
     * @override
     */
    ready(moduleURL, options) {
        if (!window.AudioWorkletNode) {
            return Promise.reject('Cannot use AudioWorklet');
        }

        this.moduleURL = String(moduleURL);

        if (Object.prototype.toString.call(options) === '[object Object]') {
            this.promise = this.context.audioWorklet.addModule(this.moduleURL, options);
        } else {
            this.promise = this.context.audioWorklet.addModule(this.moduleURL);
        }

        return this.promise
            .then(() => {
                if (Object.keys(this.options).length > 0) {
                    this.processor = new AudioWorkletNode(this.context, this.name, this.options);
                } else {
                    this.processor = new AudioWorkletNode(this.context, this.name);
                }
            });
    }

    /**
     * This method starts worklet.
     * @param {function} processCallback This argument is in order to set `onaudioprocess` event handler in the instance of `ScriptProcessorNode`.
     * @param {Array.<Effector>} connects This argument is the array for changing the default connection.
     * @return {ProcessorModule} This is returned as method chain.
     * @override
     */
    start(processCallback, connects) {
        const startTime = this.context.currentTime;

        // Clear previous
        this.envelopegenerator.clear(true);
        this.processor.disconnect(0);

        if (this.processor.onaudioprocess instanceof ScriptProcessorNode) {
            this.processor.onaudioprocess = null;
        }

        // GainNode (Envelope Generator) -> ... -> AudioDestinationNode (Output)
        this.connect(this.envelopegenerator.getGenerator(0), connects);

        // AudioWorkletNode (Input) -> GainNode (Envelope Generator)
        this.envelopegenerator.ready(0, this.processor);

        this.envelopegenerator.start(startTime);

        if (!this.runAnalyser) {
            this.analyser.start('time');
            this.analyser.start('fft');
            this.runAnalyser = true;
        }

        this.on(startTime);

        if ((this.processor instanceof ScriptProcessorNode) && (Object.prototype.toString.call(processCallback) === '[object Function]')) {
            this.processor.onaudioprocess = processCallback;
        }

        return this;
    }

    /**
     * This method stops envelope generator, effectors and `onaudioprocess` event if use `ScriptProcessorNode`.
     * @param {function} processCallback This argument is in order to change `onaudioprocess` event handler in the instance of `ScriptProcessorNode`.
     * @return {ProcessorModule} This is returned for method chain.
     * @override
     */
    stop(processCallback) {
        const stopTime = this.context.currentTime;

        this.processor.disconnect(0);
        this.envelopegenerator.stop(stopTime);
        this.off(stopTime);

        if ((this.processor instanceof ScriptProcessorNode) && (Object.prototype.toString.call(processCallback) === '[object Function]')) {
            this.processor.onaudioprocess = processCallback;
        }

        return this;
    }

    /**
     * This method sends a message from the `MessagePort` of `AudioWorkletNode`.
     * @param {any} data This argument is sent as any data.
     * @return {ProcessorModule} This is returned for method chain.
     */
    postMessage(data) {
        if (this.processor instanceof AudioWorkletNode) {
            this.processor.port.postMessage(data);
        }

        return this;
    }

    /**
     * This method sets the event handler that is invoked when the port receives a message.
     * @param {function|null} This argument is invoked when the port receives a message.
     * @return {ProcessorModule} This is returned for method chain.
     */
    onMessage(callback) {
        if (this.processor instanceof AudioWorkletNode) {
            this.processor.port.onmessage = callback;
        }

        return this;
    }

    /**
     * This method gets object that is accessed as a `AudioParamMap`.
     * @return {AudioParamMap|Map} This is returned as `AudioParamMap` (or empty `Map`).
     */
    map() {
        if (this.processor instanceof AudioWorkletNode) {
            return this.processor.parameters;
        }

        return new Map();
    }

    /**
     * This method gets the instance of `AudioParam` that is defined by `AudioParamDescriptor`.
     * @param {string} This argument is the designated key for getting as `AudioParam`.
     * @return {AudioParam|null} This is returned as `AudioParam` (or `null`).
     */
    param(key) {
        if (this.processor instanceof AudioWorkletNode) {
            return this.processor.parameters.get(key);
        }

        return null;
    }

    /**
     * This method gets the instance of `AudioWorkletNode` (or `ScriptProcessorNode`);
     * @return {AudioWorkletNode|ScriptProcessorNode}
     * @override
     */
    get() {
        return this.processor;
    }

    /** @override */
    toString() {
        return '[ProcessorModule]';
    }
}
