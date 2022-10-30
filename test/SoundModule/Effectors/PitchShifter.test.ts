import { AudioContextMock } from '../../../mock/AudioContextMock';
import { PitchShifter, PitchShifterParams } from '../../../src/SoundModule/Effectors/PitchShifter';

describe(PitchShifter.name, () => {
  const context = new AudioContextMock();

  // @ts-ignore
  const pitchshifter = new PitchShifter(context, 2048);

  describe(pitchshifter.start.name, () => {
    test('should be `false` after start', () => {
      // eslint-disable-next-line dot-notation
      expect(pitchshifter['paused']).toBe(true);

      pitchshifter.activate();
      pitchshifter.start();

      // eslint-disable-next-line dot-notation
      expect(pitchshifter['paused']).toBe(false);

      pitchshifter.stop();
      pitchshifter.deactivate();
    });
  });

  describe(pitchshifter.stop.name, () => {
    test('should call `disconnect` method and stop `onaudioprocess` event handler', () => {
      // eslint-disable-next-line dot-notation
      const originalProcessor = pitchshifter['processor'];

      const disconnectMock = jest.fn();

      // eslint-disable-next-line dot-notation
      pitchshifter['processor'].disconnect = disconnectMock;

      pitchshifter.activate();
      pitchshifter.stop();

      expect(disconnectMock).toHaveBeenCalledTimes(3);

      // eslint-disable-next-line dot-notation
      expect(pitchshifter['processor'].onaudioprocess).toBe(null);

      // eslint-disable-next-line dot-notation
      pitchshifter['processor'] = originalProcessor;

      pitchshifter.deactivate();
    });
  });

  describe(pitchshifter.connect.name, () => {
    /* eslint-disable dot-notation */
    const originalInput     = pitchshifter['input'];
    const originalProcessor = pitchshifter['processor'];
    /* eslint-enable dot-notation */

    afterAll(() => {
      /* eslint-disable dot-notation */
      pitchshifter['input']     = originalInput;
      pitchshifter['processor'] = originalProcessor;
      /* eslint-enable dot-notation */

      pitchshifter.deactivate();
    });

    test('should call `connect` method', () => {
      const inputConnectMock        = jest.fn();
      const inputDisconnectMock     = jest.fn();
      const processorConnectMock    = jest.fn();
      const processorDisconnectMock = jest.fn();

      /* eslint-disable dot-notation */
      pitchshifter['input'].connect        = inputConnectMock;
      pitchshifter['input'].disconnect     = inputDisconnectMock;
      pitchshifter['processor'].connect    = processorConnectMock;
      pitchshifter['processor'].disconnect = processorDisconnectMock;
      /* eslint-enable dot-notation */

      pitchshifter.connect();

      expect(inputConnectMock).toHaveBeenCalledTimes(1);
      expect(processorConnectMock).toHaveBeenCalledTimes(0);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(1);
      expect(processorDisconnectMock).toHaveBeenCalledTimes(1);

      pitchshifter.activate();

      expect(inputConnectMock).toHaveBeenCalledTimes(2);
      expect(processorConnectMock).toHaveBeenCalledTimes(1);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(2);
      expect(processorDisconnectMock).toHaveBeenCalledTimes(2);
    });
  });

  describe(pitchshifter.param.name, () => {
    const defaultParams: PitchShifterParams = {
      pitch: 1.0
    };

    const params: PitchShifterParams = {
      pitch: 1.5
    };

    beforeAll(() => {
      pitchshifter.param(params);
    });

    afterAll(() => {
      pitchshifter.param(defaultParams);
    });

    test('should return `pitch`', () => {
      expect(pitchshifter.param('pitch')).toBeCloseTo(1.5, 1);
    });
  });

  describe(pitchshifter.params.name, () => {
    test('should return parameters for pitch shifter as associative array', () => {
      expect(pitchshifter.params()).toStrictEqual({
        state: false,
        pitch: 1.0
      });
    });
  });

  describe(pitchshifter.activate.name, () => {
    test('should call `connect` method', () => {
      const originalConnect = pitchshifter.connect;

      const connectMock = jest.fn();

      pitchshifter.connect = connectMock;

      pitchshifter.activate();

      expect(connectMock).toHaveBeenCalledTimes(1);

      pitchshifter.connect = originalConnect;
    });
  });

  describe(pitchshifter.deactivate.name, () => {
    test('should call `connect` method and stop `onaudioprocess` event handler', () => {
      const originalConnect = pitchshifter.connect;

      // eslint-disable-next-line dot-notation
      const originalProcessor = pitchshifter['processor'];

      const connectMock    = jest.fn();
      const disconnectMock = jest.fn();

      pitchshifter.connect = connectMock;

      // eslint-disable-next-line dot-notation
      pitchshifter['processor'].disconnect = disconnectMock;

      pitchshifter.deactivate();

      expect(connectMock).toHaveBeenCalledTimes(2);

      // eslint-disable-next-line dot-notation
      expect(pitchshifter['processor'].onaudioprocess).toBe(null);

      pitchshifter.connect = originalConnect;

      // eslint-disable-next-line dot-notation
      pitchshifter['processor'] = originalProcessor;
    });
  });
});
