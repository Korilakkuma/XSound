'use strict';

process.stdout.setEncoding('UTF-8');
process.stderr.setEncoding('UTF-8');

let port = 8000;

if (process.argv.length >= 3) {
    const p = parseInt(process.argv[2], 10);

    if ((p >= 0) || (p <= 65535)) {
        port = p;
    }
}

let log = '';

if (process.argv.length >= 4) {
    log = process.argv[3];
}

const fs = require('fs');

const appendLog = message => {
    if (log === '') {
        return;
    }

    const format = number => {
        return `0${number}`.slice(-2);
    };

    const date = new Date();
    const y    = date.getFullYear();
    const m    = format(date.getMonth() + 1);
    const d    = format(date.getDate());
    const h    = format(date.getHours());
    const i    = format(date.getMinutes());
    const s    = format(date.getSeconds());
    const time = `${y}-${m}-${d} ${h}:${i}:${s}`;

    const record = `${time}\t${String(message)}\n`;

    fs.appendFile(log, record, error => {
        if (error) {
            process.stderr.write(`${error.message}\n`);
        }
    });
};

// Create the instance of WebSocketServer
const WebSocketServer = require('ws').Server;
const http            = require('http');
const httpd           = http.createServer();
const ws              = new WebSocketServer({ 'server' : httpd });

const sockets = [];

ws.on('connection', socket => {
    appendLog('connection');
    socket.send('Connection to server is success !!', { 'binary' : false });

    sockets.push(socket);

    socket.on('message', data => {
        for (let i = 0, len = sockets.length; i < len; i++) {
            if (sockets[i] !== socket) {
                sockets[i].send(data, { 'binary' : true });
            }
        }
    });

    socket.on('close', () => {
        for (let i = 0, len = sockets.length; i < len; i++) {
            if (sockets[i] === socket) {
                appendLog('close');

                sockets[i].removeAllListeners('message');
                sockets[i].removeAllListeners('close');

                sockets.splice(i, 1);

                break;
            }
        }
    });
});

// Start HTTP server and WebSocket server
httpd.listen(port, () => {
    process.stdout.write(`Waiting ... (${port})\n`);
});

// Signal Handler
process.on('SIGINT', () => {
    process.stdout.write(`This process caught signal number 2 (SIGINT). Therefore, (${process.pid}) was terminated.\n`);
    process.exit(0);
});

// Catch Exception
process.on('uncaughtException', error => {
    appendLog(error.message);
    process.stderr.write(`${error.message}\n`);
});
