import { AudioContextMock } from '../../../mock/AudioContextMock';
import { Wah, WahParams } from '../../../src/SoundModule/Effectors/Wah';

describe(Wah.name, () => {
  const context = new AudioContextMock();

  // @ts-ignore
  const wah = new Wah(context);

  describe(wah.stop.name, () => {
    /* eslint-disable dot-notation */
    const originalLFO   = wah['lfo'];
    const originalDepth = wah['depth'];
    /* eslint-enable dot-notation */

    afterAll(() => {
      /* eslint-disable dot-notation */
      wah['lfo']   = originalLFO;
      wah['depth'] = originalDepth;
      /* eslint-enable dot-notation */

      wah.deactivate();
    });

    test('should call `connect` method', () => {
      const lfoStartMock     = jest.fn();
      const lfoStopMock      = jest.fn();
      const lfoConnectMock   = jest.fn();
      const depthConnectMock = jest.fn();

      /* eslint-disable dot-notation */
      wah['lfo'].start           = lfoStartMock;
      wah['lfo'].stop            = lfoStopMock;
      wah['lfo'].connect         = lfoConnectMock;
      wah['lfo'].type            = 'sine';
      wah['lfo'].frequency.value = 10;
      wah['depth'].connect       = depthConnectMock;
      /* eslint-enable dot-notation */

      wah.stop(0, 0);

      expect(lfoStartMock).toHaveBeenCalledTimes(0);
      expect(lfoStopMock).toHaveBeenCalledTimes(0);
      expect(lfoConnectMock).toHaveBeenCalledTimes(0);
      expect(depthConnectMock).toHaveBeenCalledTimes(0);

      wah.activate();
      wah.stop(0, 0);

      expect(lfoStartMock).toHaveBeenCalledTimes(1);
      expect(lfoStopMock).toHaveBeenCalledTimes(1);
      expect(lfoConnectMock).toHaveBeenCalledTimes(1);
      expect(depthConnectMock).toHaveBeenCalledTimes(2);  // XXX:
    });
  });

  describe(wah.connect.name, () => {
    // eslint-disable-next-line dot-notation
    const originalInput = wah['input'];

    afterAll(() => {
      // eslint-disable-next-line dot-notation
      wah['input'] = originalInput;

      wah.deactivate();
    });

    test('should call `connect` method', () => {
      const inputConnectMock       = jest.fn();
      const inputDisconnectMock    = jest.fn();

      /* eslint-disable dot-notation */
      wah['input'].connect    = inputConnectMock;
      wah['input'].disconnect = inputDisconnectMock;
      /* eslint-enable dot-notation */

      wah.connect();

      expect(inputConnectMock).toHaveBeenCalledTimes(1);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(1);

      wah.activate();

      expect(inputConnectMock).toHaveBeenCalledTimes(2);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(2);
    });
  });

  describe(wah.param.name, () => {
    describe('normal wah', () => {
      const defaultParams: WahParams = {
        auto     : false,
        cutoff   : 350,
        depth    : 0,
        rate     : 0,
        resonance: 1
      };

      const params: WahParams = {
        auto     : false,
        cutoff   : 1000,
        depth    : 0.5,
        rate     : 0.5,
        resonance: 20
      };

      beforeEach(() => {
        wah.param(params);
      });

      afterAll(() => {
        wah.param(defaultParams);
      });

      test('should return `auto`', () => {
        expect(wah.param('auto')).toBe(false);
      });

      test('should return `cutoff`', () => {
        expect(wah.param('cutoff')).toBeCloseTo(1000, 1);
      });

      test('should return `depth`', () => {
        expect(wah.param('depth')).toBeCloseTo(0.5, 1);
      });

      test('should return `rate`', () => {
        expect(wah.param('rate')).toBeCloseTo(0.5, 1);
      });

      test('should return `resonance`', () => {
        expect(wah.param('resonance')).toBeCloseTo(20, 1);
      });
    });

    describe('auto wah', () => {
      const defaultParams: WahParams = {
        auto     : true,
        cutoff   : 20,
        depth    : 0,
        rate     : 0,
        resonance: 1
      };

      const params: WahParams = {
        auto     : true,
        cutoff   : 1000,
        depth    : 0.5,
        rate     : 0.5,
        resonance: 20
      };

      beforeEach(() => {
        wah.param(params);
      });

      afterAll(() => {
        wah.param({ ...defaultParams, auto: false, cutoff: 350 });
      });

      // Setter
      test('should return instance of `Wah`', () => {
        expect(wah.param(params)).toBeInstanceOf(Wah);
      });

      // Getter
      test('should return `auto`', () => {
        expect(wah.param('auto')).toBe(true);
      });

      test('should return `cutoff`', () => {
        expect(wah.param('cutoff')).toBeCloseTo(1000, 1);
      });

      test('should return `depth`', () => {
        expect(wah.param('depth')).toBeCloseTo(0.5, 1);
      });

      test('should return `rate`', () => {
        expect(wah.param('rate')).toBeCloseTo(0.5, 1);
      });

      test('should return `resonance`', () => {
        expect(wah.param('resonance')).toBeCloseTo(20, 1);
      });
    });
  });

  describe(wah.params.name, () => {
    test('should return parameters for wah effector as associative array', () => {
      expect(wah.params()).toStrictEqual({
        state    : false,
        auto     : false,
        cutoff   : 350,
        depth    : 0,
        rate     : 0,
        resonance: 1
      });
    });
  });

  describe(wah.activate.name, () => {
    test('should call `connect` method and start LFO', () => {
      const originalConnect = wah.connect;

      // eslint-disable-next-line dot-notation
      const originalLFO = wah['lfo'];

      const connectMock  = jest.fn();
      const lfoStartMock = jest.fn();

      wah.connect = connectMock;

      // eslint-disable-next-line dot-notation
      wah['lfo'].start = lfoStartMock;

      wah.activate();

      expect(connectMock).toHaveBeenCalledTimes(1);
      expect(lfoStartMock).toHaveBeenCalledTimes(1);

      wah.connect = originalConnect;

      // eslint-disable-next-line dot-notation
      wah['lfo'] = originalLFO;
    });
  });

  describe(wah.deactivate.name, () => {
    test('should call `connect` method and stop LFO', () => {
      const originalConnect = wah.connect;

      // eslint-disable-next-line dot-notation
      const originalLFO = wah['lfo'];

      const connectMock = jest.fn();
      const lfoStopMock = jest.fn();

      wah.connect = connectMock;

      // eslint-disable-next-line dot-notation
      wah['lfo'].stop = lfoStopMock;

      wah.deactivate();

      expect(connectMock).toHaveBeenCalledTimes(1);
      expect(lfoStopMock).toHaveBeenCalledTimes(1);

      wah.connect = originalConnect;

      // eslint-disable-next-line dot-notation
      wah['lfo'] = originalLFO;
    });
  });
});
