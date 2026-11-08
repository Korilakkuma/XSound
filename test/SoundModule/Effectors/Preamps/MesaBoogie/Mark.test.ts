import type { MarkParams } from '/src/SoundModule/Effectors/Preamps/MesaBoogie/Mark';

import { AudioContextMock } from '/mock/AudioContextMock';
import { Mark } from '/src/SoundModule/Effectors/Preamps/MesaBoogie/Mark';

describe(Mark.name, () => {
  const context = new AudioContextMock();

  // @ts-expect-error Because there is not Web Audio API in Jest environment (Node.js environment), mocks Web Audio API
  const mark = new Mark(context);

  describe(mark.connect.name, () => {
    /* eslint-disable dot-notation */
    const originalInput          = mark['input'];
    const originalPreEQ          = mark['preEQ']['output'];
    const originalPostEQ         = mark['postEQ']['output'];
    const originalCabinetLowpass = mark['cabinetLowpass'];
    const originalCabinetNotch   = mark['cabinetNotch'];
    /* eslint-enable dot-notation */

    afterAll(() => {
      /* eslint-disable dot-notation */
      mark['input']            = originalInput;
      mark['preEQ']['output']  = originalPreEQ;
      mark['postEQ']['output'] = originalPostEQ;
      mark['cabinetLowpass']   = originalCabinetLowpass;
      mark['cabinetNotch']     = originalCabinetNotch;;
      /* eslint-enable dot-notation */

      mark.deactivate();
    });

    test('should call `connect` method', () => {
      const inputConnectMock             = jest.fn();
      const inputDisconnectMock          = jest.fn();
      const preEQConnectMock             = jest.fn();
      const preEQDisconnectMock          = jest.fn();
      const postEQConnectMock            = jest.fn();
      const postEQDisconnectMock         = jest.fn();
      const cabinetLowpassConnectMock    = jest.fn();
      const cabinetLowpassDisconnectMock = jest.fn();
      const cabinetNotchConnectMock      = jest.fn();
      const cabinetNotchDisconnectMock   = jest.fn();

      /* eslint-disable dot-notation */
      mark['input'].connect               = inputConnectMock;
      mark['input'].disconnect            = inputDisconnectMock;
      mark['preEQ']['output'].connect     = preEQConnectMock;
      mark['preEQ']['output'].disconnect  = preEQDisconnectMock;
      mark['postEQ']['output'].connect    = postEQConnectMock;
      mark['postEQ']['output'].disconnect = postEQDisconnectMock;
      mark['cabinetLowpass'].connect      = cabinetLowpassConnectMock;
      mark['cabinetLowpass'].disconnect   = cabinetLowpassDisconnectMock;
      mark['cabinetNotch'].connect        = cabinetNotchConnectMock;
      mark['cabinetNotch'].disconnect     = cabinetNotchDisconnectMock;
      /* eslint-enable dot-notation */

      mark.connect();

      expect(inputConnectMock).toHaveBeenCalledTimes(1);
      expect(preEQConnectMock).toHaveBeenCalledTimes(0);
      expect(postEQConnectMock).toHaveBeenCalledTimes(0);
      expect(cabinetLowpassConnectMock).toHaveBeenCalledTimes(0);
      expect(cabinetNotchConnectMock).toHaveBeenCalledTimes(0);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(1);
      expect(preEQDisconnectMock).toHaveBeenCalledTimes(0);
      expect(postEQDisconnectMock).toHaveBeenCalledTimes(0);
      expect(cabinetLowpassDisconnectMock).toHaveBeenCalledTimes(1);
      expect(cabinetNotchDisconnectMock).toHaveBeenCalledTimes(1);

      mark.activate();

      expect(inputConnectMock).toHaveBeenCalledTimes(2);
      expect(preEQConnectMock).toHaveBeenCalledTimes(1);
      expect(postEQConnectMock).toHaveBeenCalledTimes(1);
      expect(cabinetLowpassConnectMock).toHaveBeenCalledTimes(1);
      expect(cabinetNotchConnectMock).toHaveBeenCalledTimes(1);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(2);
      expect(preEQDisconnectMock).toHaveBeenCalledTimes(0);
      expect(postEQDisconnectMock).toHaveBeenCalledTimes(0);
      expect(cabinetLowpassDisconnectMock).toHaveBeenCalledTimes(2);
      expect(cabinetNotchDisconnectMock).toHaveBeenCalledTimes(2);
    });
  });

  describe(mark.param.name, () => {
    const defaultPreEQParams: MarkParams['pre'] = {
      state      : false,
      gain       : 0.5,
      bass       : 0,
      middle     : 0,
      treble     : 0,
      level      : 1,
      samples    : 1024,
      oversample : '4x',
      postFilters: true
    };

    const defaultPostEQParams: MarkParams['post'] = {
      state : false,
      fc100 : 0,
      fc360 : 0,
      fc720 : 0,
      fc1600: 0,
      fc4800: 0
    };

    const defaultParams: MarkParams = {
      pre : defaultPreEQParams,
      post: defaultPostEQParams,
    };

    const preEQParams: MarkParams['pre'] = {
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

    const postEQParams: MarkParams['post'] = {
      state : true,
      fc100 : 10,
      fc360 : 10,
      fc720 : 10,
      fc1600: 10,
      fc4800: 10
    };

    const params: MarkParams = {
      pre : preEQParams,
      post: postEQParams,
    };

    beforeAll(() => {
      mark.param(params);
    });

    afterAll(() => {
      mark.param(defaultParams);
    });

    // Setter
    test('should return instance of `Mark`', () => {
      expect(mark.param(params)).toBeInstanceOf(Mark);
    });

    // Getter
    test('should return Pre-Equalizer parameters', () => {
      expect(mark.param('pre')).toStrictEqual(preEQParams);
    });

    test('should return Post-Equalizer parameters', () => {
      expect(mark.param('post')).toStrictEqual(postEQParams);
    });
  });

  describe(mark.params.name, () => {
    test('should return parameters for Mesa/Boogie Mark Series preamplifier as associative array', () => {
      expect(mark.params()).toStrictEqual({
        state: false,
        pre  : mark.param('pre'),
        post : mark.param('post'),
      });
    });
  });

  describe(mark.activate.name, () => {
    test('should call `connect` method', () => {
      const originalConnect = mark.connect;

      const connectMock = jest.fn();

      mark.connect = connectMock;

      mark.activate();

      expect(connectMock).toHaveBeenCalledTimes(1);

      mark.connect = originalConnect;
    });
  });

  describe(mark.deactivate.name, () => {
    test('should call `connect` method', () => {
      const originalConnect = mark.connect;

      const connectMock = jest.fn();

      mark.connect = connectMock;

      mark.deactivate();

      expect(connectMock).toHaveBeenCalledTimes(1);

      mark.connect = originalConnect;
    });
  });
});
