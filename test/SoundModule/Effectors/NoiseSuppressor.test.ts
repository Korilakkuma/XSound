import { AudioContextMock } from '/mock/AudioContextMock';
import { NoiseSuppressor, NoiseSuppressorParams } from '/src/SoundModule/Effectors/NoiseSuppressor';

describe(NoiseSuppressor.name, () => {
  const context = new AudioContextMock();

  // @ts-expect-error Because there is not Web Audio API in Jest environment (Node.js environment), mocks Web Audio API
  const noisesuppressor = new NoiseSuppressor(context);

  describe(noisesuppressor.param.name, () => {
    const defaultParams: NoiseSuppressorParams = {
      threshold: 0
    };

    const params: NoiseSuppressorParams = {
      threshold: 0.03
    };

    beforeAll(() => {
      noisesuppressor.param(params);
    });

    afterAll(() => {
      noisesuppressor.param(defaultParams);
    });

    // Setter
    test('should return instance of `NoiseSuppressor`', () => {
      expect(noisesuppressor.param(params)).toBeInstanceOf(NoiseSuppressor);
    });

    // Getter
    test('should return `threshold`', () => {
      expect(noisesuppressor.param('threshold')).toBeCloseTo(0.03, 2);
    });
  });

  describe(noisesuppressor.params.name, () => {
    test('should return parameters for noise suppressor as associative array', () => {
      expect(noisesuppressor.params()).toStrictEqual({
        state    : true,
        threshold: 0
      });
    });
  });

  describe(noisesuppressor.activate.name, () => {
    test('should call `connect` method', () => {
      const originalConnect = noisesuppressor.connect;

      const connectMock = jest.fn();

      noisesuppressor.connect = connectMock;

      noisesuppressor.activate();

      expect(connectMock).toHaveBeenCalledTimes(1);

      noisesuppressor.connect = originalConnect;
    });
  });

  describe(noisesuppressor.deactivate.name, () => {
    test('should call `connect` method', () => {
      // HACK:
      // eslint-disable-next-line dot-notation
      if (noisesuppressor['processor'] === null) {
        return;
      }

      const originalConnect = noisesuppressor.connect;

      // eslint-disable-next-line dot-notation
      const originalProcessor = noisesuppressor['processor'];

      const connectMock    = jest.fn();
      const disconnectMock = jest.fn();

      noisesuppressor.connect = connectMock;

      // eslint-disable-next-line dot-notation
      noisesuppressor['processor'].disconnect = disconnectMock;

      noisesuppressor.deactivate();

      expect(connectMock).toHaveBeenCalledTimes(1);

      noisesuppressor.connect = originalConnect;

      // eslint-disable-next-line dot-notation
      noisesuppressor['processor'] = originalProcessor;
    });
  });
});
