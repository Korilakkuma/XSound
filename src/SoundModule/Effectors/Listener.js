'use strict';

import { Effector } from './Effector';

/**
 * Effector's subclass
 * @constructor
 * @extends {Effector}
 */
export class Listener extends Effector {
    /**
     * @param {AudioContext} context This argument is in order to use the interfaces of Web Audio API.
     */
    constructor(context, bufferSize) {
        super(context, bufferSize);

        // the instance of `AudioListener`
        this.listener = context.listener;

        // Set default value
        this.positions = { 'x' : 0, 'y' : 0, 'z' : 0 };
        this.forwards  = { 'x' : 0, 'y' : 0, 'z' : -1 };
        this.ups       = { 'x' : 0, 'y' : 1, 'z' : 0 };

        if ((this.listener.positionX instanceof AudioParam) && (this.listener.positionY instanceof AudioParam) && (this.listener.positionZ instanceof AudioParam)) {
            this.listener.positionX.setValueAtTime(this.positions.x, context.currentTime);
            this.listener.positionY.setValueAtTime(this.positions.y, context.currentTime);
            this.listener.positionZ.setValueAtTime(this.positions.z, context.currentTime);
        } else {
            this.listener.setPosition(this.positions.x, this.positions.y, this.positions.z);
        }

        if ((this.listener.forwardX instanceof AudioParam)
            && (this.listener.forwardY instanceof AudioParam)
            && (this.listener.forwardZ instanceof AudioParam)
            && (this.listener.upX instanceof AudioParam)
            && (this.listener.upY instanceof AudioParam)
            && (this.listener.upZ instanceof AudioParam)) {
            this.listener.forwardX.setValueAtTime(this.forwards.x, context.currentTime);
            this.listener.forwardY.setValueAtTime(this.forwards.y, context.currentTime);
            this.listener.forwardZ.setValueAtTime(this.forwards.z, context.currentTime);
            this.listener.upX.setValueAtTime(this.ups.x, context.currentTime);
            this.listener.upY.setValueAtTime(this.ups.y, context.currentTime);
            this.listener.upZ.setValueAtTime(this.ups.z, context.currentTime);
        } else {
            this.listener.setOrientation(this.forwards.x, this.forwards.y, this.forwards.z, this.ups.x, this.ups.y, this.ups.z);
        }
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

                        if ((this.listener.positionX instanceof AudioParam) && (this.listener.positionY instanceof AudioParam) && (this.listener.positionZ instanceof AudioParam)) {
                            this.listener.positionX.setValueAtTime(this.positions.x, this.context.currentTime);
                            this.listener.positionY.setValueAtTime(this.positions.y, this.context.currentTime);
                            this.listener.positionZ.setValueAtTime(this.positions.z, this.context.currentTime);
                        } else {
                            this.listener.setPosition(this.positions.x, this.positions.y, this.positions.z);
                        }
                    }

                    break;
                case 'fx':
                case 'fy':
                case 'fz':
                    if (value === undefined) {
                        return this.forwards[k.charAt(1)];
                    }

                    v = parseFloat(value);

                    if (!isNaN(v)) {
                        this.forwards[k.charAt(1)] = v;

                        if ((this.listener.forwardX instanceof AudioParam)
                            && (this.listener.forwardY instanceof AudioParam)
                            && (this.listener.forwardZ instanceof AudioParam)
                            && (this.listener.upX instanceof AudioParam)
                            && (this.listener.upY instanceof AudioParam)
                            && (this.listener.upZ instanceof AudioParam)) {
                            this.listener.forwardX.setValueAtTime(this.forwards.x, this.context.currentTime);
                            this.listener.forwardY.setValueAtTime(this.forwards.y, this.context.currentTime);
                            this.listener.forwardZ.setValueAtTime(this.forwards.z, this.context.currentTime);
                            this.listener.upX.setValueAtTime(this.ups.x, this.context.currentTime);
                            this.listener.upY.setValueAtTime(this.ups.y, this.context.currentTime);
                            this.listener.upZ.setValueAtTime(this.ups.z, this.context.currentTime);
                        } else {
                            this.listener.setOrientation(this.forwards.x, this.forwards.y, this.forwards.z, this.ups.x, this.ups.y, this.ups.z);
                        }
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

                        if ((this.listener.forwardX instanceof AudioParam)
                            && (this.listener.forwardY instanceof AudioParam)
                            && (this.listener.forwardZ instanceof AudioParam)
                            && (this.listener.upX instanceof AudioParam)
                            && (this.listener.upY instanceof AudioParam)
                            && (this.listener.upZ instanceof AudioParam)) {
                            this.listener.forwardX.setValueAtTime(this.forwards.x, this.context.currentTime);
                            this.listener.forwardY.setValueAtTime(this.forwards.y, this.context.currentTime);
                            this.listener.forwardZ.setValueAtTime(this.forwards.z, this.context.currentTime);
                            this.listener.upX.setValueAtTime(this.ups.x, this.context.currentTime);
                            this.listener.upY.setValueAtTime(this.ups.y, this.context.currentTime);
                            this.listener.upZ.setValueAtTime(this.ups.z, this.context.currentTime);
                        } else {
                            this.listener.setOrientation(this.forwards.x, this.forwards.y, this.forwards.z, this.ups.x, this.ups.y, this.ups.z);
                        }
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
            'state'     : this.isActive,
            'positions' : this.positions,
            'forwards'  : this.forwards,
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
