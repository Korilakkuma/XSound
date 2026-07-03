import type { DelayParams } from '/src/SoundModule/Effectors/Delay';

import { AudioContextMock } from '/mock/AudioContextMock';
import { Delay } from '/src/SoundModule/Effectors/Delay';

describe(Delay.name, () => {
  const context = new AudioContextMock();

  // @ts-expect-error Because there is not Web Audio API in Jest environment (Node.js environment), mocks Web Audio API
  const delay = new Delay(context);

  describe(delay.connect.name, () => {
    /* eslint-disable dot-notation */
    const originalInput     = delay['input'];
    const originalDelay0    = delay['delays'][0];
    const originalDelay1    = delay['delays'][1];
    const originalDry       = delay['dry'];
    const originalWet0      = delay['wets'][0];
    const originalWet1      = delay['wets'][1];
    const originalTone0     = delay['tones'][0];
    const originalTone1     = delay['tones'][1];
    const originalFeedback0 = delay['feedbacks'][0];
    const originalFeedback1 = delay['feedbacks'][1];
    const originalSplitter  = delay['splitter'];
    const originalMerger    = delay['merger'];
    /* eslint-enable dot-notation */

    afterEach(() => {
      /* eslint-disable dot-notation */
      delay['input']        = originalInput;
      delay['delays'][0]    = originalDelay0;
      delay['delays'][1]    = originalDelay1;
      delay['dry']          = originalDry;
      delay['wets'][0]      = originalWet0;
      delay['wets'][1]      = originalWet1;
      delay['tones'][0]     = originalTone0;
      delay['tones'][1]     = originalTone1;
      delay['feedbacks'][0] = originalFeedback0;
      delay['feedbacks'][1] = originalFeedback1;
      delay['splitter']     = originalSplitter;;
      delay['merger']       = originalMerger;;
      /* eslint-enable dot-notation */

      delay.param({ type: 'standard' });

      delay.deactivate();
    });

    test('should call `connect` method (if `type` is `standard`)', () => {
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
      delay['input'].connect           = inputConnectMock;
      delay['input'].disconnect        = inputDisconnectMock;
      delay['delays'][0].connect       = delayConnectMock;
      delay['delays'][0].disconnect    = delayDisconnectMock;
      delay['dry'].connect             = dryConnectMock;
      delay['dry'].disconnect          = dryDisconnectMock;
      delay['wets'][0].connect         = wetConnectMock;
      delay['wets'][0].disconnect      = wetDisconnectMock;
      delay['tones'][0].connect        = toneConnectMock;
      delay['tones'][0].disconnect     = toneDisconnectMock;
      delay['feedbacks'][0].connect    = feedbackConnectMock;
      delay['feedbacks'][0].disconnect = feedbackDisconnectMock;
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

    test('should call `connect` method (if `type` is `pingpong`)', () => {
      const inputConnectMock        = jest.fn();
      const inputDisconnectMock     = jest.fn();
      const delayConnectMock        = jest.fn();
      const delayDisconnectMock     = jest.fn();
      const postDelayConnectMock    = jest.fn();
      const postDelayDisconnectMock = jest.fn();
      const dryConnectMock          = jest.fn();
      const dryDisconnectMock       = jest.fn();
      const wetConnectMock          = jest.fn();
      const wetDisconnectMock       = jest.fn();
      const toneConnectMock         = jest.fn();
      const toneDisconnectMock      = jest.fn();
      const feedbackConnectMock     = jest.fn();
      const feedbackDisconnectMock  = jest.fn();
      const splitterConnectMock     = jest.fn();
      const splitterDisconnectMock  = jest.fn();
      const mergerConnectMock       = jest.fn();
      const mergerDisconnectMock    = jest.fn();

      /* eslint-disable dot-notation */
      delay['input'].connect           = inputConnectMock;
      delay['input'].disconnect        = inputDisconnectMock;
      delay['delays'][0].connect       = delayConnectMock;
      delay['delays'][0].disconnect    = delayDisconnectMock;
      delay['delays'][1].connect       = postDelayConnectMock;
      delay['delays'][1].disconnect    = postDelayDisconnectMock;
      delay['dry'].connect             = dryConnectMock;
      delay['dry'].disconnect          = dryDisconnectMock;
      delay['wets'][0].connect         = wetConnectMock;
      delay['wets'][0].disconnect      = wetDisconnectMock;
      delay['tones'][0].connect        = toneConnectMock;
      delay['tones'][0].disconnect     = toneDisconnectMock;
      delay['feedbacks'][0].connect    = feedbackConnectMock;
      delay['feedbacks'][0].disconnect = feedbackDisconnectMock;
      delay['splitter'].connect        = splitterConnectMock;
      delay['splitter'].disconnect     = splitterDisconnectMock;
      delay['merger'].connect          = mergerConnectMock;
      delay['merger'].disconnect       = mergerDisconnectMock;
      /* eslint-enable dot-notation */

      delay.param({ type: 'pingpong' });

      expect(inputConnectMock).toHaveBeenCalledTimes(1);
      expect(delayConnectMock).toHaveBeenCalledTimes(0);
      expect(postDelayConnectMock).toHaveBeenCalledTimes(0);
      expect(dryConnectMock).toHaveBeenCalledTimes(0);
      expect(wetConnectMock).toHaveBeenCalledTimes(0);
      expect(toneConnectMock).toHaveBeenCalledTimes(0);
      expect(feedbackConnectMock).toHaveBeenCalledTimes(0);
      expect(splitterConnectMock).toHaveBeenCalledTimes(0);
      expect(mergerConnectMock).toHaveBeenCalledTimes(0);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(1);
      expect(delayDisconnectMock).toHaveBeenCalledTimes(1);
      expect(postDelayDisconnectMock).toHaveBeenCalledTimes(1);
      expect(dryDisconnectMock).toHaveBeenCalledTimes(1);
      expect(wetDisconnectMock).toHaveBeenCalledTimes(1);
      expect(toneDisconnectMock).toHaveBeenCalledTimes(1);
      expect(feedbackDisconnectMock).toHaveBeenCalledTimes(1);
      expect(splitterDisconnectMock).toHaveBeenCalledTimes(2);
      expect(mergerDisconnectMock).toHaveBeenCalledTimes(1);

      delay.activate();

      expect(inputConnectMock).toHaveBeenCalledTimes(3);
      expect(delayConnectMock).toHaveBeenCalledTimes(2);
      expect(postDelayConnectMock).toHaveBeenCalledTimes(2);
      expect(dryConnectMock).toHaveBeenCalledTimes(1);
      expect(wetConnectMock).toHaveBeenCalledTimes(1);
      expect(toneConnectMock).toHaveBeenCalledTimes(1);
      expect(feedbackConnectMock).toHaveBeenCalledTimes(1);
      expect(splitterConnectMock).toHaveBeenCalledTimes(2);
      expect(mergerConnectMock).toHaveBeenCalledTimes(1);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(2);
      expect(delayDisconnectMock).toHaveBeenCalledTimes(2);
      expect(postDelayDisconnectMock).toHaveBeenCalledTimes(2);
      expect(dryDisconnectMock).toHaveBeenCalledTimes(2);
      expect(wetDisconnectMock).toHaveBeenCalledTimes(2);
      expect(toneDisconnectMock).toHaveBeenCalledTimes(2);
      expect(feedbackDisconnectMock).toHaveBeenCalledTimes(2);
      expect(splitterDisconnectMock).toHaveBeenCalledTimes(4);
      expect(mergerDisconnectMock).toHaveBeenCalledTimes(2);
    });

    test('should call `connect` method (if `type` is `stereo`)', () => {
      const inputConnectMock        = jest.fn();
      const inputDisconnectMock     = jest.fn();
      const delay0ConnectMock       = jest.fn();
      const delay0DisconnectMock    = jest.fn();
      const delay1ConnectMock       = jest.fn();
      const delay1DisconnectMock    = jest.fn();
      const dryConnectMock          = jest.fn();
      const dryDisconnectMock       = jest.fn();
      const wet0ConnectMock         = jest.fn();
      const wet0DisconnectMock      = jest.fn();
      const wet1ConnectMock         = jest.fn();
      const wet1DisconnectMock      = jest.fn();
      const tone0ConnectMock        = jest.fn();
      const tone0DisconnectMock     = jest.fn();
      const tone1ConnectMock        = jest.fn();
      const tone1DisconnectMock     = jest.fn();
      const feedback0ConnectMock    = jest.fn();
      const feedback0DisconnectMock = jest.fn();
      const feedback1ConnectMock    = jest.fn();
      const feedback1DisconnectMock = jest.fn();
      const splitterConnectMock     = jest.fn();
      const splitterDisconnectMock  = jest.fn();
      const mergerConnectMock       = jest.fn();
      const mergerDisconnectMock    = jest.fn();

      /* eslint-disable dot-notation */
      delay['input'].connect           = inputConnectMock;
      delay['input'].disconnect        = inputDisconnectMock;
      delay['delays'][0].connect       = delay0ConnectMock;
      delay['delays'][0].disconnect    = delay0DisconnectMock;
      delay['delays'][1].connect       = delay1ConnectMock;
      delay['delays'][1].disconnect    = delay1DisconnectMock;
      delay['dry'].connect             = dryConnectMock;
      delay['dry'].disconnect          = dryDisconnectMock;
      delay['wets'][0].connect         = wet0ConnectMock;
      delay['wets'][0].disconnect      = wet0DisconnectMock;
      delay['wets'][1].connect         = wet1ConnectMock;
      delay['wets'][1].disconnect      = wet1DisconnectMock;
      delay['tones'][0].connect        = tone0ConnectMock;
      delay['tones'][0].disconnect     = tone0DisconnectMock;
      delay['tones'][1].connect        = tone1ConnectMock;
      delay['tones'][1].disconnect     = tone1DisconnectMock;
      delay['feedbacks'][0].connect    = feedback0ConnectMock;
      delay['feedbacks'][0].disconnect = feedback0DisconnectMock;
      delay['feedbacks'][1].connect    = feedback1ConnectMock;
      delay['feedbacks'][1].disconnect = feedback1DisconnectMock;
      delay['splitter'].connect        = splitterConnectMock;
      delay['splitter'].disconnect     = splitterDisconnectMock;
      delay['merger'].connect          = mergerConnectMock;
      delay['merger'].disconnect       = mergerDisconnectMock;
      /* eslint-enable dot-notation */

      delay.param({ type: 'stereo' });

      expect(inputConnectMock).toHaveBeenCalledTimes(1);
      expect(delay0ConnectMock).toHaveBeenCalledTimes(0);
      expect(delay1ConnectMock).toHaveBeenCalledTimes(0);
      expect(dryConnectMock).toHaveBeenCalledTimes(0);
      expect(wet0ConnectMock).toHaveBeenCalledTimes(0);
      expect(wet1ConnectMock).toHaveBeenCalledTimes(0);
      expect(tone0ConnectMock).toHaveBeenCalledTimes(0);
      expect(tone1ConnectMock).toHaveBeenCalledTimes(0);
      expect(feedback0ConnectMock).toHaveBeenCalledTimes(0);
      expect(feedback1ConnectMock).toHaveBeenCalledTimes(0);
      expect(splitterConnectMock).toHaveBeenCalledTimes(0);
      expect(mergerConnectMock).toHaveBeenCalledTimes(0);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(1);
      expect(delay0DisconnectMock).toHaveBeenCalledTimes(1);
      expect(delay1DisconnectMock).toHaveBeenCalledTimes(1);
      expect(dryDisconnectMock).toHaveBeenCalledTimes(1);
      expect(wet0DisconnectMock).toHaveBeenCalledTimes(1);
      expect(wet1DisconnectMock).toHaveBeenCalledTimes(1);
      expect(tone0DisconnectMock).toHaveBeenCalledTimes(1);
      expect(tone1DisconnectMock).toHaveBeenCalledTimes(1);
      expect(feedback0DisconnectMock).toHaveBeenCalledTimes(1);
      expect(feedback1DisconnectMock).toHaveBeenCalledTimes(1);
      expect(splitterDisconnectMock).toHaveBeenCalledTimes(2);
      expect(mergerDisconnectMock).toHaveBeenCalledTimes(1);

      delay.activate();

      expect(inputConnectMock).toHaveBeenCalledTimes(3);
      expect(delay0ConnectMock).toHaveBeenCalledTimes(2);
      expect(delay1ConnectMock).toHaveBeenCalledTimes(2);
      expect(dryConnectMock).toHaveBeenCalledTimes(1);
      expect(wet0ConnectMock).toHaveBeenCalledTimes(1);
      expect(wet1ConnectMock).toHaveBeenCalledTimes(1);
      expect(tone0ConnectMock).toHaveBeenCalledTimes(1);
      expect(tone1ConnectMock).toHaveBeenCalledTimes(1);
      expect(feedback0ConnectMock).toHaveBeenCalledTimes(1);
      expect(feedback1ConnectMock).toHaveBeenCalledTimes(1);
      expect(splitterConnectMock).toHaveBeenCalledTimes(2);
      expect(mergerConnectMock).toHaveBeenCalledTimes(1);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(2);
      expect(delay0DisconnectMock).toHaveBeenCalledTimes(2);
      expect(delay1DisconnectMock).toHaveBeenCalledTimes(2);
      expect(dryDisconnectMock).toHaveBeenCalledTimes(2);
      expect(wet0DisconnectMock).toHaveBeenCalledTimes(2);
      expect(wet1DisconnectMock).toHaveBeenCalledTimes(2);
      expect(tone0DisconnectMock).toHaveBeenCalledTimes(2);
      expect(tone1DisconnectMock).toHaveBeenCalledTimes(2);
      expect(feedback0DisconnectMock).toHaveBeenCalledTimes(2);
      expect(feedback1DisconnectMock).toHaveBeenCalledTimes(2);
      expect(splitterDisconnectMock).toHaveBeenCalledTimes(4);
      expect(mergerDisconnectMock).toHaveBeenCalledTimes(2);
    });
  });

  describe(delay.param.name, () => {
    const defaultParams: DelayParams = {
      type    : 'standard',
      time    : [0, 0],
      dry     : 1,
      wet     : [0, 0],
      tone    : [350, 350],
      feedback: [0, 0]
    };

    describe('`type` is `pingpong`', () => {
      const params: DelayParams = {
        type    : 'pingpong',
        time    : 5,
        dry     : 0.5,
        wet     : 0.5,
        tone    : 4000,
        feedback: 0.5
      };

      delay.param(params);

      afterAll(() => {
        delay.param(defaultParams);
      });

      // Setter
      test('should return instance of `Delay`', () => {
        expect(delay.param(params)).toBeInstanceOf(Delay);
      });

      // Getter
      test('should return `type`', () => {
        expect(delay.param('type')).toBe('pingpong');
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

    describe('`type` is `stereo`', () => {
      const params: DelayParams = {
        type    : 'stereo',
        time    : [1, 2],
        dry     : 0.5,
        wet     : [0.25, 0.75],
        tone    : [4000, 8000],
        feedback: [0.25, 0.75]
      };

      delay.param(params);

      afterAll(() => {
        delay.param(defaultParams);
      });

      // Setter
      test('should return instance of `Delay`', () => {
        expect(delay.param(params)).toBeInstanceOf(Delay);
      });

      // Getter
      test('should return `type`', () => {
        expect(delay.param('type')).toBe('stereo');
      });

      test('should return `time`', () => {
        expect(delay.param('time')).toStrictEqual([1, 2]);
      });

      test('should return `dry`', () => {
        expect(delay.param('dry')).toBeCloseTo(0.5, 1);
      });

      test('should return `wet`', () => {
        expect(delay.param('wet')).toStrictEqual([0.25, 0.75]);
      });

      test('should return `tone`', () => {
        expect(delay.param('tone')).toStrictEqual([4000, 8000]);
      });

      test('should return `feedback`', () => {
        expect(delay.param('feedback')).toStrictEqual([0.25, 0.75]);
      });
    });
  });

  describe(delay.params.name, () => {
    test('should return parameters for delay effector as associative array (if `type` is `standard`)', () => {
      delay.param({ type: 'standard' });

      expect(delay.params()).toStrictEqual({
        state   : false,
        type    : 'standard',
        time    : 0,
        dry     : 1,
        wet     : 0,
        tone    : 350,
        feedback: 0
      });
    });

    test('should return parameters for delay effector as associative array (if `type` is `pingpong`)', () => {
      delay.param({ type: 'pingpong' });

      expect(delay.params()).toStrictEqual({
        state   : false,
        type    : 'pingpong',
        time    : 0,
        dry     : 1,
        wet     : 0,
        tone    : 350,
        feedback: 0
      });
    });

    test('should return parameters for delay effector as associative array (if `type` is `stereo`)', () => {
      delay.param({ type: 'stereo' });

      expect(delay.params()).toStrictEqual({
        state   : false,
        type    : 'stereo',
        time    : [0, 0],
        dry     : 1,
        wet     : [0, 0],
        tone    : [350, 350],
        feedback: [0, 0]
      });
    });
  });

  describe(delay.activate.name, () => {
    test('should call `connect` method', () => {
      const originalConnect = delay.connect;

      const connectMock = jest.fn();

      delay.connect = connectMock;

      delay.activate();

      expect(connectMock).toHaveBeenCalledTimes(1);

      delay.connect = originalConnect;
    });
  });

  describe(delay.deactivate.name, () => {
    test('should call `connect` method', () => {
      const originalConnect = delay.connect;

      const connectMock = jest.fn();

      delay.connect = connectMock;

      delay.deactivate();

      expect(connectMock).toHaveBeenCalledTimes(1);

      delay.connect = originalConnect;
    });
  });
});
