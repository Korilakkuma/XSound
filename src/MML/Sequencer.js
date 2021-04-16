'use strict';

import { TokenTypes, Token } from './Token';
import { Sequence } from './Sequence';

/**
 * This class converts syntax tree to the array that contains musical notes.
 * @constructor
 */
export class Sequencer {
    static FREQUENCY_RATIO   = Math.pow(2, (1 / 12));  // about 1.059463
    static MIN_A             = 27.5;
    static EQUAL_TEMPERAMENT = 12;
    static QUARTER_NOTE      = 4;

    static C = 'C';
    static D = 'D';
    static E = 'E';
    static F = 'F';
    static G = 'G';
    static A = 'A';
    static B = 'B';
    static R = 'R';

    static SHARP     = '#';
    static HALF_UP   = '+';
    static HALF_DOWN = '-';

    static DOT = '.';

    /**
     * This class (static) method computes index by octave and pitch name.
     * @param {number} octave This argument is octave.
     * @param {string} pitchname This argument is pitch name.
     * @return {number} This is returned as index that is computed by octave and pitch name.
     */
    static computeIndex(octave, pitchname) {
        let index = 0;

        switch (pitchname) {
            case Sequencer.C:
                index = 3;
                break;
            case Sequencer.D:
                index = 5;
                break;
            case Sequencer.E:
                index = 7;
                break;
            case Sequencer.F:
                index = 8;
                break;
            case Sequencer.G:
                index = 10;
                break;
            case Sequencer.A:
                index = 12;
                break;
            case Sequencer.B:
                index = 14;
                break;
            case Sequencer.R:
                return -1;
            default:
                // eslint-disable-next-line no-console
                console.assert();
                break;
        }

        const computedIndex = (Sequencer.EQUAL_TEMPERAMENT * (octave - 1)) + index;

        return (computedIndex >= 0) ? computedIndex : -1;
    }

    /**
     * This class (static) method computes frequency from the index that corresponds to the 12 equal temperament.
     * @param {number} index This argument is the index that corresponds to the 12 equal temperament.
     *     For example, This value is between 0 and 88 in the case of piano.
     * @return {number} This is returned as frequency.
     */
    static computeFrequency(index) {
        return (index >= 0) ? (Sequencer.MIN_A * Math.pow(Sequencer.FREQUENCY_RATIO, index)) : 0;
    }

    /**
     * @param {TreeConstructor} treeConstructor This argument is the instance of `TreeConstructor`.
     */
    constructor(treeConstructor) {
        this.sequences = [];  /** @type {Array.<Sequence>} */

        this.treeConstructor = treeConstructor;

        this.timeOf4note = 0;
        this.octave      = -1;
        this.currentTime = 0;
    }

    /**
     * This method calculates pitch and music time from Parse Tree.
     * @return {Array.<object>} This is returned as array that contains sequence objects for playing the MML.
     */
    get() {
        const trees = this.treeConstructor.parse();

        this.timeOf4note = 0;
        this.octave      = -1;
        this.currentTime = 0;

        let tree = trees[0];

        while (tree !== null) {
            const operator = tree.getOperator();

            const left  = tree.getLeft();
            const right = tree.getRight();

            switch (operator.getType()) {
                case TokenTypes.TEMPO:
                    this.setTimeOf4Note(left.getOperator().getValue());

                    tree = right;
                    break;
                case TokenTypes.OCTAVE:
                    this.setOctave(left.getOperator().getValue());

                    tree = right;
                    break;
                case TokenTypes.NOTE:
                case TokenTypes.REST:
                    this.push(tree);

                    tree = right;
                    break;
                case TokenTypes.TIE:
                    this.push(right);
                    this.concat();

                    tree = right.getRight();
                    break;
                case TokenTypes.EOS:
                    tree = right;
                    break;
                default:
                    // eslint-disable-next-line no-console
                    console.assert();
                    break;
            }
        }

        // Release Memory for improving MML performance
        this.treeConstructor.free();

        return this.sequences;
    }

    /**
     * This method sets the time of quarter note.
     * @param {number} bpm This argument is BPM (Beat Per Minute).
     */
    setTimeOf4Note(bpm) {
        if (bpm <= 0) {
            throw new Error(`BPM (${bpm}) is greater than 0`);
        }

        this.timeOf4note = 60 / bpm;
    }

    /**
     * This method sets octave.
     * @param {number} octave This argument is the number greater than or equal to 0.
     */
    setOctave(octave) {
        if (octave < 0) {
            throw new Error(`Octave (${octave}) is greater than 0`);
        }

        this.octave = octave;
    }

    /**
     * This method constructs syntax tree.
     * @param {Tree} tree This argument is the instance of `Tree` that is added to syntax tree.
     */
    push(tree) {
        const left  = tree.getLeft();
        const right = tree.getRight();

        // Not leaf
        if ((left === null) || (right === null)) {
            return;
        }

        // Not leaf
        const leftToken  = left.getOperator();
        const rightToken = right.getOperator();

        if (!(leftToken instanceof Token) && !(rightToken instanceof Token)) {
            // Traverse tree by recursive call
            this.push(left);
            this.push(right);
            return;
        }

        // Leaf
        const token  = tree.getOperator().getToken();
        const value  = leftToken.getValue();
        const digits = leftToken.getToken();

        const indexes     = [];
        const frequencies = [];

        for (let i = 0, len = token.length; i < len; i++) {
            const note = token.charAt(i);

            let index = Sequencer.computeIndex(this.octave, note);

            // Sharp or Flat (Half up or Half down) ?
            switch (token.charAt(i + 1)) {
                case Sequencer.HALF_UP:
                case Sequencer.SHARP  :
                    index++;
                    i++;
                    break;
                case Sequencer.HALF_DOWN:
                    index--;
                    i++;
                    break;
                default:
                    // Normal (Natural)
                    break;
            }

            // in the case of chord
            if (index >= indexes[0]) {
                index -= Sequencer.EQUAL_TEMPERAMENT;
            }

            // Validation
            if ((index !== -1) && (index < 0)) {
                throw new Error(`Index (${index}) is invalid`);
            }

            indexes.push(index);
        }

        for (const index of indexes) {
            const frequency = Sequencer.computeFrequency(index);

            // Validation
            if (frequency < 0) {
                throw new Error(`Frequency (${frequency}) is invalid`);
            }

            frequencies.push(frequency);
        }

        let duration = 0;

        switch (value) {
            case   1:
            case   2:
            case   4:
            case   8:
            case  16:
            case  32:
            case  64:
            case 128:
            case 256:
                const numberOf4note = Sequencer.QUARTER_NOTE / value;

                // Dotted note ?
                if (digits.includes(Sequencer.DOT)) {
                    duration += 1.5 * (numberOf4note * this.timeOf4note);
                } else {
                    duration += numberOf4note * this.timeOf4note;
                }

                break;
            case   6:
                // Triplet of half note
                duration += (2 * this.timeOf4note) / 3;
                break;
            case  12:
                // Triplet of quarter note
                duration += this.timeOf4note / 3;
                break;
            case  18:
                // Nonuplet of half note
                duration += (2 * this.timeOf4note) / 9;
                break;
            case  24:
                // Triplet of 8th note
                duration += (0.5 * this.timeOf4note) / 3;
                break;
            case  36:
                // Nonuplet of quarter note
                duration += this.timeOf4note / 9;
                break;
            case  48:
                // Triplet of 16th note
                duration += (0.25 * this.timeOf4note) / 3;
                break;
            case  72:
                // Nonuplet of 8th note
                duration += (0.5 * this.timeOf4note) / 9;
                break;
            case  96:
                // Triplet of 32th note
                duration += (0.125 * this.timeOf4note) / 3;
                break;
            case 144:
                // Nonuplet of 16th note
                duration += (0.25 * this.timeOf4note) / 9;
                break;
            case 192:
                // Triplet of 64th note
                duration += (0.0625 * this.timeOf4note) / 3;
                break;
            default:
                throw new Error(`Duration (${token}${value}) is invalid`);
        }

        this.sequences.push(new Sequence(
            `${token}${digits}`,
            indexes,
            frequencies,
            this.currentTime,
            (this.currentTime + duration),
            duration
        ));

        this.currentTime += duration;
    }

    /**
     * This method concats previous note and previous duration and current note and current duration in the case of tie.
     */
    concat() {
        const current  = this.sequences.pop();
        const previous = this.sequences.pop();

        previous.concat(current);

        this.sequences.push(previous);
    }
}
