'use strict';

/**
 * This class is model for a recording track.
 * Namely, this class has the recorded sound data.
 * @constructor
 */
export class Track {
    /**
     * @param {number} trackNumber This argument is a track number greater than or equal to 0.
     */
    constructor(trackNumber) {
        this.trackNumber = trackNumber > 0 ? trackNumber : 0;
        this.dataBlocks  = [];  /** @type {Array.<Float32Array>} */
    }

    /**
     * This method returns the array that contains the recorded sound data.
     * @return {Array.<Float32Array>} This is returned as the array that contains `Float32Array`.
     */
    get() {
        return this.dataBlocks;
    }

    /**
     * This method appends the recorded sound data as `Float32Array`
     * @param {Float32Array} dataBlock This argument is the instance of `Float32Array` that has the recorded sound data.
     */
    append(dataBlock) {
        if (dataBlock instanceof Float32Array) {
            this.dataBlocks.push(dataBlock);
        }
    }

    /**
     * This method determines whether contains the recorded sound data.
     * @return {boolean} If the track has the recorded data, this value is `true`. Otherwise, this value is `false`.
     */
    has() {
        return this.dataBlocks.length > 0;
    }

    /**
     * This method clears data blocks.
     */
    clear() {
        this.dataBlocks.length = 0;
    }
}
