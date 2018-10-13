'use strict';

/**
 * This private class defines properties for multi track recording.
 * @constructor
 */
export class Recorder {
    /**
     * @param {AudioContext} context This argument is in order to use the interfaces of Web Audio API.
     * @param {number} bufferSize This argument is buffer size for `ScriptProcessorNode`.
     * @param {number} numberOfInputs This argument is the number of inputs for `ScriptProcessorNode`.
     * @param {number} numberOfOutputs This argument the number of outputs for `ScriptProcessorNode`.
     */
    constructor(context, bufferSize, numberOfInputs, numberOfOutputs) {
        this.sampleRate = context.sampleRate;

        this.context   = context;
        this.processor = context.createScriptProcessor(bufferSize, numberOfInputs, numberOfOutputs);

        this.mixedLs = null;  /** @type {Float32Array} */
        this.mixedRs = null;  /** @type {Float32Array} */

        this.numberOfTracks = 0;
        this.trackLs        = [];  /** @type {Array.<Array.<Float32Array>>} 2 dimensions array */
        this.trackRs        = [];  /** @type {Array.<Array.<Float32Array>>} 2 dimensions array */

        this.activeTrack = -1;    // There is not any active track in the case of -1
        this.paused      = true;  // for preventing from the duplicate `onaudioprocess` event (`start` method)

        this.gainL = 1;  // Gain of Left  channel
        this.gainR = 1;  // Gain of Right channel
    }

    /**
     * This method sets the max number of tracks.
     * @param {number} numberOfTracks This argument is the max number of tracks. The default value is 1.
     * @return {Recorder} This is returned for method chain.
     */
    setup(numberOfTracks) {
        const n = parseInt(numberOfTracks, 10);

        if (n > 0) {
            this.numberOfTracks = n;

            this.trackLs = new Array(this.numberOfTracks);
            this.trackRs = new Array(this.numberOfTracks);

            for (let i = 0; i < n; i++) {this.trackLs[i] = [];}  // n x array
            for (let i = 0; i < n; i++) {this.trackRs[i] = [];}  // n x array
        } else {
            this.numberOfTracks = 1;

            this.trackLs = new Array(this.numberOfTracks);
            this.trackRs = new Array(this.numberOfTracks);

            this.trackLs[0] = [];  // 1 * array
            this.trackRs[0] = [];  // 1 * array
        }

        return this;
    }

    /**
     * This method is getter or setter for parameters.
     * @param {string|object} key This argument is property name in the case of string type.
     *     This argument is pair of property and value in the case of associative array.
     * @param {number} value This argument is the value of designated property. If this argument is omitted, This method is getter.
     * @return {number|Recorder} This is returned as the value of designated property in the case of getter. Otherwise, this is returned for method chain.
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
                case 'gainl':
                case 'gainr':
                    if (value === undefined) {
                        return this[`gain${k.slice(-1).toUpperCase()}`];
                    }

                    v   = parseFloat(value);
                    min = 0;
                    max = 1;

                    if ((v >= min) && (v <= max)) {
                        this[`gain${k.slice(-1).toUpperCase()}`] = v;
                    }

                    break;
                default:
                    break;
            }
        }

        return this;
    }

    /**
     * This method selects active track.
     * @param {number} track This argument is in order to select active track.
     * @return {Recorder} This is returned for method chain.
     */
    ready(track) {
        if (this.isTrack(track)) {
            this.activeTrack = track;
        } else {
            this.activeTrack = -1;
        }

        return this;
    }

    /**
     * This method starts recording. If there is not any active track, this method stops `onaudioprocess` event handler in the instance of `ScriptProcessorNode`.
     * @return {Recorder} This is returned for method chain.
     */
    start() {
        if ((this.activeTrack !== -1) && this.paused) {
            this.paused = false;

            const bufferSize = this.processor.bufferSize;

            this.processor.onaudioprocess = event => {
                if (this.activeTrack !== -1) {
                    const inputLs = event.inputBuffer.getChannelData(0);
                    const inputRs = event.inputBuffer.getChannelData(1);

                    const recordedLs = new Float32Array(bufferSize);
                    const recordedRs = new Float32Array(bufferSize);

                    for (let i = 0; i < bufferSize; i++) {
                        recordedLs[i] = this.gainL * inputLs[i];
                        recordedRs[i] = this.gainR * inputRs[i];
                    }

                    this.trackLs[this.activeTrack].push(recordedLs);
                    this.trackRs[this.activeTrack].push(recordedRs);
                } else {
                    this.processor.disconnect(0);
                    this.processor.onaudioprocess = null;
                }
            };
        }

        return this;
    }

    /**
     * This method turns off the all of tracks, and stops `onaudioprocess` event handler in the instance of `ScriptProcessorNode`.
     * @return {Recorder} This is returned for method chain.
     */
    stop() {
        this.activeTrack = -1;  // Flag becomes inactive
        this.paused      = true;

        // Stop `onaudioprocess` event
        this.processor.disconnect(0);
        this.processor.onaudioprocess = null;

        return this;
    }

    /**
     * This method determines whether the designated track number is valid.
     * @param {number} track This argument is track number for validation.
     * @return {boolean} If the designated track is valid range, this value is `true`. Otherwise, this value is `false`.
     */
    isTrack(track) {
        const t = parseInt(track, 10);

        return (t >= 0) && (t < this.numberOfTracks);
    }

    /**
     * This method determines whether active track exists.
     * @return {number} This is returned as active track.
     */
    getActiveTrack() {
        return this.activeTrack;
    }

    /**
     * This method synthesizes recorded sounds in track.
     * @param {string} channel This argument is either 'L' or 'R'.
     * @return {Float32Array} This is returned as array for synthesized sound.
     */
    mixTrack(channel) {
        const tracks      = this[`track${channel}s`];
        const mixes       = { 'values' : null, 'sum' : 0, 'num' : 0 };
        const bufferSize  = this.processor.bufferSize;
        let currentBuffer = 0;
        let index         = 0;

        // Calculate sound data size
        let numberOfMaxBuffers = 0;

        // Search the max number of Float32Arrays each track
        for (const track of tracks) {
            if (numberOfMaxBuffers < track.length) {
                numberOfMaxBuffers = track.length;
            }
        }

        mixes.values = new Float32Array(numberOfMaxBuffers * bufferSize);

        while (true) {
            for (let currentTrack = 0, len = tracks.length; currentTrack < len; currentTrack++) {
                if (tracks[currentTrack][currentBuffer] instanceof Float32Array) {
                    mixes.sum += tracks[currentTrack][currentBuffer][index];
                    mixes.num++;
                }
            }

            if (mixes.num > 0) {
                const offset = currentBuffer * bufferSize;

                // Average
                mixes.values[offset + index] = mixes.sum / mixes.num;

                // Clear
                mixes.sum = 0;
                mixes.num = 0;

                // Next data
                if (index < (bufferSize - 1)) {
                    // Next element in Float32Array
                    index++;
                } else {
                    // Next Float32Array
                    currentBuffer++;
                    index = 0;
                }
            } else {
                return mixes.values;
            }
        }
    }

    /**
     * This method synthesizes the all of recorded sounds in track.
     * @return {Recorder} This is returned for method chain.
     */
    mix() {
        // on the way of recording ?
        if (this.activeTrack !== -1) {
            this.stop();
        }

        this.mixedLs = this.mixTrack('L');
        this.mixedRs = this.mixTrack('R');

        return this;
    }

    /**
     * This method clears recorded sound of the designated track.
     * @param {number|string} track This argument is track for clearing.
     * @return {Recorder} This is returned for method chain.
     */
    clear(track) {
        // on the way of recording ?
        if (this.activeTrack !== -1) {
            this.stop();
        }

        if (String(track).toLowerCase() === 'all') {
            for (const track of this.trackLs) {track.length = 0;}
            for (const track of this.trackRs) {track.length = 0;}
        } else {
            if (this.isTrack(track)) {
                this.trackLs[track].length = 0;
                this.trackRs[track].length = 0;
            }
        }

        return this;
    }

    /**
     * This method creates WAVE file as Object URL or Data URL.
     * @param {string|number} track This argument is the target track.
     * @param {number} numberOfChannels This argument is in order to select stereo or monaural of WAVE file. The default value is 2.
     * @param {number} qbit This argument is quantization bit of PCM. The default value is 16 (bit).
     * @return {string} This is returned as Object URL or Data URL for WAVE file.
     */
    create(track, numberOfChannels, qbit) {
        // on the way of recording ?
        if (this.activeTrack !== -1) {
            this.stop();
        }

        /** @type {Float32Array} */
        let soundLs = null;

        /** @type {Float32Array} */
        let soundRs = null;

        if (String(track).toLowerCase() === 'all') {
            this.mix();

            soundLs = this.mixedLs;
            soundRs = this.mixedRs;
        } else {
            if (this.isTrack(track)) {
                soundLs = this.trackLs[track - 1];
                soundRs = this.trackRs[track - 1];
            }
        }

        // Sound data exists ?
        if ((soundLs.length === 0) && (soundRs.length === 0)) {
            return '';
        }

        // PCM parameters
        const CHANNEL = (numberOfChannels === 1) ? 1 : 2;
        const QBIT    = (qbit === 8) ? 8 : 16;
        const SIZE    = (CHANNEL === 1) ? Math.min(soundLs.length, soundRs.length) : (2 * Math.min(soundLs.length, soundRs.length));

        // Parameters for WAVE file
        const FMT_CHUNK  = 28;
        const DATA_CHUNK =  8 + (SIZE * (QBIT / 8));
        const CHUNK_SIZE = 36 + (SIZE * (QBIT / 8));
        const RIFF_CHUNK =  8 + (FMT_CHUNK + DATA_CHUNK);
        const RATE       = this.sampleRate;
        const BPS        = RATE * CHANNEL * (QBIT / 8);
        const DATA_SIZE  = SIZE * (QBIT / 8);

        /** @type {Uint8Array|Int16Array} */
        let sounds = null;

        switch (QBIT) {
            case 8:
                sounds = new Uint8Array(SIZE);

                for (let i = 0; i < SIZE; i++) {
                    // Convert 8 bit unsigned integer (-1 -> 0, 0 -> 128, 1 -> 255)
                    let binary = 0;

                    if ((i % CHANNEL) === 0) {
                        binary = ((soundLs[Math.floor(i / CHANNEL)] + 1) / 2) * (Math.pow(2, 8) - 1);  // Left channel
                    } else {
                        binary = ((soundRs[Math.floor(i / CHANNEL)] + 1) / 2) * (Math.pow(2, 8) - 1);  // Right channel
                    }

                    // for preventing from clipping
                    if (binary > (Math.pow(2, 8) - 1)) {binary = (Math.pow(2, 8) - 1);}
                    if (binary < (Math.pow(2, 0) - 1)) {binary = (Math.pow(2, 0) - 1);}

                    sounds[i] = binary;
                }

                break;
            case 16:
                sounds = new Int16Array(SIZE);

                for (let i = 0; i < SIZE; i++) {
                    // Convert 16 bit integer (-1 -> -32768, 0 -> 0, 1 -> 32767)
                    let binary = 0;

                    if ((i % CHANNEL) === 0) {
                        binary = soundLs[Math.floor(i / CHANNEL)] * Math.pow(2, 15);  // Left channel
                    } else {
                        binary = soundRs[Math.floor(i / CHANNEL)] * Math.pow(2, 15);  // Right channel
                    }

                    // for preventing from clipping
                    if (binary > (+Math.pow(2, 15) - 1)) {binary =  Math.pow(2, 15) - 1;}
                    if (binary < (-Math.pow(2, 15) - 1)) {binary = -Math.pow(2, 15) - 1;}

                    sounds[i] = binary;
                }

                break;
            default:
                break;
        }

        // Create WAVE file (Object URL or Data URL)
        window.URL = window.URL || window.webkitURL || window.mozURL;

        if (window.URL && window.URL.createObjectURL) {
            // Object URL

            const waves = [];

            waves[0] = 0x52;  // 'R'
            waves[1] = 0x49;  // 'I'
            waves[2] = 0x46;  // 'F'
            waves[3] = 0x46;  // 'F'

            waves[4] = (CHUNK_SIZE >>  0) & 0xFF;
            waves[5] = (CHUNK_SIZE >>  8) & 0xFF;
            waves[6] = (CHUNK_SIZE >> 16) & 0xFF;
            waves[7] = (CHUNK_SIZE >> 24) & 0xFF;

            waves[8]  = 0x57;  // 'W'
            waves[9]  = 0x41;  // 'A'
            waves[10] = 0x56;  // 'V'
            waves[11] = 0x45;  // 'E'

            // fmt chunk
            waves[12] = 0x66;  // 'f'
            waves[13] = 0x6D;  // 'm'
            waves[14] = 0x74;  // 't'
            waves[15] = 0x20;  // ' '

            waves[16] = 16;
            waves[17] =  0;
            waves[18] =  0;
            waves[19] =  0;

            waves[20] = 1;
            waves[21] = 0;

            // fmt chunk -> Channels (Monaural or Stereo)
            waves[22] = CHANNEL;
            waves[23] = 0;

            // fmt chunk -> Sample rate
            waves[24] = (RATE >>  0) & 0xFF;
            waves[25] = (RATE >>  8) & 0xFF;
            waves[26] = (RATE >> 16) & 0xFF;
            waves[27] = (RATE >> 24) & 0xFF;

            // fmt chunk -> Byte per second
            waves[28] = (BPS >>  0) & 0xFF;
            waves[29] = (BPS >>  8) & 0xFF;
            waves[30] = (BPS >> 16) & 0xFF;
            waves[31] = (BPS >> 24) & 0xFF;

            // fmt chunk -> Block size
            waves[32] = CHANNEL * (QBIT / 8);
            waves[33] = 0;

            // fmt chunk -> Byte per Sample
            waves[34] = QBIT;
            waves[35] = 0;

            // data chunk
            waves[36] = 0x64;  // 'd'
            waves[37] = 0x61;  // 'a'
            waves[38] = 0x74;  // 't
            waves[39] = 0x61;  // 'a'

            waves[40] = (DATA_SIZE >>  0) & 0xFF;
            waves[41] = (DATA_SIZE >>  8) & 0xFF;
            waves[42] = (DATA_SIZE >> 16) & 0xFF;
            waves[43] = (DATA_SIZE >> 24) & 0xFF;

            for (let i = 0; i < SIZE; i++) {
                switch (QBIT) {
                    case  8:
                        waves[(RIFF_CHUNK - DATA_SIZE) + i] = sounds[i];
                        break;
                    case 16:
                        // The byte order in WAVE file is little endian
                        waves[(RIFF_CHUNK - DATA_SIZE) + (2 * i) + 0] = ((sounds[i] >> 0) & 0xFF);
                        waves[(RIFF_CHUNK - DATA_SIZE) + (2 * i) + 1] = ((sounds[i] >> 8) & 0xFF);
                        break;
                    default:
                        break;
                }
            }

            const blob      = new Blob([new Uint8Array(waves)], { 'type' : 'audio/wav' });
            const objectURL = window.URL.createObjectURL(blob);

            return objectURL;
        }

        // Data URL

        let wave = '';

        wave += 'RIFF';
        wave += String.fromCharCode(((CHUNK_SIZE >> 0) & 0xFF), ((CHUNK_SIZE >> 8) & 0xFF), ((CHUNK_SIZE >> 16) & 0xFF), ((CHUNK_SIZE >> 24) & 0xFF));
        wave += 'WAVE';

        // fmt chunk
        wave += `fmt ${String.fromCharCode(16, 0, 0, 0)}`;
        wave += String.fromCharCode(1, 0);

        // fmt chunk -> Channels (Monaural or Stereo)
        wave += String.fromCharCode(CHANNEL, 0);

        // fmt chunk -> Sample rate
        wave += String.fromCharCode(((RATE >> 0) & 0xFF), ((RATE >> 8) & 0xFF), ((RATE >> 16) & 0xFF), ((RATE >> 24) & 0xFF));

        // fmt chunk -> Byte per second
        wave += String.fromCharCode(((BPS >> 0) & 0xFF), ((BPS >> 8) & 0xFF), ((BPS >> 16) & 0xFF), ((BPS >> 24) & 0xFF));

        // fmt chunk -> Block size
        wave += String.fromCharCode((CHANNEL * (QBIT / 8)), 0);

        // fmt chunk -> Byte per Sample
        wave += String.fromCharCode(QBIT, 0);

        // data chunk
        wave += 'data';
        wave += String.fromCharCode(((DATA_SIZE >> 0) & 0xFF), ((DATA_SIZE >> 8) & 0xFF), ((DATA_SIZE >> 16) & 0xFF), ((DATA_SIZE >> 24) & 0xFF));

        for (let i = 0; i < SIZE; i++) {
            switch (QBIT) {
                case  8:
                    wave += String.fromCharCode(sounds[i]);
                    break;
                case 16:
                    // The byte order in WAVE file is little endian
                    wave += String.fromCharCode(((sounds[i] >> 0) & 0xFF), ((sounds[i] >> 8) & 0xFF));
                    break;
                default:
                    break;
            }
        }

        const base64  = window.btoa(wave);
        const dataURL = `data:audio/wav;base64,${base64}`;

        return dataURL;
    }

    /** @override */
    toString() {
        return '[SoundModule Recorder]';
    }
}
