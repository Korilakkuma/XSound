const result = document.getElementById('result-text');

const ul = document.createElement('ul');

const convertedTime = convertTime(1212.1212);

Object.keys(convertedTime).forEach((key) => {
  const li = document.createElement('li');

  li.textContent = `${key} ${convertedTime[key]}`;

  ul.append(li);
});

result.appendChild(ul);
