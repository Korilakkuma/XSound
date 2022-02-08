const result = document.getElementById('result-text');

const ul = document.createElement('ul');

['C', 'D', 'G', 'F', 'G', 'A', 'B', 'R', 'P'].forEach((pitchChar) => {
  const li = document.createElement('li');

  li.textContent = X.isPitchChar(pitchChar).toString();

  ul.append(li);
});

result.appendChild(ul);
