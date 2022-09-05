const result = document.getElementById('result-text');
const button = document.getElementById('button-run');

let animationId = null;

const update = () => {
  animationId = requestAnimationFrame(() => {
    result.textContent = getCurrentTime();
    update();
  });
};

const stop = () => {
  cancelAnimationFrame(animationId);
  button.removeEventListener('click', stop);
};

update();

button.addEventListener('click', stop);
