import { AudioContextMock } from '../../mock/AudioContextMock';
import { OscillatorModule } from '../../src/OscillatorModule';
import { Part } from '../../src/MML/Part';

jest.useFakeTimers();

describe(Part.name, () => {
  const context = new AudioContextMock();

  // @ts-ignore
  const source = new OscillatorModule(context, 2048);

  const mml = 'T60 O4 C4 R2. C4&C4';

  const offset = 0;

  const startCallbackMock = jest.fn();
  const stopCallbackMock  = jest.fn();
  const endedCallbackMock = jest.fn();

  const part = new Part({
    source,
    mml,
    offset,
    startCallback: startCallbackMock,
    stopCallback : stopCallbackMock,
    endedCallback: endedCallbackMock
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();

    part.stop();
    part.setCurrentIndex(0);
  });

  describe(part.start.name, () => {
    test('should call `start` method and callbacks', () => {
      const originalStart = source.start;

      const startMock = jest.fn();

      source.start = startMock;

      part.start(false);

      expect(startMock).toHaveBeenCalledTimes(1);
      expect(startCallbackMock).toHaveBeenCalledTimes(1);
      expect(stopCallbackMock).toHaveBeenCalledTimes(0);

      jest.advanceTimersToNextTimer(1);

      expect(startMock).toHaveBeenCalledTimes(2);
      expect(startCallbackMock).toHaveBeenCalledTimes(2);
      expect(stopCallbackMock).toHaveBeenCalledTimes(1);

      source.start = originalStart;
    });
  });

  describe(part.stop.name, () => {
    test('should call sound source `stop` method and clear timer', () => {
      // eslint-disable-next-line dot-notation
      const originalSourceStop   = part['source'].stop;
      const originalClearTimeout = window.clearTimeout;

      const sourceStopMock   = jest.fn();
      const clearTimeoutMock = jest.fn();

      // eslint-disable-next-line dot-notation
      part['source'].stop = sourceStopMock;

      Object.defineProperty(window, 'clearTimeout', {
        configurable: true,
        writable    : true,
        value       : clearTimeoutMock
      });

      part.start(false);

      jest.advanceTimersToNextTimer(1);

      part.stop();

      expect(sourceStopMock).toHaveBeenCalledTimes(1);
      expect(clearTimeoutMock).toHaveBeenCalledTimes(3);  // XXX:

      // eslint-disable-next-line dot-notation
      expect(part['timerId']).toBe(null);

      // eslint-disable-next-line dot-notation
      part['source'].stop = originalSourceStop;

      Object.defineProperty(window, 'clearTimeout', {
        configurable: true,
        writable    : true,
        value       : originalClearTimeout
      });
    });
  });

  describe(part.has.name, () => {
    test('should return `true`', () => {
      expect(part.has()).toBe(true);
    });

    test('should return `false`', () => {
      const part = new Part({
        source,
        mml: '',
        offset,
        startCallback: startCallbackMock,
        stopCallback : stopCallbackMock,
        endedCallback: endedCallbackMock
      });

      expect(part.has()).toBe(false);
    });
  });

  describe(part.paused.name, () => {
    test('should return `false`', () => {
      part.start(false);

      expect(part.paused()).toBe(false);
    });

    test('should return `true`', () => {
      part.start(false);
      part.stop();

      expect(part.paused()).toBe(true);
    });
  });

  describe(part.setCurrentIndex.name, () => {
    test('should set index', () => {
      part.setCurrentIndex(0);

      expect(part.getCurrentIndex()).toBe(0);

      part.setCurrentIndex(2);

      expect(part.getCurrentIndex()).toBe(2);

      part.setCurrentIndex(3);

      expect(part.getCurrentIndex()).toBe(2);

      part.setCurrentIndex(-1);

      expect(part.getCurrentIndex()).toBe(2);
    });
  });
});
