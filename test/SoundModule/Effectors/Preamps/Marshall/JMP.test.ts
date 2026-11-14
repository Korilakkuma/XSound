import type { JMPParams } from '/src/SoundModule/Effectors/Preamps/Marshall/JMP';

import { AudioContextMock } from '/mock/AudioContextMock';
import { JMP } from '/src/SoundModule/Effectors/Preamps/Marshall/JMP';

describe(JMP.name, () => {
  const context = new AudioContextMock();

  // @ts-expect-error Because there is not Web Audio API in Jest environment (Node.js environment), mocks Web Audio API
  const jmp = new JMP(context);

  describe(jmp.connect.name, () => {
    /* eslint-disable dot-notation */
    const originalInput  = jmp['input'];
    const originalPreEQ  = jmp['preEQ']['output'];
    const originalPostEQ = jmp['postEQ']['output'];
    /* eslint-enable dot-notation */

    afterAll(() => {
      /* eslint-disable dot-notation */
      jmp['input']            = originalInput;
      jmp['preEQ']['output']  = originalPreEQ;
      jmp['postEQ']['output'] = originalPostEQ;
      /* eslint-enable dot-notation */

      jmp.deactivate();
    });

    test('should call `connect` method', () => {
      const inputConnectMock     = jest.fn();
      const inputDisconnectMock  = jest.fn();
      const preEQConnectMock     = jest.fn();
      const preEQDisconnectMock  = jest.fn();
      const postEQConnectMock    = jest.fn();
      const postEQDisconnectMock = jest.fn();

      /* eslint-disable dot-notation */
      jmp['input'].connect               = inputConnectMock;
      jmp['input'].disconnect            = inputDisconnectMock;
      jmp['preEQ']['output'].connect     = preEQConnectMock;
      jmp['preEQ']['output'].disconnect  = preEQDisconnectMock;
      jmp['postEQ']['output'].connect    = postEQConnectMock;
      jmp['postEQ']['output'].disconnect = postEQDisconnectMock;
      /* eslint-enable dot-notation */

      jmp.connect();

      expect(inputConnectMock).toHaveBeenCalledTimes(1);
      expect(preEQConnectMock).toHaveBeenCalledTimes(0);
      expect(postEQConnectMock).toHaveBeenCalledTimes(0);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(1);
      expect(preEQDisconnectMock).toHaveBeenCalledTimes(0);
      expect(postEQDisconnectMock).toHaveBeenCalledTimes(0);

      jmp.activate();

      expect(inputConnectMock).toHaveBeenCalledTimes(2);
      expect(preEQConnectMock).toHaveBeenCalledTimes(1);
      expect(postEQConnectMock).toHaveBeenCalledTimes(1);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(2);
      expect(preEQDisconnectMock).toHaveBeenCalledTimes(0);
      expect(postEQDisconnectMock).toHaveBeenCalledTimes(0);
    });
  });

  describe(jmp.param.name, () => {
    const defaultPreEQParams: JMPParams['pre'] = {
      state     : false,
      curve     : null,
      oversample: '4x',
      gain      : 0.5,
      lead      : 0.5
    };

    const defaultPostEQParams: JMPParams['post'] = {
      state     : false,
      curve     : null,
      oversample: '4x',
      bass      : 0,
      middle    : 0,
      treble    : 0,
      frequency : 500
    };

    const defaultParams: JMPParams = {
      level  : 1,
      samples: 1024,
      pre    : defaultPreEQParams,
      post   : defaultPostEQParams
    };

    const preEQParams: JMPParams['pre'] = {
      state     : true,
      curve     : new Float32Array([0, 0, 0, 0]),
      oversample: 'none',
      gain      : 0.75,
      lead      : 0.5
    };

    const postEQParams: JMPParams['post'] = {
      state     : true,
      curve     : new Float32Array([0, 0, 0, 0]),
      oversample: 'none',
      bass      : 10,
      middle    : -10,
      treble    : 10,
      presence  : 0,
      frequency : 1000
    };

    const params: JMPParams = {
      level  : 0.5,
      samples: 2048,
      pre    : preEQParams,
      post   : postEQParams
    };

    beforeAll(() => {
      jmp.param(params);
    });

    afterAll(() => {
      jmp.param(defaultParams);
    });

    // Setter
    test('should return instance of `JMP`', () => {
      expect(jmp.param(params)).toBeInstanceOf(JMP);
    });

    // Getter
    test('should return `level`', () => {
      expect(jmp.param('level')).toBeCloseTo(0.5, 1);
    });

    test('should return `samples`', () => {
      expect(jmp.param('samples')).toBe(2048);
    });

    test('should return Pre-Equalizer parameters', () => {
      expect(jmp.param('pre')).toStrictEqual(preEQParams);
    });

    test('should return Post-Equalizer parameters', () => {
      expect(jmp.param('post')).toStrictEqual(postEQParams);
    });
  });

  describe(jmp.params.name, () => {
    test('should return parameters for Marshall JMP preamplifier as associative array', () => {
      expect(jmp.params()).toStrictEqual({
        state  : false,
        level  : 1,
        samples: 1024,
        pre    : jmp.param('pre'),
        post   : jmp.param('post')
      });
    });
  });

  describe(jmp.activate.name, () => {
    test('should call `connect` method', () => {
      const originalConnect = jmp.connect;

      const connectMock = jest.fn();

      jmp.connect = connectMock;

      jmp.activate();

      expect(connectMock).toHaveBeenCalledTimes(1);

      jmp.connect = originalConnect;
    });
  });

  describe(jmp.deactivate.name, () => {
    test('should call `connect` method', () => {
      const originalConnect = jmp.connect;

      const connectMock = jest.fn();

      jmp.connect = connectMock;

      jmp.deactivate();

      expect(connectMock).toHaveBeenCalledTimes(1);

      jmp.connect = originalConnect;
    });
  });
});
