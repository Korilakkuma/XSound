'use strcit';

import { Connectable } from '../../interfaces/Connectable';

/**
 * This class is the model for a room feature in session.
 * @constructor
 */
export class Room extends Connectable {
    // HACK: Fix buffer size on different environments
    static BUFFER_SIZE = 2048;

    /**
     * @param {string} id This argument is the string that identifies messaging room.
     * @param {AudioContext} context This argument is in order to use the interfaces of Web Audio API.
     * @param {number} bufferSize This argument is buffer size for `ScriptProcessorNode`.
     * @param {number} numberOfInputs This argument is the number of inputs for `ScriptProcessorNode`.
     * @param {number} numberOfOutputs This argument the number of outputs for `ScriptProcessorNode`.
     * @param {Analyser} analyser This argument is the instance of `Analyser`.
     */
    constructor(id, context, bufferSize, numberOfInputs, numberOfOutputs, analyser) {
        super();

        this.id        = String(id);
        this.websocket = null;  // for the instance of `WebSocket`

        this.context  = context;
        this.analyser = analyser;  // the instance of `Analyser`

        // HACK: Fix buffer size on different environments
        this.sender   = context.createScriptProcessor(Room.BUFFER_SIZE, numberOfInputs, numberOfOutputs);
        this.receiver = context.createScriptProcessor(Room.BUFFER_SIZE, numberOfInputs, numberOfOutputs);
    }

    /**
     * This method creates the instance of `WebSocket` and registers event handlers. Namely, join the room.
     * @param {boolean} tls This argument is in order to select protocol (either `wss` or `ws`).
     * @param {string} host This argument is server's hostname.
     * @param {number} port This argument is port number for connection.
     * @param {string} path This argument is file that is executed in server side.
     * @param {function} openCallback This argument is invoked as `onopen` event handler in the instance of `WebSocket`.
     * @param {function} closeCallback This argument is invoked as `onclose` event handler in the instance of `WebSocket`.
     * @param {function} errorCallback This argument is invoked as `onerror` event handler in the instance of `WebSocket`.
     */
    join(tls, host, port, path, openCallback, closeCallback, errorCallback) {
        const scheme = tls ? 'wss://' : 'ws://';

        if (path.charAt(0) !== '/') {
            path = `/${path}`;
        }

        const p = parseInt(port, 10);

        if (isNaN(p) || (p < 0) || (p > 65535)) {
            return;
        }

        this.websocket = new WebSocket(`${scheme}${host}:${p}${path}`);

        this.websocket.binaryType = 'arraybuffer';

        this.websocket.onopen = event => {
            this.websocket.send(this.id);

            if (Object.prototype.toString.call(openCallback) === '[object Function]') {
                openCallback(event);
            }
        };

        this.websocket.onclose = event => {
            if (Object.prototype.toString.call(closeCallback) === '[object Function]') {
                closeCallback(event);
            }
        };

        this.websocket.onerror = event => {
            if (Object.prototype.toString.call(errorCallback) === '[object Function]') {
                errorCallback(event);
            }
        };

        this.websocket.onmessage = event => {
            if (!(event.data instanceof ArrayBuffer)) {
                return;
            }

            const total  = event.data.byteLength / Float32Array.BYTES_PER_ELEMENT;
            const length = Math.floor(total / 2);
            const offset = length * Float32Array.BYTES_PER_ELEMENT;

            const bufferLs = new Float32Array(event.data,      0, length);  // Get Left  channel data
            const bufferRs = new Float32Array(event.data, offset, length);  // Get Right channel data

            this.connect();

            // Start drawing sound wave
            this.analyser.start('time');
            this.analyser.start('fft');

            this.receiver.onaudioprocess = event => {
                const outputLs = event.outputBuffer.getChannelData(0);
                const outputRs = event.outputBuffer.getChannelData(1);

                if (bufferLs instanceof Float32Array) { outputLs.set(bufferLs); }
                if (bufferRs instanceof Float32Array) { outputRs.set(bufferRs); }

                if (!this.connected()) {
                    this.analyser.stop('time');
                    this.analyser.stop('fft');
                }
            };
        };
    }

    /**
     * This method sends sound data and Room ID as `Float32Array` to server.
     */
    send() {
        const bufferSize = this.sender.bufferSize;

        this.sender.onaudioprocess = event => {
            if (!this.connected()) {
                return;
            }

            const inputLs = event.inputBuffer.getChannelData(0);
            const inputRs = event.inputBuffer.getChannelData(1);

            const bufferSizeLR = 2 * bufferSize;
            const buffer       = new Float32Array(bufferSizeLR);
            const offset       = parseInt((buffer.length / 2), 10);

            for (let i = 0; i < bufferSize; i++) {
                buffer[i]          = inputLs[i];
                buffer[offset + i] = inputRs[i];
            }

            if (this.websocket.bufferedAmount === 0) {
                this.websocket.send(this.id);
                this.websocket.send(buffer);
            }
        };
    }

    /**
     * This method stops sending and receiving data by disconnecting node.
     * Namely, leave the room temporarily.
     */
    leave() {
        if (!this.connected()) {
            return;
        }

        this.sender.disconnect(0);
        this.receiver.disconnect(0);
    }

    /**
     * This method closes connection to WebSocket server and destroys the instance of `WebSocket`.
     * Namely, leave the room permanently.
     */
    destroy() {
        this.websocket.send(this.id);
        this.websocket.close();
        this.websocket = null;
    }

    /**
     * This method connects nodes according to session state.
     */
    connect() {
        // ScriptProcessorNode (Input) -> Analyser
        this.receiver.connect(this.analyser.INPUT);

        // ScriptProcessorNode (Input) -> AudioDestinationNode (Output)
        this.receiver.connect(this.context.destination);
    }

    /**
     * This method determines whether there is the connection to server.
     * @return {boolean} If the connection to server exists, this value is `true`. Otherwise, this value is `false`.
     */
    connected() {
        return (this.websocket instanceof WebSocket) && (this.websocket.readyState === WebSocket.OPEN);
    }

    /**
     * This method gets the instance of `WebSocket` that corresponds Room ID.
     * @return {Object.<string, WebSocket>}
     */
    get() {
        return { [this.id] : this.websocket };
    }

    /** @override */
    get INPUT() {
        return this.sender;
    }

    /** @override */
    get OUTPUT() {
        return this.sender;
    }

    /** @override */
    toString() {
        return this.id;
    }
}
