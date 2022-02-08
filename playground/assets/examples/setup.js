const result = document.getElementById('result-text');

const audiocontext = X.get();

X.setup()
  .then(() => {
    result.textContent = audiocontext.state;
  })
  .catch(() => {
    result.textContent = audiocontext.state;
  });

const setup = () => {
  X.setup()
    .then(() => {
      result.textContent = audiocontext.state;
    })
    .catch(() => {
      result.textContent = audiocontext.state;
    });

  document.removeEventListener('click', setup);
};

document.addEventListener('click', setup);
