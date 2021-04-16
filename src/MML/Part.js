'use strict';

import { Tokenizer } from './Tokenizer';
import { TreeConstructor } from './TreeConstructor';
import { Sequencer } from './Sequencer';
import { OscillatorModule } from '../OscillatorModule';
import { OneshotModule } from '../OneshotModule';
import { NoiseModule } from '../NoiseModule';

/**
 * This class parses, starts and stops MML as each MML part.
 * @constructor
 */
export class Part {
    /**
     * @param {OscillatorModule|OneshotModule|NoiseModule} source This argument is in order to select sound source.
     * @param {string} mml This argument is MML string.
     * @param {number} offset This argument is in order to correct the index of one-shot audio.
     * @param {object.<function>} callbacks This argument is callback functions.
     * @param {number} offset This argument is in order to correct the index of one-shot audio.
     */
    constructor(source, mml, callbacks, offset) {
        this.source          = null;  /** @type {OscillatorModule|OneshotModule|NoiseModule} */
        this.mml             = '';
        this.previous        = null;  /** @type {Sequence} */
        this.timerid         = null;  /** @type {number} */
        this.currentIndex    = 0;     /** @type {number} */
        this.currentPosition = 0;     /** @type {number} */
        this.offset          = 0;

        if ((source instanceof OscillatorModule) || (source instanceof OneshotModule) || (source instanceof NoiseModule)) {
            this.source = source;
        }

        if (typeof mml === 'string') {
            this.mml = mml;
        }

        this.callbacks = {
            'start' : () => {},
            'stop'  : () => {},
            'ended' : () => {},
            'error' : () => {}
        };

        if (Object.prototype.toString.call(callbacks) === '[object Object]') {
            Object.keys(callbacks).forEach(key => {
                const k = key.toLowerCase();

                if (k in this.callbacks) {
                    if (Object.prototype.toString.call(callbacks[k]) === '[object Function]') {
                        this.callbacks[k] = callbacks[k];
                    }
                }
            });
        }

        const o = parseInt(offset, 10);

        if (!isNaN(o) && (o >= 0)) {
            this.offset = o;
        }

        const tokenizer       = new Tokenizer(mml);
        const treeConstructor = new TreeConstructor(tokenizer);
        const sequencer       = new Sequencer(treeConstructor);

        this.sequences = sequencer.get(this.callbacks.error);
    }

    /**
     * This method starts MML. Moreover, this method schedules next sequence.
     * @param {boolean} highlight This argument is `true` in the case of surrounding by `span.x-highlight`.
     * @param {Array.<Effector>|Array.<AudioNode>} connects This argument is the array for changing the default connection.
     */
    start(highlight, connects) {
        const sequence = this.sequence[this.currentIndex++];

        if (!sequence) {
            this.stop();
            this.callbacks.ended();

            return;
        }

        if (highlight) {
            const prev    = this.mml.slice(0, this.currentPosition);
            const current = this.mml.slice(this.currentPosition).replace(sequence.note, `<span class="x-highlight">${sequence.note}</span>`);

            this.mml = `${prev}${current}`;

            this.currentPosition += this.mml.slice(this.currentPosition).indexOf('</span>') + '</span>'.length;
        } else {
            const prev    = this.mml.slice(0, this.currentPosition);
            const current = sequence.note;

            this.mml = `${prev}${current}`;

            this.currentPosition += current.length;
        }

        if (this.source instanceof OscillatorModule) {
            this.source.start(sequence.frequencies);
            this.callbacks.start(sequence);
        } else if (this.source instanceof OneshotModule) {
            for (let i = 0, len = sequence.indexes.length; i < len; i++) {
                if (sequence.indexes[i] !== -1) {
                    this.source.start((sequence.indexes[i] + this.offset));
                }
            }

            this.callbacks.start(sequence, this.offset);
        } else if (this.source instanceof NoiseModule) {
            this.source.start(connects);
            this.callbacks.start(sequence);
        }

        this.timerid = window.setTimeout(() => {
            if (this.source instanceof OscillatorModule) {
                this.source.stop();
                this.callbacks.stop(sequence);
            } else if (this.source instanceof OneshotModule) {
                for (let i = 0, len = sequence.indexes.length; i < len; i++) {
                    if (sequence.indexes[i] !== -1) {
                        this.source.stop((sequence.indexes[i] + this.offset));
                    }
                }

                this.callbacks.stop(sequence, this.offset);
            } else if (this.source instanceof NoiseModule) {
                this.source.stop();
                this.callbacks.stop(sequence);
            }

            // for stopping MML
            this.previous = sequence;

            // Start next sequence
            this.start(highlight, connects);
        }, (sequence.duration * 1000));
    }

    /**
     * This method stops MML.
     */
    stop() {
        if (this.previous === null) {
            return;
        }

        if (this.source instanceof OscillatorModule) {
            this.source.stop();
            this.callbacks.stop(this.previous);
        } else if (this.source instanceof OneshotModule) {
            for (const index of this.previous.indexes) {
                if (index !== -1) {
                    this.source.stop((index + this.offset));
                }
            }

            this.callbacks.stop(this.previous, this.offset);
        } else if (this.source instanceof NoiseModule) {
            this.source.stop();
            this.callbacks.stop(this.previous);
        }

        window.clearTimeout(this.timerid);
        this.timerid = null;
    }

    /**
     * This method is the getter for MML string.
     */
    getMML() {
        return this.mml;
    }

    /**
     * This method is the getter for sequence.
     */
    getSequence() {
        return this.sequences;
    }

    /**
     * This method determines whether the sequence exists.
     * @return {boolean} If the sequence exists, this value is `true`. Otherwise, this value is `false`.
     */
    hasSequence() {
        return this.sequences.length > 0;
    }

    /**
     * This method determines whether the MMLs are paused.
     * @return {boolean} If the MMLs are paused, this value is `true`. Otherwise, this value is `false`.
     */
    paused() {
        return this.timerid === null;
    }

    /**
     * This method is the getter for current sequence index.
     */
    getCurrentIndex() {
        return this.currentIndex;
    }

    /**
     * This method is the setter for current sequence index.
     * @param {number} index This argument is the number that is new sequence index.
     */
    setCurrentIndex(index) {
        const i = parseInt(index, 10);

        if (i >= 0 && i < this.sequences.length) {
            this.currentIndex = i;
        }
    }
}
