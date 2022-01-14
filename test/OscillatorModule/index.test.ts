import { AudioContextMock } from '../../mocks/AudioContextMock';
import { Oscillator } from '../../src/OscillatorModule/Oscillator';
import { OscillatorModule, OscillatorModuleParams } from '../../src/OscillatorModule';

type Params = Partial<Pick<OscillatorModuleParams, 'mastervolume'>>;

describe(OscillatorNode.name, () => {
  const context = new AudioContextMock();

  // @ts-ignore
  const oscillatorModule = new OscillatorModule(context, 2048);

  describe(oscillatorModule.ready.name, () => {
  });

  describe(oscillatorModule.start.name, () => {
  });

  describe(oscillatorModule.stop.name, () => {
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

  describe(oscillatorModule.params.name, () => {
    test('should return parameters for oscillator module as associative array', () => {
      oscillatorModule.setup([true, false]);

      /* eslint-disable dot-notation */
      expect(oscillatorModule.params()).toStrictEqual({
        mastervolume     : 1,
        stereo           : oscillatorModule['stereo'].params(),
        compressor       : oscillatorModule['compressor'].params(),
        distortion       : oscillatorModule['distortion'].params(),
        wah              : oscillatorModule['wah'].params(),
        pitchshifter     : oscillatorModule['pitchshifter'].params(),
        equalizer        : oscillatorModule['equalizer'].params(),
        filter           : oscillatorModule['filter'].params(),
        autopanner       : oscillatorModule['autopanner'].params(),
        tremolo          : oscillatorModule['tremolo'].params(),
        ringmodulator    : oscillatorModule['ringmodulator'].params(),
        phaser           : oscillatorModule['phaser'].params(),
        flanger          : oscillatorModule['flanger'].params(),
        chorus           : oscillatorModule['chorus'].params(),
        delay            : oscillatorModule['delay'].params(),
        reverb           : oscillatorModule['reverb'].params(),
        panner           : oscillatorModule['panner'].params(),
        listener         : oscillatorModule['listener'].params(),
        envelopegenerator: oscillatorModule['envelopegenerator'].params(),
        oscillator: {
          glide: {
            type: 'linear',
            time: 0
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
});
