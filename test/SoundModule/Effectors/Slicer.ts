import type { SlicerParams } from '/src/SoundModule/Effectors/Slicer';

import { AudioContextMock } from '/mock/AudioContextMock';
import { Slicer } from '/src/SoundModule/Effectors/Slicer';

describe(Slicer.name, () => {
  const context = new AudioContextMock();

  // @ts-expect-error Because there is not Web Audio API in Jest environment (Node.js environment), mocks Web Audio API
  const slicer = new Slicer(context);

  describe(slicer.stop.name, () => {
    /* eslint-disable dot-notation */
    const originalLFO   = slicer['lfo'];
    const originalDepth = slicer['depth'];
    /* eslint-enable dot-notation */

    afterAll(() => {
      /* eslint-disable dot-notation */
      slicer['lfo']   = originalLFO;
      slicer['depth'] = originalDepth;
      /* eslint-enable dot-notation */

      slicer.deactivate();
    });

    test('should call `connect` method', () => {
      const lfoStartMock     = jest.fn();
      const lfoStopMock      = jest.fn();
      const lfoConnectMock   = jest.fn();
      const depthConnectMock = jest.fn();

      /* eslint-disable dot-notation */
      slicer['lfo'].start           = lfoStartMock;
      slicer['lfo'].stop            = lfoStopMock;
      slicer['lfo'].connect         = lfoConnectMock;
      slicer['lfo'].frequency.value = 10;
      slicer['depth'].connect       = depthConnectMock;
      /* eslint-enable dot-notation */

      slicer.stop(0, 0);

      expect(lfoStartMock).toHaveBeenCalledTimes(0);
      expect(lfoStopMock).toHaveBeenCalledTimes(0);
      expect(lfoConnectMock).toHaveBeenCalledTimes(0);
      expect(depthConnectMock).toHaveBeenCalledTimes(0);

      slicer.activate();
      slicer.stop(0, 0);

      expect(lfoStartMock).toHaveBeenCalledTimes(1);
      expect(lfoStopMock).toHaveBeenCalledTimes(1);
      expect(lfoConnectMock).toHaveBeenCalledTimes(0);  // Because of new instance of `OscillatorNode`
      expect(depthConnectMock).toHaveBeenCalledTimes(1);
    });
  });

  describe(slicer.connect.name, () => {
    /* eslint-disable dot-notation */
    const originalInput     = slicer['input'];
    const originalAmplitude = slicer['amplitude'];
    const originalDry       = slicer['dry'];
    const originalWet       = slicer['wet'];
    /* eslint-enable dot-notation */

    afterAll(() => {
      /* eslint-disable dot-notation */
      slicer['input']     = originalInput;
      slicer['amplitude'] = originalAmplitude;
      slicer['dry']       = originalDry;
      slicer['wet']       = originalWet;
      /* eslint-enable dot-notation */

      slicer.deactivate();
    });

    test('should call `connect` method', () => {
      const inputConnectMock        = jest.fn();
      const inputDisconnectMock     = jest.fn();
      const amplitudeConnectMock    = jest.fn();
      const amplitudeDisconnectMock = jest.fn();
      const dryConnectMock          = jest.fn();
      const dryDisconnectMock       = jest.fn();
      const wetConnectMock          = jest.fn();
      const wetDisconnectMock       = jest.fn();

      /* eslint-disable dot-notation */
      slicer['input'].connect        = inputConnectMock;
      slicer['input'].disconnect     = inputDisconnectMock;
      slicer['amplitude'].connect    = amplitudeConnectMock;
      slicer['amplitude'].disconnect = amplitudeDisconnectMock;
      slicer['dry'].connect          = dryConnectMock;
      slicer['dry'].disconnect       = dryDisconnectMock;
      slicer['wet'].connect          = wetConnectMock;
      slicer['wet'].disconnect       = wetDisconnectMock;
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
  });

  describe(slicer.param.name, () => {
    const defaultParams: SlicerParams = {
      depth: 0,
      rate : 0,
      dry  : 1,
      wet  : 0
    };

    const params: SlicerParams = {
      depth: 0.5,
      rate : 0.5,
      dry  : 0.7,
      wet  : 0.3
    };

    beforeAll(() => {
      slicer.param(params);
    });

    afterAll(() => {
      slicer.param(defaultParams);
    });

    // Setter
    test('should return instance of `Slicer`', () => {
      expect(slicer.param(params)).toBeInstanceOf(Slicer);
    });

    // Getter
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

  describe(slicer.params.name, () => {
    test('should return parameters for slicer effector as associative array', () => {
      expect(slicer.params()).toStrictEqual({
        state: false,
        depth: 0,
        rate : 0,
        dry  : 1,
        wet  : 0
      });
    });
  });

  describe(slicer.activate.name, () => {
    test('should call `connect` method and start LFO', () => {
      const originalConnect = slicer.connect;

      // eslint-disable-next-line dot-notation
      const originalLFO = slicer['lfo'];

      const connectMock  = jest.fn();
      const lfoStartMock = jest.fn();

      slicer.connect = connectMock;

      // eslint-disable-next-line dot-notation
      slicer['lfo'].start = lfoStartMock;

      slicer.activate();

      expect(connectMock).toHaveBeenCalledTimes(1);
      expect(lfoStartMock).toHaveBeenCalledTimes(1);

      slicer.connect = originalConnect;

      // eslint-disable-next-line dot-notation
      slicer['lfo'] = originalLFO;
    });
  });

  describe(slicer.deactivate.name, () => {
    test('should call `connect` method and stop LFO', () => {
      const originalConnect = slicer.connect;

      // eslint-disable-next-line dot-notation
      const originalLFO = slicer['lfo'];

      const connectMock = jest.fn();
      const lfoStopMock = jest.fn();

      slicer.connect = connectMock;

      // eslint-disable-next-line dot-notation
      slicer['lfo'].stop = lfoStopMock;

      slicer.deactivate();

      expect(connectMock).toHaveBeenCalledTimes(1);
      expect(lfoStopMock).toHaveBeenCalledTimes(1);

      slicer.connect = originalConnect;

      // eslint-disable-next-line dot-notation
      slicer['lfo'] = originalLFO;
    });
  });
});
