import { AudioContextMock } from '/mock/AudioContextMock';
import { Fuzz, FuzzParams } from '/src/SoundModule/Effectors/Fuzz';

describe(Fuzz.name, () => {
  const context = new AudioContextMock();

  // @ts-ignore
  const fuzz = new Fuzz(context);

  describe(fuzz.start.name, () => {
    test('should call `ConstantSourceNode` start', () => {
      // eslint-disable-next-line dot-notation
      const originalDriveInput = fuzz['driveInput'];

      const driveInputMock = jest.fn();

      // eslint-disable-next-line dot-notation
      fuzz['driveInput'].start = driveInputMock;

      fuzz.start();

      expect(driveInputMock).toHaveBeenCalledTimes(0);

      fuzz.activate();
      fuzz.start();

      expect(driveInputMock).toHaveBeenCalledTimes(1);

      // eslint-disable-next-line dot-notation
      fuzz['driveInput'] = originalDriveInput;

      fuzz.deactivate();
    });
  });

  describe(fuzz.stop.name, () => {
    test('should call `ConstantSourceNode` stop', () => {
      // eslint-disable-next-line dot-notation
      const originalDriveInput = fuzz['driveInput'];

      const driveInputMock = jest.fn();

      // eslint-disable-next-line dot-notation
      fuzz['driveInput'].stop = driveInputMock;

      fuzz.stop();

      expect(driveInputMock).toHaveBeenCalledTimes(0);

      fuzz.activate();
      fuzz.stop();

      expect(driveInputMock).toHaveBeenCalledTimes(1);

      // eslint-disable-next-line dot-notation
      fuzz['driveInput'] = originalDriveInput;

      fuzz.deactivate();
    });
  });

  describe(fuzz.connect.name, () => {
    /* eslint-disable dot-notation */
    const originalInput              = fuzz['input'];
    const originalPositiveShaper     = fuzz['positiveShaper'];
    const originalNegativeShaper     = fuzz['negativeShaper'];
    const originalPositiveInputGain  = fuzz['positiveInputGain'];
    const originalNegativeInputGain  = fuzz['negativeInputGain'];
    const originalPositiveOutputGain = fuzz['positiveOutputGain'];
    const originalNegativeOutputGain = fuzz['negativeOutputGain'];
    const originalDriveInput         = fuzz['driveInput'];
    const originalOutFilter          = fuzz['outFilter'];
    const originalLevel              = fuzz['level'];
    /* eslint-enable dot-notation */

    afterAll(() => {
      /* eslint-disable dot-notation */
      fuzz['input']              = originalInput;
      fuzz['positiveShaper']     = originalPositiveShaper;
      fuzz['negativeShaper']     = originalNegativeShaper;
      fuzz['positiveInputGain']  = originalPositiveInputGain;
      fuzz['negativeInputGain']  = originalNegativeInputGain;
      fuzz['positiveOutputGain'] = originalPositiveOutputGain;
      fuzz['negativeOutputGain'] = originalNegativeOutputGain;
      fuzz['driveInput']         = originalDriveInput;
      fuzz['outFilter']          = originalOutFilter;
      fuzz['level']              = originalLevel;
      /* eslint-enable dot-notation */

      fuzz.deactivate();
    });

    test('should call `connect` method', () => {
      const inputConnectMock                 = jest.fn();
      const inputDisconnectMock              = jest.fn();
      const positiveShaperConnectMock        = jest.fn();
      const positiveShaperDisconnectMock     = jest.fn();
      const negativeShaperConnectMock        = jest.fn();
      const negativeShaperDisconnectMock     = jest.fn();
      const positiveInputGainConnectMock     = jest.fn();
      const positiveInputGainDisconnectMock  = jest.fn();
      const negativeInputGainConnectMock     = jest.fn();
      const negativeInputGainDisconnectMock  = jest.fn();
      const positiveOutputGainConnectMock    = jest.fn();
      const positiveOutputGainDisconnectMock = jest.fn();
      const negativeOutputGainConnectMock    = jest.fn();
      const negativeOutputGainDisconnectMock = jest.fn();
      const driveInputConnectMock            = jest.fn();
      const driveInputDisconnectMock         = jest.fn();
      const outFilterConnectMock             = jest.fn();
      const outFilterDisconnectMock          = jest.fn();
      const levelConnectMock                 = jest.fn();
      const levelDisconnectMock              = jest.fn();

      /* eslint-disable dot-notation */
      fuzz['input'].connect                 = inputConnectMock;
      fuzz['input'].disconnect              = inputDisconnectMock;
      fuzz['positiveShaper'].connect        = positiveShaperConnectMock;
      fuzz['positiveShaper'].disconnect     = positiveShaperDisconnectMock;
      fuzz['negativeShaper'].connect        = negativeShaperConnectMock;
      fuzz['negativeShaper'].disconnect     = negativeShaperDisconnectMock;
      fuzz['positiveInputGain'].connect     = positiveInputGainConnectMock;
      fuzz['positiveInputGain'].disconnect  = positiveInputGainDisconnectMock;
      fuzz['negativeInputGain'].connect     = negativeInputGainConnectMock;
      fuzz['negativeInputGain'].disconnect  = negativeInputGainDisconnectMock;
      fuzz['positiveOutputGain'].connect    = positiveOutputGainConnectMock;
      fuzz['positiveOutputGain'].disconnect = positiveOutputGainDisconnectMock;
      fuzz['negativeOutputGain'].connect    = negativeOutputGainConnectMock;
      fuzz['negativeOutputGain'].disconnect = negativeOutputGainDisconnectMock;
      fuzz['driveInput'].connect            = driveInputConnectMock;
      fuzz['driveInput'].disconnect         = driveInputDisconnectMock;
      fuzz['outFilter'].connect             = outFilterConnectMock;
      fuzz['outFilter'].disconnect          = outFilterDisconnectMock;
      fuzz['level'].connect                 = levelConnectMock;
      fuzz['level'].disconnect              = levelDisconnectMock;
      /* eslint-enable dot-notation */

      fuzz.connect();

      expect(inputConnectMock).toHaveBeenCalledTimes(1);
      expect(positiveShaperConnectMock).toHaveBeenCalledTimes(0);
      expect(negativeShaperConnectMock).toHaveBeenCalledTimes(0);
      expect(positiveInputGainConnectMock).toHaveBeenCalledTimes(0);
      expect(negativeInputGainConnectMock).toHaveBeenCalledTimes(0);
      expect(positiveOutputGainConnectMock).toHaveBeenCalledTimes(0);
      expect(negativeOutputGainConnectMock).toHaveBeenCalledTimes(0);
      expect(driveInputConnectMock).toHaveBeenCalledTimes(0);
      expect(outFilterConnectMock).toHaveBeenCalledTimes(0);
      expect(levelConnectMock).toHaveBeenCalledTimes(0);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(1);
      expect(positiveShaperDisconnectMock).toHaveBeenCalledTimes(1);
      expect(negativeShaperDisconnectMock).toHaveBeenCalledTimes(1);
      expect(positiveInputGainDisconnectMock).toHaveBeenCalledTimes(1);
      expect(negativeInputGainDisconnectMock).toHaveBeenCalledTimes(1);
      expect(positiveOutputGainDisconnectMock).toHaveBeenCalledTimes(1);
      expect(negativeOutputGainDisconnectMock).toHaveBeenCalledTimes(1);
      expect(driveInputDisconnectMock).toHaveBeenCalledTimes(1);
      expect(outFilterDisconnectMock).toHaveBeenCalledTimes(1);
      expect(levelDisconnectMock).toHaveBeenCalledTimes(1);

      fuzz.activate();

      expect(inputConnectMock).toHaveBeenCalledTimes(3);
      expect(positiveShaperConnectMock).toHaveBeenCalledTimes(1);
      expect(negativeShaperConnectMock).toHaveBeenCalledTimes(1);
      expect(positiveInputGainConnectMock).toHaveBeenCalledTimes(1);
      expect(negativeInputGainConnectMock).toHaveBeenCalledTimes(1);
      expect(positiveOutputGainConnectMock).toHaveBeenCalledTimes(1);
      expect(negativeOutputGainConnectMock).toHaveBeenCalledTimes(1);
      expect(driveInputConnectMock).toHaveBeenCalledTimes(1);
      expect(outFilterConnectMock).toHaveBeenCalledTimes(1);
      expect(levelConnectMock).toHaveBeenCalledTimes(1);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(2);
      expect(positiveShaperDisconnectMock).toHaveBeenCalledTimes(2);
      expect(negativeShaperDisconnectMock).toHaveBeenCalledTimes(2);
      expect(positiveInputGainDisconnectMock).toHaveBeenCalledTimes(2);
      expect(negativeInputGainDisconnectMock).toHaveBeenCalledTimes(2);
      expect(positiveOutputGainDisconnectMock).toHaveBeenCalledTimes(2);
      expect(negativeOutputGainDisconnectMock).toHaveBeenCalledTimes(2);
      expect(driveInputDisconnectMock).toHaveBeenCalledTimes(2);
      expect(outFilterDisconnectMock).toHaveBeenCalledTimes(2);
      expect(levelDisconnectMock).toHaveBeenCalledTimes(2);
    });
  });

  describe(fuzz.param.name, () => {
    const defaultParams: FuzzParams = {
      drive     : 0,
      level     : 1,
      oversample: '4x'
    };

    const params: FuzzParams = {
      drive     : 0.5,
      level     : 0.5,
      oversample: 'none'
    };

    afterAll(() => {
      fuzz.param(defaultParams);
    });

    // Setter
    test('should return instance of `Fuzz`', () => {
      expect(fuzz.param(params)).toBeInstanceOf(Fuzz);
    });

    // Getter
    test('should return `drive`', () => {
      expect(fuzz.param('drive')).toBeCloseTo(0.5, 1);
    });

    test('should return `level`', () => {
      expect(fuzz.param('level')).toBeCloseTo(0.5, 1);
    });

    test('should return `oversample`', () => {
      expect(fuzz.param('oversample')).toBe('none');
    });
  });

  describe(fuzz.params.name, () => {
    test('should return parameters for fuzz effector as associative array', () => {
      expect(fuzz.params()).toStrictEqual({
        state     : false,
        drive     : 0,
        level     : 1,
        oversample: '4x'
      });
    });
  });

  describe(fuzz.activate.name, () => {
    test('should call `connect` method', () => {
      const originalConnect = fuzz.connect;

      const connectMock = jest.fn();

      fuzz.connect = connectMock;

      fuzz.activate();

      expect(connectMock).toHaveBeenCalledTimes(1);

      fuzz.connect = originalConnect;
    });
  });

  describe(fuzz.deactivate.name, () => {
    test('should call `connect` method', () => {
      const originalConnect = fuzz.connect;

      const connectMock = jest.fn();

      fuzz.connect = connectMock;

      fuzz.deactivate();

      expect(connectMock).toHaveBeenCalledTimes(2);

      fuzz.connect = originalConnect;
    });
  });
});
