'use strict';

/**
 * This private class defines properties for sound session on network.
 * @constructor
 */
export class Session {
    /**
     * @param {AudioContext} context This argument is in order to use the interfaces of Web Audio API.
     * @param {number} bufferSize This argument is buffer size for `ScriptProcessorNode`.
     * @param {number} numberOfInputs This argument is the number of inputs for `ScriptProcessorNode`.
     * @param {number} numberOfOutputs This argument the number of outputs for `ScriptProcessorNode`.
     * @param {Analyser} analyser This argument is the instance of `Analyser`.
     */
    constructor(context, bufferSize, numberOfInputs, numberOfOutputs, analyser) {
        this.isActive = false;

        this.context  = context;
        this.analyser = analyser;  // the instance of `Analyser`

        this.sender   = context.createScriptProcessor(bufferSize, numberOfInputs, numberOfOutputs);
        this.receiver = context.createScriptProcessor(bufferSize, numberOfInputs, numberOfOutputs);

        this.websocket = null;  // for the instance of `WebSocket`
        this.paused    = true;  // for preventing from the duplicate `onaudioprocess` event (`start` method)
    }

    /**
     * This method creates the instance of `WebSocket` and registers event handlers.
     * @param {boolean} tls This argument is in order to select protocol (either `wss` or `ws`).
     * @param {string} host This argument is server's hostname.
     * @param {number} port This argument is port number for connection.
     * @param {string} path This argument is file that is executed in server side.
     * @param {function} openCallback This argument is invoked as `onopen` event handler in the instance of `WebSocket`.
     * @param {function} closeCallback This argument is invoked as `onclose` event handler in the instance of `WebSocket`.
     * @param {function} errorCallback This argument is invoked as `onerror` event handler in the instance of `WebSocket`.
     * @return {Session} This is returned for method chain.
     */
    setup(tls, host, port, path, openCallback, closeCallback, errorCallback) {
        /*
        if (!navigator.onLine) {
            // Clear
            this.isActive = false;
            this.paused   = true;
            this.connect();
            this.websocket = null;

            throw new Error('Now Offline.');
        }
        */

        // The argument is associative array ?
        if (Object.prototype.toString.call(arguments[0]) === '[object Object]') {
            const properties = arguments[0];

            if ('tls' in properties) {
                tls = properties.tls;
            }

            if ('host' in properties) {
                host = properties.host;
            }

            if ('port' in properties) {
                port = properties.port;
            }

            if ('path' in properties) {
                path = properties.path;
            }

            if ('open' in properties) {
                openCallback = properties.open;
            }

            if ('close' in properties) {
                closeCallback = properties.close;
            }

            if ('error' in properties) {
                errorCallback = properties.error;
            }
        }

        const scheme = tls ? 'wss://' : 'ws://';

        if (path.charAt(0) !== '/') {
            path = `/${path}`;
        }

        const p = parseInt(port, 10);

        if (isNaN(p) || (p < 0) || (p > 65535)) {
            return this;
        }

        this.websocket = new WebSocket(`${scheme}${host}:${p}${path}`);
        this.websocket.binaryType = 'arraybuffer';

        this.websocket.onopen = event => {
            if (Object.prototype.toString.call(openCallback) === '[object Function]') {
                openCallback(event);
            }
        };

        this.websocket.onclose = event => {
            this.isActive = false;
            this.paused   = true;

            this.connect();

            if (Object.prototype.toString.call(closeCallback) === '[object Function]') {
                closeCallback(event);
            }
        };

        this.websocket.onerror = event => {
            this.isActive = false;
            this.paused   = true;

            this.connect();

            if (Object.prototype.toString.call(errorCallback) === '[object Function]') {
                errorCallback(event);
            }
        };

        this.websocket.onmessage = event => {
            if (!this.isActive) {
                this.analyser.stop('time');
                this.analyser.stop('fft');

                return;
            }

            if (event.data instanceof ArrayBuffer) {
                const total  = event.data.byteLength / Float32Array.BYTES_PER_ELEMENT;
                const length = Math.floor(total / 2);
                const offset = length * Float32Array.BYTES_PER_ELEMENT;

                const bufferLs = new Float32Array(event.data,      0, length);  // Get Left  channel data
                const bufferRs = new Float32Array(event.data, offset, length);  // Get Right channel data

                // Start drawing sound wave
                this.analyser.start('time');
                this.analyser.start('fft');

                this.receiver.onaudioprocess = event => {
                    const outputLs = event.outputBuffer.getChannelData(0);
                    const outputRs = event.outputBuffer.getChannelData(1);

                    if (bufferLs instanceof Float32Array) {outputLs.set(bufferLs);}
                    if (bufferRs instanceof Float32Array) {outputRs.set(bufferRs);}

                    // bufferLs = null;
                    // bufferRs = null;

                    if (!this.isActive || (this.websocket === null)) {
                        this.analyser.stop('time');
                        this.analyser.stop('fft');
                    }
                };
            }
        };

        return this;
    }

    /**
     * This method connects nodes according to state.
     * @return {Session} This is returned for method chain.
     */
    connect() {
        // Clear connection
        this.receiver.disconnect(0);
        this.sender.disconnect(0);

        this.receiver.onaudioprocess = null;
        this.sender.onaudioprocess   = null;

        if (this.isActive) {
            // ScriptProcessorNode (Input) -> Analyser
            this.receiver.connect(this.analyser.input);

            // ScriptProcessorNode (Input) -> AudioDestinationNode (Output)
            this.receiver.connect(this.context.destination);
        } else {
            this.paused = true;
        }

        return this;
    }

    /**
     * This method sends sound data to server.
     * @return {Session} This is returned for method chain.
     */
    start() {
        if (this.isActive && this.isConnected() && this.paused) {
            this.paused = false;

            const bufferSize = this.sender.bufferSize;

            this.sender.onaudioprocess = event => {
                if (this.isActive && this.isConnected()) {
                    const inputLs = event.inputBuffer.getChannelData(0);
                    const inputRs = event.inputBuffer.getChannelData(1);

                    const buffer = new Float32Array(2 * bufferSize);
                    const offset = parseInt((buffer.length / 2), 10);

                    for (let i = 0; i < bufferSize; i++) {
                        buffer[i]          = inputLs[i];
                        buffer[offset + i] = inputRs[i];
                    }

                    if (this.websocket.bufferedAmount === 0) {
                        this.websocket.send(buffer);
                    }
                }
            };
        }

        return this;
    }

    /**
     * This method closes connection to server and destroys the instance of `WebSocket`.
     * @return {Session} This is returned for method chain.
     */
    close() {
        if (this.websocket instanceof WebSocket) {
            this.isActive = false;
            this.paused   = true;

            this.connect();
            this.websocket.close();

            this.websocket = null;
        }

        return this;
    }

    /**
     * This method determines whether there is the connection to server.
     * @return {boolean} If the connection to server exists, this value is `true`. Otherwise, this value is `false`.
     */
    isConnected() {
        return (this.websocket instanceof WebSocket) && (this.websocket.readyState === WebSocket.OPEN);
    }

    /**
     * This method toggles active state or inactive state.
     * @param {boolean|string} state If this argument is boolean, state is changed the designated.
     *     If this argument is 'toggle', state is changed automatically.
     *     If this argument is omitted, this method is getter.
     * @param {function} stateCallback This argument is invoked when `bufferedAmount` equals to 0.
     * @param {function} waitCallback This argument is invoked until `bufferedAmount` equals to 0.
     * @return {Session} This is returned for method chain.
     */
    state(state, stateCallback, waitCallback) {
        if (state === undefined) {
            return this.isActive;
        }

        if (Object.prototype.toString.call(waitCallback) === '[object Function]') {
            waitCallback();
        }

        const intervalid = window.setInterval(() => {
            if ((this.websocket instanceof WebSocket) && (this.websocket.bufferedAmount !== 0)) {
                return;
            }

            if (String(state).toLowerCase() === 'toggle') {
                this.isActive = !this.isActive;
            } else {
                this.isActive = Boolean(state);
            }

            this.connect();

            if (Object.prototype.toString.call(stateCallback) === '[object Function]') {
                stateCallback();
            }

            window.clearInterval(intervalid);
        }, 10);

        return this;
    }

    /**
     * This method gets the instance of `WebSocket`.
     * @return {WebSocket}
     */
    get() {
        return this.websocket;
    }

    /** @override */
    toString() {
        return '[SoundModule Session]';
    }
}
