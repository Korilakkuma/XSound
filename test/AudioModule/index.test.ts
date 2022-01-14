import { AudioContextMock } from '../../mocks/AudioContextMock';
import { AudioBufferMock } from '../../mocks/AudioBufferMock';
import { EnvelopeGenerator } from '../../src/SoundModule/Effectors/EnvelopeGenerator';
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
      expect(audioModule['envelopegenerator'].param('attack')).toBe(0);
      expect(audioModule['envelopegenerator'].param('decay')).toBeCloseTo(0.01, 2);
      expect(audioModule['envelopegenerator'].param('sustain')).toBe(1);
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
      const originalProcessor    = audioModule['processor'];
      /* eslint-enable dot-notation */

      const sourceStopMock          = jest.fn();
      const analyserStopMock        = jest.fn();
      const processorDisconnectMock = jest.fn();

      /* eslint-disable dot-notation */
      audioModule['source'].stop          = sourceStopMock;
      audioModule['analyser'].stop        = analyserStopMock;
      audioModule['processor'].disconnect = processorDisconnectMock;

      // @ts-ignore
      audioModule['buffer']  = new AudioBufferMock(new Float32Array([1, 0, 1]));
      audioModule['stopped'] = false;
      /* eslint-enable dot-notation */

      audioModule.stop();

      expect(sourceStopMock).toHaveBeenCalledTimes(1);
      expect(analyserStopMock).toHaveBeenCalledTimes(2);
      expect(processorDisconnectMock).toHaveBeenCalledTimes(1);

      /* eslint-disable dot-notation */
      audioModule['source'].stop   = originalSourceStop;
      audioModule['analyser'].stop = originalAnalyserStop;
      audioModule['processor']     = originalProcessor;

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
      expect(audioModule.param('detune')).toBe(-600);
    });

    test('should return `loop`', () => {
      expect(audioModule.param('loop')).toBe(true);
    });

    test('should return `currentTime`', () => {
      expect(audioModule.param('currentTime')).toBe(48000);
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

      expect(audioModule.fadeIn()).toBe(0);
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

      expect(audioModule.fadeOut()).toBeCloseTo(0.01, 3);
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
        vocalcanceler    : audioModule['vocalcanceler'].params(),
        stereo           : audioModule['stereo'].params(),
        compressor       : audioModule['compressor'].params(),
        distortion       : audioModule['distortion'].params(),
        wah              : audioModule['wah'].params(),
        pitchshifter     : audioModule['pitchshifter'].params(),
        equalizer        : audioModule['equalizer'].params(),
        filter           : audioModule['filter'].params(),
        autopanner       : audioModule['autopanner'].params(),
        tremolo          : audioModule['tremolo'].params(),
        ringmodulator    : audioModule['ringmodulator'].params(),
        phaser           : audioModule['phaser'].params(),
        flanger          : audioModule['flanger'].params(),
        chorus           : audioModule['chorus'].params(),
        delay            : audioModule['delay'].params(),
        reverb           : audioModule['reverb'].params(),
        panner           : audioModule['panner'].params(),
        listener         : audioModule['listener'].params(),
        envelopegenerator: audioModule['envelopegenerator'].params()
      });
      /* eslint-enable dot-notation */
    });
  });
});
