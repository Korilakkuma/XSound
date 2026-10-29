import type { JC120Params } from '/src/SoundModule/Effectors/Preamps/JC120';

import { AudioContextMock } from '/mock/AudioContextMock';
import { JC120 } from '/src/SoundModule/Effectors/Preamps/JC120';

describe(JC120.name, () => {
  const context = new AudioContextMock();

  // @ts-expect-error Because there is not Web Audio API in Jest environment (Node.js environment), mocks Web Audio API
  const jc120 = new JC120(context);

  describe(jc120.connect.name, () => {
    /* eslint-disable dot-notation */
    const originalInput  = jc120['input'];
    const originalVolume = jc120['volume'];
    const originalBright = jc120['bright'];
    const originalBass   = jc120['bass'];
    const originalMiddle = jc120['middle'];
    const originalTreble = jc120['treble'];
    const originalLevel  = jc120['level'];
    /* eslint-enable dot-notation */

    afterAll(() => {
      /* eslint-disable dot-notation */
      jc120['input']  = originalInput;
      jc120['volume'] = originalVolume;
      jc120['bright'] = originalBright;
      jc120['bass']   = originalBass;
      jc120['middle'] = originalMiddle;
      jc120['treble'] = originalTreble;
      jc120['level']  = originalLevel;
      /* eslint-enable dot-notation */

      jc120.deactivate();
    });

    test('should call `connect` method', () => {
      const inputConnectMock     = jest.fn();
      const inputDisconnectMock  = jest.fn();
      const volumeConnectMock    = jest.fn();
      const volumeDisconnectMock = jest.fn();
      const brightConnectMock    = jest.fn();
      const brightDisconnectMock = jest.fn();
      const bassConnectMock      = jest.fn();
      const bassDisconnectMock   = jest.fn();
      const middleConnectMock    = jest.fn();
      const middleDisconnectMock = jest.fn();
      const trebleConnectMock    = jest.fn();
      const trebleDisconnectMock = jest.fn();
      const levelConnectMock     = jest.fn();
      const levelDisconnectMock  = jest.fn();

      /* eslint-disable dot-notation */
      jc120['input'].connect     = inputConnectMock;
      jc120['input'].disconnect  = inputDisconnectMock;
      jc120['volume'].connect    = volumeConnectMock;
      jc120['volume'].disconnect = volumeDisconnectMock;
      jc120['bright'].connect    = brightConnectMock;
      jc120['bright'].disconnect = brightDisconnectMock;
      jc120['bass'].connect      = bassConnectMock;
      jc120['bass'].disconnect   = bassDisconnectMock;
      jc120['middle'].connect    = middleConnectMock;
      jc120['middle'].disconnect = middleDisconnectMock;
      jc120['treble'].connect    = trebleConnectMock;
      jc120['treble'].disconnect = trebleDisconnectMock;
      jc120['level'].connect     = levelConnectMock;
      jc120['level'].disconnect  = levelDisconnectMock;
      /* eslint-enable dot-notation */

      jc120.connect();

      expect(inputConnectMock).toHaveBeenCalledTimes(1);
      expect(volumeConnectMock).toHaveBeenCalledTimes(0);
      expect(brightConnectMock).toHaveBeenCalledTimes(0);
      expect(bassConnectMock).toHaveBeenCalledTimes(0);
      expect(middleConnectMock).toHaveBeenCalledTimes(0);
      expect(trebleConnectMock).toHaveBeenCalledTimes(0);
      expect(levelConnectMock).toHaveBeenCalledTimes(0);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(1);
      expect(volumeDisconnectMock).toHaveBeenCalledTimes(1);
      expect(brightDisconnectMock).toHaveBeenCalledTimes(1);
      expect(bassDisconnectMock).toHaveBeenCalledTimes(1);
      expect(middleDisconnectMock).toHaveBeenCalledTimes(1);
      expect(trebleDisconnectMock).toHaveBeenCalledTimes(1);
      expect(levelDisconnectMock).toHaveBeenCalledTimes(1);

      jc120.activate();

      expect(inputConnectMock).toHaveBeenCalledTimes(2);
      expect(volumeConnectMock).toHaveBeenCalledTimes(1);
      expect(brightConnectMock).toHaveBeenCalledTimes(1);
      expect(bassConnectMock).toHaveBeenCalledTimes(1);
      expect(middleConnectMock).toHaveBeenCalledTimes(1);
      expect(trebleConnectMock).toHaveBeenCalledTimes(1);
      expect(levelConnectMock).toHaveBeenCalledTimes(1);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(2);
      expect(volumeDisconnectMock).toHaveBeenCalledTimes(2);
      expect(brightDisconnectMock).toHaveBeenCalledTimes(2);
      expect(bassDisconnectMock).toHaveBeenCalledTimes(2);
      expect(middleDisconnectMock).toHaveBeenCalledTimes(2);
      expect(trebleDisconnectMock).toHaveBeenCalledTimes(2);
      expect(levelDisconnectMock).toHaveBeenCalledTimes(2);
    });
  });

  describe(jc120.param.name, () => {
    const defaultParams: JC120Params = {
      volume: 0.2,
      bright: 0,
      bass  : 0,
      middle: 0,
      treble: 0,
      level : 1
    };

    const params: JC120Params = {
      volume: 0.3,
      bright: 3,
      bass  : 8,
      middle: -8,
      treble: 4,
      level : 0.5
    };

    beforeAll(() => {
      jc120.param(params);
    });

    afterAll(() => {
      jc120.param(defaultParams);
    });

    // Setter
    test('should return instance of `JC120`', () => {
      expect(jc120.param(params)).toBeInstanceOf(JC120);
    });

    // Getter
    test('should return `volume`', () => {
      expect(jc120.param('volume')).toBeCloseTo(0.3, 1);
    });

    test('should return `bright`', () => {
      expect(jc120.param('bright')).toBeCloseTo(3, 1);
    });

    test('should return `bass`', () => {
      expect(jc120.param('bass')).toBeCloseTo(8, 1);
    });

    test('should return `middle`', () => {
      expect(jc120.param('middle')).toBeCloseTo(-8, 1);
    });

    test('should return `treble`', () => {
      expect(jc120.param('treble')).toBeCloseTo(4, 1);
    });

    test('should return `level`', () => {
      expect(jc120.param('level')).toBeCloseTo(0.5, 1);
    });
  });

  describe(jc120.params.name, () => {
    test('should return parameters for Roland JC-120 preamplifier as associative array', () => {
      expect(jc120.params()).toStrictEqual({
        state : false,
        volume: 0.2,
        bright: 0,
        bass  : 0,
        middle: 0,
        treble: 0,
        level : 1
      });
    });
  });

  describe(jc120.activate.name, () => {
    test('should call `connect` method', () => {
      const originalConnect = jc120.connect;

      const connectMock = jest.fn();

      jc120.connect = connectMock;

      jc120.activate();

      expect(connectMock).toHaveBeenCalledTimes(1);

      jc120.connect = originalConnect;
    });
  });

  describe(jc120.deactivate.name, () => {
    test('should call `connect` method', () => {
      const originalConnect = jc120.connect;

      const connectMock = jest.fn();

      jc120.connect = connectMock;

      jc120.deactivate();

      expect(connectMock).toHaveBeenCalledTimes(1);

      jc120.connect = originalConnect;
    });
  });
});
