const sampleRate = 48000;
const fftSize    = 32768;
const data       = new Float32Array(fftSize);

for (let n = 0; n < fftSize; n++) {
  data[n] = Math.sin((2 * Math.PI * 440 * n) / sampleRate);
}

const phases = X.spectrum(data, 'phase', 'blackman');

X('analyser')
  .domain('offline-phase-spectrum')
  .setup(document.getElementById('visualizer-svg'))
  .param({ scale: 'logarithmic' })
  .start(phases);
