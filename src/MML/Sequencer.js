'use strict';

import { TokenTypes } from './TokenDefinitions';

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
        return (index >= 0) ? (Sequencer.MIN_A * Math.pow(Sequencer.FREQUENCY_RATIO, index)) : -1;
    }

    /**
     * @param {TreeConstructor} treeConstructor This argument is the instance of `TreeConstructor`.
     */
    constructor(treeConstructor) {
        this.treeConstructor = treeConstructor;
    }

    /**
     * This method calculates pitch and music time from Parse Tree.
     * @return {Array.<object>} This is returned as array that contains sequence objects for playing the MML.
     */
    get() {
        const mmls      = this.treeConstructor.parse();
        const sequences = [];

        let currentTime = 0;
        let timeOf4note = 0;
        let octave      = 0;
        let hasTie      = false;
        let prevNote    = '';  // Use in the case of having Tie

        for (const tokens of mmls) {
            let duration = 0;
            let start    = 0;
            let stop     = 0;

            const indexes     = [];
            const frequencies = [];

            const type  = tokens[0].getType();
            const token = tokens[0].getToken();
            const value = tokens[1] ? tokens[1].getValue() : null;

            switch (type) {
                case TokenTypes.TEMPO:
                    const bpm = value;

                    if (bpm <= 0) {
                        throw new Error(`BPM (${bpm}) is greater than 0`);
                    }

                    timeOf4note = 60 / bpm;

                    break;
                case TokenTypes.OCTAVE:
                    octave = value;

                    if (octave <= 0) {
                        throw new Error(`Octave (${octave}) is greater than 0`);
                    }

                    break;
                case TokenTypes.NOTE:
                    for (let i = 0, len = token.length; i < len; i++) {
                        const note = token.charAt(i);

                        let index = Sequencer.computeIndex(octave, note);

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
                        if (index < 0) {
                            throw new Error(`Index (${index}) is invalid`);
                        }

                        indexes.push(index);
                    }

                    for (const index of indexes) {
                        const frequency = Sequencer.computeFrequency(index);

                        // Validation
                        if (frequency === -1) {
                            throw new Error(`Frequency (${frequency}) is invalid`);
                        }

                        frequencies.push(frequency);
                    }

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
                            if (tokens[1].getToken().includes(Sequencer.DOT)) {
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
                            throw new Error(`Duration (${token}${value}) is invalid`);
                    }

                    if (hasTie) {
                        // Look-back
                        const prevSequence = sequences.pop();

                        currentTime -= prevSequence.duration;
                        duration    += prevSequence.duration;

                        prevNote = `${prevSequence.note}&`;

                        hasTie = false;
                    }

                    break;
                case TokenTypes.REST:
                    indexes.push(-1);
                    frequencies.push(0);

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
                            if (tokens[1].getToken().includes(Sequencer.DOT)) {
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
                            throw new Error(`Duration (${token}${value}) is invalid`);
                    }

                    break;
                case TokenTypes.TIE:
                    hasTie = true;
                    break;
                default:
                    // eslint-disable-next-line no-console
                    console.assert();
                    break;
            }

            if ((type === TokenTypes.TEMPO) || (type === TokenTypes.OCTAVE) || (type === TokenTypes.TIE)) {
                continue;
            }

            start = currentTime;
            stop  = start + duration;

            currentTime += duration;

            sequences.push({
                'note'        : `${prevNote}${tokens.map(t => t.getToken()).join('')}`,
                'indexes'     : indexes.slice(0),  // Shallow copy before clear
                'frequencies' : frequencies.slice(0),  // Shallow copy before clear
                'start'       : start,
                'stop'        : stop,
                'duration'    : duration
            });

            prevNote = '';

            indexes.length     = 0;
            frequencies.length = 0;
        }

        // Release Memory for improving MML performance
        this.treeConstructor.free();

        return sequences;
    }
}
