import type { SLO100Params } from '/src/SoundModule/Effectors/Preamps/Soldano/SLO100';

import { AudioContextMock } from '/mock/AudioContextMock';
import { SLO100 } from '/src/SoundModule/Effectors/Preamps/Soldano/SLO100';

describe(SLO100.name, () => {
  const context = new AudioContextMock();

  // @ts-expect-error Because there is not Web Audio API in Jest environment (Node.js environment), mocks Web Audio API
  const slo100 = new SLO100(context);

  describe(slo100.connect.name, () => {
    /* eslint-disable dot-notation */
    const originalInput  = slo100['input'];
    const originalPreEQ  = slo100['preEQ']['output'];
    const originalPostEQ = slo100['postEQ']['output'];
    /* eslint-enable dot-notation */

    afterAll(() => {
      /* eslint-disable dot-notation */
      slo100['input']            = originalInput;
      slo100['preEQ']['output']  = originalPreEQ;
      slo100['postEQ']['output'] = originalPostEQ;
      /* eslint-enable dot-notation */

      slo100.deactivate();
    });

    test('should call `connect` method', () => {
      const inputConnectMock     = jest.fn();
      const inputDisconnectMock  = jest.fn();
      const preEQConnectMock     = jest.fn();
      const preEQDisconnectMock  = jest.fn();
      const postEQConnectMock    = jest.fn();
      const postEQDisconnectMock = jest.fn();

      /* eslint-disable dot-notation */
      slo100['input'].connect               = inputConnectMock;
      slo100['input'].disconnect            = inputDisconnectMock;
      slo100['preEQ']['output'].connect     = preEQConnectMock;
      slo100['preEQ']['output'].disconnect  = preEQDisconnectMock;
      slo100['postEQ']['output'].connect    = postEQConnectMock;
      slo100['postEQ']['output'].disconnect = postEQDisconnectMock;
      /* eslint-enable dot-notation */

      slo100.connect();

      expect(inputConnectMock).toHaveBeenCalledTimes(1);
      expect(preEQConnectMock).toHaveBeenCalledTimes(0);
      expect(postEQConnectMock).toHaveBeenCalledTimes(0);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(1);
      expect(preEQDisconnectMock).toHaveBeenCalledTimes(0);
      expect(postEQDisconnectMock).toHaveBeenCalledTimes(0);

      slo100.activate();

      expect(inputConnectMock).toHaveBeenCalledTimes(2);
      expect(preEQConnectMock).toHaveBeenCalledTimes(1);
      expect(postEQConnectMock).toHaveBeenCalledTimes(1);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(2);
      expect(preEQDisconnectMock).toHaveBeenCalledTimes(0);
      expect(postEQDisconnectMock).toHaveBeenCalledTimes(0);
    });
  });

  describe(slo100.param.name, () => {
    const defaultPreEQParams: SLO100Params['pre'] = {
      state     : false,
      curve     : null,
      oversample: '4x',
      gain      : 0.5,
      lead      : 0.5
    };

    const defaultPostEQParams: SLO100Params['post'] = {
      state     : false,
      curve     : null,
      oversample: '4x',
      bass      : 0,
      middle    : 0,
      treble    : 0,
      presence  : 0,
      frequency : 500
    };

    const defaultParams: SLO100Params = {
      level  : 0,
      samples: 1024,
      pre    : defaultPreEQParams,
      post   : defaultPostEQParams
    };

    const preEQParams: SLO100Params['pre'] = {
      state     : true,
      curve     : new Float32Array([0, 0, 0, 0]),
      oversample: 'none',
      gain      : 0.75,
      lead      : 0.5
    };

    const postEQParams: SLO100Params['post'] = {
      state     : true,
      curve     : new Float32Array([0, 0, 0, 0]),
      oversample: 'none',
      bass      : 10,
      middle    : -10,
      treble    : 10,
      presence  : 3,
      frequency : 1000
    };

    const params: SLO100Params = {
      level  : 0.5,
      samples: 2048,
      pre    : preEQParams,
      post   : postEQParams
    };

    beforeAll(() => {
      slo100.param(params);
    });

    afterAll(() => {
      slo100.param(defaultParams);
    });

    // Setter
    test('should return instance of `SLO100`', () => {
      expect(slo100.param(params)).toBeInstanceOf(SLO100);
    });

    // Getter
    test('should return `level`', () => {
      expect(slo100.param('level')).toBeCloseTo(0.5, 1);
    });

    test('should return `samples`', () => {
      expect(slo100.param('samples')).toBe(2048);
    });

    test('should return Pre-Equalizer parameters', () => {
      expect(slo100.param('pre')).toStrictEqual(preEQParams);
    });

    test('should return Post-Equalizer parameters', () => {
      expect(slo100.param('post')).toStrictEqual(postEQParams);
    });
  });

  describe(slo100.params.name, () => {
    test('should return parameters for Soldano SLO100 preamplifier as associative array', () => {
      expect(slo100.params()).toStrictEqual({
        state  : false,
        level  : 0,
        samples: 1024,
        pre    : slo100.param('pre'),
        post   : slo100.param('post')
      });
    });
  });

  describe(slo100.activate.name, () => {
    test('should call `connect` method', () => {
      const originalConnect = slo100.connect;

      const connectMock = jest.fn();

      slo100.connect = connectMock;

      slo100.activate();

      expect(connectMock).toHaveBeenCalledTimes(1);

      slo100.connect = originalConnect;
    });
  });

  describe(slo100.deactivate.name, () => {
    test('should call `connect` method', () => {
      const originalConnect = slo100.connect;

      const connectMock = jest.fn();

      slo100.connect = connectMock;

      slo100.deactivate();

      expect(connectMock).toHaveBeenCalledTimes(1);

      slo100.connect = originalConnect;
    });
  });
});
