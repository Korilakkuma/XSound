import type { IRCabinetParams } from '/src/SoundModule/Effectors/Cabinets/IRCabinet';

import '/mock/fetchMock';

import { AudioContextMock } from '/mock/AudioContextMock';
import { IRCabinet } from '/src/SoundModule/Effectors/Cabinets/IRCabinet';

describe(IRCabinet.name, () => {
  const context = new AudioContextMock();

  // @ts-expect-error Because there is not Web Audio API in Jest environment (Node.js environment), mocks Web Audio API
  const cabinet = new IRCabinet(context);

  describe(cabinet.connect.name, () => {
    /* eslint-disable dot-notation */
    const originalInput    = cabinet['input'];
    const originalTone      = cabinet['tone'];
    const originalConvolver = cabinet['convolver'];
    /* eslint-enable dot-notation */

    afterAll(() => {
      /* eslint-disable dot-notation */
      cabinet['input']     = originalInput;
      cabinet['tone']      = originalTone;;
      cabinet['convolver'] = originalConvolver;
      /* eslint-enable dot-notation */

      cabinet.deactivate();
    });

    test('should call `connect` method', () => {
      const inputConnectMock        = jest.fn();
      const inputDisconnectMock     = jest.fn();
      const toneConnectMock         = jest.fn();
      const toneDisconnectMock      = jest.fn();
      const convolverConnectMock    = jest.fn();
      const convolverDisconnectMock = jest.fn();

      /* eslint-disable dot-notation */
      cabinet['input'].connect        = inputConnectMock;
      cabinet['input'].disconnect     = inputDisconnectMock;
      cabinet['tone'].connect         = toneConnectMock;
      cabinet['tone'].disconnect      = toneDisconnectMock;
      cabinet['convolver'].connect    = convolverConnectMock;
      cabinet['convolver'].disconnect = convolverDisconnectMock;
      /* eslint-enable dot-notation */

      cabinet.connect();

      expect(inputConnectMock).toHaveBeenCalledTimes(1);
      expect(toneConnectMock).toHaveBeenCalledTimes(1);
      expect(convolverConnectMock).toHaveBeenCalledTimes(1);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(1);
      expect(toneDisconnectMock).toHaveBeenCalledTimes(1);
      expect(convolverDisconnectMock).toHaveBeenCalledTimes(1);

      cabinet.deactivate();

      expect(inputConnectMock).toHaveBeenCalledTimes(2);
      expect(toneConnectMock).toHaveBeenCalledTimes(1);
      expect(convolverConnectMock).toHaveBeenCalledTimes(1);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(2);
      expect(toneDisconnectMock).toHaveBeenCalledTimes(2);
      expect(convolverDisconnectMock).toHaveBeenCalledTimes(2);
    });
  });

  describe(cabinet.param.name, () => {
    const defaultParams: IRCabinetParams = {
      state : true,
      buffer: '',
      tone  : 350
    };

    const params: IRCabinetParams = {
      state : false,
      buffer: 'cabinet.wav',
      tone  : 4000,
    };

    beforeAll(() => {
      cabinet.param(params);
    });

    afterAll(() => {
      cabinet.param(defaultParams);
    });

    // Setter
    test('should return instance of `IRCabinet`', () => {
      expect(cabinet.param(params)).toBeInstanceOf(IRCabinet);
    });

    // Getter
    test('should return `state`', () => {
      expect(cabinet.param('state')).toBe(false);
    });

    test('should return `buffer`', () => {
      expect(cabinet.param('buffer')).toBeInstanceOf(AudioBuffer);
    });

    test('should return `tone`', () => {
      expect(cabinet.param('tone')).toBe(4000);
    });
  });

  describe(cabinet.params.name, () => {
    test('should return parameters for IR cabinet as associative array', () => {
      expect(cabinet.params()).toStrictEqual({
        state : true,
        buffer: '',
        tone  : 350,
      });
    });
  });

  describe(cabinet.activate.name, () => {
    test('should call `connect` method', () => {
      const originalConnect = cabinet.connect;

      const connectMock = jest.fn();

      cabinet.connect = connectMock;

      cabinet.activate();

      expect(connectMock).toHaveBeenCalledTimes(1);

      cabinet.connect = originalConnect;
    });
  });

  describe(cabinet.deactivate.name, () => {
    test('should call `connect` method', () => {
      const originalConnect = cabinet.connect;

      const connectMock = jest.fn();

      cabinet.connect = connectMock;

      cabinet.deactivate();

      expect(connectMock).toHaveBeenCalledTimes(1);

      cabinet.connect = originalConnect;
    });
  });
});
