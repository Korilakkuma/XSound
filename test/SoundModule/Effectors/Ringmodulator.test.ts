import { AudioContextMock } from '../../../mock/AudioContextMock';
import { Ringmodulator, RingmodulatorParams } from '../../../src/SoundModule/Effectors/Ringmodulator';

describe(Ringmodulator.name, () => {
  const context = new AudioContextMock();

  // @ts-ignore
  const ringmodulator = new Ringmodulator(context);

  describe(ringmodulator.stop.name, () => {
    /* eslint-disable dot-notation */
    const originalLFO   = ringmodulator['lfo'];
    const originalDepth = ringmodulator['depth'];
    /* eslint-enable dot-notation */

    afterAll(() => {
      /* eslint-disable dot-notation */
      ringmodulator['lfo']   = originalLFO;
      ringmodulator['depth'] = originalDepth;
      /* eslint-enable dot-notation */

      ringmodulator.deactivate();
    });

    test('should call `connect` method', () => {
      const lfoStartMock     = jest.fn();
      const lfoStopMock      = jest.fn();
      const lfoConnectMock   = jest.fn();
      const depthConnectMock = jest.fn();

      /* eslint-disable dot-notation */
      ringmodulator['lfo'].start           = lfoStartMock;
      ringmodulator['lfo'].stop            = lfoStopMock;
      ringmodulator['lfo'].connect         = lfoConnectMock;
      ringmodulator['lfo'].type            = 'sine';
      ringmodulator['lfo'].frequency.value = 10;
      ringmodulator['depth'].connect       = depthConnectMock;
      /* eslint-enable dot-notation */

      ringmodulator.stop(0, 0);

      expect(lfoStartMock).toHaveBeenCalledTimes(0);
      expect(lfoStopMock).toHaveBeenCalledTimes(0);
      expect(lfoConnectMock).toHaveBeenCalledTimes(0);
      expect(depthConnectMock).toHaveBeenCalledTimes(0);

      ringmodulator.activate();
      ringmodulator.stop(0, 0);

      expect(lfoStartMock).toHaveBeenCalledTimes(1);
      expect(lfoStopMock).toHaveBeenCalledTimes(1);
      expect(lfoConnectMock).toHaveBeenCalledTimes(0);  // Because of new instance of `OscillatorNode`
      expect(depthConnectMock).toHaveBeenCalledTimes(1);
    });
  });

  describe(ringmodulator.connect.name, () => {
    /* eslint-disable dot-notation */
    const originalInput     = ringmodulator['input'];
    const originalAmplitude = ringmodulator['amplitude'];
    /* eslint-enable dot-notation */

    afterAll(() => {
      /* eslint-disable dot-notation */
      ringmodulator['input']     = originalInput;
      ringmodulator['amplitude'] = originalAmplitude;
      /* eslint-enable dot-notation */

      ringmodulator.deactivate();
    });

    test('should call `connect` method', () => {
      const inputConnectMock        = jest.fn();
      const inputDisconnectMock     = jest.fn();
      const amplitudeConnectMock    = jest.fn();
      const amplitudeDisconnectMock = jest.fn();

      /* eslint-disable dot-notation */
      ringmodulator['input'].connect        = inputConnectMock;
      ringmodulator['input'].disconnect     = inputDisconnectMock;
      ringmodulator['amplitude'].connect    = amplitudeConnectMock;
      ringmodulator['amplitude'].disconnect = amplitudeDisconnectMock;
      /* eslint-enable dot-notation */

      ringmodulator.connect();

      expect(inputConnectMock).toHaveBeenCalledTimes(1);
      expect(amplitudeConnectMock).toHaveBeenCalledTimes(0);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(1);
      expect(amplitudeDisconnectMock).toHaveBeenCalledTimes(1);

      ringmodulator.activate();

      expect(inputConnectMock).toHaveBeenCalledTimes(2);
      expect(amplitudeConnectMock).toHaveBeenCalledTimes(1);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(2);
      expect(amplitudeDisconnectMock).toHaveBeenCalledTimes(2);
    });
  });

  describe(ringmodulator.param.name, () => {
    const defaultParams: RingmodulatorParams = {
      depth: 0,
      rate : 0
    };

    const params: RingmodulatorParams = {
      depth: 0.5,
      rate : 0.5
    };

    beforeAll(() => {
      ringmodulator.param(params);
    });

    afterAll(() => {
      ringmodulator.param(defaultParams);
    });

    // Setter
    test('should return instance of `Ringmodulator`', () => {
      expect(ringmodulator.param(params)).toBeInstanceOf(Ringmodulator);
    });

    // Getter
    test('should return `depth`', () => {
      expect(ringmodulator.param('depth')).toBeCloseTo(0.5, 1);
    });

    test('should return `rate`', () => {
      expect(ringmodulator.param('rate')).toBeCloseTo(0.5, 1);
    });
  });

  describe(ringmodulator.params.name, () => {
    test('should return parameters for ring modulator effector as associative array', () => {
      expect(ringmodulator.params()).toStrictEqual({
        state: false,
        depth: 0,
        rate : 0
      });
    });
  });

  describe(ringmodulator.activate.name, () => {
    test('should call `connect` method and start LFO', () => {
      const originalConnect = ringmodulator.connect;

      // eslint-disable-next-line dot-notation
      const originalLFO = ringmodulator['lfo'];

      const connectMock  = jest.fn();
      const lfoStartMock = jest.fn();

      ringmodulator.connect = connectMock;

      // eslint-disable-next-line dot-notation
      ringmodulator['lfo'].start = lfoStartMock;

      ringmodulator.activate();

      expect(connectMock).toHaveBeenCalledTimes(1);
      expect(lfoStartMock).toHaveBeenCalledTimes(1);

      ringmodulator.connect = originalConnect;

      // eslint-disable-next-line dot-notation
      ringmodulator['lfo'] = originalLFO;
    });
  });

  describe(ringmodulator.deactivate.name, () => {
    test('should call `connect` method and stop LFO', () => {
      const originalConnect = ringmodulator.connect;

      // eslint-disable-next-line dot-notation
      const originalLFO = ringmodulator['lfo'];

      const connectMock = jest.fn();
      const lfoStopMock = jest.fn();

      ringmodulator.connect = connectMock;

      // eslint-disable-next-line dot-notation
      ringmodulator['lfo'].stop = lfoStopMock;

      ringmodulator.deactivate();

      expect(connectMock).toHaveBeenCalledTimes(1);
      expect(lfoStopMock).toHaveBeenCalledTimes(1);

      ringmodulator.connect = originalConnect;

      // eslint-disable-next-line dot-notation
      ringmodulator['lfo'] = originalLFO;
    });
  });
});
