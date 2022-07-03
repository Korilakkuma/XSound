const result = document.getElementById('result-text');

X('audio').setup({
  decodeCallback: (audiobuffer) => {
    result.innerHTML = `
      <ul>
        <li>${audiobuffer.sampleRate} Hz</li>
        <li>${audiobuffer.length}</li>
        <li>${audiobuffer.duration} sec</li>
        <li>${audiobuffer.numberOfChannels}</li>
      </u>
    `;
  },
  updateCallback: (source, currentTime) => {
    // do something ...
  },
  endedCallback: (source, currentTime) => {
    result.textContent = currentTime;
  },
  errorCallback: (error) => {
    result.textContent = error.message;
  }
});

X('audio')
  .module('analyser')
  .domain('timeoverview', 0)
  .setup(document.querySelector('canvas'))
  .drag((event, startTime, endTime, mode, direction) => {
    X('audio').param({ currentTime: endTime });
  })
  .activate();

document.getElementById('button-start').onclick = () => {
  X('audio').start(X('audio').param('currentTime'));
};

document.getElementById('button-stop').onclick = () => {
  X('audio').stop();
};

document.getElementById('button-set-parameters').onclick = () => {
  const moduleName = document.getElementById('select-module').value;

  const { state, ...params } = JSON.parse(document.getElementById('textarea-param-json').value);

  if (moduleName === 'default') {
    X('audio').param(params);
  } else if ((moduleName === 'timeoverview') || (moduleName === 'time') || (moduleName === 'fft')) {
    X('audio').module('analyser').domain(moduleName).param(params);
  } else if (X('audio').module(moduleName)) {
    X('audio').module(moduleName).param(params);

    if (state) {
      X('audio').module(moduleName).activate();
    } else {
      X('audio').module(moduleName).deactivate();
    }
  }
};

const uploader = document.querySelector('input[type="file"]');

document.getElementById('button-uploader').onclick = () => {
  uploader.click();
};

uploader.onchange = (event) => {
  const file = X.file({
    event           : event,
    type            : 'arraybuffer',
    successCallback : (event, arraybuffer) => {
      X('audio').ready(arraybuffer);

      result.innerHTML = `
        <ul>
          <li>${file.name}</li>
          <li>${file.type}</li>
          <li>${file.size}</li>
        </ul>
      `;
    },
    errorCalllback  : (event, textStatus) => {
      result.textContent = textStatus;
    },
    progressCallback: (event) => {
      if (event.lengthComputable && (event.total > 0)) {
        result.textContent = `${Math.trunc((event.loaded / event.total) * 100)} %`;
      }
    }
  });

  if (file === null) {
    result.textContent = 'There is not uploaded file';
  }
};
