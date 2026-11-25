import type { DR103Params } from '/src/SoundModule/Effectors/Preamps/Hiwatt/DR103';

import { AudioContextMock } from '/mock/AudioContextMock';
import { DR103 } from '/src/SoundModule/Effectors/Preamps/Hiwatt/DR103';

describe(DR103.name, () => {
  const context = new AudioContextMock();

  // @ts-expect-error Because there is not Web Audio API in Jest environment (Node.js environment), mocks Web Audio API
  const dr103 = new DR103(context);

  describe(dr103.connect.name, () => {
    /* eslint-disable dot-notation */
    const originalInput  = dr103['input'];
    const originalPreEQ  = dr103['preEQ']['output'];
    const originalPostEQ = dr103['postEQ']['output'];
    /* eslint-enable dot-notation */

    afterAll(() => {
      /* eslint-disable dot-notation */
      dr103['input']            = originalInput;
      dr103['preEQ']['output']  = originalPreEQ;
      dr103['postEQ']['output'] = originalPostEQ;
      /* eslint-enable dot-notation */

      dr103.deactivate();
    });

    test('should call `connect` method', () => {
      const inputConnectMock     = jest.fn();
      const inputDisconnectMock  = jest.fn();
      const preEQConnectMock     = jest.fn();
      const preEQDisconnectMock  = jest.fn();
      const postEQConnectMock    = jest.fn();
      const postEQDisconnectMock = jest.fn();

      /* eslint-disable dot-notation */
      dr103['input'].connect               = inputConnectMock;
      dr103['input'].disconnect            = inputDisconnectMock;
      dr103['preEQ']['output'].connect     = preEQConnectMock;
      dr103['preEQ']['output'].disconnect  = preEQDisconnectMock;
      dr103['postEQ']['output'].connect    = postEQConnectMock;
      dr103['postEQ']['output'].disconnect = postEQDisconnectMock;
      /* eslint-enable dot-notation */

      dr103.connect();

      expect(inputConnectMock).toHaveBeenCalledTimes(1);
      expect(preEQConnectMock).toHaveBeenCalledTimes(0);
      expect(postEQConnectMock).toHaveBeenCalledTimes(0);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(1);
      expect(preEQDisconnectMock).toHaveBeenCalledTimes(0);
      expect(postEQDisconnectMock).toHaveBeenCalledTimes(0);

      dr103.activate();

      expect(inputConnectMock).toHaveBeenCalledTimes(2);
      expect(preEQConnectMock).toHaveBeenCalledTimes(1);
      expect(postEQConnectMock).toHaveBeenCalledTimes(1);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(2);
      expect(preEQDisconnectMock).toHaveBeenCalledTimes(0);
      expect(postEQDisconnectMock).toHaveBeenCalledTimes(0);
    });
  });

  describe(dr103.param.name, () => {
    const defaultPreEQParams: DR103Params['pre'] = {
      state     : false,
      curve     : null,
      oversample: '4x',
      gain      : 0.5,
    };

    const defaultPostEQParams: DR103Params['post'] = {
      state     : false,
      curve     : null,
      oversample: '4x',
      bass      : 0,
      middle    : 0,
      treble    : 0
    };

    const defaultParams: DR103Params = {
      level  : 1,
      samples: 1024,
      pre    : defaultPreEQParams,
      post   : defaultPostEQParams
    };

    const preEQParams: DR103Params['pre'] = {
      state     : true,
      curve     : new Float32Array([0, 0, 0, 0]),
      oversample: 'none',
      gain      : 0.75,
    };

    const postEQParams: DR103Params['post'] = {
      state     : true,
      curve     : new Float32Array([0, 0, 0, 0]),
      oversample: 'none',
      bass      : 10,
      middle    : -5,
      treble    : 10,
    };

    const params: DR103Params = {
      level  : 0.5,
      samples: 2048,
      pre    : preEQParams,
      post   : postEQParams
    };

    beforeAll(() => {
      dr103.param(params);
    });

    afterAll(() => {
      dr103.param(defaultParams);
    });

    // Setter
    test('should return instance of `DR103`', () => {
      expect(dr103.param(params)).toBeInstanceOf(DR103);
    });

    // Getter
    test('should return `level`', () => {
      expect(dr103.param('level')).toBeCloseTo(0.5, 1);
    });

    test('should return `samples`', () => {
      expect(dr103.param('samples')).toBe(2048);
    });

    test('should return Pre-Equalizer parameters', () => {
      expect(dr103.param('pre')).toStrictEqual(preEQParams);
    });

    test('should return Post-Equalizer parameters', () => {
      expect(dr103.param('post')).toStrictEqual(postEQParams);
    });
  });

  describe(dr103.params.name, () => {
    test('should return parameters for Hiwatt DR103 preamplifier as associative array', () => {
      expect(dr103.params()).toStrictEqual({
        state  : false,
        level  : 1,
        samples: 1024,
        pre    : dr103.param('pre'),
        post   : dr103.param('post')
      });
    });
  });

  describe(dr103.activate.name, () => {
    test('should call `connect` method', () => {
      const originalConnect = dr103.connect;

      const connectMock = jest.fn();

      dr103.connect = connectMock;

      dr103.activate();

      expect(connectMock).toHaveBeenCalledTimes(1);

      dr103.connect = originalConnect;
    });
  });

  describe(dr103.deactivate.name, () => {
    test('should call `connect` method', () => {
      const originalConnect = dr103.connect;

      const connectMock = jest.fn();

      dr103.connect = connectMock;

      dr103.deactivate();

      expect(connectMock).toHaveBeenCalledTimes(1);

      dr103.connect = originalConnect;
    });
  });
});
