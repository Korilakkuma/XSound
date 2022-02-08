import { AudioContextMock } from '../../mock/AudioContextMock';
import { Effector } from '../../src/SoundModule/Effectors/Effector';
import { SoundModule } from '../../src/SoundModule';

class CustomEffector extends Effector {
}

describe(SoundModule.name, () => {
  const context = new AudioContextMock();

  // @ts-ignore
  const soundModule = new SoundModule(context, 1024);

  describe(soundModule.resize.name, () => {
    test('should call init method', () => {
      // eslint-disable-next-line dot-notation
      const originalInit = soundModule['init'];

      const initMock = jest.fn();

      // eslint-disable-next-line dot-notation
      soundModule['init'] = initMock;

      soundModule.resize(2048);

      expect(initMock).toHaveBeenCalledTimes(1);

      // eslint-disable-next-line dot-notation
      soundModule['init'] = originalInit;
    });
  });

  describe(soundModule.getBufferSize.name, () => {
    test('should return buffer size', () => {
      expect(soundModule.getBufferSize()).toBe(1024);

      soundModule.resize(2048);

      expect(soundModule.getBufferSize()).toBe(2048);

      soundModule.resize(1024);
    });
  });

  describe(soundModule.install.name, () => {
    test('should append to modules and return effector', () => {
      // @ts-ignore
      const effector = new CustomEffector(context, 1024);

      // eslint-disable-next-line dot-notation
      const modules = soundModule['modules'];

      const numberOfModules = modules.length;

      expect(soundModule.install('custom', effector)).toBeInstanceOf(CustomEffector);
      expect(modules[numberOfModules]).toBeInstanceOf(CustomEffector);

      modules.pop();
    });
  });

  describe(soundModule.on.name, () => {
    test('should start effectors', () => {
      /* eslint-disable dot-notation */
      const originalStereoStart        = soundModule['stereo'].start;
      const originalChorusStart        = soundModule['chorus'].start;
      const originalFlangerStart       = soundModule['flanger'].start;
      const originalPhaserStart        = soundModule['phaser'].start;
      const originalAutopannerStart    = soundModule['autopanner'].start;
      const originalTreomoloStart      = soundModule['tremolo'].start;
      const originalRingmodulatorStart = soundModule['ringmodulator'].start;
      const originalWahStart           = soundModule['wah'].start;
      const originalFilterStart        = soundModule['filter'].start;
      /* eslint-enable dot-notation */

      const stereoStartMock        = jest.fn();
      const chorusStartMock        = jest.fn();
      const flangerStartMock       = jest.fn();
      const phaserStartMock        = jest.fn();
      const autopannerStartMock    = jest.fn();
      const treomoloStartMock      = jest.fn();
      const ringmodulatorStartMock = jest.fn();
      const wahStartMock           = jest.fn();
      const filterStartMock        = jest.fn();

      /* eslint-disable dot-notation */
      soundModule['stereo'].start        = stereoStartMock;
      soundModule['chorus'].start        = chorusStartMock;
      soundModule['flanger'].start       = flangerStartMock;
      soundModule['phaser'].start        = phaserStartMock;
      soundModule['autopanner'].start    = autopannerStartMock;
      soundModule['tremolo'].start       = treomoloStartMock;
      soundModule['ringmodulator'].start = ringmodulatorStartMock;
      soundModule['wah'].start           = wahStartMock;
      soundModule['filter'].start        = filterStartMock;
      /* eslint-enable dot-notation */

      soundModule.on(0);

      expect(stereoStartMock).toHaveBeenCalledTimes(1);
      expect(chorusStartMock).toHaveBeenCalledTimes(1);
      expect(flangerStartMock).toHaveBeenCalledTimes(1);
      expect(phaserStartMock).toHaveBeenCalledTimes(1);
      expect(autopannerStartMock).toHaveBeenCalledTimes(1);
      expect(autopannerStartMock).toHaveBeenCalledTimes(1);
      expect(treomoloStartMock).toHaveBeenCalledTimes(1);
      expect(ringmodulatorStartMock).toHaveBeenCalledTimes(1);
      expect(wahStartMock).toHaveBeenCalledTimes(1);
      expect(filterStartMock).toHaveBeenCalledTimes(1);

      /* eslint-disable dot-notation */
      soundModule['stereo'].start        = originalStereoStart;
      soundModule['chorus'].start        = originalChorusStart;
      soundModule['flanger'].start       = originalFlangerStart;
      soundModule['phaser'].start        = originalPhaserStart;
      soundModule['autopanner'].start    = originalAutopannerStart;
      soundModule['tremolo'].start       = originalTreomoloStart;
      soundModule['ringmodulator'].start = originalRingmodulatorStart;
      soundModule['wah'].start           = originalWahStart;
      soundModule['filter'].start        = originalFilterStart;
      /* eslint-enable dot-notation */
    });
  });

  describe(soundModule.off.name, () => {
    test('should stop effectors', () => {
      /* eslint-disable dot-notation */
      const originalStereoStop        = soundModule['stereo'].stop;
      const originalChorusStop        = soundModule['chorus'].stop;
      const originalFlangerStop       = soundModule['flanger'].stop;
      const originalPhaserStop        = soundModule['phaser'].stop;
      const originalAutopannerStop    = soundModule['autopanner'].stop;
      const originalTreomoloStop      = soundModule['tremolo'].stop;
      const originalRingmodulatorStop = soundModule['ringmodulator'].stop;
      const originalWahStop           = soundModule['wah'].stop;
      const originalFilterStop        = soundModule['filter'].stop;
      /* eslint-enable dot-notation */

      const stereoStopMock        = jest.fn();
      const chorusStopMock        = jest.fn();
      const flangerStopMock       = jest.fn();
      const phaserStopMock        = jest.fn();
      const autopannerStopMock    = jest.fn();
      const treomoloStopMock      = jest.fn();
      const ringmodulatorStopMock = jest.fn();
      const wahStopMock           = jest.fn();
      const filterStopMock        = jest.fn();

      /* eslint-disable dot-notation */
      soundModule['stereo'].stop        = stereoStopMock;
      soundModule['chorus'].stop        = chorusStopMock;
      soundModule['flanger'].stop       = flangerStopMock;
      soundModule['phaser'].stop        = phaserStopMock;
      soundModule['autopanner'].stop    = autopannerStopMock;
      soundModule['tremolo'].stop       = treomoloStopMock;
      soundModule['ringmodulator'].stop = ringmodulatorStopMock;
      soundModule['wah'].stop           = wahStopMock;
      soundModule['filter'].stop        = filterStopMock;
      /* eslint-enable dot-notation */

      soundModule.off(0);

      expect(stereoStopMock).toHaveBeenCalledTimes(1);
      expect(chorusStopMock).toHaveBeenCalledTimes(1);
      expect(flangerStopMock).toHaveBeenCalledTimes(1);
      expect(phaserStopMock).toHaveBeenCalledTimes(1);
      expect(autopannerStopMock).toHaveBeenCalledTimes(1);
      expect(autopannerStopMock).toHaveBeenCalledTimes(1);
      expect(treomoloStopMock).toHaveBeenCalledTimes(1);
      expect(ringmodulatorStopMock).toHaveBeenCalledTimes(1);
      expect(wahStopMock).toHaveBeenCalledTimes(1);
      expect(filterStopMock).toHaveBeenCalledTimes(1);

      /* eslint-disable dot-notation */
      soundModule['stereo'].stop        = originalStereoStop;
      soundModule['chorus'].stop        = originalChorusStop;
      soundModule['flanger'].stop       = originalFlangerStop;
      soundModule['phaser'].stop        = originalPhaserStop;
      soundModule['autopanner'].stop    = originalAutopannerStop;
      soundModule['tremolo'].stop       = originalTreomoloStop;
      soundModule['ringmodulator'].stop = originalRingmodulatorStop;
      soundModule['wah'].stop           = originalWahStop;
      soundModule['filter'].stop        = originalFilterStop;
      /* eslint-enable dot-notation */
    });
  });

  describe(soundModule.suspend.name, () => {
    test('should stop analyser, recorder, and `onaudioprocess` event', () => {
      /* eslint-disable dot-notation */
      const originalAnalyserStop = soundModule['analyser'].stop;
      const originalRecorderStop = soundModule['recorder'].stop;
      const originalProcessor    = soundModule['processor'];
      /* eslint-enable dot-notation */

      const analyserStopMock        = jest.fn();
      const recorderStopMock        = jest.fn();
      const processorDisconnectMock = jest.fn();

      /* eslint-disable dot-notation */
      soundModule['analyser'].stop        = analyserStopMock;
      soundModule['recorder'].stop        = recorderStopMock;
      soundModule['processor'].disconnect = processorDisconnectMock;
      /* eslint-enable dot-notation */

      soundModule.suspend();

      expect(analyserStopMock).toHaveBeenCalledTimes(2);
      expect(recorderStopMock).toHaveBeenCalledTimes(1);

      /* eslint-disable dot-notation */
      soundModule['analyser'].stop = originalAnalyserStop;
      soundModule['recorder'].stop = originalRecorderStop;
      soundModule['processor']     = originalProcessor;
      /* eslint-enable dot-notation */
    });
  });

  describe(soundModule.params.name, () => {
    test('should return parameters for sound module as associative array', () => {
      /* eslint-disable dot-notation */
      expect(soundModule.params()).toStrictEqual({
        mastervolume     : 1,
        stereo           : soundModule['stereo'].params(),
        compressor       : soundModule['compressor'].params(),
        distortion       : soundModule['distortion'].params(),
        wah              : soundModule['wah'].params(),
        pitchshifter     : soundModule['pitchshifter'].params(),
        equalizer        : soundModule['equalizer'].params(),
        filter           : soundModule['filter'].params(),
        autopanner       : soundModule['autopanner'].params(),
        tremolo          : soundModule['tremolo'].params(),
        ringmodulator    : soundModule['ringmodulator'].params(),
        phaser           : soundModule['phaser'].params(),
        flanger          : soundModule['flanger'].params(),
        chorus           : soundModule['chorus'].params(),
        delay            : soundModule['delay'].params(),
        reverb           : soundModule['reverb'].params(),
        panner           : soundModule['panner'].params(),
        listener         : soundModule['listener'].params(),
        envelopegenerator: soundModule['envelopegenerator'].params()
      });
      /* eslint-enable dot-notation */
    });
  });
});
