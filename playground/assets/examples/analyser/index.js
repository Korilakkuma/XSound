const context = X.get();

const styles = {
  font  : {
    famliy: 'Roboto',
    size  : '12px'
  },
  width : 1,
  top   : 16,
  bottom: 16,
  left  : 28
};

X('analyser')
  .domain('time')
  .setup(document.getElementById('visualizer-svg'))
  .param({ interval: -1, styles })
  .activate();

let oscillator = null;

document.getElementById('button-start').onclick = () => {
  if (oscillator) {
    return;
  }

  oscillator = new OscillatorNode(context, { type: 'sawtooth' });
  oscillator.connect(context.destination);

  X('analyser').domain('time').connect(oscillator);

  oscillator.start(0);

  X('analyser').start('time', 0);
};

document.getElementById('button-stop').onclick = () => {
  if (oscillator === null) {
    return;
  }

  oscillator.stop(0);
  oscillator.disconnect(0);

  oscillator = null;

  X('analyser').stop('time', 0);
};
