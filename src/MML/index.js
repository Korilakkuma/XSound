'use strict';

import { Tokenizer } from './Tokenizer';
import { TreeConstructor } from './TreeConstructor';
import { OscillatorModule } from '../OscillatorModule';
import { OneshotModule } from '../OneshotModule';
import { NoiseModule } from '../NoiseModule';

/**
 * This class defines properties for playing the MML (Music Macro Language).
 * @constructor
 */
export class MML {
    /**
     * @param {AudioContext} context This argument is in order to use the interfaces of Web Audio API.
     */
    constructor(context) {
        this.context = context;

        // for the array of `OscillatorNode` or `OscillatorModule` or `OneshotModule` or `NoiseModule`
        this.source = null;

        this.mmls             = [];  /** @type {Array.<string> */
        this.sequences        = [];  /** @type {Array.<Array.<object>>} */
        this.timerids         = [];  /** @type {Array.<number>} */
        this.currentIndexes   = [];  /** @type {Array.<number>} */
        this.currentPositions = [];  /** @type {Array.<number>} */

        // Previous sequence
        this.prev = null;

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
        }

        if (!Array.isArray(mmls) && (typeof mmls === 'string')) {
            mmls = [mmls];
        }

        if (!Array.isArray(mmls)) {
            return this;
        }

        this.stop();
        this.clear();

        this.mmls = mmls.slice(0);  // Shallow copy

        for (const mml of mmls) {
            this.timerids.push(null);
            this.currentIndexes.push(0);
            this.currentPositions.push(0);

            const tokenizer       = new Tokenizer(mml);
            const treeConstructor = new TreeConstructor(tokenizer);

            this.sequences.push(treeConstructor.toSequences());
        }

        return this;
    }

    /**
     * This method starts the designated MML part. Moreover, this method schedules next sound.
     * @param {number} part This argument is the part of MML.
     * @param {boolean} highlight This argument is `true` in the case of surrounding by `span.x-highlight`.
     * @param {Array.<Effector>|Array.<AudioNode>} connects This argument is the array for changing the default connection.
     * @param {function} processCallback This argument is in order to change `onaudioprocess` event handler in the instance of `ScriptProcessorNode`.
     * @return {MML} This is returned for method chain.
     */
    start(part, highlight, connects, processCallback) {
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

            const sequence = this.sequences[p][this.currentIndexes[p]];

            this.currentIndexes[p]++;

            if (highlight) {
                const prev    = this.mmls[p].slice(0, this.currentPositions[p]);
                const current = this.mmls[p].slice(this.currentPositions[p]).replace(sequence.note, `<span class="x-highlight">${sequence.note}</span>`);

                this.mmls[p] = `${prev}${current}`;

                this.currentPositions[p] += this.mmls[p].slice(this.currentPositions[p]).indexOf('</span>') + '</span>'.length;
            } else {
                const prev    = this.mmls[p].slice(0, this.currentPositions[p]);
                const current = sequence.note;

                this.mmls[p] = `${prev}${current}`;

                this.currentPositions[p] += current.length;
            }

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
                    if (sequence.indexes[i] !== -1) {
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
                        if (sequence.indexes[i] !== -1) {
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
                this.start(p, highlight, connects, processCallback);
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

        if ((sequence === null) || (sequence.length === 0)) {
            return this;
        }

        if (Array.isArray(this.source)) {
            this.callbacks.stop(sequence);
        } else if (this.source instanceof OscillatorModule) {
            this.source.stop();
            this.callbacks.stop(sequence);
        } else if (this.source instanceof OneshotModule) {
            for (const index of sequence.indexes) {
                if (index !== -1) {
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
     * This method gets the array that contains string or object for playing the MML.
     * @param {number} index This argument is required in the case of designating MML part or sequence object.
     * @param {boolean} asMML This argument is 'mml' in the case of getting string or array as MML.
     * @return {Array.<string>|string|Array.<Array.<object>>|Array.<object>}
     */
    get(index, asMML) {
        const i = parseInt(index, 10);

        if (asMML) {
            return ((i >= 0) && (i < this.mmls.length)) ? this.mmls[i] : this.mmls;
        }

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
     * This method gets or sets current sequence index.
     * @param {number} part This argument is the part of MML.
     * @param {number} index If this argument is number, this is new sequence index.
     *     If this argument is omitted, this method is getter for current sequence index.
     * @return {number|MML} This is returned as current sequence index. Otherwise, this is returned for method chain.
     */
    currentIndex(part, index) {
        const p = parseInt(part, 10);

        if ((p < 0) || (p >= this.currentIndexes.length)) {
            return this;
        }

        if (index === undefined) {
            return this.currentIndexes[p];
        }

        const i = parseInt(index, 10);

        if (i >= 0 && i < this.sequences[p].length) {
            this.currentIndexes[p] = i;
        }

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

        const tokenizer       = new Tokenizer(mml);
        const treeConstructor = new TreeConstructor(tokenizer);

        const parsedMMLs = treeConstructor.parse();

        let octave        = null;
        let totalDuration = 0;

        while (parsedMMLs.length > 0) {
            const { syntax, token, digits } = parsedMMLs.shift();

            if (token === Tokenizer.TEMPO) {
                const Q = digits[0].digit;

                if (Q <= 0) {
                    return abc;
                }

                abc += `Q:1/4=${Q}\n`;
            } else if (token === Tokenizer.OCTAVE) {
                octave = digits[0].digit;

                if (octave < 0) {
                    return abc;
                }
            } else if (digits) {
                let chord = '';

                for (let i = 0, len = digits.length; i < digits; i++) {
                    const duration = digits[i].digit;

                    let n = '';
                    let d = 0;

                    switch (duration) {
                        case 1:
                            n = syntax.replace('1', '256');
                            break;
                        case 2:
                            n = syntax.replace('2', '128');
                            break;
                        case 4:
                            n = syntax.replace('4', '64');
                            break;
                        case 8:
                            n = syntax.replace('8', '32');
                            break;
                        case 16:
                            n = syntax.replace('16', '16');
                            break;
                        case 32:
                            n = syntax.replace('32', '8');
                            break;
                        case 64:
                            n = syntax.replace('64', '4');
                            break;
                        case 128:
                            n = syntax.replace('128', '2');
                            break;
                        case 256:
                            n = syntax.replace('256', '1');
                            break;
                        // Tuplet
                        case 6:
                            n = `(3${syntax.replace('6', '128')}`;
                            d = 128 / 3;
                            break;
                        case 12:
                            n = `(3${syntax.replace('12', '64')}`;
                            d = 64 / 3;
                            break;
                        case 18:
                            n = `(9${syntax.replace('18', '128')}`;
                            d = 128 / 9;
                            break;
                        case 24:
                            n = `(3${syntax.replace('24', '32')}`;
                            d = 32 / 3;
                            break;
                        case 36:
                            n = `(9${syntax.replace('36', '64')}`;
                            d = 64 / 9;
                            break;
                        case 48:
                            n = `(3${syntax.replace('48', '16')}`;
                            d = 16 / 3;
                            break;
                        case 72:
                            n = `(9${syntax.replace('72', '32')}`;
                            d = 32 / 9;
                            break;
                        case 96:
                            n = `(3${syntax.replace('96', '8')}`;
                            d = 8 / 3;
                            break;
                        case 144:
                            n = `(9${syntax.replace('144', '16')}`;
                            d = 16 / 9;
                            break;
                        case 192:
                            n = `(3${syntax.replace('192', '4')}`;
                            d = 4 / 3;
                            break;
                        default:
                            return abc;
                    }

                    if (digits[i].dot) {
                        n = n.replace(/^(.+?)\d+\.+$/, `$1${1.5 * parseInt(n.replace(/^.+?(\d+)\.+$/, '$1'), 10)}`);
                    }

                    if (n.includes('(')) {
                        totalDuration += d;
                    } else {
                        totalDuration += parseInt(n.replace(/^.+?(\d+)\.*$/i, '$1'), 10);
                    }

                    if (totalDuration >= 256) {
                        n += ' | ';
                        totalDuration = 0;
                    }

                    if (n === Tokenizer.R) {
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

                    if ((i === 0) && (len === 2)) {
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
     * This method clears sequences.
     * @return {MML} This is returned for method chain.
     */
    clear() {
        for (let i = 0, len = this.timerids.length; i < len; i++) {
            window.clearTimeout(this.timerids[i]);
        }

        this.mmls.length             = 0;
        this.sequences.length        = 0;
        this.timerids.length         = 0;
        this.currentIndexes.length   = 0;
        this.currentPositions.length = 0;

        this.prev = null;

        return this;
    }

    /** @override */
    toString() {
        return '[MML]';
    }
}
