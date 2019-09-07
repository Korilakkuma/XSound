'use strict';

import { SoundModule } from '../SoundModule';
import { Oscillator } from './Oscillator';
import { Glide } from './Glide';

/**
 * This subclass defines properties for creating sound.
 * Actually, properties for creating sound is defined in private class (`Oscillator`).
 * Therefore, this class manages these private classes for creating sound.
 * @constructor
 * @extends {SoundModule}
 */
export class OscillatorModule extends SoundModule {
    /**
     * @param {AudioContext} context This argument is in order to use the interfaces of Web Audio API.
     * @param {number} bufferSize This argument is buffer size for `ScriptProcessorNode`.
     */
    constructor(context, bufferSize) {
        super(context, bufferSize);

        /** @type {Array.<Oscillator>} */
        this.sources = [];

        // for scheduling
        this.times = {
            'start' : 0,
            'stop'  : 0
        };

        // This flag determines whether sound wave is drawn
        this.isAnalyser = false;

        this.glide = new Glide(context);
    }

    /**
     * This method creates the instances of `Oscillator`.
     * @param {Array.<boolean>|boolean} states This argument is initial state in the instance of `Oscillator`.
     * @return {OscillatorModule} This is returned for method chain.
     * @override
     */
    setup(states) {
        // Clear
        this.sources.length = 0;

        if (!Array.isArray(states)) {
            states = [states];
        }

        for (let i = 0, len = states.length; i < len; i++) {
            this.sources[i] = new Oscillator(this.context, Boolean(states[i]));
            this.envelopegenerator.setGenerator(i);
        }

        return this;
    }

    /**
     * This method is getter or setter for parameters.
     * @param {string|object} key This argument is property name in the case of string type.
     *     This argument is pair of property and value in the case of associative array.
     * @param {number} value This argument is the value of designated property. If this argument is omitted, This method is getter.
     * @return {number|OscillatorModule} This is returned as the value of designated property in the case of getter. Otherwise, this is returned for method chain.
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

    /**
     * This method schedules the time of start and stop.
     * @param {number} startTime This argument is the start time. The default value is 0.
     * @param {number} stopTime This argument is the stop time. The default value is 0.
     * @return {OscillatorModule} This is returned for method chain.
     * @override
     */
    ready(startTime, stopTime) {
        const st = parseFloat(startTime);
        const sp = parseFloat(stopTime);

        this.times.start = (st >=  0) ? st : 0;
        this.times.stop  = (sp >= st) ? sp : 0;

        this.envelopegenerator.clear(true);

        return this;
    }

    /**
     * This method starts some sounds that are active at the same time.
     * @param {Array.<number>}|number} frequencies This argument each oscillator frequency. The default value is 0 Hz.
     * @param {Array.<Effector>} connects This argument is the array for changing the default connection.
     * @param {function} processCallback This argument is in order to change `onaudioprocess` event handler in the instance of `ScriptProcessorNode`.
     * @return {OscillatorModule} This is returned for method chain.
     * @override
     */
    start(frequencies, connects, processCallback) {
        const startTime = this.context.currentTime + this.times.start;

        // Validate the 1st argument
        if (!Array.isArray(frequencies)) {
            frequencies = [frequencies];
        }

        for (let i = 0, len = frequencies.length; i < len; i++) {
            const f = parseFloat(frequencies[i]);
            frequencies[i] = (f >= 0) ? f : 0;
        }

        // Clear previous
        this.envelopegenerator.clear(true);
        this.processor.disconnect(0);
        this.processor.onaudioprocess = null;

        // ScriptProcessorNode (Mix oscillators) -> ... -> AudioDestinationNode (Output)
        this.connect(this.processor, connects);

        for (let i = 0, len = frequencies.length; i < len; i++) {
            if (i >= this.sources.length) {
                break;
            }

            const oscillator = this.sources[i];
            const frequency  = frequencies[i];

            // GainNode (Volume) -> ScriptProcessorNode (Mix oscillators)
            oscillator.ready(this.processor);

            // OscillatorNode (Input) -> GainNode (Envelope Generator) -> GainNode (Volume)
            this.envelopegenerator.ready(i, oscillator.source, oscillator.volume);

            this.glide.ready(frequency).start(oscillator.source, startTime);

            oscillator.start(startTime);
        }

        // Attack -> Decay -> Sustain
        this.envelopegenerator.start(startTime);

        this.on(startTime);

        if (!this.isAnalyser) {
            this.analyser.start('time');
            this.analyser.start('fft');
            this.isAnalyser = true;
        }

        if (Object.prototype.toString.call(processCallback) === '[object Function]') {
            this.processor.onaudioprocess = processCallback;
        } else {
            this.processor.onaudioprocess = event => {
                const inputLs  = event.inputBuffer.getChannelData(0);
                const inputRs  = event.inputBuffer.getChannelData(1);
                const outputLs = event.outputBuffer.getChannelData(0);
                const outputRs = event.outputBuffer.getChannelData(1);

                // Stop ?
                if (this.envelopegenerator.isStop()) {
                    // Stop
                    const stopTime = this.context.currentTime;

                    for (const source of this.sources) {
                        source.stop(stopTime);
                    }

                    this.off(stopTime);

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
        }

        return this;
    }

    /**
     * This method stops active sounds.
     * @return {OscillatorModule} This is returned for method chain.
     * @override
     */
    stop() {
        const stopTime = this.context.currentTime + this.times.stop;

        // Attack or Decay or Sustain -> Release
        this.envelopegenerator.stop(stopTime);

        this.glide.stop();
        this.filter.stop(stopTime);

        return this;
    }

    /**
     * This method gets the instance of `Oscillator` that is used in `OscillatorModule`.
     * @param {number} index This argument is required in the case of designating `Oscillator`.
     * @return {Array.<Oscillator>|Oscillator}
     * @override
     */
    get(index) {
        const i = parseInt(index, 10);

        return ((i >= 0) && (i < this.sources.length)) ? this.sources[i] : this.sources;
    }

    /**
     * This method returns the number of oscillators.
     * @return {number} This is returned as the number of oscillators.
     */
    length() {
        return this.sources.length;
    }

    /** @override */
    params() {
        const params = super.params();

        params.oscillator = {
            'glide' : {
                'type' : this.glide.param('type'),
                'time' : this.glide.param('time')
            }
        };

        for (let i = 0, len = this.sources.length; i < len; i++) {
            const source = this.sources[i];

            params.oscillator[`oscillator${i}`] = {
                'state'  : source.state(),
                'gain'   : source.param('gain'),
                'type'   : source.param('type'),
                'octave' : source.param('octave'),
                'fine'   : source.param('fine')
            };
        }

        return params;
    }

    /** @override */
    toString() {
        return '[OscillatorModule]';
    }
}
