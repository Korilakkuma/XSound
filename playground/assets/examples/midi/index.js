const result = document.getElementById('result-text');

const MIN_NOTE_NUMBER = 21;
const MAX_NOTE_NUMBER = 108;
const MAX_VELOCITY    = 127;

const indexes = [];

const noteOn = (noteNumber, velocity) => {
  if ((noteNumber < MIN_NOTE_NUMBER) || (noteNumber > MAX_NOTE_NUMBER)) {
    return;
  }

  if ((velocity < 0) || (velocity > MAX_VELOCITY)) {
    return;
  }

  const targetIndex = noteNumber - MIN_NOTE_NUMBER;
  const volume      = velocity / MAX_VELOCITY;

  indexes.push(targetIndex);

  for (let i = 0, len = X('oscillator').length(); i < len; i++) {
    X('oscillator').get(i).param({ volume });
  }

  X('oscillator').ready(0, 0).start(X.toFrequencies(indexes));
};

const noteOff = (noteNumber, velocity) => {
  if ((noteNumber < MIN_NOTE_NUMBER) || (noteNumber > MAX_NOTE_NUMBER)) {
    return;
  }

  if ((velocity < 0) || (velocity > MAX_VELOCITY)) {
    return;
  }

  const targetIndex = noteNumber - MIN_NOTE_NUMBER;

  const index = indexes.indexOf(targetIndex);

  if (index !== -1) {
    indexes.splice(index, 1);
  }

  X('oscillator').stop();
};

const options = {
  sysex: true
};

const successCallback = (midiAccess, inputs, outputs) => {
  if (inputs.length > 0) {
    inputs[0].onmidimessage = (event) => {
      switch (event.data[0] & 0xf0) {
        case 0x90:
          noteOn(event.data[1], event.data[2]);
          break;
        case 0x80:
          noteOff(event.data[1], event.data[2]);
          break;
        default :
          break;
      }
    };
  }
};

const errorCallback = (error) => {
  result.textContent = error.message;
};

X('midi').setup({ options, successCallback, errorCallback });
X('oscillator').setup([true, true, true, true]);
