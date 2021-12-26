import { AudioContextMock } from '../../mocks/AudioContextMock';
import { AudioBufferMock } from '../../mocks/AudioBufferMock';
import { OneshotModule, OneshotModuleParam, OneshotSettings } from '../../src/OneshotModule';

describe(OneshotModule.name, () => {
  const context = new AudioContextMock();

  // @ts-ignore
  const oneshotModule = new OneshotModule(context, 2048);

  describe(oneshotModule.setup.name, () => {
    const resources = ['./piano.mp3,', './guitar.mp3', './strings.mp3'];
    const settings: OneshotSettings = [
      {
        bufferIndex: 0
      },
      {
        bufferIndex: 1
      },
      {
        bufferIndex: 2
      }
    ];

    // eslint-disable-next-line dot-notation
    const originalLoad = oneshotModule['load'];

    const loadMock = jest.fn();

    // eslint-disable-next-line dot-notation
    oneshotModule['load'] = loadMock;

    oneshotModule.setup({ resources, settings });

    expect(loadMock).toHaveBeenCalledTimes(3);

    // eslint-disable-next-line dot-notation
    oneshotModule['load'] = originalLoad;
  });

  describe(oneshotModule.ready.name, () => {
    // eslint-disable-next-line dot-notation
    const originalLoad = oneshotModule['load'];
    const loadMock = jest.fn();

    // eslint-disable-next-line dot-notation
    oneshotModule['load'] = loadMock;

    // eslint-disable-next-line dot-notation
    const originalEGClear = oneshotModule['envelopegenerator'].clear;

    const egClearMock = jest.fn();

    // eslint-disable-next-line dot-notation
    oneshotModule['envelopegenerator'].clear = egClearMock;

    oneshotModule.ready(5, 10);

    expect(egClearMock).toHaveBeenCalledTimes(1);

    // eslint-disable-next-line dot-notation
    oneshotModule['envelopegenerator'].clear = originalEGClear;

    // eslint-disable-next-line dot-notation
    oneshotModule['load'] = originalLoad;
  });

  describe(oneshotModule.start.name, () => {
    // TODO:
  });

  describe(oneshotModule.stop.name, () => {
    // eslint-disable-next-line dot-notation
    const originalLoad = oneshotModule['load'];
    const loadMock = jest.fn();

    // eslint-disable-next-line dot-notation
    oneshotModule['load'] = loadMock;

    const resources = ['./piano.mp3,', './guitar.mp3', './strings.mp3'];
    const settings: OneshotSettings = [
      {
        bufferIndex: 0
      },
      {
        bufferIndex: 1
      },
      {
        bufferIndex: 2
      }
    ];

    /* eslint-disable dot-notation */
    const originalEGStop     = oneshotModule['envelopegenerator'].stop;
    const originalFilterStop = oneshotModule['filter'].stop;
    /* eslint-enable dot-notation */

    const egStopMock     = jest.fn();
    const filterStopMock = jest.fn();

    /* eslint-disable dot-notation */
    oneshotModule['envelopegenerator'].stop = egStopMock;
    oneshotModule['filter'].stop            = filterStopMock;
    /* eslint-enable dot-notation */

    oneshotModule.setup({ resources, settings });
    oneshotModule.stop(1);

    expect(egStopMock).toHaveBeenCalledTimes(1);
    expect(filterStopMock).toHaveBeenCalledTimes(1);

    /* eslint-disable dot-notation */
    oneshotModule['envelopegenerator'].stop = originalEGStop;
    oneshotModule['filter'].stop            = originalFilterStop;
    /* eslint-enable dot-notation */

    // eslint-disable-next-line dot-notation
    oneshotModule['load'] = originalLoad;
  });

  describe(oneshotModule.param.name, () => {
    const defaultParams: OneshotModuleParam = {
      mastervolume: 1,
      transpose   : 1
    };

    const params: OneshotModuleParam = {
      mastervolume: 0.5,
      transpose   : 0.5
    };

    beforeAll(() => {
      oneshotModule.param(params);
    });

    afterAll(() => {
      oneshotModule.param(defaultParams);
    });

    test('should returm `mastervolume`', () => {
      expect(oneshotModule.param('mastervolume')).toBeCloseTo(0.5, 1);
    });

    test('should returm `transpose`', () => {
      expect(oneshotModule.param('transpose')).toBeCloseTo(0.5, 1);
    });
  });

  describe(oneshotModule.get.name, () => {
    test('should return `OneshotSetting`', () => {
      // @ts-ignore
      // eslint-disable-next-line dot-notation
      oneshotModule['buffers'] = [new AudioBufferMock(), new AudioBufferMock()];

      expect(oneshotModule.get(0)).toBeInstanceOf(AudioBufferMock);
      expect(oneshotModule.get(1)).toBeInstanceOf(AudioBufferMock);
      expect(oneshotModule.get(2)).toBe(null);
    });
  });

  describe(oneshotModule.reset.name, () => {
    // eslint-disable-next-line dot-notation
    const originalLoad = oneshotModule['load'];
    const loadMock = jest.fn();

    // eslint-disable-next-line dot-notation
    oneshotModule['load'] = loadMock;
    const resources = ['./piano.mp3,', './guitar.mp3', './strings.mp3'];
    const settings: OneshotSettings = [
      {
        bufferIndex: 0
      },
      {
        bufferIndex: 1
      },
      {
        bufferIndex: 2
      }
    ];

    oneshotModule.setup({ resources, settings });

    oneshotModule.reset(1, { bufferIndex: 3, playbackRate: 0.5 });

    // eslint-disable-next-line dot-notation
    expect(oneshotModule['settings']).toStrictEqual([
      {
        bufferIndex: 0
      },
      {
        bufferIndex : 3,
        playbackRate: 0.5
      },
      {
        bufferIndex: 2
      }
    ]);

    // eslint-disable-next-line dot-notation
    oneshotModule['load'] = originalLoad;
  });

  describe(oneshotModule.params.name, () => {
    test('should return parameters for one-shot module as associative array', () => {
      /* eslint-disable dot-notation */
      expect(oneshotModule.params()).toStrictEqual({
        mastervolume     : 1,
        transpose        : 1,
        stereo           : oneshotModule['stereo'].params(),
        compressor       : oneshotModule['compressor'].params(),
        distortion       : oneshotModule['distortion'].params(),
        wah              : oneshotModule['wah'].params(),
        pitchshifter     : oneshotModule['pitchshifter'].params(),
        equalizer        : oneshotModule['equalizer'].params(),
        filter           : oneshotModule['filter'].params(),
        autopanner       : oneshotModule['autopanner'].params(),
        tremolo          : oneshotModule['tremolo'].params(),
        ringmodulator    : oneshotModule['ringmodulator'].params(),
        phaser           : oneshotModule['phaser'].params(),
        flanger          : oneshotModule['flanger'].params(),
        chorus           : oneshotModule['chorus'].params(),
        delay            : oneshotModule['delay'].params(),
        reverb           : oneshotModule['reverb'].params(),
        panner           : oneshotModule['panner'].params(),
        listener         : oneshotModule['listener'].params(),
        envelopegenerator: oneshotModule['envelopegenerator'].params()
      });
      /* eslint-enable dot-notation */
    });
  });
});