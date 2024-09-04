import type { MarshallParams } from '/src/SoundModule/Effectors/Preamps/Marshall';
import type { CabinetParams } from '/src/SoundModule/Effectors/Preamps/Cabinet';

import { AudioContextMock } from '/mock/AudioContextMock';
import { Marshall } from '/src/SoundModule/Effectors/Preamps/Marshall';

describe(Marshall.name, () => {
  const context = new AudioContextMock();

  // @ts-expect-error Because there is not Web Audio API in Jest environment (Node.js environment), mocks Web Audio API
  const marshall = new Marshall(context);

  describe(marshall.connect.name, () => {
    /* eslint-disable dot-notation */
    const originalInput   = marshall['input'];
    const originalPreEQ   = marshall['preEQ']['output'];
    const originalPostEQ  = marshall['postEQ']['output'];
    const originalCabinet = marshall['cabinet']['output'];
    /* eslint-enable dot-notation */

    afterAll(() => {
      /* eslint-disable dot-notation */
      marshall['input']             = originalInput;
      marshall['preEQ']['output']   = originalPreEQ;
      marshall['postEQ']['output']  = originalPostEQ;
      marshall['cabinet']['output'] = originalCabinet;
      /* eslint-enable dot-notation */

      marshall.deactivate();
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
      marshall['input'].connect                = inputConnectMock;
      marshall['input'].disconnect             = inputDisconnectMock;
      marshall['preEQ']['output'].connect      = preEQConnectMock;
      marshall['preEQ']['output'].disconnect   = preEQDisconnectMock;
      marshall['postEQ']['output'].connect     = postEQConnectMock;
      marshall['postEQ']['output'].disconnect  = postEQDisconnectMock;
      marshall['cabinet']['output'].connect    = cabinetConnectMock;
      marshall['cabinet']['output'].disconnect = cabinetDisconnectMock;
      /* eslint-enable dot-notation */

      marshall.connect();

      expect(inputConnectMock).toHaveBeenCalledTimes(1);
      expect(preEQConnectMock).toHaveBeenCalledTimes(0);
      expect(postEQConnectMock).toHaveBeenCalledTimes(0);
      expect(cabinetConnectMock).toHaveBeenCalledTimes(0);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(1);
      expect(preEQDisconnectMock).toHaveBeenCalledTimes(0);
      expect(postEQDisconnectMock).toHaveBeenCalledTimes(0);
      expect(cabinetDisconnectMock).toHaveBeenCalledTimes(0);

      marshall.activate();

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

  describe(marshall.param.name, () => {
    const defaultPreEQParams: MarshallParams['pre'] = {
      state     : false,
      curve     : null,
      oversample: '4x',
      gain      : 0.5,
      lead      : 0.5
    };

    const defaultPostEQParams: MarshallParams['post'] = {
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

    const defaultParams: MarshallParams = {
      level  : 0,
      samples: 1024,
      pre    : defaultPreEQParams,
      post   : defaultPostEQParams,
      cabinet: defaultCabinetParams
    };

    const preEQParams: MarshallParams['pre'] = {
      state     : true,
      curve     : new Float32Array([0, 0, 0, 0]),
      oversample: 'none',
      gain      : 0.75,
      lead      : 0.5
    };

    const postEQParams: MarshallParams['post'] = {
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

    const params: MarshallParams = {
      level  : 0.5,
      samples: 2048,
      pre    : preEQParams,
      post   : postEQParams,
      cabinet: cabinetParams
    };

    beforeAll(() => {
      marshall.param(params);
    });

    afterAll(() => {
      marshall.param(defaultParams);
    });

    // Setter
    test('should return instance of `Marshall`', () => {
      expect(marshall.param(params)).toBeInstanceOf(Marshall);
    });

    // Getter
    test('should return `level`', () => {
      expect(marshall.param('level')).toBeCloseTo(0.5, 1);
    });

    test('should return `samples`', () => {
      expect(marshall.param('samples')).toBe(2048);
    });

    test('should return Pre-Equalizer parameters', () => {
      expect(marshall.param('pre')).toStrictEqual(preEQParams);
    });

    test('should return Post-Equalizer parameters', () => {
      expect(marshall.param('post')).toStrictEqual(postEQParams);
    });

    test('should return Cabinet parameters', () => {
      expect(marshall.param('cabinet')).toStrictEqual(cabinetParams);
    });
  });

  describe(marshall.params.name, () => {
    test('should return parameters for Marshall preamplifier as associative array', () => {
      expect(marshall.params()).toStrictEqual({
        state  : false,
        level  : 0,
        samples: 1024,
        pre    : marshall.param('pre'),
        post   : marshall.param('post'),
        cabinet: marshall.param('cabinet')
      });
    });
  });

  describe(marshall.activate.name, () => {
    test('should call `connect` method', () => {
      const originalConnect = marshall.connect;

      const connectMock = jest.fn();

      marshall.connect = connectMock;

      marshall.activate();

      expect(connectMock).toHaveBeenCalledTimes(1);

      marshall.connect = originalConnect;
    });
  });

  describe(marshall.deactivate.name, () => {
    test('should call `connect` method', () => {
      const originalConnect = marshall.connect;

      const connectMock = jest.fn();

      marshall.connect = connectMock;

      marshall.deactivate();

      expect(connectMock).toHaveBeenCalledTimes(1);

      marshall.connect = originalConnect;
    });
  });
});
