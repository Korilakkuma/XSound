import { AudioContextMock } from '../../mock/AudioContextMock';
import { Analyser } from '../../src/SoundModule/Analyser';
import { Recorder } from '../../src/SoundModule/Recorder';
import { Session } from '../../src/SoundModule/Session';
import { Autopanner } from '../../src/SoundModule/Effectors/Autopanner';
import { BitCrusher } from '../../src/SoundModule/Effectors/BitCrusher';
import { Chorus } from '../../src/SoundModule/Effectors/Chorus';
import { Compressor } from './../../src/SoundModule/Effectors/Compressor';
import { Delay } from '../../src/SoundModule/Effectors/Delay';
import { Distortion } from '../../src/SoundModule/Effectors/Distortion';
import { EnvelopeGenerator } from '../../src/SoundModule/Effectors/EnvelopeGenerator';
import { Equalizer } from '../../src/SoundModule/Effectors/Equalizer';
import { Filter } from '../../src/SoundModule/Effectors/Filter';
import { Flanger } from '../../src/SoundModule/Effectors/Flanger';
import { Listener } from '../../src/SoundModule/Effectors/Listener';
import { NoiseGate } from '../../src/SoundModule/Effectors/NoiseGate';
import { NoiseSuppressor } from '../../src/SoundModule/Effectors/NoiseSuppressor';
import { Panner } from '../../src/SoundModule/Effectors/Panner';
import { Phaser } from '../../src/SoundModule/Effectors/Phaser';
import { PitchShifter } from './../../src/SoundModule/Effectors/PitchShifter';
import { Reverb } from '../../src/SoundModule/Effectors/Reverb';
import { Ringmodulator } from '../../src/SoundModule/Effectors/Ringmodulator';
import { Stereo } from '../../src/SoundModule/Effectors/Stereo';
import { Tremolo } from '../../src/SoundModule/Effectors/Tremolo';
import { VocalCanceler } from '../../src/SoundModule/Effectors/VocalCanceler';
import { Wah } from '../../src/SoundModule/Effectors/Wah';
import { NoiseModule, NoiseModuleParams } from '../../src/NoiseModule';

type Params = Partial<Pick<NoiseModuleParams, 'mastervolume' | 'type'>>;

describe(NoiseModule.name, () => {
  const context = new AudioContextMock();

  // @ts-ignore
  const noiseModule = new NoiseModule(context, 2048);

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
      expect(noiseModule.module('session')).toBeInstanceOf(Session);
      expect(noiseModule.module('autopanner')).toBeInstanceOf(Autopanner);
      expect(noiseModule.module('bitcrusher')).toBeInstanceOf(BitCrusher);
      expect(noiseModule.module('chorus')).toBeInstanceOf(Chorus);
      expect(noiseModule.module('compressor')).toBeInstanceOf(Compressor);
      expect(noiseModule.module('delay')).toBeInstanceOf(Delay);
      expect(noiseModule.module('distortion')).toBeInstanceOf(Distortion);
      expect(noiseModule.module('envelopegenerator')).toBeInstanceOf(EnvelopeGenerator);
      expect(noiseModule.module('equalizer')).toBeInstanceOf(Equalizer);
      expect(noiseModule.module('filter')).toBeInstanceOf(Filter);
      expect(noiseModule.module('flanger')).toBeInstanceOf(Flanger);
      expect(noiseModule.module('listener')).toBeInstanceOf(Listener);
      expect(noiseModule.module('noisegate')).toBeInstanceOf(NoiseGate);
      expect(noiseModule.module('noisesuppressor')).toBeInstanceOf(NoiseSuppressor);
      expect(noiseModule.module('panner')).toBeInstanceOf(Panner);
      expect(noiseModule.module('phaser')).toBeInstanceOf(Phaser);
      expect(noiseModule.module('pitchshifter')).toBeInstanceOf(PitchShifter);
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
        envelopegenerator: noiseModule['envelopegenerator'].params(),
        stereo           : noiseModule['stereo'].params(),
        compressor       : noiseModule['compressor'].params(),
        bitcrusher       : noiseModule['bitcrusher'].params(),
        distortion       : noiseModule['distortion'].params(),
        wah              : noiseModule['wah'].params(),
        pitchshifter     : noiseModule['pitchshifter'].params(),
        equalizer        : noiseModule['equalizer'].params(),
        filter           : noiseModule['filter'].params(),
        autopanner       : noiseModule['autopanner'].params(),
        tremolo          : noiseModule['tremolo'].params(),
        ringmodulator    : noiseModule['ringmodulator'].params(),
        phaser           : noiseModule['phaser'].params(),
        flanger          : noiseModule['flanger'].params(),
        chorus           : noiseModule['chorus'].params(),
        delay            : noiseModule['delay'].params(),
        reverb           : noiseModule['reverb'].params(),
        panner           : noiseModule['panner'].params(),
        listener         : noiseModule['listener'].params(),
        noisegate        : noiseModule['noisegate'].params(),
        noisesuppressor  : noiseModule['noisesuppressor'].params(),
        vocalcanceler    : noiseModule['vocalcanceler'].params()
      });
      /* eslint-enable dot-notation */
    });
  });
});
