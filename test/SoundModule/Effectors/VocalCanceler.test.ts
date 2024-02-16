import { AudioContextMock } from '/mock/AudioContextMock';
import { VocalCanceler, VocalCancelerParams } from '/src/SoundModule/Effectors/VocalCanceler';

describe(VocalCanceler.name, () => {
  const context = new AudioContextMock();

  // @ts-expect-error Because there is not Web Audio API in Jest environment (Node.js environment), mocks Web Audio API
  const vocalcanceler = new VocalCanceler(context);

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

    afterAll(() => {
      vocalcanceler.param(defaultParams);
    });

    // Setter
    test('should return instance of `VocalCanceler`', () => {
      expect(vocalcanceler.param(params)).toBeInstanceOf(VocalCanceler);
    });

    // Getter
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
