import { AudioContextMock } from '../../mock/AudioContextMock';
import { AudioBufferMock } from '../../mock/AudioBufferMock';
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
import { AudioModule, AudioModuleParams } from '../../src/AudioModule';

type Params = Partial<Pick<AudioModuleParams, 'mastervolume' | 'playbackRate' | 'detune' | 'loop' | 'currentTime' | 'duration' | 'sampleRate' | 'numberOfChannels'>>;

describe(AudioModule.name, () => {
  const context = new AudioContextMock();

  // @ts-ignore
  const audioModule = new AudioModule(context, 2048);

  describe(audioModule.setup.name, () => {
    test('should set up envelope generator', () => {
      audioModule.setup();

      /* eslint-disable dot-notation */
      expect(audioModule['envelopegenerator'].getGenerator(0)).toBeInstanceOf(GainNode);
      expect(audioModule['envelopegenerator'].param('attack')).toBeCloseTo(0, 2);
      expect(audioModule['envelopegenerator'].param('decay')).toBeCloseTo(0.01, 2);
      expect(audioModule['envelopegenerator'].param('sustain')).toBeCloseTo(1, 2);
      expect(audioModule['envelopegenerator'].param('release')).toBeCloseTo(0.01, 2);
      /* eslint-enable dot-notation */
    });
  });

  describe(audioModule.ready.name, () => {
    test('should call `deocdeAudioData` method', () => {
      const originalDecodeAudioData = context.decodeAudioData;

      const decodeAudioDataMock = jest.fn();

      context.decodeAudioData = decodeAudioDataMock;

      audioModule.ready(new ArrayBuffer(16384));

      expect(decodeAudioDataMock).toHaveBeenCalledTimes(1);

      context.decodeAudioData = originalDecodeAudioData;
    });
  });

  describe(audioModule.start.name, () => {
    test('should call methods for starting audio', () => {
      /* eslint-disable dot-notation */
      const originalConnect       = audioModule['connect'];
      const originalAnalyserStart = audioModule['analyser'].start;
      /* eslint-enable dot-notation */

      const connectMock       = jest.fn();
      const analyserStartMock = jest.fn();

      /* eslint-disable dot-notation */
      audioModule['connect']        = connectMock;
      audioModule['analyser'].start = analyserStartMock;

      // @ts-ignore
      audioModule['buffer']  = new AudioBufferMock(new Float32Array([1, 0, 1]));
      audioModule['stopped'] = true;
      /* eslint-enable dot-notation */

      audioModule.start();

      expect(connectMock).toHaveBeenCalledTimes(1);
      expect(analyserStartMock).toHaveBeenCalledTimes(2);

      /* eslint-disable dot-notation */
      audioModule['connect']        = originalConnect;
      audioModule['analyser'].start = originalAnalyserStart;

      // @ts-ignore
      audioModule['buffer']  = null;
      audioModule['stopped'] = true;
      /* eslint-enable dot-notation */
    });
  });

  describe(audioModule.stop.name, () => {
    test('should call methods for stopping audio', () => {
      /* eslint-disable dot-notation */
      const originalSourceStop   = audioModule['source'].stop;
      const originalAnalyserStop = audioModule['analyser'].stop;
      /* eslint-enable dot-notation */

      const sourceStopMock          = jest.fn();
      const analyserStopMock        = jest.fn();

      /* eslint-disable dot-notation */
      audioModule['source'].stop   = sourceStopMock;
      audioModule['analyser'].stop = analyserStopMock;

      // @ts-ignore
      audioModule['buffer']  = new AudioBufferMock(new Float32Array([1, 0, 1]));
      audioModule['stopped'] = false;
      /* eslint-enable dot-notation */

      audioModule.stop();

      expect(sourceStopMock).toHaveBeenCalledTimes(1);
      expect(analyserStopMock).toHaveBeenCalledTimes(2);

      /* eslint-disable dot-notation */
      audioModule['source'].stop   = originalSourceStop;
      audioModule['analyser'].stop = originalAnalyserStop;

      // @ts-ignore
      audioModule['buffer']  = null;
      audioModule['stopped'] = true;
      /* eslint-enable dot-notation */
    });
  });

  describe(audioModule.param.name, () => {
    const defaultParams: Params = {
      mastervolume: 1,
      playbackRate: 1,
      detune      : 0,
      loop        : false,
      currentTime : 0
    };

    const params: Params = {
      mastervolume: 0.5,
      playbackRate: 1.5,
      detune      : -600,
      loop        : true,
      currentTime : 48000
    };

    beforeAll(() => {
      audioModule.param(params);
    });

    afterAll(() => {
      audioModule.param(defaultParams);
    });

    test('should return `mastervolume`', () => {
      expect(audioModule.param('mastervolume')).toBeCloseTo(0.5, 1);
    });

    test('should return `playbackRate`', () => {
      expect(audioModule.param('playbackRate')).toBeCloseTo(1.5, 1);
    });

    test('should return `detune`', () => {
      expect(audioModule.param('detune')).toBeCloseTo(-600, 1);
    });

    test('should return `loop`', () => {
      expect(audioModule.param('loop')).toBe(true);
    });

    test('should return `currentTime`', () => {
      expect(audioModule.param('currentTime')).toBeCloseTo(48000, 1);
    });
  });

  describe(audioModule.get.name, () => {
    test('should return instance of `AudioBufferSourceNode`', () => {
      expect(audioModule.get()).toBeInstanceOf(AudioBufferSourceNode);
    });
  });

  describe(audioModule.end.name, () => {
    const originalStop = audioModule.stop;

    const stopCallbackMock  = jest.fn();
    const endedCallbackMock = jest.fn();

    audioModule.stop = stopCallbackMock;
    audioModule.setup({ endedCallback: endedCallbackMock });

    audioModule.end();

    /* eslint-disable dot-notation */
    expect(audioModule['currentTime']).toBe(0);
    expect(stopCallbackMock).toHaveBeenCalledTimes(1);
    expect(endedCallbackMock).toHaveBeenCalledTimes(1);
    /* eslint-enable dot-notation */

    audioModule.stop = originalStop;
    audioModule.setup();
  });

  describe(audioModule.has.name, () => {
    test('should return `true` if `AudioBuffer` exists', () => {
      expect(audioModule.has()).toBe(false);

      // @ts-ignore
      // eslint-disable-next-line dot-notation
      audioModule['buffer'] = new AudioBufferMock();

      expect(audioModule.has()).toBe(true);
    });
  });

  describe(audioModule.paused.name, () => {
    test('should return `true` if audio is paused', () => {
      expect(audioModule.paused()).toBe(true);

      // eslint-disable-next-line dot-notation
      audioModule['stopped'] = false;

      expect(audioModule.paused()).toBe(false);
    });
  });

  describe(audioModule.fadeIn.name, () => {
    test('should return fade-in time', () => {
      audioModule.setup();

      expect(audioModule.fadeIn()).toBeCloseTo(0, 2);
    });

    test('should call envelope generator methods', () => {
      const originalEGStart = EnvelopeGenerator.prototype.start;
      const originalEGStop  = EnvelopeGenerator.prototype.stop;

      const egStartMock = jest.fn();
      const egStopMock  = jest.fn();

      EnvelopeGenerator.prototype.start = egStartMock;
      EnvelopeGenerator.prototype.stop  = egStopMock;

      audioModule.fadeIn(5);

      expect(egStartMock).toHaveBeenCalledTimes(1);
      expect(egStopMock).toHaveBeenCalledTimes(1);

      EnvelopeGenerator.prototype.start = originalEGStart;
      EnvelopeGenerator.prototype.stop  = originalEGStop;
    });
  });

  describe(audioModule.fadeOut.name, () => {
    test('should return fade-out time', () => {
      audioModule.setup();

      expect(audioModule.fadeOut()).toBeCloseTo(0.01, 2);
    });

    test('should call envelope generator methods', () => {
      const originalEGStart = EnvelopeGenerator.prototype.start;
      const originalEGStop  = EnvelopeGenerator.prototype.stop;

      const egStartMock = jest.fn();
      const egStopMock  = jest.fn();

      EnvelopeGenerator.prototype.start = egStartMock;
      EnvelopeGenerator.prototype.stop  = egStopMock;

      audioModule.fadeOut(5);

      expect(egStartMock).toHaveBeenCalledTimes(1);
      expect(egStopMock).toHaveBeenCalledTimes(1);

      EnvelopeGenerator.prototype.start = originalEGStart;
      EnvelopeGenerator.prototype.stop  = originalEGStop;
    });
  });

  describe(audioModule.slice.name, () => {
    test('should return sliced `AudioBuffer`', () => {
      // @ts-ignore
      // eslint-disable-next-line dot-notation
      audioModule['buffer'] = new AudioBufferMock();

      expect(audioModule.slice(5, 10)?.length).toBe(220500);
      expect(audioModule.slice(5, 7)?.length).toBe(88200);

      // eslint-disable-next-line dot-notation
      audioModule['buffer'] = null;
    });
  });

  describe(audioModule.sprite.name, () => {
    test('should return `AudioBufferSprite`', () => {
      // @ts-ignore
      // eslint-disable-next-line dot-notation
      audioModule['buffer'] = new AudioBufferMock();

      const audiobufferSprite = audioModule.sprite({ sprite1: [5, 10], sprite2: [5, 7] });

      expect(audiobufferSprite?.sprite1.length).toBe(220500);
      expect(audiobufferSprite?.sprite2.length).toBe(88200);

      // eslint-disable-next-line dot-notation
      audioModule['buffer'] = null;
    });
  });

  describe(audioModule.module.name, () => {
    test('should return instance of `Module`', () => {
      expect(audioModule.module('analyser')).toBeInstanceOf(Analyser);
      expect(audioModule.module('recorder')).toBeInstanceOf(Recorder);
      expect(audioModule.module('session')).toBeInstanceOf(Session);
      expect(audioModule.module('autopanner')).toBeInstanceOf(Autopanner);
      expect(audioModule.module('bitcrusher')).toBeInstanceOf(BitCrusher);
      expect(audioModule.module('chorus')).toBeInstanceOf(Chorus);
      expect(audioModule.module('compressor')).toBeInstanceOf(Compressor);
      expect(audioModule.module('delay')).toBeInstanceOf(Delay);
      expect(audioModule.module('envelopegenerator')).toBeInstanceOf(EnvelopeGenerator);
      expect(audioModule.module('equalizer')).toBeInstanceOf(Equalizer);
      expect(audioModule.module('filter')).toBeInstanceOf(Filter);
      expect(audioModule.module('flanger')).toBeInstanceOf(Flanger);
      expect(audioModule.module('fuzz')).toBeInstanceOf(Fuzz);
      expect(audioModule.module('listener')).toBeInstanceOf(Listener);
      expect(audioModule.module('noisegate')).toBeInstanceOf(NoiseGate);
      expect(audioModule.module('noisesuppressor')).toBeInstanceOf(NoiseSuppressor);
      expect(audioModule.module('overdrive')).toBeInstanceOf(OverDrive);
      expect(audioModule.module('panner')).toBeInstanceOf(Panner);
      expect(audioModule.module('phaser')).toBeInstanceOf(Phaser);
      expect(audioModule.module('pitchshifter')).toBeInstanceOf(PitchShifter);
      expect(audioModule.module('preamp')).toBeInstanceOf(Preamp);
      expect(audioModule.module('reverb')).toBeInstanceOf(Reverb);
      expect(audioModule.module('ringmodulator')).toBeInstanceOf(Ringmodulator);
      expect(audioModule.module('stereo')).toBeInstanceOf(Stereo);
      expect(audioModule.module('tremolo')).toBeInstanceOf(Tremolo);
      expect(audioModule.module('vocalcanceler')).toBeInstanceOf(VocalCanceler);
      expect(audioModule.module('wah')).toBeInstanceOf(Wah);
    });
  });

  describe(audioModule.params.name, () => {
    test('should return parameters for audio module as associative array', () => {
      /* eslint-disable dot-notation */
      expect(audioModule.params()).toStrictEqual({
        mastervolume     : 1,
        playbackRate     : 1,
        detune           : 0,
        loop             : false,
        currentTime      : 0,
        duration         : 0,
        sampleRate       : 44100,
        numberOfChannels : 0,
        autopanner       : audioModule['autopanner'].params(),
        bitcrusher       : audioModule['bitcrusher'].params(),
        chorus           : audioModule['chorus'].params(),
        compressor       : audioModule['compressor'].params(),
        delay            : audioModule['delay'].params(),
        envelopegenerator: audioModule['envelopegenerator'].params(),
        equalizer        : audioModule['equalizer'].params(),
        filter           : audioModule['filter'].params(),
        flanger          : audioModule['flanger'].params(),
        fuzz             : audioModule['fuzz'].params(),
        listener         : audioModule['listener'].params(),
        noisegate        : audioModule['noisegate'].params(),
        noisesuppressor  : audioModule['noisesuppressor'].params(),
        overdrive        : audioModule['overdrive'].params(),
        panner           : audioModule['panner'].params(),
        phaser           : audioModule['phaser'].params(),
        pitchshifter     : audioModule['pitchshifter'].params(),
        preamp           : audioModule['preamp'].params(),
        reverb           : audioModule['reverb'].params(),
        ringmodulator    : audioModule['ringmodulator'].params(),
        stereo           : audioModule['stereo'].params(),
        tremolo          : audioModule['tremolo'].params(),
        vocalcanceler    : audioModule['vocalcanceler'].params(),
        wah              : audioModule['wah'].params()
      });
      /* eslint-enable dot-notation */
    });
  });

  describe(audioModule.edit.name, () => {
    test('should set edited modules and return previous modules', () => {
      // eslint-disable-next-line dot-notation
      const previousModules = audioModule['modules'];

      const modules = [audioModule.module('delay'), audioModule.module('reverb')];

      expect(audioModule.edit(modules)).toStrictEqual(previousModules);
      expect(modules[0]).toBeInstanceOf(Delay);
      expect(modules[1]).toBeInstanceOf(Reverb);
    });
  });
});
