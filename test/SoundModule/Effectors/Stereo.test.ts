import { AudioContextMock } from '../../../mock/AudioContextMock';
import { Stereo, StereoParams } from '../../../src/SoundModule/Effectors/Stereo';

describe(Stereo.name, () => {
  const context = new AudioContextMock();

  // @ts-ignore
  const stereo = new Stereo(context, 2048);

  describe(stereo.start.name, () => {
    test('should be false after start', () => {
      // eslint-disable-next-line dot-notation
      expect(stereo['paused']).toBe(true);

      stereo.activate();
      stereo.start();

      // eslint-disable-next-line dot-notation
      expect(stereo['paused']).toBe(false);

      stereo.stop();
      stereo.deactivate();
    });
  });

  describe(stereo.stop.name, () => {
    test('should call `disconnect` method and stop `onaudioprocess` event handler', () => {
      // eslint-disable-next-line dot-notation
      const originalProcessor = stereo['processor'];

      const disconnectMock = jest.fn();

      // eslint-disable-next-line dot-notation
      stereo['processor'].disconnect = disconnectMock;

      stereo.activate();
      stereo.stop();

      expect(disconnectMock).toHaveBeenCalledTimes(1);

      // eslint-disable-next-line dot-notation
      expect(stereo['processor'].onaudioprocess).toBe(null);

      // eslint-disable-next-line dot-notation
      stereo['processor'] = originalProcessor;

      stereo.deactivate();
    });
  });

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

    test('should call connect method', () => {
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
});
