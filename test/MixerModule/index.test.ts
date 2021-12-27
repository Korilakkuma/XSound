import { AudioContextMock } from '../../mocks/AudioContextMock';
import { OscillatorModule } from '../../src/OscillatorModule';
import { OneshotModule } from '../../src/OneshotModule';
import { MixerModule } from '../../src/MixerModule';

describe(MixerModule.name, () => {
  const context = new AudioContextMock();

  // @ts-ignore
  const mixerModule = new MixerModule(context, 2048);

  // @ts-ignore
  const oscillatorModule = new OscillatorModule(context, 2048);

  // @ts-ignore
  const oneshotModule = new OneshotModule(context, 2048);

  const sources = [
    oscillatorModule,
    oneshotModule
  ];

  describe(mixerModule.mix.name, () => {
    test('should call `suspend` and `connect` method', () => {
      const originalOscillatorModuleSuspend = sources[0].suspend;
      const originalOneshotModuleSuspend    = sources[1].suspend;

      const originalOscillatorModuleInput = sources[0].INPUT;
      const originalOneshotModuleInput    = sources[1].INPUT;

      const oscillatorModuleSuspendMock = jest.fn();
      const oneshotModuleSuspendMock    = jest.fn();

      const oscillatorModuleInputConnectMock = jest.fn();
      const oneshotModuleInputConnectMock    = jest.fn();

      sources[0].suspend = oscillatorModuleSuspendMock;
      sources[1].suspend = oneshotModuleSuspendMock;

      Object.defineProperty(sources[0], 'INPUT', {
        configurable: true,
        writable: true,
        value: {
          connect: oscillatorModuleInputConnectMock
        }
      });

      Object.defineProperty(sources[1], 'INPUT', {
        configurable: true,
        writable: true,
        value: {
          connect: oneshotModuleInputConnectMock
        }
      });

      mixerModule.mix(sources);

      expect(oscillatorModuleSuspendMock).toHaveBeenCalledTimes(1);
      expect(oneshotModuleSuspendMock).toHaveBeenCalledTimes(1);

      expect(oscillatorModuleInputConnectMock).toHaveBeenCalledTimes(1);
      expect(oneshotModuleInputConnectMock).toHaveBeenCalledTimes(1);

      sources[0].suspend = originalOscillatorModuleSuspend;
      sources[1].suspend = originalOneshotModuleSuspend;

      Object.defineProperty(sources[0], 'input', {
        configurable: true,
        writable: true,
        value: originalOscillatorModuleInput
      });

      Object.defineProperty(sources[1], 'input', {
        configurable: true,
        writable: true,
        value: originalOneshotModuleInput
      });
    });
  });

  describe(mixerModule.get.name, () => {
    test('should return array that contains mixed instance of `SoundModule` subclass', () => {
      expect(mixerModule.mix(sources).get()).toStrictEqual(sources);
    });
  });
});
