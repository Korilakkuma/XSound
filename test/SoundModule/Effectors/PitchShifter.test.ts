import type { PitchShifterParams } from '/src/SoundModule/Effectors/PitchShifter';

import { AudioContextMock } from '/mock/AudioContextMock';
import { PitchShifter } from '/src/SoundModule/Effectors/PitchShifter';

describe(PitchShifter.name, () => {
  const context = new AudioContextMock();

  // @ts-expect-error Because there is not Web Audio API in Jest environment (Node.js environment), mocks Web Audio API
  const pitchshifter = new PitchShifter(context);

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
      // HACK:
      // eslint-disable-next-line dot-notation
      if (pitchshifter['processor'] === null) {
        return;
      }

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
      expect(processorConnectMock).toHaveBeenCalledTimes(1);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(1);
      expect(processorDisconnectMock).toHaveBeenCalledTimes(1);

      pitchshifter.activate();

      expect(inputConnectMock).toHaveBeenCalledTimes(2);
      expect(processorConnectMock).toHaveBeenCalledTimes(2);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(2);
      expect(processorDisconnectMock).toHaveBeenCalledTimes(2);
    });
  });

  describe(pitchshifter.param.name, () => {
    const defaultParams: PitchShifterParams = {
      pitch: 1,
      speed: 1
    };

    const params: PitchShifterParams = {
      pitch: 1.5,
      speed: 0.7
    };

    beforeAll(() => {
      pitchshifter.param(params);
    });

    afterAll(() => {
      pitchshifter.param(defaultParams);
    });

    // Setter
    test('should return instance of `PitchShifter`', () => {
      expect(pitchshifter.param(params)).toBeInstanceOf(PitchShifter);
    });

    // Getter
    test('should return `pitch`', () => {
      expect(pitchshifter.param('pitch')).toBeCloseTo(1.5, 1);
    });

    test('should return `speed`', () => {
      expect(pitchshifter.param('speed')).toBeCloseTo(0.7, 1);
    });
  });

  describe(pitchshifter.params.name, () => {
    test('should return parameters for pitch shifter as associative array', () => {
      expect(pitchshifter.params()).toStrictEqual({
        state: false,
        pitch: 1,
        speed: 1
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
    test('should call `connect` method', () => {
      // HACK:
      // eslint-disable-next-line dot-notation
      if (pitchshifter['processor'] === null) {
        return;
      }

      const originalConnect = pitchshifter.connect;

      // eslint-disable-next-line dot-notation
      const originalProcessor = pitchshifter['processor'];

      const connectMock    = jest.fn();
      const disconnectMock = jest.fn();

      pitchshifter.connect = connectMock;

      // eslint-disable-next-line dot-notation
      pitchshifter['processor'].disconnect = disconnectMock;

      pitchshifter.deactivate();

      expect(connectMock).toHaveBeenCalledTimes(1);

      pitchshifter.connect = originalConnect;

      // eslint-disable-next-line dot-notation
      pitchshifter['processor'] = originalProcessor;
    });
  });
});
