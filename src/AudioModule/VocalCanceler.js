'use strict';

/**
 * This private class defines properties for Vocal Canceler.
 * @constructor
 */
export default class VocalCanceler {
    constructor() {
        this.depth = 0;
    }

    /**
     * This method is getter or setter for parameters.
     * @param {string|object} key This argument is property name in the case of string type.
     *     This argument is pair of property and value in the case of associative array.
     * @param {number} value This argument is the value of designated property. If this argument is omitted, This method is getter.
     * @return {number|VocalCanceler} This is returned as the value of designated property in the case of getter. Otherwise, this is returned for method chain.
     */
    param(key, value) {
        if (Object.prototype.toString.call(arguments[0]) === '[object Object]') {
            // Associative array
            for (const k in arguments[0]) {
                this.param(k, arguments[0][k]);
            }
        } else {
            const k = String(key).replace(/-/g, '').toLowerCase();

            let v   = null;
            let min = null;
            let max = null;

            switch (k) {
                case 'depth':
                    if (value === undefined) {
                        return this.depth;
                    }

                    v   = parseFloat(value);
                    min = 0;
                    max = 1;

                    if ((v >= min) && (v <= max)) {
                        this.depth = v;
                    }

                    break;
                default:
                    break;
            }
        }

        return this;
    }

    /**
     * This method removes vocal part in the played audio.
     * @param {number} dataL This argument is gain level for Left channel.
     * @param {number} dataR This argument is gain level for Right channel.
     * @return {number} This is returned as audio data except vocal part.
     */
    start(dataL, dataR) {
        return dataL - (this.depth * dataR);
    }

    /** @override */
    toString() {
        return '[AudioModule VocalCanceler]';
    }
}
