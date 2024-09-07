import type { FenderParams } from '/src/SoundModule/Effectors/Preamps/Fender';
import type { CabinetParams } from '/src/SoundModule/Effectors/Preamps/Cabinet';

import { AudioContextMock } from '/mock/AudioContextMock';
import { Fender } from '/src/SoundModule/Effectors/Preamps/Fender';

describe(Fender.name, () => {
  const context = new AudioContextMock();

  // @ts-expect-error Because there is not Web Audio API in Jest environment (Node.js environment), mocks Web Audio API
  const fender = new Fender(context);

  describe(fender.connect.name, () => {
    /* eslint-disable dot-notation */
    const originalInput      = fender['input'];
    const originalPreEQ      = fender['preEQ']['output'];
    const originalPostFilter = fender['postFilter']['output'];
    const originalCabinet    = fender['cabinet']['output'];
    /* eslint-enable dot-notation */

    afterAll(() => {
      /* eslint-disable dot-notation */
      fender['input']                = originalInput;
      fender['preEQ']['output']      = originalPreEQ;
      fender['postFilter']['output'] = originalPostFilter;
      fender['cabinet']['output']    = originalCabinet;
      /* eslint-enable dot-notation */

      fender.deactivate();
    });

    test('should call `connect` method', () => {
      const inputConnectMock         = jest.fn();
      const inputDisconnectMock      = jest.fn();
      const preEQConnectMock         = jest.fn();
      const preEQDisconnectMock      = jest.fn();
      const postFilterConnectMock    = jest.fn();
      const postFilterDisconnectMock = jest.fn();

      /* eslint-disable dot-notation */
      fender['input'].connect                   = inputConnectMock;
      fender['input'].disconnect                = inputDisconnectMock;
      fender['preEQ']['output'].connect         = preEQConnectMock;
      fender['preEQ']['output'].disconnect      = preEQDisconnectMock;
      fender['postFilter']['output'].connect    = postFilterConnectMock;
      fender['postFilter']['output'].disconnect = postFilterDisconnectMock;
      /* eslint-enable dot-notation */

      fender.connect();

      expect(inputConnectMock).toHaveBeenCalledTimes(1);
      expect(preEQConnectMock).toHaveBeenCalledTimes(0);
      expect(postFilterConnectMock).toHaveBeenCalledTimes(0);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(1);
      expect(preEQDisconnectMock).toHaveBeenCalledTimes(0);
      expect(postFilterDisconnectMock).toHaveBeenCalledTimes(0);

      fender.activate();

      expect(inputConnectMock).toHaveBeenCalledTimes(2);
      expect(preEQConnectMock).toHaveBeenCalledTimes(1);
      expect(postFilterConnectMock).toHaveBeenCalledTimes(1);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(2);
      expect(preEQDisconnectMock).toHaveBeenCalledTimes(0);
      expect(postFilterDisconnectMock).toHaveBeenCalledTimes(0);
    });
  });

  describe(fender.param.name, () => {
    const defaultPreEQParams: FenderParams['pre'] = {
      state     : false,
      gain      : 0.5,
      bass      : 0,
      middle    : 0,
      treble    : 0,
      level     : 0.5,
      samples   : 1024,
      oversample: '4x',
    };

    const defaultPostFilterParams: FenderParams['post'] = {
      state: false,
      inch : -1,
      tilt : false
    };

    const defaultCabinetParams: CabinetParams = {
      state: true
    };

    const defaultParams: FenderParams = {
      pre    : defaultPreEQParams,
      post   : defaultPostFilterParams,
      cabinet: defaultCabinetParams
    };

    const preEQParams: FenderParams['pre'] = {
      state     : true,
      gain      : 0.75,
      bass      : 10,
      middle    : -10,
      treble    : 10,
      level     : 1,
      samples   : 2048,
      oversample: 'none'
    };

    const postFilterParams: FenderParams['post'] = {
      state: true,
      inch : 15,
      tilt : true
    };

    const cabinetParams: CabinetParams = {
      state: false
    };

    const params: FenderParams = {
      pre    : preEQParams,
      post   : postFilterParams,
      cabinet: cabinetParams
    };

    beforeAll(() => {
      fender.param(params);
    });

    afterAll(() => {
      fender.param(defaultParams);
    });

    // Setter
    test('should return instance of `Fender`', () => {
      expect(fender.param(params)).toBeInstanceOf(Fender);
    });

    // Getter
    test('should return Pre-Equalizer parameters', () => {
      expect(fender.param('pre')).toStrictEqual(preEQParams);
    });

    test('should return Post-Filter parameters', () => {
      expect(fender.param('post')).toStrictEqual(postFilterParams);
    });

    test('should return Cabinet parameters', () => {
      expect(fender.param('cabinet')).toStrictEqual(cabinetParams);
    });
  });

  describe(fender.params.name, () => {
    test('should return parameters for Fender preamplifier as associative array', () => {
      expect(fender.params()).toStrictEqual({
        state  : false,
        pre    : fender.param('pre'),
        post   : fender.param('post'),
        cabinet: fender.param('cabinet')
      });
    });
  });

  describe(fender.activate.name, () => {
    test('should call `connect` method', () => {
      const originalConnect = fender.connect;

      const connectMock = jest.fn();

      fender.connect = connectMock;

      fender.activate();

      expect(connectMock).toHaveBeenCalledTimes(1);

      fender.connect = originalConnect;
    });
  });

  describe(fender.deactivate.name, () => {
    test('should call `connect` method', () => {
      const originalConnect = fender.connect;

      const connectMock = jest.fn();

      fender.connect = connectMock;

      fender.deactivate();

      expect(connectMock).toHaveBeenCalledTimes(1);

      fender.connect = originalConnect;
    });
  });
});
