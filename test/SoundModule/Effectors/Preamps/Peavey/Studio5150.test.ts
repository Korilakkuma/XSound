import type { Studio5150Params } from '/src/SoundModule/Effectors/Preamps/Peavey/Studio5150';

import { AudioContextMock } from '/mock/AudioContextMock';
import { Studio5150 } from '/src/SoundModule/Effectors/Preamps/Peavey/Studio5150';

describe(Studio5150.name, () => {
  const context = new AudioContextMock();

  // @ts-expect-error Because there is not Web Audio API in Jest environment (Node.js environment), mocks Web Audio API
  const studio5150 = new Studio5150(context);

  describe(studio5150.connect.name, () => {
    /* eslint-disable dot-notation */
    const originalInput  = studio5150['input'];
    const originalPreEQ  = studio5150['preEQ']['output'];
    const originalPostEQ = studio5150['postEQ']['output'];
    /* eslint-enable dot-notation */

    afterAll(() => {
      /* eslint-disable dot-notation */
      studio5150['input']            = originalInput;
      studio5150['preEQ']['output']  = originalPreEQ;
      studio5150['postEQ']['output'] = originalPostEQ;
      /* eslint-enable dot-notation */

      studio5150.deactivate();
    });

    test('should call `connect` method', () => {
      const inputConnectMock     = jest.fn();
      const inputDisconnectMock  = jest.fn();
      const preEQConnectMock     = jest.fn();
      const preEQDisconnectMock  = jest.fn();
      const postEQConnectMock    = jest.fn();
      const postEQDisconnectMock = jest.fn();

      /* eslint-disable dot-notation */
      studio5150['input'].connect               = inputConnectMock;
      studio5150['input'].disconnect            = inputDisconnectMock;
      studio5150['preEQ']['output'].connect     = preEQConnectMock;
      studio5150['preEQ']['output'].disconnect  = preEQDisconnectMock;
      studio5150['postEQ']['output'].connect    = postEQConnectMock;
      studio5150['postEQ']['output'].disconnect = postEQDisconnectMock;
      /* eslint-enable dot-notation */

      studio5150.connect();

      expect(inputConnectMock).toHaveBeenCalledTimes(1);
      expect(preEQConnectMock).toHaveBeenCalledTimes(0);
      expect(postEQConnectMock).toHaveBeenCalledTimes(0);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(1);
      expect(preEQDisconnectMock).toHaveBeenCalledTimes(0);
      expect(postEQDisconnectMock).toHaveBeenCalledTimes(0);

      studio5150.activate();

      expect(inputConnectMock).toHaveBeenCalledTimes(2);
      expect(preEQConnectMock).toHaveBeenCalledTimes(1);
      expect(postEQConnectMock).toHaveBeenCalledTimes(1);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(2);
      expect(preEQDisconnectMock).toHaveBeenCalledTimes(0);
      expect(postEQDisconnectMock).toHaveBeenCalledTimes(0);
    });
  });

  describe(studio5150.param.name, () => {
    const defaultPreEQParams: Studio5150Params['pre'] = {
      state     : false,
      curve     : null,
      oversample: '4x',
      gain      : 0.5,
      lead      : 0.5
    };

    const defaultPostEQParams: Studio5150Params['post'] = {
      state     : false,
      curve     : null,
      oversample: '4x',
      bass      : 0,
      middle    : 0,
      treble    : 0,
      presence  : 0,
      frequency : 500
    };

    const defaultParams: Studio5150Params = {
      level  : 0,
      samples: 1024,
      pre    : defaultPreEQParams,
      post   : defaultPostEQParams
    };

    const preEQParams: Studio5150Params['pre'] = {
      state     : true,
      curve     : new Float32Array([0, 0, 0, 0]),
      oversample: 'none',
      gain      : 0.75,
      lead      : 0.5
    };

    const postEQParams: Studio5150Params['post'] = {
      state     : true,
      curve     : new Float32Array([0, 0, 0, 0]),
      oversample: 'none',
      bass      : 10,
      middle    : -10,
      treble    : 10,
      presence  : 3,
      frequency : 1000
    };

    const params: Studio5150Params = {
      level  : 0.5,
      samples: 2048,
      pre    : preEQParams,
      post   : postEQParams
    };

    beforeAll(() => {
      studio5150.param(params);
    });

    afterAll(() => {
      studio5150.param(defaultParams);
    });

    // Setter
    test('should return instance of `Studio5150`', () => {
      expect(studio5150.param(params)).toBeInstanceOf(Studio5150);
    });

    // Getter
    test('should return `level`', () => {
      expect(studio5150.param('level')).toBeCloseTo(0.5, 1);
    });

    test('should return `samples`', () => {
      expect(studio5150.param('samples')).toBe(2048);
    });

    test('should return Pre-Equalizer parameters', () => {
      expect(studio5150.param('pre')).toStrictEqual(preEQParams);
    });

    test('should return Post-Equalizer parameters', () => {
      expect(studio5150.param('post')).toStrictEqual(postEQParams);
    });
  });

  describe(studio5150.params.name, () => {
    test('should return parameters for Peavey 5150 preamplifier as associative array', () => {
      expect(studio5150.params()).toStrictEqual({
        state  : false,
        level  : 0,
        samples: 1024,
        pre    : studio5150.param('pre'),
        post   : studio5150.param('post')
      });
    });
  });

  describe(studio5150.activate.name, () => {
    test('should call `connect` method', () => {
      const originalConnect = studio5150.connect;

      const connectMock = jest.fn();

      studio5150.connect = connectMock;

      studio5150.activate();

      expect(connectMock).toHaveBeenCalledTimes(1);

      studio5150.connect = originalConnect;
    });
  });

  describe(studio5150.deactivate.name, () => {
    test('should call `connect` method', () => {
      const originalConnect = studio5150.connect;

      const connectMock = jest.fn();

      studio5150.connect = connectMock;

      studio5150.deactivate();

      expect(connectMock).toHaveBeenCalledTimes(1);

      studio5150.connect = originalConnect;
    });
  });
});
