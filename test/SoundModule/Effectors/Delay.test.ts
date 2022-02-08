import { AudioContextMock } from '../../../mock/AudioContextMock';
import { Delay, DelayParams } from '../../../src/SoundModule/Effectors/Delay';

describe(Delay.name, () => {
  const context = new AudioContextMock();

  // @ts-ignore
  const delay = new Delay(context);

  describe(delay.connect.name, () => {
    /* eslint-disable dot-notation */
    const originalInput    = delay['input'];
    const originalDelay    = delay['delay'];
    const originalDry      = delay['dry'];
    const originalWet      = delay['wet'];
    const originalTone     = delay['tone'];
    const originalFeedback = delay['feedback'];
    /* eslint-enable dot-notation */

    afterAll(() => {
      /* eslint-disable dot-notation */
      delay['input']    = originalInput;
      delay['delay']    = originalDelay;
      delay['dry']      = originalDry;
      delay['wet']      = originalWet;
      delay['tone']     = originalTone;
      delay['feedback'] = originalFeedback;
      /* eslint-enable dot-notation */

      delay.deactivate();
    });

    test('should call `connect` method', () => {
      const inputConnectMock       = jest.fn();
      const inputDisconnectMock    = jest.fn();
      const delayConnectMock       = jest.fn();
      const delayDisconnectMock    = jest.fn();
      const dryConnectMock         = jest.fn();
      const dryDisconnectMock      = jest.fn();
      const wetConnectMock         = jest.fn();
      const wetDisconnectMock      = jest.fn();
      const toneConnectMock        = jest.fn();
      const toneDisconnectMock     = jest.fn();
      const feedbackConnectMock    = jest.fn();
      const feedbackDisconnectMock = jest.fn();

      /* eslint-disable dot-notation */
      delay['input'].connect       = inputConnectMock;
      delay['input'].disconnect    = inputDisconnectMock;
      delay['delay'].connect       = delayConnectMock;
      delay['delay'].disconnect    = delayDisconnectMock;
      delay['dry'].connect         = dryConnectMock;
      delay['dry'].disconnect      = dryDisconnectMock;
      delay['wet'].connect         = wetConnectMock;
      delay['wet'].disconnect      = wetDisconnectMock;
      delay['tone'].connect        = toneConnectMock;
      delay['tone'].disconnect     = toneDisconnectMock;
      delay['feedback'].connect    = feedbackConnectMock;
      delay['feedback'].disconnect = feedbackDisconnectMock;
      /* eslint-enable dot-notation */

      delay.connect();

      expect(inputConnectMock).toHaveBeenCalledTimes(1);
      expect(delayConnectMock).toHaveBeenCalledTimes(0);
      expect(dryConnectMock).toHaveBeenCalledTimes(0);
      expect(wetConnectMock).toHaveBeenCalledTimes(0);
      expect(toneConnectMock).toHaveBeenCalledTimes(0);
      expect(feedbackConnectMock).toHaveBeenCalledTimes(0);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(1);
      expect(delayDisconnectMock).toHaveBeenCalledTimes(1);
      expect(dryDisconnectMock).toHaveBeenCalledTimes(1);
      expect(wetDisconnectMock).toHaveBeenCalledTimes(1);
      expect(toneDisconnectMock).toHaveBeenCalledTimes(1);
      expect(feedbackDisconnectMock).toHaveBeenCalledTimes(1);

      delay.activate();

      expect(inputConnectMock).toHaveBeenCalledTimes(3);
      expect(delayConnectMock).toHaveBeenCalledTimes(2);
      expect(dryConnectMock).toHaveBeenCalledTimes(1);
      expect(wetConnectMock).toHaveBeenCalledTimes(1);
      expect(toneConnectMock).toHaveBeenCalledTimes(1);
      expect(feedbackConnectMock).toHaveBeenCalledTimes(1);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(2);
      expect(delayDisconnectMock).toHaveBeenCalledTimes(2);
      expect(dryDisconnectMock).toHaveBeenCalledTimes(2);
      expect(wetDisconnectMock).toHaveBeenCalledTimes(2);
      expect(toneDisconnectMock).toHaveBeenCalledTimes(2);
      expect(feedbackDisconnectMock).toHaveBeenCalledTimes(2);
    });
  });

  describe(delay.param.name, () => {
    const defaultParams: DelayParams = {
      time    : 0,
      dry     : 1,
      wet     : 0,
      tone    : 350,
      feedback: 0
    };

    const params: DelayParams = {
      time    : 5,
      dry     : 0.5,
      wet     : 0.5,
      tone    : 4000,
      feedback: 0.5
    };

    beforeAll(() => {
      delay.param(params);
    });

    afterAll(() => {
      delay.param(defaultParams);
    });

    test('should return `time`', () => {
      expect(delay.param('time')).toBeCloseTo(5, 1);
    });

    test('should return `dry`', () => {
      expect(delay.param('dry')).toBeCloseTo(0.5, 1);
    });

    test('should return `wet`', () => {
      expect(delay.param('wet')).toBeCloseTo(0.5, 1);
    });

    test('should return `tone`', () => {
      expect(delay.param('tone')).toBeCloseTo(4000, 1);
    });

    test('should return `feedback`', () => {
      expect(delay.param('feedback')).toBeCloseTo(0.5, 1);
    });
  });

  describe(delay.params.name, () => {
    test('should return parameters for delay effector as associative array', () => {
      expect(delay.params()).toStrictEqual({
        state   : false,
        time    : 0,
        dry     : 1,
        wet     : 0,
        tone    : 350,
        feedback: 0
      });
    });
  });
});
