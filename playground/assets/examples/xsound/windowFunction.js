const result = document.getElementById('result-text');

const FFT_SIZE = 8;

const reals = new Float32Array(FFT_SIZE);
const imags = new Float32Array(FFT_SIZE);

const hanningWindow = X.windowFunction(FFT_SIZE, 'hanning');

for (let i = 0; i < FFT_SIZE; i++) {
  reals[i] = hanningWindow[i] * Math.sin(i);
  imags[i] = 0;
}

X.fft(reals, imags, FFT_SIZE);

const ul = document.createElement('ul');

reals.forEach((real) => {
  const li = document.createElement('li');

  li.textContent = `real: ${real.toString(10)}`;

  ul.append(li);
});

imags.forEach((imag) => {
  const li = document.createElement('li');

  li.textContent = `imag: ${imag.toString(10)}`;

  ul.append(li);
});

result.appendChild(ul);
