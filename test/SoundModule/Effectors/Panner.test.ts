import { AudioContextMock } from '../../../mock/AudioContextMock';
import { Panner, PannerParams } from '../../../src/SoundModule/Effectors/Panner';

describe(Panner.name, () => {
  const context = new AudioContextMock();

  // @ts-ignore
  const panner = new Panner(context);

  describe(panner.connect.name, () => {
    /* eslint-disable dot-notation */
    const originalInput  = panner['input'];
    const originalPanner = panner['panner'];
    /* eslint-enable dot-notation */

    afterAll(() => {
      /* eslint-disable dot-notation */
      panner['input']  = originalInput;
      panner['panner'] = originalPanner;
      /* eslint-enable dot-notation */

      panner.deactivate();
    });

    test('should call `connect` method', () => {
      const inputConnectMock     = jest.fn();
      const inputDisconnectMock  = jest.fn();
      const pannerConnectMock    = jest.fn();
      const pannerDisconnectMock = jest.fn();

      /* eslint-disable dot-notation */
      panner['input'].connect     = inputConnectMock;
      panner['input'].disconnect  = inputDisconnectMock;
      panner['panner'].connect    = pannerConnectMock;
      panner['panner'].disconnect = pannerDisconnectMock;
      /* eslint-enable dot-notation */

      panner.connect();

      expect(inputConnectMock).toHaveBeenCalledTimes(1);
      expect(pannerConnectMock).toHaveBeenCalledTimes(0);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(1);
      expect(pannerDisconnectMock).toHaveBeenCalledTimes(1);

      panner.activate();

      expect(inputConnectMock).toHaveBeenCalledTimes(2);
      expect(pannerConnectMock).toHaveBeenCalledTimes(1);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(2);
      expect(pannerDisconnectMock).toHaveBeenCalledTimes(2);
    });
  });

  describe(panner.param.name, () => {
    const defaultParams: PannerParams = {
      x             : 0,
      y             : 0,
      z             : 0,
      ox            : 1,
      oy            : 0,
      oz            : 0,
      refDistance   : 1,
      maxDistance   : 10000,
      rolloffFactor : 1,
      coneInnerAngle: 360,
      coneOuterAngle: 360,
      coneOuterGain : 0,
      panningModel  : 'HRTF',
      distanceModel : 'inverse'
    };

    const params: PannerParams = {
      x             : 1,
      y             : 1,
      z             : 1,
      ox            : 0,
      oy            : 1,
      oz            : 1,
      refDistance   : 5,
      maxDistance   : 5000,
      rolloffFactor : 5,
      coneInnerAngle: 90,
      coneOuterAngle: 90,
      coneOuterGain : 0.5,
      panningModel  : 'equalpower',
      distanceModel : 'exponential'
    };

    beforeAll(() => {
      panner.param(params);
    });

    afterAll(() => {
      panner.param(defaultParams);
    });

    test('should return `positionX`', () => {
      expect(panner.param('x')).toBeCloseTo(1, 1);
    });

    test('should return `positionY`', () => {
      expect(panner.param('y')).toBeCloseTo(1, 1);
    });

    test('should return `positionZ', () => {
      expect(panner.param('z')).toBeCloseTo(1, 1);
    });

    test('should return `orientationX`', () => {
      expect(panner.param('ox')).toBeCloseTo(0, 1);
    });

    test('should return `orientationY`', () => {
      expect(panner.param('oy')).toBeCloseTo(1, 1);
    });

    test('should return `orientationZ`', () => {
      expect(panner.param('oz')).toBeCloseTo(1, 1);
    });

    test('should return `refDistance`', () => {
      expect(panner.param('refDistance')).toBeCloseTo(5, 1);
    });

    test('should return `maxDistance`', () => {
      expect(panner.param('maxDistance')).toBeCloseTo(5000, 1);
    });

    test('should return `rolloffFacto`r', () => {
      expect(panner.param('rolloffFactor')).toBeCloseTo(5, 1);
    });

    test('should return `coneInnerAngle`', () => {
      expect(panner.param('coneInnerAngle')).toBeCloseTo(90, 1);
    });

    test('should return `coneOuterAngle', () => {
      expect(panner.param('coneOuterAngle')).toBeCloseTo(90, 1);
    });

    test('should return `coneOuterGain`', () => {
      expect(panner.param('coneOuterGain')).toBeCloseTo(0.5, 1);
    });

    test('should return `panningModel`', () => {
      expect(panner.param('panningModel')).toBe('equalpower');
    });

    test('should return `distanceModel`', () => {
      expect(panner.param('distanceModel')).toBe('exponential');
    });
  });

  describe(panner.params.name, () => {
    test('should return parameters for panner as associative array', () => {
      expect(panner.params()).toStrictEqual({
        state         : false,
        x             : 0,
        y             : 0,
        z             : 0,
        ox            : 1,
        oy            : 0,
        oz            : 0,
        refDistance   : 1,
        maxDistance   : 10000,
        rolloffFactor : 1,
        coneInnerAngle: 360,
        coneOuterAngle: 360,
        coneOuterGain : 0,
        panningModel  : 'HRTF',
        distanceModel : 'inverse'
      });
    });
  });
});
