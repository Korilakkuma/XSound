const result = document.getElementById('result-text');

const ul = document.createElement('ul');

const playbackRates = [0.25, 0.5, 1, 1.5, 2];
const detunes       = [-1200, -600, -100, 0, 100, 600, 1200];

playbackRates.forEach((playbackRate) => {
  detunes.forEach((detune) => {
    const li = document.createElement('li');

    li.textContent = X.computePlaybackRate(playbackRate, detune).toString(10);

    ul.append(li);
  });
});

result.appendChild(ul);
