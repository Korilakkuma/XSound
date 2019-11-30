'use strict';

import { OscillatorModule } from '../OscillatorModule';
import { OneshotModule } from '../OneshotModule';
import { NoiseModule } from '../NoiseModule';

/**
 * This class defines properties for playing the MML (Music Macro Language).
 * @constructor
 */
export class MML {
    // The 12 equal temperament
    //
    // Min -> 27.5 Hz (A), Max -> 4186 Hz (C)
    //
    // A * 1.059463 -> A# (half up)
    static FREQUENCY_RATIO   = Math.pow(2, (1 / 12));  // about 1.059463
    static MIN_A             = 27.5;
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
    static computeFrequency = index => (index >= 0) ? (MML.MIN_A * Math.pow(MML.FREQUENCY_RATIO, index)) : -1;

    /**
     * @param {AudioContext} context This argument is in order to use the interfaces of Web Audio API.
     */
    constructor(context) {
        this.context = context;

        // for the array of `OscillatorNode` or `OscillatorModule` or `OneshotModule` or `NoiseModule`
        this.source = null;

        this.sequences = [];  /** @type {Array.<Array.<object>>} */
        this.timerids  = [];  /** @type {Array.<number>} */
        this.prev      = [];  /** @type {Array.<object>} */

        this.offset = 0;

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
     * @param {Array.<OscillatorNode>|OscillatorModule|OneshotModule|NoiseModule} source This argument is in order to select sound source.
     * @param {Array.<string>} mmls This argument is MML strings.
     * @param {number} offset This argument is in order to correct the index of one-shot audio.
     * @return {Array.<Array.<object>>} This is returned as array that contains object for playing the MML.
     */
    ready(source, mmls, offset) {
        this.offset = parseInt(offset, 10);

        if (isNaN(this.offset) || (this.offset < 0)) {
            this.offset = 0;
        }

        if (this.source !== null) {
            this.stop();  // Stop the previous MML
        }

        this.clear();

        if (Array.isArray(source)) {
            for (const s of source) {
                if (!(s instanceof OscillatorNode)) {
                    return this;
                }
            }

            this.source = source;
        } else if (source instanceof OscillatorNode) {
            this.source = [source];
        } else if ((source instanceof OscillatorModule) || (source instanceof OneshotModule) || (source instanceof NoiseModule)) {
            this.source = source;
        } else {
            return this;
        }

        if (!Array.isArray(mmls)) {
            mmls = [mmls];
        }

        while (mmls.length > 0) {
            const mml = String(mmls.shift());

            /** @type {Array.<object>} */
            const sequences = [];

            const notes = mml.match(MML.REGEXP_MML);

            if (notes === null) {
                this.callbacks.error(MML.ERROR_STRING, '');
                return this;
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

                    if (bpm <= 0) {
                        this.callbacks.error(MML.ERROR_TEMPO, note);
                        return this;
                    }

                    timeOf4note = MML.ONE_MINUTES / bpm;
                } else if (MML.REGEXP_OCTAVE.test(note)) {
                    octave = parseInt(note.slice(1), 10);

                    if (octave < 0) {
                        this.callbacks.error(MML.ERROR_OCTAVE, note);
                        return this;
                    }
                } else if (MML.REGEXP_NOTE.test(note)) {
                    if (timeOf4note === null) {
                        this.callbacks.error(MML.ERROR_TEMPO, note);
                        return this;
                    }

                    if (octave === null) {
                        this.callbacks.error(MML.ERROR_OCTAVE, note);
                        return this;
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
                            return this;
                        }

                        indexes.push(index);
                    }

                    frequencies = [];

                    for (const index of indexes) {
                        const frequency = (index !== MML.REST) ? MML.computeFrequency(index) : 0;

                        // Validation
                        if (frequency === -1) {
                            this.callbacks.error(MML.ERROR_NOTE, note);
                            return this;
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
                        'stop'        : stop,
                        'note'        : note
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

                this.callbacks.start(sequence);
            } else if (this.source instanceof OscillatorModule) {
                this.source.start(sequence.frequencies, connects, processCallback);
                this.callbacks.start(sequence);
            } else if (this.source instanceof OneshotModule) {
                for (let i = 0, len = sequence.indexes.length; i < len; i++) {
                    if (sequence.indexes[i] !== MML.REST) {
                        this.source.start((sequence.indexes[i] + this.offset), connects, processCallback);
                    }
                }

                this.callbacks.start(sequence, this.offset);
            } else if (this.source instanceof NoiseModule) {
                this.source.start(connects);
                this.callbacks.start(sequence);
            }

            this.timerids[p] = window.setTimeout(() => {
                if (Array.isArray(this.source)) {
                    this.callbacks.stop(sequence);
                } else if (this.source instanceof OscillatorModule) {
                    this.source.stop();
                    this.callbacks.stop(sequence);
                } else if (this.source instanceof OneshotModule) {
                    for (let i = 0, len = sequence.indexes.length; i < len; i++) {
                        if (sequence.indexes[i] !== MML.REST) {
                            this.source.stop((sequence.indexes[i] + this.offset), processCallback);
                        }
                    }

                    this.callbacks.stop(sequence, this.offset);
                } else if (this.source instanceof NoiseModule) {
                    this.source.stop();
                    this.callbacks.stop(sequence);
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
            this.callbacks.stop(sequence);
        } else if (this.source instanceof OscillatorModule) {
            this.source.stop();
            this.callbacks.stop(sequence);
        } else if (this.source instanceof OneshotModule) {
            for (const index of sequence.indexes) {
                if (index !== MML.REST) {
                    this.source.stop((index + this.offset), processCallback);
                }
            }

            this.callbacks.stop(sequence, this.offset);
        } else if (this.source instanceof NoiseModule) {
            this.source.stop();
            this.callbacks.stop(sequence);
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
     * This method converts MML to ABC Notation.
     * @param {string} mml This argument is MML string.
     * @param {number} X This argument is file number in ABC Notation.
     * @param {string} T This argument is title in ABC Notation.
     * @param {string} M This argument is beat in ABC Notation.
     * @param {string} L This argument is note duration in ABC Notation.
     * @param {string} K This argument is tone in ABC Notation.
     * @return {string} This is returned as ABC Notation.
     */
    toABC(mml, X, T, M, L, K) {
        let abc = '';

        abc += `X:${X ? X : 1}\n`;
        abc += `T:${T ? T : ''}\n`;
        abc += `M:${M ? M : '4/4'}\n`;
        abc += `L:${L ? L : '1/256'}\n`;
        abc += `K:${K ? K : ''}\n`;

        const notes = mml.match(MML.REGEXP_MML);

        if (notes === null) {
            return abc;
        }

        let octave        = null;
        let totalDuration = 0;

        while (notes.length > 0) {
            const note = notes.shift().trim();

            if (MML.REGEXP_TEMPO.test(note)) {
                const Q = parseInt(note.slice(1), 10);

                if (Q > 0) {
                    abc += `Q:1/4=${Q}\n`;
                } else {
                    return abc;
                }
            } else if (MML.REGEXP_OCTAVE.test(note)) {
                octave = parseInt(note.slice(1), 10);

                if (octave < 0) {
                    return abc;
                }
            } else if (MML.REGEXP_NOTE.test(note)) {
                if (octave === null) {
                    return abc;
                }

                let splittedNotes = null;

                if (note.indexOf('&') === -1) {
                    splittedNotes = [note];
                } else {
                    splittedNotes = note.split('&');
                }

                let chord = '';

                while (splittedNotes.length > 0) {
                    const splittedNote = splittedNotes.shift();

                    const duration = parseInt(splittedNote.replace(/^.+?(\d+)\.*$/, '$1'), 10);

                    let n = '';
                    let d = 0;

                    switch (duration) {
                        case 1:
                            n = splittedNote.replace('1', '256');
                            break;
                        case 2:
                            n = splittedNote.replace('2', '128');
                            break;
                        case 4:
                            n = splittedNote.replace('4', '64');
                            break;
                        case 8:
                            n = splittedNote.replace('8', '32');
                            break;
                        case 16:
                            n = splittedNote.replace('16', '16');
                            break;
                        case 32:
                            n = splittedNote.replace('32', '8');
                            break;
                        case 64:
                            n = splittedNote.replace('64', '4');
                            break;
                        case 128:
                            n = splittedNote.replace('128', '2');
                            break;
                        case 256:
                            n = splittedNote.replace('256', '1');
                            break;
                        // Tuplet
                        case 6:
                            n = `(3${splittedNote.replace('6', '128')}`;
                            d = 128 / 3;
                            break;
                        case 12:
                            n = `(3${splittedNote.replace('12', '64')}`;
                            d = 64 / 3;
                            break;
                        case 18:
                            n = `(9${splittedNote.replace('18', '128')}`;
                            d = 128 / 9;
                            break;
                        case 24:
                            n = `(3${splittedNote.replace('24', '32')}`;
                            d = 32 / 3;
                            break;
                        case 36:
                            n = `(9${splittedNote.replace('36', '64')}`;
                            d = 64 / 9;
                            break;
                        case 48:
                            n = `(3${splittedNote.replace('48', '16')}`;
                            d = 16 / 3;
                            break;
                        case 72:
                            n = `(9${splittedNote.replace('72', '32')}`;
                            d = 32 / 9;
                            break;
                        case 96:
                            n = `(3${splittedNote.replace('96', '8')}`;
                            d = 8 / 3;
                            break;
                        case 144:
                            n = `(9${splittedNote.replace('144', '16')}`;
                            d = 16 / 9;
                            break;
                        case 192:
                            n = `(3${splittedNote.replace('192', '4')}`;
                            d = 4 / 3;
                            break;
                        default:
                            return abc;
                    }

                    if (n.indexOf('.') !== -1) {
                        n = n.replace(/^(.+?)\d+\.+$/, `$1${1.5 * parseInt(n.replace(/^.+?(\d+)\.+$/, '$1'), 10)}`);
                    }

                    if (n.indexOf('(') === -1) {
                        totalDuration += parseInt(n.replace(/^.+?(\d+)\.*$/i, '$1'), 10);
                    } else {
                        totalDuration += d;
                    }

                    if (totalDuration >= 256) {
                        n += ' | ';
                        totalDuration = 0;
                    }

                    if (/R/i.test(n)) {
                        abc += `${n} `;
                        continue;
                    }

                    let o = '';

                    switch (octave) {
                        case 0:
                            o = ',,,,';
                            break;
                        case 1:
                            o = ',,,';
                            break;
                        case 2:
                            o = ',,';
                            break;
                        case 3:
                            o = ',';
                            break;
                        case 5:
                            o = '\'';
                            break;
                        case 6:
                            o = '\'\'';
                            break;
                        case 7:
                            o = '\'\'\'';
                            break;
                        case 4 :
                        default:
                            break;
                    }

                    const matches = n.match(/^(\(\d+)?((?:[CDEFGAB][#+-]?)+)(.*)$/i);

                    if (matches === null) {
                        return abc;
                    }

                    const tuplet      = matches[1] ? matches[1] : '';
                    const chordLength = matches[2].length;
                    const restNote    = matches[3] ? matches[3] : '';

                    let start = 0;

                    if (tuplet.length > 0) {
                        n = n.replace(/^(?:\(\d+)?((?:[CDEFGAB][#+-]?)+)(.*)$/i, '$1$2');
                    }

                    if (chordLength === 1) {
                        chord += `${tuplet}${n.slice(0, 1)}${o}${restNote}`;
                    } else if ((chordLength === 2) && /[#+-]/.test(n.charAt(1))) {
                        chord += `${tuplet}${n.slice(1, 2)}${n.slice(0, 1)}${o}${restNote}`;
                    } else {
                        while (start < chordLength) {
                            if (start === 0) {
                                chord += `${tuplet}[`;
                            }

                            if (/[#+-]/.test(n.charAt(start + 1))) {
                                chord += `${n.slice((start + 1), (start + 2))}${n.slice(start, (start + 1))}${o}`;
                                start += 2;
                            } else {
                                chord += `${n.slice(start, (start + 1))}${o}`;
                                start++;
                            }

                            if (start === chordLength) {
                                chord += `]${restNote}`;
                            }
                        }
                    }

                    if (splittedNotes.length > 0) {
                        chord += '&';
                    } else {
                        abc += `${chord} `;
                    }
                }
            }
        }

        return abc.replace(/R/gi, 'z')
            .replace(/[#+]/g, '^')
            .replace(/-/g, '_')
            .replace(/&/g, '-')
            .replace(/\s{2}/g, ' ');
    }

    /**
     * This method clears sequences;
     */
    clear() {
        this.sequences.length = 0;
        this.timerids.length  = 0;
        this.prev.length      = 0;

        return this;
    }

    /** @override */
    toString() {
        return '[MML]';
    }
}
