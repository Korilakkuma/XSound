import { AudioContextMock } from '../../../mocks/AudioContextMock';
import { Autopanner, AutopannerParams } from '../../../src/SoundModule/Effectors/Autopanner';

describe(Autopanner.name, () => {
  const context = new AudioContextMock();

  // @ts-ignore
  const autopanner = new Autopanner(context);

  describe(autopanner.stop.name, () => {
    /* eslint-disable dot-notation */
    const originalLFO   = autopanner['lfo'];
    const originalDepth = autopanner['depth'];
    /* eslint-enable dot-notation */

    afterAll(() => {
      /* eslint-disable dot-notation */
      autopanner['lfo']   = originalLFO;
      autopanner['depth'] = originalDepth;
      /* eslint-enable dot-notation */

      autopanner.deactivate();
    });

    test('should call `connect` method', () => {
      const lfoStartMock     = jest.fn();
      const lfoStopMock      = jest.fn();
      const lfoConnectMock   = jest.fn();
      const depthConnectMock = jest.fn();

      /* eslint-disable dot-notation */
      autopanner['lfo'].start           = lfoStartMock;
      autopanner['lfo'].stop            = lfoStopMock;
      autopanner['lfo'].connect         = lfoConnectMock;
      autopanner['lfo'].type            = 'sine';
      autopanner['lfo'].frequency.value = 10;
      autopanner['depth'].connect       = depthConnectMock;
      /* eslint-enable dot-notation */

      autopanner.stop(0, 0);

      expect(lfoStartMock).toHaveBeenCalledTimes(0);
      expect(lfoStopMock).toHaveBeenCalledTimes(0);
      expect(lfoConnectMock).toHaveBeenCalledTimes(0);
      expect(depthConnectMock).toHaveBeenCalledTimes(0);

      autopanner.activate();
      autopanner.stop(0, 0);

      expect(lfoStartMock).toHaveBeenCalledTimes(1);
      expect(lfoStopMock).toHaveBeenCalledTimes(1);
      expect(lfoConnectMock).toHaveBeenCalledTimes(0);  // Because of new instance of `OscillatorNode`
      expect(depthConnectMock).toHaveBeenCalledTimes(1);
    });
  });

  describe(autopanner.connect.name, () => {
    /* eslint-disable dot-notation */
    const originalInput  = autopanner['input'];
    const originalPanner = autopanner['panner'];
    /* eslint-enable dot-notation */

    afterAll(() => {
      /* eslint-disable dot-notation */
      autopanner['input']  = originalInput;
      autopanner['panner'] = originalPanner;
      /* eslint-enable dot-notation */

      autopanner.deactivate();
    });

    test('should call connect method', () => {
      const inputConnectMock     = jest.fn();
      const inputDisconnectMock  = jest.fn();
      const pannerConnectMock    = jest.fn();
      const pannerDisconnectMock = jest.fn();

      /* eslint-disable dot-notation */
      autopanner['input'].connect     = inputConnectMock;
      autopanner['input'].disconnect  = inputDisconnectMock;
      autopanner['panner'].connect    = pannerConnectMock;
      autopanner['panner'].disconnect = pannerDisconnectMock;
      /* eslint-enable dot-notation */

      autopanner.connect();

      expect(inputConnectMock).toHaveBeenCalledTimes(1);
      expect(pannerConnectMock).toHaveBeenCalledTimes(0);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(1);
      expect(pannerDisconnectMock).toHaveBeenCalledTimes(1);

      autopanner.activate();

      expect(inputConnectMock).toHaveBeenCalledTimes(2);
      expect(pannerConnectMock).toHaveBeenCalledTimes(1);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(2);
      expect(pannerDisconnectMock).toHaveBeenCalledTimes(2);
    });
  });

  describe(autopanner.param.name, () => {
    const defaultParams: AutopannerParams = {
      depth: 0,
      rate : 0
    };

    const params: AutopannerParams = {
      depth: 0.5,
      rate : 0.5
    };

    beforeAll(() => {
      autopanner.param(params);
    });

    afterAll(() => {
      autopanner.param(defaultParams);
    });

    test('should return `depth`', () => {
      expect(autopanner.param('depth')).toBeCloseTo(0.5, 1);
    });

    test('should return `rate`', () => {
      expect(autopanner.param('rate')).toBeCloseTo(0.5, 1);
    });
  });

  describe(autopanner.params.name, () => {
    test('should return parameters for autopanner effector as associative array', () => {
      expect(autopanner.params()).toStrictEqual({
        state: false,
        depth: 0,
        rate : 0
      });
    });
  });
});
