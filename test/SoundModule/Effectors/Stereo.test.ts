import type { StereoParams } from '/src/SoundModule/Effectors/Stereo';

import { AudioContextMock } from '/mock/AudioContextMock';
import { Stereo } from '/src/SoundModule/Effectors/Stereo';

describe(Stereo.name, () => {
  const context = new AudioContextMock();

  // @ts-expect-error Because there is not Web Audio API in Jest environment (Node.js environment), mocks Web Audio API
  const stereo = new Stereo(context);

  describe(stereo.connect.name, () => {
    /* eslint-disable dot-notation */
    const originalInput    = stereo['input'];
    const originalSplitter = stereo['splitter'];
    const originalMerger   = stereo['merger'];
    const originalDelayL   = stereo['delayL'];
    const originalDelayR   = stereo['delayR'];
    /* eslint-enable dot-notation */

    afterAll(() => {
      /* eslint-disable dot-notation */
      stereo['splitter'] = originalSplitter;
      stereo['merger']   = originalMerger;
      stereo['input']    = originalInput;
      stereo['delayL']   = originalDelayL;
      stereo['delayR']   = originalDelayR;
      /* eslint-enable dot-notation */

      stereo.deactivate();
    });

    test('should call `connect` method', () => {
      const inputConnectMock       = jest.fn();
      const inputDisconnectMock    = jest.fn();
      const splitterConnectMock    = jest.fn();
      const splitterDisconnectMock = jest.fn();
      const mergerConnectMock      = jest.fn();
      const mergerDisconnectMock   = jest.fn();
      const delayLConnectMock      = jest.fn();
      const delayLDisconnectMock   = jest.fn();
      const delayRConnectMock      = jest.fn();
      const delayRDisconnectMock   = jest.fn();

      /* eslint-disable dot-notation */
      stereo['input'].connect       = inputConnectMock;
      stereo['input'].disconnect    = inputDisconnectMock;
      stereo['splitter'].connect    = splitterConnectMock;
      stereo['splitter'].disconnect = splitterDisconnectMock;
      stereo['merger'].connect      = mergerConnectMock;
      stereo['merger'].disconnect   = mergerDisconnectMock;
      stereo['delayL'].connect      = delayLConnectMock;
      stereo['delayL'].disconnect   = delayLDisconnectMock;
      stereo['delayR'].connect      = delayRConnectMock;
      stereo['delayR'].disconnect   = delayRDisconnectMock;
      /* eslint-enable dot-notation */

      stereo.connect();

      expect(inputConnectMock).toHaveBeenCalledTimes(1);
      expect(splitterConnectMock).toHaveBeenCalledTimes(0);
      expect(mergerConnectMock).toHaveBeenCalledTimes(0);
      expect(delayLConnectMock).toHaveBeenCalledTimes(0);
      expect(delayRConnectMock).toHaveBeenCalledTimes(0);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(1);
      expect(splitterDisconnectMock).toHaveBeenCalledTimes(1);
      expect(mergerDisconnectMock).toHaveBeenCalledTimes(1);
      expect(delayLDisconnectMock).toHaveBeenCalledTimes(1);
      expect(delayRDisconnectMock).toHaveBeenCalledTimes(1);

      stereo.activate();

      expect(inputConnectMock).toHaveBeenCalledTimes(2);
      expect(splitterConnectMock).toHaveBeenCalledTimes(2);
      expect(mergerConnectMock).toHaveBeenCalledTimes(1);
      expect(delayLConnectMock).toHaveBeenCalledTimes(1);
      expect(delayRConnectMock).toHaveBeenCalledTimes(1);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(2);
      expect(splitterDisconnectMock).toHaveBeenCalledTimes(2);
      expect(mergerDisconnectMock).toHaveBeenCalledTimes(2);
      expect(delayLDisconnectMock).toHaveBeenCalledTimes(2);
      expect(delayRDisconnectMock).toHaveBeenCalledTimes(2);
    });
  });

  describe(stereo.param.name, () => {
    const defaultParams: StereoParams = {
      time: 0
    };

    const params: StereoParams = {
      time: 0.5
    };

    beforeAll(() => {
      stereo.param(params);
    });

    afterAll(() => {
      stereo.param(defaultParams);
    });

    // Setter
    test('should return instance of `Stereo`', () => {
      expect(stereo.param(params)).toBeInstanceOf(Stereo);
    });

    // Getter
    test('should return `time`', () => {
      expect(stereo.param('time')).toBeCloseTo(0.5, 1);
    });
  });

  describe(stereo.params.name, () => {
    test('should return parameters for stereo effector as associative array', () => {
      expect(stereo.params()).toStrictEqual({
        state: false,
        time : 0
      });
    });
  });

  describe(stereo.activate.name, () => {
    test('should call `connect` method', () => {
      const originalConnect = stereo.connect;

      const connectMock = jest.fn();

      stereo.connect = connectMock;

      stereo.activate();

      expect(connectMock).toHaveBeenCalledTimes(1);

      stereo.connect = originalConnect;
    });
  });

  describe(stereo.deactivate.name, () => {
    test('should call `connect` method', () => {
      // HACK:
      // eslint-disable-next-line dot-notation
      if (stereo['processor'] === null) {
        return;
      }

      const originalConnect = stereo.connect;

      // eslint-disable-next-line dot-notation
      const originalProcessor = stereo['processor'];

      const connectMock    = jest.fn();
      const disconnectMock = jest.fn();

      stereo.connect = connectMock;

      // eslint-disable-next-line dot-notation
      stereo['processor'].disconnect = disconnectMock;

      stereo.deactivate();

      expect(connectMock).toHaveBeenCalledTimes(1);

      stereo.connect = originalConnect;

      // eslint-disable-next-line dot-notation
      stereo['processor'] = originalProcessor;
    });
  });
});
