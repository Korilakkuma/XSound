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
import { NoiseModule, NoiseModuleParams } from '/src/NoiseModule';

type Params = Partial<Pick<NoiseModuleParams, 'mastervolume' | 'type'>>;

describe(NoiseModule.name, () => {
  const context = new AudioContextMock();

  // @ts-expect-error Because there is not Web Audio API in Jest environment (Node.js environment), mocks Web Audio API
  const noiseModule = new NoiseModule(context);

  describe(noiseModule.start.name, () => {
    test('should call methods for starting noise', () => {
      /* eslint-disable dot-notation */
      const originalEGStart = noiseModule['envelopegenerator'].start;
      const originalConnect = noiseModule['connect'];
      const originalOn      = noiseModule.on;
      /* eslint-enable dot-notation */

      const egStartMock = jest.fn();
      const connectMock = jest.fn();
      const onMock      = jest.fn();

      /* eslint-disable dot-notation */
      noiseModule['envelopegenerator'].start = egStartMock;
      noiseModule['connect']                 = connectMock;
      noiseModule.on                         = onMock;
      /* eslint-enable dot-notation */

      noiseModule.start();

      expect(egStartMock).toHaveBeenCalledTimes(1);
      expect(connectMock).toHaveBeenCalledTimes(1);
      expect(onMock).toHaveBeenCalledTimes(1);

      /* eslint-disable dot-notation */
      noiseModule['envelopegenerator'].start = originalEGStart;
      noiseModule['connect']                 = originalConnect;
      noiseModule.on                         = originalOn;
      /* eslint-enable dot-notation */
    });
  });

  describe(noiseModule.stop.name, () => {
    test('should call methods for stopping noise', () => {
      // eslint-disable-next-line dot-notation
      const originalEGStop = noiseModule['envelopegenerator'].stop;
      const originalOff    = noiseModule.off;

      const egStopMock = jest.fn();
      const offMock    = jest.fn();

      // eslint-disable-next-line dot-notation
      noiseModule['envelopegenerator'].stop = egStopMock;
      noiseModule.off                       = offMock;

      noiseModule.stop();

      expect(egStopMock).toHaveBeenCalledTimes(1);
      expect(offMock).toHaveBeenCalledTimes(1);

      // eslint-disable-next-line dot-notation
      noiseModule['envelopegenerator'].stop = originalEGStop;
      noiseModule.off                       = originalOff;
    });
  });

  describe(noiseModule.param.name, () => {
    const defaultParams: Params = {
      mastervolume: 1,
      type        : 'whitenoise'
    };

    const params: Params = {
      mastervolume: 0.5,
      type        : 'browniannoise'
    };

    beforeAll(() => {
      noiseModule.param(params);
    });

    afterAll(() => {
      noiseModule.param(defaultParams);
    });

    test('should return `mastervolume`', () => {
      expect(noiseModule.param('mastervolume')).toBeCloseTo(0.5, 1);
    });

    test('should return `type`', () => {
      expect(noiseModule.param('type')).toBe('browniannoise');
    });
  });

  describe(noiseModule.module.name, () => {
    test('should return instance of `Module`', () => {
      expect(noiseModule.module('analyser')).toBeInstanceOf(Analyser);
      expect(noiseModule.module('recorder')).toBeInstanceOf(Recorder);
      expect(noiseModule.module('autopanner')).toBeInstanceOf(Autopanner);
      expect(noiseModule.module('bitcrusher')).toBeInstanceOf(BitCrusher);
      expect(noiseModule.module('chorus')).toBeInstanceOf(Chorus);
      expect(noiseModule.module('compressor')).toBeInstanceOf(Compressor);
      expect(noiseModule.module('delay')).toBeInstanceOf(Delay);
      expect(noiseModule.module('envelopegenerator')).toBeInstanceOf(EnvelopeGenerator);
      expect(noiseModule.module('equalizer')).toBeInstanceOf(Equalizer);
      expect(noiseModule.module('filter')).toBeInstanceOf(Filter);
      expect(noiseModule.module('flanger')).toBeInstanceOf(Flanger);
      expect(noiseModule.module('fuzz')).toBeInstanceOf(Fuzz);
      expect(noiseModule.module('listener')).toBeInstanceOf(Listener);
      expect(noiseModule.module('noisegate')).toBeInstanceOf(NoiseGate);
      expect(noiseModule.module('noisesuppressor')).toBeInstanceOf(NoiseSuppressor);
      expect(noiseModule.module('overdrive')).toBeInstanceOf(OverDrive);
      expect(noiseModule.module('panner')).toBeInstanceOf(Panner);
      expect(noiseModule.module('phaser')).toBeInstanceOf(Phaser);
      expect(noiseModule.module('pitchshifter')).toBeInstanceOf(PitchShifter);
      expect(noiseModule.module('preamp')).toBeInstanceOf(Preamp);
      expect(noiseModule.module('reverb')).toBeInstanceOf(Reverb);
      expect(noiseModule.module('ringmodulator')).toBeInstanceOf(Ringmodulator);
      expect(noiseModule.module('stereo')).toBeInstanceOf(Stereo);
      expect(noiseModule.module('tremolo')).toBeInstanceOf(Tremolo);
      expect(noiseModule.module('vocalcanceler')).toBeInstanceOf(VocalCanceler);
      expect(noiseModule.module('wah')).toBeInstanceOf(Wah);
    });
  });

  describe(noiseModule.params.name, () => {
    test('should return parameters for noise module as associative array', () => {
      /* eslint-disable dot-notation */
      expect(noiseModule.params()).toStrictEqual({
        mastervolume     : 1,
        type             : 'whitenoise',
        autopanner       : noiseModule['autopanner'].params(),
        bitcrusher       : noiseModule['bitcrusher'].params(),
        chorus           : noiseModule['chorus'].params(),
        compressor       : noiseModule['compressor'].params(),
        delay            : noiseModule['delay'].params(),
        envelopegenerator: noiseModule['envelopegenerator'].params(),
        equalizer        : noiseModule['equalizer'].params(),
        filter           : noiseModule['filter'].params(),
        flanger          : noiseModule['flanger'].params(),
        fuzz             : noiseModule['fuzz'].params(),
        listener         : noiseModule['listener'].params(),
        noisegate        : noiseModule['noisegate'].params(),
        noisesuppressor  : noiseModule['noisesuppressor'].params(),
        overdrive        : noiseModule['overdrive'].params(),
        panner           : noiseModule['panner'].params(),
        phaser           : noiseModule['phaser'].params(),
        pitchshifter     : noiseModule['pitchshifter'].params(),
        preamp           : noiseModule['preamp'].params(),
        reverb           : noiseModule['reverb'].params(),
        ringmodulator    : noiseModule['ringmodulator'].params(),
        stereo           : noiseModule['stereo'].params(),
        tremolo          : noiseModule['tremolo'].params(),
        vocalcanceler    : noiseModule['vocalcanceler'].params(),
        wah              : noiseModule['wah'].params()
      });
      /* eslint-enable dot-notation */
    });
  });

  describe(noiseModule.edit.name, () => {
    test('should set edited modules and return previous modules', () => {
      // eslint-disable-next-line dot-notation
      const previousModules = noiseModule['modules'];

      const modules = [noiseModule.module('delay'), noiseModule.module('reverb')];

      expect(noiseModule.edit(modules)).toStrictEqual(previousModules);
      expect(modules[0]).toBeInstanceOf(Delay);
      expect(modules[1]).toBeInstanceOf(Reverb);
    });
  });
});
