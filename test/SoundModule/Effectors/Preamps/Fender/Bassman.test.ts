import type { BassmanParams } from '/src/SoundModule/Effectors/Preamps/Fender/Bassman';

import { AudioContextMock } from '/mock/AudioContextMock';
import { Bassman } from '/src/SoundModule/Effectors/Preamps/Fender/Bassman';

describe(Bassman.name, () => {
  const context = new AudioContextMock();

  // @ts-expect-error Because there is not Web Audio API in Jest environment (Node.js environment), mocks Web Audio API
  const bassman = new Bassman(context);

  describe(bassman.connect.name, () => {
    /* eslint-disable dot-notation */
    const originalInput      = bassman['input'];
    const originalPreEQ      = bassman['preEQ']['output'];
    const originalPostFilter = bassman['postFilter']['output'];
    /* eslint-enable dot-notation */

    afterAll(() => {
      /* eslint-disable dot-notation */
      bassman['input']                = originalInput;
      bassman['preEQ']['output']      = originalPreEQ;
      bassman['postFilter']['output'] = originalPostFilter;
      /* eslint-enable dot-notation */

      bassman.deactivate();
    });

    test('should call `connect` method', () => {
      const inputConnectMock         = jest.fn();
      const inputDisconnectMock      = jest.fn();
      const preEQConnectMock         = jest.fn();
      const preEQDisconnectMock      = jest.fn();
      const postFilterConnectMock    = jest.fn();
      const postFilterDisconnectMock = jest.fn();

      /* eslint-disable dot-notation */
      bassman['input'].connect                   = inputConnectMock;
      bassman['input'].disconnect                = inputDisconnectMock;
      bassman['preEQ']['output'].connect         = preEQConnectMock;
      bassman['preEQ']['output'].disconnect      = preEQDisconnectMock;
      bassman['postFilter']['output'].connect    = postFilterConnectMock;
      bassman['postFilter']['output'].disconnect = postFilterDisconnectMock;
      /* eslint-enable dot-notation */

      bassman.connect();

      expect(inputConnectMock).toHaveBeenCalledTimes(1);
      expect(preEQConnectMock).toHaveBeenCalledTimes(0);
      expect(postFilterConnectMock).toHaveBeenCalledTimes(0);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(1);
      expect(preEQDisconnectMock).toHaveBeenCalledTimes(0);
      expect(postFilterDisconnectMock).toHaveBeenCalledTimes(0);

      bassman.activate();

      expect(inputConnectMock).toHaveBeenCalledTimes(2);
      expect(preEQConnectMock).toHaveBeenCalledTimes(1);
      expect(postFilterConnectMock).toHaveBeenCalledTimes(1);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(2);
      expect(preEQDisconnectMock).toHaveBeenCalledTimes(0);
      expect(postFilterDisconnectMock).toHaveBeenCalledTimes(0);
    });
  });

  describe(bassman.param.name, () => {
    const defaultPreEQParams: BassmanParams['pre'] = {
      state     : false,
      gain      : 0.5,
      bass      : 0,
      middle    : 0,
      treble    : 0,
      level     : 0.5,
      samples   : 1024,
      oversample: '4x',
    };

    const defaultPostFilterParams: BassmanParams['post'] = {
      state: false,
      inch : -1,
      tilt : false
    };

    const defaultParams: BassmanParams = {
      pre : defaultPreEQParams,
      post: defaultPostFilterParams,
    };

    const preEQParams: BassmanParams['pre'] = {
      state     : true,
      gain      : 0.75,
      bass      : 10,
      middle    : -10,
      treble    : 10,
      level     : 1,
      samples   : 2048,
      oversample: 'none'
    };

    const postFilterParams: BassmanParams['post'] = {
      state: true,
      inch : 15,
      tilt : true
    };

    const params: BassmanParams = {
      pre : preEQParams,
      post: postFilterParams,
    };

    beforeAll(() => {
      bassman.param(params);
    });

    afterAll(() => {
      bassman.param(defaultParams);
    });

    // Setter
    test('should return instance of `Bassman`', () => {
      expect(bassman.param(params)).toBeInstanceOf(Bassman);
    });

    // Getter
    test('should return Pre-Equalizer parameters', () => {
      expect(bassman.param('pre')).toStrictEqual(preEQParams);
    });

    test('should return Post-Filter parameters', () => {
      expect(bassman.param('post')).toStrictEqual(postFilterParams);
    });
  });

  describe(bassman.params.name, () => {
    test('should return parameters for Fender Bassman preamplifier as associative array', () => {
      expect(bassman.params()).toStrictEqual({
        state: false,
        pre  : bassman.param('pre'),
        post : bassman.param('post'),
      });
    });
  });

  describe(bassman.activate.name, () => {
    test('should call `connect` method', () => {
      const originalConnect = bassman.connect;

      const connectMock = jest.fn();

      bassman.connect = connectMock;

      bassman.activate();

      expect(connectMock).toHaveBeenCalledTimes(1);

      bassman.connect = originalConnect;
    });
  });

  describe(bassman.deactivate.name, () => {
    test('should call `connect` method', () => {
      const originalConnect = bassman.connect;

      const connectMock = jest.fn();

      bassman.connect = connectMock;

      bassman.deactivate();

      expect(connectMock).toHaveBeenCalledTimes(1);

      bassman.connect = originalConnect;
    });
  });
});
