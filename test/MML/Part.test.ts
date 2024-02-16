import { AudioContextMock } from '/mock/AudioContextMock';
import { WorkerMock } from '/mock/WorkerMock';
import { OscillatorModule } from '/src/OscillatorModule';
import { Sequence } from '/src/MML/Sequence';
import { Part } from '/src/MML/Part';

describe(Part.name, () => {
  const originalWebWorker       = window.Worker;
  const originalCreateObjectURL = URL.createObjectURL;
  const originalRevokeObjectURL = URL.revokeObjectURL;

  Object.defineProperty(window, 'Worker', {
    configurable: true,
    writable    : true,
    value       : WorkerMock
  });

  Object.defineProperty(URL, 'createObjectURL', {
    configurable: true,
    writable    : true,
    value       : () => 'https://xxx'
  });

  Object.defineProperty(URL, 'revokeObjectURL', {
    configurable: true,
    writable    : true,
    value       : () => {}
  });

  const context = new AudioContextMock();

  // @ts-expect-error Because there is not Web Audio API in Jest environment (Node.js environment), mocks Web Audio API
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

  afterAll(() => {
    window.Worker       = originalWebWorker;
    URL.createObjectURL = originalCreateObjectURL;
    URL.revokeObjectURL = originalRevokeObjectURL;
  });

  afterEach(() => {
    jest.clearAllMocks();

    part.stop();
    part.setCurrentIndex(0);
  });

  describe(part.start.name, () => {
    test('should call `start` method, callbacks and worker should call `postMessage`', () => {
      // HACK:
      // eslint-disable-next-line dot-notation
      if (part['scheduleWorker'] === null) {
        return;
      }

      /* eslint-disable dot-notation */
      const originalSourceStart = part['source'].start;
      const originalWorkerPostMessage = part['scheduleWorker'].postMessage;
      /* eslint-enable dot-notation */

      const sourceStartMock       = jest.fn();
      const workerPostMessageMock = jest.fn();

      /* eslint-disable dot-notation */
      part['source'].start               = sourceStartMock;
      part['scheduleWorker'].postMessage = workerPostMessageMock;
      /* eslint-enable dot-notation */

      part.start(false);

      expect(sourceStartMock).toHaveBeenCalledTimes(1);
      expect(startCallbackMock).toHaveBeenCalledTimes(1);
      expect(stopCallbackMock).toHaveBeenCalledTimes(0);

      /* eslint-disable dot-notation */
      part['source'].start               = originalSourceStart;
      part['scheduleWorker'].postMessage = originalWorkerPostMessage;
      /* eslint-enable dot-notation */
    });
  });

  describe(part.stop.name, () => {
    test('should call sound source `stop` method and worker should call `postMessage` and `terminate` method', () => {
      // HACK:
      // eslint-disable-next-line dot-notation
      if (part['scheduleWorker'] === null) {
        return;
      }

      // eslint-disable-next-line dot-notation
      const originalSourceStop = part['source'].stop;

      const sourceStopMock        = jest.fn();
      const workerPostMessageMock = jest.fn();
      const workerTerminateMock   = jest.fn();

      /* eslint-disable dot-notation */
      part['source'].stop                = sourceStopMock;
      part['scheduleWorker'].postMessage = workerPostMessageMock;
      part['scheduleWorker'].terminate   = workerTerminateMock;
      /* eslint-enable dot-notation */

      part.start(false);

      // eslint-disable-next-line dot-notation
      part['previous'] = new Sequence({
        id         : '2',
        note       : 'R2.',
        indexes    : [-1],
        frequencies: [-1],
        start      : 2,
        stop       : 6,
        duration   : 4
      });

      part.stop();

      expect(sourceStopMock).toHaveBeenCalledTimes(1);
      expect(workerPostMessageMock).toHaveBeenCalledTimes(2);
      expect(workerTerminateMock).toHaveBeenCalledTimes(1);

      // eslint-disable-next-line dot-notation
      expect(part['scheduleWorker']).toBe(null);

      // eslint-disable-next-line dot-notation
      part['source'].stop = originalSourceStop;
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
      const part = new Part({
        source,
        mml: '',
        offset,
        startCallback: startCallbackMock,
        stopCallback : stopCallbackMock,
        endedCallback: endedCallbackMock
      });

      part.start(false);

      expect(part.paused()).toBe(false);
    });

    test('should return `true`', () => {
      const part = new Part({
        source,
        mml: '',
        offset,
        startCallback: startCallbackMock,
        stopCallback : stopCallbackMock,
        endedCallback: endedCallbackMock
      });

      part.start(false);

      // eslint-disable-next-line dot-notation
      part['previous'] = new Sequence({
        id         : '2',
        note       : 'R2.',
        indexes    : [-1],
        frequencies: [-1],
        start      : 2,
        stop       : 6,
        duration   : 4
      });

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
