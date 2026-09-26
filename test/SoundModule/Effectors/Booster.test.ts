import type { BoosterParams } from '/src/SoundModule/Effectors/Booster';

import { AudioContextMock } from '/mock/AudioContextMock';
import { Booster } from '/src/SoundModule/Effectors/Booster';

describe(Booster.name, () => {
  const context = new AudioContextMock();

  // @ts-expect-error Because there is not Web Audio API in Jest environment (Node.js environment), mocks Web Audio API
  const booster = new Booster(context);

  describe(booster.connect.name, () => {
    /* eslint-disable dot-notation */
    const originalInput   = booster['input'];
    const originalDrive   = booster['drive'];
    const originalShaper  = booster['shaper'];
    const originalLevel   = booster['level'];
    const originalLowCut  = booster['lowCut'];
    const originalHighCut = booster['highCut'];
    /* eslint-enable dot-notation */

    afterEach(() => {
      /* eslint-disable dot-notation */
      booster['input']   = originalInput;
      booster['drive']   = originalDrive;
      booster['shaper']  = originalShaper;
      booster['level']   = originalLevel;
      booster['lowCut']  = originalLowCut;
      booster['highCut'] = originalHighCut;
      /* eslint-enable dot-notation */

      booster.param({ drive: 0 });

      booster.deactivate();
    });

    test('should call `connect` method (if `type` is `clean`)', () => {
      const inputConnectMock      = jest.fn();
      const inputDisconnectMock   = jest.fn();
      const driveConnectMock      = jest.fn();
      const driveDisconnectMock   = jest.fn();
      const shaperConnectMock     = jest.fn();
      const shaperDisconnectMock  = jest.fn();
      const levelConnectMock      = jest.fn();
      const levelDisconnectMock   = jest.fn();
      const lowCutConnectMock     = jest.fn();
      const lowCutDisconnectMock  = jest.fn();
      const highCutConnectMock    = jest.fn();
      const highCutDisconnectMock = jest.fn();

      /* eslint-disable dot-notation */
      booster['input'].connect      = inputConnectMock;
      booster['input'].disconnect   = inputDisconnectMock;
      booster['drive'].connect      = driveConnectMock;
      booster['drive'].disconnect   = driveDisconnectMock;
      booster['shaper'].connect     = shaperConnectMock;
      booster['shaper'].disconnect  = shaperDisconnectMock;
      booster['level'].connect      = levelConnectMock;
      booster['level'].disconnect   = levelDisconnectMock;
      booster['lowCut'].connect     = lowCutConnectMock;
      booster['lowCut'].disconnect  = lowCutDisconnectMock;
      booster['highCut'].connect    = highCutConnectMock;
      booster['highCut'].disconnect = highCutDisconnectMock;
      /* eslint-enable dot-notation */

      booster.param({ type: 'clean' });

      expect(inputConnectMock).toHaveBeenCalledTimes(1);
      expect(driveConnectMock).toHaveBeenCalledTimes(0);
      expect(shaperConnectMock).toHaveBeenCalledTimes(0);
      expect(levelConnectMock).toHaveBeenCalledTimes(0);
      expect(lowCutConnectMock).toHaveBeenCalledTimes(0);
      expect(highCutConnectMock).toHaveBeenCalledTimes(0);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(1);
      expect(driveDisconnectMock).toHaveBeenCalledTimes(1);
      expect(shaperDisconnectMock).toHaveBeenCalledTimes(1);
      expect(levelDisconnectMock).toHaveBeenCalledTimes(1);
      expect(lowCutDisconnectMock).toHaveBeenCalledTimes(1);
      expect(highCutDisconnectMock).toHaveBeenCalledTimes(1);

      booster.activate();

      expect(inputConnectMock).toHaveBeenCalledTimes(2);
      expect(driveConnectMock).toHaveBeenCalledTimes(0);
      expect(shaperConnectMock).toHaveBeenCalledTimes(0);
      expect(levelConnectMock).toHaveBeenCalledTimes(0);
      expect(lowCutConnectMock).toHaveBeenCalledTimes(0);
      expect(highCutConnectMock).toHaveBeenCalledTimes(0);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(2);
      expect(driveDisconnectMock).toHaveBeenCalledTimes(2);
      expect(shaperDisconnectMock).toHaveBeenCalledTimes(2);
      expect(levelDisconnectMock).toHaveBeenCalledTimes(2);
      expect(lowCutDisconnectMock).toHaveBeenCalledTimes(2);
      expect(highCutDisconnectMock).toHaveBeenCalledTimes(2);

      booster.param({ drive: 1 });

      expect(inputConnectMock).toHaveBeenCalledTimes(3);
      expect(driveConnectMock).toHaveBeenCalledTimes(1);
      expect(shaperConnectMock).toHaveBeenCalledTimes(0);
      expect(levelConnectMock).toHaveBeenCalledTimes(0);
      expect(lowCutConnectMock).toHaveBeenCalledTimes(1);
      expect(highCutConnectMock).toHaveBeenCalledTimes(1);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(3);
      expect(driveDisconnectMock).toHaveBeenCalledTimes(3);
      expect(shaperDisconnectMock).toHaveBeenCalledTimes(3);
      expect(levelDisconnectMock).toHaveBeenCalledTimes(3);
      expect(lowCutDisconnectMock).toHaveBeenCalledTimes(3);
      expect(highCutDisconnectMock).toHaveBeenCalledTimes(3);
    });

    test('should call `connect` method (if `type` is `drive`)', () => {
      const inputConnectMock      = jest.fn();
      const inputDisconnectMock   = jest.fn();
      const driveConnectMock      = jest.fn();
      const driveDisconnectMock   = jest.fn();
      const shaperConnectMock     = jest.fn();
      const shaperDisconnectMock  = jest.fn();
      const levelConnectMock      = jest.fn();
      const levelDisconnectMock   = jest.fn();
      const lowCutConnectMock     = jest.fn();
      const lowCutDisconnectMock  = jest.fn();
      const highCutConnectMock    = jest.fn();
      const highCutDisconnectMock = jest.fn();

      /* eslint-disable dot-notation */
      booster['input'].connect      = inputConnectMock;
      booster['input'].disconnect   = inputDisconnectMock;
      booster['drive'].connect      = driveConnectMock;
      booster['drive'].disconnect   = driveDisconnectMock;
      booster['shaper'].connect     = shaperConnectMock;
      booster['shaper'].disconnect  = shaperDisconnectMock;
      booster['level'].connect      = levelConnectMock;
      booster['level'].disconnect   = levelDisconnectMock;
      booster['lowCut'].connect     = lowCutConnectMock;
      booster['lowCut'].disconnect  = lowCutDisconnectMock;
      booster['highCut'].connect    = highCutConnectMock;
      booster['highCut'].disconnect = highCutDisconnectMock;
      /* eslint-enable dot-notation */

      booster.param({ type: 'drive' });

      expect(inputConnectMock).toHaveBeenCalledTimes(1);
      expect(driveConnectMock).toHaveBeenCalledTimes(0);
      expect(shaperConnectMock).toHaveBeenCalledTimes(0);
      expect(levelConnectMock).toHaveBeenCalledTimes(0);
      expect(lowCutConnectMock).toHaveBeenCalledTimes(0);
      expect(highCutConnectMock).toHaveBeenCalledTimes(0);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(1);
      expect(driveDisconnectMock).toHaveBeenCalledTimes(1);
      expect(shaperDisconnectMock).toHaveBeenCalledTimes(1);
      expect(levelDisconnectMock).toHaveBeenCalledTimes(1);
      expect(lowCutDisconnectMock).toHaveBeenCalledTimes(1);
      expect(highCutDisconnectMock).toHaveBeenCalledTimes(1);

      booster.activate();

      expect(inputConnectMock).toHaveBeenCalledTimes(2);
      expect(driveConnectMock).toHaveBeenCalledTimes(0);
      expect(shaperConnectMock).toHaveBeenCalledTimes(0);
      expect(levelConnectMock).toHaveBeenCalledTimes(0);
      expect(lowCutConnectMock).toHaveBeenCalledTimes(0);
      expect(highCutConnectMock).toHaveBeenCalledTimes(0);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(2);
      expect(driveDisconnectMock).toHaveBeenCalledTimes(2);
      expect(shaperDisconnectMock).toHaveBeenCalledTimes(2);
      expect(levelDisconnectMock).toHaveBeenCalledTimes(2);
      expect(lowCutDisconnectMock).toHaveBeenCalledTimes(2);
      expect(highCutDisconnectMock).toHaveBeenCalledTimes(2);

      booster.param({ drive: 1 });

      expect(inputConnectMock).toHaveBeenCalledTimes(3);
      expect(driveConnectMock).toHaveBeenCalledTimes(1);
      expect(shaperConnectMock).toHaveBeenCalledTimes(1);
      expect(levelConnectMock).toHaveBeenCalledTimes(1);
      expect(lowCutConnectMock).toHaveBeenCalledTimes(1);
      expect(highCutConnectMock).toHaveBeenCalledTimes(1);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(3);
      expect(driveDisconnectMock).toHaveBeenCalledTimes(3);
      expect(shaperDisconnectMock).toHaveBeenCalledTimes(3);
      expect(levelDisconnectMock).toHaveBeenCalledTimes(3);
      expect(lowCutDisconnectMock).toHaveBeenCalledTimes(3);
      expect(highCutDisconnectMock).toHaveBeenCalledTimes(3);
    });
  });

  describe(booster.param.name, () => {
    const defaultParams: BoosterParams = {
      type      : 'clean',
      drive     : 0,
      level     : 1,
      oversample: 'none'
    };

    const params: BoosterParams = {
      type      : 'drive',
      drive     : 0.5,
      level     : 0.5,
      oversample: '2x'
    };

    afterAll(() => {
      booster.param(defaultParams);
    });

    // Setter
    test('should return instance of `Booster`', () => {
      expect(booster.param(params)).toBeInstanceOf(Booster);
    });

    // Getter
    test('should return `type`', () => {
      expect(booster.param('type')).toBe('drive');
    });

    test('should return `drive`', () => {
      expect(booster.param('drive')).toBeCloseTo(0.5, 1);
    });

    test('should return `level`', () => {
      expect(booster.param('level')).toBeCloseTo(0.5, 1);
    });

    test('should return `oversample`', () => {
      expect(booster.param('oversample')).toBe('2x');
    });
  });

  describe(booster.params.name, () => {
    test('should return parameters for booster effector as associative array', () => {
      expect(booster.params()).toStrictEqual({
        state     : false,
        type      : 'clean',
        drive     : 0,
        level     : 1,
        oversample: 'none'
      });
    });
  });

  describe(booster.activate.name, () => {
    test('should call `connect` method', () => {
      const originalConnect = booster.connect;

      const connectMock = jest.fn();

      booster.connect = connectMock;

      booster.activate();

      expect(connectMock).toHaveBeenCalledTimes(1);

      booster.connect = originalConnect;
    });
  });

  describe(booster.deactivate.name, () => {
    test('should call `connect` method', () => {
      const originalConnect = booster.connect;

      const connectMock = jest.fn();

      booster.connect = connectMock;

      booster.deactivate();

      expect(connectMock).toHaveBeenCalledTimes(1);

      booster.connect = originalConnect;
    });
  });
});
