import { AudioContextMock } from '../../../mock/AudioContextMock';
import { VocalCanceler, VocalCancelerParams } from '../../../src/SoundModule/Effectors/VocalCanceler';

describe(VocalCanceler.name, () => {
  const context = new AudioContextMock();

  // @ts-ignore
  const vocalcanceler = new VocalCanceler(context, 2048);

  // eslint-disable-next-line dot-notation
  describe(vocalcanceler['cancel'].name, () => {
    test('should return difference between left and right channel', () => {
      // eslint-disable-next-line dot-notation
      expect(vocalcanceler['cancel'](1, 1)).toBeCloseTo(1, 1);

      vocalcanceler.param({ depth: 0.5 });

      // eslint-disable-next-line dot-notation
      expect(vocalcanceler['cancel'](1, 1)).toBeCloseTo(0.5, 1);
    });
  });

  describe(vocalcanceler.param.name, () => {
    const defaultParams: VocalCancelerParams = {
      depth: 0
    };

    const params: VocalCancelerParams = {
      depth: 1
    };

    beforeAll(() => {
      vocalcanceler.param(params);
    });

    afterEach(() => {
      vocalcanceler.param(defaultParams);
    });

    test('should return `depth`', () => {
      expect(vocalcanceler.param('depth')).toBeCloseTo(1, 1);
    });
  });

  describe(vocalcanceler.params.name, () => {
    test('should return parameters for vocal canceler as associative array', () => {
      expect(vocalcanceler.params()).toStrictEqual({
        state: true,
        depth: 0
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
    test('should call `connect` method and stop `onaudioprocess` event handler', () => {
      const originalConnect = vocalcanceler.connect;

      // eslint-disable-next-line dot-notation
      const originalProcessor = vocalcanceler['processor'];

      const connectMock    = jest.fn();
      const disconnectMock = jest.fn();

      vocalcanceler.connect = connectMock;

      // eslint-disable-next-line dot-notation
      vocalcanceler['processor'].disconnect = disconnectMock;

      vocalcanceler.deactivate();

      expect(connectMock).toHaveBeenCalledTimes(2);

      // eslint-disable-next-line dot-notation
      expect(vocalcanceler['processor'].onaudioprocess).toBe(null);

      vocalcanceler.connect = originalConnect;

      // eslint-disable-next-line dot-notation
      vocalcanceler['processor'] = originalProcessor;
    });
  });
});
