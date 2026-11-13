import type { TwinReverbParams } from '/src/SoundModule/Effectors/Preamps/Fender/TwinReverb';

import { AudioContextMock } from '/mock/AudioContextMock';
import { TwinReverb } from '/src/SoundModule/Effectors/Preamps/Fender/TwinReverb';

describe(TwinReverb.name, () => {
  const context = new AudioContextMock();

  // @ts-expect-error Because there is not Web Audio API in Jest environment (Node.js environment), mocks Web Audio API
  const twin = new TwinReverb(context);

  describe(twin.connect.name, () => {
    /* eslint-disable dot-notation */
    const originalInput      = twin['input'];
    const originalPreEQ      = twin['preEQ']['output'];
    const originalPostFilter = twin['postFilter']['output'];
    /* eslint-enable dot-notation */

    afterAll(() => {
      /* eslint-disable dot-notation */
      twin['input']                = originalInput;
      twin['preEQ']['output']      = originalPreEQ;
      twin['postFilter']['output'] = originalPostFilter;
      /* eslint-enable dot-notation */

      twin.deactivate();
    });

    test('should call `connect` method', () => {
      const inputConnectMock         = jest.fn();
      const inputDisconnectMock      = jest.fn();
      const preEQConnectMock         = jest.fn();
      const preEQDisconnectMock      = jest.fn();
      const postFilterConnectMock    = jest.fn();
      const postFilterDisconnectMock = jest.fn();

      /* eslint-disable dot-notation */
      twin['input'].connect                   = inputConnectMock;
      twin['input'].disconnect                = inputDisconnectMock;
      twin['preEQ']['output'].connect         = preEQConnectMock;
      twin['preEQ']['output'].disconnect      = preEQDisconnectMock;
      twin['postFilter']['output'].connect    = postFilterConnectMock;
      twin['postFilter']['output'].disconnect = postFilterDisconnectMock;
      /* eslint-enable dot-notation */

      twin.connect();

      expect(inputConnectMock).toHaveBeenCalledTimes(1);
      expect(preEQConnectMock).toHaveBeenCalledTimes(0);
      expect(postFilterConnectMock).toHaveBeenCalledTimes(0);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(1);
      expect(preEQDisconnectMock).toHaveBeenCalledTimes(0);
      expect(postFilterDisconnectMock).toHaveBeenCalledTimes(0);

      twin.activate();

      expect(inputConnectMock).toHaveBeenCalledTimes(2);
      expect(preEQConnectMock).toHaveBeenCalledTimes(1);
      expect(postFilterConnectMock).toHaveBeenCalledTimes(1);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(2);
      expect(preEQDisconnectMock).toHaveBeenCalledTimes(0);
      expect(postFilterDisconnectMock).toHaveBeenCalledTimes(0);
    });
  });

  describe(twin.param.name, () => {
    const defaultPreEQParams: TwinReverbParams['pre'] = {
      state     : false,
      gain      : 0.5,
      bass      : 0,
      middle    : 0,
      treble    : 0,
      level     : 0.5,
      samples   : 1024,
      oversample: '4x',
    };

    const defaultPostFilterParams: TwinReverbParams['post'] = {
      state: false,
      inch : -1,
      tilt : false
    };

    const defaultParams: TwinReverbParams = {
      pre : defaultPreEQParams,
      post: defaultPostFilterParams,
    };

    const preEQParams: TwinReverbParams['pre'] = {
      state     : true,
      gain      : 0.75,
      bass      : 10,
      middle    : -10,
      treble    : 10,
      level     : 1,
      samples   : 2048,
      oversample: 'none'
    };

    const postFilterParams: TwinReverbParams['post'] = {
      state: true,
      inch : 15,
      tilt : true
    };

    const params: TwinReverbParams = {
      pre : preEQParams,
      post: postFilterParams,
    };

    beforeAll(() => {
      twin.param(params);
    });

    afterAll(() => {
      twin.param(defaultParams);
    });

    // Setter
    test('should return instance of `TwinReverb`', () => {
      expect(twin.param(params)).toBeInstanceOf(TwinReverb);
    });

    // Getter
    test('should return Pre-Equalizer parameters', () => {
      expect(twin.param('pre')).toStrictEqual(preEQParams);
    });

    test('should return Post-Filter parameters', () => {
      expect(twin.param('post')).toStrictEqual(postFilterParams);
    });
  });

  describe(twin.params.name, () => {
    test('should return parameters for Fender Twin Reverb preamplifier as associative array', () => {
      expect(twin.params()).toStrictEqual({
        state: false,
        pre  : twin.param('pre'),
        post : twin.param('post'),
      });
    });
  });

  describe(twin.activate.name, () => {
    test('should call `connect` method', () => {
      const originalConnect = twin.connect;

      const connectMock = jest.fn();

      twin.connect = connectMock;

      twin.activate();

      expect(connectMock).toHaveBeenCalledTimes(1);

      twin.connect = originalConnect;
    });
  });

  describe(twin.deactivate.name, () => {
    test('should call `connect` method', () => {
      const originalConnect = twin.connect;

      const connectMock = jest.fn();

      twin.connect = connectMock;

      twin.deactivate();

      expect(connectMock).toHaveBeenCalledTimes(1);

      twin.connect = originalConnect;
    });
  });
});
