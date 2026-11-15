import type { UberschallParams } from '/src/SoundModule/Effectors/Preamps/Bogner/Uberschall';

import { AudioContextMock } from '/mock/AudioContextMock';
import { Uberschall } from '/src/SoundModule/Effectors/Preamps/Bogner/Uberschall';

describe(Uberschall.name, () => {
  const context = new AudioContextMock();

  // @ts-expect-error Because there is not Web Audio API in Jest environment (Node.js environment), mocks Web Audio API
  const uberschall = new Uberschall(context);

  describe(uberschall.connect.name, () => {
    /* eslint-disable dot-notation */
    const originalInput  = uberschall['input'];
    const originalPreEQ  = uberschall['preEQ']['output'];
    const originalPostEQ = uberschall['postEQ']['output'];
    /* eslint-enable dot-notation */

    afterAll(() => {
      /* eslint-disable dot-notation */
      uberschall['input']            = originalInput;
      uberschall['preEQ']['output']  = originalPreEQ;
      uberschall['postEQ']['output'] = originalPostEQ;
      /* eslint-enable dot-notation */

      uberschall.deactivate();
    });

    test('should call `connect` method', () => {
      const inputConnectMock     = jest.fn();
      const inputDisconnectMock  = jest.fn();
      const preEQConnectMock     = jest.fn();
      const preEQDisconnectMock  = jest.fn();
      const postEQConnectMock    = jest.fn();
      const postEQDisconnectMock = jest.fn();

      /* eslint-disable dot-notation */
      uberschall['input'].connect               = inputConnectMock;
      uberschall['input'].disconnect            = inputDisconnectMock;
      uberschall['preEQ']['output'].connect     = preEQConnectMock;
      uberschall['preEQ']['output'].disconnect  = preEQDisconnectMock;
      uberschall['postEQ']['output'].connect    = postEQConnectMock;
      uberschall['postEQ']['output'].disconnect = postEQDisconnectMock;
      /* eslint-enable dot-notation */

      uberschall.connect();

      expect(inputConnectMock).toHaveBeenCalledTimes(1);
      expect(preEQConnectMock).toHaveBeenCalledTimes(0);
      expect(postEQConnectMock).toHaveBeenCalledTimes(0);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(1);
      expect(preEQDisconnectMock).toHaveBeenCalledTimes(0);
      expect(postEQDisconnectMock).toHaveBeenCalledTimes(0);

      uberschall.activate();

      expect(inputConnectMock).toHaveBeenCalledTimes(2);
      expect(preEQConnectMock).toHaveBeenCalledTimes(1);
      expect(postEQConnectMock).toHaveBeenCalledTimes(1);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(2);
      expect(preEQDisconnectMock).toHaveBeenCalledTimes(0);
      expect(postEQDisconnectMock).toHaveBeenCalledTimes(0);
    });
  });

  describe(uberschall.param.name, () => {
    const defaultPreEQParams: UberschallParams['pre'] = {
      state     : false,
      curve     : null,
      oversample: '4x',
      gain      : 0.5,
      lead      : 0.5
    };

    const defaultPostEQParams: UberschallParams['post'] = {
      state     : false,
      curve     : null,
      oversample: '4x',
      bass      : 0,
      middle    : 0,
      treble    : 0,
      presence  : 0,
      frequency : 500
    };

    const defaultParams: UberschallParams = {
      level  : 0,
      samples: 1024,
      pre    : defaultPreEQParams,
      post   : defaultPostEQParams
    };

    const preEQParams: UberschallParams['pre'] = {
      state     : true,
      curve     : new Float32Array([0, 0, 0, 0]),
      oversample: 'none',
      gain      : 0.75,
      lead      : 0.5
    };

    const postEQParams: UberschallParams['post'] = {
      state     : true,
      curve     : new Float32Array([0, 0, 0, 0]),
      oversample: 'none',
      bass      : 10,
      middle    : -10,
      treble    : 10,
      presence  : 3,
      frequency : 1000
    };

    const params: UberschallParams = {
      level  : 0.5,
      samples: 2048,
      pre    : preEQParams,
      post   : postEQParams
    };

    beforeAll(() => {
      uberschall.param(params);
    });

    afterAll(() => {
      uberschall.param(defaultParams);
    });

    // Setter
    test('should return instance of `Uberschall`', () => {
      expect(uberschall.param(params)).toBeInstanceOf(Uberschall);
    });

    // Getter
    test('should return `level`', () => {
      expect(uberschall.param('level')).toBeCloseTo(0.5, 1);
    });

    test('should return `samples`', () => {
      expect(uberschall.param('samples')).toBe(2048);
    });

    test('should return Pre-Equalizer parameters', () => {
      expect(uberschall.param('pre')).toStrictEqual(preEQParams);
    });

    test('should return Post-Equalizer parameters', () => {
      expect(uberschall.param('post')).toStrictEqual(postEQParams);
    });
  });

  describe(uberschall.params.name, () => {
    test('should return parameters for Bogner Uberschall preamplifier as associative array', () => {
      expect(uberschall.params()).toStrictEqual({
        state  : false,
        level  : 0,
        samples: 1024,
        pre    : uberschall.param('pre'),
        post   : uberschall.param('post')
      });
    });
  });

  describe(uberschall.activate.name, () => {
    test('should call `connect` method', () => {
      const originalConnect = uberschall.connect;

      const connectMock = jest.fn();

      uberschall.connect = connectMock;

      uberschall.activate();

      expect(connectMock).toHaveBeenCalledTimes(1);

      uberschall.connect = originalConnect;
    });
  });

  describe(uberschall.deactivate.name, () => {
    test('should call `connect` method', () => {
      const originalConnect = uberschall.connect;

      const connectMock = jest.fn();

      uberschall.connect = connectMock;

      uberschall.deactivate();

      expect(connectMock).toHaveBeenCalledTimes(1);

      uberschall.connect = originalConnect;
    });
  });
});
