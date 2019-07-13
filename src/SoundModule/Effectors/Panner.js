'use strict';

import { Effector } from './Effector';

/**
 * Effector's subclass
 * @constructor
 * @extends {Effector}
 */
export class Panner extends Effector {
    static PANNING_MODELS = {
        'equalpower' : 0,
        'HRTF'       : 1
    };

    static DISTANCE_MODELS = {
        'linear'      : 0,
        'inverse'     : 1,
        'exponential' : 2
    };

    /**
     * @param {AudioContext} context This argument is in order to use the interfaces of Web Audio API.
     * @param {number} bufferSize This argument is buffer size for `ScriptProcessorNode`.
     */
    constructor(context, bufferSize) {
        super(context, bufferSize);

        this.panner = context.createPanner();

        this.positions    = { 'x' : 0, 'y' : 0, 'z' : 0 };
        this.orientations = { 'x' : 1, 'y' : 0, 'z' : 0 };

        this.panner.refDistance   = 1;
        this.panner.maxDistance   = 10000;
        this.panner.rolloffFactor = 1;

        this.panner.coneInnerAngle = 360;
        this.panner.coneOuterAngle = 360;
        this.panner.coneOuterGain  = 0;

        this.panner.panningModel  = (typeof this.panner.panningModel  === 'string') ? 'HRTF'    : (this.panner.HRTF || 1);
        this.panner.distanceModel = (typeof this.panner.distanceModel === 'string') ? 'inverse' : (this.panner.INVERSE_DISTANCE || 1);

        if ((this.panner.positionX instanceof AudioParam) && (this.panner.positionY instanceof AudioParam) && (this.panner.positionZ instanceof AudioParam)) {
            this.panner.positionX.setValueAtTime(this.positions.x, context.currentTime);
            this.panner.positionY.setValueAtTime(this.positions.y, context.currentTime);
            this.panner.positionZ.setValueAtTime(this.positions.z, context.currentTime);
        } else {
            this.panner.setPosition(this.positions.x, this.positions.y, this.positions.z);
        }

        if ((this.panner.orientationX instanceof AudioParam) && (this.panner.orientationY instanceof AudioParam) && (this.panner.orientationZ instanceof AudioParam)) {
            this.panner.orientationX.setValueAtTime(this.orientations.x, context.currentTime);
            this.panner.orientationY.setValueAtTime(this.orientations.y, context.currentTime);
            this.panner.orientationZ.setValueAtTime(this.orientations.z, context.currentTime);
        } else {
            this.panner.setOrientation(this.orientations.x, this.orientations.y, this.orientations.z);
        }

        // `Panner` is not connected by default
        this.state(false);
    }

    /** @override */
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

                        if ((this.panner.positionX instanceof AudioParam) && (this.panner.positionY instanceof AudioParam) && (this.panner.positionZ instanceof AudioParam)) {
                            this.panner.positionX.setValueAtTime(this.positions.x, this.context.currentTime);
                            this.panner.positionY.setValueAtTime(this.positions.y, this.context.currentTime);
                            this.panner.positionZ.setValueAtTime(this.positions.z, this.context.currentTime);
                        } else {
                            this.panner.setPosition(this.positions.x, this.positions.y, this.positions.z);
                        }
                    }

                    break;
                case 'ox':
                case 'oy':
                case 'oz':
                    if (value === undefined) {
                        return this.orientations[k.charAt(1)];
                    }

                    v = parseFloat(value);

                    if (!isNaN(v)) {
                        this.orientations[k.charAt(1)] = v;

                        if ((this.panner.orientationX instanceof AudioParam) && (this.panner.orientationY instanceof AudioParam) && (this.panner.orientationZ instanceof AudioParam)) {
                            this.panner.orientationX.setValueAtTime(this.orientations.x, this.context.currentTime);
                            this.panner.orientationY.setValueAtTime(this.orientations.y, this.context.currentTime);
                            this.panner.orientationZ.setValueAtTime(this.orientations.z, this.context.currentTime);
                        } else {
                            this.panner.setOrientation(this.orientations.x, this.orientations.y, this.orientations.z);
                        }
                    }

                    break;
                case 'refdistance':
                    if (value === undefined) {
                        return this.panner.refDistance;
                    }

                    v = parseFloat(value);

                    if (v >= 0) {
                        this.panner.refDistance = v;
                    }

                    break;
                case 'maxdistance':
                    if (value === undefined) {
                        return this.panner.maxDistance;
                    }

                    v = parseFloat(value);

                    if (v > 0) {
                        this.panner.maxDistance = v;
                    }

                    break;
                case 'rollofffactor':
                    if (value === undefined) {
                        return this.panner.rolloffFactor;
                    }

                    v = parseFloat(value);

                    if (v >= 0) {
                        this.panner.rolloffFactor = v;
                    }

                    break;
                case 'coneinnerangle':
                    if (value === undefined) {
                        return this.panner.coneInnerAngle;
                    }

                    v = parseFloat(value);

                    if ((v >= 0) && (v <= 360)) {
                        this.panner.coneInnerAngle = v;
                    }

                    break;
                case 'coneouterangle':
                    if (value === undefined) {
                        return this.panner.coneOuterAngle;
                    }

                    v = parseFloat(value);

                    if ((v >= 0) && (v <= 360)) {
                        this.panner.coneOuterAngle = v;
                    }

                    break;
                case 'coneoutergain':
                    if ((v >= 0) && (v <= 1)) {
                        return this.panner.coneOuterGain;
                    }

                    v = parseFloat(value);

                    if (!isNaN(v)) {
                        this.panner.coneOuterGain = v;
                    }

                    break;
                case 'panningmodel':
                    if (value === undefined) {
                        return this.panner.panningModel;
                    }

                    v = /HRTF/i.test(value) ? String(value).toUpperCase() : String(value).toLowerCase();

                    if (v in Panner.PANNING_MODELS) {
                        this.panner.panningModel = (typeof this.panner.panningModel === 'string') ? v : Panner.PANNING_MODELS[v];
                    }

                    break;
                case 'distancemodel':
                    if (value === undefined) {
                        return this.panner.distanceModel;
                    }

                    v = String(value).replace(/-/g, '').toLowerCase();

                    if (v in Panner.DISTANCE_MODELS) {
                        this.panner.distanceModel = (typeof this.panner.distanceModel === 'string') ? v : Panner.DISTANCE_MODELS[v];
                    }

                    break;
                default:
                    break;
            }
        }

        return this;
    }

    /** @override */
    connect() {
        // Clear connection
        this.input.disconnect(0);
        this.panner.disconnect(0);

        if (this.isActive) {
            // Effect ON

            // GainNode (Input) -> PannerNode -> GainNode (Output)
            this.input.connect(this.panner);
            this.panner.connect(this.output);
        } else {
            // Effect OFF

            // GainNode (Input) -> GainNode (Output)
            this.input.connect(this.output);
        }

        return this;
    }

    /** @override */
    params() {
        const params = {
            'state'          : this.isActive,
            'positions'      : this.positions,
            'orientations'   : this.orientations,
            'refDistance'    : this.panner.refDistance,
            'maxDistance'    : this.panner.maxDistance,
            'rolloffFactor'  : this.panner.rolloffFactor,
            'coneInnerAngle' : this.panner.coneInnerAngle,
            'coneOuterAngle' : this.panner.coneOuterAngle,
            'coneOuterGain'  : this.panner.coneOuterGain,
            'panningModel'   : this.panner.panningModel,
            'distanceModel'  : this.panner.distanceModel
        };

        return params;
    }

    /** @override */
    toString() {
        return '[SoundModule Panner]';
    }
}
