import type { SoundModuleParams } from '/src/SoundModule';

import { AudioContextMock } from '/mock/AudioContextMock';
import { Analyser } from '/src/SoundModule/Analyser';
import { Recorder } from '/src/SoundModule/Recorder';
import { Autopanner } from '/src/SoundModule/Effectors/Autopanner';
import { BitCrusher } from '/src/SoundModule/Effectors/BitCrusher';
import { Chorus } from '/src/SoundModule/Effectors/Chorus';
import { Compressor } from '/src/SoundModule/Effectors/Compressor';
import { Delay } from '/src/SoundModule/Effectors/Delay';
import { EnvelopeGenerator } from '/src/SoundModule/Effectors/EnvelopeGenerator';
import { Equalizer } from '/src/SoundModule/Effectors/Equalizer';
import { Filter } from '/src/SoundModule/Effectors/Filter';
import { Flanger } from '/src/SoundModule/Effectors/Flanger';
import { Fuzz } from '/src/SoundModule/Effectors/Fuzz';
import { Listener } from '/src/SoundModule/Effectors/Listener';
import { NoiseGate } from '/src/SoundModule/Effectors/NoiseGate';
import { NoiseSuppressor } from '/src/SoundModule/Effectors/NoiseSuppressor';
import { OverDrive } from '/src/SoundModule/Effectors/OverDrive';
import { Panner } from '/src/SoundModule/Effectors/Panner';
import { Phaser } from '/src/SoundModule/Effectors/Phaser';
import { PitchShifter } from '/src/SoundModule/Effectors/PitchShifter';
import { Preamp } from '/src/SoundModule/Effectors/Preamp';
import { Reverb } from '/src/SoundModule/Effectors/Reverb';
import { Ringmodulator } from '/src/SoundModule/Effectors/Ringmodulator';
import { Stereo } from '/src/SoundModule/Effectors/Stereo';
import { Tremolo } from '/src/SoundModule/Effectors/Tremolo';
import { VocalCanceler } from '/src/SoundModule/Effectors/VocalCanceler';
import { Wah } from '/src/SoundModule/Effectors/Wah';
import { OscillatorModule } from '/src/OscillatorModule';
import { OneshotModule } from '/src/OneshotModule';
import { MixerModule } from '/src/MixerModule';

type Params = Partial<Pick<SoundModuleParams, 'mastervolume'>>;

describe(MixerModule.name, () => {
  const context = new AudioContextMock();

  // @ts-expect-error Because there is not Web Audio API in Jest environment (Node.js environment), mocks Web Audio API
  const mixerModule = new MixerModule(context);

  // @ts-expect-error Because there is not Web Audio API in Jest environment (Node.js environment), mocks Web Audio API
  const oscillatorModule = new OscillatorModule(context);

  // @ts-expect-error Because there is not Web Audio API in Jest environment (Node.js environment), mocks Web Audio API
  const oneshotModule = new OneshotModule(context);

  const sources = [
    oscillatorModule,
    oneshotModule
  ];

  describe(mixerModule.start.name, () => {
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

      mixerModule.start(sources);

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

  describe(mixerModule.start.name, () => {
    test('should call `mix` method', () => {
      const originalOscillatorModuleMix = sources[0].mix;
      const originalOneshotModuleMix    = sources[1].mix;

      const originalOscillatorModuleInput = sources[0].INPUT;
      const originalOneshotModuleInput    = sources[1].INPUT;

      const oscillatorModuleMixMock = jest.fn();
      const oneshotModuleMixMock    = jest.fn();

      const oscillatorModuleInputConnectMock = jest.fn();
      const oneshotModuleInputConnectMock    = jest.fn();

      sources[0].mix = oscillatorModuleMixMock;
      sources[1].mix = oneshotModuleMixMock;

      Object.defineProperty(sources[0], 'INPUT', {
        configurable: true,
        writable    : true,
        value       : {
          connect: oscillatorModuleInputConnectMock
        }
      });

      Object.defineProperty(sources[1], 'INPUT', {
        configurable: true,
        writable    : true,
        value       : {
          connect: oneshotModuleInputConnectMock
        }
      });

      mixerModule.start(sources);

      expect(oscillatorModuleMixMock).toHaveBeenCalledTimes(1);
      expect(oneshotModuleMixMock).toHaveBeenCalledTimes(1);

      expect(oscillatorModuleInputConnectMock).toHaveBeenCalledTimes(1);
      expect(oneshotModuleMixMock).toHaveBeenCalledTimes(1);

      sources[0].mix = originalOscillatorModuleMix;
      sources[1].mix = originalOneshotModuleMix;

      Object.defineProperty(sources[0], 'INPUT', {
        configurable: true,
        writable    : true,
        value       : originalOscillatorModuleInput
      });

      Object.defineProperty(sources[1], 'INPUT', {
        configurable: true,
        writable    : true,
        value       : originalOneshotModuleInput
      });
    });
  });

  describe(mixerModule.stop.name, () => {
    test('should call `demix` method', () => {
      const originalOscillatorModuleDemix = sources[0].demix;
      const originalOneshotModuleDemix    = sources[1].demix;

      const originalOscillatorModuleInput = sources[0].INPUT;
      const originalOneshotModuleInput    = sources[1].INPUT;

      const originalOscillatorModuleConnect = sources[0].connect;
      const originalOneshotModuleConnect    = sources[1].connect;

      /* eslint-disable dot-notation */
      const originalGainNode0 = mixerModule['gainNodes'][0];
      const originalGainNode1 = mixerModule['gainNodes'][1];
      /* eslint-enable dot-notation */

      const oscillatorModuleDemixMock = jest.fn();
      const oneshotModuleDemixMock    = jest.fn();

      const oscillatorModuleConnectMock = jest.fn();
      const oneshotModuleConnectMock    = jest.fn();

      const gainNode0DisconnectMock = jest.fn();
      const gainNode1DisconnectMock = jest.fn();

      sources[0].demix = oscillatorModuleDemixMock;
      sources[1].demix = oneshotModuleDemixMock;

      sources[0].connect = oscillatorModuleConnectMock;
      sources[1].connect = oneshotModuleConnectMock;

      /* eslint-disable dot-notation */
      mixerModule['gainNodes'][0].disconnect = gainNode0DisconnectMock;
      mixerModule['gainNodes'][1].disconnect = gainNode1DisconnectMock;
      /* eslint-enable dot-notation */

      mixerModule.stop();

      expect(oscillatorModuleDemixMock).toHaveBeenCalledTimes(1);
      expect(oneshotModuleDemixMock).toHaveBeenCalledTimes(1);

      expect(oscillatorModuleConnectMock).toHaveBeenCalledTimes(1);
      expect(oneshotModuleConnectMock).toHaveBeenCalledTimes(1);

      expect(gainNode0DisconnectMock).toHaveBeenCalledTimes(1);
      expect(gainNode1DisconnectMock).toHaveBeenCalledTimes(1);

      sources[0].demix = originalOscillatorModuleDemix;
      sources[1].demix = originalOneshotModuleDemix;

      Object.defineProperty(sources[0], 'INPUT', {
        configurable: true,
        writable    : true,
        value       : originalOscillatorModuleInput
      });

      Object.defineProperty(sources[1], 'INPUT', {
        configurable: true,
        writable    : true,
        value       : originalOneshotModuleInput
      });

      sources[0].connect = originalOscillatorModuleConnect;
      sources[1].connect = originalOneshotModuleConnect;

      /* eslint-disable dot-notation */
      mixerModule['gainNodes'][0] = originalGainNode0;
      mixerModule['gainNodes'][1] = originalGainNode1;
      /* eslint-enable dot-notation */
    });
  });

  describe(mixerModule.param.name, () => {
    const defaultParams: Params = {
      mastervolume: 1
    };

    const params: Params = {
      mastervolume: 0.5
    };

    beforeAll(() => {
      mixerModule.param(params);
    });

    afterAll(() => {
      mixerModule.param(defaultParams);
    });

    test('should return `mastervolume`', () => {
      expect(mixerModule.param('mastervolume')).toBeCloseTo(0.5, 1);
    });
  });

  describe(mixerModule.get.name, () => {
    test('should return array that contains mixed instance of `SoundModule` subclass', () => {
      expect(mixerModule.start(sources).get()).toStrictEqual(sources);
    });
  });

  describe(mixerModule.module.name, () => {
    test('should return instance of `Module`', () => {
      expect(mixerModule.module('analyser')).toBeInstanceOf(Analyser);
      expect(mixerModule.module('recorder')).toBeInstanceOf(Recorder);
      expect(mixerModule.module('autopanner')).toBeInstanceOf(Autopanner);
      expect(mixerModule.module('bitcrusher')).toBeInstanceOf(BitCrusher);
      expect(mixerModule.module('chorus')).toBeInstanceOf(Chorus);
      expect(mixerModule.module('compressor')).toBeInstanceOf(Compressor);
      expect(mixerModule.module('delay')).toBeInstanceOf(Delay);
      expect(mixerModule.module('envelopegenerator')).toBeInstanceOf(EnvelopeGenerator);
      expect(mixerModule.module('equalizer')).toBeInstanceOf(Equalizer);
      expect(mixerModule.module('filter')).toBeInstanceOf(Filter);
      expect(mixerModule.module('flanger')).toBeInstanceOf(Flanger);
      expect(mixerModule.module('fuzz')).toBeInstanceOf(Fuzz);
      expect(mixerModule.module('listener')).toBeInstanceOf(Listener);
      expect(mixerModule.module('noisegate')).toBeInstanceOf(NoiseGate);
      expect(mixerModule.module('noisesuppressor')).toBeInstanceOf(NoiseSuppressor);
      expect(mixerModule.module('overdrive')).toBeInstanceOf(OverDrive);
      expect(mixerModule.module('panner')).toBeInstanceOf(Panner);
      expect(mixerModule.module('phaser')).toBeInstanceOf(Phaser);
      expect(mixerModule.module('pitchshifter')).toBeInstanceOf(PitchShifter);
      expect(mixerModule.module('preamp')).toBeInstanceOf(Preamp);
      expect(mixerModule.module('reverb')).toBeInstanceOf(Reverb);
      expect(mixerModule.module('ringmodulator')).toBeInstanceOf(Ringmodulator);
      expect(mixerModule.module('stereo')).toBeInstanceOf(Stereo);
      expect(mixerModule.module('tremolo')).toBeInstanceOf(Tremolo);
      expect(mixerModule.module('vocalcanceler')).toBeInstanceOf(VocalCanceler);
      expect(mixerModule.module('wah')).toBeInstanceOf(Wah);
    });
  });

  describe(mixerModule.edit.name, () => {
    test('should set edited modules and return previous modules', () => {
      // eslint-disable-next-line dot-notation
      const previousModules = mixerModule['modules'];

      const modules = [mixerModule.module('delay'), mixerModule.module('reverb')];

      expect(mixerModule.edit(modules)).toStrictEqual(previousModules);
      expect(modules[0]).toBeInstanceOf(Delay);
      expect(modules[1]).toBeInstanceOf(Reverb);
    });
  });
});
