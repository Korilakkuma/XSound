import type { RectifierParams } from '/src/SoundModule/Effectors/Preamps/MesaBoogie/Rectifier';

import { AudioContextMock } from '/mock/AudioContextMock';
import { Rectifier } from '/src/SoundModule/Effectors/Preamps/MesaBoogie/Rectifier';

describe(Rectifier.name, () => {
  const context = new AudioContextMock();

  // @ts-expect-error Because there is not Web Audio API in Jest environment (Node.js environment), mocks Web Audio API
  const rectifier = new Rectifier(context);

  describe(rectifier.connect.name, () => {
    /* eslint-disable dot-notation */
    const originalInput          = rectifier['input'];
    const originalPreEQ          = rectifier['preEQ']['output'];
    const originalPostEQ         = rectifier['postEQ']['output'];
    const originalCabinetLowpass = rectifier['cabinetLowpass'];
    const originalCabinetNotch   = rectifier['cabinetNotch'];
    /* eslint-enable dot-notation */

    afterAll(() => {
      /* eslint-disable dot-notation */
      rectifier['input']            = originalInput;
      rectifier['preEQ']['output']  = originalPreEQ;
      rectifier['postEQ']['output'] = originalPostEQ;
      rectifier['cabinetLowpass']   = originalCabinetLowpass;
      rectifier['cabinetNotch']     = originalCabinetNotch;;
      /* eslint-enable dot-notation */

      rectifier.deactivate();
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
      rectifier['input'].connect               = inputConnectMock;
      rectifier['input'].disconnect            = inputDisconnectMock;
      rectifier['preEQ']['output'].connect     = preEQConnectMock;
      rectifier['preEQ']['output'].disconnect  = preEQDisconnectMock;
      rectifier['postEQ']['output'].connect    = postEQConnectMock;
      rectifier['postEQ']['output'].disconnect = postEQDisconnectMock;
      rectifier['cabinetLowpass'].connect      = cabinetLowpassConnectMock;
      rectifier['cabinetLowpass'].disconnect   = cabinetLowpassDisconnectMock;
      rectifier['cabinetNotch'].connect        = cabinetNotchConnectMock;
      rectifier['cabinetNotch'].disconnect     = cabinetNotchDisconnectMock;
      /* eslint-enable dot-notation */

      rectifier.connect();

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

      rectifier.activate();

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

  describe(rectifier.param.name, () => {
    const defaultPreEQParams: RectifierParams['pre'] = {
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

    const defaultPostEQParams: RectifierParams['post'] = {
      state : false,
      fc100 : 0,
      fc360 : 0,
      fc720 : 0,
      fc1600: 0,
      fc4800: 0
    };

    const defaultParams: RectifierParams = {
      pre : defaultPreEQParams,
      post: defaultPostEQParams,
    };

    const preEQParams: RectifierParams['pre'] = {
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

    const postEQParams: RectifierParams['post'] = {
      state : true,
      fc100 : 10,
      fc360 : 10,
      fc720 : 10,
      fc1600: 10,
      fc4800: 10
    };

    const params: RectifierParams = {
      pre : preEQParams,
      post: postEQParams,
    };

    beforeAll(() => {
      rectifier.param(params);
    });

    afterAll(() => {
      rectifier.param(defaultParams);
    });

    // Setter
    test('should return instance of `Rectifier`', () => {
      expect(rectifier.param(params)).toBeInstanceOf(Rectifier);
    });

    // Getter
    test('should return Pre-Equalizer parameters', () => {
      expect(rectifier.param('pre')).toStrictEqual(preEQParams);
    });

    test('should return Post-Equalizer parameters', () => {
      expect(rectifier.param('post')).toStrictEqual(postEQParams);
    });
  });

  describe(rectifier.params.name, () => {
    test('should return parameters for Mesa/Boogie Rectifier preamplifier as associative array', () => {
      expect(rectifier.params()).toStrictEqual({
        state: false,
        pre  : rectifier.param('pre'),
        post : rectifier.param('post'),
      });
    });
  });

  describe(rectifier.activate.name, () => {
    test('should call `connect` method', () => {
      const originalConnect = rectifier.connect;

      const connectMock = jest.fn();

      rectifier.connect = connectMock;

      rectifier.activate();

      expect(connectMock).toHaveBeenCalledTimes(1);

      rectifier.connect = originalConnect;
    });
  });

  describe(rectifier.deactivate.name, () => {
    test('should call `connect` method', () => {
      const originalConnect = rectifier.connect;

      const connectMock = jest.fn();

      rectifier.connect = connectMock;

      rectifier.deactivate();

      expect(connectMock).toHaveBeenCalledTimes(1);

      rectifier.connect = originalConnect;
    });
  });
});
