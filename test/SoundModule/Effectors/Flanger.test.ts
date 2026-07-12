import type { FlangerParams } from '/src/SoundModule/Effectors/Flanger';

import { AudioContextMock } from '/mock/AudioContextMock';
import { Flanger } from '/src/SoundModule/Effectors/Flanger';

describe(Flanger.name, () => {
  const context = new AudioContextMock();

  // @ts-expect-error Because there is not Web Audio API in Jest environment (Node.js environment), mocks Web Audio API
  const flanger = new Flanger(context);

  describe(flanger.stop.name, () => {
    /* eslint-disable dot-notation */
    const originalLFO0   = flanger['lfos'][0];
    const originalDepth0 = flanger['depths'][0];
    const originalLFO1   = flanger['lfos'][1];
    const originalDepth1 = flanger['depths'][1];
    /* eslint-enable dot-notation */

    afterAll(() => {
      /* eslint-disable dot-notation */
      flanger['lfos'][0]   = originalLFO0;
      flanger['lfos'][1]   = originalLFO1;
      flanger['depths'][0] = originalDepth0;
      flanger['depths'][1] = originalDepth1;
      /* eslint-enable dot-notation */

      flanger.param({ type: 'standard' });

      flanger.deactivate();
    });

    test('should call `connect` method', () => {
      const lfo0StartMock     = jest.fn();
      const lfo0StopMock      = jest.fn();
      const lfo0ConnectMock   = jest.fn();
      const lfo1StartMock     = jest.fn();
      const lfo1StopMock      = jest.fn();
      const lfo1ConnectMock   = jest.fn();
      const depth0ConnectMock = jest.fn();
      const depth1ConnectMock = jest.fn();

      /* eslint-disable dot-notation */
      flanger['lfos'][0].start           = lfo0StartMock;
      flanger['lfos'][0].stop            = lfo0StopMock;
      flanger['lfos'][0].connect         = lfo0ConnectMock;
      flanger['lfos'][0].type            = 'sine';
      flanger['lfos'][0].frequency.value = 10;
      flanger['lfos'][1].start           = lfo1StartMock;
      flanger['lfos'][1].stop            = lfo1StopMock;
      flanger['lfos'][1].connect         = lfo1ConnectMock;
      flanger['lfos'][1].type            = 'sine';
      flanger['lfos'][1].frequency.value = 10;
      flanger['depths'][0].connect       = depth0ConnectMock;
      flanger['depths'][1].connect       = depth1ConnectMock;
      /* eslint-enable dot-notation */

      flanger.activate();
      flanger.stop(0, 0);

      expect(lfo0StartMock).toHaveBeenCalledTimes(1);
      expect(lfo0StopMock).toHaveBeenCalledTimes(1);
      expect(lfo0ConnectMock).toHaveBeenCalledTimes(0);  // Because of new instance of `OscillatorNode`
      expect(lfo1StartMock).toHaveBeenCalledTimes(1);
      expect(lfo1StopMock).toHaveBeenCalledTimes(1);
      expect(lfo1ConnectMock).toHaveBeenCalledTimes(0);  // Because of new instance of `OscillatorNode`
      expect(depth0ConnectMock).toHaveBeenCalledTimes(1);
      expect(depth1ConnectMock).toHaveBeenCalledTimes(1);
    });
  });

  describe(flanger.connect.name, () => {
    /* eslint-disable dot-notation */
    const originalInput     = flanger['input'];
    const originalDelay0    = flanger['delays'][0];
    const originalDelay1    = flanger['delays'][1];
    const originalDry       = flanger['dry'];
    const originalWet0      = flanger['wets'][0];
    const originalWet1      = flanger['wets'][1];
    const originalTone0     = flanger['tones'][0];
    const originalTone1     = flanger['tones'][1];
    const originalFeedback0 = flanger['feedbacks'][0];
    const originalFeedback1 = flanger['feedbacks'][1];
    /* eslint-enable dot-notation */

    afterEach(() => {
      /* eslint-disable dot-notation */
      flanger['input']        = originalInput;
      flanger['delays'][0]    = originalDelay0;
      flanger['delays'][1]    = originalDelay1;
      flanger['dry']          = originalDry;
      flanger['wets'][0]      = originalWet0;
      flanger['wets'][1]      = originalWet1;
      flanger['tones'][0]     = originalTone0;
      flanger['tones'][1]     = originalTone1;
      flanger['feedbacks'][0] = originalFeedback0;
      flanger['feedbacks'][1] = originalFeedback1;
      /* eslint-enable dot-notation */

      flanger.param({ type: 'standard' });

      flanger.deactivate();
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
      flanger['input'].connect           = inputConnectMock;
      flanger['input'].disconnect        = inputDisconnectMock;
      flanger['delays'][0].connect       = delayConnectMock;
      flanger['delays'][0].disconnect    = delayDisconnectMock;
      flanger['dry'].connect             = dryConnectMock;
      flanger['dry'].disconnect          = dryDisconnectMock;
      flanger['wets'][0].connect         = wetConnectMock;
      flanger['wets'][0].disconnect      = wetDisconnectMock;
      flanger['tones'][0].connect        = toneConnectMock;
      flanger['tones'][0].disconnect     = toneDisconnectMock;
      flanger['feedbacks'][0].connect    = feedbackConnectMock;
      flanger['feedbacks'][0].disconnect = feedbackDisconnectMock;
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
      flanger['input'].connect           = inputConnectMock;
      flanger['input'].disconnect        = inputDisconnectMock;
      flanger['delays'][0].connect       = delay0ConnectMock;
      flanger['delays'][0].disconnect    = delay0DisconnectMock;
      flanger['delays'][1].connect       = delay1ConnectMock;
      flanger['delays'][1].disconnect    = delay1DisconnectMock;
      flanger['dry'].connect             = dryConnectMock;
      flanger['dry'].disconnect          = dryDisconnectMock;
      flanger['wets'][0].connect         = wet0ConnectMock;
      flanger['wets'][0].disconnect      = wet0DisconnectMock;
      flanger['wets'][1].connect         = wet1ConnectMock;
      flanger['wets'][1].disconnect      = wet1DisconnectMock;
      flanger['tones'][0].connect        = tone0ConnectMock;
      flanger['tones'][0].disconnect     = tone0DisconnectMock;
      flanger['tones'][1].connect        = tone1ConnectMock;
      flanger['tones'][1].disconnect     = tone1DisconnectMock;
      flanger['feedbacks'][0].connect    = feedback0ConnectMock;
      flanger['feedbacks'][0].disconnect = feedback0DisconnectMock;
      flanger['feedbacks'][1].connect    = feedback1ConnectMock;
      flanger['feedbacks'][1].disconnect = feedback1DisconnectMock;
      flanger['splitter'].connect        = splitterConnectMock;
      flanger['splitter'].disconnect     = splitterDisconnectMock;
      flanger['merger'].connect          = mergerConnectMock;
      flanger['merger'].disconnect       = mergerDisconnectMock;
      /* eslint-enable dot-notation */

      flanger.param({ type: 'stereo' });

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

      flanger.activate();

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
      expect(inputDisconnectMock).toHaveBeenCalledTimes(2);
      expect(delay0DisconnectMock).toHaveBeenCalledTimes(2);
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

  describe(flanger.param.name, () => {
    const defaultParams: FlangerParams = {
      type    : 'standard',
      time    : [0, 0],
      depth   : [0, 0],
      rate    : [0, 0],
      mix     : [0, 0],
      dry     : 1,
      wet     : [0, 0],
      tone    : [350, 350],
      feedback: [0, 0]
    };

    describe('`type` is `standard`', () => {
      const params: FlangerParams = {
        type    : 'standard',
        time    : 0.25,
        depth   : 0.5,
        rate    : 0.5,
        mix     : 0.5,
        dry     : 0.5,
        wet     : 0.5,
        tone    : 4000,
        feedback: 0.5
      };

      flanger.param(params);

      afterAll(() => {
        flanger.param(defaultParams);
      });

      // Setter
      test('should return instance of `Chorus`', () => {
        expect(flanger.param(params)).toBeInstanceOf(Flanger);
      });

      // Getter
      test('should return `type`', () => {
        expect(flanger.param('type')).toBe('standard');
      });

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

    describe('`type` is `stereo`', () => {
      const params: FlangerParams = {
        type    : 'stereo',
        time    : [0.25, 0.50],
        depth   : [0.50, 0.75],
        rate    : [0.25, 0.50],
        mix     : [0.50, 0.75],
        dry     : 0.5,
        wet     : [0.50, 0.75],
        tone    : [4000, 8000],
        feedback: [0.25, 0.50],
      };

      flanger.param(params);

      afterAll(() => {
        flanger.param(defaultParams);
      });

      // Setter
      test('should return instance of `Flanger`', () => {
        expect(flanger.param(params)).toBeInstanceOf(Flanger);
      });

      // Getter
      test('should return `type`', () => {
        expect(flanger.param('type')).toBe('stereo');
      });

      test('should return `time`', () => {
        expect(flanger.param('time')).toStrictEqual([0.25, 0.50]);
      });

      test('should return `depth`', () => {
        expect(flanger.param('depth')).toStrictEqual([0.50, 0.75]);
      });

      test('should return `rate`', () => {
        expect(flanger.param('rate')).toStrictEqual([0.25, 0.50]);
      });

      test('should return `mix`', () => {
        expect(flanger.param('mix')).toStrictEqual([0.50, 0.75]);
      });

      test('should return `dry`', () => {
        expect(flanger.param('dry')).toBeCloseTo(0.5, 1);
      });

      test('should return `wet`', () => {
        expect(flanger.param('wet')).toStrictEqual([0.50, 0.75]);
      });

      test('should return `tone`', () => {
        expect(flanger.param('tone')).toStrictEqual([4000, 8000]);
      });

      test('should return `feedback`', () => {
        expect(flanger.param('feedback')).toStrictEqual([0.25, 0.50]);
      });
    });
  });

  describe(flanger.params.name, () => {
    test('should return parameters for flanger effector as associative array (if `type` is `standard`)', () => {
      expect(flanger.params()).toStrictEqual({
        state   : false,
        type    : 'standard',
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

    test('should return parameters for flanger effector as associative array (if `type` is `stereo`)', () => {
      flanger.param({ type: 'stereo' });

      expect(flanger.params()).toStrictEqual({
        state   : false,
        type    : 'stereo',
        time    : [0, 0],
        depth   : [0, 0],
        rate    : [0, 0],
        mix     : [0, 0],
        dry     : 1,
        wet     : [0, 0],
        tone    : [350, 350],
        feedback: [0, 0]
      });
    });
  });

  describe(flanger.activate.name, () => {
    test('should call `connect` method and start LFO', () => {
      const originalConnect = flanger.connect;

      /* eslint-disable dot-notation */
      const originalLFO0 = flanger['lfos'][0];
      const originalLFO1 = flanger['lfos'][1];
      /* eslint-enable dot-notation */

      const connectMock   = jest.fn();
      const lfo0StartMock = jest.fn();
      const lfo1StartMock = jest.fn();

      flanger.connect = connectMock;

      /* eslint-disable dot-notation */
      flanger['lfos'][0].start = lfo0StartMock;
      flanger['lfos'][1].start = lfo1StartMock;
      /* eslint-enable dot-notation */

      flanger.activate();

      expect(connectMock).toHaveBeenCalledTimes(1);
      expect(lfo0StartMock).toHaveBeenCalledTimes(1);
      expect(lfo1StartMock).toHaveBeenCalledTimes(1);

      flanger.connect = originalConnect;

      /* eslint-disable dot-notation */
      flanger['lfos'][0] = originalLFO0;
      flanger['lfos'][1] = originalLFO1;
      /* eslint-enabel dot-notation */
    });
  });

  describe(flanger.deactivate.name, () => {
    test('should call `connect` method and stop LFO', () => {
      const originalConnect = flanger.connect;

      /* eslint-disable dot-notation */
      const originalLFO0 = flanger['lfos'][0];
      const originalLFO1 = flanger['lfos'][1];
      /* eslint-enable dot-notation */

      const connectMock  = jest.fn();
      const lfo0StopMock = jest.fn();
      const lfo1StopMock = jest.fn();

      flanger.connect = connectMock;

      /* eslint-disable dot-notation */
      flanger['lfos'][0].stop = lfo0StopMock;
      flanger['lfos'][1].stop = lfo1StopMock;
      /* eslint-enabel dot-notation */

      flanger.deactivate();

      expect(connectMock).toHaveBeenCalledTimes(1);
      expect(lfo0StopMock).toHaveBeenCalledTimes(1);
      expect(lfo1StopMock).toHaveBeenCalledTimes(1);

      flanger.connect = originalConnect;

      /* eslint-disable dot-notation */
      flanger['lfos'][0] = originalLFO0;
      flanger['lfos'][1] = originalLFO1;
      /* eslint-enabel dot-notation */
    });
  });
});
