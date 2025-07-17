const result = document.getElementById('result-text');

const name = 'microphone';

X.permission(name)
  .then((permissionStatus) => {
    result.textContent =`name: ${permissionStatus.name}\nstate: ${permissionStatus.state}`;
  })
  .catch((error) => {
    result.textContent = error.message;
  });
