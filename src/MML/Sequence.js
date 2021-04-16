'use strict';

/**
 * This class is the entity for sequence that has musical notes.
 * @constructor
 */
export class Sequence {
    /**
     * @param {string} note This argument is the string that corresponds to MML token.
     * @param {Array.<number>} indexes This argument is the array that contains the indexes that corresponds to the 12 equal temperament.
     * @param {Array.<number>} frequencies This argument is the array that contains the frequencies.
     * @param {number} start This argument is the start time.
     * @param {number} stop This argument is the stop time.
     * @param {number} duration This argument is the duration.
     */
    constructor(note, indexes, frequencies, start, stop, duration) {
        this.note        = note;
        this.indexes     = indexes;
        this.frequencies = frequencies;
        this.start       = start;
        this.stop        = stop;
        this.duration    = duration;
    }

    /**
     * This method concatenates sequence in the case of tie.
     * @param {Sequence} sequence This argument is the instance of `Sequence`.
     */
    concat(sequence) {
        const s = sequence.toPlainObject();

        this.note     += `&${s.note}`;
        this.duration += s.duration;

        this.stop = this.start + this.duration;
    }

    /**
     * This method converts the values that the instance of `Sequence` has to plain object and returns it.
     * @return {object} This is returned as the plain object that has musical notes.
     */
    toPlainObject() {
        return {
            'note'        : this.note,
            'indexes'     : this.indexes,
            'frequencies' : this.frequencies,
            'start'       : this.start,
            'stop'        : this.stop,
            'duration'    : this.duration
        };
    }
}
