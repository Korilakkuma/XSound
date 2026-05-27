import type { HarmonizerParams } from '/src/SoundModule/Effectors/Harmonizer';

import { AudioContextMock } from '/mock/AudioContextMock';
import { Harmonizer } from '/src/SoundModule/Effectors/Harmonizer';

describe(Harmonizer.name, () => {
  const context = new AudioContextMock();

  // @ts-expect-error Because there is not Web Audio API in Jest environment (Node.js environment), mocks Web Audio API
  const harmonizer = new Harmonizer(context);

  describe(harmonizer.connect.name, () => {
    // eslint-disable-next-line dot-notation
    const originalInput = harmonizer['input'];

    afterAll(() => {
      // eslint-disable-next-line dot-notation
      harmonizer['input'] = originalInput;

      harmonizer.deactivate();
    });

    test('should call `connect` method', () => {
      const inputConnectMock    = jest.fn();
      const inputDisconnectMock = jest.fn();

      /* eslint-disable dot-notation */
      harmonizer['input'].connect    = inputConnectMock;
      harmonizer['input'].disconnect = inputDisconnectMock;
      /* eslint-enable dot-notation */

      harmonizer.connect();

      expect(inputConnectMock).toHaveBeenCalledTimes(1);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(1);

      harmonizer.activate();

      expect(inputConnectMock).toHaveBeenCalledTimes(3);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(2);
    });
  });

  describe(harmonizer.param.name, () => {
    const defaultParams: HarmonizerParams = {
      type  : 'harmony',
      mode  : 'major',
      shifts: [1, 1],
      dry   : 1,
      wets  : [0, 0]
    };

    const params: HarmonizerParams = {
      type  : 'octave',
      mode  : 'minor',
      shifts: [-2, 1],
      dry   : 0.8,
      wets  : [0.2, 0.5]
    };

    beforeAll(() => {
      harmonizer.param(params);
    });

    afterAll(() => {
      harmonizer.param(defaultParams);
    });

    // Setter
    test('should return instance of `Harmonizer`', () => {
      expect(harmonizer.param(params)).toBeInstanceOf(Harmonizer);
    });

    // Getter
    test('should return `type`', () => {
      expect(harmonizer.param('type')).toBe('octave');
    });

    test('should return `mode`', () => {
      expect(harmonizer.param('mode')).toBe('minor');
    });

    test('should return `shifts`', () => {
      expect(harmonizer.param('shifts')).toStrictEqual([-2, 1]);
    });

    test('should return `dry`', () => {
      expect(harmonizer.param('dry')).toBeCloseTo(0.8, 1);
    });

    test('should return `wets`', () => {
      expect(harmonizer.param('wets')[0]).toBeCloseTo(0.2, 1);
      expect(harmonizer.param('wets')[1]).toBeCloseTo(0.5, 1);
    });
  });

  describe(harmonizer.params.name, () => {
    test('should return parameters for harmonizer as associative array', () => {
      expect(harmonizer.params()).toStrictEqual({
        state : false,
        type  : 'harmony',
        mode  : 'major',
        shifts: [1, 1],
        dry   : 1,
        wets  : [0, 0]
      });
    });
  });

  describe(harmonizer.activate.name, () => {
    test('should call `connect` method', () => {
      const originalConnect = harmonizer.connect;

      const connectMock = jest.fn();

      harmonizer.connect = connectMock;

      harmonizer.activate();

      expect(connectMock).toHaveBeenCalledTimes(1);

      harmonizer.connect = originalConnect;
    });
  });

  describe(harmonizer.deactivate.name, () => {
    test('should call `connect` method', () => {
      const originalConnect = harmonizer.connect;

      const connectMock = jest.fn();

      harmonizer.connect = connectMock;

      harmonizer.deactivate();

      expect(connectMock).toHaveBeenCalledTimes(1);

      harmonizer.connect = originalConnect;
    });
  });
});
