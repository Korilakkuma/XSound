const result = document.getElementById('result-text');

const ul = document.createElement('ul');

const frequencies = [27.5, 440];
const detunes     = [-1200, -600, -100, 0, 100, 600, 1200];

frequencies.forEach((frequency) => {
  detunes.forEach((detune) => {
    const li = document.createElement('li');

    li.textContent = X.computeHz(frequency, detune).toString(10);

    ul.append(li);
  });
});

result.appendChild(ul);
