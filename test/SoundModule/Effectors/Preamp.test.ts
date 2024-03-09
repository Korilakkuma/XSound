import type { PreampParams, PreEqualizerParams, PostEqualizerParams, CabinetParams } from '/src/SoundModule/Effectors/Preamp';

import { AudioContextMock } from '/mock/AudioContextMock';
import { Preamp } from '/src/SoundModule/Effectors/Preamp';

describe(Preamp.name, () => {
  const context = new AudioContextMock();

  // @ts-expect-error Because there is not Web Audio API in Jest environment (Node.js environment), mocks Web Audio API
  const preamp = new Preamp(context);

  describe(preamp.connect.name, () => {
    /* eslint-disable dot-notation */
    const originalInput   = preamp['input'];
    const originalPreEQ   = preamp['preEQ']['output'];
    const originalPostEQ  = preamp['postEQ']['output'];
    const originalCabinet = preamp['cabinet']['output'];
    /* eslint-enable dot-notation */

    afterAll(() => {
      /* eslint-disable dot-notation */
      preamp['input']             = originalInput;
      preamp['preEQ']['output']   = originalPreEQ;
      preamp['postEQ']['output']  = originalPostEQ;
      preamp['cabinet']['output'] = originalCabinet;
      /* eslint-enable dot-notation */

      preamp.deactivate();
    });

    test('should call `connect` method', () => {
      const inputConnectMock      = jest.fn();
      const inputDisconnectMock   = jest.fn();
      const preEQConnectMock      = jest.fn();
      const preEQDisconnectMock   = jest.fn();
      const postEQConnectMock     = jest.fn();
      const postEQDisconnectMock  = jest.fn();
      const cabinetConnectMock    = jest.fn();
      const cabinetDisconnectMock = jest.fn();

      /* eslint-disable dot-notation */
      preamp['input'].connect                = inputConnectMock;
      preamp['input'].disconnect             = inputDisconnectMock;
      preamp['preEQ']['output'].connect      = preEQConnectMock;
      preamp['preEQ']['output'].disconnect   = preEQDisconnectMock;
      preamp['postEQ']['output'].connect     = postEQConnectMock;
      preamp['postEQ']['output'].disconnect  = postEQDisconnectMock;
      preamp['cabinet']['output'].connect    = cabinetConnectMock;
      preamp['cabinet']['output'].disconnect = cabinetDisconnectMock;
      /* eslint-enable dot-notation */

      preamp.connect();

      expect(inputConnectMock).toHaveBeenCalledTimes(1);
      expect(preEQConnectMock).toHaveBeenCalledTimes(0);
      expect(postEQConnectMock).toHaveBeenCalledTimes(0);
      expect(cabinetConnectMock).toHaveBeenCalledTimes(0);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(1);
      expect(preEQDisconnectMock).toHaveBeenCalledTimes(0);
      expect(postEQDisconnectMock).toHaveBeenCalledTimes(0);
      expect(cabinetDisconnectMock).toHaveBeenCalledTimes(0);

      preamp.activate();

      expect(inputConnectMock).toHaveBeenCalledTimes(2);
      expect(preEQConnectMock).toHaveBeenCalledTimes(1);
      expect(postEQConnectMock).toHaveBeenCalledTimes(1);
      expect(cabinetConnectMock).toHaveBeenCalledTimes(1);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(2);
      expect(preEQDisconnectMock).toHaveBeenCalledTimes(0);
      expect(postEQDisconnectMock).toHaveBeenCalledTimes(0);
      expect(cabinetDisconnectMock).toHaveBeenCalledTimes(0);
    });
  });

  describe(preamp.param.name, () => {
    const defaultPreEQParams: PreEqualizerParams = {
      state     : false,
      curve     : null,
      oversample: '4x',
      gain      : 0.5,
      lead      : 0.5
    };

    const defaultPostEQParams: PostEqualizerParams = {
      state     : false,
      curve     : null,
      oversample: '4x',
      bass      : 0,
      middle    : 0,
      treble    : 0,
      frequency : 500
    };

    const defaultCabinetParams: CabinetParams = {
      state: true
    };

    const defaultParams: PreampParams = {
      level  : 0,
      samples: 1024,
      pre    : defaultPreEQParams,
      post   : defaultPostEQParams,
      cabinet: defaultCabinetParams
    };

    const preEQParams: PreEqualizerParams = {
      state     : true,
      curve     : new Float32Array([0, 0, 0, 0]),
      oversample: 'none',
      gain      : 0.75,
      lead      : 0.5
    };

    const postEQParams: PostEqualizerParams = {
      state     : true,
      curve     : new Float32Array([0, 0, 0, 0]),
      oversample: 'none',
      bass      : 10,
      middle    : -10,
      treble    : 10,
      frequency : 1000
    };

    const cabinetParams: CabinetParams = {
      state: false
    };

    const params: PreampParams = {
      level  : 0.5,
      samples: 2048,
      pre    : preEQParams,
      post   : postEQParams,
      cabinet: cabinetParams
    };

    beforeAll(() => {
      preamp.param(params);
    });

    afterAll(() => {
      preamp.param(defaultParams);
    });

    // Setter
    test('should return instance of `Preamp`', () => {
      expect(preamp.param(params)).toBeInstanceOf(Preamp);
    });

    // Getter
    test('should return `level`', () => {
      expect(preamp.param('level')).toBeCloseTo(0.5, 1);
    });

    test('should return `samples`', () => {
      expect(preamp.param('samples')).toBe(2048);
    });

    test('should return Pre-Equalizer parameters', () => {
      expect(preamp.param('pre')).toStrictEqual(preEQParams);
    });

    test('should return Post-Equalizer parameters', () => {
      expect(preamp.param('post')).toStrictEqual(postEQParams);
    });

    test('should return Cabinet parameters', () => {
      expect(preamp.param('cabinet')).toStrictEqual(cabinetParams);
    });
  });

  describe(preamp.params.name, () => {
    test('should return parameters for preamp effector as associative array', () => {
      expect(preamp.params()).toStrictEqual({
        state  : false,
        level  : 0,
        samples: 1024,
        pre    : preamp.param('pre'),
        post   : preamp.param('post'),
        cabinet: preamp.param('cabinet')
      });
    });
  });

  describe(preamp.activate.name, () => {
    test('should call `connect` method', () => {
      const originalConnect = preamp.connect;

      const connectMock = jest.fn();

      preamp.connect = connectMock;

      preamp.activate();

      expect(connectMock).toHaveBeenCalledTimes(1);

      preamp.connect = originalConnect;
    });
  });

  describe(preamp.deactivate.name, () => {
    test('should call `connect` method', () => {
      const originalConnect = preamp.connect;

      const connectMock = jest.fn();

      preamp.connect = connectMock;

      preamp.deactivate();

      expect(connectMock).toHaveBeenCalledTimes(1);

      preamp.connect = originalConnect;
    });
  });
});
