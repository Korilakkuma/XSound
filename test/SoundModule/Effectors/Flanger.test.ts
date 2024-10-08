import type { FlangerParams } from '/src/SoundModule/Effectors/Flanger';

import { AudioContextMock } from '/mock/AudioContextMock';
import { Flanger } from '/src/SoundModule/Effectors/Flanger';

describe(Flanger.name, () => {
  const context = new AudioContextMock();

  // @ts-expect-error Because there is not Web Audio API in Jest environment (Node.js environment), mocks Web Audio API
  const flanger = new Flanger(context);

  describe(flanger.stop.name, () => {
    /* eslint-disable dot-notation */
    const originalLFO   = flanger['lfo'];
    const originalDepth = flanger['depth'];
    /* eslint-enable dot-notation */

    afterAll(() => {
      /* eslint-disable dot-notation */
      flanger['lfo']   = originalLFO;
      flanger['depth'] = originalDepth;
      /* eslint-enable dot-notation */

      flanger.deactivate();
    });

    test('should call `connect` method', () => {
      const lfoStartMock     = jest.fn();
      const lfoStopMock      = jest.fn();
      const lfoConnectMock   = jest.fn();
      const depthConnectMock = jest.fn();

      /* eslint-disable dot-notation */
      flanger['lfo'].start           = lfoStartMock;
      flanger['lfo'].stop            = lfoStopMock;
      flanger['lfo'].connect         = lfoConnectMock;
      flanger['lfo'].type            = 'sine';
      flanger['lfo'].frequency.value = 10;
      flanger['depth'].connect       = depthConnectMock;
      /* eslint-enable dot-notation */

      flanger.stop(0, 0);

      expect(lfoStartMock).toHaveBeenCalledTimes(0);
      expect(lfoStopMock).toHaveBeenCalledTimes(0);
      expect(lfoConnectMock).toHaveBeenCalledTimes(0);
      expect(depthConnectMock).toHaveBeenCalledTimes(0);

      flanger.activate();
      flanger.stop(0, 0);

      expect(lfoStartMock).toHaveBeenCalledTimes(1);
      expect(lfoStopMock).toHaveBeenCalledTimes(1);
      expect(lfoConnectMock).toHaveBeenCalledTimes(0);  // Because of new instance of `OscillatorNode`
      expect(depthConnectMock).toHaveBeenCalledTimes(1);
    });
  });

  describe(flanger.connect.name, () => {
    /* eslint-disable dot-notation */
    const originalInput    = flanger['input'];
    const originalDelay    = flanger['delay'];
    const originalDry      = flanger['dry'];
    const originalWet      = flanger['wet'];
    const originalTone     = flanger['tone'];
    const originalFeedback = flanger['feedback'];
    /* eslint-enable dot-notation */

    afterAll(() => {
      /* eslint-disable dot-notation */
      flanger['input']    = originalInput;
      flanger['delay']    = originalDelay;
      flanger['dry']      = originalDry;
      flanger['wet']      = originalWet;
      flanger['tone']     = originalTone;
      flanger['feedback'] = originalFeedback;
      /* eslint-enable dot-notation */

      flanger.deactivate();
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
      flanger['input'].connect       = inputConnectMock;
      flanger['input'].disconnect    = inputDisconnectMock;
      flanger['delay'].connect       = delayConnectMock;
      flanger['delay'].disconnect    = delayDisconnectMock;
      flanger['dry'].connect         = dryConnectMock;
      flanger['dry'].disconnect      = dryDisconnectMock;
      flanger['wet'].connect         = wetConnectMock;
      flanger['wet'].disconnect      = wetDisconnectMock;
      flanger['tone'].connect        = toneConnectMock;
      flanger['tone'].disconnect     = toneDisconnectMock;
      flanger['feedback'].connect    = feedbackConnectMock;
      flanger['feedback'].disconnect = feedbackDisconnectMock;
      /* eslint-enable dot-notation */

      flanger.connect();

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

      flanger.activate();

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

  describe(flanger.param.name, () => {
    const defaultParams: FlangerParams = {
      time    : 0,
      depth   : 0,
      rate    : 0,
      mix     : 0,
      tone    : 350,
      feedback: 0
    };

    const params: FlangerParams = {
      time    : 0.25,
      depth   : 0.5,
      rate    : 0.5,
      mix     : 0.5,
      dry     : 0.5,
      wet     : 0.5,
      tone    : 4000,
      feedback: 0.5
    };

    beforeAll(() => {
      flanger.param(params);
    });

    afterAll(() => {
      flanger.param(defaultParams);
    });

    // Setter
    test('should return instance of `Flanger`', () => {
      expect(flanger.param(params)).toBeInstanceOf(Flanger);
    });

    // Getter
    test('should return `time`', () => {
      expect(flanger.param('time')).toBeCloseTo(0.25, 2);
    });

    test('should return `depth`', () => {
      expect(flanger.param('depth')).toBeCloseTo(0.5, 1);
    });

    test('should return `rate`', () => {
      expect(flanger.param('rate')).toBeCloseTo(0.5, 1);
    });

    test('should return `mix`', () => {
      expect(flanger.param('mix')).toBeCloseTo(0.5, 1);
    });

    test('should return `dry`', () => {
      expect(flanger.param('dry')).toBeCloseTo(0.5, 1);
    });

    test('should return `wet`', () => {
      expect(flanger.param('wet')).toBeCloseTo(0.5, 1);
    });

    test('should return `tone`', () => {
      expect(flanger.param('tone')).toBeCloseTo(4000, 1);
    });

    test('should return `feedback`', () => {
      expect(flanger.param('feedback')).toBeCloseTo(0.5, 1);
    });
  });

  describe(flanger.params.name, () => {
    test('should return parameters for flanger effector as associative array', () => {
      expect(flanger.params()).toStrictEqual({
        state   : false,
        time    : 0,
        depth   : 0,
        rate    : 0,
        mix     : 0,
        dry     : 1,
        wet     : 0,
        tone    : 350,
        feedback: 0
      });
    });
  });

  describe(flanger.activate.name, () => {
    test('should call `connect` method and start LFO', () => {
      const originalConnect = flanger.connect;

      // eslint-disable-next-line dot-notation
      const originalLFO = flanger['lfo'];

      const connectMock  = jest.fn();
      const lfoStartMock = jest.fn();

      flanger.connect = connectMock;

      // eslint-disable-next-line dot-notation
      flanger['lfo'].start = lfoStartMock;

      flanger.activate();

      expect(connectMock).toHaveBeenCalledTimes(1);
      expect(lfoStartMock).toHaveBeenCalledTimes(1);

      flanger.connect = originalConnect;

      // eslint-disable-next-line dot-notation
      flanger['lfo'] = originalLFO;
    });
  });

  describe(flanger.deactivate.name, () => {
    test('should call `connect` method and stop LFO', () => {
      const originalConnect = flanger.connect;

      // eslint-disable-next-line dot-notation
      const originalLFO = flanger['lfo'];

      const connectMock = jest.fn();
      const lfoStopMock = jest.fn();

      flanger.connect = connectMock;

      // eslint-disable-next-line dot-notation
      flanger['lfo'].stop = lfoStopMock;

      flanger.deactivate();

      expect(connectMock).toHaveBeenCalledTimes(1);
      expect(lfoStopMock).toHaveBeenCalledTimes(1);

      flanger.connect = originalConnect;

      // eslint-disable-next-line dot-notation
      flanger['lfo'] = originalLFO;
    });
  });
});
