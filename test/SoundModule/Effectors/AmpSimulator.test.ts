import type { AmpSimulatorParams } from '/src/SoundModule/Effectors/AmpSimulator';

import { AudioContextMock } from '/mock/AudioContextMock';
import { AmpSimulator } from '/src/SoundModule/Effectors/AmpSimulator';

describe(AmpSimulator.name, () => {
  const context = new AudioContextMock();

  // @ts-expect-error Because there is not Web Audio API in Jest environment (Node.js environment), mocks Web Audio API
  const ampsimulator = new AmpSimulator(context);

  describe(ampsimulator.connect.name, () => {
    // eslint-disable-next-line dot-notation
    const originalConnect = ampsimulator['preamp'].connect;

    const preampConnectMock = jest.fn();

    ampsimulator.activate();

    // eslint-disable-next-line dot-notation
    ampsimulator['preamp'].connect = preampConnectMock;

    ampsimulator.connect();

    expect(preampConnectMock).toHaveBeenCalledTimes(1);

    // eslint-disable-next-line dot-notation
    ampsimulator['preamp'].connect = originalConnect;

    ampsimulator.deactivate();
  });

  describe(ampsimulator.param.name, () => {
    const defaultParams: AmpSimulatorParams = {
      state : false,
      type  : 'marshall',
      preamp: {
        state  : false,
        level  : 0,
        samples: 1024,
        pre    : {
          state     : true,
          curve     : new Float32Array([0, 0, 0, 0]),
          oversample: '4x',
          gain      : 0.5,
          lead      : 0.5
        },
        post: {
          state     : true,
          curve     : new Float32Array([0, 0, 0, 0]),
          oversample: '4x',
          bass      : 0,
          middle    : 0,
          treble    : 0,
          frequency : 500
        }
      }
    };

    const params: AmpSimulatorParams = {
      state : true,
      type  : 'marshall',
      preamp: {
        state  : true,
        level  : 0.5,
        samples: 2048,
        pre    : {
          state     : true,
          curve     : new Float32Array([0, 0, 0, 0]),
          oversample: '2x',
          gain      : 0.75,
          lead      : 0.75
        },
        post: {
          state     : true,
          curve     : new Float32Array([0, 0, 0, 0]),
          oversample: '2x',
          bass      : 10,
          middle    : -10,
          treble    : 10,
          frequency : 1000
        }
      }
    };

    beforeAll(() => {
      ampsimulator.param(params);
    });

    afterAll(() => {
      ampsimulator.param(defaultParams);
    });

    // Setter
    test('should return instance of `AmpSimulator`', () => {
      expect(ampsimulator.param(params)).toBeInstanceOf(AmpSimulator);
    });

    // Getter
    test('should return `type`', () => {
      expect(ampsimulator.param('type')).toBe('marshall');
    });

    test('should return `preamp`', () => {
      expect(ampsimulator.param('preamp')).toStrictEqual({
        state  : true,
        level  : 0.5,
        samples: 2048,
        pre    : {
          state     : true,
          curve     : new Float32Array([0, 0, 0, 0]),
          oversample: '2x',
          gain      : 0.75,
          lead      : 0.75
        },
        post: {
          state     : true,
          curve     : new Float32Array([0, 0, 0, 0]),
          oversample: '2x',
          bass      : 10,
          middle    : -10,
          treble    : 10,
          frequency : 1000
        }
      });
    });

    test('should return `cabinet`', () => {
      expect(ampsimulator.param('cabinet')).toStrictEqual({ state: true });
    });
  });

  describe(ampsimulator.params.name, () => {
    test('should call preamp `params` method', () => {
      // eslint-disable-next-line dot-notation
      const originalParams = ampsimulator['preamp'].params;

      const preampParamsMock = jest.fn();

      // eslint-disable-next-line dot-notation
      ampsimulator['preamp'].params = preampParamsMock;

      ampsimulator.params();

      expect(preampParamsMock).toHaveBeenCalledTimes(1);

      // eslint-disable-next-line dot-notation
      ampsimulator['preamp'].params = originalParams;
    });
  });

  describe(ampsimulator.activate.name, () => {
    test('should call preamp `activate` method', () => {
      const originalActivate = ampsimulator.activate;

      const preampActivateMock = jest.fn();

      ampsimulator.activate = preampActivateMock;

      ampsimulator.activate();

      expect(preampActivateMock).toHaveBeenCalledTimes(1);

      ampsimulator.activate = originalActivate;
    });
  });

  describe(ampsimulator.deactivate.name, () => {
    test('should call `deactivate` method', () => {
      const originalDeactivate = ampsimulator.deactivate;

      const preampDeactivateMock = jest.fn();

      ampsimulator.deactivate = preampDeactivateMock;

      ampsimulator.deactivate();

      expect(preampDeactivateMock).toHaveBeenCalledTimes(1);

      ampsimulator.deactivate = originalDeactivate;
    });
  });
});
