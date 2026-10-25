import type { FuzzParams } from '/src/SoundModule/Effectors/Fuzz';

import { AudioContextMock } from '/mock/AudioContextMock';
import { Fuzz } from '/src/SoundModule/Effectors/Fuzz';

describe(Fuzz.name, () => {
  const context = new AudioContextMock();

  // @ts-expect-error Because there is not Web Audio API in Jest environment (Node.js environment), mocks Web Audio API
  const fuzz = new Fuzz(context);

  describe(fuzz.connect.name, () => {
    /* eslint-disable dot-notation */
    const originalInput     = fuzz['input'];
    const originalRectifier = fuzz['rectifier'];
    const originalDrive     = fuzz['drive'];
    const originalLevel     = fuzz['level'];
    /* eslint-enable dot-notation */

    afterEach(() => {
      /* eslint-disable dot-notation */
      fuzz['input']     = originalInput;
      fuzz['rectifier'] = originalRectifier;
      fuzz['drive']     = originalDrive;
      fuzz['level']     = originalLevel;
      /* eslint-enable dot-notation */

      fuzz.deactivate();
    });

    test('should call `connect` method (if `type` is `full-rectifier`)', () => {
      const inputConnectMock        = jest.fn();
      const inputDisconnectMock     = jest.fn();
      const rectifierConnectMock    = jest.fn();
      const rectifierDisconnectMock = jest.fn();

      /* eslint-disable dot-notation */
      fuzz['input'].connect        = inputConnectMock;
      fuzz['input'].disconnect     = inputDisconnectMock;
      fuzz['rectifier'].connect    = rectifierConnectMock;
      fuzz['rectifier'].disconnect = rectifierDisconnectMock;
      /* eslint-enable dot-notation */

      fuzz.param({ type: 'full-rectifier' });

      expect(inputConnectMock).toHaveBeenCalledTimes(1);
      expect(rectifierConnectMock).toHaveBeenCalledTimes(0);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(1);
      expect(rectifierDisconnectMock).toHaveBeenCalledTimes(1);

      fuzz.activate();

      expect(inputConnectMock).toHaveBeenCalledTimes(2);
      expect(rectifierConnectMock).toHaveBeenCalledTimes(1);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(2);
      expect(rectifierDisconnectMock).toHaveBeenCalledTimes(2);
    });

    test('should call `connect` method (if `type` is `half-rectifier`)', () => {
      const inputConnectMock        = jest.fn();
      const inputDisconnectMock     = jest.fn();
      const rectifierConnectMock    = jest.fn();
      const rectifierDisconnectMock = jest.fn();

      /* eslint-disable dot-notation */
      fuzz['input'].connect        = inputConnectMock;
      fuzz['input'].disconnect     = inputDisconnectMock;
      fuzz['rectifier'].connect    = rectifierConnectMock;
      fuzz['rectifier'].disconnect = rectifierDisconnectMock;
      /* eslint-enable dot-notation */

      fuzz.param({ type: 'half-rectifier' });

      expect(inputConnectMock).toHaveBeenCalledTimes(1);
      expect(rectifierConnectMock).toHaveBeenCalledTimes(0);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(1);
      expect(rectifierDisconnectMock).toHaveBeenCalledTimes(1);

      fuzz.activate();

      expect(inputConnectMock).toHaveBeenCalledTimes(2);
      expect(rectifierConnectMock).toHaveBeenCalledTimes(1);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(2);
      expect(rectifierDisconnectMock).toHaveBeenCalledTimes(2);
    });
  });

  describe(fuzz.param.name, () => {
    const defaultParams: FuzzParams = {
      type      : 'full-rectifier',
      drive     : 0,
      level     : 1,
      tone      : 6000,
      oversample: '4x'
    };

    const params: FuzzParams = {
      type      : 'half-rectifier',
      drive     : 0.5,
      level     : 0.5,
      tone      : 3000,
      oversample: 'none'
    };

    afterAll(() => {
      fuzz.param(defaultParams);
    });

    // Setter
    test('should return instance of `Fuzz`', () => {
      expect(fuzz.param(params)).toBeInstanceOf(Fuzz);
    });

    // Getter
    test('should return `type`', () => {
      expect(fuzz.param('type')).toBe('half-rectifier');
    });

    test('should return `drive`', () => {
      expect(fuzz.param('drive')).toBeCloseTo(0.5, 1);
    });

    test('should return `level`', () => {
      expect(fuzz.param('level')).toBeCloseTo(0.5, 1);
    });

    test('should return `tone`', () => {
      expect(fuzz.param('tone')).toBe(3000);
    });

    test('should return `oversample`', () => {
      expect(fuzz.param('oversample')).toBe('none');
    });
  });

  describe(fuzz.params.name, () => {
    test('should return parameters for fuzz effector as associative array', () => {
      expect(fuzz.params()).toStrictEqual({
        state     : false,
        type      : 'full-rectifier',
        drive     : 0,
        level     : 1,
        tone      : 6000,
        oversample: '4x'
      });
    });
  });

  describe(fuzz.activate.name, () => {
    test('should call `connect` method', () => {
      const originalConnect = fuzz.connect;

      const connectMock = jest.fn();

      fuzz.connect = connectMock;

      fuzz.activate();

      expect(connectMock).toHaveBeenCalledTimes(1);

      fuzz.connect = originalConnect;
    });
  });

  describe(fuzz.deactivate.name, () => {
    test('should call `connect` method', () => {
      const originalConnect = fuzz.connect;

      const connectMock = jest.fn();

      fuzz.connect = connectMock;

      fuzz.deactivate();

      expect(connectMock).toHaveBeenCalledTimes(1);

      fuzz.connect = originalConnect;
    });
  });
});
