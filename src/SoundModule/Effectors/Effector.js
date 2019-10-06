'use strict';

/**
 * This private class defines common properties for effector classes.
 * @constructor
 */
export class Effector {
    /**
     * @param {AudioContext} context This argument is in order to use the interfaces of Web Audio API.
     * @param {number} bufferSize This argument is buffer size for `ScriptProcessorNode`.
     */
    constructor(context, bufferSize) {
        this.isActive = true;

        this.context = context;

        // for connecting external node
        this.input  = context.createGain();
        this.output = context.createGain();

        // for LFO (Low Frequency Oscillator)
        // LFO changes parameter cyclically
        this.lfo       = context.createOscillator();
        this.depth     = context.createGain();
        this.rate      = this.lfo.frequency;
        this.processor = context.createScriptProcessor(bufferSize, 1, 2);

        // for legacy browsers
        this.lfo.start = this.lfo.start || this.lfo.noteOn;
        this.lfo.stop  = this.lfo.stop  || this.lfo.noteOff;

        this.values = {};

        this.isStop = true;
    }

    /**
     * This abstract method gets or sets parameter.
     * @param {string|object} key This argument is property name in the case of string type.
     *     This argument is pair of property and value in the case of associative array.
     * @param {number|string} value This argument is the value of designated property. If this argument is omitted, This method is getter.
     * @return {number|Effector} This is returned as the value of designated property in the case of getter. Otherwise, this is returned for method chain.
     * @abstract
     */
    param() {
      return this;
    }

    /**
     * This abstract method connects nodes according to state.
     * @return {Effector} This is returned for method chain.
     * @abstract
     */
    connect() {
      return this;
    }

    /**
     * This method starts LFO. Namely, this method starts effector.
     * @param {number} startTime This argument is in order to schedule parameter.
     * @return {Effector} This is returned for method chain.
     */
    start(startTime) {
        if (this.isActive && this.isStop) {
            let s = parseFloat(startTime);

            if (isNaN(s) || (s < this.context.currentTime)) {
                s = this.context.currentTime;
            }

            this.lfo.start(s);
            this.isStop = false;
        }

        return this;
    }

    /**
     * This method stops LFO, and creates the instance of `OscillatorNode` again.
     * @param {number} stopTime This argument is in order to schedule parameter.
     * @param {number} releaseTime This argument is in order to schedule parameter when it is necessary to consider release time.
     * @return {Effector} This is returned for method chain.
     */
    stop(stopTime, releaseTime) {
        if (this.isActive && !this.isStop) {
            let s = parseFloat(stopTime);
            let r = parseFloat(releaseTime);

            if (isNaN(s) || (s < this.context.currentTime)) {
                s = this.context.currentTime;
            }

            if (isNaN(r) || (r < 0)) {
                r = 0;
            }

            // for saving value
            const type = this.lfo.type;
            const rate = this.lfo.frequency.value;

            // Destroy the instance of `OscillatorNode`
            this.lfo.stop(s + r);

            // Create the instance of `OscillatorNode` again
            this.lfo = this.context.createOscillator();

           // for legacy browsers
            this.lfo.start = this.lfo.start || this.lfo.noteOn;
            this.lfo.stop  = this.lfo.stop  || this.lfo.noteOff;

            // Set the saved value
            this.lfo.type            = type;
            this.lfo.frequency.value = rate;

            this.rate = this.lfo.frequency;

            this.isStop = true;
        }

        return this;
    }

    /**
     * This method toggles active state or inactive state.
     * @param {boolean|string} state If this argument is boolean, state is changed the designated.
     *     If this argument is 'toggle', state is changed automatically.
     *     If this argument is omitted, this method is getter.
     * @return {boolean|Effector} This is returned as current state. Otherwise, this is returned for method chain.
     */
    state(state) {
        if (state === undefined) {
            return this.isActive;
        }

        if (String(state).toLowerCase() === 'toggle') {
            this.isActive = !this.isActive;
        } else {
            this.isActive = Boolean(state);
        }

        // Change connection
        this.connect();

        // Start LFO
        this.start(this.context.currentTime);

        return this;
    }

    /**
     * This method gets effecter's parameters as associative array.
     * @return {object}
     * @abstract
     */
    params() {
        return {};
    }

    /**
     * This method gets effecter's parameters as JSON.
     * @return {string}
     * @abstract
     */
    toJSON() {
        return JSON.stringify(this.params());
    }

    /** @override */
    toString() {
        return '[SoundModule Effector]';
    }
}
