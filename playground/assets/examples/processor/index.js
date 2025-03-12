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

X('processor').setup('custom-oscillator');

X('processor')
  .module('analyser')
  .domain('time', 0)
  .setup(document.getElementById('visualizer-svg'))
  .param({ interval: -1, styles })
  .activate();

X('processor')
  .ready('./assets/worklet.js')
  .then(() => {
    document.getElementById('button-start').onclick = () => {
      const audioParamMap = X('processor').map();
      const frequency     = audioParamMap.get('frequency');

      frequency.setValueAtTime(440, X.getCurrentTime());

      X('processor').start();
    };

    document.getElementById('button-stop').onclick = () => {
      X('processor').stop();
    };
  })
  .catch((error) => {
    result.textContent = error.message;
  });

document.getElementById('button-set-parameters').onclick = () => {
  const moduleName = document.getElementById('select-module').value;

  const { state, ...params } = JSON.parse(document.getElementById('textarea-param-json').value);

  if (moduleName === 'default') {
    X('processor').param(params);
  } else if ((moduleName === 'timeoverview') || (moduleName === 'time') || (moduleName === 'fft')) {
    X('processor').module('analyser').domain(moduleName).param(params);
  } else if (moduleName.includes('/')) {
    X('processor').module('preamp').param(params);

    if (state) {
      X('processor').module('preamp').activate();
    } else {
      X('processor').module('preamp').deactivate();
    }
  } else if (X('processor').module(moduleName)) {
    X('processor').module(moduleName).param(params);

    if (state) {
      X('processor').module(moduleName).activate();
    } else {
      X('processor').module(moduleName).deactivate();
    }
  }
};
