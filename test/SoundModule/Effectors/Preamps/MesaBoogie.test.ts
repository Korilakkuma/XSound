import type { MesaBoogieParams } from '/src/SoundModule/Effectors/Preamps/MesaBoogie';
import type { CabinetParams } from '/src/SoundModule/Effectors/Preamps/Cabinet';

import { AudioContextMock } from '/mock/AudioContextMock';
import { MesaBoogie } from '/src/SoundModule/Effectors/Preamps/MesaBoogie';

describe(MesaBoogie.name, () => {
  const context = new AudioContextMock();

  // @ts-expect-error Because there is not Web Audio API in Jest environment (Node.js environment), mocks Web Audio API
  const mesa = new MesaBoogie(context);

  describe(mesa.connect.name, () => {
    /* eslint-disable dot-notation */
    const originalInput   = mesa['input'];
    const originalPreEQ   = mesa['preEQ']['output'];
    const originalPostEQ  = mesa['postEQ']['output'];
    /* eslint-enable dot-notation */

    afterAll(() => {
      /* eslint-disable dot-notation */
      mesa['input']            = originalInput;
      mesa['preEQ']['output']  = originalPreEQ;
      mesa['postEQ']['output'] = originalPostEQ;
      /* eslint-enable dot-notation */

      mesa.deactivate();
    });

    test('should call `connect` method', () => {
      const inputConnectMock     = jest.fn();
      const inputDisconnectMock  = jest.fn();
      const preEQConnectMock     = jest.fn();
      const preEQDisconnectMock  = jest.fn();
      const postEQConnectMock    = jest.fn();
      const postEQDisconnectMock = jest.fn();

      /* eslint-disable dot-notation */
      mesa['input'].connect               = inputConnectMock;
      mesa['input'].disconnect            = inputDisconnectMock;
      mesa['preEQ']['output'].connect     = preEQConnectMock;
      mesa['preEQ']['output'].disconnect  = preEQDisconnectMock;
      mesa['postEQ']['output'].connect    = postEQConnectMock;
      mesa['postEQ']['output'].disconnect = postEQDisconnectMock;
      /* eslint-enable dot-notation */

      mesa.connect();

      expect(inputConnectMock).toHaveBeenCalledTimes(1);
      expect(preEQConnectMock).toHaveBeenCalledTimes(0);
      expect(postEQConnectMock).toHaveBeenCalledTimes(0);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(1);
      expect(preEQDisconnectMock).toHaveBeenCalledTimes(0);
      expect(postEQDisconnectMock).toHaveBeenCalledTimes(0);

      mesa.activate();

      expect(inputConnectMock).toHaveBeenCalledTimes(2);
      expect(preEQConnectMock).toHaveBeenCalledTimes(1);
      expect(postEQConnectMock).toHaveBeenCalledTimes(1);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(2);
      expect(preEQDisconnectMock).toHaveBeenCalledTimes(0);
      expect(postEQDisconnectMock).toHaveBeenCalledTimes(0);
    });
  });

  describe(mesa.param.name, () => {
    const defaultPreEQParams: MesaBoogieParams['pre'] = {
      state      : false,
      gain       : 0.5,
      bass       : 0,
      middle     : 0,
      treble     : 0,
      level      : 0,
      samples    : 1024,
      oversample : '4x',
      postFilters: true
    };

    const defaultPostEQParams: MesaBoogieParams['post'] = {
      state : false,
      fc100 : 0,
      fc360 : 0,
      fc720 : 0,
      fc1600: 0,
      fc4800: 0
    };

    const defaultCabinetParams: CabinetParams = {
      state: true
    };

    const defaultParams: MesaBoogieParams = {
      pre    : defaultPreEQParams,
      post   : defaultPostEQParams,
      cabinet: defaultCabinetParams
    };

    const preEQParams: MesaBoogieParams['pre'] = {
      state      : true,
      gain       : 1,
      bass       : 10,
      middle     : -10,
      treble     : 10,
      level      : 0.5,
      samples    : 2048,
      oversample : '2x',
      postFilters: false
    };

    const postEQParams: MesaBoogieParams['post'] = {
      state : true,
      fc100 : 10,
      fc360 : 10,
      fc720 : 10,
      fc1600: 10,
      fc4800: 10
    };

    const cabinetParams: CabinetParams = {
      state: false
    };

    const params: MesaBoogieParams = {
      pre    : preEQParams,
      post   : postEQParams,
      cabinet: cabinetParams
    };

    beforeAll(() => {
      mesa.param(params);
    });

    afterAll(() => {
      mesa.param(defaultParams);
    });

    // Setter
    test('should return instance of `MesaBoogie`', () => {
      expect(mesa.param(params)).toBeInstanceOf(MesaBoogie);
    });

    // Getter
    test('should return Pre-Equalizer parameters', () => {
      expect(mesa.param('pre')).toStrictEqual(preEQParams);
    });

    test('should return Post-Equalizer parameters', () => {
      expect(mesa.param('post')).toStrictEqual(postEQParams);
    });

    test('should return Cabinet parameters', () => {
      expect(mesa.param('cabinet')).toStrictEqual(cabinetParams);
    });
  });

  describe(mesa.params.name, () => {
    test('should return parameters for MesaBoogie preamplifier as associative array', () => {
      expect(mesa.params()).toStrictEqual({
        state  : false,
        pre    : mesa.param('pre'),
        post   : mesa.param('post'),
        cabinet: mesa.param('cabinet')
      });
    });
  });

  describe(mesa.activate.name, () => {
    test('should call `connect` method', () => {
      const originalConnect = mesa.connect;

      const connectMock = jest.fn();

      mesa.connect = connectMock;

      mesa.activate();

      expect(connectMock).toHaveBeenCalledTimes(1);

      mesa.connect = originalConnect;
    });
  });

  describe(mesa.deactivate.name, () => {
    test('should call `connect` method', () => {
      const originalConnect = mesa.connect;

      const connectMock = jest.fn();

      mesa.connect = connectMock;

      mesa.deactivate();

      expect(connectMock).toHaveBeenCalledTimes(1);

      mesa.connect = originalConnect;
    });
  });
});
