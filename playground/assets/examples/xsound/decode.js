const result = document.getElementById('result-text');

X.ajax({
  url             : 'https://xsound.jp/playground/assets/audio/sample.mp3',
  type            : 'arraybuffer',
  timeout         : 120000,
  successCallback : (event, arraybuffer) => {
    X.decode(X.get(), arraybuffer, (buffer) => {
      result.textContent = `sampling rate ${buffer.sampleRate} Hz\n${buffer.length} samples\n${buffer.duration} sec\n${buffer.numberOfChannels} channels\n`;
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
