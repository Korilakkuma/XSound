import type { JTM45Params } from '/src/SoundModule/Effectors/Preamps/Marshall/JTM45';

import { AudioContextMock } from '/mock/AudioContextMock';
import { JTM45 } from '/src/SoundModule/Effectors/Preamps/Marshall/JTM45';

describe(JTM45.name, () => {
  const context = new AudioContextMock();

  // @ts-expect-error Because there is not Web Audio API in Jest environment (Node.js environment), mocks Web Audio API
  const jtm45 = new JTM45(context);

  describe(jtm45.connect.name, () => {
    /* eslint-disable dot-notation */
    const originalInput  = jtm45['input'];
    const originalPreEQ  = jtm45['preEQ']['output'];
    const originalPostEQ = jtm45['postEQ']['output'];
    /* eslint-enable dot-notation */

    afterAll(() => {
      /* eslint-disable dot-notation */
      jtm45['input']            = originalInput;
      jtm45['preEQ']['output']  = originalPreEQ;
      jtm45['postEQ']['output'] = originalPostEQ;
      /* eslint-enable dot-notation */

      jtm45.deactivate();
    });

    test('should call `connect` method', () => {
      const inputConnectMock     = jest.fn();
      const inputDisconnectMock  = jest.fn();
      const preEQConnectMock     = jest.fn();
      const preEQDisconnectMock  = jest.fn();
      const postEQConnectMock    = jest.fn();
      const postEQDisconnectMock = jest.fn();

      /* eslint-disable dot-notation */
      jtm45['input'].connect               = inputConnectMock;
      jtm45['input'].disconnect            = inputDisconnectMock;
      jtm45['preEQ']['output'].connect     = preEQConnectMock;
      jtm45['preEQ']['output'].disconnect  = preEQDisconnectMock;
      jtm45['postEQ']['output'].connect    = postEQConnectMock;
      jtm45['postEQ']['output'].disconnect = postEQDisconnectMock;
      /* eslint-enable dot-notation */

      jtm45.connect();

      expect(inputConnectMock).toHaveBeenCalledTimes(1);
      expect(preEQConnectMock).toHaveBeenCalledTimes(0);
      expect(postEQConnectMock).toHaveBeenCalledTimes(0);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(1);
      expect(preEQDisconnectMock).toHaveBeenCalledTimes(0);
      expect(postEQDisconnectMock).toHaveBeenCalledTimes(0);

      jtm45.activate();

      expect(inputConnectMock).toHaveBeenCalledTimes(2);
      expect(preEQConnectMock).toHaveBeenCalledTimes(1);
      expect(postEQConnectMock).toHaveBeenCalledTimes(1);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(2);
      expect(preEQDisconnectMock).toHaveBeenCalledTimes(0);
      expect(postEQDisconnectMock).toHaveBeenCalledTimes(0);
    });
  });

  describe(jtm45.param.name, () => {
    const defaultPreEQParams: JTM45Params['pre'] = {
      state     : false,
      curve     : null,
      oversample: '4x',
      gain      : 0.5,
      lead      : 0.5
    };

    const defaultPostEQParams: JTM45Params['post'] = {
      state     : false,
      curve     : null,
      oversample: '4x',
      bass      : 0,
      middle    : 0,
      treble    : 0,
      frequency : 500
    };

    const defaultParams: JTM45Params = {
      level  : 0,
      samples: 1024,
      pre    : defaultPreEQParams,
      post   : defaultPostEQParams
    };

    const preEQParams: JTM45Params['pre'] = {
      state     : true,
      curve     : new Float32Array([0, 0, 0, 0]),
      oversample: 'none',
      gain      : 0.75,
      lead      : 0.5
    };

    const postEQParams: JTM45Params['post'] = {
      state     : true,
      curve     : new Float32Array([0, 0, 0, 0]),
      oversample: 'none',
      bass      : 10,
      middle    : -10,
      treble    : 10,
      presence  : 0,
      frequency : 1000
    };

    const params: JTM45Params = {
      level  : 0.5,
      samples: 2048,
      pre    : preEQParams,
      post   : postEQParams
    };

    beforeAll(() => {
      jtm45.param(params);
    });

    afterAll(() => {
      jtm45.param(defaultParams);
    });

    // Setter
    test('should return instance of `JTM45`', () => {
      expect(jtm45.param(params)).toBeInstanceOf(JTM45);
    });

    // Getter
    test('should return `level`', () => {
      expect(jtm45.param('level')).toBeCloseTo(0.5, 1);
    });

    test('should return `samples`', () => {
      expect(jtm45.param('samples')).toBe(2048);
    });

    test('should return Pre-Equalizer parameters', () => {
      expect(jtm45.param('pre')).toStrictEqual(preEQParams);
    });

    test('should return Post-Equalizer parameters', () => {
      expect(jtm45.param('post')).toStrictEqual(postEQParams);
    });
  });

  describe(jtm45.params.name, () => {
    test('should return parameters for Marshall JTM45 preamplifier as associative array', () => {
      expect(jtm45.params()).toStrictEqual({
        state  : false,
        level  : 0,
        samples: 1024,
        pre    : jtm45.param('pre'),
        post   : jtm45.param('post')
      });
    });
  });

  describe(jtm45.activate.name, () => {
    test('should call `connect` method', () => {
      const originalConnect = jtm45.connect;

      const connectMock = jest.fn();

      jtm45.connect = connectMock;

      jtm45.activate();

      expect(connectMock).toHaveBeenCalledTimes(1);

      jtm45.connect = originalConnect;
    });
  });

  describe(jtm45.deactivate.name, () => {
    test('should call `connect` method', () => {
      const originalConnect = jtm45.connect;

      const connectMock = jest.fn();

      jtm45.connect = connectMock;

      jtm45.deactivate();

      expect(connectMock).toHaveBeenCalledTimes(1);

      jtm45.connect = originalConnect;
    });
  });
});
