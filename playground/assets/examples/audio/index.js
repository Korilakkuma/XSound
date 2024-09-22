const result = document.getElementById('result-text');

X('audio').setup({
  decodeCallback: (audiobuffer) => {
    result.textContent = `sampling rate ${audiobuffer.sampleRate} Hz\n${audiobuffer.length} samples\n${audiobuffer.duration} sec\n${audiobuffer.numberOfChannels} channels\n`;
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

const styles = {
  font  : {
    size: '48px'
  },
  width : 4,
  top   : 64,
  bottom: 64,
  left  : 124
};

X('audio')
  .module('analyser')
  .domain('timeoverview', 0)
  .setup(document.querySelector('canvas'))
  .param({ styles })
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
  } else if (moduleName.includes('/')) {
    X('audio').module('preamp').param(params);

    if (state) {
      X('audio').module('preamp').activate();
    } else {
      X('audio').module('preamp').deactivate();
    }
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

      result.textContent = `filename ${file.name}\nMIME ${file.type}\n${file.size} bytes\n`;
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
