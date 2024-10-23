const preNpm = document.getElementById('pre-npm');
const preYarn = document.getElementById('pre-yarn');
const prePnpm = document.getElementById('pre-pnpm');
const preCdn = document.getElementById('pre-cdn');

preNpm.addEventListener('animationend', (event) => {
  event.currentTarget.classList.remove('copy-highlight');
}, false);

preYarn.addEventListener('animationend', (event) => {
  event.currentTarget.classList.remove('copy-highlight');
}, false);

preCdn.addEventListener('animationend', (event) => {
  event.currentTarget.classList.remove('copy-highlight');
}, false);

document.getElementById('button-npm').addEventListener('mousedown', () => {
  if (!navigator.clipboard) {
    return;
  }

  navigator.clipboard.writeText('npm install --save xsound')
    .then(() => {
      preNpm.classList.add('copy-highlight');
    })
    .catch(console.error);
}, false);

document.getElementById('button-yarn').addEventListener('mousedown', () => {
  if (!navigator.clipboard) {
    return;
  }

  navigator.clipboard.writeText('yarn add xsound')
    .then(() => {
      preYarn.classList.add('copy-highlight');
    })
    .catch(console.error);
}, false);

document.getElementById('button-pnpm').addEventListener('mousedown', () => {
  if (!navigator.clipboard) {
    return;
  }

  navigator.clipboard.writeText('pnpm install xsound')
    .then(() => {
      prePnpm.classList.add('copy-highlight');
    })
    .catch(console.error);
}, false);

document.getElementById('button-cdn').addEventListener('mousedown', () => {
  if (!navigator.clipboard) {
    return;
  }

  navigator.clipboard.writeText('<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/xsound@latest/build/xsound.min.js"></script>')
    .then(() => {
      preCdn.classList.add('copy-highlight');
    })
    .catch(console.error);
}, false);

const date = new Date();

document.getElementById('current-year').textContent = date.getFullYear().toString(10);
