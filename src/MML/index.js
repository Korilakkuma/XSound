'use strict';

import { Part } from './Part';

/**
 * This class manages the instances of `Part` for playing the MML (Music Macro Language).
 * @constructor
 */
export class MML {
    /**
     * @param {AudioContext} context This argument is in order to use the interfaces of Web Audio API.
     */
    constructor(context) {
        this.context = context;

        this.parts = [];  /** @type {Array.<Part>} */

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
     * @param {OscillatorModule|OneshotModule|NoiseModule} source This argument is in order to select sound source.
     * @param {Array.<string>} mmls This argument is MML strings.
     * @param {number} offset This argument is in order to adjust the index of one-shot audio.
     * @return {Array.<Array.<Sequence>>} This is returned as array that contains `Sequence` for playing the MML.
     */
    ready(source, mmls, offset) {
        if (!Array.isArray(mmls) && (typeof mmls === 'string')) {
            mmls = [mmls];
        }

        if (!Array.isArray(mmls)) {
            return this;
        }

        this.stop();
        this.clear();

        this.mmls = mmls;

        for (const mml of mmls) {
            this.parts.push(new Part(source, mml, this.callbacks, offset));
        }

        return this;
    }

    /**
     * This method starts the designated MML part. Moreover, this method schedules next sequence.
     * @param {number} part This argument is the part of MML.
     * @param {boolean} highlight This argument is `true` in the case of surrounding by `span.x-highlight`.
     * @param {Array.<Connectable>|Array.<AudioNode>} connects This argument is the array for changing the default connection.
     * @return {MML} This is returned for method chain.
     */
    start(part, highlight, connects) {
        const p = parseInt(part, 10);

        if ((p >= 0) && (p < this.parts.length)) {
            const part = this.parts[p];

            part.start(highlight, connects);
        }

        return this;
    }

    /**
     * This method stops the all of MML parts.
     * @return {MML} This is returned for method chain.
     */
    stop() {
        for (const part of this.parts) {
            part.stop();
        }

        return this;
    }

    /**
     * This method gets the array that contains string or object for playing the MML.
     * @param {number} index This argument is required in the case of designating MML part or sequence object.
     * @param {boolean} asMML This argument is 'mml' in the case of getting string or array as MML.
     * @return {Array.<string>|string|Array.<Array.<object>>|Array.<object>}
     */
    get(index, asMML) {
        const i = parseInt(index, 10);

        const mmls      = [];
        const sequences = [];

        for (const part of this.parts) {
            mmls.push(part.getMML());
            sequences.push(part.getSequence());
        }

        if (asMML) {
            return ((i >= 0) && (i < this.parts.length)) ? this.parts[i].getMML() : mmls;
        }

        return ((i >= 0) && (i < this.parts.length)) ? this.parts[i].getSequence() : sequences;
    }

    /**
     * This method starts or stops MML according to state.
     * @param {number} part This argument is the part of MML.
     * @param {boolean} highlight This argument is `true` in the case of surrounding by `span.x-highlight`.
     * @param {Array.<Connectable>|Array.<AudioNode>} connects This argument is the array for changing the default connection.
     * @return {MML} This is returned for method chain.
     */
    toggle(part, highlight, connects) {
        if (this.isPaused()) {
            this.start(part, highlight, connects);
        } else {
            this.stop();
        }

        return this;
    }

    /**
     * This method determines whether the sequences exist.
     * @return {boolean} If the sequences exist, this value is `true`. Otherwise, this value is `false`.
     */
    isSequences() {
        return (this.parts.length > 0) && this.parts.every(part => part.hasSequence());
    }

    /**
     * This method determines whether the MMLs are paused.
     * @return {boolean} If the MMLs are paused, this value is `true`. Otherwise, this value is `false`.
     */
    isPaused() {
        return (this.parts.length === 0) || this.parts.every(part => part.paused());
    }

    /**
     * This method gets or sets current sequence index.
     * @param {number} part This argument is the part of MML.
     * @param {number} index If this argument is number, this is new sequence index.
     *     If this argument is omitted, this method is getter for current sequence index.
     * @return {number|MML} This is returned as current sequence index. Otherwise, this is returned for method chain.
     */
    currentIndex(part, index) {
        const p = parseInt(part, 10);

        if ((p < 0) || (p >= this.parts.length)) {
            return this;
        }

        if (index === undefined) {
            return this.parts[p].getCurrentIndex();
        }

        this.parts[p].setCurrentIndex(index);

        return this;
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

        const notes = mml.match(/\s*(?:T\d+)\s*|\s*(?:O\d+)\s*|\s*(?:(?:[CDEFGABR][#+-]?)+(?:256|192|144|128|96|72|64|48|36|32|24|18|16|12|8|6|4|2|1)\.?)(?:&(?:[CDEFGABR][#+-]?)+(?:256|192|144|128|96|72|64|48|36|32|24|18|16|12|8|6|4|2|1)\.?)*\s*/gi);

        if (notes === null) {
            return abc;
        }

        let octave        = null;
        let totalDuration = 0;

        while (notes.length > 0) {
            const note = notes.shift().trim();

            if (/T\d+/i.test(note)) {
                const Q = parseInt(note.slice(1), 10);

                if (Q <= 0) {
                    return abc;
                }

                abc += `Q:1/4=${Q}\n`;
            } else if (/O\d+/i.test(note)) {
                octave = parseInt(note.slice(1), 10);

                if (octave < 0) {
                    return abc;
                }
            } else if (/(?:(?:[CDEFGABR][#+-]?)+)(?:256|192|144|128|96|72|64|48|36|32|24|18|16|12|8|6|4|2|1)(?:&(?:[CDEFGABR][#+-]?)+(?:256|192|144|128|96|72|64|48|36|32|24|18|16|12|8|6|4|2|1)\.?)*/i.test(note)) {
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
            .replace(/\s{2}/g, ' ')
            .trim();
    }

    /**
     * This method clears the instances of `Part`.
     * @return {MML} This is returned for method chain.
     */
    clear() {
        for (const part of this.parts) {
            part.stop();
        }

        // Garbage Collection
        this.parts.length = 0;

        return this;
    }

    /** @override */
    toString() {
        return '[MML]';
    }
}
