X('noise').setup();

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

X('noise')
  .module('analyser')
  .domain('time', 0)
  .setup(document.getElementById('visualizer-svg'))
  .param({ interval: -1, styles })
  .activate();

document.getElementById('button-start').onclick = () => {
  X('noise').start();
};

document.getElementById('button-stop').onclick = () => {
  X('noise').stop();
};

document.getElementById('button-set-parameters').onclick = () => {
  const moduleName = document.getElementById('select-module').value;

  const { state, ...params } = JSON.parse(document.getElementById('textarea-param-json').value);

  if (moduleName === 'default') {
    X('noise').param(params);
  } else if ((moduleName === 'timeoverview') || (moduleName === 'time') || (moduleName === 'fft')) {
    X('noise').module('analyser').domain(moduleName).param(params);
  } else if (moduleName.includes('/')) {
    X('noise').module('preamp').param(params);

    if (state) {
      X('noise').module('preamp').activate();
    } else {
      X('noise').module('preamp').deactivate();
    }
  } else if (X('noise').module(moduleName)) {
    X('noise').module(moduleName).param(params);

    if (state) {
      X('noise').module(moduleName).activate();
    } else {
      X('noise').module(moduleName).deactivate();
    }
  }
};
