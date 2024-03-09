import type { OscillatorParams, OscillatorCustomType } from '/src/OscillatorModule/Oscillator';

import { AudioContextMock } from '/mock/AudioContextMock';
import { OscillatorNodeMock } from '/mock/OscillatorNodeMock';
import { Oscillator } from '/src/OscillatorModule/Oscillator';

describe(Oscillator.name, () => {
  const context = new AudioContextMock();

  // @ts-expect-error Because there is not Web Audio API in Jest environment (Node.js environment), mocks Web Audio API
  const oscillator = new Oscillator(context, false);

  describe(oscillator.ready.name, () => {
    test('should call `connect` method', () => {
      // eslint-disable-next-line dot-notation
      const volume = oscillator['volume'];

      const originalConnect = volume.connect;

      const connectMock = jest.fn();

      volume.connect = connectMock;

      oscillator.activate();

      // @ts-expect-error Because there is not Web Audio API in Jest environment (Node.js environment), mocks Web Audio API
      oscillator.ready(new OscillatorNodeMock());

      expect(connectMock).toHaveBeenCalledTimes(1);

      volume.connect = originalConnect;
    });
  });

  describe(oscillator.start.name, () => {
    beforeEach(() => {
      oscillator.deactivate();
    });

    test('should call `start` method', () => {
      // eslint-disable-next-line dot-notation
      const oscillatorNode = oscillator['source'];

      const originalStart = oscillatorNode.start;

      const startMock = jest.fn();

      oscillatorNode.start = startMock;

      oscillator.activate();
      oscillator.start(0);

      expect(startMock).toHaveBeenCalledTimes(1);

      oscillatorNode.start = originalStart;
    });

    test('should call `stop` method', () => {
      // eslint-disable-next-line dot-notation
      const oscillatorNode = oscillator['source'];

      const originalStop = oscillatorNode.stop;

      const stopMock = jest.fn();

      oscillatorNode.stop = stopMock;

      oscillator.start(0);

      expect(stopMock).toHaveBeenCalledTimes(1);

      oscillatorNode.stop = originalStop;
    });
  });

  describe(oscillator.stop.name, () => {
    test('should call `stop` and `disconnect` method', () => {
      // eslint-disable-next-line dot-notation
      const oscillatorNode = oscillator['source'];

      const originalStop       = oscillatorNode.stop;
      const originalDisconnect = oscillatorNode.disconnect;

      const stopMock       = jest.fn();
      const disconnectMock = jest.fn();

      oscillatorNode.stop       = stopMock;
      oscillatorNode.disconnect = disconnectMock;

      // eslint-disable-next-line dot-notation
      oscillator['paused'] = false;

      oscillator.stop(0);

      expect(stopMock).toHaveBeenCalledTimes(1);
      expect(disconnectMock).toHaveBeenCalledTimes(1);

      oscillatorNode.stop       = originalStop;
      oscillatorNode.disconnect = originalDisconnect;
    });
  });

  describe(oscillator.param.name, () => {
    const defaultParams: OscillatorParams = {
      type  : 'sine',
      octave: 0,
      fine  : 0,
      volume: 1
    };

    const params: OscillatorParams = {
      type  : 'sawtooth',
      octave: 1,
      fine  : -50,
      volume: 0.5
    };

    const custom: OscillatorCustomType = {
      real: new Float32Array([1, 1, 1, 1]),
      imag: new Float32Array([1, 1, 1, 1])
    };

    beforeAll(() => {
      oscillator.param(params);
    });

    afterAll(() => {
      oscillator.param(defaultParams);
    });

    test('should return `type`', () => {
      expect(oscillator.param('type')).toBe('sawtooth');
    });

    test('should return `octave`', () => {
      expect(oscillator.param('octave')).toBe(1);
    });

    test('should return `fine`', () => {
      expect(oscillator.param('fine')).toBeCloseTo(-50, 1);
    });

    test('should return `volume`', () => {
      expect(oscillator.param('volume')).toBeCloseTo(0.5, 1);
    });

    test('should be custom', () => {
      oscillator.param({ type: custom });

      /* eslint-disable dot-notation */
      expect(oscillator['custom'].real).toEqual(new Float32Array([0, 1, 1, 1]));
      expect(oscillator['custom'].imag).toEqual(new Float32Array([0, 1, 1, 1]));
      /* eslint-enable dot-notation */
    });
  });

  describe(oscillator.get.name, () => {
    test('should return instance of `OscillatorNode`', () => {
      expect(oscillator.get()).toBeInstanceOf(OscillatorNodeMock);
    });
  });

  describe(`${oscillator.activate.name} and ${oscillator.deactivate.name}`, () => {
    test('should return boolean', () => {
      expect(oscillator.activate().state()).toBe(true);
      expect(oscillator.deactivate().state()).toBe(false);
    });
  });

  describe(oscillator.params.name, () => {
    test('should return parameters for oscillator as associative array', () => {
      expect(oscillator.params()).toStrictEqual({
        state : false,
        type  : 'sine',
        octave: 0,
        fine  : 0,
        volume: 1
      });
    });
  });
});
