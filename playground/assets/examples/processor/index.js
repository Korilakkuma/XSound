const result = document.getElementById('result-text');

X('processor').setup('custom-oscillator');

X('processor')
  .module('analyser')
  .domain('time', 0)
  .setup(document.querySelector('canvas'))
  .param({ interval: -1 })
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
  } else {
    X('processor').module(moduleName).param(params);

    if (typeof state === 'boolean') {
      if (state) {
        X('processor').module(moduleName).activate();
      } else {
        X('processor').module(moduleName).deactivate();
      }
    }
  }
};
