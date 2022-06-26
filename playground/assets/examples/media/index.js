const result = document.getElementById('result-text');

const audioElement = document.createElement('audio');

document.body.appendChild(audioElement);

X('media').setup({
  media    : audioElement,
  autoplay : false,
  formats  : [],
  listeners: {
    loadedmetadata: () => {
      result.textContent = `${audioElement.duration} sec`;
    },
    timeupdate: () => {
      result.textContent = `${audioElement.currentTime} / ${audioElement.duration} sec`;
    },
    error: () => {
      result.textContent = `code: ${audioElement.error.code}, message: ${audioElement.error.message}`;
    }
  }
});

X('media')
  .module('analyser')
  .domain('time', 0)
  .setup(document.querySelector('canvas'))
  .param({ interval: -1 })
  .activate();

document.getElementById('button-start').onclick = () => {
  X('media').start(X('media').param('currentTime'));
};

document.getElementById('button-stop').onclick = () => {
  X('media').stop();
};

document.getElementById('button-set-parameters').onclick = () => {
  const moduleName = document.getElementById('select-module').value;

  const { state, ...params } = JSON.parse(document.getElementById('textarea-param-json').value);

  if (moduleName === 'default') {
    X('media').param(params);
  } else if ((moduleName === 'timeoverview') || (moduleName === 'time') || (moduleName === 'fft')) {
    X('media').module('analyser').domain(moduleName).param(params);
  } else if (X('media').module(moduleName)) {
    X('media').module(moduleName).param(params);

    if (state) {
      X('media').module(moduleName).activate();
    } else {
      X('media').module(moduleName).deactivate();
    }
  }
};

const uploader = document.querySelector('input[type="file"]');

document.getElementById('button-uploader').onclick = () => {
  uploader.click();
};

uploader.onchange = (event) => {
  const objectURL = X.file({ event, type: 'objectURL' });

  if (objectURL instanceof Error) {
    result.textContent = objectURL.message;
  } else {
    X('media').ready(objectURL);
  }
};
