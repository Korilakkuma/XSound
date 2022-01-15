import { AudioContextMock } from '../../mocks/AudioContextMock';
import { Analyser } from '../../src/SoundModule/Analyser';
import { Recorder } from '../../src/SoundModule/Recorder';
import { Session } from '../../src/SoundModule/Session';
import { Autopanner } from '../../src/SoundModule/Effectors/Autopanner';
import { Chorus } from '../../src/SoundModule/Effectors/Chorus';
import { Compressor } from './../../src/SoundModule/Effectors/Compressor';
import { Delay } from '../../src/SoundModule/Effectors/Delay';
import { Distortion } from '../../src/SoundModule/Effectors/Distortion';
import { Equalizer } from '../../src/SoundModule/Effectors/Equalizer';
import { Filter } from '../../src/SoundModule/Effectors/Filter';
import { Flanger } from '../../src/SoundModule/Effectors/Flanger';
import { Listener } from '../../src/SoundModule/Effectors/Listener';
import { Panner } from '../../src/SoundModule/Effectors/Panner';
import { Phaser } from '../../src/SoundModule/Effectors/Phaser';
import { PitchShifter } from './../../src/SoundModule/Effectors/PitchShifter';
import { Reverb } from '../../src/SoundModule/Effectors/Reverb';
import { Ringmodulator } from '../../src/SoundModule/Effectors/Ringmodulator';
import { Stereo } from '../../src/SoundModule/Effectors/Stereo';
import { Tremolo } from '../../src/SoundModule/Effectors/Tremolo';
import { Wah } from '../../src/SoundModule/Effectors/Wah';
import { EnvelopeGenerator } from '../../src/SoundModule/Effectors/EnvelopeGenerator';
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

  describe(mixerModule.module.name, () => {
    test('should return instance of `Module`', () => {
      expect(mixerModule.module('analyser')).toBeInstanceOf(Analyser);
      expect(mixerModule.module('recorder')).toBeInstanceOf(Recorder);
      expect(mixerModule.module('session')).toBeInstanceOf(Session);
      expect(mixerModule.module('autopanner')).toBeInstanceOf(Autopanner);
      expect(mixerModule.module('chorus')).toBeInstanceOf(Chorus);
      expect(mixerModule.module('compressor')).toBeInstanceOf(Compressor);
      expect(mixerModule.module('delay')).toBeInstanceOf(Delay);
      expect(mixerModule.module('distortion')).toBeInstanceOf(Distortion);
      expect(mixerModule.module('equalizer')).toBeInstanceOf(Equalizer);
      expect(mixerModule.module('filter')).toBeInstanceOf(Filter);
      expect(mixerModule.module('flanger')).toBeInstanceOf(Flanger);
      expect(mixerModule.module('listener')).toBeInstanceOf(Listener);
      expect(mixerModule.module('panner')).toBeInstanceOf(Panner);
      expect(mixerModule.module('phaser')).toBeInstanceOf(Phaser);
      expect(mixerModule.module('pitchshifter')).toBeInstanceOf(PitchShifter);
      expect(mixerModule.module('reverb')).toBeInstanceOf(Reverb);
      expect(mixerModule.module('ringmodulator')).toBeInstanceOf(Ringmodulator);
      expect(mixerModule.module('stereo')).toBeInstanceOf(Stereo);
      expect(mixerModule.module('tremolo')).toBeInstanceOf(Tremolo);
      expect(mixerModule.module('wah')).toBeInstanceOf(Wah);
      expect(mixerModule.module('envelopegenerator')).toBeInstanceOf(EnvelopeGenerator);
    });
  });
});
