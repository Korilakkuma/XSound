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
      state      : false,
      preampType : 'marshall',
      cabinetType: 'simple',
      preamp: {
        state: true,
        pre  : {
          state      : true,
          gain       : 0,
          bass       : 0,
          middle     : 0,
          treble     : 0,
          level      : 0,
          samples    : 1024,
          oversample : '4x',
          postFilters: true
        },
        post : {
          state : true,
          fc100 : 0,
          fc360 : 0,
          fc720 : 0,
          fc1600: 0,
          fc4800: 0
        }
      },
      cabinet: {
        state: true,
      }
    };

    const params: AmpSimulatorParams = {
      state      : true,
      preampType : 'mesa/boogie',
      cabinetType: 'filterbank',
      preamp     : {
        state: true,
        pre  : {
          state      : true,
          gain       : 0,
          bass       : 0,
          middle     : 0,
          treble     : 0,
          level      : 0,
          samples    : 1024,
          oversample : '4x',
          postFilters: true
        },
        post      : {
          state : true,
          fc100 : 0,
          fc360 : 0,
          fc720 : 0,
          fc1600: 0,
          fc4800: 0
        }
      },
      cabinet     : {
        state   : true,
        notch   : { frequency: 8800, gain: 0.0,  Q: 0.6 },
        preTone : { frequency: 4400, gain: 0.0,  Q: 0.0 },
        postTone: { frequency: 6400, gain: 0.0,  Q: 6.4 },
        preBass : { frequency: 120,  gain: 0.0,  Q: 2.0 },
        postBass: { frequency: 80,   gain: 0.0,  Q: 6.0 },
        middle  : { frequency: 1340, gain: -8.0, Q: 3.0 },
        treble  : { frequency: 1340, gain: 8.0,  Q: 3.0 }
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
    test('should return `preampType`', () => {
      expect(ampsimulator.param('preampType')).toBe('mesa/boogie');
    });

    test('should return `cabinetType`', () => {
      expect(ampsimulator.param('cabinetType')).toBe('filterbank');
    });

    test('should return `preamp`', () => {
      expect(ampsimulator.param('preamp')).toStrictEqual({
        state: true,
        pre  : {
          state      : true,
          gain       : 0,
          bass       : 0,
          middle     : 0,
          treble     : 0,
          level      : 0,
          samples    : 1024,
          oversample : '4x',
          postFilters: true
        },
        post : {
          state : true,
          fc100 : 0,
          fc360 : 0,
          fc720 : 0,
          fc1600: 0,
          fc4800: 0
        }
      });
    });

    test('should return `cabinet`', () => {
      expect(ampsimulator.param('cabinet')).toStrictEqual({
        state   : true,
        notch   : { frequency: 8800, gain: 0.0,  Q: 0.6 },
        preTone : { frequency: 4400, gain: 0.0,  Q: 0.0 },
        postTone: { frequency: 6400, gain: 0.0,  Q: 6.4 },
        preBass : { frequency: 120,  gain: 0.0,  Q: 2.0 },
        postBass: { frequency: 80,   gain: 0.0,  Q: 6.0 },
        middle  : { frequency: 1340, gain: -8.0, Q: 3.0 },
        treble  : { frequency: 1340, gain: 8.0,  Q: 3.0 }
      });
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
