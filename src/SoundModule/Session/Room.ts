import { Connectable } from '../../interfaces';
import { BufferSize } from '../../types';
import { Analyser } from '../Analyser';
import { NumberOfSessionChannels, SessionParams } from './';

export type RoomMap = {
  [id: string]: WebSocket | null
};

/**
 * This class is entity for room feature in session.
 * @constructor
 */
export class Room implements Connectable {
  // HACK: Fix buffer size on different environments
  private static BUFFER_SIZE = 2048;

  private id: string;
  private context: AudioContext;
  private analyser: Analyser;

  private sender: ScriptProcessorNode;
  private receiver: ScriptProcessorNode;

  private websocket: WebSocket | null = null;

  /**
   * @param {string} id This argument is string that identifies messaging room.
   * @param {AudioContext} context This argument is in order to use interfaces of Web Audio API.
   * @param {BufferSize} bufferSize This argument is buffer size for `ScriptProcessorNode`.
   * @param {NumberOfSessionChannels} numberOfInputs This argument is the number of inputs for `ScriptProcessorNode`.
   * @param {NumberOfSessionChannels} numberOfOutputs This argument the number of outputs for `ScriptProcessorNode`.
   * @param {Analyser} analyser This argument is instance of `Analyser`.
   */
  constructor(id: string, context: AudioContext, bufferSize: BufferSize, numberOfInputs: NumberOfSessionChannels, numberOfOutputs: NumberOfSessionChannels, analyser: Analyser) {
    this.id = id;

    this.context  = context;
    this.analyser = analyser;

    this.sender   = context.createScriptProcessor(Room.BUFFER_SIZE, numberOfInputs, numberOfOutputs);
    this.receiver = context.createScriptProcessor(Room.BUFFER_SIZE, numberOfInputs, numberOfOutputs);
  }

  /**
   * This method creates instance of `WebSocket` and registers event handlers. Namely, join room.
   * @param {SessionParams} params This argument is in order to create instance of `WebSocket`.
   */
  public join(params: SessionParams): void {
    const { tls, host, port, path, openCallback, closeCallback, errorCallback } = params;

    const scheme = tls ? 'wss://' : 'ws://';

    this.websocket = new WebSocket(`${scheme}${host}:${port}${path}`);

    this.websocket.binaryType = 'arraybuffer';

    this.websocket.onopen = (event: Event) => {
      if (this.websocket === null) {
        return;
      }

      this.websocket.send(this.id);

      if (openCallback) {
        openCallback(event);
      }
    };

    this.websocket.onclose = (event: Event) => {
      if (closeCallback) {
        closeCallback(event);
      }
    };

    this.websocket.onerror = (event: Event) => {
      if (errorCallback) {
        errorCallback(event);
      }
    };

    this.websocket.onmessage = (event: MessageEvent) => {
      if (this.websocket === null) {
        return;
      }

      if (!(event.data instanceof ArrayBuffer)) {
        return;
      }

      const total  = event.data.byteLength / Float32Array.BYTES_PER_ELEMENT;
      const length = Math.trunc(total / 2);
      const offset = length * Float32Array.BYTES_PER_ELEMENT;

      const bufferLs = new Float32Array(event.data,      0, length);  // Get Left  channel data
      const bufferRs = new Float32Array(event.data, offset, length);  // Get Right channel data

      this.connect();

      // Start visualizing received sound
      this.analyser.start('time');
      this.analyser.start('fft');

      this.receiver.onaudioprocess = (event: AudioProcessingEvent) => {
        const outputLs = event.outputBuffer.getChannelData(0);
        const outputRs = event.outputBuffer.getChannelData(1);

        outputLs.set(bufferLs);
        outputRs.set(bufferRs);

        if (!this.connected()) {
          this.analyser.stop('time');
          this.analyser.stop('fft');
        }
      };
    };
  }

  /**
   * This method sends sound Room ID and data (as `Float32Array`) to server.
   */
  public send(): void {
    if (this.websocket === null) {
      return;
    }

    const bufferSize = this.sender.bufferSize;

    this.sender.onaudioprocess = (event: AudioProcessingEvent) => {
      if (!this.connected()) {
        return;
      }

      const inputLs = event.inputBuffer.getChannelData(0);
      const inputRs = event.inputBuffer.getChannelData(1);

      const bufferSizeLR = 2 * bufferSize;
      const buffer       = new Float32Array(bufferSizeLR);
      const offset       = Math.trunc(buffer.length / 2);

      for (let i = 0; i < bufferSize; i++) {
        buffer[i]          = inputLs[i];
        buffer[offset + i] = inputRs[i];
      }

      if ((this.websocket !== null) && (this.websocket.bufferedAmount === 0)) {
        this.websocket.send(this.id);
        this.websocket.send(buffer);
      }
    };
  }

  /**
   * This method stops sending and receiving data by disconnecting `AudioNode`.
   * Namely, leave room temporarily.
   */
  public leave(): void {
    if (!this.connected()) {
      return;
    }

    this.sender.disconnect(0);
    this.receiver.disconnect(0);
  }

  /**
   * This method closes connection to WebSocket server and destroys instance of `WebSocket`.
   * Namely, leave room permanently.
   */
  public clear(): void {
    if (this.websocket === null) {
      return;
    }

    this.websocket.send(this.id);
    this.websocket.close();

    this.websocket = null;
  }

  /**
   * This method connects `AudioNode`s for receiving data.
   */
  public connect(): void {
    // ScriptProcessorNode (Input) -> Analyser
    this.receiver.connect(this.analyser.INPUT);

    // ScriptProcessorNode (Input) -> AudioDestinationNode (Output)
    this.receiver.connect(this.context.destination);
  }

  /**
   * This method determines whether there is connection to server.
   * @return {boolean} If connection to server exists, this value is `true`. Otherwise, this value is `false`.
   */
  public connected(): boolean {
    return (this.websocket !== null) && (this.websocket.readyState === WebSocket.OPEN);
  }

  /**
   * This method gets instance of `WebSocket` that corresponds Room ID.
   * @return {RoomMap}
   */
  public get(): RoomMap {
    return { [this.id] : this.websocket };
  }

  /** @override */
  public get INPUT(): ScriptProcessorNode {
    return this.sender;
  }

  /** @override */
  public get OUTPUT(): ScriptProcessorNode {
    return this.sender;
  }

  /** @override */
  public toString(): string {
    return this.id;
  }
}
