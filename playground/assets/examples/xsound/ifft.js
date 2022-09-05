const result = document.getElementById('result-text');

const FFT_SIZE = 8;

const reals = new Float32Array(FFT_SIZE);
const imags = new Float32Array(FFT_SIZE);

for (let i = 0; i < FFT_SIZE; i++) {
  reals[i] = Math.sin(i);
  imags[i] = 0;
}

fft(reals, imags, FFT_SIZE);

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

ifft(reals, imags, FFT_SIZE);

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
