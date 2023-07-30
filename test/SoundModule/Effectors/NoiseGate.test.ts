import { AudioContextMock } from '/mock/AudioContextMock';
import { NoiseGate, NoiseGateParams } from '/src/SoundModule/Effectors/NoiseGate';

describe(NoiseGate.name, () => {
  const context = new AudioContextMock();

  // @ts-ignore
  const noisegate = new NoiseGate(context);

  describe(noisegate.param.name, () => {
    const defaultParams: NoiseGateParams = {
      level: 0
    };

    const params: NoiseGateParams = {
      level: 0.5
    };

    beforeAll(() => {
      noisegate.param(params);
    });

    afterAll(() => {
      noisegate.param(defaultParams);
    });

    // Setter
    test('should return instance of `NoiseGate`', () => {
      expect(noisegate.param(params)).toBeInstanceOf(NoiseGate);
    });

    // Getter
    test('should return `level`', () => {
      expect(noisegate.param('level')).toBeCloseTo(0.5, 1);
    });
  });

  describe(noisegate.params.name, () => {
    test('should return parameters for noise gate as associative array', () => {
      expect(noisegate.params()).toStrictEqual({
        state: true,
        level: 0
      });
    });
  });

  describe(noisegate.activate.name, () => {
    test('should call `connect` method', () => {
      const originalConnect = noisegate.connect;

      const connectMock = jest.fn();

      noisegate.connect = connectMock;

      noisegate.activate();

      expect(connectMock).toHaveBeenCalledTimes(1);

      noisegate.connect = originalConnect;
    });
  });

  describe(noisegate.deactivate.name, () => {
    test('should call `connect` method', () => {
      // HACK:
      // eslint-disable-next-line dot-notation
      if (noisegate['processor'] === null) {
        return;
      }

      const originalConnect = noisegate.connect;

      // eslint-disable-next-line dot-notation
      const originalProcessor = noisegate['processor'];

      const connectMock    = jest.fn();
      const disconnectMock = jest.fn();

      noisegate.connect = connectMock;

      // eslint-disable-next-line dot-notation
      noisegate['processor'].disconnect = disconnectMock;

      noisegate.deactivate();

      expect(connectMock).toHaveBeenCalledTimes(1);

      noisegate.connect = originalConnect;

      // eslint-disable-next-line dot-notation
      noisegate['processor'] = originalProcessor;
    });
  });
});
