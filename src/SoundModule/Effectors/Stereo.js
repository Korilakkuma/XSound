'use strict';

import { Effector } from './Effector';

/**
 * Effector's subclass
 * @constructor
 * @extends {Effector}
 */
export class Stereo extends Effector {
    static MAX_DELAY_TIME = 1;  // Max delay time is 1000 [ms]

    /**
     * @param {AudioContext} context This argument is in order to use the interfaces of Web Audio API.
     * @param {number} bufferSize This argument is buffer size for `ScriptProcessorNode`.
     */
    constructor(context, bufferSize) {
        super(context, bufferSize);

        this.splitter = context.createChannelSplitter(2);
        this.merger   = context.createScriptProcessor(bufferSize, 2, 2);
        this.delayL   = context.createDelay(Stereo.MAX_DELAY_TIME);
        this.delayR   = context.createDelay(Stereo.MAX_DELAY_TIME);

        // Initialize parameters
        this.delayL.delayTime.value = 0;
        this.delayR.delayTime.value = 0;

        // `Stereo` is not connected by default
        this.state(false);
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
                case 'delaytime':
                case 'time'     :
                    if (value === undefined) {
                        return this.delayL.delayTime.value;
                    }

                    v   = parseFloat(value);
                    min = 0;
                    max = Stereo.MAX_DELAY_TIME;

                    if ((v >= min) && (v <= max)) {
                        this.delayL.delayTime.value = v;
                        this.delayR.delayTime.value = v;
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
        this.splitter.disconnect(0);
        this.delayL.disconnect(0);
        this.delayR.disconnect(0);
        this.merger.disconnect(0);

        if (this.isActive) {
            // Effect ON

            // GainNode (Input) -> ChannelSplitterNode -> DelayNode (L) / (R) -> ScriptProcessorNode -> GainNode (Output)
            this.input.connect(this.splitter);
            this.splitter.connect(this.delayL, 0, 0);
            this.splitter.connect(this.delayR, 1, 0);
            this.delayL.connect(this.merger);
            this.delayR.connect(this.merger);
            this.merger.connect(this.output);
        } else {
            // Effect OFF

            // GainNode (Input) -> GainNode (Output)
            this.input.connect(this.output);
        }

        return this;
    }

    /** @override */
    start() {
        if (this.isActive && this.isStop) {
            this.isStop = false;

            const bufferSize = this.merger.bufferSize;

            this.merger.onaudioprocess = event => {
                const inputLs  = event.inputBuffer.getChannelData(0);
                const inputRs  = event.inputBuffer.getChannelData(1);
                const outputLs = event.outputBuffer.getChannelData(0);
                const outputRs = event.outputBuffer.getChannelData(1);

                if (this.isActive && (this.delayL.delayTime.value !== 0) && (this.delayR.delayTime.value !== 0)) {
                    for (let i = 0; i < bufferSize; i++) {
                        outputLs[i] =  inputLs[i];
                        outputRs[i] = -inputRs[i];
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
            this.merger.disconnect(0);
            this.merger.onaudioprocess = null;
        }

        return this;
    }

    /** @override */
    params() {
        const params = {
            'state' : this.isActive,
            'time'  : this.delayL.delayTime.value
        };

        return params;
    }

    /** @override */
    toString() {
        return '[SoundModule Stereo]';
    }
}
