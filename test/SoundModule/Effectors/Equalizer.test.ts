import { AudioContextMock } from '../../../mock/AudioContextMock';
import { Equalizer, EqualizerParams } from '../../../src/SoundModule/Effectors/Equalizer';

describe(Equalizer.name, () => {
  const context = new AudioContextMock();

  // @ts-ignore
  const equalizer = new Equalizer(context);

  describe(equalizer.connect.name, () => {
    // eslint-disable-next-line dot-notation
    const originalInput = equalizer['input'];

    // eslint-disable-next-line dot-notation
    const originalBass = equalizer['bass'];

    // eslint-disable-next-line dot-notation
    const originalMiddle = equalizer['middle'];

    // eslint-disable-next-line dot-notation
    const originalTreable = equalizer['treble'];

    // eslint-disable-next-line dot-notation
    const originalPresence = equalizer['presence'];

    afterAll(() => {
      // eslint-disable-next-line dot-notation
      equalizer['input'] = originalInput;

      // eslint-disable-next-line dot-notation
      equalizer['bass'] = originalBass;

      // eslint-disable-next-line dot-notation
      equalizer['middle'] = originalMiddle;

      // eslint-disable-next-line dot-notation
      equalizer['treble'] = originalTreable;

      // eslint-disable-next-line dot-notation
      equalizer['presence'] = originalPresence;

      equalizer.deactivate();
    });

    test('should call connect method', () => {
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

      Object.defineProperty(equalizer, 'input', {
        configurable: true,
        writable    : true,
        value       : {
          connect   : inputConnectMock,
          disconnect: inputDisconnectMock
        }
      });

      Object.defineProperty(equalizer, 'bass', {
        configurable: true,
        writable    : true,
        value       : {
          connect   : bassConnectMock,
          disconnect: bassDisconnectMock
        }
      });

      Object.defineProperty(equalizer, 'middle', {
        configurable: true,
        writable    : true,
        value       : {
          connect   : middleConnectMock,
          disconnect: middleDisconnectMock
        }
      });

      Object.defineProperty(equalizer, 'treble', {
        configurable: true,
        writable    : true,
        value       : {
          connect   : trebleConnectMock,
          disconnect: trebleDisconnectMock
        }
      });

      Object.defineProperty(equalizer, 'presence', {
        configurable: true,
        writable    : true,
        value       : {
          connect   : presenceConnectMock,
          disconnect: presenceDisconnectMock
        }
      });

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
    test('should return instance of Equalizer', () => {
      expect(equalizer.param(params)).toBeInstanceOf(Equalizer);
    });

    // Getter
    test('should return bass', () => {
      expect(equalizer.param('bass')).toBeCloseTo(10, 1);
    });

    test('should return middle', () => {
      expect(equalizer.param('middle')).toBeCloseTo(-10, 1);
    });

    test('should return treble', () => {
      expect(equalizer.param('treble')).toBeCloseTo(10, 1);
    });

    test('should return presence', () => {
      expect(equalizer.param('presence')).toBeCloseTo(8, 1);
    });
  });

  describe(equalizer.params.name, () => {
    test('should return parameters for compressor effector as associative array', () => {
      expect(equalizer.params()).toStrictEqual({
        state   : false,
        bass    : 0,
        middle  : 0,
        treble  : 0,
        presence: 0
      });
    });
  });
});
