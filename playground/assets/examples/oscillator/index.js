X('oscillator').setup([true, true, false, false]);

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

X('oscillator')
  .module('analyser')
  .domain('time', 0)
  .setup(document.getElementById('visualizer-svg'))
  .param({ interval: -1, styles })
  .activate();

document.getElementById('button-start').onclick = () => {
  X('oscillator').start([440, 880]);
};

document.getElementById('button-stop').onclick = () => {
  X('oscillator').stop();
};

document.getElementById('button-set-parameters').onclick = () => {
  const moduleName = document.getElementById('select-module').value;

  const { state, ...params } = JSON.parse(document.getElementById('textarea-param-json').value);

  if (moduleName === 'default') {
    X('oscillator').param(params);
  } else if ((moduleName === 'timeoverview') || (moduleName === 'time') || (moduleName === 'fft')) {
    X('oscillator').module('analyser').domain(moduleName).param(params);
  } else if (moduleName.includes('/')) {
    X('oscillator').module('preamp').param(params);

    if (state) {
      X('oscillator').module('preamp').activate();
    } else {
      X('oscillator').module('preamp').deactivate();
    }
  } else if (X('oscillator').module(moduleName)) {
    X('oscillator').module(moduleName).param(params);

    if (state) {
      X('oscillator').module(moduleName).activate();
    } else {
      X('oscillator').module(moduleName).deactivate();
    }
  }
};
