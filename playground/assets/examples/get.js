const result = document.getElementById('result-text');

const audiocontext = X.get();

const ul = document.createElement('ul');

for (const key in audiocontext) {
  const li = document.createElement('li');

  li.textContent = `${key}: ${audiocontext[key]}`;

  ul.appendChild(li);
}

result.appendChild(ul);
