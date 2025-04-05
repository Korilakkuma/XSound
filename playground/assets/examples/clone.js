const ClonedX = X.clone();

ClonedX('oscillator').setup([true, true, false, false]);

ClonedX('oscillator')
  .module('analyser')
  .domain('time', 0)
  .setup(document.getElementById('visualizer-svg'))
  .param({ interval: -1 })
  .activate();

document.getElementById('button-start').onclick = () => {
  ClonedX('oscillator').start([440, 880]);
};

document.getElementById('button-stop').onclick = () => {
  ClonedX('oscillator').stop();
};
