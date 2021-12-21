import { Connectable } from '../../interfaces';
import { BufferSize } from '../../types';
import { Analyser } from '../Analyser';
import { Room } from './Room';

export type NumberOfSessionChannels = 1 | 2;

/**
 * @property {boolean} tls This argument is in order to select protocol (either `wss` or `ws`).
 * @property {string} host This argument is server's hostname.
 * @property {number} port This argument is port number for connection.
 * @property {string} path This argument is script path that is executed in server side.
 * @property {function} openCallback This argument is invoked as `onopen` event handler in instance of `WebSocket`.
 * @property {function} closeCallback This argument is invoked as `onclose` event handler in instance of `WebSocket`.
 * @property {function} errorCallback This argument is invoked as `onerror` event handler in instance of `WebSocket`.
 */
export type SessionParams = {
  tls: boolean,
  host: string,
  port: number,
  path: string,
  openCallback?(event: Event): void,
  closeCallback?(event: Event): void,
  errorCallback?(event: Event): void
};

/**
 * This private class manages sound session rooms.
 * @constructor
 */
export class Session implements Connectable {
  private context: AudioContext;
  private input: GainNode;
  private output: GainNode;
  private rooms: Room[] = [];

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   */
  constructor(context: AudioContext) {
    this.context = context;

    this.input  = context.createGain();
    this.output = context.createGain();
  }

  /**
   * @param {string} roomId This argument is string that identifies messaging room.
   * @param {BufferSize} bufferSize This argument is buffer size for `ScriptProcessorNode`.
   * @param {NumberOfSessionChannels} numberOfInputs This argument is the number of inputs for `ScriptProcessorNode`.
   * @param {NumberOfSessionChannels} numberOfOutputs This argument the number of outputs for `ScriptProcessorNode`.
   * @param {Analyser} analyser This argument is instance of `Analyser`.
   * @return {Session} Return value is for method chain.
   */
  public setup(roomId: string, bufferSize: BufferSize, numberOfInputs: NumberOfSessionChannels, numberOfOutputs: NumberOfSessionChannels, analyser: Analyser): Session {
    this.rooms.push(new Room(roomId, this.context, bufferSize, numberOfInputs, numberOfOutputs, analyser));
    return this;
  }

  /**
   * This method creates instance of `Room`
   * @param {string} roomId This argument is string that identifies messaging room.
   * @param {SessionParams} params This argument is in order to create instance of `WebSocket`.
   * @return {Session} Return value is for method chain.
   */
  public ready(roomId: string, params: SessionParams): Session {
    const room = this.get(roomId);

    if (room === null) {
      return this;
    }

    room.join(params);

    return this;
  }

  /**
   * This method sends sound data to server.
   * @param {string} roomId This argument is string that identifies messaging room.
   * @return {Session} Return value is for method chain.
   */
  public start(roomId: string): Session {
    const room = this.get(roomId);

    if (room === null) {
      return this;
    }

    this.connect(roomId);

    room.send();

    return this;
  }

  /**
   * This method stops sending and receiving data.
   * @param {string} roomId This argument is string that identifies messaging room.
   * @return {Session} Return value is for method chain.
   */
  public stop(roomId: string): Session {
    const room = this.get(roomId);

    if (room === null) {
      return this;
    }

    room.leave();

    return this;
  }

  /**
   * This method closes connection to WebSocket server and destroys instance of `WebSocket`.
   * @param {string} roomId This argument is string that identifies messaging room.
   * @return {Session} Return value is for method chain.
   */
  public destroy(roomId: string): Session {
    const room = this.get(roomId);

    if (room === null) {
      return this;
    }

    room.destroy();

    return this;
  }

  /**
   * This method connects `AudioNode`s.
   * @param {string} roomId This argument is string that identifies messaging room.
   * @return {Session} Return value is for method chain.
   */
  public connect(roomId: string): Session {
    const room = this.get(roomId);

    if (room === null) {
      return this;
    }

    this.input.connect(room.INPUT);
    room.OUTPUT.connect(this.output);

    return this;
  }

  /**
   * This method determines whether there is connection to server.
   * @param {string} roomId This argument is string that identifies messaging room.
   * @return {boolean}
   */
  public connected(roomId: string): boolean {
    const room = this.get(roomId);

    if (room === null) {
      return false;
    }

    return room.connected();
  }

  /**
   * This method gets instance of `Room` that is designated Room ID.
   * @param {string} roomId This argument is string that identifies room.
   * @return {Room}
   */
  public get(roomId: string): Room | null {
    return this.rooms.find(room => room.toString() === roomId) || null;
  }

  /** @override */
  public get INPUT(): GainNode {
    return this.input;
  }

  /** @override */
  public get OUTPUT(): GainNode {
    return this.output;
  }

  /** @override */
  public toString(): string {
    return '[SoundModule Session]';
  }
}
