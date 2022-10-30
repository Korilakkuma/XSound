import { AudioContextMock } from '../../../mock/AudioContextMock';
import { NoiseGate, NoiseGateParams } from '../../../src/SoundModule/Effectors/NoiseGate';

describe(NoiseGate.name, () => {
  const context = new AudioContextMock();

  // @ts-ignore
  const noisegate = new NoiseGate(context);

  // eslint-disable-next-line dot-notation
  describe(noisegate['gate'].name, () => {
    beforeAll(() => {
      noisegate.param({ level: 0.002 });
    });

    test('should return raw data', () => {
      /* eslint-disable-next-line dot-notation */
      expect(noisegate['gate'](0.005)).toBeCloseTo(0.005, 3);
      expect(noisegate['gate'](-0.005)).toBeCloseTo(-0.005, 3);
      /* eslint-enable-next-line dot-notation */
    });

    test('should return `0`', () => {
      /* eslint-disable-next-line dot-notation */
      expect(noisegate['gate'](0.002)).toBeCloseTo(0, 3);
      expect(noisegate['gate'](-0.002)).toBeCloseTo(0, 3);
      /* eslint-enable-next-line dot-notation */
    });
  });

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
    test('should call `connect` method and stop `onaudioprocess` event handler', () => {
      const originalConnect = noisegate.connect;

      // eslint-disable-next-line dot-notation
      const originalProcessor = noisegate['processor'];

      const connectMock    = jest.fn();
      const disconnectMock = jest.fn();

      noisegate.connect = connectMock;

      // eslint-disable-next-line dot-notation
      noisegate['processor'].disconnect = disconnectMock;

      noisegate.deactivate();

      expect(connectMock).toHaveBeenCalledTimes(2);

      // eslint-disable-next-line dot-notation
      expect(noisegate['processor'].onaudioprocess).toBe(null);

      noisegate.connect = originalConnect;

      // eslint-disable-next-line dot-notation
      noisegate['processor'] = originalProcessor;
    });
  });
});
