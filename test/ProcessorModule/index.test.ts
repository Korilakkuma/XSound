import { AudioContextMock } from '/mock/AudioContextMock';
import { AudioWorkletNodeMock, AudioParamMapMock } from '/mock/AudioWorkletNodeMock';
import { Analyser } from '/src/SoundModule/Analyser';
import { Recorder } from '/src/SoundModule/Recorder';
import { Autopanner } from '/src/SoundModule/Effectors/Autopanner';
import { BitCrusher } from '/src/SoundModule/Effectors/BitCrusher';
import { Chorus } from '/src/SoundModule/Effectors/Chorus';
import { Compressor } from '/src/SoundModule/Effectors/Compressor';
import { Delay } from '/src/SoundModule/Effectors/Delay';
import { EnvelopeGenerator } from '/src/SoundModule/Effectors/EnvelopeGenerator';
import { Equalizer } from '/src/SoundModule/Effectors/Equalizer';
import { Filter } from '/src/SoundModule/Effectors/Filter';
import { Flanger } from '/src/SoundModule/Effectors/Flanger';
import { Fuzz } from '/src/SoundModule/Effectors/Fuzz';
import { Listener } from '/src/SoundModule/Effectors/Listener';
import { NoiseGate } from '/src/SoundModule/Effectors/NoiseGate';
import { NoiseSuppressor } from '/src/SoundModule/Effectors/NoiseSuppressor';
import { OverDrive } from '/src/SoundModule/Effectors/OverDrive';
import { Panner } from '/src/SoundModule/Effectors/Panner';
import { Phaser } from '/src/SoundModule/Effectors/Phaser';
import { PitchShifter } from '/src/SoundModule/Effectors/PitchShifter';
import { Preamp } from '/src/SoundModule/Effectors/Preamp';
import { Reverb } from '/src/SoundModule/Effectors/Reverb';
import { Ringmodulator } from '/src/SoundModule/Effectors/Ringmodulator';
import { Stereo } from '/src/SoundModule/Effectors/Stereo';
import { Tremolo } from '/src/SoundModule/Effectors/Tremolo';
import { VocalCanceler } from '/src/SoundModule/Effectors/VocalCanceler';
import { Wah } from '/src/SoundModule/Effectors/Wah';
import { ProcessorModule } from '/src/ProcessorModule';

describe(ProcessorModule.name, () => {
  const context = new AudioContextMock();

  // @ts-expect-error Because there is not Web Audio API in Jest environment (Node.js environment), mocks Web Audio API
  const processorModule = new ProcessorModule(context);

  processorModule.setup('test-processor');

  describe(processorModule.ready.name, () => {
    test('should call `addModule` and return `Promise`', () => {
      const originalAddModule = context.audioWorklet.addModule;

      const addModuleMock = jest.fn();

      addModuleMock.mockReturnValue(new Promise((resolve) => resolve(undefined)));

      context.audioWorklet.addModule = addModuleMock;

      processorModule.ready('./worklet.js')
        .then((value) => {
          expect(addModuleMock).toHaveReturnedTimes(1);
          expect(value).toBeUndefined();
        })
        .catch(() => {
        });

      addModuleMock.mockClear();

      context.audioWorklet.addModule = originalAddModule;
    });
  });

  describe(processorModule.start.name, () => {
    test('should call `connect` method', () => {
      processorModule.ready('./worklet.js')
        .then(() => {
          // eslint-disable-next-line dot-notation
          const originalConnect = processorModule['connect'];

          const connectMock = jest.fn();

          // eslint-disable-next-line dot-notation
          processorModule['connect'] = connectMock;

          processorModule.start();

          expect(connectMock).toHaveBeenCalledTimes(1);

          // eslint-disable-next-line dot-notation
          processorModule['connect'] = originalConnect;
        })
        .catch(() => {
        });
    });
  });

  describe(processorModule.stop.name, () => {
    test('should call envelope generator `stop` method', () => {
      processorModule.ready('./worklet.js')
        .then(() => {
          // eslint-disable-next-line dot-notation
          const originalEGStop = processorModule['envelopegenerator'].stop;

          const egStopMock = jest.fn();

          // eslint-disable-next-line dot-notation
          processorModule['envelopegenerator'].stop = egStopMock;

          processorModule.stop();

          expect(egStopMock).toHaveBeenCalledTimes(1);

          // eslint-disable-next-line dot-notation
          processorModule['envelopegenerator'].stop = originalEGStop;
        })
        .catch(() => {
        });
    });
  });

  describe(processorModule.postMessage.name, () => {
    test('should call `postMessage` with designated data', () => {
      processorModule.ready('./worklet.js')
        .then(() => {
          const processor = processorModule.get();

          if (!(processor instanceof AudioWorkletNodeMock)) {
            return;
          }

          const data = { data: [0x90, 0x3c, 0x7f] };

          const originalPostMessage = processor.port.postMessage;

          const postMessageMock = jest.fn();

          processor.port.postMessage = postMessageMock;

          processorModule.postMessage(data);

          expect(postMessageMock).toHaveBeenCalledTimes(1);
          expect(postMessageMock).toHaveBeenCalledWith(data);

          processor.port.postMessage = originalPostMessage;
        })
        .catch(() => {
        });
    });
  });

  xdescribe(processorModule.onMessage.name, () => {
    // TODO:
  });

  xdescribe(processorModule.onMessageError.name, () => {
    // TODO:
  });

  describe(processorModule.map.name, () => {
    test('should return instance of `AudioParamMap`', () => {
      expect(processorModule.map()).toBeInstanceOf(AudioParamMapMock);
    });
  });

  describe(processorModule.get.name, () => {
    test('should return instance of `AudioWorkletNode`', () => {
      expect(processorModule.get()).toBeInstanceOf(AudioWorkletNodeMock);
    });
  });

  describe(processorModule.module.name, () => {
    test('should return instance of `Module`', () => {
      expect(processorModule.module('analyser')).toBeInstanceOf(Analyser);
      expect(processorModule.module('recorder')).toBeInstanceOf(Recorder);
      expect(processorModule.module('autopanner')).toBeInstanceOf(Autopanner);
      expect(processorModule.module('bitcrusher')).toBeInstanceOf(BitCrusher);
      expect(processorModule.module('chorus')).toBeInstanceOf(Chorus);
      expect(processorModule.module('compressor')).toBeInstanceOf(Compressor);
      expect(processorModule.module('delay')).toBeInstanceOf(Delay);
      expect(processorModule.module('envelopegenerator')).toBeInstanceOf(EnvelopeGenerator);
      expect(processorModule.module('equalizer')).toBeInstanceOf(Equalizer);
      expect(processorModule.module('filter')).toBeInstanceOf(Filter);
      expect(processorModule.module('flanger')).toBeInstanceOf(Flanger);
      expect(processorModule.module('fuzz')).toBeInstanceOf(Fuzz);
      expect(processorModule.module('listener')).toBeInstanceOf(Listener);
      expect(processorModule.module('noisegate')).toBeInstanceOf(NoiseGate);
      expect(processorModule.module('noisesuppressor')).toBeInstanceOf(NoiseSuppressor);
      expect(processorModule.module('overdrive')).toBeInstanceOf(OverDrive);
      expect(processorModule.module('panner')).toBeInstanceOf(Panner);
      expect(processorModule.module('phaser')).toBeInstanceOf(Phaser);
      expect(processorModule.module('pitchshifter')).toBeInstanceOf(PitchShifter);
      expect(processorModule.module('preamp')).toBeInstanceOf(Preamp);
      expect(processorModule.module('reverb')).toBeInstanceOf(Reverb);
      expect(processorModule.module('ringmodulator')).toBeInstanceOf(Ringmodulator);
      expect(processorModule.module('stereo')).toBeInstanceOf(Stereo);
      expect(processorModule.module('tremolo')).toBeInstanceOf(Tremolo);
      expect(processorModule.module('vocalcanceler')).toBeInstanceOf(VocalCanceler);
      expect(processorModule.module('wah')).toBeInstanceOf(Wah);
    });
  });

  describe(processorModule.edit.name, () => {
    test('should set edited modules and return previous modules', () => {
      // eslint-disable-next-line dot-notation
      const previousModules = processorModule['modules'];

      const modules = [processorModule.module('delay'), processorModule.module('reverb')];

      expect(processorModule.edit(modules)).toStrictEqual(previousModules);
      expect(modules[0]).toBeInstanceOf(Delay);
      expect(modules[1]).toBeInstanceOf(Reverb);
    });
  });
});
