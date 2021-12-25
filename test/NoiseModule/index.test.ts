import { AudioContextMock } from '../../mocks/AudioContextMock';
import { NoiseModule, NoiseModuleParam } from '../../src/NoiseModule';

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
    const defaultParams: NoiseModuleParam = {
      mastervolume: 1,
      type        : 'whitenoise'
    };

    const params: NoiseModuleParam = {
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

  describe(noiseModule.params.name, () => {
    test('should return parameters for noise module as associative array', () => {
      /* eslint-disable dot-notation */
      expect(noiseModule.params()).toStrictEqual({
        mastervolume     : 1,
        type             : 'whitenoise',
        stereo           : noiseModule['stereo'].params(),
        compressor       : noiseModule['compressor'].params(),
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
        envelopegenerator: noiseModule['envelopegenerator'].params()
      });
      /* eslint-enable dot-notation */
    });
  });
});
