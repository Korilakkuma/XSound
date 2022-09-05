const result = document.getElementById('result-text');

const ul = document.createElement('ul');

free([X('oscillator'), X('noise'), X('stream')]);

['oscillator', 'oneshot', 'noise', 'audio', 'media', 'stream', 'processor', 'mixer', 'midi', 'mml'].forEach((source) => {
  const li = document.createElement('li');

  li.textContent = `${source}: ${X(source)}`;

  ul.appendChild(li);
});

result.appendChild(ul);
