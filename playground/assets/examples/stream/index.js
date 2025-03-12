const result = document.getElementById('result-text');

const styles = {
  font  : {
    famliy: 'Roboto',
    size  : '12px'
  },
  width : 1,
  top   : 16,
  bottom: 16,
  left  : 28
};

X('stream').setup({
  audio: true,
  video: false
});

X('stream')
  .module('analyser')
  .domain('time', 0)
  .setup(document.getElementById('visualizer-svg'))
  .param({ styles })
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
