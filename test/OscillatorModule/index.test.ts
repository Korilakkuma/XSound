import { AudioContextMock } from '../../mock/AudioContextMock';
import { Analyser } from '../../src/SoundModule/Analyser';
import { Recorder } from '../../src/SoundModule/Recorder';
import { Session } from '../../src/SoundModule/Session';
import { Autopanner } from '../../src/SoundModule/Effectors/Autopanner';
import { BitCrusher } from '../../src/SoundModule/Effectors/BitCrusher';
import { Chorus } from '../../src/SoundModule/Effectors/Chorus';
import { Compressor } from './../../src/SoundModule/Effectors/Compressor';
import { Delay } from '../../src/SoundModule/Effectors/Delay';
import { EnvelopeGenerator } from '../../src/SoundModule/Effectors/EnvelopeGenerator';
import { Equalizer } from '../../src/SoundModule/Effectors/Equalizer';
import { Filter } from '../../src/SoundModule/Effectors/Filter';
import { Flanger } from '../../src/SoundModule/Effectors/Flanger';
import { Fuzz } from '../../src/SoundModule/Effectors/Fuzz';
import { Listener } from '../../src/SoundModule/Effectors/Listener';
import { NoiseGate } from '../../src/SoundModule/Effectors/NoiseGate';
import { NoiseSuppressor } from '../../src/SoundModule/Effectors/NoiseSuppressor';
import { OverDrive } from '../../src/SoundModule/Effectors/OverDrive';
import { Panner } from '../../src/SoundModule/Effectors/Panner';
import { Phaser } from '../../src/SoundModule/Effectors/Phaser';
import { PitchShifter } from './../../src/SoundModule/Effectors/PitchShifter';
import { Preamp } from '../../src/SoundModule/Effectors/Preamp';
import { Reverb } from '../../src/SoundModule/Effectors/Reverb';
import { Ringmodulator } from '../../src/SoundModule/Effectors/Ringmodulator';
import { Stereo } from '../../src/SoundModule/Effectors/Stereo';
import { Tremolo } from '../../src/SoundModule/Effectors/Tremolo';
import { VocalCanceler } from '../../src/SoundModule/Effectors/VocalCanceler';
import { Wah } from '../../src/SoundModule/Effectors/Wah';
import { Glide } from '../../src/OscillatorModule/Glide';
import { Oscillator } from '../../src/OscillatorModule/Oscillator';
import { OscillatorModule, OscillatorModuleParams } from '../../src/OscillatorModule';

type Params = Partial<Pick<OscillatorModuleParams, 'mastervolume'>>;

describe(OscillatorNode.name, () => {
  const context = new AudioContextMock();

  // @ts-ignore
  const oscillatorModule = new OscillatorModule(context, 2048);

  oscillatorModule.setup([true, true, false, false]);

  describe(oscillatorModule.ready.name, () => {
    afterEach(() => {
      oscillatorModule.ready(0, 0);
    });

    test('should set assigned time', () => {
      const originalEGClear = oscillatorModule.module('envelopegenerator').clear;

      const egClearMock = jest.fn();

      oscillatorModule.module('envelopegenerator').clear = egClearMock;

      oscillatorModule.ready(2.5, 1.5);

      /* eslint-disable dot-notation */
      expect(oscillatorModule['startTime']).toBeCloseTo(2.5, 1);
      expect(oscillatorModule['duration']).toBeCloseTo(1.5, 1);
      /* eslint-enable dot-notation */

      expect(egClearMock).toHaveBeenCalledTimes(1);

      oscillatorModule.module('envelopegenerator').clear = originalEGClear;
    });

    test('should set default time', () => {
      const originalEGClear = oscillatorModule.module('envelopegenerator').clear;

      const egClearMock = jest.fn();

      oscillatorModule.module('envelopegenerator').clear = egClearMock;

      oscillatorModule.ready();

      /* eslint-disable dot-notation */
      expect(oscillatorModule['startTime']).toBeGreaterThan(0);
      expect(oscillatorModule['duration']).toBeCloseTo(0, 1);
      /* eslint-enable dot-notation */

      expect(egClearMock).toHaveBeenCalledTimes(1);

      oscillatorModule.module('envelopegenerator').clear = originalEGClear;
    });
  });

  describe(oscillatorModule.start.name, () => {
    test('should call `ready` and `start` methods each instance', () => {
      const originalOscillatorReady = Oscillator.prototype.ready;
      const originalOscillatorStart = Oscillator.prototype.start;
      const originalGlideReady      = oscillatorModule.module('glide').ready;
      const originalGlideStart      = oscillatorModule.module('glide').start;
      const originalEGReady         = oscillatorModule.module('envelopegenerator').ready;
      const originalEGStart         = oscillatorModule.module('envelopegenerator').start;

      const oscillatorReadyMock = jest.fn();
      const oscillatorStartMock = jest.fn();
      const glideReadyMock      = jest.fn();
      const glideStartMock      = jest.fn();
      const egReadyMock         = jest.fn();
      const egStartMock         = jest.fn();

      Oscillator.prototype.ready                         = oscillatorReadyMock;
      Oscillator.prototype.start                         = oscillatorStartMock;
      oscillatorModule.module('glide').ready             = glideReadyMock;
      oscillatorModule.module('glide').start             = glideStartMock;
      oscillatorModule.module('envelopegenerator').ready = egReadyMock;
      oscillatorModule.module('envelopegenerator').start = egStartMock;

      oscillatorModule.start([440, 880]);

      expect(oscillatorReadyMock).toHaveBeenCalledTimes(2);
      expect(oscillatorStartMock).toHaveBeenCalledTimes(2);
      expect(glideReadyMock).toHaveBeenCalledTimes(2);
      expect(glideStartMock).toHaveBeenCalledTimes(2);
      expect(egReadyMock).toHaveBeenCalledTimes(2);
      expect(egStartMock).toHaveBeenCalledTimes(1);

      Oscillator.prototype.ready                         = originalOscillatorReady;
      Oscillator.prototype.start                         = originalOscillatorStart;
      oscillatorModule.module('glide').ready             = originalGlideReady;
      oscillatorModule.module('glide').start             = originalGlideStart;
      oscillatorModule.module('envelopegenerator').ready = originalEGReady;
      oscillatorModule.module('envelopegenerator').start = originalEGStart;
    });
  });

  describe(oscillatorModule.stop.name, () => {
    test('should call `stop` method each instance', () => {
      const originalGlideStop = oscillatorModule.module('glide').stop;
      const originalEGStop    = oscillatorModule.module('envelopegenerator').stop;

      const glideStopMock = jest.fn();
      const egStopMock    = jest.fn();

      oscillatorModule.module('glide').stop             = glideStopMock;
      oscillatorModule.module('envelopegenerator').stop = egStopMock;

      oscillatorModule.stop();

      expect(glideStopMock).toHaveBeenCalledTimes(1);
      expect(egStopMock).toHaveBeenCalledTimes(1);

      oscillatorModule.module('glide').stop             = originalGlideStop;
      oscillatorModule.module('envelopegenerator').stop = originalEGStop;
    });
  });

  describe(oscillatorModule.param.name, () => {
    const defaultParams: Params = {
      mastervolume: 1
    };

    const params: Params = {
      mastervolume: 0.5
    };

    beforeAll(() => {
      oscillatorModule.param(params);
    });

    afterAll(() => {
      oscillatorModule.param(defaultParams);
    });

    test('should return `mastervolume`', () => {
      expect(oscillatorModule.param('mastervolume')).toBeCloseTo(0.5, 1);
    });
  });

  describe(oscillatorModule.get.name, () => {
    test('should return instance of `Oscillator` or array that contains instance of `Oscillator`', () => {
      oscillatorModule.setup([true, true, false, false]);

      expect(oscillatorModule.get(0)).toBeInstanceOf(Oscillator);
      expect(oscillatorModule.get(1)).toBeInstanceOf(Oscillator);
      expect(oscillatorModule.get(2)).toBeInstanceOf(Oscillator);
      expect(oscillatorModule.get(3)).toBeInstanceOf(Oscillator);

      oscillatorModule.get().forEach((oscillator: Oscillator) => {
        expect(oscillator).toBeInstanceOf(Oscillator);
      });

      oscillatorModule.setup([]);
    });
  });

  describe(oscillatorModule.length.name, () => {
    test('should return the number of `Oscillator`', () => {
      expect(oscillatorModule.length()).toBe(0);

      oscillatorModule.setup([true, true, false, false]);

      expect(oscillatorModule.length()).toBe(4);
    });
  });

  describe(oscillatorModule.module.name, () => {
    test('should return instance of `Module`', () => {
      expect(oscillatorModule.module('analyser')).toBeInstanceOf(Analyser);
      expect(oscillatorModule.module('recorder')).toBeInstanceOf(Recorder);
      expect(oscillatorModule.module('session')).toBeInstanceOf(Session);
      expect(oscillatorModule.module('autopanner')).toBeInstanceOf(Autopanner);
      expect(oscillatorModule.module('bitcrusher')).toBeInstanceOf(BitCrusher);
      expect(oscillatorModule.module('chorus')).toBeInstanceOf(Chorus);
      expect(oscillatorModule.module('compressor')).toBeInstanceOf(Compressor);
      expect(oscillatorModule.module('delay')).toBeInstanceOf(Delay);
      expect(oscillatorModule.module('envelopegenerator')).toBeInstanceOf(EnvelopeGenerator);
      expect(oscillatorModule.module('equalizer')).toBeInstanceOf(Equalizer);
      expect(oscillatorModule.module('filter')).toBeInstanceOf(Filter);
      expect(oscillatorModule.module('flanger')).toBeInstanceOf(Flanger);
      expect(oscillatorModule.module('fuzz')).toBeInstanceOf(Fuzz);
      expect(oscillatorModule.module('listener')).toBeInstanceOf(Listener);
      expect(oscillatorModule.module('noisegate')).toBeInstanceOf(NoiseGate);
      expect(oscillatorModule.module('noisesuppressor')).toBeInstanceOf(NoiseSuppressor);
      expect(oscillatorModule.module('overdrive')).toBeInstanceOf(OverDrive);
      expect(oscillatorModule.module('panner')).toBeInstanceOf(Panner);
      expect(oscillatorModule.module('phaser')).toBeInstanceOf(Phaser);
      expect(oscillatorModule.module('pitchshifter')).toBeInstanceOf(PitchShifter);
      expect(oscillatorModule.module('preamp')).toBeInstanceOf(Preamp);
      expect(oscillatorModule.module('reverb')).toBeInstanceOf(Reverb);
      expect(oscillatorModule.module('ringmodulator')).toBeInstanceOf(Ringmodulator);
      expect(oscillatorModule.module('stereo')).toBeInstanceOf(Stereo);
      expect(oscillatorModule.module('tremolo')).toBeInstanceOf(Tremolo);
      expect(oscillatorModule.module('vocalcanceler')).toBeInstanceOf(VocalCanceler);
      expect(oscillatorModule.module('wah')).toBeInstanceOf(Wah);
      expect(oscillatorModule.module('glide')).toBeInstanceOf(Glide);
    });
  });

  describe(oscillatorModule.params.name, () => {
    test('should return parameters for oscillator module as associative array', () => {
      oscillatorModule.setup([true, false]);

      /* eslint-disable dot-notation */
      expect(oscillatorModule.params()).toStrictEqual({
        mastervolume     : 1,
        autopanner       : oscillatorModule['autopanner'].params(),
        bitcrusher       : oscillatorModule['bitcrusher'].params(),
        chorus           : oscillatorModule['chorus'].params(),
        compressor       : oscillatorModule['compressor'].params(),
        delay            : oscillatorModule['delay'].params(),
        envelopegenerator: oscillatorModule['envelopegenerator'].params(),
        equalizer        : oscillatorModule['equalizer'].params(),
        filter           : oscillatorModule['filter'].params(),
        flanger          : oscillatorModule['flanger'].params(),
        fuzz             : oscillatorModule['fuzz'].params(),
        listener         : oscillatorModule['listener'].params(),
        noisegate        : oscillatorModule['noisegate'].params(),
        noisesuppressor  : oscillatorModule['noisesuppressor'].params(),
        overdrive        : oscillatorModule['overdrive'].params(),
        panner           : oscillatorModule['panner'].params(),
        phaser           : oscillatorModule['phaser'].params(),
        pitchshifter     : oscillatorModule['pitchshifter'].params(),
        preamp           : oscillatorModule['preamp'].params(),
        reverb           : oscillatorModule['reverb'].params(),
        ringmodulator    : oscillatorModule['ringmodulator'].params(),
        stereo           : oscillatorModule['stereo'].params(),
        tremolo          : oscillatorModule['tremolo'].params(),
        vocalcanceler    : oscillatorModule['vocalcanceler'].params(),
        wah              : oscillatorModule['wah'].params(),
        oscillator       : {
          glide: {
            state: true,
            type : 'linear',
            time : 0
          },
          params: [
            {
              state : true,
              type  : 'sine',
              octave: 0,
              fine  : 0,
              volume: 1
            },
            {
              state : false,
              type  : 'sine',
              octave: 0,
              fine  : 0,
              volume: 1
            }
          ]
        }
      });
    });
    /* eslint-enable dot-notation */
  });

  describe(oscillatorModule.edit.name, () => {
    test('should set edited modules and return previous modules', () => {
      // eslint-disable-next-line dot-notation
      const previousModules = oscillatorModule['modules'];

      const modules = [oscillatorModule.module('delay'), oscillatorModule.module('reverb')];

      expect(oscillatorModule.edit(modules)).toStrictEqual(previousModules);
      expect(modules[0]).toBeInstanceOf(Delay);
      expect(modules[1]).toBeInstanceOf(Reverb);
    });
  });
});
