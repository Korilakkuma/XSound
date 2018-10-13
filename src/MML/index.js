'use strict';

import { OscillatorModule } from '../OscillatorModule';
import { OneshotModule } from '../OneshotModule';

/**
 * This class defines properties for playing the MML (Music Macro Language).
 * @constructor
 */
export class MML {
    static ONE_MINUTES       = 60;  // sec
    static EQUAL_TEMPERAMENT = 12;
    static QUARTER_NOTE      = 4;
    static REGEXP_MML        = /\s*(?:T\d+)\s*|\s*(?:O\d+)\s*|\s*(?:(?:[CDEFGABR][#+-]?)+(?:256|192|144|128|96|72|64|48|36|32|24|18|16|12|8|6|4|2|1)\.?)(?:&(?:[CDEFGABR][#+-]?)+(?:256|192|144|128|96|72|64|48|36|32|24|18|16|12|8|6|4|2|1)\.?)*\s*/gi;
    static REGEXP_TEMPO      = /T\d+/i;
    static REGEXP_OCTAVE     = /O\d+/i;
    static REGEXP_NOTE       = /(?:(?:[CDEFGABR][#+-]?)+)(?:256|192|144|128|96|72|64|48|36|32|24|18|16|12|8|6|4|2|1)(?:&(?:[CDEFGABR][#+-]?)+(?:256|192|144|128|96|72|64|48|36|32|24|18|16|12|8|6|4|2|1)\.?)*/i;
    static REGEXP_CHORD      = /((?:[CDEFGABR][#+-]?)+)(?:256|192|144|128|96|72|64|48|36|32|24|18|16|12|8|6|4|2|1)\.?.*/i;
    static REGEXP_DURATION   = /(?:[CDEFGABR][#+-]?)+((?:256|192|144|128|96|72|64|48|36|32|24|18|16|12|8|6|4|2|1)\.?.*)/i;
    static REST              = 'R';
    static ERROR_STRING      = 'MML';
    static ERROR_TEMPO       = 'TEMPO';
    static ERROR_OCTAVE      = 'OCTAVE';
    static ERROR_NOTE        = 'NOTE';

    /**
     * This class (static) method computes index by octave and pitch name.
     * @param {number} octave This argument is octave.
     * @param {string} pitchname This argument is pitch name.
     * @return {number|string} This is returned as index that is computed by octave and pitch name.
     */
    static computeIndex = (octave, pitchname) => {
        let index = 0;

        switch (pitchname) {
            case 'C':
                index = 3;
                break;
            case 'D':
                index = 5;
                break;
            case 'E':
                index = 7;
                break;
            case 'F':
                index = 8;
                break;
            case 'G':
                index = 10;
                break;
            case 'A':
                index = 12;
                break;
            case 'B':
                index = 14;
                break;
            case MML.REST:
                return MML.REST;
            default :
                break;
        }

        const computedIndex = (MML.EQUAL_TEMPERAMENT * (octave - 1)) + index;

        return (computedIndex >= 0) ? computedIndex : -1;
    };

    /**
     * This class (static) method computes frequency from the index that corresponds to the 12 equal temperament.
     * @param {number} index This argument is the index that corresponds to the 12 equal temperament.
     *     For example, This value is between 0 and 88 in the case of piano.
     * @return {number} This is returned as frequency.
     */
    static computeFrequency = index => {
        // The 12 equal temperament
        //
        // Min -> 27.5 Hz (A), Max -> 4186 Hz (C)
        //
        // A * 1.059463 -> A# (half up)

        const FREQUENCY_RATIO = Math.pow(2, (1 / 12));  // about 1.059463
        const MIN_A           = 27.5;

        return (index >= 0) ? (MIN_A * Math.pow(FREQUENCY_RATIO, index)) : -1;
    };

    /**
     * This class (static) method converts string to ASCII string.
     * @param {string} string This argument is string.
     * @return {string} This is returned as string that is converted to ASCII string.
     */
    static toAscii = string => {
        let converted = '';

        for (let i = 0, len = string.length; i < len; i++) {
            const charCode = string.charCodeAt(i);

            if (charCode > 0xFF) {
                converted += `&#${charCode};`;
            } else {
                converted += string.charAt(i);
            }
        }

        return converted;
    };

    /**
     * @param {AudioContext} context This argument is in order to use the interfaces of Web Audio API.
     */
    constructor(context) {
        this.context = context;

        // for the array of `OscillatorNode` or `OscillatorModule` or `OneshotModule`
        this.source = null;

        this.sequences = [];  /** @type {Array.<Array.<object>>} */
        this.timerids  = [];  /** @type {Array.<number>} */
        this.prev      = [];  /** @type {Array.<object>} */

        this.callbacks = {
            'start' : () => {},
            'stop'  : () => {},
            'ended' : () => {},
            'error' : () => {}
        };
    }

    /**
     * This method sets callback functions.
     * @param {string|object} key This argument is property name.
     *     This argument is pair of property and value in the case of associative array.
     * @param {function} value This argument is callback function.
     * @return {MML} This is returned for method chain.
     */
    setup(key, value) {
        if ((arguments.length > 0) && (Object.prototype.toString.call(arguments[0]) === '[object Object]')) {
            // Associative array
            for (const k in arguments[0]) {
                this.setup(k, arguments[0][k]);
            }
        } else if (arguments.length > 1) {
            const k = String(key).toLowerCase();

            if (k in this.callbacks) {
                if (Object.prototype.toString.call(value) === '[object Function]') {
                    this.callbacks[k] = value;
                }
            }
        }

        return this;
    }

    /**
     * This method parses MML string.
     * @param {Array.<OscillatorNode>|OscillatorModule|OneshotModule} source This argument is in order to select sound source.
     * @param {Array.<string>} mmls This argument is MML strings.
     * @return {Array.<Array.<object>>} This is returned as array that contains object for playing the MML.
     */
    ready(source, mmls) {
        if (this.source !== null) {
            this.stop();  // Stop the previous MML
        }

        // Clear
        this.sequences.length = 0;
        this.timerids.length  = 0;
        this.prev.length      = 0;

        if (Array.isArray(source)) {
            for (const s of source) {
                if (!(s instanceof OscillatorNode)) {
                    return this;
                }
            }

            this.source = source;
        } else if (source instanceof OscillatorNode) {
            this.source = [source];
        } else if ((source instanceof OscillatorModule) || (source instanceof OneshotModule)) {
            this.source = source;
        } else {
            return this;
        }

        if (!Array.isArray(mmls)) {
            mmls = [mmls];
        }

        while (mmls.length > 0) {
            const mml = String(mmls.shift());

            /** @type {Array.<object>}*/
            const sequences = [];

            const notes = mml.match(MML.REGEXP_MML);

            if (notes === null) {
                this.callbacks.error(MML.ERROR_STRING, '');
                return;
            }

            let indexes     = [];
            let frequencies = [];

            let start    = 0;
            let duration = 0;
            let stop     = 0;

            let currentTime = 0;
            let timeOf4note = null;
            let octave      = null;

            while (notes.length > 0) {
                const note = notes.shift().trim();

                if (MML.REGEXP_TEMPO.test(note)) {
                    const bpm = parseInt(note.slice(1), 10);

                    if (bpm > 0) {
                        timeOf4note = MML.ONE_MINUTES / bpm;
                    } else {
                        this.callbacks.error(MML.ERROR_TEMPO, note);
                        return;
                    }
                } else if (MML.REGEXP_OCTAVE.test(note)) {
                    octave = parseInt(note.slice(1), 10);

                    if (octave < 0) {
                        this.callbacks.error(MML.ERROR_OCTAVE, note);
                        return;
                    }
                } else if (MML.REGEXP_NOTE.test(note)) {
                    if (timeOf4note === null) {
                        this.callbacks.error(MML.ERROR_TEMPO, note);
                        return;
                    }

                    if (octave === null) {
                        this.callbacks.error(MML.ERROR_OCTAVE, note);
                        return;
                    }

                    const chord = note.match(MML.REGEXP_CHORD)[1];

                    indexes = [];

                    for (let i = 0, len = chord.length; i < len; i++) {
                        const pitchname = chord.charAt(i);

                        let index = MML.computeIndex(octave, pitchname.toUpperCase());

                        // Half up or Half down (Sharp or Flat) ?
                        switch (chord.charAt(i + 1)) {
                            case '#':
                            case '+':
                                // Half up (Sharp)
                                index++;
                                i++;
                                break;
                            case '-':
                                // Half down (Flat)
                                index--;
                                i++;
                                break;
                            default:
                                // Normal (Natural)
                                break;
                        }

                        // in the case of chord
                        if (index >= indexes[0]) {
                            index -= MML.EQUAL_TEMPERAMENT;
                        }

                        // Validation
                        if (index < 0) {
                            this.callbacks.error(MML.ERROR_NOTE, note);
                            return;
                        }

                        indexes.push(index);
                    }

                    frequencies = [];

                    for (const index of indexes) {
                        const frequency = (index !== MML.REST) ? MML.computeFrequency(index) : 0;

                        // Validation
                        if (frequency === -1) {
                            this.callbacks.error(MML.ERROR_NOTE, note);
                            return;
                        }

                        frequencies.push(frequency);
                    }

                    const durations = note.split('&');  // Tie

                    while (durations.length > 0) {
                        const d = durations.shift().match(MML.REGEXP_DURATION)[1];

                        switch (parseInt(d, 10)) {
                            case   1:
                            case   2:
                            case   4:
                            case   8:
                            case  16:
                            case  32:
                            case  64:
                            case 128:
                            case 256:
                                const numOf4note = MML.QUARTER_NOTE / parseInt(d, 10);

                                // a dotted note ?
                                duration += (d.indexOf('.') !== -1) ? ((1.5 * numOf4note) * timeOf4note) : (numOf4note * timeOf4note);
                                break;
                            case   6:
                                // Triplet of half note
                                duration += (2 * timeOf4note) / 3;
                                break;
                            case  12:
                                // Triplet of quarter note
                                duration += timeOf4note / 3;
                                break;
                            case  18:
                                // Nonuplet of half note
                                duration += (2 * timeOf4note) / 9;
                                break;
                            case  24:
                                // Triplet of 8th note
                                duration += (0.5 * timeOf4note) / 3;
                                break;
                            case  36:
                                // Nonuplet of quarter note
                                duration += timeOf4note / 9;
                                break;
                            case  48:
                                // Triplet of 16th note
                                duration += (0.25 * timeOf4note) / 3;
                                break;
                            case  72:
                                // Nonuplet of 8th note
                                duration += (0.5 * timeOf4note) / 9;
                                break;
                            case  96:
                                // Triplet of 32th note
                                duration += (0.125 * timeOf4note) / 3;
                                break;
                            case 144:
                                // Nonuplet of 16th note
                                duration += (0.25 * timeOf4note) / 9;
                                break;
                            case 192:
                                // Triplet of 64th note
                                duration += (0.0625 * timeOf4note) / 3;
                                break;
                            default:
                                this.callbacks.error(MML.ERROR_NOTE, note);
                                break;
                        }
                    }

                    start = currentTime;
                    stop  = start + duration;

                    currentTime += duration;

                    sequences.push({
                        'indexes'     : indexes,
                        'frequencies' : frequencies,
                        'start'       : start,
                        'duration'    : duration,
                        'stop'        : stop
                    });

                    duration = 0;
                }
            }

            if (sequences.length > 0) {
                // `start` method gets element by `pop` for performance
                sequences.reverse();

                this.sequences.push(sequences);
                this.timerids.push(null);
            }
        }

        return this;
    }

    /**
     * This method starts the designated MML part. Moreover, this method schedules next sound.
     * @param {number} part This argument is the part of MML.
     * @param {Array.<Effector>|Array.<AudioNode>} connects This argument is the array for changing the default connection.
     * @param {function} processCallback This argument is in order to change `onaudioprocess` event handler in the instance of `ScriptProcessorNode`.
     * @return {MML} This is returned for method chain.
     */
    start(part, connects, processCallback) {
        const p = parseInt(part, 10);

        if ((p >= 0) && (p < this.sequences.length)) {
            if (!Array.isArray(this.sequences[p])) {
                return this;
            }

            // End ?
            if (this.sequences[p].length === 0) {
                this.stop(processCallback);
                this.callbacks.ended();

                return this;
            }

            const sequence = this.sequences[p].pop();

            if (Array.isArray(this.source)) {
                for (let i = 0, len = this.source.length; i < len; i++) {
                    let source = this.source[i];

                    const type   = source.type;
                    const detune = source.detune.value;

                    source = this.context.createOscillator();

                    // for legacy browsers
                    source.start = source.start || source.noteOn;
                    source.stop  = source.stop  || source.noteOff;

                    source.type            = type;
                    source.frequency.value = sequence.frequencies[i];
                    source.detune.value    = detune;

                    if (Array.isArray(connects)) {
                        // OscillatorNode (Input) -> AudioNode -> ... -> AudioNode -> AudioDestinationNode (Output)
                        source.connect(connects[0]);

                        for (let j = 0, num = connects.length; j < num; j++) {
                            const node = connects[j];

                            if (j < (num - 1)) {
                                const next = connects[j + 1];

                                if (!((node instanceof AudioNode) && (next instanceof AudioNode))) {
                                    return this;
                                }

                                node.connect(next);
                            } else {
                                node.connect(this.context.destination);
                            }
                        }
                    } else {
                        // OscillatorNode (Input) -> AudioDestinationNode (Output)
                        source.connect(this.context.destination);
                    }

                    source.start(this.context.currentTime);
                    source.stop(this.context.currentTime + sequence.duration);

                    this.source[i] = source;
                }

                for (let i = 0, len = sequence.indexes.length; i < len; i++) {
                    this.callbacks.start(sequence, i);
                }
            } else if (this.source instanceof OscillatorModule) {
                this.source.start(sequence.frequencies, connects, processCallback);

                for (let i = 0, len = sequence.indexes.length; i < len; i++) {
                    this.callbacks.start(sequence, i);
                }
            } else if (this.source instanceof OneshotModule) {
                for (let i = 0, len = sequence.indexes.length; i < len; i++) {
                    if (sequence.indexes[i] !== MML.REST) {
                        this.source.start(sequence.indexes[i], connects, processCallback);
                    }

                    this.callbacks.start(sequence, i);
                }
            }

            this.timerids[p] = window.setTimeout(() => {
                if (Array.isArray(this.source)) {
                    for (let i = 0, len = sequence.indexes.length; i < len; i++) {
                        this.callbacks.start(sequence, i);
                    }
                } else if (this.source instanceof OscillatorModule) {
                    this.source.stop();

                    for (let i = 0, len = sequence.indexes.length; i < len; i++) {
                        this.callbacks.stop(sequence, i);
                    }
                } else if (this.source instanceof OneshotModule) {
                    for (let i = 0, len = sequence.indexes.length; i < len; i++) {
                        if (sequence.indexes[i] !== MML.REST) {
                            this.source.stop(sequence.indexes[i], processCallback);
                        }

                        this.callbacks.stop(sequence, i);
                    }
                }

                // for `MML#stop`
                this.prev = sequence;

                // Start next sound by recursive call
                this.start(p, connects, processCallback);
            }, (sequence.duration * 1000));
        }

        return this;
    }

    /**
     * This method stops the all of MML parts.
     * @param {function} processCallback This argument is in order to change `onaudioprocess` event handler in the instance of `ScriptProcessorNode`.
     * @return {MML} This is returned for method chain.
     */
    stop(processCallback) {
        const sequence = this.prev;

        if (sequence.length === 0) {
            return this;
        }

        if (Array.isArray(this.source)) {
            for (const index of sequence.indexes) {
                this.callbacks.stop(sequence, index);
            }
        } else if (this.source instanceof OscillatorModule) {
            this.source.stop();

            for (const index of sequence.indexes) {
                this.callbacks.stop(sequence, index);
            }
        } else if (this.source instanceof OneshotModule) {
            for (const index of sequence.indexes) {
                if (index !== MML.REST) {
                    this.source.stop(index, processCallback);
                }

                this.callbacks.stop(sequence, index);
            }
        }

        for (let i = 0, len = this.timerids.length; i < len; i++) {
            window.clearTimeout(this.timerids[i]);
            this.timerids[i] = null;
        }

        return this;
    }

    /**
     * This method gets the array that contains object for playing the MML.
     * @param {number} index This argument is required in the case of designating sequence.
     * @return {Array.<Array.<object>>|Array.<object>}
     */
    get(index) {
        const i = parseInt(index, 10);

        return ((i >= 0) && (i < this.sequences.length)) ? this.sequences[i] : this.sequences;
    }

    /**
     * This method starts or stops MML according to state.
     * @param {number} part This argument is the part of MML.
     * @param {Array.<Effector>} connects This argument is the array for changing the default connection.
     * @param {function} processCallback This argument is in order to change `onaudioprocess` event handler in the instance of `ScriptProcessorNode`.
     * @return {MML} This is returned for method chain.
     */
    toggle(part, connects, processCallback) {
        if (this.isPaused()) {
            this.start(part, connects, processCallback);
        } else {
            this.stop();
        }

        return this;
    }

    /**
     * This method determines whether the array that is used to play the MML exists.
     * @return {boolean} If the array exists, this value is `true`. Otherwise, this value is `false`.
     */
    isSequences() {
        return Array.isArray(this.sequences[0]);
    }

    /**
     * This method determines whether the MML is paused.
     * @return {boolean} If the MML is paused, this value is `true`. Otherwise, this value is `false`.
     */
    isPaused() {
        for (const timerid of this.timerids) {
            if ((timerid === null) || (timerid === undefined)) {
                // Next timer
            } else {
                // Playing the MML
                return false;
            }
        }

        return true;
    }

    /**
     * This method creates text file for MML.
     * @param {string} mml This argument is MML string.
     * @return {string} This is returned as text file that MML is written.
     */
    create(mml) {
        const base64  = window.btoa(MML.toAscii(String(mml)));
        const dataURL = `data:text/plain;base64,${base64}`;

        return dataURL;
    }

    /** @override */
    toString() {
        return '[MML]';
    }
}
