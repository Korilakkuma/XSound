const result = document.getElementById('result-text');

const ul = document.createElement('ul');

[0, 1, 2, 3, 4, 5].forEach((octave) => {
  ['C', 'D', 'G', 'F', 'G', 'A', 'B', 'R'].forEach((pitchChar) => {
    const li = document.createElement('li');

    li.textContent = computeFrequency(computeIndex(octave, pitchChar)).toString(10);

    ul.append(li);
  });
});

result.appendChild(ul);
