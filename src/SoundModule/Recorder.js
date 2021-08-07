'use strict';

import { Connectable } from '../interfaces/Connectable';

/**
 * This private class defines properties for multi track recording.
 * @constructor
 */
export class Recorder extends Connectable {
    /**
     * @param {AudioContext} context This argument is in order to use the interfaces of Web Audio API.
     * @param {number} bufferSize This argument is buffer size for `ScriptProcessorNode`.
     * @param {number} numberOfInputs This argument is the number of inputs for `ScriptProcessorNode`.
     * @param {number} numberOfOutputs This argument the number of outputs for `ScriptProcessorNode`.
     */
    constructor(context, bufferSize, numberOfInputs, numberOfOutputs) {
        super();

        this.sampleRate = context.sampleRate;

        this.context   = context;
        this.processor = context.createScriptProcessor(bufferSize, numberOfInputs, numberOfOutputs);

        this.numberOfTracks = 0;
        this.tracks         = [];      /** @type {Array.<Array.<Array.<Float32Array>>>} 3 dimensions array */
        this.gains          = [1, 1];  // index 0 is left channel, index 1 is right channel

        this.activeTrack = -1;    // There is not any active track in the case of -1
        this.paused      = true;  // for preventing from the duplicate `onaudioprocess` event (`start` method)
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

            this.tracks = [new Array(this.numberOfTracks), new Array(this.numberOfTracks)];

            for (const tracks of this.tracks) {
                for (let i = 0; i < n; i++) {
                    tracks[i] = [];
                }
            }
        } else {
            this.numberOfTracks = 1;

            this.tracks = [[[]], [[]]];
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
                case '0'   :
                case 'left':
                    if (value === undefined) {
                        return this.gains[0];
                    }

                    v   = parseFloat(value);
                    min = 0;
                    max = 1;

                    if ((v >= min) && (v <= max)) {
                        this.gains[0] = v;
                    }

                    break;
                case '1'    :
                case 'right':
                    if (value === undefined) {
                        return this.gains[1];
                    }

                    v   = parseFloat(value);
                    min = 0;
                    max = 1;

                    if ((v >= min) && (v <= max)) {
                        this.gains[1] = v;
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
        if (this.hasTrack(track)) {
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
                        recordedLs[i] = this.gains[0] * inputLs[i];
                        recordedRs[i] = this.gains[1] * inputRs[i];
                    }

                    this.tracks[0][this.activeTrack].push(recordedLs);
                    this.tracks[1][this.activeTrack].push(recordedRs);
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
     * This method determines whether the designated channel number is valid.
     * @param {number} channel This argument is channel number for validation.
     * @return {boolean} If the designated channel is valid range, this value is `true`. Otherwise, this value is `false`.
     */
    hasChannel(channel) {
        const c = parseInt(channel, 10);

        return (c >= 0) && (c < this.tracks.length);
    }

    /**
     * This method determines whether the designated track number is valid.
     * @param {number} track This argument is track number for validation.
     * @return {boolean} If the designated track is valid range, this value is `true`. Otherwise, this value is `false`.
     */
    hasTrack(track) {
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
     * This method flats recorded sounds in track.
     * @param {number} channel This argument is the channel number for mixing.
     * @param {number} track This argument is track number.
     * @return {Float32Array} This is returned as array for flatten sound.
     */
    flatTrack(channel, track) {
        if (!this.hasChannel(channel) || !this.hasTrack(track)) {
            return null;
        }

        const tracks     = this.tracks[channel][track];
        const bufferSize = this.processor.bufferSize;

        const flattenTrack = new Float32Array(tracks.length * bufferSize);

        for (let i = 0, len = tracks.length; i < len; i++) {
            for (let j = 0; j < bufferSize; j++) {
                flattenTrack[(i * bufferSize) + j] = tracks[i][j];
            }
        }

        return flattenTrack;
    }

    /**
     * This method synthesizes recorded sounds in track.
     * @param {number} channel This argument is the channel number for mixing.
     * @return {Float32Array} This is returned as array for synthesized sound.
     */
    mixTrack(channel) {
        if (!this.hasChannel(channel)) {
            return null;
        }

        const tracks     = this.tracks[channel];
        const bufferSize = this.processor.bufferSize;

        let mixedValues   = null;
        let mixedSum      = 0;
        let mixedElement  = 0;
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

        mixedValues = new Float32Array(numberOfMaxBuffers * bufferSize);

        while (true) {
            for (let currentTrack = 0, len = tracks.length; currentTrack < len; currentTrack++) {
                if (tracks[currentTrack][currentBuffer] instanceof Float32Array) {
                    mixedSum += tracks[currentTrack][currentBuffer][index];
                    mixedElement++;
                }
            }

            if (mixedElement <= 0) {
                return mixedValues;
            }

            const offset = currentBuffer * bufferSize;

            // Average
            mixedValues[offset + index] = mixedSum / mixedElement;

            // Clear
            mixedSum     = 0;
            mixedElement = 0;

            // Next data
            if (index < (bufferSize - 1)) {
                // Next element in Float32Array
                index++;
            } else {
                // Next Float32Array
                currentBuffer++;
                index = 0;
            }
        }
    }

    /**
     * This method clears recorded sound of the designated track.
     * @param {number} track This argument is track for clearing.
     * @return {Recorder} This is returned for method chain.
     */
    clear(track) {
        // on the way of recording ?
        if (this.activeTrack !== -1) {
            this.stop();
        }

        const t = parseInt(track, 10);

        if (t === -1) {
            for (const tracks of this.tracks) {
                for (const track of tracks) {
                    track.length = 0;
                }
            }
        } else {
            if (this.hasTrack(track)) {
                this.tracks[0][track].length = 0;
                this.tracks[1][track].length = 0;
            }
        }

        return this;
    }

    /**
     * This method creates WAVE file as Object URL or Data URL.
     * @param {number} channel This argument is the channel number for mixing.
     * @param {number} numberOfChannels This argument is in order to select stereo or monaural of WAVE file. The default value is 2.
     * @param {number} qbit This argument is quantization bit of PCM. The default value is 16 (bit).
     * @param {string} type This argument is one of 'blob', 'objecturl', 'base64', 'dataurl'.
     * @return {Blob|string} This is returned as `Blob` or Object URL or Base64 or Data URL for WAVE file.
     */
    create(track, numberOfChannels, qbit, type) {
        // on the way of recording ?
        if (this.activeTrack !== -1) {
            this.stop();
        }

        /** @type {Float32Array} */
        let soundLs = null;

        /** @type {Float32Array} */
        let soundRs = null;

        if (track === -1) {
            soundLs = this.mixTrack(0);
            soundRs = this.mixTrack(1);
        } else if (this.hasTrack(track)) {
            soundLs = this.flatTrack(0, track);
            soundRs = this.flatTrack(1, track);
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
                    if (binary > (Math.pow(2, 8) - 1)) { binary = (Math.pow(2, 8) - 1); }
                    if (binary < (Math.pow(2, 0) - 1)) { binary = (Math.pow(2, 0) - 1); }

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
                    if (binary > (+Math.pow(2, 15) - 1)) { binary =  Math.pow(2, 15) - 1; }
                    if (binary < (-Math.pow(2, 15) - 1)) { binary = -Math.pow(2, 15) - 1; }

                    sounds[i] = binary;
                }

                break;
            default:
                break;
        }

        // Create WAVE file (Object URL or Data URL)
        const t = String(type).toLowerCase();

        switch (t) {
            case 'base64' :
            case 'dataurl':
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

                const base64 = window.btoa(wave);

                if (t === 'base64') {
                    return base64;
                }

                return `data:audio/wav;base64,${base64}`;
            case 'blob'     :
            case 'objecturl':
            default         :
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

                const blob = new Blob([new Uint8Array(waves)], { 'type' : 'audio/wav' });

                if (t === 'blob') {
                    return blob;
                }

                return window.URL.createObjectURL(blob);
        }
    }

    /** @override */
    get INPUT() {
        return this.processor;
    }

    /** @override */
    get OUTPUT() {
        return this.processor;
    }

    /** @override */
    toString() {
        return '[SoundModule Recorder]';
    }
}
