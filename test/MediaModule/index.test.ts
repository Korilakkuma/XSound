import { AudioContextMock } from '../../mocks/AudioContextMock';
import { EnvelopeGenerator } from '../../src/SoundModule/Effectors/EnvelopeGenerator';
import { MediaModule, MediaModuleParams } from '../../src/MediaModule';

type Params = Partial<Pick<MediaModuleParams, 'mastervolume' | 'autoplay' | 'playbackRate' | 'currentTime' | 'controls' | 'loop' | 'muted' | 'duration'>>;

/**
 * Coverage is low because of Autoplay policy on Jest
 */
describe(MediaModule.name, () => {
  const originalMediaElementPlay = HTMLMediaElement.prototype.play;
  const mediaElementPlayMock     = jest.fn();

  HTMLMediaElement.prototype.play = mediaElementPlayMock;

  afterAll(() => {
    HTMLMediaElement.prototype.play = originalMediaElementPlay;
  });

  const context = new AudioContextMock();

  // @ts-ignore
  const mediaModule = new MediaModule(context, 2048);

  const audioElement = document.createElement('audio');

  audioElement.src = './sample.mp3';

  const loadStartListener = jest.fn();
  const endedListener     = jest.fn();

  mediaModule.setup({
    media    : audioElement,
    formats  : [],
    autoplay : false,
    listeners: {
      loadstart: loadStartListener,
      ended    : endedListener
    }
  });

  describe(mediaModule.setup.name, () => {
    test('should set up envelope generator', () => {
      /* eslint-disable dot-notation */
      expect(mediaModule['envelopegenerator'].getGenerator(0)).toBeInstanceOf(GainNode);
      expect(mediaModule['envelopegenerator'].param('attack')).toBe(0);
      expect(mediaModule['envelopegenerator'].param('decay')).toBeCloseTo(0.01, 2);
      expect(mediaModule['envelopegenerator'].param('sustain')).toBe(1);
      expect(mediaModule['envelopegenerator'].param('release')).toBeCloseTo(0.01, 2);
      /* eslint-enable dot-notation */
    });
  });

  describe(mediaModule.ready.name, () => {
    describe('use normal playback', () => {
      test('should return Data URL', () => {
        mediaModule.ready('data:audio/mpeg;base64,AAA');

        // eslint-disable-next-line dot-notation
        expect(mediaModule['media']?.src).toBe('data:audio/mpeg;base64,AAA');
      });

      test('should return resource URL', () => {
        mediaModule.ready('sample.mp3');

        // eslint-disable-next-line dot-notation
        expect(mediaModule['media']?.src).toBe(`${location.href}sample.mp3`);
      });
    });

    describe('use audio streaming', () => {
      // TODO:
    });
  });

  describe(mediaModule.start.name, () => {
    xtest('should call `play` method', () => {
      const originalPlay = audioElement.play;

      const audioPlayMock = jest.fn();

      audioElement.play = audioPlayMock;

      mediaModule.start();

      expect(audioPlayMock).toHaveBeenCalledTimes(1);

      audioElement.play = originalPlay;
    });
  });

  describe(mediaModule.stop.name, () => {
    xtest('should call `pause` method', () => {
      const originalPlay  = audioElement.play;
      const originalPause = audioElement.pause;

      const audioPlayMock  = jest.fn();
      const audioPauseMock = jest.fn();

      audioElement.play  = audioPlayMock;
      audioElement.pause = audioPauseMock;

      mediaModule.stop();

      expect(audioPlayMock).toHaveBeenCalledTimes(1);
      expect(audioPauseMock).toHaveBeenCalledTimes(1);

      audioElement.play  = originalPlay;
      audioElement.pause = originalPause;
    });
  });

  describe(mediaModule.param.name, () => {
    const defaultParams: Params = {
      mastervolume: 1,
      playbackRate: 1,
      currentTime : 0,
      controls    : false,
      loop        : false,
      muted       : false
    };

    const params: Params = {
      mastervolume: 0.5,
      playbackRate: 1.5,
      currentTime : 60,
      controls    : true,
      loop        : true,
      muted       : true
    };

    beforeAll(() => {
      mediaModule.param(params);
    });

    afterAll(() => {
      mediaModule.param(defaultParams);
    });

    test('should return `mastervolume`', () => {
      expect(mediaModule.param('mastervolume')).toBeCloseTo(0.5, 1);
    });

    test('should return `autoplay`', () => {
      expect(mediaModule.param('autoplay')).toBe(false);
    });

    test('should return `playbackRate`', () => {
      expect(mediaModule.param('playbackRate')).toBeCloseTo(1.5, 1);
    });

    test('should return `currentTime`', () => {
      expect(mediaModule.param('currentTime')).toBe(60);
    });

    test('should return `controls`', () => {
      expect(mediaModule.param('controls')).toBe(true);
    });

    test('should return `loop`', () => {
      expect(mediaModule.param('loop')).toBe(true);
    });

    test('should return `muted`', () => {
      expect(mediaModule.param('muted')).toBe(true);
    });

    test('should return `duration`', () => {
      expect(mediaModule.param('duration')).toBe(0);
    });
  });

  describe(mediaModule.get.name, () => {
    test('should return `null`', () => {
      expect(mediaModule.get()).toBe(null);
    });
  });

  describe(mediaModule.hasMedia.name, () => {
    test('should return `true`', () => {
      expect(mediaModule.hasMedia()).toBe(true);
    });
  });

  describe(mediaModule.hasSource.name, () => {
    test('should return `false`', () => {
      expect(mediaModule.hasSource()).toBe(false);
    });
  });

  describe(mediaModule.paused.name, () => {
    test('should return `true`', () => {
      expect(mediaModule.paused()).toBe(true);
    });
  });

  describe(mediaModule.fadeIn.name, () => {
    test('should return fade-in time', () => {
      expect(mediaModule.fadeIn()).toBe(0);
    });

    test('should call envelope generator methods', () => {
      const originalEGStart = EnvelopeGenerator.prototype.start;
      const originalEGStop  = EnvelopeGenerator.prototype.stop;

      const egStartMock = jest.fn();
      const egStopMock  = jest.fn();

      EnvelopeGenerator.prototype.start = egStartMock;
      EnvelopeGenerator.prototype.stop  = egStopMock;

      mediaModule.fadeIn(5);

      expect(egStartMock).toHaveBeenCalledTimes(1);
      expect(egStopMock).toHaveBeenCalledTimes(1);

      EnvelopeGenerator.prototype.start = originalEGStart;
      EnvelopeGenerator.prototype.stop  = originalEGStop;
    });
  });

  describe(mediaModule.fadeOut.name, () => {
    test('should return fade-out time', () => {
      expect(mediaModule.fadeOut()).toBeCloseTo(0.01, 3);
    });

    test('should call envelope generator methods', () => {
      const originalEGStart = EnvelopeGenerator.prototype.start;
      const originalEGStop  = EnvelopeGenerator.prototype.stop;

      const egStartMock = jest.fn();
      const egStopMock  = jest.fn();

      EnvelopeGenerator.prototype.start = egStartMock;
      EnvelopeGenerator.prototype.stop  = egStopMock;

      mediaModule.fadeOut(5);

      expect(egStartMock).toHaveBeenCalledTimes(1);
      expect(egStopMock).toHaveBeenCalledTimes(1);

      EnvelopeGenerator.prototype.start = originalEGStart;
      EnvelopeGenerator.prototype.stop  = originalEGStop;
    });
  });

  describe(mediaModule.params.name, () => {
    test('should return parameters for media module as associative array', () => {
      /* eslint-disable dot-notation */
      expect(mediaModule.params()).toStrictEqual({
        mastervolume     : 1,
        autoplay         : false,
        playbackRate     : 1,
        currentTime      : 0,
        controls         : false,
        loop             : false,
        muted            : false,
        duration         : 0,
        vocalcanceler    : mediaModule['vocalcanceler'].params(),
        stereo           : mediaModule['stereo'].params(),
        compressor       : mediaModule['compressor'].params(),
        distortion       : mediaModule['distortion'].params(),
        wah              : mediaModule['wah'].params(),
        pitchshifter     : mediaModule['pitchshifter'].params(),
        equalizer        : mediaModule['equalizer'].params(),
        filter           : mediaModule['filter'].params(),
        autopanner       : mediaModule['autopanner'].params(),
        tremolo          : mediaModule['tremolo'].params(),
        ringmodulator    : mediaModule['ringmodulator'].params(),
        phaser           : mediaModule['phaser'].params(),
        flanger          : mediaModule['flanger'].params(),
        chorus           : mediaModule['chorus'].params(),
        delay            : mediaModule['delay'].params(),
        reverb           : mediaModule['reverb'].params(),
        panner           : mediaModule['panner'].params(),
        listener         : mediaModule['listener'].params(),
        envelopegenerator: mediaModule['envelopegenerator'].params()
      });
      /* eslint-enable dot-notation */
    });
  });
});
