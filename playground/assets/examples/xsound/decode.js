const result = document.getElementById('result-text');

X.ajax({
  url             : 'https://xsound.jp/playground/assets/audio/sample.mp3',
  type            : 'arraybuffer',
  timeout         : 120000,
  successCallback : (event, arraybuffer) => {
    X.decode(X.get(), arraybuffer, (buffer) => {
      result.innerHTML = `
        <ul>
          <li>sampleRate: ${buffer.sampleRate} Hz</li>
          <li>length: ${buffer.length}</li>
          <li>duration: ${buffer.duration} sec</li>
          <li>number of channles: ${buffer.numberOfChannels}</li>
        </ul>
      `;
    }, (error) => {
      result.textContent = error.message;
    });
  },
  errorCallback   : (event, textStatus) => {
    result.textContent = textStatus;
  },
  progressCallback: (event) => {
    result.textContent = `${event.loaded} bytes (${Math.trunc(event.loaded / 1000)} KB)`;
  }
});
