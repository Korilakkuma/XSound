import type { OverDriveParams } from '/src/SoundModule/Effectors/OverDrive';

import { AudioContextMock } from '/mock/AudioContextMock';
import { OverDrive } from '/src/SoundModule/Effectors/OverDrive';

describe(OverDrive.name, () => {
  const context = new AudioContextMock();

  // @ts-expect-error Because there is not Web Audio API in Jest environment (Node.js environment), mocks Web Audio API
  const overdrive = new OverDrive(context);

  describe(overdrive.connect.name, () => {
    /* eslint-disable dot-notation */
    const originalInput   = overdrive['input'];
    const originalShaper  = overdrive['shaper'];
    const originalDrive   = overdrive['drive'];
    const originalLevel   = overdrive['level'];
    const originalLowCut  = overdrive['lowCut'];
    const originalHighCut = overdrive['highCut'];
    /* eslint-enable dot-notation */

    afterEach(() => {
      /* eslint-disable dot-notation */
      overdrive['input']   = originalInput;
      overdrive['shaper']  = originalShaper;
      overdrive['drive']   = originalDrive;
      overdrive['level']   = originalLevel;
      overdrive['lowCut']  = originalLowCut;
      overdrive['highCut'] = originalHighCut;
      /* eslint-enable dot-notation */

      overdrive.deactivate();
    });

    test('should call `connect` method (if `type` is `overdrive`)', () => {
      const inputConnectMock      = jest.fn();
      const inputDisconnectMock   = jest.fn();
      const shaperConnectMock     = jest.fn();
      const shaperDisconnectMock  = jest.fn();
      const driveConnectMock      = jest.fn();
      const driveDisconnectMock   = jest.fn();
      const levelConnectMock      = jest.fn();
      const levelDisconnectMock   = jest.fn();
      const lowCutConnectMock     = jest.fn();
      const lowCutDisconnectMock  = jest.fn();
      const highCutConnectMock    = jest.fn();
      const highCutDisconnectMock = jest.fn();

      /* eslint-disable dot-notation */
      overdrive['input'].connect      = inputConnectMock;
      overdrive['input'].disconnect   = inputDisconnectMock;
      overdrive['shaper'].connect     = shaperConnectMock;
      overdrive['shaper'].disconnect  = shaperDisconnectMock;
      overdrive['drive'].connect      = driveConnectMock;
      overdrive['drive'].disconnect   = driveDisconnectMock;
      overdrive['level'].connect      = levelConnectMock;
      overdrive['level'].disconnect   = levelDisconnectMock;
      overdrive['lowCut'].connect     = lowCutConnectMock;
      overdrive['lowCut'].disconnect  = lowCutDisconnectMock;
      overdrive['highCut'].connect    = highCutConnectMock;
      overdrive['highCut'].disconnect = highCutDisconnectMock;
      /* eslint-enable dot-notation */

      overdrive.param({ type: 'overdrive' });

      expect(inputConnectMock).toHaveBeenCalledTimes(1);
      expect(shaperConnectMock).toHaveBeenCalledTimes(0);
      expect(driveConnectMock).toHaveBeenCalledTimes(0);
      expect(levelConnectMock).toHaveBeenCalledTimes(0);
      expect(lowCutConnectMock).toHaveBeenCalledTimes(0);
      expect(highCutConnectMock).toHaveBeenCalledTimes(0);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(1);
      expect(shaperDisconnectMock).toHaveBeenCalledTimes(1);
      expect(driveDisconnectMock).toHaveBeenCalledTimes(1);
      expect(levelDisconnectMock).toHaveBeenCalledTimes(1);
      expect(lowCutDisconnectMock).toHaveBeenCalledTimes(1);
      expect(highCutDisconnectMock).toHaveBeenCalledTimes(1);

      overdrive.activate();

      expect(inputConnectMock).toHaveBeenCalledTimes(2);
      expect(shaperConnectMock).toHaveBeenCalledTimes(0);
      expect(driveConnectMock).toHaveBeenCalledTimes(0);
      expect(levelConnectMock).toHaveBeenCalledTimes(0);
      expect(lowCutConnectMock).toHaveBeenCalledTimes(0);
      expect(highCutConnectMock).toHaveBeenCalledTimes(0);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(2);
      expect(shaperDisconnectMock).toHaveBeenCalledTimes(2);
      expect(driveDisconnectMock).toHaveBeenCalledTimes(2);
      expect(levelDisconnectMock).toHaveBeenCalledTimes(2);
      expect(lowCutDisconnectMock).toHaveBeenCalledTimes(2);
      expect(highCutDisconnectMock).toHaveBeenCalledTimes(2);

      overdrive.param({ drive: 1 });

      expect(inputConnectMock).toHaveBeenCalledTimes(3);
      expect(shaperConnectMock).toHaveBeenCalledTimes(1);
      expect(driveConnectMock).toHaveBeenCalledTimes(1);
      expect(levelConnectMock).toHaveBeenCalledTimes(1);
      expect(lowCutConnectMock).toHaveBeenCalledTimes(1);
      expect(highCutConnectMock).toHaveBeenCalledTimes(1);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(3);
      expect(shaperDisconnectMock).toHaveBeenCalledTimes(3);
      expect(driveDisconnectMock).toHaveBeenCalledTimes(3);
      expect(levelDisconnectMock).toHaveBeenCalledTimes(3);
      expect(lowCutDisconnectMock).toHaveBeenCalledTimes(3);
      expect(highCutDisconnectMock).toHaveBeenCalledTimes(3);
    });
  });

  describe(overdrive.param.name, () => {
    const defaultParams: OverDriveParams = {
      type      : 'overdrive',
      drive     : 0,
      level     : 1,
      oversample: '4x',
    };

    const params: OverDriveParams = {
      type      : 'warm',
      drive     : 0.5,
      level     : 0.5,
      oversample: 'none'
    };

    afterAll(() => {
      overdrive.param(defaultParams);
    });

    // Setter
    test('should return instance of `OverDrive`', () => {
      expect(overdrive.param(params)).toBeInstanceOf(OverDrive);
    });

    // Getter
    test('should return `type`', () => {
      expect(overdrive.param('type')).toBe('warm');
    });

    test('should return `drive`', () => {
      expect(overdrive.param('drive')).toBeCloseTo(0.5, 1);
    });

    test('should return `level`', () => {
      expect(overdrive.param('level')).toBeCloseTo(0.5, 1);
    });

    test('should return `oversample`', () => {
      expect(overdrive.param('oversample')).toBe('none');
    });
  });

  describe(overdrive.params.name, () => {
    test('should return parameters for overdrive effector as associative array', () => {
      expect(overdrive.params()).toStrictEqual({
        state     : false,
        type      : 'overdrive',
        drive     : 0,
        level     : 1,
        oversample: '4x'
      });
    });
  });

  describe(overdrive.activate.name, () => {
    test('should call `connect` method', () => {
      const originalConnect = overdrive.connect;

      const connectMock = jest.fn();

      overdrive.connect = connectMock;

      overdrive.activate();

      expect(connectMock).toHaveBeenCalledTimes(1);

      overdrive.connect = originalConnect;
    });
  });

  describe(overdrive.deactivate.name, () => {
    test('should call `connect` method', () => {
      const originalConnect = overdrive.connect;

      const connectMock = jest.fn();

      overdrive.connect = connectMock;

      overdrive.deactivate();

      expect(connectMock).toHaveBeenCalledTimes(1);

      overdrive.connect = originalConnect;
    });
  });
});
