'use strict';

/**
 * This private class defines properties for Glide.
 * @constructor
 */
export default class Glide {
    static LINEAR      = 'linear';
    static EXPONENTIAL = 'exponential';

    /**
     * @param {AudioContext} context This argument is in order to use the interfaces of Web Audio API.
     */
    constructor(context) {
        this.context = context;

        this.frequencies = {
            'start' : -1,  // Abnormal value for the 1st sound
            'end'   : 0
        };

        this.time = 0;             // Glide time
        this.type = Glide.LINEAR;  // either 'linear' or 'exponential'
    }

    /**
     * This method is getter or setter for parameters.
     * @param {string|object} key This argument is property name in the case of string type.
     *     This argument is pair of property and value in the case of associative array.
     * @param {number} value This argument is the value of designated property. If this argument is omitted, This method is getter.
     * @return {number|Glide} This is returned as the value of designated property in the case of getter. Otherwise, this is returned for method chain.
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
                case 'time':
                    if (value === undefined) {
                        return this.time;
                    }

                    v = parseFloat(value);

                    if (v >= 0) {
                        this.time = v;
                    }

                    break;
                case 'type':
                    if (value === undefined) {
                        return this.type;
                    }

                    v = String(value).toLowerCase();

                    if ((v === Glide.LINEAR) || (v === Glide.EXPONENTIAL)) {
                        this.type = v;
                    }

                    break;
                default:
                    break;
            }
        }

        return this;
    }

    /**
     * This method sets frequencies for Glide.
     * @param {number} frequency This argument is the frequency at which glide ends.
     * @return {Glide} This is returned for method chain.
     */
    ready(frequency) {
        this.frequencies.end = frequency;

        const diff = (this.frequencies.start === -1) ? 0 : (this.frequencies.end - this.frequencies.start);

        if ((this.frequencies.start === -1) || (this.time === 0) || (diff === 0)) {
            // The 1st sound or Glide OFF or The same sound
            this.frequencies.start = this.frequencies.end;
        }

        return this;
    }

    /**
     * This method starts Glide.
     * @param {OscillatorNode} oscillator This argument is the instance of `OscillatorNode`.
     * @param {number} startTime This argument is the start time of Glide.
     * @return {Glide} This is returned for method chain.
     */
    start(oscillator, startTime) {
        let s = parseFloat(startTime);

        if (isNaN(s) || (s < this.context.currentTime)) {
            s = this.context.currentTime;
        }

        const t0 = s;
        const t1 = t0 + this.time;

        // Start Glide
        oscillator.frequency.cancelScheduledValues(t0);
        oscillator.frequency.setValueAtTime(this.frequencies.start, t0);
        oscillator.frequency[`${this.type}RampToValueAtTime`](this.frequencies.end, t1);

        return this;
    }

    /**
     * This method stops Glide. Moreover, This method prepares for next Glide.
     * @return {Glide} This is returned for method chain.
     */
    stop() {
        // Stop Glide or on the way of Glide
        this.frequencies.start = this.frequencies.end;

        return this;
    }

    /** @override */
    toString() {
        return '[OscillatorModule Glide]';
    }
}
