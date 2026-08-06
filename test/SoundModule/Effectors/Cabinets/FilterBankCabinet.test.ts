import type { FilterBankCabinetParams } from '/src/SoundModule/Effectors/Cabinets/FilterBankCabinet';

import { AudioContextMock } from '/mock/AudioContextMock';
import { FilterBankCabinet } from '/src/SoundModule/Effectors/Cabinets/FilterBankCabinet';

describe(FilterBankCabinet.name, () => {
  const context = new AudioContextMock();

  // @ts-expect-error Because there is not Web Audio API in Jest environment (Node.js environment), mocks Web Audio API
  const cabinet = new FilterBankCabinet(context);

  describe(cabinet.connect.name, () => {
    /* eslint-disable dot-notation */
    const originalInput    = cabinet['input'];
    const originalNotch    = cabinet['notch'];
    const originalpreTone  = cabinet['preTone'];
    const originalpostTone = cabinet['postTone'];
    const originalpreBass  = cabinet['preBass'];
    const originalpostBass = cabinet['postBass'];
    const originalMiddle   = cabinet['middle'];
    const originalTreble   = cabinet['treble'];
    /* eslint-enable dot-notation */

    afterAll(() => {
      /* eslint-disable dot-notation */
      cabinet['input']    = originalInput;
      cabinet['notch']    = originalNotch;
      cabinet['preTone']  = originalpreTone;
      cabinet['postTone'] = originalpostTone;
      cabinet['preBass']  = originalpreBass;
      cabinet['postBass'] = originalpostBass;
      cabinet['middle']   = originalMiddle;
      cabinet['treble']   = originalTreble;
      /* eslint-enable dot-notation */

      cabinet.deactivate();
    });

    test('should call `connect` method', () => {
      const inputConnectMock       = jest.fn();
      const inputDisconnectMock    = jest.fn();
      const notchConnectMock       = jest.fn();
      const notchDisconnectMock    = jest.fn();
      const preToneConnectMock     = jest.fn();
      const preToneDisconnectMock  = jest.fn();
      const postToneConnectMock    = jest.fn();
      const postToneDisconnectMock = jest.fn();
      const preBassConnectMock     = jest.fn();
      const preBassDisconnectMock  = jest.fn();
      const postBassConnectMock    = jest.fn();
      const postBassDisconnectMock = jest.fn();
      const middleConnectMock      = jest.fn();
      const middleDisconnectMock   = jest.fn();
      const trebleConnectMock      = jest.fn();
      const trebleDisconnectMock   = jest.fn();

      /* eslint-disable dot-notation */
      cabinet['input'].connect       = inputConnectMock;
      cabinet['input'].disconnect    = inputDisconnectMock;
      cabinet['notch'].connect       = notchConnectMock;
      cabinet['notch'].disconnect    = notchDisconnectMock;
      cabinet['preTone'].connect     = preToneConnectMock;
      cabinet['preTone'].disconnect  = preToneDisconnectMock;
      cabinet['postTone'].connect    = postToneConnectMock;
      cabinet['postTone'].disconnect = postToneDisconnectMock;
      cabinet['preBass'].connect     = preBassConnectMock;
      cabinet['preBass'].disconnect  = preBassDisconnectMock;
      cabinet['postBass'].connect    = postBassConnectMock;
      cabinet['postBass'].disconnect = postBassDisconnectMock;
      cabinet['middle'].connect      = middleConnectMock;
      cabinet['middle'].disconnect   = middleDisconnectMock;
      cabinet['treble'].connect      = trebleConnectMock;
      cabinet['treble'].disconnect   = trebleDisconnectMock;
      /* eslint-enable dot-notation */

      cabinet.connect();

      expect(inputConnectMock).toHaveBeenCalledTimes(1);
      expect(notchConnectMock).toHaveBeenCalledTimes(1);
      expect(preToneConnectMock).toHaveBeenCalledTimes(1);
      expect(postToneConnectMock).toHaveBeenCalledTimes(1);
      expect(preBassConnectMock).toHaveBeenCalledTimes(1);
      expect(postBassConnectMock).toHaveBeenCalledTimes(1);
      expect(middleConnectMock).toHaveBeenCalledTimes(1);
      expect(trebleConnectMock).toHaveBeenCalledTimes(1);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(1);
      expect(notchDisconnectMock).toHaveBeenCalledTimes(1);
      expect(preToneDisconnectMock).toHaveBeenCalledTimes(1);
      expect(postToneDisconnectMock).toHaveBeenCalledTimes(1);
      expect(preBassDisconnectMock).toHaveBeenCalledTimes(1);
      expect(postBassDisconnectMock).toHaveBeenCalledTimes(1);
      expect(middleDisconnectMock).toHaveBeenCalledTimes(1);
      expect(trebleDisconnectMock).toHaveBeenCalledTimes(1);

      cabinet.deactivate();

      expect(inputConnectMock).toHaveBeenCalledTimes(2);
      expect(notchConnectMock).toHaveBeenCalledTimes(1);
      expect(preToneConnectMock).toHaveBeenCalledTimes(1);
      expect(postToneConnectMock).toHaveBeenCalledTimes(1);
      expect(preBassConnectMock).toHaveBeenCalledTimes(1);
      expect(postBassConnectMock).toHaveBeenCalledTimes(1);
      expect(middleConnectMock).toHaveBeenCalledTimes(1);
      expect(trebleConnectMock).toHaveBeenCalledTimes(1);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(2);
      expect(notchDisconnectMock).toHaveBeenCalledTimes(2);
      expect(preToneDisconnectMock).toHaveBeenCalledTimes(2);
      expect(postToneDisconnectMock).toHaveBeenCalledTimes(2);
      expect(preBassDisconnectMock).toHaveBeenCalledTimes(2);
      expect(postBassDisconnectMock).toHaveBeenCalledTimes(2);
      expect(middleDisconnectMock).toHaveBeenCalledTimes(2);
      expect(trebleDisconnectMock).toHaveBeenCalledTimes(2);
    });
  });

  describe(cabinet.param.name, () => {
    const defaultParams: FilterBankCabinetParams = {
      state   : true,
      notch   : { frequency: 8800, gain: 0.0,  Q: 0.6 },
      preTone : { frequency: 4400, gain: 0.0,  Q: 0.0 },
      postTone: { frequency: 6400, gain: 0.0,  Q: 6.4 },
      preBass : { frequency: 120,  gain: 0.0,  Q: 2.0 },
      postBass: { frequency: 80,   gain: 0.0,  Q: 6.0 },
      middle  : { frequency: 1340, gain: -8.0, Q: 3.0 },
      treble  : { frequency: 1340, gain: 8.0,  Q: 3.0 }
    };

    const params: FilterBankCabinetParams = {
      state   : false,
      notch   : { frequency: 10800, gain: 0.0,   Q: 2.0 },
      preTone : { frequency: 4000,  gain: 0.0,   Q: 1.5 },
      postTone: { frequency: 6000,  gain: 0.0,   Q: 8.0 },
      preBass : { frequency: 180,   gain: 0.0,   Q: -0.4 },
      postBass: { frequency: 90,    gain: 0.0,   Q: 6.0 },
      middle  : { frequency: 1600,  gain: -12.0, Q: 3.0 },
      treble  : { frequency: 680,   gain: 4.0,   Q: 0.0 }
    };

    beforeAll(() => {
      cabinet.param(params);
    });

    afterAll(() => {
      cabinet.param(defaultParams);
    });

    // Setter
    test('should return instance of `FilterBankCabinet`', () => {
      expect(cabinet.param(params)).toBeInstanceOf(FilterBankCabinet);
    });

    // Getter
    test('should return `state`', () => {
      expect(cabinet.param('state')).toBe(false);
    });

    test('should return `notch`', () => {
      expect(cabinet.param('notch')).toStrictEqual({ frequency: 10800, gain: 0.0, Q: 2.0 });
    });

    test('should return `preTone`', () => {
      expect(cabinet.param('preTone')).toStrictEqual({ frequency: 4000,  gain: 0.0, Q: 1.5 });
    });

    test('should return `postTone`', () => {
      expect(cabinet.param('postTone')).toStrictEqual({ frequency: 6000, gain: 0.0, Q: 8.0 });
    });

    test('should return `preBass`', () => {
      expect(cabinet.param('preBass')).toStrictEqual({ frequency: 180, gain: 0.0, Q: -0.4 });
    });

    test('should return `postBass`', () => {
      expect(cabinet.param('postBass')).toStrictEqual({ frequency: 90, gain: 0.0, Q: 6.0 });
    });

    test('should return `middle`', () => {
      expect(cabinet.param('middle')).toStrictEqual({ frequency: 1600,  gain: -12.0, Q: 3.0 });
    });

    test('should return `treble`', () => {
      expect(cabinet.param('treble')).toStrictEqual({ frequency: 680,   gain: 4.0,   Q: 0.0 });
    });
  });

  describe(cabinet.params.name, () => {
    test('should return parameters for filter bank cabinet as associative array', () => {
      expect(cabinet.params()).toStrictEqual({
        state   : true,
        notch   : { frequency: 8800, gain: 0.0,  Q: 0.6 },
        preTone : { frequency: 4400, gain: 0.0,  Q: 0.0 },
        postTone: { frequency: 6400, gain: 0.0,  Q: 6.4 },
        preBass : { frequency: 120,  gain: 0.0,  Q: 2.0 },
        postBass: { frequency: 80,   gain: 0.0,  Q: 6.0 },
        middle  : { frequency: 1340, gain: -8.0, Q: 3.0 },
        treble  : { frequency: 1340, gain: 8.0,  Q: 3.0 }
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
