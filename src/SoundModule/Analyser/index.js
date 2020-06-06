'use strict';

import { TimeOverview } from './TimeOverview';
import { Time } from './Time';
import { FFT } from './FFT';

/**
 * This private class manages 3 private classes (`TimeOverview`, `Time`, `FFT`) for drawing sound wave.
 * @constructor
 */
export class Analyser {
    /**
     * @param {AudioContext} context This argument is This argument is in order to use the interfaces of Web Audio API.
     */
    constructor(context) {
        this.analyser = context.createAnalyser();
        this.input    = context.createGain();

        // GainNode (Input) -> AnalyserNode
        this.input.connect(this.analyser);

        this.timeOverviewL = new TimeOverview(context.sampleRate);
        this.timeOverviewR = new TimeOverview(context.sampleRate);
        this.time          = new Time(context.sampleRate);
        this.fft           = new FFT(context.sampleRate);

        // Set default value
        this.analyser.fftSize               = 2048;
        this.analyser.minDecibels           = -100;
        this.analyser.maxDecibels           = -30;
        this.analyser.smoothingTimeConstant = 0.8;
    }

    /**
     * This method is getter or setter for parameters.
     * @param {string|object} key This argument is property name in the case of string type.
     *     This argument is pair of property and value in the case of associative array.
     * @param {number|} value This argument is the value of designated property. If this argument is omitted, This method is getter.
     * @return {number|Analyser} This is returned as the value of designated property in the case of getter. Otherwise, this is returned for method chain.
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
                case 'fftsize':
                    if (value === undefined) {
                        return this.analyser.fftSize;
                    }

                    v = parseInt(value, 10);

                    switch (v) {
                        case   32:
                        case   64:
                        case  128:
                        case  256:
                        case  512:
                        case 1024:
                        case 2048:
                            this.analyser.fftSize = v;
                            break;
                        default:
                            break;
                    }

                    break;
                case 'frequencybincount':
                    return this.analyser.frequencyBinCount;  // Getter only
                case 'mindecibels':
                    if (value === undefined) {
                        return this.analyser.minDecibels;
                    }

                    v   = parseFloat(value);
                    max = -30;

                    if (v < max) {
                        this.analyser.minDecibels = v;
                    }

                    break;
                case 'maxdecibels':
                    if (value === undefined) {
                        return this.analyser.maxDecibels;
                    }

                    v   = parseFloat(value);
                    min = -100;

                    if (v > min) {
                        this.analyser.maxDecibels = v;
                    }

                    break;
                case 'smoothingtimeconstant':
                    if (value === undefined) {
                        return this.analyser.smoothingTimeConstant;
                    }

                    v   = parseFloat(value);
                    min = 0;
                    max = 1;

                    if ((v >= min) && (v <= max)) {
                        this.analyser.smoothingTimeConstant = v;
                    }

                    break;
                default:
                    break;
            }
        }

        return this;
    }

    /**
     * This method creates data for drawing and executes drawing.
     * @param {string} domain This argument is one of 'timeOverviewL', 'timeOverviewR', 'time', 'fft'.
     * @param {AudioBuffer} buffer This argument is the instance of `AudioBuffer`. The data for drawing audio wave in overview of time domain is gotten from this argument.
     * @return {Analyser} This is returned for method chain.
     */
    start(domain, buffer) {
        const d = String(domain).replace(/-/g, '').toLowerCase();

        let data = null;

        switch (d) {
            case 'timeoverviewl':
                if (buffer instanceof AudioBuffer) {
                    if (buffer.numberOfChannels > 0) {
                        data = new Float32Array(buffer.length);
                        data.set(buffer.getChannelData(0));
                        this.timeOverviewL.start(data);
                    }
                }

                break;
            case 'timeoverviewr':
                if (buffer instanceof AudioBuffer) {
                    if (buffer.numberOfChannels > 1) {
                        data = new Float32Array(buffer.length);
                        data.set(buffer.getChannelData(1));
                        this.timeOverviewR.start(data);
                    }
                }

                break;
            case 'time':
                if (this.time.param('type') === 'uint') {
                    data = new Uint8Array(this.analyser.fftSize);
                    this.analyser.getByteTimeDomainData(data);
                    this.time.start(data);
                } else {
                    data = new Float32Array(this.analyser.fftSize);
                    this.analyser.getFloatTimeDomainData(data);
                    this.time.start(data);
                }

                if (this.time.param('interval') === 'auto') {
                    this.time.timerid = window.requestAnimationFrame(() => {
                        this.start(domain);
                    });
                } else {
                    this.time.timerid = window.setTimeout(() => {
                        this.start(domain);
                    }, this.time.param('interval'));
                }

                break;
            case 'fft':
                if (this.fft.param('type') === 'uint') {
                    data = new Uint8Array(this.analyser.frequencyBinCount);
                    this.analyser.getByteFrequencyData(data);
                    this.fft.start(data);
                } else {
                    data = new Float32Array(this.analyser.frequencyBinCount);
                    this.analyser.getFloatFrequencyData(data);
                    this.fft.start(data, this.analyser.minDecibels, this.analyser.maxDecibels);
                }

                if (this.fft.param('interval') === 'auto') {
                    this.fft.timerid = window.requestAnimationFrame(() => {
                        this.start(domain);
                    });
                } else {
                    this.fft.timerid = window.setTimeout(() => {
                        this.start(domain);
                    }, this.fft.param('interval'));
                }

                break;
            default:
                break;
        }

        return this;
    }

    /**
     * This method stops drawing.
     * @param {string} domain This argument is one of 'timeOverviewL', 'timeOverviewR', 'time', 'fft'.
     * @return {Analyser} This is returned for method chain.
     */
    stop(domain) {
        const d = String(domain).replace(/-/g, '').toLowerCase();

        switch (d) {
            case 'timeoverviewl':
            case 'timeoverviewr':
                break;
            case 'time':
                if (this.time.param('interval') === 'auto') {
                    window.cancelAnimationFrame(this.time.timerid);
                } else {
                    window.clearTimeout(this.time.timerid);
                }

                this.time.timerid = null;

                break;
            case 'fft':
                if (this.fft.param('interval') === 'auto') {
                    window.cancelAnimationFrame(this.fft.timerid);
                } else {
                    window.clearTimeout(this.fft.timerid);
                }

                this.fft.timerid = null;

                break;
            default:
                break;
        }

        return this;
    }

    /**
     * This method selects domain for drawing.
     * @param {string} domain This argument is one of 'timeoverview', 'timeOverviewL', 'timeOverviewR', 'time', 'fft'.
     * @param {number} channel This argument is number greater than or equal to 0.
     * @return {TimeOverview|Time|FFT|Analyser} This value is the instance of selected class.
     */
    domain(domain, channel) {
        const d = String(domain).replace(/-/g, '').toLowerCase();
        const c = parseInt(channel, 10);

        switch (d) {
            case 'timeoverview':
                switch (c) {
                    case 0:
                        return this.timeOverviewL;
                    case 1:
                        return this.timeOverviewR;
                    default:
                        return this;
                }
            case 'timeoverviewl':
            case 'timeoverviewr':
                return this[`timeOverview${d.slice(-1).toUpperCase()}`];
            case 'time':
            case 'fft' :
                return this[d];
            default:
                return this;
        }
    }

    /**
     * This method gets the instance of `AnalyserNode`.
     * @return {AnalyserNode}
     */
    get() {
        return this.analyser;
    }

    /** @override */
    toString() {
        return '[SoundModule Analyser]';
    }
}
