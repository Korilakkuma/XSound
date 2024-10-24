'use strict';

const preNpm = document.getElementById('pre-npm');
const preYarn = document.getElementById('pre-yarn');
const prePnpm = document.getElementById('pre-pnpm');
const preCdn = document.getElementById('pre-cdn');

const buttonNpm = document.getElementById('button-npm');
const buttonYarn = document.getElementById('button-yarn');
const buttonPnpm = document.getElementById('button-pnpm');
const buttonCdn = document.getElementById('button-cdn');


preYarn.addEventListener('animationend', (event) => {
  event.currentTarget.classList.remove('copy-highlight');
}, false);

preCdn.addEventListener('animationend', (event) => {
  event.currentTarget.classList.remove('copy-highlight');
}, false);

const onAnimationEnd = (event) => {
  event.currentTarget.classList.remove('copy-highlight');
};

const onDown = (event) => {
  if (!navigator.clipboard) {
    return;
  }

  let text = '';
  let highlightElement = null;

  switch (event.currentTarget.id.slice(7)) {
    case 'npm': {
      text = 'npm install --save xsound';
      highlightElement = preNpm;
      break;
    }

    case 'yarn': {
      text = 'yarn add xsound';
      highlightElement = preYarn;
      break;
    }

    case 'pnpm': {
      text = 'pnpm install xsound';
      highlightElement = prePnpm;
      break;
    }

    case 'cdn': {
      text = '<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/xsound@latest/build/xsound.min.js"></script>';
      highlightElement = preCdn;
      break;
    }
  }

  navigator
    .clipboard
    .writeText(text)
    .then(() => {
      highlightElement.classList.add('copy-highlight');
    })
    .catch(console.error);
};

preNpm.addEventListener('animationend', onAnimationEnd);
preYarn.addEventListener('animationend', onAnimationEnd);
prePnpm.addEventListener('animationend', onAnimationEnd);
preCdn.addEventListener('animationend', onAnimationEnd);

buttonNpm.addEventListener('mousedown', onDown);
buttonNpm.addEventListener('touchstart', onDown);
buttonYarn.addEventListener('mousedown', onDown);
buttonYarn.addEventListener('touchstart', onDown);
buttonPnpm.addEventListener('mousedown', onDown);
buttonPnpm.addEventListener('touchstart', onDown);
buttonCdn.addEventListener('mousedown', onDown);
buttonCdn.addEventListener('touchstart', onDown);

const date = new Date();

document.getElementById('current-year').textContent = date.getFullYear().toString(10);
