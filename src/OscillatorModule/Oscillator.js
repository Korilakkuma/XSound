'use strict';

/**
 * This private class defines properties for the instance of `OscillatorNode`.
 * @constructor
 */
export default class Oscillator {
    // 1 Octave = 1200 cent
    static OCTAVE = 1200;

    // for legacy browsers
    static WAVE_TYPES = {
        'sine'     : 0,
        'square'   : 1,
        'sawtooth' : 2,
        'triangle' : 3
    };

    /**
     * @param {AudioContext} context This argument is in order to use the interfaces of Web Audio API.
     * @param {boolean} state This argument is initial state.
     */
    constructor(context, state) {
        this.isActive = state;

        this.context = context;

        this.source = context.createOscillator();

        // for legacy browsers
        this.source.setPeriodicWave = this.source.setPeriodicWave || this.source.setWaveTable;
        this.source.start           = this.source.start           || this.source.noteOn;
        this.source.stop            = this.source.stop            || this.source.noteOff;

        this.volume = context.createGain();

        // in order to not call in duplicate `start` or `stop`  method in the instance of `OscillatorNode`
        this.isStop = true;

        this.octave  = 0;
        this.fine    = 0;
        this.customs = {
            'real' : new Float32Array([0, 1]),
            'imag' : new Float32Array([0, 1])
        };
    }

    /**
     * This method is getter or setter for parameters.
     * @param {string|object} key This argument is property name in the case of string type.
     *     This argument is pair of property and value in the case of associative array.
     * @param {number|string} value This argument is the value of designated property. If this argument is omitted, This method is getter.
     * @return {number|string|Oscillator} This is returned as the value of designated property in the case of getter. Otherwise, this is returned for method chain.
     */
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
                case 'type':
                    if (value === undefined) {
                        return this.source.type;
                    }

                    if (Object.prototype.toString.call(value) !== '[object Object]') {
                        v = String(value).toLowerCase();

                        if (v in Oscillator.WAVE_TYPES) {
                            this.source.type = (typeof this.source.type === 'string') ? v : Oscillator.WAVE_TYPES[v];
                        }
                    } else {
                        // Custom wave
                        if (('real' in value) && ('imag' in value)) {
                            let reals = null;
                            let imags = null;

                            if (value.real instanceof Float32Array) {
                                reals = value.real;
                            } else if (Array.isArray(value.real)) {
                                reals = new Float32Array(value.real);
                            }

                            if (value.imag instanceof Float32Array) {
                                imags = value.imag;
                            } else if (Array.isArray(value.imag)) {
                                imags = new Float32Array(value.imag);
                            }

                            if ((reals instanceof Float32Array) && (imags instanceof Float32Array)) {
                                const MAX_SIZE = 4096;  // This size is defined by specification

                                if (reals.length > MAX_SIZE) {reals = reals.subarray(0, MAX_SIZE);}
                                if (imags.length > MAX_SIZE) {imags = imags.subarray(0, MAX_SIZE);}

                                // The 1st value is fixed by 0 (This is is defined by specification)
                                if (reals[0] !== 0) {reals[0] = 0;}
                                if (imags[0] !== 0) {imags[0] = 0;}

                                const periodicWave = this.context.createPeriodicWave(reals, imags);

                                this.source.setPeriodicWave(periodicWave);
                                this.customs.real = reals;
                                this.customs.imag = imags;
                            }
                        }
                    }

                    break;
                case 'octave':
                    if (value === undefined) {
                        return this.octave;
                    }

                    v   = parseFloat(value);
                    min = -4800 / Oscillator.OCTAVE;
                    max =  4800 / Oscillator.OCTAVE;

                    if ((v >= min) && (v <= max)) {
                        this.octave = v;
                        this.source.detune.value = this.fine + (v * Oscillator.OCTAVE);
                    }

                    break;
                case 'fine':
                    if (value === undefined) {
                        return this.fine;
                    }

                    v   = parseFloat(value);
                    min = -Oscillator.OCTAVE;
                    max =  Oscillator.OCTAVE;

                    if ((v >= min) && (v <= max)) {
                        this.fine = v;
                        this.source.detune.value = v + (this.octave * Oscillator.OCTAVE);
                    }

                    break;
                case 'volume':
                case 'gain'  :
                    if (value === undefined) {
                        return this.volume.gain.value;
                    }

                    v   = parseFloat(value);
                    min = 0;
                    max = 1;

                    if ((v >= min) && (v <= max)) {
                        this.volume.gain.value = v;
                    }

                    break;
                default:
                    break;
            }
        }

        return this;
    }

    /**
     * This method connects nodes.
     * @param {AudioNode} output This argument is the instance of `AudioNode` as output.
     * @return {Oscillator} This is returned for method chain.
     */
    ready(output) {
        if (this.isActive) {
            // for saving value
            const params = {
                'type'      : this.source.type,
                'frequency' : this.source.frequency.value,
                'detune'    : this.source.detune.value
            };

            if (!this.isStop) {
                this.source.stop(this.context.currentTime);
                this.source.disconnect(0);
            }

            this.source = this.context.createOscillator();

            // for legacy browsers
            this.source.setPeriodicWave = this.source.setPeriodicWave || this.source.setWaveTable;
            this.source.start           = this.source.start           || this.source.noteOn;
            this.source.stop            = this.source.stop            || this.source.noteOff;

            if (params.type === 'custom') {
                // Custom wave
                const reals        = this.customs.real;
                const imags        = this.customs.imag;
                const periodicWave = this.context.createPeriodicWave(reals, imags);

                this.source.setPeriodicWave(periodicWave);
            } else {
                this.source.type = params.type;
            }

            this.source.frequency.value = params.frequency;
            this.source.detune.value    = params.detune;

            this.volume.connect(output);
        }

        return this;
    }

    /**
     * This method starts sound.
     * @param {number} startTime This argument is the start time.
     * @return {Oscillator} This is returned for method chain.
     */
    start(startTime) {
        if (this.isActive) {
            this.source.start(startTime);
            this.isStop = false;
        } else {
            if (!this.isStop) {
                this.source.stop(this.context.currentTime);
                this.isStop = true;
            }

            this.source.disconnect(0);
        }

        return this;
    }

    /**
     * This method stops sound.
     * @param {number} stopTime This argument is the stop time.
     * @return {Oscillator} This is returned for method chain.
     */
    stop(stopTime) {
        if (!this.isStop) {
            this.source.stop(stopTime);
            this.source.disconnect(0);

            this.isStop = true;
        }

        return this;
    }

    /**
     * This method toggles active state or inactive state.
     * @param {boolean|string} state If this argument is boolean, state is changed the designated.
     *     If this argument is 'toggle', state is changed automatically.
     *     If this argument is omitted, this method is getter.
     * @return {boolean|Oscillator} This is returned as current state. Otherwise, this is returned for method chain.
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

        return this;
    }

    /**
     * This method gets the instance of `OscillatorNode`.
     * @return {OscillatorNode}
     */
    get() {
        return this.source;
    }

    /** @override */
    toString() {
        return '[OscillatorModule Oscillator]';
    }
}
