import { AudioContextMock } from '../../../mock/AudioContextMock';
import { Equalizer, EqualizerParams } from '../../../src/SoundModule/Effectors/Equalizer';

describe(Equalizer.name, () => {
  const context = new AudioContextMock(); // @ts-ignore
  const equalizer = new Equalizer(context);

  describe(equalizer.connect.name, () => {
    /* eslint-disable dot-notation */
    const originalInput    = equalizer['input'];
    const originalBass     = equalizer['bass'];
    const originalMiddle   = equalizer['middle'];
    const originalTreable  = equalizer['treble'];
    const originalPresence = equalizer['presence'];
    /* eslint-enable dot-notation */

    afterAll(() => {
      /* eslint-disable dot-notation */
      equalizer['input']    = originalInput;
      equalizer['bass']     = originalBass;
      equalizer['middle']   = originalMiddle;
      equalizer['treble']   = originalTreable;
      equalizer['presence'] = originalPresence;
      /* eslint-enable dot-notation */

      equalizer.deactivate();
    });

    test('should call `connect` method', () => {
      const inputConnectMock       = jest.fn();
      const inputDisconnectMock    = jest.fn();
      const bassConnectMock        = jest.fn();
      const bassDisconnectMock     = jest.fn();
      const middleConnectMock      = jest.fn();
      const middleDisconnectMock   = jest.fn();
      const trebleConnectMock      = jest.fn();
      const trebleDisconnectMock   = jest.fn();
      const presenceConnectMock    = jest.fn();
      const presenceDisconnectMock = jest.fn();

      /* eslint-disable dot-notation */
      equalizer['input'].connect       = inputConnectMock;
      equalizer['input'].disconnect    = inputDisconnectMock;
      equalizer['bass'].connect        = bassConnectMock;
      equalizer['bass'].disconnect     = bassDisconnectMock;
      equalizer['middle'].connect      = middleConnectMock;
      equalizer['middle'].disconnect   = middleDisconnectMock;
      equalizer['treble'].connect      = trebleConnectMock;
      equalizer['treble'].disconnect   = trebleDisconnectMock;
      equalizer['presence'].connect    = presenceConnectMock;
      equalizer['presence'].disconnect = presenceDisconnectMock;
      /* eslint-enable dot-notation */

      equalizer.connect();

      expect(inputConnectMock).toHaveBeenCalledTimes(1);
      expect(bassConnectMock).toHaveBeenCalledTimes(0);
      expect(middleConnectMock).toHaveBeenCalledTimes(0);
      expect(trebleConnectMock).toHaveBeenCalledTimes(0);
      expect(presenceConnectMock).toHaveBeenCalledTimes(0);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(1);
      expect(bassDisconnectMock).toHaveBeenCalledTimes(1);
      expect(middleDisconnectMock).toHaveBeenCalledTimes(1);
      expect(trebleDisconnectMock).toHaveBeenCalledTimes(1);
      expect(presenceDisconnectMock).toHaveBeenCalledTimes(1);

      equalizer.activate();

      expect(inputConnectMock).toHaveBeenCalledTimes(2);
      expect(bassConnectMock).toHaveBeenCalledTimes(1);
      expect(middleConnectMock).toHaveBeenCalledTimes(1);
      expect(trebleConnectMock).toHaveBeenCalledTimes(1);
      expect(presenceConnectMock).toHaveBeenCalledTimes(1);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(2);
      expect(bassDisconnectMock).toHaveBeenCalledTimes(2);
      expect(middleDisconnectMock).toHaveBeenCalledTimes(2);
      expect(presenceDisconnectMock).toHaveBeenCalledTimes(2);
    });
  });

  describe(equalizer.param.name, () => {
    const defaultParams: EqualizerParams = {
      bass    : 0,
      middle  : 0,
      treble  : 0,
      presence: 0
    };

    const params: EqualizerParams = {
      bass    : 10,
      middle  : -10,
      treble  : 10,
      presence: 8
    };

    afterAll(() => {
      equalizer.param(defaultParams);
    });

    // Setter
    test('should return instance of `Equalizer`', () => {
      expect(equalizer.param(params)).toBeInstanceOf(Equalizer);
    });

    // Getter
    test('should return `bass`', () => {
      expect(equalizer.param('bass')).toBeCloseTo(10, 1);
    });

    test('should return `middle`', () => {
      expect(equalizer.param('middle')).toBeCloseTo(-10, 1);
    });

    test('should return `treble`', () => {
      expect(equalizer.param('treble')).toBeCloseTo(10, 1);
    });

    test('should return `presence`', () => {
      expect(equalizer.param('presence')).toBeCloseTo(8, 1);
    });
  });

  describe(equalizer.params.name, () => {
    test('should return parameters for equalizer effector as associative array', () => {
      expect(equalizer.params()).toStrictEqual({
        state   : false,
        bass    : 0,
        middle  : 0,
        treble  : 0,
        presence: 0
      });
    });
  });

  describe(equalizer.activate.name, () => {
    test('should call `connect` method', () => {
      const originalConnect = equalizer.connect;

      const connectMock = jest.fn();

      equalizer.connect = connectMock;

      equalizer.activate();

      expect(connectMock).toHaveBeenCalledTimes(1);

      equalizer.connect = originalConnect;
    });
  });

  describe(equalizer.deactivate.name, () => {
    test('should call `connect` method', () => {
      const originalConnect = equalizer.connect;

      const connectMock = jest.fn();

      equalizer.connect = connectMock;

      equalizer.deactivate();

      expect(connectMock).toHaveBeenCalledTimes(1);

      equalizer.connect = originalConnect;
    });
  });
});
