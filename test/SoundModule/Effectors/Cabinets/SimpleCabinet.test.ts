import type { SimpleCabinetParams } from '/src/SoundModule/Effectors/Cabinets/SimpleCabinet';

import { AudioContextMock } from '/mock/AudioContextMock';
import { SimpleCabinet } from '/src/SoundModule/Effectors/Cabinets/SimpleCabinet';

describe(SimpleCabinet.name, () => {
  const context = new AudioContextMock();

  // @ts-expect-error Because there is not Web Audio API in Jest environment (Node.js environment), mocks Web Audio API
  const cabinet = new SimpleCabinet(context);

  describe(cabinet.connect.name, () => {
    /* eslint-disable dot-notation */
    const originalInput   = cabinet['input'];
    const originalLowpass = cabinet['lowpass'];
    const originalNotch   = cabinet['notch'];
    /* eslint-enable dot-notation */

    afterAll(() => {
      /* eslint-disable dot-notation */
      cabinet['input']   = originalInput;
      cabinet['lowpass'] = originalLowpass;
      cabinet['notch']   = originalNotch;
      /* eslint-enable dot-notation */

      cabinet.deactivate();
    });

    test('should call `connect` method', () => {
      const inputConnectMock      = jest.fn();
      const inputDisconnectMock   = jest.fn();
      const lowpassConnectMock    = jest.fn();
      const lowpassDisconnectMock = jest.fn();
      const notchConnectMock      = jest.fn();
      const notchDisconnectMock   = jest.fn();

      /* eslint-disable dot-notation */
      cabinet['input'].connect      = inputConnectMock;
      cabinet['input'].disconnect   = inputDisconnectMock;
      cabinet['lowpass'].connect    = lowpassConnectMock;
      cabinet['lowpass'].disconnect = lowpassDisconnectMock;
      cabinet['notch'].connect      = notchConnectMock;
      cabinet['notch'].disconnect   = notchDisconnectMock;
      /* eslint-enable dot-notation */

      cabinet.connect();

      expect(inputConnectMock).toHaveBeenCalledTimes(1);
      expect(lowpassConnectMock).toHaveBeenCalledTimes(1);
      expect(notchConnectMock).toHaveBeenCalledTimes(1);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(1);
      expect(lowpassDisconnectMock).toHaveBeenCalledTimes(1);
      expect(notchDisconnectMock).toHaveBeenCalledTimes(1);

      cabinet.deactivate();

      expect(inputConnectMock).toHaveBeenCalledTimes(2);
      expect(lowpassConnectMock).toHaveBeenCalledTimes(1);
      expect(notchConnectMock).toHaveBeenCalledTimes(1);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(2);
      expect(lowpassDisconnectMock).toHaveBeenCalledTimes(2);
      expect(notchDisconnectMock).toHaveBeenCalledTimes(2);
    });
  });

  describe(cabinet.param.name, () => {
    const defaultParams: SimpleCabinetParams = {
      state: true
    };

    const params: SimpleCabinetParams = {
      state: false,
    };

    beforeAll(() => {
      cabinet.param(params);
    });

    afterAll(() => {
      cabinet.param(defaultParams);
    });

    // Setter
    test('should return instance of `SimpleCabinet`', () => {
      expect(cabinet.param(params)).toBeInstanceOf(SimpleCabinet);
    });

    // Getter
    test('should return `state`', () => {
      expect(cabinet.param('state')).toBe(false);
    });
  });

  describe(cabinet.params.name, () => {
    test('should return parameters for simple cabinet as associative array', () => {
      expect(cabinet.params()).toStrictEqual({
        state: true,
      });
    });
  });

  describe(cabinet.activate.name, () => {
    test('should call `connect` method', () => {
      const originalConnect = cabinet.connect;

      const connectMock = jest.fn();

      cabinet.connect = connectMock;

      cabinet.activate();

      expect(connectMock).toHaveBeenCalledTimes(1);

      cabinet.connect = originalConnect;
    });
  });

  describe(cabinet.deactivate.name, () => {
    test('should call `connect` method', () => {
      const originalConnect = cabinet.connect;

      const connectMock = jest.fn();

      cabinet.connect = connectMock;

      cabinet.deactivate();

      expect(connectMock).toHaveBeenCalledTimes(1);

      cabinet.connect = originalConnect;
    });
  });
});
