X('oscillator').setup([true, true, false, false]);

X('oscillator')
  .module('analyser')
  .domain('time', 0)
  .setup(document.querySelector('canvas'))
  .param({ interval: -1 })
  .activate();

document.getElementById('button-start').onclick = () => {
  X('oscillator').start([440, 880]);
};

document.getElementById('button-stop').onclick = () => {
  X('oscillator').stop();
};
