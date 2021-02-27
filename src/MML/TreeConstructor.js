'use strict';

import { Tokenizer } from './Tokenizer';

/**
 * This class is Tree Construction for MML (Music Macro Language).
 * @constructor
 */
export class TreeConstructor {
    static FREQUENCY_RATIO   = Math.pow(2, (1 / 12));  // about 1.059463
    static MIN_A             = 27.5;
    static EQUAL_TEMPERAMENT = 12;
    static QUARTER_NOTE      = 4;

    /**
     * This class (static) method computes index by octave and pitch name.
     * @param {number} octave This argument is octave.
     * @param {string} pitchname This argument is pitch name.
     * @return {number} This is returned as index that is computed by octave and pitch name.
     */
    static computeIndex(octave, pitchname) {
        let index = 0;

        switch (pitchname) {
            case Tokenizer.C:
                index = 3;
                break;
            case Tokenizer.D:
                index = 5;
                break;
            case Tokenizer.E:
                index = 7;
                break;
            case Tokenizer.F:
                index = 8;
                break;
            case Tokenizer.G:
                index = 10;
                break;
            case Tokenizer.A:
                index = 12;
                break;
            case Tokenizer.B:
                index = 14;
                break;
            case Tokenizer.R:
                return -1;
            default :
                return Tokenizer.ERROR;
        }

        const computedIndex = (TreeConstructor.EQUAL_TEMPERAMENT * (octave - 1)) + index;

        return (computedIndex >= 0) ? computedIndex : -1;
    }

    /**
     * This class (static) method computes frequency from the index that corresponds to the 12 equal temperament.
     * @param {number} index This argument is the index that corresponds to the 12 equal temperament.
     *     For example, This value is between 0 and 88 in the case of piano.
     * @return {number} This is returned as frequency.
     */
    static computeFrequency(index) {
        return (index >= 0) ? (TreeConstructor.MIN_A * Math.pow(TreeConstructor.FREQUENCY_RATIO, index)) : -1;
    }

    /**
     * @param {Tokenizer} tokenizer This argument is the instance of `Tokenizer`.
     */
    constructor(tokenizer) {
        this.tokenizer  = tokenizer;  // The instance of `Tokenizer`
        this.tokens     = [];         /** @type Array.<string> */
        this.stackOfMML = [];         /** @type Array.<object> */
    }

    /**
     * This method executes tree construction (parsing) from tokens.
     * @return {Array.<object>} This is returned as syntax tree.
     */
    parse() {
        let token = this.tokenizer.get();

        while (token !== Tokenizer.EOS) {
            switch (token) {
                case Tokenizer.TEMPO:
                    break;
                case Tokenizer.OCTAVE:
                    this.push();
                    break;
                case Tokenizer.C:
                case Tokenizer.D:
                case Tokenizer.E:
                case Tokenizer.F:
                case Tokenizer.G:
                case Tokenizer.A:
                case Tokenizer.B:
                case Tokenizer.R:
                    this.push();
                    break;
                case Tokenizer.DOT:
                    break;
                case Tokenizer.TIE:
                    this.push();
                    break;
                default:
                    // chord or digits
                    if (isNaN(parseInt(token, 10))) {
                        // chord
                        this.push();
                    }

                    break;
            }

            this.tokens.push(token);

            token = this.tokenizer.get();
        }

        this.push();
        this.clearTokens();

        return this.stackOfMML;
    }

    /**
     * This method executes tree construction (parsing) from tokens and creates sequences for playing the MML.
     * @return {Array.<object>} This is returned as array that contains sequence objects for playing the MML.
     */
    toSequences() {
        const mmls      = this.parse();
        const sequences = [];

        let currentTime = 0;
        let timeOf4note = 0;
        let octave      = 0;

        for (const mml of mmls) {
            const { syntax, token, digits } = mml;

            let duration = 0;
            let start    = 0;
            let stop     = 0;

            const indexes     = [];
            const frequencies = [];

            switch (token) {
                case Tokenizer.TEMPO:
                    const bpm = digits[0].digit;

                    if (bpm <= 0) {
                        throw new Error(`BPM (${bpm}) is greater than 0`);
                    }

                    timeOf4note = 60 / bpm;

                    break;
                case Tokenizer.OCTAVE:
                    octave = digits[0].digit;

                    if (octave <= 0) {
                        throw new Error(`Octave (${octave}) is greater than 0`);
                    }

                    break;
                default:
                    for (let i = 0, len = syntax.length; i < len; i++) {
                        const t = syntax.charAt(i);

                        let index = TreeConstructor.computeIndex(octave, t);

                        if (index === -1) {
                            indexes.push(index);
                            break;
                        }

                        // Half up or Half down (Sharp or Flat) ?
                        switch (syntax.charAt(i + 1)) {
                            case Tokenizer.HALF_UP:
                                index++;
                                i++;
                                break;
                            case Tokenizer.HALF_DOWN:
                                index--;
                                i++;
                                break;
                            default:
                                // Normal (Natural)
                                break;
                        }

                        // in the case of chord
                        if (index >= indexes[0]) {
                            index -= TreeConstructor.EQUAL_TEMPERAMENT;
                        }

                        // Validation
                        if (index < 0) {
                            throw new Error(`Index (${index}) is invalid`);
                        }

                        indexes.push(index);

                        switch (syntax.charAt(i + 1)) {
                            case Tokenizer.DIGITS_0:
                            case Tokenizer.DIGITS_1:
                            case Tokenizer.DIGITS_2:
                            case Tokenizer.DIGITS_3:
                            case Tokenizer.DIGITS_4:
                            case Tokenizer.DIGITS_5:
                            case Tokenizer.DIGITS_6:
                            case Tokenizer.DIGITS_7:
                            case Tokenizer.DIGITS_8:
                            case Tokenizer.DIGITS_9:
                                // Exit loop
                                i = len;
                                break;
                            default:
                                break;
                        }
                    }

                    for (const index of indexes) {
                        const frequency = (index !== -1) ? TreeConstructor.computeFrequency(index) : 0;

                        // Validation
                        if (frequency === -1) {
                            throw new Error(`Frequency (${frequency}) is invalid`);
                        }

                        frequencies.push(frequency);
                    }

                    for (const d of digits) {
                        switch (d.digit) {
                            case   1:
                            case   2:
                            case   4:
                            case   8:
                            case  16:
                            case  32:
                            case  64:
                            case 128:
                            case 256:
                                const numberOf4note = TreeConstructor.QUARTER_NOTE / d.digit;

                                if (d.dot) {
                                    duration += 1.5 * (numberOf4note * timeOf4note);
                                } else {
                                    duration += numberOf4note * timeOf4note;
                                }

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
                                throw new Error(`Duration (${d.digit}${d.dot ? '.' : ''}) is invalid`);
                        }
                    }

                    break;
            }

            if ((token === Tokenizer.TEMPO) || (token === Tokenizer.OCTAVE)) {
                continue;
            }

            start = currentTime;
            stop  = start + duration;

            currentTime += duration;

            sequences.push({
                'note'        : syntax,
                'indexes'     : indexes.slice(0),  // Shallow copy before clear
                'frequencies' : frequencies.slice(0),  // Shallow copy before clear
                'start'       : start,
                'stop'        : stop,
                'duration'    : duration
            });

            indexes.length     = 0;
            frequencies.length = 0;
        }

        return sequences;
    }

    /**
     * This method pushes token to stack.
     */
    push() {
        if (this.tokens.length < 2 || ((this.tokens[0] === Tokenizer.TIE) && (this.tokens.length < 3))) {
            return;
        }

        if (this.tokens.includes(Tokenizer.TEMPO)) {
            this.stackOfMML.push({
                syntax : this.tokens.join(''),
                token  : Tokenizer.TEMPO,
                digits : [this.parseDigits(this.tokens)]
            });

            this.clearTokens();
        } else if (this.tokens.includes(Tokenizer.OCTAVE)) {
            this.stackOfMML.push({
                syntax : this.tokens.join(''),
                token  : Tokenizer.OCTAVE,
                digits : [this.parseDigits(this.tokens)]
            });

            this.clearTokens();
        } else if (this.tokens.includes(Tokenizer.R)) {
            this.stackOfMML.push({
                syntax : this.tokens.join(''),
                digits : [this.parseDigits(this.tokens)]
            });

            this.clearTokens();
        } else if (this.tokens[0] === Tokenizer.TIE) {
            const lastMML = this.stackOfMML.pop();

            const prevDigits = lastMML.digits[0];
            const nextDigits = this.parseDigits(this.tokens.slice(1));

            this.stackOfMML.push({
                syntax : `${lastMML.syntax}${this.tokens.join('')}`,
                digits : [prevDigits, nextDigits]
            });

            this.clearTokens();
        } else  {
            this.stackOfMML.push({
                syntax : this.tokens.join(''),
                digits : [this.parseDigits(this.tokens)]
            });

            this.clearTokens();
        }
    }

    /**
     * This method parses digits from the array that contains token.
     * @param {Array.<string>} tokens This argument is the array that contains MML tokens.
     * @return {object} This is returned as associative array that contains digits and whether dotted note.
     */
    parseDigits(tokens) {
        const token = tokens.join('');

        let digit = parseInt(token, 10);
        let start = 1;

        while ((isNaN(digit) || (digit < 0)) && (start <= token.length)) {
            digit = parseInt(token.slice(start++), 10);
        }

        const dot = tokens.includes(Tokenizer.DOT);

        return { digit, dot };
    }

    /**
     * This method empties the array that contains tokens.
     */
    clearTokens() {
        this.tokens.length = 0;
    }
}
