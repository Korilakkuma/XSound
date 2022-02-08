import { Connectable } from '../../interfaces';
import { BufferSize } from '../../types';
import { Track } from './Track';
import { Channel } from './Channel';

export type RecordType      = 1 | 2;  // Monaural | Stereo
export type ChannelNumber   = -1 | 0 | 1;
export type QuantizationBit = 8 | 16;
export type WaveExportType  = 'base64' | 'dataURL' | 'blob' | 'objectURL';

export type RecorderParams = {
  '0'?: number,
  '1'?: number
};

/**
 * This private class is for multi track recording.
 * @constructor
 */
export class Recorder implements Connectable {
  private processor: ScriptProcessorNode;
  private sampleRate: number;
  private channels: Channel[] = [];
  private activeTrack = -1;  // There is not any active track in case of -1
  private paused = true;  // for preventing from duplicate `onaudioprocess` event (`start` method)

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   * @param {BufferSize} bufferSize This argument is buffer size for `ScriptProcessorNode`.
   * @param {RecordType} numberOfInputs This argument is the number of inputs for `ScriptProcessorNode`.
   * @param {RecordType} numberOfOutputs This argument the number of outputs for `ScriptProcessorNode`.
   */
  constructor(context: AudioContext, bufferSize: BufferSize, numberOfInputs: RecordType, numberOfOutputs: RecordType) {
    this.processor  = context.createScriptProcessor(bufferSize, numberOfInputs, numberOfOutputs);
    this.sampleRate = context.sampleRate;
  }

  /**
   * This method sets the max number of tracks.
   * @param {RecordType} numberOfTracks This argument is the number of channels (not used currently).
   * @param {number} numberOfTracks This argument is the max number of tracks.
   * @return {Recorder} Return value is for method chain.
   */
  public setup(numberOfChannels: RecordType, numberOfTracks: number): Recorder {
    this.channels.push(new Channel('0'));
    this.channels.push(new Channel('1'));

    for (const channel of this.channels) {
      for (let i = 0; i < numberOfTracks; i++) {
        channel.append(new Track(i.toString(10)));
      }
    }

    return this;
  }

  /**
   * This method selects active track.
   * @param {number} trackNumber This argument is in order to select active track.
   *     If there is not designated track number, active track number is -1.
   * @return {Recorder} Return value is for method chain.
   */
  public ready(trackNumber: number): Recorder {
    if (this.hasTrack(trackNumber)) {
      this.activeTrack = trackNumber;
    } else {
      this.activeTrack = -1;
    }

    return this;
  }

  /**
   * This method starts sound recording. If there is not any active track, this method stops `onaudioprocess` event handler.
   * @return {Recorder} Return value is for method chain.
   */
  public start(): Recorder {
    if ((this.activeTrack !== -1) && this.paused) {
      this.paused = false;

      const gainL = this.channels[0].gain();
      const gainR = this.channels[1].gain();

      const trackL = this.channels[0].get(this.activeTrack);
      const trackR = this.channels[1].get(this.activeTrack);

      const bufferSize = this.processor.bufferSize;

      this.processor.onaudioprocess = (event: AudioProcessingEvent) => {
        if (this.activeTrack !== -1) {
          const inputLs = event.inputBuffer.getChannelData(0);
          const inputRs = event.inputBuffer.getChannelData(1);

          const recordedLs = new Float32Array(bufferSize);
          const recordedRs = new Float32Array(bufferSize);

          for (let i = 0; i < bufferSize; i++) {
            recordedLs[i] = gainL * inputLs[i];
            recordedRs[i] = gainR * inputRs[i];
          }

          trackL?.append(recordedLs);
          trackR?.append(recordedRs);
        } else {
          this.processor.disconnect(0);
          this.processor.onaudioprocess = null;
        }
      };
    }

    return this;
  }

  /**
   * This method turns off active track, and stops `onaudioprocess` event handler.
   * @return {Recorder} Return value is for method chain.
   */
  public stop(): Recorder {
    this.activeTrack = -1;  // Flag becomes inactive
    this.paused      = true;

    // Stop `onaudioprocess` event handler
    this.processor.disconnect(0);
    this.processor.onaudioprocess = null;

    return this;
  }

  /**
   * This method gets or sets parameters for recorder.
   * This method is overloaded for type interface and type check.
   * @param {keyof RecorderParams|RecorderParams} params This argument is string if getter. Otherwise, setter.
   * @return {RecorderParams[keyof RecorderParams]|Recorder} Return value is parameter for recorder if getter.
   *     Otherwise, return value is for method chain.
   */
  public param(params: '0' | '1'): number;
  public param(params: RecorderParams): Recorder;
  public param(params: keyof RecorderParams | RecorderParams): RecorderParams[keyof RecorderParams] | RecorderParams | Recorder {
    if (typeof params === 'string') {
      switch (params) {
        case '0':
          if (this.channels[0]) {
            return this.channels[0].gain();
          }

          break;
        case '1':
          if (this.channels[1]) {
            return this.channels[1].gain();
          }

          break;
        default:
          return this;
      }
    }

    for (const [key, value] of Object.entries(params)) {
      switch (key) {
        case '0':
          if (this.channels[0] && (typeof value === 'number')) {
            this.channels[0].gain(value);
          }

          break;
        case '1':
          if (this.channels[1] && (typeof value === 'number')) {
            this.channels[1].gain(value);
          }

          break;
        default:
          break;
      }
    }

    return this;
  }

  /**
   * This method determines whether active track exists.
   * @return {number} Return value is active track number.
   */
  public get(): number {
    return this.activeTrack;
  }

  /**
   * This method clears record track.
   * @param {number} trackNumber This argument is track for clearing. If this argument is -1, target is the all of tracks.
   * @return {Recorder} Return value is for method chain.
   */
  public clear(trackNumber: number): Recorder {
    // on the way of recording ?
    if (this.activeTrack !== -1) {
      this.stop();
    }

    if (trackNumber === -1) {
      for (const channel of this.channels) {
        const tracks = channel.get();

        for (const track of tracks) {
          track.clear();
        }
      }
    } else {
      if (this.hasTrack(trackNumber)) {
        for (const channel of this.channels) {
          const track = channel.get(trackNumber);

          track?.clear();
        }
      }
    }

    return this;
  }

  /**
   * This method creates WAVE file as one of Base64, Data URL, Blob, Object URL.
   * @param {number} trackNumber This argument is track number for mixing. If this argument is -1, target is the all of tracks.
   * @param {RecordType} numberOfChannels This argument is in order to select monaural or stereo.
   * @param {QuantizationBit} qbit This argument is quantization bit for PCM.
   * @param {WaveExportType} type This argument is one of 'base64', 'dataURL', 'blob', 'objectURL'.
   * @return {string|Blob} Return value is one of Base64, Data URL, Blob, Object URL as WAVE file.
   */
  public create(trackNumber: number, numberOfChannels: RecordType, qbit: QuantizationBit, type: WaveExportType): string | Blob {
    // on the way of recording ?
    if (this.activeTrack !== -1) {
      this.stop();
    }

    let soundLs: Float32Array | null = null;
    let soundRs: Float32Array | null = null;

    if ((trackNumber === -1) && this.has(-1, -1)) {
      soundLs = this.mixTrack(0);
      soundRs = this.mixTrack(1);
    } else if (this.has(0, trackNumber) && this.has(1, trackNumber)) {
      soundLs = this.flatTrack(0, trackNumber);
      soundRs = this.flatTrack(1, trackNumber);
    } else {
      // Sound data does not exists
      return '';
    }

    if ((soundLs === null) || (soundRs === null)) {
      return '';
    }

    // PCM parameters
    const RATE    = this.sampleRate;
    const QBIT    = qbit;
    const CHANNEL = numberOfChannels;

    // Parameters for WAVE file
    const SIZE       = (CHANNEL === 1) ? Math.min(soundLs.length, soundRs.length) : (2 * Math.min(soundLs.length, soundRs.length));
    const FMT_CHUNK  = 28;
    const DATA_CHUNK =  8 + (SIZE * (QBIT / 8));
    const CHUNK_SIZE = 36 + (SIZE * (QBIT / 8));
    const RIFF_CHUNK =  8 + (FMT_CHUNK + DATA_CHUNK);
    const BPS        = RATE * CHANNEL * (QBIT / 8);
    const DATA_SIZE  = SIZE * (QBIT / 8);

    let sounds: Uint8Array | Int16Array | null = null;

    switch (QBIT) {
      case 8:
        sounds = new Uint8Array(SIZE);

        for (let i = 0; i < SIZE; i++) {
          // Convert 8 bit unsigned integer (-1 -> 0, 0 -> 128, 1 -> 255)
          let binary = 0;

          if ((i % CHANNEL) === 0) {
            binary = Math.ceil(((soundLs[Math.trunc(i / CHANNEL)] + 1) / 2) * ((2 ** 8) - 1));  // Left channel
          } else {
            binary = Math.ceil(((soundRs[Math.trunc(i / CHANNEL)] + 1) / 2) * ((2 ** 8) - 1));  // Right channel
          }

          // for preventing from clipping
          if (binary > ((2 ** 8) - 1)) { binary = ((2 ** 8) - 1); }
          if (binary < ((2 ** 0) - 1)) { binary = ((2 ** 0) - 1); }

          sounds[i] = binary;
        }

        break;
      case 16:
        sounds = new Int16Array(SIZE);

        for (let i = 0; i < SIZE; i++) {
          // Convert 16 bit integer (-1 -> -32768, 0 -> 0, 1 -> 32767)
          let binary = 0;

          if ((i % CHANNEL) === 0) {
            binary = Math.ceil(soundLs[Math.trunc(i / CHANNEL)] * (2 ** 15));  // Left channel
          } else {
            binary = Math.ceil(soundRs[Math.trunc(i / CHANNEL)] * (2 ** 15));  // Right channel
          }

          // for preventing from clipping
          if (binary > (+(2 ** 15) - 1)) { binary = +(2 ** 15) - 1; }
          if (binary < (-(2 ** 15) - 0)) { binary = -(2 ** 15) - 0; }

          sounds[i] = binary;
        }

        break;
      default:
        break;
    }

    if (sounds === null) {
      return '';
    }

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
          // Byte order is little endian
          wave[(RIFF_CHUNK - DATA_SIZE) + (2 * i) + 0] = ((sounds[i] >> 0) & 0xFF);
          wave[(RIFF_CHUNK - DATA_SIZE) + (2 * i) + 1] = ((sounds[i] >> 8) & 0xFF);
          break;
        default:
          break;
      }
    }

    // Create WAVE file (as one of Base64, Data URL, Blob, Object URL)
    switch (type) {
      case 'base64' :
      case 'dataURL': {
        const base64 = window.btoa(Array.from(wave).map((d: number) => String.fromCodePoint(d)).join(''));

        if (type === 'base64') {
          return base64;
        }

        return `data:audio/wav;base64,${base64}`;
      }

        break;
      case 'blob'     :
      case 'objectURL': {
        const blob = new Blob([wave], { type: 'audio/wav' });

        if (type === 'blob') {
          return blob;
        }

        return window.URL.createObjectURL(blob);
      }

      default:
        return '';
    }
  }

  /**
   * This method determines whether track has recorded data.
   * @param {ChanneNumber} channelNumber This argument is target channel number (if this argument is -1, target is the all of channels).
   * @param {number} trackNumber This argument is target track number (if this argument is -1, target is the all of tracks).
   * @return {boolean} If there is track that has recorded data at least, this method returns `true`. Otherwise this value is `false`.
   */
  public has(channelNumber: ChannelNumber, trackNumber: number): boolean {
    if (!this.hasChannel(channelNumber)) {
      return this.channels.some((channel: Channel) => {
        const tracks = channel.get();

        return tracks.some((track: Track) => track.has());
      });
    }

    const tracks = this.channels[channelNumber].get();

    if (!this.hasTrack(trackNumber)) {
      return tracks.some((track: Track) => track.has());
    }

    const track = this.channels[channelNumber].get(trackNumber);

    return track?.has() ?? false;
  }

  /**
   * This method determines whether designated channel number is valid.
   * @param {ChanneNumber} channelNumber This argument is channel number for validation.
   * @return {boolean} If designated channel is valid, this value is `true`. Otherwise, this value is `false`.
   */
  public hasChannel(channelNumber: ChannelNumber): boolean {
    return (channelNumber >= 0) && (channelNumber < this.channels.length);
  }

  /**
   * This method determines whether designated track number is valid.
   * @param {number} trackNumber This argument is track number for validation.
   * @return {boolean} If designated track is valid, this value is `true`. Otherwise, this value is `false`.
   */
  public hasTrack(trackNumber: number): boolean {
    return (trackNumber >= 0) && this.channels.every((channel: Channel) => trackNumber < channel.length());
  }

  /** @override */
  public get INPUT(): ScriptProcessorNode {
    return this.processor;
  }

  /** @override */
  public get OUTPUT(): ScriptProcessorNode {
    return this.processor;
  }

  /**
   * This method flats recorded sound data (data block of `Float32Array`) that track contains.
   * @param {ChanneNumber} channelNumber This argument is channel number for mixing.
   * @param {number} trackNumber This argument is track number.
   * @return {Float32Array} Return value is instance of `Float32Array` that contains flatten sound data.
   */
  private flatTrack(channelNumber: ChannelNumber, trackNumber: number): Float32Array | null {
    if (!this.hasChannel(channelNumber) || !this.hasTrack(trackNumber)) {
      return null;
    }

    const channel = this.channels[channelNumber];
    const track   = channel.get(trackNumber);

    if (track === null) {
      return null;
    }

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
   * This method synthesizes recorded sound data that plural track contains.
   * @param {ChannelNumber} channelNumber This argument is channel number for mixing.
   * @return {Float32Array} Return value is instance of `Float32Array` that contains synthesized sound data.
   */
  private mixTrack(channelNumber: ChannelNumber): Float32Array | null {
    if (!this.hasChannel(channelNumber)) {
      return null;
    }

    const channel    = this.channels[channelNumber];
    const tracks     = channel.get();
    const bufferSize = this.processor.bufferSize;

    let sum              = 0;
    let numberOfElements = 0;
    let currentBlock     = 0;
    let index            = 0;

    // Calculate sound data size
    let numberOfMaxBlocks = 0;

    // Search the max number of `Float32Array`'s each track
    for (const track of tracks) {
      const dataBlocks = track.get();

      if (numberOfMaxBlocks < dataBlocks.length) {
        numberOfMaxBlocks = dataBlocks.length;
      }
    }

    const mixedValues = new Float32Array(numberOfMaxBlocks * bufferSize);

    while (true) {
      for (let currentTrack = 0, len = tracks.length; currentTrack < len; currentTrack++) {
        const track      = tracks[currentTrack];
        const dataBlocks = track.get();
        const dataBlock  = dataBlocks[currentBlock];

        sum += dataBlock[index];
        numberOfElements++;
      }

      if (numberOfElements <= 0) {
        return mixedValues;
      }

      const offset = currentBlock * bufferSize;

      // Average
      mixedValues[offset + index] = sum / numberOfElements;

      // Clear
      sum              = 0;
      numberOfElements = 0;

      // Next data
      if (index < (bufferSize - 1)) {
        // Next element in `Float32Array`
        index++;
      } else {
        // Next data block of `Float32Array`
        currentBlock++;
        index = 0;
      }
    }
  }
}
