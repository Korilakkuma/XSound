const preNpm = document.getElementById('pre-npm');
const preCdn = document.getElementById('pre-cdn');

preNpm.addEventListener('animationend', (event) => {
    event.currentTarget.classList.remove('-highlight');
}, false);

preCdn.addEventListener('animationend', (event) => {
    event.currentTarget.classList.remove('-highlight');
}, false);

document.getElementById('button-npm').addEventListener('mousedown', () => {
    if (!navigator.clipboard) {
        return;
    }

    navigator.clipboard.writeText('npm install --save xsound')
        .then(() => {
            preNpm.classList.add('-highlight');
        })
        .catch(console.error);
}, false);

document.getElementById('button-cdn').addEventListener('mousedown', () => {
    if (!navigator.clipboard) {
        return;
    }

    navigator.clipboard.writeText('<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/xsound@latest/build/xsound.min.js"></script>')
        .then(() => {
            preCdn.classList.add('-highlight');
        })
        .catch(console.error);
}, false);
