'use strict';

/**
 * This private class defines property for audio listener.
 * These properties relate to properties of `PannerNode`.
 * @constructor
 */
export class Listener {
    /**
     * @param {AudioContext} context This argument is in order to use the interfaces of Web Audio API.
     */
    constructor(context) {
        // the instance of `AudioListener`
        this.listener = context.listener;

        // Set default value
        this.positions = { 'x' : 0, 'y' : 0, 'z' : 0 };
        this.fronts    = { 'x' : 0, 'y' : 0, 'z' : -1 };
        this.ups       = { 'x' : 0, 'y' : 1, 'z' : 0 };

        this.listener.setPosition(this.positions.x, this.positions.y, this.positions.z);
        this.listener.setOrientation(this.fronts.x, this.fronts.y, this.fronts.z, this.ups.x, this.ups.y, this.ups.z);
    }

    /**
     * This method is getter or setter for parameters.
     * @param {string|object} key This argument is property name in the case of string type.
     *     This argument is pair of property and value in the case of associative array.
     * @param {number} value This argument is the value of designated property. If this argument is omitted, This method is getter.
     * @return {number|Listener} This is returned as the value of designated property in the case of getter. Otherwise, this is returned for method chain.
     */
    param(key, value) {
        if (Object.prototype.toString.call(arguments[0]) === '[object Object]') {
            // Associative array
            for (const k in arguments[0]) {
                this.param(k, arguments[0][k]);
            }
        } else {
            const k = String(key).replace(/-/g, '').toLowerCase();

            let v = null;

            switch (k) {
                case 'x':
                case 'y':
                case 'z':
                    if (value === undefined) {
                        return this.positions[k];
                    }

                    v = parseFloat(value);

                    if (!isNaN(v)) {
                        this.positions[k] = v;
                        this.listener.setPosition(this.positions.x, this.positions.y, this.positions.z);
                    }

                    break;
                case 'fx':
                case 'fy':
                case 'fz':
                    if (value === undefined) {
                        return this.fronts[k.charAt(1)];
                    }

                    v = parseFloat(value);

                    if (!isNaN(v)) {
                        this.fronts[k.charAt(1)] = v;
                        this.listener.setOrientation(this.fronts.x, this.fronts.y, this.fronts.z, this.ups.x, this.ups.y, this.ups.z);
                    }

                    break;
                case 'ux':
                case 'uy':
                case 'uz':
                    if (value === undefined) {
                        return this.ups[k.charAt(1)];
                    }

                    v = parseFloat(value);

                    if (!isNaN(v)) {
                        this.ups[k.charAt(1)] = v;
                        this.listener.setOrientation(this.fronts.x, this.fronts.y, this.fronts.z, this.ups.x, this.ups.y, this.ups.z);
                    }

                    break;
                default:
                    break;
            }
        }

        return this;
    }

    /**
     * This method gets effecter's parameters as associative array.
     * @return {object}
     */
    params() {
        const params = {
            'positions' : this.positions,
            'fronts'    : this.fronts,
            'ups'       : this.ups
        };

        return params;
    }

    /**
     * This method gets effecter's parameters as JSON.
     * @return {string}
     */
    toJSON() {
        return JSON.stringify(this.params());
    }

    /** @override */
    toString() {
        return '[SoundModule Listener]';
    }
}
