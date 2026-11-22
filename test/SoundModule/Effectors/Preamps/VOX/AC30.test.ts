import type { AC30Params } from '/src/SoundModule/Effectors/Preamps/VOX/AC30';

import { AudioContextMock } from '/mock/AudioContextMock';
import { AC30 } from '/src/SoundModule/Effectors/Preamps/VOX/AC30';

describe(AC30.name, () => {
  const context = new AudioContextMock();

  // @ts-expect-error Because there is not Web Audio API in Jest environment (Node.js environment), mocks Web Audio API
  const ac30 = new AC30(context);

  describe(ac30.connect.name, () => {
    /* eslint-disable dot-notation */
    const originalInput  = ac30['input'];
    const originalPreEQ  = ac30['preEQ']['output'];
    const originalPostEQ = ac30['postEQ']['output'];
    /* eslint-enable dot-notation */

    afterAll(() => {
      /* eslint-disable dot-notation */
      ac30['input']            = originalInput;
      ac30['preEQ']['output']  = originalPreEQ;
      ac30['postEQ']['output'] = originalPostEQ;
      /* eslint-enable dot-notation */

      ac30.deactivate();
    });

    test('should call `connect` method', () => {
      const inputConnectMock     = jest.fn();
      const inputDisconnectMock  = jest.fn();
      const preEQConnectMock     = jest.fn();
      const preEQDisconnectMock  = jest.fn();
      const postEQConnectMock    = jest.fn();
      const postEQDisconnectMock = jest.fn();

      /* eslint-disable dot-notation */
      ac30['input'].connect               = inputConnectMock;
      ac30['input'].disconnect            = inputDisconnectMock;
      ac30['preEQ']['output'].connect     = preEQConnectMock;
      ac30['preEQ']['output'].disconnect  = preEQDisconnectMock;
      ac30['postEQ']['output'].connect    = postEQConnectMock;
      ac30['postEQ']['output'].disconnect = postEQDisconnectMock;
      /* eslint-enable dot-notation */

      ac30.connect();

      expect(inputConnectMock).toHaveBeenCalledTimes(1);
      expect(preEQConnectMock).toHaveBeenCalledTimes(0);
      expect(postEQConnectMock).toHaveBeenCalledTimes(0);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(1);
      expect(preEQDisconnectMock).toHaveBeenCalledTimes(0);
      expect(postEQDisconnectMock).toHaveBeenCalledTimes(0);

      ac30.activate();

      expect(inputConnectMock).toHaveBeenCalledTimes(2);
      expect(preEQConnectMock).toHaveBeenCalledTimes(1);
      expect(postEQConnectMock).toHaveBeenCalledTimes(1);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(2);
      expect(preEQDisconnectMock).toHaveBeenCalledTimes(0);
      expect(postEQDisconnectMock).toHaveBeenCalledTimes(0);
    });
  });

  describe(ac30.param.name, () => {
    const defaultPreEQParams: AC30Params['pre'] = {
      state     : false,
      curve     : null,
      oversample: '4x',
      gain      : 0.5,
    };

    const defaultPostEQParams: AC30Params['post'] = {
      state     : false,
      curve     : null,
      oversample: '4x',
      bass      : 0,
      treble    : 0,
      tone      : 0
    };

    const defaultParams: AC30Params = {
      level  : 1,
      samples: 1024,
      pre    : defaultPreEQParams,
      post   : defaultPostEQParams
    };

    const preEQParams: AC30Params['pre'] = {
      state     : true,
      curve     : new Float32Array([0, 0, 0, 0]),
      oversample: 'none',
      gain      : 0.75,
    };

    const postEQParams: AC30Params['post'] = {
      state     : true,
      curve     : new Float32Array([0, 0, 0, 0]),
      oversample: 'none',
      bass      : 10,
      treble    : 10,
      tone      : 5
    };

    const params: AC30Params = {
      level  : 0.5,
      samples: 2048,
      pre    : preEQParams,
      post   : postEQParams
    };

    beforeAll(() => {
      ac30.param(params);
    });

    afterAll(() => {
      ac30.param(defaultParams);
    });

    // Setter
    test('should return instance of `AC30`', () => {
      expect(ac30.param(params)).toBeInstanceOf(AC30);
    });

    // Getter
    test('should return `level`', () => {
      expect(ac30.param('level')).toBeCloseTo(0.5, 1);
    });

    test('should return `samples`', () => {
      expect(ac30.param('samples')).toBe(2048);
    });

    test('should return Pre-Equalizer parameters', () => {
      expect(ac30.param('pre')).toStrictEqual(preEQParams);
    });

    test('should return Post-Equalizer parameters', () => {
      expect(ac30.param('post')).toStrictEqual(postEQParams);
    });
  });

  describe(ac30.params.name, () => {
    test('should return parameters for VOX AC30 preamplifier as associative array', () => {
      expect(ac30.params()).toStrictEqual({
        state  : false,
        level  : 1,
        samples: 1024,
        pre    : ac30.param('pre'),
        post   : ac30.param('post')
      });
    });
  });

  describe(ac30.activate.name, () => {
    test('should call `connect` method', () => {
      const originalConnect = ac30.connect;

      const connectMock = jest.fn();

      ac30.connect = connectMock;

      ac30.activate();

      expect(connectMock).toHaveBeenCalledTimes(1);

      ac30.connect = originalConnect;
    });
  });

  describe(ac30.deactivate.name, () => {
    test('should call `connect` method', () => {
      const originalConnect = ac30.connect;

      const connectMock = jest.fn();

      ac30.connect = connectMock;

      ac30.deactivate();

      expect(connectMock).toHaveBeenCalledTimes(1);

      ac30.connect = originalConnect;
    });
  });
});
