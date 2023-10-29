const result = document.getElementById('result-text');

X('noise').setup();

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

const styles = {
  font  : {
    size: '48px'
  },
  width : 4,
  top   : 64,
  bottom: 64,
  left  : 124
};

X('mixer')
  .module('analyser')
  .domain('time', 0)
  .setup(document.querySelector('canvas'))
  .param({ interval: -1, styles })
  .activate();

document.getElementById('button-start').onclick = () => {
  X('audio').start(X('audio').param('currentTime'));
  X('noise').start();
  X('mixer').start([X('audio'), X('noise')], [1, 0.25]);
};

document.getElementById('button-stop').onclick = () => {
  X('audio').stop();
  X('noise').stop();
  X('mixer').stop();
};

document.getElementById('button-set-parameters').onclick = () => {
  const moduleName = document.getElementById('select-module').value;

  const { state, ...params } = JSON.parse(document.getElementById('textarea-param-json').value);

  if (moduleName === 'default') {
    X('mixer').param(params);
  } else if ((moduleName === 'timeoverview') || (moduleName === 'time') || (moduleName === 'fft')) {
    X('mixer').module('analyser').domain(moduleName).param(params);
  } else if (X('mixer').module(moduleName)) {
    X('mixer').module(moduleName).param(params);

    if (state) {
      X('mixer').module(moduleName).activate();
    } else {
      X('mixer').module(moduleName).deactivate();
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
