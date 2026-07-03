import type { ChorusParams } from '/src/SoundModule/Effectors/Chorus';

import { AudioContextMock } from '/mock/AudioContextMock';
import { Chorus } from '/src/SoundModule/Effectors/Chorus';

describe(Chorus.name, () => {
  const context = new AudioContextMock();

  // @ts-expect-error Because there is not Web Audio API in Jest environment (Node.js environment), mocks Web Audio API
  const chorus = new Chorus(context);

  describe(chorus.stop.name, () => {
    /* eslint-disable dot-notation */
    const originalLFO0   = chorus['lfos'][0];
    const originalDepth0 = chorus['depths'][0];
    const originalLFO1   = chorus['lfos'][1];
    const originalDepth1 = chorus['depths'][1];
    /* eslint-enable dot-notation */

    afterAll(() => {
      /* eslint-disable dot-notation */
      chorus['lfos'][0]   = originalLFO0;
      chorus['lfos'][1]   = originalLFO1;
      chorus['depths'][0] = originalDepth0;
      chorus['depths'][1] = originalDepth1;
      /* eslint-enable dot-notation */

      chorus.param({ type: 'standard' });

      chorus.deactivate();
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
      chorus['lfos'][0].start           = lfo0StartMock;
      chorus['lfos'][0].stop            = lfo0StopMock;
      chorus['lfos'][0].connect         = lfo0ConnectMock;
      chorus['lfos'][0].type            = 'sine';
      chorus['lfos'][0].frequency.value = 10;
      chorus['lfos'][1].start           = lfo1StartMock;
      chorus['lfos'][1].stop            = lfo1StopMock;
      chorus['lfos'][1].connect         = lfo1ConnectMock;
      chorus['lfos'][1].type            = 'sine';
      chorus['lfos'][1].frequency.value = 10;
      chorus['depths'][0].connect       = depth0ConnectMock;
      chorus['depths'][1].connect       = depth1ConnectMock;
      /* eslint-enable dot-notation */

      chorus.stop(0, 0);

      expect(lfo0StartMock).toHaveBeenCalledTimes(0);
      expect(lfo0StopMock).toHaveBeenCalledTimes(0);
      expect(lfo0ConnectMock).toHaveBeenCalledTimes(0);
      expect(lfo1StartMock).toHaveBeenCalledTimes(0);
      expect(lfo1StopMock).toHaveBeenCalledTimes(0);
      expect(lfo1ConnectMock).toHaveBeenCalledTimes(0);
      expect(depth0ConnectMock).toHaveBeenCalledTimes(0);

      chorus.activate();
      chorus.stop(0, 0);

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

  describe(chorus.connect.name, () => {
    /* eslint-disable dot-notation */
    const originalInput     = chorus['input'];
    const originalDelay0    = chorus['delays'][0];
    const originalDelay1    = chorus['delays'][1];
    const originalDry       = chorus['dry'];
    const originalWet0      = chorus['wets'][0];
    const originalWet1      = chorus['wets'][1];
    const originalTone0     = chorus['tones'][0];
    const originalTone1     = chorus['tones'][1];
    const originalFeedback0 = chorus['feedbacks'][0];
    const originalFeedback1 = chorus['feedbacks'][1];
    /* eslint-enable dot-notation */

    afterEach(() => {
      /* eslint-disable dot-notation */
      chorus['input']        = originalInput;
      chorus['delays'][0]    = originalDelay0;
      chorus['delays'][1]    = originalDelay1;
      chorus['dry']          = originalDry;
      chorus['wets'][0]      = originalWet0;
      chorus['wets'][1]      = originalWet1;
      chorus['tones'][0]     = originalTone0;
      chorus['tones'][1]     = originalTone1;
      chorus['feedbacks'][0] = originalFeedback0;
      chorus['feedbacks'][1] = originalFeedback1;
      /* eslint-enable dot-notation */

      chorus.param({ type: 'standard' });

      chorus.deactivate();
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
      chorus['input'].connect           = inputConnectMock;
      chorus['input'].disconnect        = inputDisconnectMock;
      chorus['delays'][0].connect       = delayConnectMock;
      chorus['delays'][0].disconnect    = delayDisconnectMock;
      chorus['dry'].connect             = dryConnectMock;
      chorus['dry'].disconnect          = dryDisconnectMock;
      chorus['wets'][0].connect         = wetConnectMock;
      chorus['wets'][0].disconnect      = wetDisconnectMock;
      chorus['tones'][0].connect        = toneConnectMock;
      chorus['tones'][0].disconnect     = toneDisconnectMock;
      chorus['feedbacks'][0].connect    = feedbackConnectMock;
      chorus['feedbacks'][0].disconnect = feedbackDisconnectMock;
      /* eslint-enable dot-notation */

      chorus.connect();

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

      chorus.activate();

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
      chorus['input'].connect           = inputConnectMock;
      chorus['input'].disconnect        = inputDisconnectMock;
      chorus['delays'][0].connect       = delay0ConnectMock;
      chorus['delays'][0].disconnect    = delay0DisconnectMock;
      chorus['delays'][1].connect       = delay1ConnectMock;
      chorus['delays'][1].disconnect    = delay1DisconnectMock;
      chorus['dry'].connect             = dryConnectMock;
      chorus['dry'].disconnect          = dryDisconnectMock;
      chorus['wets'][0].connect         = wet0ConnectMock;
      chorus['wets'][0].disconnect      = wet0DisconnectMock;
      chorus['wets'][1].connect         = wet1ConnectMock;
      chorus['wets'][1].disconnect      = wet1DisconnectMock;
      chorus['tones'][0].connect        = tone0ConnectMock;
      chorus['tones'][0].disconnect     = tone0DisconnectMock;
      chorus['tones'][1].connect        = tone1ConnectMock;
      chorus['tones'][1].disconnect     = tone1DisconnectMock;
      chorus['feedbacks'][0].connect    = feedback0ConnectMock;
      chorus['feedbacks'][0].disconnect = feedback0DisconnectMock;
      chorus['feedbacks'][1].connect    = feedback1ConnectMock;
      chorus['feedbacks'][1].disconnect = feedback1DisconnectMock;
      chorus['splitter'].connect        = splitterConnectMock;
      chorus['splitter'].disconnect     = splitterDisconnectMock;
      chorus['merger'].connect          = mergerConnectMock;
      chorus['merger'].disconnect       = mergerDisconnectMock;
      /* eslint-enable dot-notation */

      chorus.param({ type: 'stereo' });

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

      chorus.activate();

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

  describe(chorus.param.name, () => {
    const defaultParams: ChorusParams = {
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
      const params: ChorusParams = {
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

      chorus.param(params);

      afterAll(() => {
        chorus.param(defaultParams);
      });

      // Setter
      test('should return instance of `Chorus`', () => {
        expect(chorus.param(params)).toBeInstanceOf(Chorus);
      });

      // Getter
      test('should return `time`', () => {
        expect(chorus.param('time')).toBeCloseTo(0.25, 2);
      });

      test('should return `depth`', () => {
        expect(chorus.param('depth')).toBeCloseTo(0.5, 1);
      });

      test('should return `rate`', () => {
        expect(chorus.param('rate')).toBeCloseTo(0.5, 1);
      });

      test('should return `mix`', () => {
        expect(chorus.param('mix')).toBeCloseTo(0.5, 1);
      });

      test('should return `dry`', () => {
        expect(chorus.param('dry')).toBeCloseTo(0.5, 1);
      });

      test('should return `wet`', () => {
        expect(chorus.param('wet')).toBeCloseTo(0.5, 1);
      });

      test('should return `tone`', () => {
        expect(chorus.param('tone')).toBeCloseTo(4000, 1);
      });

      test('should return `feedback`', () => {
        expect(chorus.param('feedback')).toBeCloseTo(0.5, 1);
      });
    });

    describe('`type` is `stereo`', () => {
      const params: ChorusParams = {
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

      chorus.param(params);

      afterAll(() => {
        chorus.param(defaultParams);
      });

      // Setter
      test('should return instance of `Chorus`', () => {
        expect(chorus.param(params)).toBeInstanceOf(Chorus);
      });
    });
  });

  describe(chorus.params.name, () => {
    test('should return parameters for chorus effector as associative array (if `type` is `standard`)', () => {
      expect(chorus.params()).toStrictEqual({
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

    test('should return parameters for chorus effector as associative array (if `type` is `stereo`)', () => {
      chorus.param({ type: 'stereo' });

      expect(chorus.params()).toStrictEqual({
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

  describe(chorus.activate.name, () => {
    test('should call `connect` method and start LFO', () => {
      const originalConnect = chorus.connect;

      /* eslint-disable dot-notation */
      const originalLFO0 = chorus['lfos'][0];
      const originalLFO1 = chorus['lfos'][1];
      /* eslint-enable dot-notation */

      const connectMock  = jest.fn();
      const lfo0StartMock = jest.fn();
      const lfo1StartMock = jest.fn();

      chorus.connect = connectMock;

      /* eslint-disable dot-notation */
      chorus['lfos'][0].start = lfo0StartMock;
      chorus['lfos'][1].start = lfo1StartMock;
      /* eslint-enable dot-notation */

      chorus.activate();

      expect(connectMock).toHaveBeenCalledTimes(1);
      expect(lfo0StartMock).toHaveBeenCalledTimes(1);
      expect(lfo1StartMock).toHaveBeenCalledTimes(1);

      chorus.connect = originalConnect;

      /* eslint-disable dot-notation */
      chorus['lfos'][0] = originalLFO0;
      chorus['lfos'][1] = originalLFO1;
      /* eslint-enabel dot-notation */
    });
  });

  describe(chorus.deactivate.name, () => {
    test('should call `connect` method and stop LFO', () => {
      const originalConnect = chorus.connect;

      /* eslint-disable dot-notation */
      const originalLFO0 = chorus['lfos'][0];
      const originalLFO1 = chorus['lfos'][0];
      /* eslint-enable dot-notation */

      const connectMock = jest.fn();
      const lfo0StopMock = jest.fn();
      const lfo1StopMock = jest.fn();

      chorus.connect = connectMock;

      /* eslint-disable dot-notation */
      chorus['lfos'][0].stop = lfo0StopMock;
      chorus['lfos'][1].stop = lfo1StopMock;
      /* eslint-enabel dot-notation */

      chorus.deactivate();

      expect(connectMock).toHaveBeenCalledTimes(1);
      expect(lfo0StopMock).toHaveBeenCalledTimes(1);
      expect(lfo1StopMock).toHaveBeenCalledTimes(1);

      chorus.connect = originalConnect;

      /* eslint-disable dot-notation */
      chorus['lfos'][0] = originalLFO0;
      chorus['lfos'][1] = originalLFO1;
      /* eslint-enabel dot-notation */
    });
  });
});
