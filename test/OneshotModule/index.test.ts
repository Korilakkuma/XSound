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
import { OneshotModule, OneshotModuleParams, OneshotSettings } from '../../src/OneshotModule';

type Params = Partial<Pick<OneshotModuleParams, 'mastervolume' | 'transpose'>>;

describe(OneshotModule.name, () => {
  const context = new AudioContextMock();

  // @ts-ignore
  const oneshotModule = new OneshotModule(context, 2048);

  const resources = ['./piano.wav', './guitar.wav', './strings.wav'];
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

  beforeAll(() => {
    // eslint-disable-next-line dot-notation
    oneshotModule['buffers'] = [
      // @ts-ignore
      new AudioBufferMock(new Float32Array([1, 0, 1]), new Float32Array([-1, 0, -1])),
      // @ts-ignore
      new AudioBufferMock(new Float32Array([1, 0, 1]), new Float32Array([-1, 0, -1])),
      // @ts-ignore
      new AudioBufferMock(new Float32Array([1, 0, 1]), new Float32Array([-1, 0, 1]))
    ];
  });

  describe(oneshotModule.setup.name, () => {
    test('should call `load` for getting resources', () => {
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
  });

  describe(oneshotModule.ready.name, () => {
    afterEach(() => {
      oneshotModule.ready(0, 0);
    });

    test('should set assigned time', () => {
      const originalEGClear = oneshotModule.module('envelopegenerator').clear;

      const egClearMock = jest.fn();

      oneshotModule.module('envelopegenerator').clear = egClearMock;

      oneshotModule.ready(2.5, 1.5);

      /* eslint-disable dot-notation */
      expect(oneshotModule['startTime']).toBeCloseTo(2.5, 1);
      expect(oneshotModule['duration']).toBeCloseTo(1.5, 1);
      /* eslint-enable dot-notation */

      expect(egClearMock).toHaveBeenCalledTimes(1);

      oneshotModule.module('envelopegenerator').clear = originalEGClear;
    });

    test('should set default time', () => {
      const originalEGClear = oneshotModule.module('envelopegenerator').clear;

      const egClearMock = jest.fn();

      oneshotModule.module('envelopegenerator').clear = egClearMock;

      oneshotModule.ready();

      /* eslint-disable dot-notation */
      expect(oneshotModule['startTime']).toBeGreaterThan(0);
      expect(oneshotModule['duration']).toBeCloseTo(0, 1);
      /* eslint-enable dot-notation */

      expect(egClearMock).toHaveBeenCalledTimes(1);

      oneshotModule.module('envelopegenerator').clear = originalEGClear;
    });
  });

  describe(oneshotModule.start.name, () => {
    test('should call `ready` and `start` each instance', () => {
      // eslint-disable-next-line dot-notation
      const originalLoad = oneshotModule['load'];

      const loadMock = jest.fn();

      // eslint-disable-next-line dot-notation
      oneshotModule['load'] = loadMock;

      oneshotModule.setup({ resources, settings });

      const originalEGReady = oneshotModule.module('envelopegenerator').ready;
      const originalEGStart = oneshotModule.module('envelopegenerator').start;

      const egReadyMock = jest.fn();
      const egStartMock = jest.fn();

      oneshotModule.module('envelopegenerator').ready = egReadyMock;
      oneshotModule.module('envelopegenerator').start = egStartMock;

      oneshotModule.start([1]);

      expect(egReadyMock).toHaveBeenCalledTimes(1);
      expect(egStartMock).toHaveBeenCalledTimes(1);

      oneshotModule.module('envelopegenerator').ready = originalEGReady;
      oneshotModule.module('envelopegenerator').start = originalEGStart;

      // eslint-disable-next-line dot-notation
      oneshotModule['load'] = originalLoad;
    });
  });

  describe(oneshotModule.stop.name, () => {
    test('should call `stop` each instance', () => {
      // eslint-disable-next-line dot-notation
      const originalLoad = oneshotModule['load'];

      const loadMock = jest.fn();

      // eslint-disable-next-line dot-notation
      oneshotModule['load'] = loadMock;

      const originalEGStop     = oneshotModule.module('envelopegenerator').stop;
      const originalFilterStop = oneshotModule.module('filter').stop;

      const egStopMock     = jest.fn();
      const filterStopMock = jest.fn();

      oneshotModule.module('envelopegenerator').stop = egStopMock;
      oneshotModule.module('filter').stop            = filterStopMock;

      oneshotModule.setup({ resources, settings });
      oneshotModule.stop([1]);

      expect(egStopMock).toHaveBeenCalledTimes(1);
      expect(filterStopMock).toHaveBeenCalledTimes(1);

      oneshotModule.module('envelopegenerator').stop = originalEGStop;
      oneshotModule.module('filter').stop            = originalFilterStop;

      // eslint-disable-next-line dot-notation
      oneshotModule['load'] = originalLoad;
    });
  });

  describe(oneshotModule.param.name, () => {
    const defaultParams: Params = {
      mastervolume: 1,
      transpose   : 1
    };

    const params: Params = {
      mastervolume: 0.5,
      transpose   : 2
    };

    beforeAll(() => {
      oneshotModule.param(params);
    });

    afterAll(() => {
      oneshotModule.param(defaultParams);
    });

    test('should return `mastervolume`', () => {
      expect(oneshotModule.param('mastervolume')).toBeCloseTo(0.5, 1);
    });

    test('should return `transpose`', () => {
      expect(oneshotModule.param('transpose')).toBeCloseTo(2, 1);
    });
  });

  describe(oneshotModule.get.name, () => {
    test('should return instance of `AudioBuffer` or array that contains instance of `AudioBuffer`', () => {
      expect(oneshotModule.get(0)).toBeInstanceOf(AudioBufferMock);
      expect(oneshotModule.get(1)).toBeInstanceOf(AudioBufferMock);
      expect(oneshotModule.get(2)).toBeInstanceOf(AudioBufferMock);

      oneshotModule.get().forEach((buffer: AudioBuffer) => {
        expect(buffer).toBeInstanceOf(AudioBuffer);
      });
    });
  });

  describe(oneshotModule.reset.name, () => {
    test('should reset parameter', () => {
      // eslint-disable-next-line dot-notation
      const originalLoad = oneshotModule['load'];

      const loadMock = jest.fn();

      // eslint-disable-next-line dot-notation
      oneshotModule['load'] = loadMock;

      oneshotModule.setup({ resources, settings });

      oneshotModule.reset(1, 'bufferIndex', 3);
      oneshotModule.reset(1, 'playbackRate', 0.5);

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
  });

  describe(oneshotModule.module.name, () => {
    test('should return instance of `Module`', () => {
      expect(oneshotModule.module('analyser')).toBeInstanceOf(Analyser);
      expect(oneshotModule.module('recorder')).toBeInstanceOf(Recorder);
      expect(oneshotModule.module('session')).toBeInstanceOf(Session);
      expect(oneshotModule.module('autopanner')).toBeInstanceOf(Autopanner);
      expect(oneshotModule.module('bitcrusher')).toBeInstanceOf(BitCrusher);
      expect(oneshotModule.module('chorus')).toBeInstanceOf(Chorus);
      expect(oneshotModule.module('compressor')).toBeInstanceOf(Compressor);
      expect(oneshotModule.module('delay')).toBeInstanceOf(Delay);
      expect(oneshotModule.module('envelopegenerator')).toBeInstanceOf(EnvelopeGenerator);
      expect(oneshotModule.module('equalizer')).toBeInstanceOf(Equalizer);
      expect(oneshotModule.module('filter')).toBeInstanceOf(Filter);
      expect(oneshotModule.module('flanger')).toBeInstanceOf(Flanger);
      expect(oneshotModule.module('fuzz')).toBeInstanceOf(Fuzz);
      expect(oneshotModule.module('listener')).toBeInstanceOf(Listener);
      expect(oneshotModule.module('noisegate')).toBeInstanceOf(NoiseGate);
      expect(oneshotModule.module('noisesuppressor')).toBeInstanceOf(NoiseSuppressor);
      expect(oneshotModule.module('overdrive')).toBeInstanceOf(OverDrive);
      expect(oneshotModule.module('panner')).toBeInstanceOf(Panner);
      expect(oneshotModule.module('phaser')).toBeInstanceOf(Phaser);
      expect(oneshotModule.module('pitchshifter')).toBeInstanceOf(PitchShifter);
      expect(oneshotModule.module('preamp')).toBeInstanceOf(Preamp);
      expect(oneshotModule.module('reverb')).toBeInstanceOf(Reverb);
      expect(oneshotModule.module('ringmodulator')).toBeInstanceOf(Ringmodulator);
      expect(oneshotModule.module('stereo')).toBeInstanceOf(Stereo);
      expect(oneshotModule.module('tremolo')).toBeInstanceOf(Tremolo);
      expect(oneshotModule.module('vocalcanceler')).toBeInstanceOf(VocalCanceler);
      expect(oneshotModule.module('wah')).toBeInstanceOf(Wah);
    });
  });

  describe(oneshotModule.params.name, () => {
    test('should return parameters for one-shot module as associative array', () => {
      /* eslint-disable dot-notation */
      expect(oneshotModule.params()).toStrictEqual({
        mastervolume     : 1,
        transpose        : 1,
        envelopegenerator: oneshotModule['envelopegenerator'].params(),
        stereo           : oneshotModule['stereo'].params(),
        compressor       : oneshotModule['compressor'].params(),
        bitcrusher       : oneshotModule['bitcrusher'].params(),
        overdrive        : oneshotModule['overdrive'].params(),
        fuzz             : oneshotModule['fuzz'].params(),
        preamp           : oneshotModule['preamp'].params(),
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
        noisegate        : oneshotModule['noisegate'].params(),
        noisesuppressor  : oneshotModule['noisesuppressor'].params(),
        vocalcanceler    : oneshotModule['vocalcanceler'].params()
      });
      /* eslint-enable dot-notation */
    });
  });
});
