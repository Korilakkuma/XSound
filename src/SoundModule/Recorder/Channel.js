'use strict';

import { Track } from './Track';

/**
 * This class is model for a recording channel.
 * @constructor
 */
export class Channel {
    /**
     * @param {number} channelNumber This argument is a channel number greater than or equal to 0.
     */
    constructor(channelNumber) {
        this.channelNumber = channelNumber >= 0 ? channelNumber : 0;

        this.tracks = [];  /** @type {Array.<Float32Array>} */
        this.gain   = 1;
    }

    /**
     * This method returns the designated track or the array that contains tracks.
     * @param {number} trackNumber This argument is the target track number.
     * @return {Track|Array.<Track>} This is returned as the designated track or the array that contains the instances of `Track`.
     */
    get(trackNumber) {
        const t = parseInt(trackNumber, 10);

        if ((t >= 0) && (t < this.tracks.length)) {
            return this.tracks[t];
        }

        return this.tracks;
    }

    /**
     * This method appends the instance of `Track`.
     * @param {Track} track This argument is the instance of `Track` as a recording track.
     */
    append(track) {
        if (track instanceof Track) {
            this.tracks.push(track);
        }
    }

    /**
     * This method returns the number of tracks.
     * @return {number} This is returned as the number of tracks.
     */
    length() {
        return this.tracks.length;
    }

    /**
     * This method gets the channel gain.
     * @return {number} This is returned as the channel gain.
     */
    getGain() {
        return this.gain;
    }

    /**
     * This method sets the channel gain.
     * @param {number} gain This argument is the channel gain.
     */
    setGain(gain) {
        const g = parseFloat(gain);

        if ((g >= 0) && (g <= 1)) {
            this.gain = g;
        }
    }
}
