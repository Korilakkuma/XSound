import { AudioContextMock } from '../../../mock/AudioContextMock';
import { Chorus, ChorusParams } from '../../../src/SoundModule/Effectors/Chorus';

describe(Chorus.name, () => {
  const context = new AudioContextMock();

  // @ts-ignore
  const chorus = new Chorus(context);

  describe(chorus.stop.name, () => {
    /* eslint-disable dot-notation */
    const originalLFO   = chorus['lfo'];
    const originalDepth = chorus['depth'];
    /* eslint-enable dot-notation */

    afterAll(() => {
      /* eslint-disable dot-notation */
      chorus['lfo']   = originalLFO;
      chorus['depth'] = originalDepth;
      /* eslint-enable dot-notation */

      chorus.deactivate();
    });

    test('should call `connect` method', () => {
      const lfoStartMock     = jest.fn();
      const lfoStopMock      = jest.fn();
      const lfoConnectMock   = jest.fn();
      const depthConnectMock = jest.fn();

      /* eslint-disable dot-notation */
      chorus['lfo'].start           = lfoStartMock;
      chorus['lfo'].stop            = lfoStopMock;
      chorus['lfo'].connect         = lfoConnectMock;
      chorus['lfo'].type            = 'sine';
      chorus['lfo'].frequency.value = 10;
      chorus['depth'].connect       = depthConnectMock;
      /* eslint-enable dot-notation */

      chorus.stop(0, 0);

      expect(lfoStartMock).toHaveBeenCalledTimes(0);
      expect(lfoStopMock).toHaveBeenCalledTimes(0);
      expect(lfoConnectMock).toHaveBeenCalledTimes(0);
      expect(depthConnectMock).toHaveBeenCalledTimes(0);

      chorus.activate();
      chorus.stop(0, 0);

      expect(lfoStartMock).toHaveBeenCalledTimes(1);
      expect(lfoStopMock).toHaveBeenCalledTimes(1);
      expect(lfoConnectMock).toHaveBeenCalledTimes(0);  // Because of new instance of `OscillatorNode`
      expect(depthConnectMock).toHaveBeenCalledTimes(1);
    });
  });

  describe(chorus.connect.name, () => {
    /* eslint-disable dot-notation */
    const originalInput    = chorus['input'];
    const originalDelay    = chorus['delay'];
    const originalMix      = chorus['mix'];
    const originalTone     = chorus['tone'];
    const originalFeedback = chorus['feedback'];
    /* eslint-enable dot-notation */

    afterAll(() => {
      /* eslint-disable dot-notation */
      chorus['input']    = originalInput;
      chorus['delay']    = originalDelay;
      chorus['mix']      = originalMix;
      chorus['tone']     = originalTone;
      chorus['feedback'] = originalFeedback;
      /* eslint-enable dot-notation */

      chorus.deactivate();
    });

    test('should call `connect` method', () => {
      const inputConnectMock       = jest.fn();
      const inputDisconnectMock    = jest.fn();
      const delayConnectMock       = jest.fn();
      const delayDisconnectMock    = jest.fn();
      const mixConnectMock         = jest.fn();
      const mixDisconnectMock      = jest.fn();
      const toneConnectMock        = jest.fn();
      const toneDisconnectMock     = jest.fn();
      const feedbackConnectMock    = jest.fn();
      const feedbackDisconnectMock = jest.fn();

      /* eslint-disable dot-notation */
      chorus['input'].connect       = inputConnectMock;
      chorus['input'].disconnect    = inputDisconnectMock;
      chorus['delay'].connect       = delayConnectMock;
      chorus['delay'].disconnect    = delayDisconnectMock;
      chorus['mix'].connect         = mixConnectMock;
      chorus['mix'].disconnect      = mixDisconnectMock;
      chorus['tone'].connect        = toneConnectMock;
      chorus['tone'].disconnect     = toneDisconnectMock;
      chorus['feedback'].connect    = feedbackConnectMock;
      chorus['feedback'].disconnect = feedbackDisconnectMock;
      /* eslint-enable dot-notation */

      chorus.connect();

      expect(inputConnectMock).toHaveBeenCalledTimes(1);
      expect(delayConnectMock).toHaveBeenCalledTimes(0);
      expect(mixConnectMock).toHaveBeenCalledTimes(0);
      expect(toneConnectMock).toHaveBeenCalledTimes(0);
      expect(feedbackConnectMock).toHaveBeenCalledTimes(0);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(1);
      expect(delayDisconnectMock).toHaveBeenCalledTimes(1);
      expect(mixDisconnectMock).toHaveBeenCalledTimes(1);
      expect(toneDisconnectMock).toHaveBeenCalledTimes(1);
      expect(feedbackDisconnectMock).toHaveBeenCalledTimes(1);

      chorus.activate();

      expect(inputConnectMock).toHaveBeenCalledTimes(3);
      expect(delayConnectMock).toHaveBeenCalledTimes(2);
      expect(mixConnectMock).toHaveBeenCalledTimes(1);
      expect(toneConnectMock).toHaveBeenCalledTimes(1);
      expect(feedbackConnectMock).toHaveBeenCalledTimes(1);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(2);
      expect(delayDisconnectMock).toHaveBeenCalledTimes(2);
      expect(mixDisconnectMock).toHaveBeenCalledTimes(2);
      expect(toneDisconnectMock).toHaveBeenCalledTimes(2);
      expect(feedbackDisconnectMock).toHaveBeenCalledTimes(2);
    });
  });

  describe(chorus.param.name, () => {
    const defaultParams: ChorusParams = {
      time    : 0,
      depth   : 0,
      rate    : 0,
      mix     : 0,
      tone    : 350,
      feedback: 0
    };

    const params: ChorusParams = {
      time    : 0.25,
      depth   : 0.5,
      rate    : 0.5,
      mix     : 0.5,
      tone    : 4000,
      feedback: 0.5
    };

    beforeAll(() => {
      chorus.param(params);
    });

    afterAll(() => {
      chorus.param(defaultParams);
    });

    test('should return time', () => {
      expect(chorus.param('time')).toBeCloseTo(0.25, 2);
    });

    test('should return depth', () => {
      expect(chorus.param('depth')).toBeCloseTo(0.5, 1);
    });

    test('should return rate', () => {
      expect(chorus.param('rate')).toBeCloseTo(0.5, 1);
    });

    test('should return mix', () => {
      expect(chorus.param('mix')).toBeCloseTo(0.5, 1);
    });

    test('should return tone', () => {
      expect(chorus.param('tone')).toBeCloseTo(4000, 1);
    });

    test('should return feedback', () => {
      expect(chorus.param('feedback')).toBeCloseTo(0.5, 1);
    });
  });

  describe(chorus.params.name, () => {
    test('should return parameters for chorus effector as associative array', () => {
      expect(chorus.params()).toStrictEqual({
        state   : false,
        time    : 0,
        depth   : 0,
        rate    : 0,
        mix     : 0,
        tone    : 350,
        feedback: 0
      });
    });
  });
});
