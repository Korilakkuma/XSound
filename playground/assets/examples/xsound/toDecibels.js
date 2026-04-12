const sampleRate = 48000;
const fftSize    = 32768;
const data       = new Float32Array(fftSize);

for (let n = 0; n < fftSize; n++) {
  data[n] = Math.sin((2 * Math.PI * 440 * n) / sampleRate);
}

const amplitudes = X.toDecibels(X.spectrum(data, 'amplitude', 'blackman'));

X('analyser')
  .domain('offline-amplitude-spectrum')
  .setup(document.getElementById('visualizer-svg'))
  .param({ scale: 'logarithmic', unit: 'decibel' })
  .start(amplitudes);
