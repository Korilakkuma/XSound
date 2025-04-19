import type { PreampParams } from '/src/SoundModule/Effectors/Preamp';

import { AudioContextMock } from '/mock/AudioContextMock';
import { Preamp } from '/src/SoundModule/Effectors/Preamp';
import { Marshall } from '/src/SoundModule/Effectors/Preamps/Marshall';

describe(Preamp.name, () => {
  const context = new AudioContextMock();

  // @ts-expect-error Because there is not Web Audio API in Jest environment (Node.js environment), mocks Web Audio API
  const preamp = new Preamp(context);

  describe(preamp.connect.name, () => {
    // eslint-disable-next-line dot-notation
    const originalConnect = preamp['preamp'].connect;

    const preampConnectMock = jest.fn();

    preamp.activate();

    // eslint-disable-next-line dot-notation
    preamp['preamp'].connect = preampConnectMock;

    preamp.connect();

    expect(preampConnectMock).toHaveBeenCalledTimes(1);

    // eslint-disable-next-line dot-notation
    preamp['preamp'].connect = originalConnect;

    preamp.deactivate();
  });

  describe(preamp.param.name, () => {
    const defaultParams: PreampParams = {
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
        },
        cabinet: {
          state: true
        }
      }
    };

    const params: PreampParams = {
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
        },
        cabinet: {
          state: false
        }
      }
    };

    beforeAll(() => {
      preamp.param(params);
    });

    afterAll(() => {
      preamp.param(defaultParams);
    });

    // Setter
    test('should return instance of `Marshall`', () => {
      expect(preamp.param(params)).toBeInstanceOf(Marshall);
    });

    // Getter
    test('should return `type`', () => {
      expect(preamp.param('type')).toBe('marshall');
    });

    test('should return `preamp`', () => {
      expect(preamp.param('preamp')).toStrictEqual({
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
        },
        cabinet: {
          state: false
        }
      });
    });
  });

  describe(preamp.params.name, () => {
    test('should call preamp `params` method', () => {
      // eslint-disable-next-line dot-notation
      const originalParams = preamp['preamp'].params;

      const preampParamsMock = jest.fn();

      // eslint-disable-next-line dot-notation
      preamp['preamp'].params = preampParamsMock;

      preamp.params();

      expect(preampParamsMock).toHaveBeenCalledTimes(1);

      // eslint-disable-next-line dot-notation
      preamp['preamp'].params = originalParams;
    });
  });

  describe(preamp.activate.name, () => {
    test('should call preamp `activate` method', () => {
      const originalActivate = preamp.activate;

      const preampActivateMock = jest.fn();

      preamp.activate = preampActivateMock;

      preamp.activate();

      expect(preampActivateMock).toHaveBeenCalledTimes(1);

      preamp.activate = originalActivate;
    });
  });

  describe(preamp.deactivate.name, () => {
    test('should call `deactivate` method', () => {
      const originalDeactivate = preamp.deactivate;

      const preampDeactivateMock = jest.fn();

      preamp.deactivate = preampDeactivateMock;

      preamp.deactivate();

      expect(preampDeactivateMock).toHaveBeenCalledTimes(1);

      preamp.deactivate = originalDeactivate;
    });
  });
});
