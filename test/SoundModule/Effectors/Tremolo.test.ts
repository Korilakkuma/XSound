import { AudioContextMock } from '../../../mock/AudioContextMock';
import { Tremolo, TremoloParams } from '../../../src/SoundModule/Effectors/Tremolo';

describe(Tremolo.name, () => {
  const context = new AudioContextMock();

  // @ts-ignore
  const tremolo = new Tremolo(context);

  describe(tremolo.stop.name, () => {
    /* eslint-disable dot-notation */
    const originalLFO   = tremolo['lfo'];
    const originalDepth = tremolo['depth'];
    /* eslint-enable dot-notation */

    afterAll(() => {
      /* eslint-disable dot-notation */
      tremolo['lfo']   = originalLFO;
      tremolo['depth'] = originalDepth;
      /* eslint-enable dot-notation */

      tremolo.deactivate();
    });

    test('should call `connect` method', () => {
      const lfoStartMock     = jest.fn();
      const lfoStopMock      = jest.fn();
      const lfoConnectMock   = jest.fn();
      const depthConnectMock = jest.fn();

      /* eslint-disable dot-notation */
      tremolo['lfo'].start           = lfoStartMock;
      tremolo['lfo'].stop            = lfoStopMock;
      tremolo['lfo'].connect         = lfoConnectMock;
      tremolo['lfo'].type            = 'sine';
      tremolo['lfo'].frequency.value = 10;
      tremolo['depth'].connect       = depthConnectMock;
      /* eslint-enable dot-notation */

      tremolo.stop(0, 0);

      expect(lfoStartMock).toHaveBeenCalledTimes(0);
      expect(lfoStopMock).toHaveBeenCalledTimes(0);
      expect(lfoConnectMock).toHaveBeenCalledTimes(0);
      expect(depthConnectMock).toHaveBeenCalledTimes(0);

      tremolo.activate();
      tremolo.stop(0, 0);

      expect(lfoStartMock).toHaveBeenCalledTimes(1);
      expect(lfoStopMock).toHaveBeenCalledTimes(1);
      expect(lfoConnectMock).toHaveBeenCalledTimes(0);  // Because of new instance of `OscillatorNode`
      expect(depthConnectMock).toHaveBeenCalledTimes(1);
    });
  });

  describe(tremolo.connect.name, () => {
    /* eslint-disable dot-notation */
    const originalInput     = tremolo['input'];
    const originalAmplitude = tremolo['amplitude'];
    /* eslint-enable dot-notation */

    afterAll(() => {
      /* eslint-disable dot-notation */
      tremolo['input']     = originalInput;
      tremolo['amplitude'] = originalAmplitude;
      /* eslint-enable dot-notation */

      tremolo.deactivate();
    });

    test('should call `connect` method', () => {
      const inputConnectMock        = jest.fn();
      const inputDisconnectMock     = jest.fn();
      const amplitudeConnectMock    = jest.fn();
      const amplitudeDisconnectMock = jest.fn();

      /* eslint-disable dot-notation */
      tremolo['input'].connect        = inputConnectMock;
      tremolo['input'].disconnect     = inputDisconnectMock;
      tremolo['amplitude'].connect    = amplitudeConnectMock;
      tremolo['amplitude'].disconnect = amplitudeDisconnectMock;
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
  });

  describe(tremolo.param.name, () => {
    const defaultParams: TremoloParams = {
      type : 'sine',
      depth: 0,
      rate : 0
    };

    const params: TremoloParams = {
      type : 'triangle',
      depth: 0.5,
      rate : 0.5
    };

    beforeAll(() => {
      tremolo.param(params);
    });

    afterAll(() => {
      tremolo.param(defaultParams);
    });

    test('should return `type`', () => {
      expect(tremolo.param('type')).toBe('triangle');
    });

    test('should return `depth`', () => {
      expect(tremolo.param('depth')).toBeCloseTo(0.5, 1);
    });

    test('should return `rate`', () => {
      expect(tremolo.param('rate')).toBeCloseTo(0.5, 1);
    });
  });

  describe(tremolo.params.name, () => {
    test('should return parameters for tremolo effector as associative array', () => {
      expect(tremolo.params()).toStrictEqual({
        state: false,
        type : 'sine',
        depth: 0,
        rate : 0
      });
    });
  });
});
