'use strict';

import { Connectable } from '../../interfaces/Connectable';
import { Room } from './Room';

/**
 * This private class defines properties for sound session on network.
 * @constructor
 */
export class Session extends Connectable {
    /**
     * @param {AudioContext} context This argument is in order to use the interfaces of Web Audio API.
     */
    constructor(context) {
        super();

        this.context = context;

        this.input  = context.createGain();
        this.output = context.createGain();

        /** @type Array.<Room> */
        this.rooms = [];
    }

    /**
     * @param {string} roomId This argument is the string that identifies messaging room.
     * @param {number} bufferSize This argument is buffer size for `ScriptProcessorNode`.
     * @param {number} numberOfInputs This argument is the number of inputs for `ScriptProcessorNode`.
     * @param {number} numberOfOutputs This argument the number of outputs for `ScriptProcessorNode`.
     * @param {Analyser} analyser This argument is the instance of `Analyser`.
     */
    setup(roomId, bufferSize, numberOfInputs, numberOfOutputs, analyser) {
        this.rooms.push(new Room(roomId, this.context, bufferSize, numberOfInputs, numberOfOutputs, analyser));

        return this;
    }

    /**
     * This method creates the instance of `Room`
     * @param {boolean} tls This argument is in order to select protocol (either `wss` or `ws`).
     * @param {string} host This argument is server's hostname.
     * @param {number} port This argument is port number for connection.
     * @param {string} path This argument is file that is executed in server side.
     * @param {function} openCallback This argument is invoked as `onopen` event handler in the instance of `WebSocket`.
     * @param {function} closeCallback This argument is invoked as `onclose` event handler in the instance of `WebSocket`.
     * @param {function} errorCallback This argument is invoked as `onerror` event handler in the instance of `WebSocket`.
     * @return {Session} This is returned for method chain.
     */
    ready(roomId, tls, host, port, path, openCallback, closeCallback, errorCallback) {
        // The argument is associative array ?
        if (Object.prototype.toString.call(arguments[0]) === '[object Object]') {
            const {
                roomId,
                tls,
                host,
                port,
                path,
                openCallback,
                closeCallback,
                errorCallback
            } = arguments[0];

            const room = this.get(roomId);

            if (room === null) {
                return this;
            }

            room.join(tls, host, port, path, openCallback, closeCallback, errorCallback);
        } else {
            const room = this.get(roomId);

            if (room === null) {
                return this;
            }

            room.join(tls, host, port, path, openCallback, closeCallback, errorCallback);
        }

        return this;
    }

    /**
     * This method sends sound data to server.
     * @param {string} roomId This argument is the string that identifies messaging room.
     * @return {Session} This is returned for method chain.
     */
    start(roomId) {
        const room = this.get(roomId);

        if (room === null) {
            return this;
        }

        this.connect(roomId);

        room.send();

        return this;
    }

    /**
     * This method closes connection to server and destroys the instance of `WebSocket`.
     * @param {string} roomId This argument is the string that identifies messaging room.
     * @return {Session} This is returned for method chain.
     */
    stop(roomId) {
        const room = this.get(roomId);

        if (room === null) {
            return this;
        }

        room.leave();

        return this;
    }

    /**
     * This method connects nodes.
     * @param {string} roomId This argument is the string that identifies messaging room.
     * @return {Session} This is returned for method chain.
     */
    connect(roomId) {
        const room = this.get(roomId);

        if (room === null) {
            return this;
        }

        this.input.connect(room.INPUT);
        room.OUTPUT.connect(this.output);

        return this;
    }

    /**
     *
     * @param {string} roomId This argument is the string that identifies messaging room.
     * @return {boolean}
     */
    connected(roomId) {
        const room = this.get(roomId);

        if (room === null) {
            return this;
        }

        return room.connected();
    }

    /**
     * This method gets the instance of `Room` that is designated Room ID.
     * @param {string} roomId This argument is the string that identifies messaging room.
     * @return {Room}
     */
    get(roomId) {
        return this.rooms.find(room => room.toString() === roomId) || null;
    }

    /** @override */
    get INPUT() {
        return this.input;
    }

    /** @override */
    get OUTPUT() {
        return this.output;
    }

    /** @override */
    toString() {
        return '[SoundModule Session]';
    }
}
