const result = document.getElementById('result-text');

const ul = document.createElement('ul');

const base = 40;

const frequencies = toFrequencies([base, base + 4, base + 7, base + 10]);

frequencies.forEach((frequency) => {
  const li = document.createElement('li');

  li.textContent = frequency.toString(10);

  ul.append(li);
});

result.appendChild(ul);
