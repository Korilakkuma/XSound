const result = document.getElementById('result-text');

const BASE_URL = '.';

const resources = [
  `${BASE_URL}/assets/one-shots/C.wav`,
  `${BASE_URL}/assets/one-shots/D.wav`,
  `${BASE_URL}/assets/one-shots/E.wav`,
  `${BASE_URL}/assets/one-shots/F.wav`,
  `${BASE_URL}/assets/one-shots/G.wav`,
  `${BASE_URL}/assets/one-shots/A.wav`,
  `${BASE_URL}/assets/one-shots/B.wav`
];

const getBufferIndex = (pianoIndex) => {
  switch (Math.trunc((pianoIndex + 9) % 12)) {
    case  0 :
    case  1 :
      return 0;
    case  2 :
    case  3 :
      return 1;
    case  4 :
      return 2;
    case  5 :
    case  6 :
      return 3;
    case  7 :
    case  8 :
      return 4;
    case  9 :
    case 10 :
      return 5;
    case 11 :
      return 6;
    default :
      return -1;
  }
};

const calculateRate = (pianoIndex) => {
  const sharps  = [1, 4, 6, 9, 11, 13, 16, 18, 21, 23, 25, 28, 30, 33, 35, 37, 40, 42, 45, 47, 49, 52, 54, 57, 59, 61, 64, 66, 69, 71, 73, 76, 78, 81, 83, 85];
  const isSharp = sharps.includes(pianoIndex);

  let rate = 0;

  if ((pianoIndex >= 0) && (pianoIndex <= 2)) {
    rate = 0.0625;
  } else if ((pianoIndex >= 3) && (pianoIndex <= 14)) {
    rate = 0.125;
  } else if ((pianoIndex >= 15) && (pianoIndex <= 26)) {
    rate = 0.25;
  } else if ((pianoIndex >= 27) && (pianoIndex <= 38)) {
    rate = 0.5;
  } else if ((pianoIndex >= 39) && (pianoIndex <= 50)) {
    rate = 1;
  } else if ((pianoIndex >= 51) && (pianoIndex <= 62)) {
    rate = 2;
  } else if ((pianoIndex >= 63) && (pianoIndex <= 74)) {
    rate = 4;
  } else if ((pianoIndex >= 75) && (pianoIndex <= 86)) {
    rate = 8;
  } else if ((pianoIndex >= 87) && (pianoIndex <= 98)) {
    rate = 16;
  }

  if (isSharp) {
    rate *= 2 ** (1 / 12);
  }

  return rate;
};

const settings = [];

for (let i = 0; i < 88; i++) {
  const setting = {
    bufferIndex : 0,
    playbackRate: 1,
    loop        : false,
    loopStart   : 0,
    loopEnd     : 0,
    volume      : 1
  };

  setting.bufferIndex  = getBufferIndex(i);
  setting.playbackRate = calculateRate(i);

  settings[i] = setting;
}

const successCallback = () => {
  X('oneshot')
    .module('analyser')
    .domain('time', 0)
    .setup(document.querySelector('canvas'))
    .param({ interval: -1 })
    .activate();

  document.getElementById('button-start').onclick = () => {
    X('oneshot').start([39, 43, 46]);
  };

  document.getElementById('button-stop').onclick = () => {
    X('oneshot').stop([39, 43, 46]);
  };

  document.getElementById('button-set-parameters').onclick = () => {
    const moduleName = document.getElementById('select-module').value;

    const { state, ...params } = JSON.parse(document.getElementById('textarea-param-json').value);

    if (moduleName === 'default') {
      X('oneshot').param(params);
    } else if ((moduleName === 'timeoverview') || (moduleName === 'time') || (moduleName === 'fft')) {
      X('oneshot').module('analyser').domain(moduleName).param(params);
    } else if (X('oneshot').module(moduleName)) {
      X('oneshot').module(moduleName).param(params);

      if (state) {
        X('oneshot').module(moduleName).activate();
      } else {
        X('oneshot').module(moduleName).deactivate();
      }
    }
  };
};

const errorCallback = (event, textStatus) => {
  result.textContent = textStatus;
};

const progressCallback = (event) => {
  result.textContent = `${Math.trunc((event.loaded / event.total) * 100)} %`;
};

X('oneshot').setup({ resources, settings, successCallback, errorCallback, progressCallback });
