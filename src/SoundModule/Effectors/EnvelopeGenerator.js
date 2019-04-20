'use strict';

/**
 * This private class defines properties for Envelope Generator.
 * @constructor
 */
export class EnvelopeGenerator {
    static MIN_GAIN = 1e-3;

    /**
     * @param {AudioContext} context This argument is in order to use the interfaces of Web Audio API.
     */
    constructor(context) {
        this.context = context;

        /** @type {Array.<GainNode>} */
        this.generators = [];

        // for `GainNode`
        this.activeIndexes = [];
        this.activeCounter = 0;

        this.attack  = 0.01;
        this.decay   = 0.3;
        this.sustain = 0.5;
        this.release = 1.0;
    }

    /**
     * This method is getter or setter for parameters.
     * @param {string|object} key This argument is property name in the case of string type.
     *     This argument is pair of property and value in the case of associative array.
     * @param {number} value This argument is the value of designated property. If this argument is omitted, This method is getter.
     * @return {number|EnvelopeGenerator} This is returned as the value of designated property in the case of getter. Otherwise, this is returned for method chain.
     */
    param(key, value) {
        if (Object.prototype.toString.call(arguments[0]) === '[object Object]') {
            // Associative array
            for (const k in arguments[0]) {
                this.param(k, arguments[0][k]);
            }
        } else {
            const k = String(key).replace(/-/g, '').toLowerCase();

            let v = null;

            switch (k) {
                case 'attack' :
                case 'sustain':
                    if (value === undefined) {
                        return this[k];
                    }

                    v = parseFloat(value);

                    if (v >= 0) {
                        this[k] = v;
                    }

                    break;
                case 'decay'  :
                case 'release':
                    if (value === undefined) {
                        return this[k];
                    }

                    v = parseFloat(value);

                    if (v > 0) {
                        this[k] = v;
                    }

                    break;
                default:
                    break;
            }
        }

        return this;
    }

    /**
     * This method connects the instance of `AudioNode`.
     * @param {number} index This argument is in order to select the instance of `GainNode` that is Envelope Generator.
     * @param {AudioNode} input This argument is the instance of `AudioNode` as input.
     * @param {AudioNode} output This argument is the instance of `AudioNode` as output.
     * @return {EnvelopeGenerator} This is returned for method chain.
     */
    ready(index, input, output) {
        const i = (parseInt(index, 10) >= 0) ? parseInt(index, 10) : 0;

        if ((input instanceof AudioNode) && (output instanceof AudioNode)) {
            input.connect(this.generators[i]);
            this.generators[i].connect(output);
        } else if (input instanceof AudioNode) {
            input.connect(this.generators[i]);
        } else if (output instanceof AudioNode) {
            this.generators[i].connect(output);
        }

        this.activeIndexes[i] = i;
        this.activeCounter++;

        return this;
    }

    /**
     * This method changes gain (Attack -> Decay -> Sustain).
     * @param {number} startTime This argument is the start time of Attack.
     * @return {EnvelopeGenerator} This is returned for method chain.
     */
    start(startTime) {
        let s = parseFloat(startTime);

        if (isNaN(s) || (s < this.context.currentTime)) {
            s = this.context.currentTime;
        }

        // Attack -> Decay -> Sustain
        const t0      = s;
        const t1      = t0 + this.attack;
        const t2      = this.decay;
        const t2Value = this.sustain;

        for (const activeIndex of this.activeIndexes) {
            if (activeIndex === undefined) {
                continue;
            }

            // Start from `gain.value = 0`
            this.generators[activeIndex].gain.cancelScheduledValues(t0);
            this.generators[activeIndex].gain.setValueAtTime(0, t0);

            // Attack : `gain.value` increases linearly until assigned time (t1)
            this.generators[activeIndex].gain.linearRampToValueAtTime(1, t1);

            // Decay -> Sustain : `gain.value` gradually decreases to value of Sustain during of Decay time (t2) from assigned time (t1)
            this.generators[activeIndex].gain.setTargetAtTime(t2Value, t1, t2);
        }

        return this;
    }

    /**
     * This method changes gain (Attack or Decay or Sustain -> Release).
     * @param {number} stopTime This argument is the start time of Release.
     * @return {EnvelopeGenerator} This is returned for method chain.
     */
    stop(stopTime) {
        let s = parseFloat(stopTime) - this.release;

        if (isNaN(s) || (s < this.context.currentTime)) {
            s = this.context.currentTime;
        }

        // Sustain -> Release
        const t3 = s;
        const t4 = this.release;

        for (const activeIndex of this.activeIndexes) {
            if (activeIndex === undefined) {
                continue;
            }

            // in the case of mouseup on the way of Decay
            this.generators[activeIndex].gain.cancelScheduledValues(t3);

            // Release : `gain.value` gradually decreases to 0 during of Release time (t4) from assigned time (t3)
            this.generators[activeIndex].gain.setTargetAtTime(0, t3, t4);
        }

        return this;
    }

    /**
     * This method gets the instance of `GainNode` for Envelope Generator.
     * @param {number} index This argument is the index of array that contains the instance of `GainNode` for Envelope Generator.
     * @return {GainNode} This is returned as the instance of `GainNode` for Envelope Generator.
     */
    getGenerator(index) {
        const i = (parseInt(index, 10) >= 0) ? parseInt(index, 10) : 0;

        return this.generators[i];
    }

    /**
     * This method sets the instance of `GainNode` for Envelope Generator.
     * @param {number} index This argument is the index of array that contains the instance of `GainNode` for Envelope Generator.
     * @return {EnvelopeGenerator} This is returned for method chain.
     */
    setGenerator(index) {
        const i = (parseInt(index, 10) >= 0) ? parseInt(index, 10) : 0;

        this.generators[i] = this.context.createGain();

        // for legacy browsers
        this.generators[i].gain.setTargetAtTime = this.generators[i].gain.setTargetAtTime || this.generators[i].gain.setTargetValueAtTime;

        return this;
    }

    /**
     * This method determines whether the all of gain schedulings have ended.
     * @return {boolean} If the all of gain schedulings have ended, this value is `true`. Otherwise, this value is `false`.
     */
    isStop() {
        let counter = 0;

        for (const activeIndex of this.activeIndexes) {
            if (activeIndex === undefined) {
                continue;
            }

            if (this.generators[activeIndex].gain.value > EnvelopeGenerator.MIN_GAIN) {
                return false;
            }

            counter++;

            // the all of schedulings are stopped ?
            if (counter === this.activeCounter) {
                return true;
            }
        }
    }

    /**
     * This method clears variables for managing the instance of `GainNode`.
     * @param {boolean} isDisconnect This argument is in order to determine whether disconnect `AudioNode`.
     * @return {EnvelopeGenerator} This is returned for method chain.
     */
    clear(isDisconnect) {
        this.activeIndexes.length = 0;
        this.activeCounter = 0;

        for (const generator of this.generators) {
            generator.gain.cancelScheduledValues(this.context.currentTime);
            generator.gain.value = 1;

            if (isDisconnect) {
                generator.disconnect(0);
            }
        }

        return this;
    }

    /**
     * This method gets effecter's parameters as associative array.
     * @return {object}
     */
    params() {
        const params = {
            'attack'  : this.attack,
            'decay'   : this.decay,
            'sustain' : this.sustain,
            'release' : this.release
        };

        return params;
    }

    /**
     * This method gets effecter's parameters as JSON.
     * @return {string}
     */
    toJSON() {
        return JSON.stringify(this.params());
    }

    /** @override */
    toString() {
        return '[SoundModule EnvelopeGenerator]';
    }
}
