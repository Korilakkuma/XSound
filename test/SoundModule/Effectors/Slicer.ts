import type { SlicerParams } from '/src/SoundModule/Effectors/Slicer';

import { AudioContextMock } from '/mock/AudioContextMock';
import { Slicer } from '/src/SoundModule/Effectors/Slicer';

describe(Slicer.name, () => {
  const context = new AudioContextMock();

  // @ts-expect-error Because there is not Web Audio API in Jest environment (Node.js environment), mocks Web Audio API
  const slicer = new Slicer(context);

  describe(slicer.stop.name, () => {
    /* eslint-disable dot-notation */
    const originalLFO0   = slicer['lfos'][0];
    const originalLFO1   = slicer['lfos'][1];
    const originalDepth0 = slicer['depths'][0];
    const originalDepth1 = slicer['depths'][1];
    /* eslint-enable dot-notation */

    afterAll(() => {
      /* eslint-disable dot-notation */
      slicer['lfos'][0]   = originalLFO0;
      slicer['lfos'][1]   = originalLFO1;
      slicer['depths'][0] = originalDepth0;
      slicer['depths'][1] = originalDepth1;
      /* eslint-enable dot-notation */

      slicer.param({ type: 'standard' });

      slicer.deactivate();
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
      slicer['lfos'][0].start           = lfo0StartMock;
      slicer['lfos'][0].stop            = lfo0StopMock;
      slicer['lfos'][0].connect         = lfo0ConnectMock;
      slicer['lfos'][0].type            = 'sine';
      slicer['lfos'][0].frequency.value = 10;
      slicer['lfos'][1].start           = lfo1StartMock;
      slicer['lfos'][1].stop            = lfo1StopMock;
      slicer['lfos'][1].connect         = lfo1ConnectMock;
      slicer['lfos'][1].type            = 'sine';
      slicer['lfos'][1].frequency.value = 10;
      slicer['depths'][0].connect       = depth0ConnectMock;
      slicer['depths'][1].connect       = depth1ConnectMock;
      /* eslint-enable dot-notation */

      slicer.stop(0, 0);

      expect(lfo0StartMock).toHaveBeenCalledTimes(0);
      expect(lfo0StopMock).toHaveBeenCalledTimes(0);
      expect(lfo0ConnectMock).toHaveBeenCalledTimes(0);
      expect(lfo1StartMock).toHaveBeenCalledTimes(0);
      expect(lfo1StopMock).toHaveBeenCalledTimes(0);
      expect(lfo1ConnectMock).toHaveBeenCalledTimes(0);
      expect(depth0ConnectMock).toHaveBeenCalledTimes(0);
      expect(depth1ConnectMock).toHaveBeenCalledTimes(0);

      slicer.activate();
      slicer.stop(0, 0);

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

  describe(slicer.connect.name, () => {
    /* eslint-disable dot-notation */
    const originalInput      = slicer['input'];
    const originalAmplitude0 = slicer['amplitudes'][0];
    const originalAmplitude1 = slicer['amplitudes'][1];
    const originalSplitter   = slicer['splitter'];
    const originalMerger     = slicer['merger'];
    /* eslint-enable dot-notation */

    afterEach(() => {
      /* eslint-disable dot-notation */
      slicer['input']         = originalInput;
      slicer['amplitudes'][0] = originalAmplitude0;
      slicer['amplitudes'][1] = originalAmplitude1;
      slicer['splitter']      = originalSplitter;
      slicer['merger']        = originalMerger;
      /* eslint-enable dot-notation */

      slicer.param({ type: 'standard' });

      slicer.deactivate();
    });

    test('should call `connect` method (if `type` is `standard`)', () => {
      const inputConnectMock        = jest.fn();
      const inputDisconnectMock     = jest.fn();
      const amplitudeConnectMock    = jest.fn();
      const amplitudeDisconnectMock = jest.fn();
      const dryConnectMock          = jest.fn();
      const dryDisconnectMock       = jest.fn();
      const wetConnectMock          = jest.fn();
      const wetDisconnectMock       = jest.fn();

      /* eslint-disable dot-notation */
      slicer['input'].connect            = inputConnectMock;
      slicer['input'].disconnect         = inputDisconnectMock;
      slicer['amplitudes'][0].connect    = amplitudeConnectMock;
      slicer['amplitudes'][0].disconnect = amplitudeDisconnectMock;
      slicer['dry'].connect              = dryConnectMock;
      slicer['dry'].disconnect           = dryDisconnectMock;
      slicer['wets'][0].connect          = wetConnectMock;
      slicer['wets'][0].disconnect       = wetDisconnectMock;
      /* eslint-enable dot-notation */

      slicer.connect();

      expect(inputConnectMock).toHaveBeenCalledTimes(1);
      expect(amplitudeConnectMock).toHaveBeenCalledTimes(0);
      expect(dryConnectMock).toHaveBeenCalledTimes(0);
      expect(wetConnectMock).toHaveBeenCalledTimes(0);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(1);
      expect(amplitudeDisconnectMock).toHaveBeenCalledTimes(1);
      expect(dryDisconnectMock).toHaveBeenCalledTimes(1);
      expect(wetDisconnectMock).toHaveBeenCalledTimes(1);

      slicer.activate();

      expect(inputConnectMock).toHaveBeenCalledTimes(2);
      expect(amplitudeConnectMock).toHaveBeenCalledTimes(1);
      expect(dryConnectMock).toHaveBeenCalledTimes(1);
      expect(wetConnectMock).toHaveBeenCalledTimes(1);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(2);
      expect(amplitudeDisconnectMock).toHaveBeenCalledTimes(2);
      expect(dryDisconnectMock).toHaveBeenCalledTimes(2);
      expect(wetDisconnectMock).toHaveBeenCalledTimes(2);
    });

    test('should call `connect` method (if `type` is `stereo`)', () => {
      const inputConnectMock         = jest.fn();
      const inputDisconnectMock      = jest.fn();
      const amplitude0ConnectMock    = jest.fn();
      const amplitude0DisconnectMock = jest.fn();
      const amplitude1ConnectMock    = jest.fn();
      const amplitude1DisconnectMock = jest.fn();
      const dryConnectMock           = jest.fn();
      const dryDisconnectMock        = jest.fn();
      const wet0ConnectMock          = jest.fn();
      const wet0DisconnectMock       = jest.fn();
      const wet1ConnectMock          = jest.fn();
      const wet1DisconnectMock       = jest.fn();
      const splitterConnectMock      = jest.fn();
      const splitterDisconnectMock   = jest.fn();
      const mergerConnectMock        = jest.fn();
      const mergerDisconnectMock     = jest.fn();

      /* eslint-disable dot-notation */
      slicer['input'].connect            = inputConnectMock;
      slicer['input'].disconnect         = inputDisconnectMock;
      slicer['amplitudes'][0].connect    = amplitude0ConnectMock;
      slicer['amplitudes'][0].disconnect = amplitude0DisconnectMock;
      slicer['amplitudes'][1].connect    = amplitude1ConnectMock;
      slicer['amplitudes'][1].disconnect = amplitude1DisconnectMock;
      slicer['dry'].connect              = dryConnectMock;
      slicer['dry'].disconnect           = dryDisconnectMock;
      slicer['wets'][0].connect          = wet0ConnectMock;
      slicer['wets'][0].disconnect       = wet0DisconnectMock;
      slicer['wets'][1].connect          = wet1ConnectMock;
      slicer['wets'][1].disconnect       = wet1DisconnectMock;
      slicer['splitter'].connect         = splitterConnectMock;
      slicer['splitter'].disconnect      = splitterDisconnectMock;
      slicer['merger'].connect           = mergerConnectMock;;
      slicer['merger'].disconnect        = mergerDisconnectMock;;
      /* eslint-enable dot-notation */

      slicer.param({ type: 'stereo' });

      expect(inputConnectMock).toHaveBeenCalledTimes(1);
      expect(amplitude0ConnectMock).toHaveBeenCalledTimes(0);
      expect(amplitude1ConnectMock).toHaveBeenCalledTimes(0);
      expect(dryConnectMock).toHaveBeenCalledTimes(0);
      expect(wet0ConnectMock).toHaveBeenCalledTimes(0);
      expect(wet1ConnectMock).toHaveBeenCalledTimes(0);
      expect(splitterConnectMock).toHaveBeenCalledTimes(0);
      expect(mergerConnectMock).toHaveBeenCalledTimes(0);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(1);
      expect(amplitude0DisconnectMock).toHaveBeenCalledTimes(1);
      expect(amplitude1DisconnectMock).toHaveBeenCalledTimes(1);
      expect(dryDisconnectMock).toHaveBeenCalledTimes(1);
      expect(wet0DisconnectMock).toHaveBeenCalledTimes(1);
      expect(wet1DisconnectMock).toHaveBeenCalledTimes(1);
      expect(splitterDisconnectMock).toHaveBeenCalledTimes(2);
      expect(mergerDisconnectMock).toHaveBeenCalledTimes(1);

      slicer.activate();

      expect(inputConnectMock).toHaveBeenCalledTimes(2);
      expect(amplitude0ConnectMock).toHaveBeenCalledTimes(1);
      expect(amplitude1ConnectMock).toHaveBeenCalledTimes(1);
      expect(dryConnectMock).toHaveBeenCalledTimes(1);
      expect(wet0ConnectMock).toHaveBeenCalledTimes(1);
      expect(wet1ConnectMock).toHaveBeenCalledTimes(1);
      expect(splitterConnectMock).toHaveBeenCalledTimes(0);
      expect(mergerConnectMock).toHaveBeenCalledTimes(0);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(2);
      expect(amplitude0DisconnectMock).toHaveBeenCalledTimes(2);
      expect(amplitude1DisconnectMock).toHaveBeenCalledTimes(2);
      expect(dryDisconnectMock).toHaveBeenCalledTimes(2);
      expect(wet0DisconnectMock).toHaveBeenCalledTimes(2);
      expect(wet1DisconnectMock).toHaveBeenCalledTimes(2);
      expect(splitterDisconnectMock).toHaveBeenCalledTimes(2);
      expect(mergerDisconnectMock).toHaveBeenCalledTimes(1);
    });
  });

  describe(slicer.param.name, () => {
    const defaultParams: SlicerParams = {
      type : 'standard',
      depth: [0, 0],
      rate : [0, 0],
      dry  : 1,
      wet  : [0, 0]
    };

    describe('`type` is `standard`', () => {
      const params: SlicerParams = {
        type : 'standard',
        depth: 0.5,
        rate : 0.5,
        dry  : 0.7,
        wet  : 0.3
      };

      slicer.param(params);

      afterAll(() => {
        slicer.param(defaultParams);
      });

      // Setter
      test('should return instance of `Slicer`', () => {
        expect(slicer.param(params)).toBeInstanceOf(Slicer);
      });

      // Getter
      test('should return `type`', () => {
        expect(slicer.param('type')).toBe('standard');
      });

      test('should return `depth`', () => {
        expect(slicer.param('depth')).toBeCloseTo(0.5, 1);
      });

      test('should return `rate`', () => {
        expect(slicer.param('rate')).toBeCloseTo(0.5, 1);
      });

      test('should return `dry`', () => {
        expect(slicer.param('dry')).toBeCloseTo(0.7, 1);
      });

      test('should return `wet`', () => {
        expect(slicer.param('wet')).toBeCloseTo(0.3, 1);
      });
    });

    describe('`type` is `stereo`', () => {
      const params: SlicerParams = {
        type : 'stereo',
        depth: [0.25, 0.50],
        rate : [0.50, 0.75],
        dry  : 0.7,
        wet  : [0.25, 0.50],
      };

      slicer.param(params);

      afterAll(() => {
        slicer.param(defaultParams);
      });

      // Setter
      test('should return instance of `Slicer`', () => {
        expect(slicer.param(params)).toBeInstanceOf(Slicer);
      });

      // Getter
      test('should return `type`', () => {
        expect(slicer.param('type')).toBe('stereo');
      });

      test('should return `depth`', () => {
        expect(slicer.param('depth')).toStrictEqual([0.25, 0.50]);
      });

      test('should return `rate`', () => {
        expect(slicer.param('rate')).toStrictEqual([0.50, 0.75]);
      });

      test('should return `dry`', () => {
        expect(slicer.param('dry')).toBeCloseTo(0.7, 1);
      });

      test('should return `wet`', () => {
        expect(slicer.param('wet')).toStrictEqual([0.25, 0.50]);
      });
    });
  });

  describe(slicer.params.name, () => {
    test('should return parameters for slicer effector as associative array (if `type` is `standard`)', () => {
      expect(slicer.params()).toStrictEqual({
        state: false,
        depth: 0,
        rate : 0,
        dry  : 1,
        wet  : 0
      });
    });

    test('should return parameters for slicer effector as associative array (if `type` is `stereo`)', () => {
      slicer.param({ type: 'stereo' });

      expect(slicer.params()).toStrictEqual({
        state: false,
        type : 'stereo',
        depth: [0, 0],
        rate : [0, 0],
        dry  : 1,
        wet  : [0, 0]
      });
    });
  });

  describe(slicer.activate.name, () => {
    test('should call `connect` method and start LFO', () => {
      const originalConnect = slicer.connect;

      /* eslint-disable dot-notation */
      const originalLFO0 = slicer['lfos'][0];
      const originalLFO1 = slicer['lfos'][1];
      /* eslint-enable dot-notation */

      const connectMock   = jest.fn();
      const lfo0StartMock = jest.fn();
      const lfo1StartMock = jest.fn();

      slicer.connect = connectMock;

      /* eslint-disable dot-notation */
      slicer['lfos'][0].start = lfo0StartMock;
      slicer['lfos'][1].start = lfo1StartMock;
      /* eslint-enable dot-notation */

      slicer.activate();

      expect(connectMock).toHaveBeenCalledTimes(1);
      expect(lfo0StartMock).toHaveBeenCalledTimes(1);
      expect(lfo1StartMock).toHaveBeenCalledTimes(1);

      slicer.connect = originalConnect;

      /* eslint-disable dot-notation */
      slicer['lfos'][0] = originalLFO0;
      slicer['lfos'][1] = originalLFO1;
      /* eslint-enabel dot-notation */
    });
  });

  describe(slicer.deactivate.name, () => {
    test('should call `connect` method and stop LFO', () => {
      const originalConnect = slicer.connect;

      /* eslint-disable dot-notation */
      const originalLFO0 = slicer['lfos'][0];
      const originalLFO1 = slicer['lfos'][1];
      /* eslint-enable dot-notation */

      const connectMock  = jest.fn();
      const lfo0StopMock = jest.fn();
      const lfo1StopMock = jest.fn();

      slicer.connect = connectMock;

      /* eslint-disable dot-notation */
      slicer['lfos'][0].stop = lfo0StopMock;
      slicer['lfos'][1].stop = lfo1StopMock;
      /* eslint-enabel dot-notation */

      slicer.deactivate();

      expect(connectMock).toHaveBeenCalledTimes(1);
      expect(lfo0StopMock).toHaveBeenCalledTimes(1);
      expect(lfo1StopMock).toHaveBeenCalledTimes(1);

      slicer.connect = originalConnect;

      /* eslint-disable dot-notation */
      slicer['lfos'][0] = originalLFO0;
      slicer['lfos'][1] = originalLFO1;
      /* eslint-enabel dot-notation */
    });
  });
});
