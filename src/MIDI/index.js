'use strict';

/**
 * This class defines properties for using Web MIDI API.
 * @constructor
 */
export class MIDI {
    /**
     * @param {AudioContext} context This argument is in order to use the interfaces of Web Audio API.
     */
    constructor(context) {
        this.context = context;

        this.midiAccess = null;  // for the instance of `MIDIAccess`
        this.inputs     = [];    // for the instances of `MIDIInput`
        this.outputs    = [];    // for the instances of `MIDIOutput`
    }

    /**
     * This method invokes `requestMIDIAccess` and gets objects for using Web MIDI API.
     * @param {boolean} sysex This argument is in order to select whether using system exclusive message.
     * @param {function} successCallback This argument is invoked when `requestMIDIAccess` succeeds.
     * @param {function} errorCallback This argument is invoked when `requestMIDIAccess` fails.
     * @return {MIDI} This is returned for method chain.
     */
    setup(sysex, successCallback, errorCallback) {
        if (!navigator.requestMIDIAccess) {
            throw new Error('Cannot use Web MIDI API.');
        }

        navigator.requestMIDIAccess({ sysex : Boolean(sysex) }).then(midiAccess => {
            this.midiAccess = midiAccess;

            if (Object.prototype.toString.call(midiAccess) === '[object Function]') {
                // Legacy Chrome
                this.inputs  = midiAccess.inputs();
                this.outputs = midiAccess.outputs();
            } else {
                // Chrome 39 and later
                const inputIterator  = midiAccess.inputs.values();
                const outputIterator = midiAccess.outputs.values();

                for (let i = inputIterator.next(); !i.done; i = inputIterator.next()) {
                    this.inputs.push(i.value);
                }

                for (let o = outputIterator.next(); !o.done; o = outputIterator.next()) {
                    this.outputs.push(o.value);
                }
            }

            if (Object.prototype.toString.call(successCallback) === '[object Function]') {
                successCallback(this.midiAccess, this.inputs, this.outputs);
            }
        }).catch(error => {
            if (Object.prototype.toString.call(errorCallback) === '[object Function]') {
                errorCallback(error);
            }
        });

        return this;
    }

    /**
     * This method gets the instance of `MIDIAccess`.
     * @return {MIDIAccess}
     */
    get() {
        return this.midiAccess;
    }

    /** @override */
    toString() {
        return '[MIDI]';
    }
}
