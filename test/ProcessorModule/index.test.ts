import { AudioContextMock } from '../../mocks/AudioContextMock';
import { AudioWorkletNodeMock, AudioParamMapMock } from '../../mocks/AudioWorkletNodeMock';
import { ProcessorModule } from '../../src/ProcessorModule';

describe(ProcessorModule.name, () => {
  const context = new AudioContextMock();

  // @ts-ignore
  const processorModule = new ProcessorModule(context, 2048);

  processorModule.setup('test-processor');

  describe(processorModule.ready.name, () => {
    test('should call `addModule` and return `Promise`', () => {
      const originalAddModule = context.audioWorklet.addModule;

      const addModuleMock = jest.fn();

      addModuleMock.mockReturnValue(new Promise((resolve) => resolve(undefined)));

      context.audioWorklet.addModule = addModuleMock;

      processorModule.ready('./worklet.js')
        .then((value) => {
          expect(addModuleMock).toHaveReturnedTimes(1);
          expect(value).toBeUndefined();
        })
        .catch(() => {
        });

      addModuleMock.mockClear();

      context.audioWorklet.addModule = originalAddModule;
    });
  });

  describe(processorModule.start.name, () => {
    test('should call `connect` method', () => {
      processorModule.ready('./worklet.js')
        .then(() => {
          // eslint-disable-next-line dot-notation
          const originalConnect = processorModule['connect'];

          const connectMock = jest.fn();

          // eslint-disable-next-line dot-notation
          processorModule['connect'] = connectMock;

          processorModule.start();

          expect(connectMock).toHaveBeenCalledTimes(1);

          // eslint-disable-next-line dot-notation
          processorModule['connect'] = originalConnect;
        })
        .catch(() => {
        });
    });
  });

  describe(processorModule.stop.name, () => {
    test('should call envelope generator `stop` method', () => {
      processorModule.ready('./worklet.js')
        .then(() => {
          // eslint-disable-next-line dot-notation
          const originalEGStop = processorModule['envelopegenerator'].stop;

          const egStopMock = jest.fn();

          // eslint-disable-next-line dot-notation
          processorModule['envelopegenerator'].stop = egStopMock;

          processorModule.stop();

          expect(egStopMock).toHaveBeenCalledTimes(1);

          // eslint-disable-next-line dot-notation
          processorModule['envelopegenerator'].stop = originalEGStop;
        })
        .catch(() => {
        });
    });
  });

  xdescribe(processorModule.postMessage.name, () => {
    // TODO:
  });

  xdescribe(processorModule.onMessage.name, () => {
    // TODO:
  });

  xdescribe(processorModule.onMessageError.name, () => {
    // TODO:
  });

  describe(processorModule.map.name, () => {
    test('should return `null`', () => {
      expect(processorModule.map()).toBe(null);
    });

    test('should return instance of `AudioParamMap`', () => {
      processorModule.ready('./worklet.js')
        .then(() => {
          expect(processorModule.map()).toBeInstanceOf(AudioParamMapMock);
        })
        .catch(() => {
        });
    });
  });

  describe(processorModule.get.name, () => {
    test('should return `null`', () => {
      expect(processorModule.get()).toBe(null);
    });

    test('should return instance of `AudioWorkletNode`', () => {
      processorModule.ready('./worklet.js')
        .then(() => {
          expect(processorModule.get()).toBeInstanceOf(AudioWorkletNodeMock);
        })
        .catch(() => {
        });
    });
  });
});
