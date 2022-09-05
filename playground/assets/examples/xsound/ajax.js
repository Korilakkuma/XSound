const result = document.getElementById('result-text');

ajax({
  url             : 'https://weblike-curtaincall.ssl-lolipop.jp/assets/mp3/forever-love-piano-instruments.mp3',
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
