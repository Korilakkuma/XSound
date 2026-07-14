import type { TremoloParams } from '/src/SoundModule/Effectors/Tremolo';

import { AudioContextMock } from '/mock/AudioContextMock';
import { Tremolo } from '/src/SoundModule/Effectors/Tremolo';

describe(Tremolo.name, () => {
  const context = new AudioContextMock();

  // @ts-expect-error Because there is not Web Audio API in Jest environment (Node.js environment), mocks Web Audio API
  const tremolo = new Tremolo(context);

  describe(tremolo.stop.name, () => {
    /* eslint-disable dot-notation */
    const originalLFO0   = tremolo['lfos'][0];
    const originalLFO1   = tremolo['lfos'][1];
    const originalDepth0 = tremolo['depths'][0];
    const originalDepth1 = tremolo['depths'][1];
    /* eslint-enable dot-notation */

    afterAll(() => {
      /* eslint-disable dot-notation */
      tremolo['lfos'][0]   = originalLFO0;
      tremolo['lfos'][1]   = originalLFO1;
      tremolo['depths'][0] = originalDepth0;
      tremolo['depths'][1] = originalDepth1;
      /* eslint-enable dot-notation */

      tremolo.param({ type: 'standard' });

      tremolo.deactivate();
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
      tremolo['lfos'][0].start           = lfo0StartMock;
      tremolo['lfos'][0].stop            = lfo0StopMock;
      tremolo['lfos'][0].connect         = lfo0ConnectMock;
      tremolo['lfos'][0].type            = 'sine';
      tremolo['lfos'][0].frequency.value = 10;
      tremolo['lfos'][1].start           = lfo1StartMock;
      tremolo['lfos'][1].stop            = lfo1StopMock;
      tremolo['lfos'][1].connect         = lfo1ConnectMock;
      tremolo['lfos'][1].type            = 'sine';
      tremolo['lfos'][1].frequency.value = 10;
      tremolo['depths'][0].connect       = depth0ConnectMock;
      tremolo['depths'][1].connect       = depth1ConnectMock;
      /* eslint-enable dot-notation */

      tremolo.stop(0, 0);

      expect(lfo0StartMock).toHaveBeenCalledTimes(0);
      expect(lfo0StopMock).toHaveBeenCalledTimes(0);
      expect(lfo0ConnectMock).toHaveBeenCalledTimes(0);
      expect(lfo1StartMock).toHaveBeenCalledTimes(0);
      expect(lfo1StopMock).toHaveBeenCalledTimes(0);
      expect(lfo1ConnectMock).toHaveBeenCalledTimes(0);
      expect(depth0ConnectMock).toHaveBeenCalledTimes(0);
      expect(depth1ConnectMock).toHaveBeenCalledTimes(0);

      tremolo.activate();
      tremolo.stop(0, 0);

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

  describe(tremolo.connect.name, () => {
    /* eslint-disable dot-notation */
    const originalInput      = tremolo['input'];
    const originalAmplitude0 = tremolo['amplitudes'][0];
    const originalAmplitude1 = tremolo['amplitudes'][1];
    const originalSplitter   = tremolo['splitter'];
    const originalMerger     = tremolo['merger'];
    /* eslint-enable dot-notation */

    afterEach(() => {
      /* eslint-disable dot-notation */
      tremolo['input']         = originalInput;
      tremolo['amplitudes'][0] = originalAmplitude0;
      tremolo['amplitudes'][1] = originalAmplitude1;
      tremolo['splitter']      = originalSplitter;
      tremolo['merger']        = originalMerger;
      /* eslint-enable dot-notation */

      tremolo.param({ type: 'standard' });

      tremolo.deactivate();
    });

    test('should call `connect` method (if `type` is `standard`)', () => {
      const inputConnectMock        = jest.fn();
      const inputDisconnectMock     = jest.fn();
      const amplitudeConnectMock    = jest.fn();
      const amplitudeDisconnectMock = jest.fn();

      /* eslint-disable dot-notation */
      tremolo['input'].connect            = inputConnectMock;
      tremolo['input'].disconnect         = inputDisconnectMock;
      tremolo['amplitudes'][0].connect    = amplitudeConnectMock;
      tremolo['amplitudes'][0].disconnect = amplitudeDisconnectMock;
      /* eslint-enable dot-notation */

      tremolo.connect();

      expect(inputConnectMock).toHaveBeenCalledTimes(1);
      expect(amplitudeConnectMock).toHaveBeenCalledTimes(0);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(1);
      expect(amplitudeDisconnectMock).toHaveBeenCalledTimes(1);

      tremolo.activate();

      expect(inputConnectMock).toHaveBeenCalledTimes(2);
      expect(amplitudeConnectMock).toHaveBeenCalledTimes(1);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(2);
      expect(amplitudeDisconnectMock).toHaveBeenCalledTimes(2);
    });

    test('should call `connect` method (if `type` is `stereo`)', () => {
      const inputConnectMock         = jest.fn();
      const inputDisconnectMock      = jest.fn();
      const amplitude0ConnectMock    = jest.fn();
      const amplitude0DisconnectMock = jest.fn();
      const amplitude1ConnectMock    = jest.fn();
      const amplitude1DisconnectMock = jest.fn();
      const splitterConnectMock      = jest.fn();
      const splitterDisconnectMock   = jest.fn();
      const mergerConnectMock        = jest.fn();
      const mergerDisconnectMock     = jest.fn();

      /* eslint-disable dot-notation */
      tremolo['input'].connect            = inputConnectMock;
      tremolo['input'].disconnect         = inputDisconnectMock;
      tremolo['amplitudes'][0].connect    = amplitude0ConnectMock;
      tremolo['amplitudes'][0].disconnect = amplitude0DisconnectMock;
      tremolo['amplitudes'][1].connect    = amplitude1ConnectMock;
      tremolo['amplitudes'][1].disconnect = amplitude1DisconnectMock;
      tremolo['splitter'].connect         = splitterConnectMock;
      tremolo['splitter'].disconnect      = splitterDisconnectMock;
      tremolo['merger'].connect           = mergerConnectMock;;
      tremolo['merger'].disconnect        = mergerDisconnectMock;;
      /* eslint-enable dot-notation */

      tremolo.param({ type: 'stereo' });

      expect(inputConnectMock).toHaveBeenCalledTimes(1);
      expect(amplitude0ConnectMock).toHaveBeenCalledTimes(0);
      expect(amplitude1ConnectMock).toHaveBeenCalledTimes(0);
      expect(splitterConnectMock).toHaveBeenCalledTimes(0);
      expect(mergerConnectMock).toHaveBeenCalledTimes(0);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(1);
      expect(amplitude0DisconnectMock).toHaveBeenCalledTimes(1);
      expect(amplitude1DisconnectMock).toHaveBeenCalledTimes(1);
      expect(splitterDisconnectMock).toHaveBeenCalledTimes(2);
      expect(mergerDisconnectMock).toHaveBeenCalledTimes(1);

      tremolo.activate();

      expect(inputConnectMock).toHaveBeenCalledTimes(2);
      expect(amplitude0ConnectMock).toHaveBeenCalledTimes(1);
      expect(amplitude1ConnectMock).toHaveBeenCalledTimes(1);
      expect(splitterConnectMock).toHaveBeenCalledTimes(2);
      expect(mergerConnectMock).toHaveBeenCalledTimes(1);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(2);
      expect(amplitude0DisconnectMock).toHaveBeenCalledTimes(2);
      expect(amplitude1DisconnectMock).toHaveBeenCalledTimes(2);
      expect(splitterDisconnectMock).toHaveBeenCalledTimes(4);
      expect(mergerDisconnectMock).toHaveBeenCalledTimes(2);
    });
  });

  describe(tremolo.param.name, () => {
    const defaultParams: TremoloParams = {
      type    : 'standard',
      waveType: ['sine', 'sine'],
      depth   : [0, 0],
      rate    : [0, 0]
    };

    describe('`type` is `standard`', () => {
      const params: TremoloParams = {
        type    : 'standard',
        waveType: 'triangle',
        depth   : 0.5,
        rate    : 0.5
      };

      tremolo.param(params);

      afterAll(() => {
        tremolo.param(defaultParams);
      });

      // Setter
      test('should return instance of `Tremolo`', () => {
        expect(tremolo.param(params)).toBeInstanceOf(Tremolo);
      });

      // Getter
      test('should return `type`', () => {
        expect(tremolo.param('type')).toBe('standard');
      });

      test('should return `waveType`', () => {
        expect(tremolo.param('waveType')).toBe('triangle');
      });

      test('should return `depth`', () => {
        expect(tremolo.param('depth')).toBeCloseTo(0.5, 1);
      });

      test('should return `rate`', () => {
        expect(tremolo.param('rate')).toBeCloseTo(0.5, 1);
      });
    });

    describe('`type` is `stereo`', () => {
      const params: TremoloParams = {
        type    : 'stereo',
        waveType: ['triangle', 'sawtooth'],
        depth   : [0.50, 0.75],
        rate    : [0.25, 0.50]
      };

      tremolo.param(params);

      afterAll(() => {
        tremolo.param(defaultParams);
      });

      // Setter
      test('should return instance of `Tremolo`', () => {
        expect(tremolo.param(params)).toBeInstanceOf(Tremolo);
      });

      // Getter
      test('should return `type`', () => {
        expect(tremolo.param('type')).toBe('stereo');
      });

      test('should return `waveType`', () => {
        expect(tremolo.param('waveType')).toStrictEqual(['triangle', 'sawtooth']);
      });

      test('should return `depth`', () => {
        expect(tremolo.param('depth')).toStrictEqual([0.50, 0.75]);
      });

      test('should return `rate`', () => {
        expect(tremolo.param('rate')).toStrictEqual([0.25, 0.50]);
      });
    });
  });

  describe(tremolo.params.name, () => {
    test('should return parameters for tremolo effector as associative array (if `type` is `standard`)', () => {
      expect(tremolo.params()).toStrictEqual({
        state   : false,
        type    : 'standard',
        waveType: 'sine',
        depth   : 0,
        rate    : 0
      });
    });

    test('should return parameters for tremolo effector as associative array (if `type` is `stereo`)', () => {
      tremolo.param({ type: 'stereo' });

      expect(tremolo.params()).toStrictEqual({
        state   : false,
        type    : 'stereo',
        waveType: ['sine', 'sine'],
        depth   : [0, 0],
        rate    : [0, 0]
      });
    });
  });

  describe(tremolo.activate.name, () => {
    test('should call `connect` method and start LFO', () => {
      const originalConnect = tremolo.connect;

      /* eslint-disable dot-notation */
      const originalLFO0 = tremolo['lfos'][0];
      const originalLFO1 = tremolo['lfos'][1];
      /* eslint-enable dot-notation */

      const connectMock   = jest.fn();
      const lfo0StartMock = jest.fn();
      const lfo1StartMock = jest.fn();

      tremolo.connect = connectMock;

      /* eslint-disable dot-notation */
      tremolo['lfos'][0].start = lfo0StartMock;
      tremolo['lfos'][1].start = lfo1StartMock;
      /* eslint-enable dot-notation */

      tremolo.activate();

      expect(connectMock).toHaveBeenCalledTimes(1);
      expect(lfo0StartMock).toHaveBeenCalledTimes(1);
      expect(lfo1StartMock).toHaveBeenCalledTimes(1);

      tremolo.connect = originalConnect;

      /* eslint-disable dot-notation */
      tremolo['lfos'][0] = originalLFO0;
      tremolo['lfos'][1] = originalLFO1;
      /* eslint-enabel dot-notation */
    });
  });

  describe(tremolo.deactivate.name, () => {
    test('should call `connect` method and stop LFO', () => {
      const originalConnect = tremolo.connect;

      /* eslint-disable dot-notation */
      const originalLFO0 = tremolo['lfos'][0];
      const originalLFO1 = tremolo['lfos'][1];
      /* eslint-enable dot-notation */

      const connectMock  = jest.fn();
      const lfo0StopMock = jest.fn();
      const lfo1StopMock = jest.fn();

      tremolo.connect = connectMock;

      /* eslint-disable dot-notation */
      tremolo['lfos'][0].stop = lfo0StopMock;
      tremolo['lfos'][1].stop = lfo1StopMock;
      /* eslint-enabel dot-notation */

      tremolo.deactivate();

      expect(connectMock).toHaveBeenCalledTimes(1);
      expect(lfo0StopMock).toHaveBeenCalledTimes(1);
      expect(lfo1StopMock).toHaveBeenCalledTimes(1);

      tremolo.connect = originalConnect;

      /* eslint-disable dot-notation */
      tremolo['lfos'][0] = originalLFO0;
      tremolo['lfos'][1] = originalLFO1;
      /* eslint-enabel dot-notation */
    });
  });
});
