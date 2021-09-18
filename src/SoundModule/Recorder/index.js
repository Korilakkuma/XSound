'use strict';

import { Connectable } from '../../interfaces/Connectable';
import { Track } from './Track';
import { Channel } from './Channel';

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

        this.channels = [new Channel(0), new Channel(1)];  /** @type {Array.<Channel>} */

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
            for (let i = 0; i < n; i++) {
                this.channels[0].append(new Track(i));
                this.channels[1].append(new Track(i));
            }
        } else {
            this.channels[0].append(new Track(0));
            this.channels[1].append(new Track(0));
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

            switch (k) {
                case '0'   :
                case 'left':
                    if (value === undefined) {
                        return this.channels[0].gain();
                    }

                    this.channels[0].gain(value);
                    break;
                case '1'    :
                case 'right':
                    if (value === undefined) {
                        return this.channels[1].gain();
                    }

                    this.channels[1].gain(value);
                    break;
                default:
                    break;
            }
        }

        return this;
    }

    /**
     * This method selects active track.
     * @param {number} trackNumber This argument is in order to select active track.
     * @return {Recorder} This is returned for method chain.
     */
    ready(trackNumber) {
        if (this.hasTrack(trackNumber)) {
            this.activeTrack = trackNumber;
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

            const gainL = this.channels[0].gain();
            const gainR = this.channels[1].gain();

            const trackL = this.channels[0].get(this.activeTrack);
            const trackR = this.channels[1].get(this.activeTrack);

            const bufferSize = this.processor.bufferSize;

            this.processor.onaudioprocess = event => {
                if (this.activeTrack !== -1) {
                    const inputLs = event.inputBuffer.getChannelData(0);
                    const inputRs = event.inputBuffer.getChannelData(1);

                    const recordedLs = new Float32Array(bufferSize);
                    const recordedRs = new Float32Array(bufferSize);

                    for (let i = 0; i < bufferSize; i++) {
                        recordedLs[i] = gainL * inputLs[i];
                        recordedRs[i] = gainR * inputRs[i];
                    }

                    trackL.append(recordedLs);
                    trackR.append(recordedRs);
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
     * @param {number} channelNumber This argument is channel number for validation.
     * @return {boolean} If the designated channel is valid range, this value is `true`. Otherwise, this value is `false`.
     */
    hasChannel(channelNumber) {
        const c = parseInt(channelNumber, 10);

        return (c >= 0) && (c < this.channels.length);
    }

    /**
     * This method determines whether the designated track number is valid.
     * @param {number} trackNumber This argument is track number for validation.
     * @return {boolean} If the designated track is valid range, this value is `true`. Otherwise, this value is `false`.
     */
    hasTrack(trackNumber) {
        const t = parseInt(trackNumber, 10);

        return (t >= 0) && this.channels.every(channel => t < channel.length());
    }

    /**
     * This method detects track that has a recorded data.
     * @param {number} channelNumber This argument is the target channel number.
     * @param {number} trackNumber This argument is the target track number.
     * @return {boolean} If there is the track that has a recorded data at least, this method returns true. Otherwise this value is `false`.
     */
    has(channelNumber, trackNumber) {
        if (!this.hasChannel(channelNumber)) {
            return this.channels.some(channel => {
                const tracks = channel.get();

                return tracks.some(track => track.has());
            });
        }

        const c = parseInt(channelNumber, 10);

        const tracks = this.channels[c].get();

        if (!this.hasTrack(trackNumber)) {
            return tracks.some(track => track.has());
        }

        const t = parseInt(trackNumber, 10);

        return tracks[t].has();
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
     * @param {number} channelNumber This argument is the channel number for mixing.
     * @param {number} trackNumber This argument is track number.
     * @return {Float32Array} This is returned as array for flatten sound.
     */
    flatTrack(channelNumber, trackNumber) {
        if (!this.hasChannel(channelNumber) || !this.hasTrack(trackNumber)) {
            return null;
        }

        const channel    = this.channels[channelNumber];
        const track      = channel.get(trackNumber);
        const dataBlocks = track.get();
        const bufferSize = this.processor.bufferSize;

        const flattenTrack = new Float32Array(dataBlocks.length * bufferSize);

        for (let i = 0, len = dataBlocks.length; i < len; i++) {
            const dataBlock = dataBlocks[i];

            for (let j = 0; j < bufferSize; j++) {
                flattenTrack[(i * bufferSize) + j] = dataBlock[j];
            }
        }

        return flattenTrack;
    }

    /**
     * This method synthesizes recorded sounds in track.
     * @param {number} channelNumber This argument is the channel number for mixing.
     * @return {Float32Array} This is returned as array for synthesized sound.
     */
    mixTrack(channelNumber) {
        if (!this.hasChannel(channelNumber)) {
            return null;
        }

        const channel    = this.channels[channelNumber];
        const tracks     = channel.get();
        const bufferSize = this.processor.bufferSize;

        let mixedValues  = null;
        let mixedSum     = 0;
        let mixedElement = 0;
        let currentBlock = 0;
        let index        = 0;

        // Calculate sound data size
        let numberOfMaxBlocks = 0;

        // Search the max number of `Float32Array`'s each track
        for (const track of tracks) {
            const dataBlocks = track.get();

            if (numberOfMaxBlocks < dataBlocks.length) {
                numberOfMaxBlocks = dataBlocks.length;
            }
        }

        mixedValues = new Float32Array(numberOfMaxBlocks * bufferSize);

        while (true) {
            for (let currentTrack = 0, len = tracks.length; currentTrack < len; currentTrack++) {
                const track      = tracks[currentTrack];
                const dataBlocks = track.get();
                const dataBlock  = dataBlocks[currentBlock];

                if (dataBlock instanceof Float32Array) {
                    mixedSum += dataBlock[index];
                    mixedElement++;
                }
            }

            if (mixedElement <= 0) {
                return mixedValues;
            }

            const offset = currentBlock * bufferSize;

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
                currentBlock++;
                index = 0;
            }
        }
    }

    /**
     * This method clears recorded sound of the designated track.
     * @param {number} trackNumber This argument is track for clearing.
     * @return {Recorder} This is returned for method chain.
     */
    clear(trackNumber) {
        // on the way of recording ?
        if (this.activeTrack !== -1) {
            this.stop();
        }

        const t = parseInt(trackNumber, 10);

        if (t === -1) {
            for (const channel of this.channels) {
                const tracks = channel.get();

                for (const track of tracks) {
                    track.clear();
                }
            }
        } else {
            if (this.hasTrack(t)) {
                for (const channel of this.channels) {
                    const track = channel.get(t);

                    track.clear();
                }
            }
        }

        return this;
    }

    /**
     * This method creates WAVE file as Object URL or Data URL.
     * @param {number} trackNumber This argument is the track number for mixing.
     * @param {number} numberOfChannels This argument is in order to select stereo or monaural of WAVE file. The default value is 2.
     * @param {number} qbit This argument is quantization bit of PCM. The default value is 16 (bit).
     * @param {string} type This argument is one of 'blob', 'objecturl', 'base64', 'dataurl'.
     * @return {Blob|string} This is returned as `Blob` or Object URL or Base64 or Data URL for WAVE file.
     */
    create(trackNumber, numberOfChannels, qbit, type) {
        // on the way of recording ?
        if (this.activeTrack !== -1) {
            this.stop();
        }

        /** @type {Float32Array} */
        let soundLs = null;

        /** @type {Float32Array} */
        let soundRs = null;

        if ((trackNumber === -1) && this.has()) {
            soundLs = this.mixTrack(0);
            soundRs = this.mixTrack(1);
        } else if (this.has(0, trackNumber) && this.has(1, trackNumber)) {
            soundLs = this.flatTrack(0, trackNumber);
            soundRs = this.flatTrack(1, trackNumber);
        } else {
            // Sound data does not exists
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
                    if (binary > (+Math.pow(2, 15) - 1)) { binary = +Math.pow(2, 15) - 1; }
                    if (binary < (-Math.pow(2, 15) - 0)) { binary = -Math.pow(2, 15) - 0; }

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
                let waveString = '';

                waveString += 'RIFF';
                waveString += String.fromCodePoint(((CHUNK_SIZE >> 0) & 0xFF), ((CHUNK_SIZE >> 8) & 0xFF), ((CHUNK_SIZE >> 16) & 0xFF), ((CHUNK_SIZE >> 24) & 0xFF));
                waveString += 'WAVE';

                // fmt chunk
                waveString += `fmt ${String.fromCodePoint(16, 0, 0, 0)}`;
                waveString += String.fromCodePoint(1, 0);

                // fmt chunk -> Channels (Monaural or Stereo)
                waveString += String.fromCodePoint(CHANNEL, 0);

                // fmt chunk -> Sample rate
                waveString += String.fromCodePoint(((RATE >> 0) & 0xFF), ((RATE >> 8) & 0xFF), ((RATE >> 16) & 0xFF), ((RATE >> 24) & 0xFF));

                // fmt chunk -> Byte per second
                waveString += String.fromCodePoint(((BPS >> 0) & 0xFF), ((BPS >> 8) & 0xFF), ((BPS >> 16) & 0xFF), ((BPS >> 24) & 0xFF));

                // fmt chunk -> Block size
                waveString += String.fromCodePoint((CHANNEL * (QBIT / 8)), 0);

                // fmt chunk -> Byte per Sample
                waveString += String.fromCodePoint(QBIT, 0);

                // data chunk
                waveString += 'data';
                waveString += String.fromCodePoint(((DATA_SIZE >> 0) & 0xFF), ((DATA_SIZE >> 8) & 0xFF), ((DATA_SIZE >> 16) & 0xFF), ((DATA_SIZE >> 24) & 0xFF));

                for (let i = 0; i < SIZE; i++) {
                    switch (QBIT) {
                        case  8:
                            waveString += String.fromCodePoint(sounds[i]);
                            break;
                        case 16:
                            // The byte order in WAVE file is little endian
                            waveString += String.fromCodePoint(((sounds[i] >> 0) & 0xFF), ((sounds[i] >> 8) & 0xFF));
                            break;
                        default:
                            break;
                    }
                }

                const base64 = window.btoa(waveString);

                if (t === 'base64') {
                    return base64;
                }

                return `data:audio/wav;base64,${base64}`;
            case 'blob'     :
            case 'objecturl':
            default         :
                const wave = new Uint8Array(44 + DATA_SIZE);

                wave[0] = 0x52;  // 'R'
                wave[1] = 0x49;  // 'I'
                wave[2] = 0x46;  // 'F'
                wave[3] = 0x46;  // 'F'

                wave[4] = (CHUNK_SIZE >>  0) & 0xFF;
                wave[5] = (CHUNK_SIZE >>  8) & 0xFF;
                wave[6] = (CHUNK_SIZE >> 16) & 0xFF;
                wave[7] = (CHUNK_SIZE >> 24) & 0xFF;

                wave[8]  = 0x57;  // 'W'
                wave[9]  = 0x41;  // 'A'
                wave[10] = 0x56;  // 'V'
                wave[11] = 0x45;  // 'E'

                // fmt chunk
                wave[12] = 0x66;  // 'f'
                wave[13] = 0x6D;  // 'm'
                wave[14] = 0x74;  // 't'
                wave[15] = 0x20;  // ' '

                wave[16] = 16;
                wave[17] =  0;
                wave[18] =  0;
                wave[19] =  0;

                wave[20] = 1;
                wave[21] = 0;

                // fmt chunk -> Channels (Monaural or Stereo)
                wave[22] = CHANNEL;
                wave[23] = 0;

                // fmt chunk -> Sample rate
                wave[24] = (RATE >>  0) & 0xFF;
                wave[25] = (RATE >>  8) & 0xFF;
                wave[26] = (RATE >> 16) & 0xFF;
                wave[27] = (RATE >> 24) & 0xFF;

                // fmt chunk -> Byte per second
                wave[28] = (BPS >>  0) & 0xFF;
                wave[29] = (BPS >>  8) & 0xFF;
                wave[30] = (BPS >> 16) & 0xFF;
                wave[31] = (BPS >> 24) & 0xFF;

                // fmt chunk -> Block size
                wave[32] = CHANNEL * (QBIT / 8);
                wave[33] = 0;

                // fmt chunk -> Byte per Sample
                wave[34] = QBIT;
                wave[35] = 0;

                // data chunk
                wave[36] = 0x64;  // 'd'
                wave[37] = 0x61;  // 'a'
                wave[38] = 0x74;  // 't
                wave[39] = 0x61;  // 'a'

                wave[40] = (DATA_SIZE >>  0) & 0xFF;
                wave[41] = (DATA_SIZE >>  8) & 0xFF;
                wave[42] = (DATA_SIZE >> 16) & 0xFF;
                wave[43] = (DATA_SIZE >> 24) & 0xFF;

                for (let i = 0; i < SIZE; i++) {
                    switch (QBIT) {
                        case  8:
                            wave[(RIFF_CHUNK - DATA_SIZE) + i] = sounds[i];
                            break;
                        case 16:
                            // The byte order in WAVE file is little endian
                            wave[(RIFF_CHUNK - DATA_SIZE) + (2 * i) + 0] = ((sounds[i] >> 0) & 0xFF);
                            wave[(RIFF_CHUNK - DATA_SIZE) + (2 * i) + 1] = ((sounds[i] >> 8) & 0xFF);
                            break;
                        default:
                            break;
                    }
                }

                const blob = new Blob([wave], { 'type' : 'audio/wav' });

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
