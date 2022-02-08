const result = document.getElementById('result-text');

X('stream').setup({
  audio: true,
  video: false
});

X('stream')
  .module('analyser')
  .domain('time', 0)
  .setup(document.querySelector('canvas'))
  .activate();

const roomId = 'test-room-id-001';  // Any string

// for `ScriptProcessorNode`
const bufferSize             = 2048;
const numberOfInputChannels  = 2;
const numberOfOutputChannels = 2;

const analyser = X('stream').module('analyser');

// for connecting to WebSocket server
const tls  = true;  // Use `wss:`
const host = 'xsound-websocket-server.herokuapp.com/';
const port = 8000;
const path = '/app';

const openCallback = (event) => {
  result.textContent = event.type;
};

const errorCallback = (event) => {
  result.textContent = event.type;
};

const setupParams = {
  roomId,
  bufferSize,
  numberOfInputChannels,
  numberOfOutputChannels,
  analyser
};

const connectionParams = {
  roomId,
  tls,
  host,
  port,
  path,
  openCallback,
  errorCallback
};

X('stream')
  .module('session')
  .setup(setupParams)
  .ready(connectionParams);

X('stream')
  .ready({
    successCallback: (mediaStream) => {
      result.textContent = mediaStream.id;
    },
    errorCallback: (error) => {
      result.textContent = error.message;
    }
  })
  .then(() => {
    document.getElementById('button-start').onclick = () => {
      X('stream').start();
      X('stream').module('session').start(roomId);
    };

    document.getElementById('button-stop').onclick = () => {
      X('stream').stop();
      X('stream').module('session').stop(roomId);
    };
  });

document.getElementById('button-set-parameters').onclick = () => {
  const moduleName = document.getElementById('select-module').value;

  const { state, ...params } = JSON.parse(document.getElementById('textarea-param-json').value);

  if (moduleName === 'default') {
    X('stream').param(params);
  } else if ((moduleName === 'timeoverview') || (moduleName === 'time') || (moduleName === 'fft')) {
    X('stream').module('analyser').domain(moduleName).param(params);
  } else if (X('stream').module(moduleName)) {
    X('stream').module(moduleName).param(params);

    if (state) {
      X('stream').module(moduleName).activate();
    } else {
      X('stream').module(moduleName).deactivate();
    }
  }
};

