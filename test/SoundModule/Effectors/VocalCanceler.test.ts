import type { VocalCancelerParams } from '/src/SoundModule/Effectors/VocalCanceler';

import { AudioContextMock } from '/mock/AudioContextMock';
import { VocalCanceler } from '/src/SoundModule/Effectors/VocalCanceler';

describe(VocalCanceler.name, () => {
  const context = new AudioContextMock();

  // @ts-expect-error Because there is not Web Audio API in Jest environment (Node.js environment), mocks Web Audio API
  const vocalcanceler = new VocalCanceler(context);

  describe(vocalcanceler.param.name, () => {
    const defaultParams: VocalCancelerParams = {
      algorithm   : 'time',
      depth       : 0,
      minFrequency: 200,
      maxFrequency: 8000,
      threshold   : 0.05
    };

    const params: VocalCancelerParams = {
      algorithm   : 'spectrum',
      depth       : 1,
      minFrequency: 400,
      maxFrequency: 4000,
      threshold   : 0.005
    };

    beforeAll(() => {
      vocalcanceler.param(params);
    });

    afterAll(() => {
      vocalcanceler.param(defaultParams);
    });

    // Setter
    test('should return instance of `VocalCanceler`', () => {
      expect(vocalcanceler.param(params)).toBeInstanceOf(VocalCanceler);
    });

    // Getter
    test('should return `algorithm`', () => {
      expect(vocalcanceler.param('algorithm')).toBe('spectrum');
    });

    test('should return `depth`', () => {
      expect(vocalcanceler.param('depth')).toBeCloseTo(1, 1);
    });

    test('should return `minFrequency`', () => {
      expect(vocalcanceler.param('minFrequency')).toBeCloseTo(400, 1);
    });

    test('should return `maxFrequency`', () => {
      expect(vocalcanceler.param('maxFrequency')).toBeCloseTo(4000, 1);
    });

    test('should return `threshold`', () => {
      expect(vocalcanceler.param('threshold')).toBeCloseTo(0.005, 3);
    });
  });

  describe(vocalcanceler.params.name, () => {
    test('should return parameters for vocal canceler as associative array', () => {
      expect(vocalcanceler.params()).toStrictEqual({
        state       : true,
        algorithm   : 'time',
        depth       : 0,
        minFrequency: 200,
        maxFrequency: 8000,
        threshold   : 0.05
      });
    });
  });

  describe(vocalcanceler.activate.name, () => {
    test('should call `connect` method', () => {
      const originalConnect = vocalcanceler.connect;

      const connectMock = jest.fn();

      vocalcanceler.connect = connectMock;

      vocalcanceler.activate();

      expect(connectMock).toHaveBeenCalledTimes(1);

      vocalcanceler.connect = originalConnect;
    });
  });

  describe(vocalcanceler.deactivate.name, () => {
    test('should call `connect` method', () => {
      // HACK:
      // eslint-disable-next-line dot-notation
      if (vocalcanceler['processor'] === null) {
        return;
      }

      const originalConnect = vocalcanceler.connect;

      // eslint-disable-next-line dot-notation
      const originalProcessor = vocalcanceler['processor'];

      const connectMock    = jest.fn();
      const disconnectMock = jest.fn();

      vocalcanceler.connect = connectMock;

      // eslint-disable-next-line dot-notation
      vocalcanceler['processor'].disconnect = disconnectMock;

      vocalcanceler.deactivate();

      expect(connectMock).toHaveBeenCalledTimes(1);

      vocalcanceler.connect = originalConnect;

      // eslint-disable-next-line dot-notation
      vocalcanceler['processor'] = originalProcessor;
    });
  });
});
