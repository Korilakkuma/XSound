import { AudioContextMock } from '/mock/AudioContextMock';
import { OverDrive, OverDriveParams } from '/src/SoundModule/Effectors/OverDrive';

describe(OverDrive.name, () => {
  const context = new AudioContextMock();

  // @ts-ignore
  const overdrive = new OverDrive(context);

  describe(overdrive.start.name, () => {
    test('should call `ConstantSourceNode` start', () => {
      // eslint-disable-next-line dot-notation
      const originalDriveInput = overdrive['driveInput'];

      const driveInputMock = jest.fn();

      // eslint-disable-next-line dot-notation
      overdrive['driveInput'].start = driveInputMock;

      overdrive.start();

      expect(driveInputMock).toHaveBeenCalledTimes(0);

      overdrive.activate();
      overdrive.start();

      expect(driveInputMock).toHaveBeenCalledTimes(1);

      // eslint-disable-next-line dot-notation
      overdrive['driveInput'] = originalDriveInput;

      overdrive.deactivate();
    });
  });

  describe(overdrive.stop.name, () => {
    test('should call `ConstantSourceNode` stop', () => {
      // eslint-disable-next-line dot-notation
      const originalDriveInput = overdrive['driveInput'];

      const driveInputMock = jest.fn();

      // eslint-disable-next-line dot-notation
      overdrive['driveInput'].stop = driveInputMock;

      overdrive.stop();

      expect(driveInputMock).toHaveBeenCalledTimes(0);

      overdrive.activate();
      overdrive.stop();

      expect(driveInputMock).toHaveBeenCalledTimes(1);

      // eslint-disable-next-line dot-notation
      overdrive['driveInput'] = originalDriveInput;

      overdrive.deactivate();
    });
  });

  describe(overdrive.connect.name, () => {
    /* eslint-disable dot-notation */
    const originalInput        = overdrive['input'];
    const originalShaper       = overdrive['shaper'];
    const originalInputShaper  = overdrive['inputShaper'];
    const originalOutputShaper = overdrive['outputShaper'];
    const originalInputGain    = overdrive['inputGain'];
    const originalOutputGain   = overdrive['outputGain'];
    const originalDriveInput   = overdrive['driveInput'];
    const originalLevel        = overdrive['level'];
    /* eslint-enable dot-notation */

    afterAll(() => {
      /* eslint-disable dot-notation */
      overdrive['input']        = originalInput;
      overdrive['shaper']       = originalShaper;
      overdrive['inputShaper']  = originalInputShaper;
      overdrive['outputShaper'] = originalOutputShaper;
      overdrive['inputGain']    = originalInputGain;
      overdrive['outputGain']   = originalOutputGain;
      overdrive['driveInput']   = originalDriveInput;
      overdrive['level']        = originalLevel;
      /* eslint-enable dot-notation */

      overdrive.deactivate();
    });

    test('should call `connect` method', () => {
      const inputConnectMock           = jest.fn();
      const inputDisconnectMock        = jest.fn();
      const shaperConnectMock          = jest.fn();
      const shaperDisconnectMock       = jest.fn();
      const inputShaperConnectMock     = jest.fn();
      const inputShaperDisconnectMock  = jest.fn();
      const outputShaperConnectMock    = jest.fn();
      const outputShaperDisconnectMock = jest.fn();
      const inputGainConnectMock       = jest.fn();
      const inputGainDisconnectMock    = jest.fn();
      const outputGainConnectMock      = jest.fn();
      const outputGainDisconnectMock   = jest.fn();
      const driveInputConnectMock      = jest.fn();
      const driveInputDisconnectMock   = jest.fn();
      const levelConnectMock           = jest.fn();
      const levelDisconnectMock        = jest.fn();

      /* eslint-disable dot-notation */
      overdrive['input'].connect           = inputConnectMock;
      overdrive['input'].disconnect        = inputDisconnectMock;
      overdrive['shaper'].connect          = shaperConnectMock;
      overdrive['shaper'].disconnect       = shaperDisconnectMock;
      overdrive['inputShaper'].connect     = inputShaperConnectMock;
      overdrive['inputShaper'].disconnect  = inputShaperDisconnectMock;
      overdrive['outputShaper'].connect    = outputShaperConnectMock;
      overdrive['outputShaper'].disconnect = outputShaperDisconnectMock;
      overdrive['inputGain'].connect       = inputGainConnectMock;
      overdrive['inputGain'].disconnect    = inputGainDisconnectMock;
      overdrive['outputGain'].connect      = outputGainConnectMock;
      overdrive['outputGain'].disconnect   = outputGainDisconnectMock;
      overdrive['driveInput'].connect      = driveInputConnectMock;
      overdrive['driveInput'].disconnect   = driveInputDisconnectMock;
      overdrive['level'].connect           = levelConnectMock;
      overdrive['level'].disconnect        = levelDisconnectMock;
      /* eslint-enable dot-notation */

      overdrive.connect();

      expect(inputConnectMock).toHaveBeenCalledTimes(1);
      expect(shaperConnectMock).toHaveBeenCalledTimes(0);
      expect(inputShaperConnectMock).toHaveBeenCalledTimes(0);
      expect(outputShaperConnectMock).toHaveBeenCalledTimes(0);
      expect(inputGainConnectMock).toHaveBeenCalledTimes(0);
      expect(outputGainConnectMock).toHaveBeenCalledTimes(0);
      expect(driveInputConnectMock).toHaveBeenCalledTimes(0);
      expect(levelConnectMock).toHaveBeenCalledTimes(0);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(1);
      expect(shaperDisconnectMock).toHaveBeenCalledTimes(1);
      expect(inputShaperDisconnectMock).toHaveBeenCalledTimes(1);
      expect(outputShaperDisconnectMock).toHaveBeenCalledTimes(1);
      expect(inputGainDisconnectMock).toHaveBeenCalledTimes(1);
      expect(outputGainDisconnectMock).toHaveBeenCalledTimes(1);
      expect(driveInputDisconnectMock).toHaveBeenCalledTimes(1);
      expect(levelDisconnectMock).toHaveBeenCalledTimes(1);

      overdrive.activate();

      expect(inputConnectMock).toHaveBeenCalledTimes(2);
      expect(shaperConnectMock).toHaveBeenCalledTimes(1);
      expect(inputShaperConnectMock).toHaveBeenCalledTimes(1);
      expect(outputShaperConnectMock).toHaveBeenCalledTimes(1);
      expect(inputGainConnectMock).toHaveBeenCalledTimes(1);
      expect(outputGainConnectMock).toHaveBeenCalledTimes(1);
      expect(driveInputConnectMock).toHaveBeenCalledTimes(2);
      expect(levelConnectMock).toHaveBeenCalledTimes(1);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(2);
      expect(shaperDisconnectMock).toHaveBeenCalledTimes(2);
      expect(inputShaperDisconnectMock).toHaveBeenCalledTimes(2);
      expect(outputShaperDisconnectMock).toHaveBeenCalledTimes(2);
      expect(inputGainDisconnectMock).toHaveBeenCalledTimes(2);
      expect(outputGainDisconnectMock).toHaveBeenCalledTimes(2);
      expect(driveInputDisconnectMock).toHaveBeenCalledTimes(2);
      expect(levelDisconnectMock).toHaveBeenCalledTimes(2);
    });
  });

  describe(overdrive.param.name, () => {
    const defaultParams: OverDriveParams = {
      drive     : 0,
      level     : 1,
      oversample: '4x',
    };

    const params: OverDriveParams = {
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

      expect(connectMock).toHaveBeenCalledTimes(2);

      overdrive.connect = originalConnect;
    });
  });
});
