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
    };

    document.getElementById('button-stop').onclick = () => {
      X('stream').stop();
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
