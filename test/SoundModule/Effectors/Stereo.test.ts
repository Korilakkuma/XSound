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
    const originalDelay    = stereo['delay'];
    const originalGainL    = stereo['gainL'];
    const originalGainR    = stereo['gainR'];
    /* eslint-enable dot-notation */

    afterAll(() => {
      /* eslint-disable dot-notation */
      stereo['splitter'] = originalSplitter;
      stereo['merger']   = originalMerger;
      stereo['input']    = originalInput;
      stereo['delay']    = originalDelay;
      stereo['gainL']    = originalGainL;
      stereo['gainR']    = originalGainR;
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
      const delayConnectMock       = jest.fn();
      const delayDisconnectMock    = jest.fn();
      const gainLConnectMock       = jest.fn();
      const gainLDisconnectMock    = jest.fn();
      const gainRConnectMock       = jest.fn();
      const gainRDisconnectMock    = jest.fn();

      /* eslint-disable dot-notation */
      stereo['input'].connect       = inputConnectMock;
      stereo['input'].disconnect    = inputDisconnectMock;
      stereo['splitter'].connect    = splitterConnectMock;
      stereo['splitter'].disconnect = splitterDisconnectMock;
      stereo['merger'].connect      = mergerConnectMock;
      stereo['merger'].disconnect   = mergerDisconnectMock;
      stereo['delay'].connect       = delayConnectMock;
      stereo['delay'].disconnect    = delayDisconnectMock;
      stereo['gainL'].connect       = gainLConnectMock;
      stereo['gainL'].disconnect    = gainLDisconnectMock;
      stereo['gainR'].connect       = gainRConnectMock;
      stereo['gainR'].disconnect    = gainRDisconnectMock;
      /* eslint-enable dot-notation */

      stereo.connect();

      expect(inputConnectMock).toHaveBeenCalledTimes(1);
      expect(splitterConnectMock).toHaveBeenCalledTimes(0);
      expect(mergerConnectMock).toHaveBeenCalledTimes(0);
      expect(delayConnectMock).toHaveBeenCalledTimes(0);
      expect(gainLConnectMock).toHaveBeenCalledTimes(0);
      expect(gainRConnectMock).toHaveBeenCalledTimes(0);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(1);
      expect(splitterDisconnectMock).toHaveBeenCalledTimes(2);
      expect(mergerDisconnectMock).toHaveBeenCalledTimes(1);
      expect(delayDisconnectMock).toHaveBeenCalledTimes(1);
      expect(gainLDisconnectMock).toHaveBeenCalledTimes(1);
      expect(gainRDisconnectMock).toHaveBeenCalledTimes(1);

      stereo.activate();

      expect(inputConnectMock).toHaveBeenCalledTimes(4);
      expect(splitterConnectMock).toHaveBeenCalledTimes(2);
      expect(mergerConnectMock).toHaveBeenCalledTimes(1);
      expect(delayConnectMock).toHaveBeenCalledTimes(1);
      expect(gainLConnectMock).toHaveBeenCalledTimes(1);
      expect(gainRConnectMock).toHaveBeenCalledTimes(1);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(2);
      expect(splitterDisconnectMock).toHaveBeenCalledTimes(4);
      expect(mergerDisconnectMock).toHaveBeenCalledTimes(2);
      expect(delayDisconnectMock).toHaveBeenCalledTimes(2);
      expect(gainLDisconnectMock).toHaveBeenCalledTimes(2);
      expect(gainRDisconnectMock).toHaveBeenCalledTimes(2);
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
      const originalConnect = stereo.connect;

      const connectMock = jest.fn();

      stereo.connect = connectMock;

      stereo.deactivate();

      expect(connectMock).toHaveBeenCalledTimes(1);

      stereo.connect = originalConnect;
    });
  });
});
