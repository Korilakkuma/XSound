const result = document.getElementById('result-text');

const audiocontext = get();

setup()
  .then(() => {
    result.textContent = audiocontext.state;
  })
  .catch(() => {
    result.textContent = audiocontext.state;
  });

const setupListener = () => {
  setup()
    .then(() => {
      result.textContent = audiocontext.state;
    })
    .catch(() => {
      result.textContent = audiocontext.state;
    });

  document.removeEventListener('click', setupListener);
};

document.addEventListener('click', setupListener);
