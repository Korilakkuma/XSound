const result = document.getElementById('result-text');

X.ajax({
  url             : 'https://xsound.jp/playground.assets/audio/sample.mp3',
  type            : 'arraybuffer',
  timeout         : 120000,
  successCallback : (event, arraybuffer) => {
    result.textContent = `${arraybuffer.byteLength} bytes (${Math.trunc(arraybuffer.byteLength / 1000)} KB)`;
  },
  errorCallback   : (event, textStatus) => {
    result.textContent = textStatus;
  },
  progressCallback: (event) => {
    result.textContent = `${event.loaded} bytes (${Math.trunc(event.loaded / 1000)} KB)`;
  }
});
