'use strict';

import Effector from './Effector';

/**
 * Effector's subclass
 * @constructor
 * @extends {Effector}
 */
export default class AutopannerFallback extends Effector {
    /**
     * @param {AudioContext} context This argument is in order to use the interfaces of Web Audio API.
     * @param {number} bufferSize This argument is buffer size for `ScriptProcessorNode`.
     */
    constructor(context, bufferSize) {
        super(context, bufferSize);

        this.amplitudeL = context.createGain();
        this.amplitudeR = context.createGain();
        this.splitter   = context.createChannelSplitter(2);
        this.merger     = context.createChannelMerger(2);

        this.amplitudeL.gain.value = 1;  // 1 +- depth
        this.amplitudeR.gain.value = 1;  // 1 +- depth

        // Initialize parameters
        this.depth.gain.value = 0;
        this.rate.value       = 0;

        // `AutopannerFallback` is not connected by default
        this.state(false);

        // LFO
        this.lfoSplitter = context.createChannelSplitter(2);

        // OscillatorNode (LFO) -> GainNode (Depth) -> ScriptProcessorNode -> ChannelSplitterNode -> AudioParam (gain) (L) / (R)
        this.lfo.connect(this.depth);
        this.depth.connect(this.processor);
        this.processor.connect(this.lfoSplitter);
        this.lfoSplitter.connect(this.amplitudeL.gain, 0);
        this.lfoSplitter.connect(this.amplitudeR.gain, 1);
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
        this.amplitudeL.disconnect(0);
        this.amplitudeR.disconnect(0);
        this.splitter.disconnect(0);
        this.splitter.disconnect(1);
        this.merger.disconnect(0);

        if (this.isActive) {
            // GainNode (Input) -> ChannelSplitterNode -> GainNode (L) / (R) -> ChannelMergerNode -> GainNode (Output)
            this.input.connect(this.splitter);
            this.splitter.connect(this.amplitudeL, 0, 0);
            this.splitter.connect(this.amplitudeR, 1, 0);
            this.amplitudeL.connect(this.merger, 0, 0);
            this.amplitudeR.connect(this.merger, 0, 1);
            this.merger.connect(this.output);
        } else {
            // GainNode (Input) -> GainNode (Output)
            this.input.connect(this.output);
        }

        return this;
    }

    /** @override */
    start(startTime) {
        if (this.isActive && this.isStop) {
            let s = parseFloat(startTime);

            if (isNaN(s) || (s < this.context.currentTime)) {
                s = this.context.currentTime;
            }

            this.lfo.start(s);
            this.isStop = false;

            const bufferSize = this.processor.bufferSize;

            this.processor.onaudioprocess = event => {
                const inputs   = event.inputBuffer.getChannelData(0);
                const outputLs = event.outputBuffer.getChannelData(0);
                const outputRs = event.outputBuffer.getChannelData(1);

                if (this.isActive && (this.depth.gain.value !== 0) && (this.rate.value !== 0)) {
                    for (let i = 0; i < bufferSize; i++) {
                        outputLs[i] =  inputs[i];
                        outputRs[i] = -inputs[i];
                    }
                } else {
                    for (let i = 0; i < bufferSize; i++) {
                        outputLs[i] = 0;
                        outputRs[i] = 0;
                    }
                }
            };
        }

        return this;
    }

    /** @override */
    stop(stopTime, releaseTime) {
        super.stop(stopTime, releaseTime);

        // Effector's state is active ?
        if (this.isActive) {
            // Stop `onaudioprocess` event
            this.processor.disconnect(0);
            this.processor.onaudioprocess = null;

            // Connect nodes again
            this.lfo.connect(this.depth);
            this.depth.connect(this.processor);
            this.processor.connect(this.lfoSplitter);
            this.lfoSplitter.connect(this.amplitudeL.gain, 0);
            this.lfoSplitter.connect(this.amplitudeR.gain, 1);
        }

        return this;
    }

    /** @override */
    params() {
        const params = {
            'state' : this.isActive,
            'depth' : this.depth.gain.value,
            'rate'  : this.rate.value
        };

        return params;
    }

    /** @override */
    toString() {
        return '[SoundModule AutopannerFallback]';
    }
}
