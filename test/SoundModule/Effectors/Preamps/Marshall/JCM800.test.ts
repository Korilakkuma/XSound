import type { JCM800Params } from '/src/SoundModule/Effectors/Preamps/Marshall/JCM800';

import { AudioContextMock } from '/mock/AudioContextMock';
import { JCM800 } from '/src/SoundModule/Effectors/Preamps/Marshall/JCM800';

describe(JCM800.name, () => {
  const context = new AudioContextMock();

  // @ts-expect-error Because there is not Web Audio API in Jest environment (Node.js environment), mocks Web Audio API
  const jcm800 = new JCM800(context);

  describe(jcm800.connect.name, () => {
    /* eslint-disable dot-notation */
    const originalInput  = jcm800['input'];
    const originalPreEQ  = jcm800['preEQ']['output'];
    const originalPostEQ = jcm800['postEQ']['output'];
    /* eslint-enable dot-notation */

    afterAll(() => {
      /* eslint-disable dot-notation */
      jcm800['input']            = originalInput;
      jcm800['preEQ']['output']  = originalPreEQ;
      jcm800['postEQ']['output'] = originalPostEQ;
      /* eslint-enable dot-notation */

      jcm800.deactivate();
    });

    test('should call `connect` method', () => {
      const inputConnectMock     = jest.fn();
      const inputDisconnectMock  = jest.fn();
      const preEQConnectMock     = jest.fn();
      const preEQDisconnectMock  = jest.fn();
      const postEQConnectMock    = jest.fn();
      const postEQDisconnectMock = jest.fn();

      /* eslint-disable dot-notation */
      jcm800['input'].connect               = inputConnectMock;
      jcm800['input'].disconnect            = inputDisconnectMock;
      jcm800['preEQ']['output'].connect     = preEQConnectMock;
      jcm800['preEQ']['output'].disconnect  = preEQDisconnectMock;
      jcm800['postEQ']['output'].connect    = postEQConnectMock;
      jcm800['postEQ']['output'].disconnect = postEQDisconnectMock;
      /* eslint-enable dot-notation */

      jcm800.connect();

      expect(inputConnectMock).toHaveBeenCalledTimes(1);
      expect(preEQConnectMock).toHaveBeenCalledTimes(0);
      expect(postEQConnectMock).toHaveBeenCalledTimes(0);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(1);
      expect(preEQDisconnectMock).toHaveBeenCalledTimes(0);
      expect(postEQDisconnectMock).toHaveBeenCalledTimes(0);

      jcm800.activate();

      expect(inputConnectMock).toHaveBeenCalledTimes(2);
      expect(preEQConnectMock).toHaveBeenCalledTimes(1);
      expect(postEQConnectMock).toHaveBeenCalledTimes(1);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(2);
      expect(preEQDisconnectMock).toHaveBeenCalledTimes(0);
      expect(postEQDisconnectMock).toHaveBeenCalledTimes(0);
    });
  });

  describe(jcm800.param.name, () => {
    const defaultPreEQParams: JCM800Params['pre'] = {
      state     : false,
      curve     : null,
      oversample: '4x',
      gain      : 0.5,
      lead      : 0.5
    };

    const defaultPostEQParams: JCM800Params['post'] = {
      state     : false,
      curve     : null,
      oversample: '4x',
      bass      : 0,
      middle    : 0,
      treble    : 0,
      frequency : 500
    };

    const defaultParams: JCM800Params = {
      level  : 0,
      samples: 1024,
      pre    : defaultPreEQParams,
      post   : defaultPostEQParams
    };

    const preEQParams: JCM800Params['pre'] = {
      state     : true,
      curve     : new Float32Array([0, 0, 0, 0]),
      oversample: 'none',
      gain      : 0.75,
      lead      : 0.5
    };

    const postEQParams: JCM800Params['post'] = {
      state     : true,
      curve     : new Float32Array([0, 0, 0, 0]),
      oversample: 'none',
      bass      : 10,
      middle    : -10,
      treble    : 10,
      presence  : 3,
      frequency : 1000
    };

    const params: JCM800Params = {
      level  : 0.5,
      samples: 2048,
      pre    : preEQParams,
      post   : postEQParams
    };

    beforeAll(() => {
      jcm800.param(params);
    });

    afterAll(() => {
      jcm800.param(defaultParams);
    });

    // Setter
    test('should return instance of `JCM800`', () => {
      expect(jcm800.param(params)).toBeInstanceOf(JCM800);
    });

    // Getter
    test('should return `level`', () => {
      expect(jcm800.param('level')).toBeCloseTo(0.5, 1);
    });

    test('should return `samples`', () => {
      expect(jcm800.param('samples')).toBe(2048);
    });

    test('should return Pre-Equalizer parameters', () => {
      expect(jcm800.param('pre')).toStrictEqual(preEQParams);
    });

    test('should return Post-Equalizer parameters', () => {
      expect(jcm800.param('post')).toStrictEqual(postEQParams);
    });
  });

  describe(jcm800.params.name, () => {
    test('should return parameters for Marshall JCM800 preamplifier as associative array', () => {
      expect(jcm800.params()).toStrictEqual({
        state  : false,
        level  : 0,
        samples: 1024,
        pre    : jcm800.param('pre'),
        post   : jcm800.param('post')
      });
    });
  });

  describe(jcm800.activate.name, () => {
    test('should call `connect` method', () => {
      const originalConnect = jcm800.connect;

      const connectMock = jest.fn();

      jcm800.connect = connectMock;

      jcm800.activate();

      expect(connectMock).toHaveBeenCalledTimes(1);

      jcm800.connect = originalConnect;
    });
  });

  describe(jcm800.deactivate.name, () => {
    test('should call `connect` method', () => {
      const originalConnect = jcm800.connect;

      const connectMock = jest.fn();

      jcm800.connect = connectMock;

      jcm800.deactivate();

      expect(connectMock).toHaveBeenCalledTimes(1);

      jcm800.connect = originalConnect;
    });
  });
});
