import type { StreamModuleParams } from '/src/StreamModule';

import { AudioContextMock } from '/mock/AudioContextMock';
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
import { StreamModule } from '/src/StreamModule';

type Params = Partial<Pick<StreamModuleParams, 'mastervolume' | 'output' | 'track'>>;

// TODO: Add tests if use `MediaStreamTrackAudioSourceNode`
describe(StreamModule.name, () => {
  const context = new AudioContextMock();

  // @ts-expect-error Because there is not Web Audio API in Jest environment (Node.js environment), mocks Web Audio API
  const streamModule = new StreamModule(context);

  streamModule.setup({
    video: true
  });

  describe(streamModule.setup.name, () => {
    test('should return merged `MediaStreamConstraints`', () => {
      expect(streamModule.getConstraints()).toStrictEqual({
        audio: true,
        video: true
      });
    });
  });

  describe(streamModule.ready.name, () => {
    test('should open devices and set instance of `MediaStream`', () => {
      streamModule.ready()
        .then(() => {
          // eslint-disable-next-line dot-notation
          expect(streamModule['stream']).toBeInstanceOf(MediaStream);
        })
        .catch(() => {
        });
    });
  });

  describe(streamModule.start.name, () => {
    test('should set instance of `MediaStreamAudioSourceNode` and call `connect` method', () => {
      streamModule.ready()
        .then(() => {
          // eslint-disable-next-line dot-notation
          const originalConnect = streamModule['connect'];

          const connectMock = jest.fn();

          // eslint-disable-next-line dot-notation
          streamModule['connect'] = connectMock;

          streamModule.start();

          // eslint-disable-next-line dot-notation
          expect(streamModule['sources'][0]).toBeInstanceOf(MediaStreamAudioSourceNode);
          expect(connectMock).toHaveBeenCalledTimes(1);

          // eslint-disable-next-line dot-notation
          streamModule['connect'] = originalConnect;
        })
        .catch(() => {
        });
    });
  });

  describe(streamModule.stop.name, () => {
    test('should call methods for stopping audio process and instance of `MediaStreamAudioSourceNode` is none', () => {
      streamModule.ready()
        .then(() => {
          /* eslint-disable dot-notation */
          const originalOff          = streamModule['off'];
          const originalAnalyserStop = streamModule['analyser'].stop;
          const originalProcessor    = streamModule['processor'];
          /* eslint-enable dot-notation */

          const offMock                 = jest.fn();
          const analyserStopMock        = jest.fn();
          const processorDisconnectMock = jest.fn();

          /* eslint-disable dot-notation */
          streamModule['off']                  = offMock;
          streamModule['analyser'].stop        = analyserStopMock;
          streamModule['processor'].disconnect = processorDisconnectMock;
          /* eslint-enable dot-notation */

          streamModule.start();
          streamModule.stop();

          expect(offMock).toHaveBeenCalledTimes(1);
          expect(analyserStopMock).toHaveBeenCalledTimes(2);
          expect(processorDisconnectMock).toHaveBeenCalledTimes(1);
          expect(streamModule.streaming()).toBe(false);

          // eslint-disable-next-line dot-notation
          expect(streamModule['sources'].length).toBe(0);

          /* eslint-disable dot-notation */
          streamModule['off']           = originalOff;
          streamModule['analyser'].stop = originalAnalyserStop;
          streamModule['processor']     = originalProcessor;
          /* eslint-enable dot-notation */
        })
        .catch(() => {
        });
    });
  });

  describe(streamModule.param.name, () => {
    const defaultParams: Params = {
      mastervolume: 1,
      output      : true,
      track       : false
    };

    const params: Params = {
      mastervolume: 0.5,
      output      : false,
      track       : true
    };

    beforeAll(() => {
      streamModule.param(params);
    });

    afterAll(() => {
      streamModule.param(defaultParams);
    });

    test('should return `mastervolume`', () => {
      expect(streamModule.param('mastervolume')).toBeCloseTo(0.5, 1);
    });

    test('should return `output`', () => {
      expect(streamModule.param('output')).toBe(false);
    });

    test('should return `track`', () => {
      expect(streamModule.param('track')).toBe(true);
    });
  });

  describe(streamModule.get.name, () => {
    test('should return instance of `MediaStreamAudioSourceNode`', () => {
      streamModule.ready()
        .then(() => {
          streamModule.start();

          expect(streamModule.get(0)).toBeInstanceOf(MediaStreamAudioSourceNode);

          streamModule.get().forEach((source) => {
            expect(source).toBeInstanceOf(MediaStreamAudioSourceNode);
          });
        })
        .catch(() => {
        });
    });
  });

  describe(streamModule.getStream.name, () => {
    test('should return instance of `MediaStream`', () => {
      streamModule.ready()
        .then(() => {
          expect(streamModule.getStream()).toBeInstanceOf(MediaStream);
        })
        .catch(() => {
        });
    });
  });

  describe(streamModule.setConstraints.name, () => {
    test('should set designated `MediaStreamConstraints`', () => {
      streamModule.setConstraints({
        audio: {
          autoGainControl : true,
          echoCancellation: true
        }
      });

      expect(streamModule.getConstraints()).toStrictEqual({
        audio: {
          autoGainControl : true,
          echoCancellation: true
        }
      });

      streamModule.setConstraints({
        audio: true,
        video: true
      });
    });
  });

  describe(streamModule.clear.name, () => {
    test('should call methods for stopping audio process and devices', () => {
      streamModule.ready()
        .then(() => {
          const originalStop              = streamModule.stop;
          const originalClearAudioDevices = streamModule.clearAudioDevices;
          const originalClearVideoDevices = streamModule.clearVideoDevices;

          const stopMock              = jest.fn();
          const clearAudioDevicesMock = jest.fn();
          const clearVideoDevicesMock = jest.fn();

          streamModule.clear();

          expect(stopMock).toHaveBeenCalledTimes(1);
          expect(clearAudioDevicesMock).toHaveBeenCalledTimes(1);
          expect(clearVideoDevicesMock).toHaveBeenCalledTimes(1);
          expect(streamModule.getStream()).toBe(null);

          streamModule.stop              = originalStop;
          streamModule.clearAudioDevices = originalClearAudioDevices;
          streamModule.clearVideoDevices = originalClearVideoDevices;
        })
        .catch(() => {
        });
    });
  });

  describe(streamModule.clearAudioDevices.name, () => {
    test('should call `stop` method each audio track', () => {
      streamModule.ready()
        .then(() => {
          // eslint-disable-next-line dot-notation
          const originalAudioTracks = streamModule['stream']?.getAudioTracks();

          const originalAudioTrackStops = originalAudioTracks?.map((originalAudioTrack: MediaStreamTrack) => {
            return originalAudioTrack.stop;
          });

          const audioTrackStopMocks = originalAudioTracks?.map((originalAudioTrack: MediaStreamTrack) => {
            const audioTrackStopMock = jest.fn();

            originalAudioTrack.stop = audioTrackStopMock;

            return audioTrackStopMock;
          });

          streamModule.clearAudioDevices();

          audioTrackStopMocks?.forEach((audioTrackStopMock) => {
            expect(audioTrackStopMock).toHaveBeenCalledTimes(1);
          });

          originalAudioTracks?.forEach((originalAudioTrack: MediaStreamTrack, index: number) => {
            if (originalAudioTrackStops) {
              originalAudioTrack.stop = originalAudioTrackStops[index];
            }
          });
        })
        .catch(() => {
        });
    });
  });

  describe(streamModule.clearVideoDevices.name, () => {
    test('should call `stop` method each video track', () => {
      streamModule.ready()
        .then(() => {
          // eslint-disable-next-line dot-notation
          const originalVideoTracks = streamModule['stream']?.getVideoTracks();

          const originalVideoTrackStops = originalVideoTracks?.map((originalVideoTrack: MediaStreamTrack) => {
            return originalVideoTrack.stop;
          });

          const videoTrackStopMocks = originalVideoTracks?.map((originalVideoTrack: MediaStreamTrack) => {
            const videoTrackStopMock = jest.fn();

            originalVideoTrack.stop = videoTrackStopMock;

            return videoTrackStopMock;
          });

          streamModule.clearVideoDevices();

          videoTrackStopMocks?.forEach((videoTrackStopMock) => {
            expect(videoTrackStopMock).toHaveBeenCalledTimes(1);
          });

          originalVideoTracks?.forEach((originalVideoTrack: MediaStreamTrack, index: number) => {
            if (originalVideoTrackStops) {
              originalVideoTrack.stop = originalVideoTrackStops[index];
            }
          });
        })
        .catch(() => {
        });
    });
  });

  describe(streamModule.devices.name, () => {
    test('should return array that contains instance of `MediaDeviceInfo', () => {
      const mediaDeviceInfo1 = {
        deviceId: '',
        groupId : '5fef7cc70693063298bc486ebcfe95b837cf30dc8b9af5562bb9e35ab6eb9487',
        kind    : 'audioinput',
        label   : ''
      };

      const mediaDeviceInfo2 = {
        deviceId: '',
        groupId : 'a576309fc157fdb113064d7bbbf6ff79220c11861a4376c7bb526eca5be39f7c',
        kind    : 'videoinput',
        label   : ''
      };

      const mediaDeviceInfo3 = {
        deviceId: '',
        groupId : '5fef7cc70693063298bc486ebcfe95b837cf30dc8b9af5562bb9e35ab6eb9487',
        kind    : 'audioinput',
        label   : ''
      };

      const enumerateDevicesMock = jest.fn();

      enumerateDevicesMock.mockReturnValue([mediaDeviceInfo1, mediaDeviceInfo2, mediaDeviceInfo3]);

      // FIXME: Revert to original
      Object.defineProperty(navigator, 'mediaDevices', {
        configurable: true,
        writable    : true,
        value       : {
          enumerateDevices: enumerateDevicesMock
        }
      });

      expect(streamModule.devices()).toStrictEqual([mediaDeviceInfo1, mediaDeviceInfo2, mediaDeviceInfo3]);
      expect(enumerateDevicesMock).toHaveBeenCalledTimes(1);

      enumerateDevicesMock.mockClear();
    });
  });

  describe(streamModule.streaming.name, () => {
    test('should return `false`', () => {
      expect(streamModule.streaming()).toBe(false);
    });

    test('should return `true`', () => {
      streamModule.ready()
        .then(() => {
          streamModule.start();
          expect(streamModule.streaming()).toBe(true);
        })
        .catch(() => {
        });
    });
  });

  describe(streamModule.module.name, () => {
    test('should return instance of `Module`', () => {
      expect(streamModule.module('analyser')).toBeInstanceOf(Analyser);
      expect(streamModule.module('recorder')).toBeInstanceOf(Recorder);
      expect(streamModule.module('autopanner')).toBeInstanceOf(Autopanner);
      expect(streamModule.module('bitcrusher')).toBeInstanceOf(BitCrusher);
      expect(streamModule.module('chorus')).toBeInstanceOf(Chorus);
      expect(streamModule.module('compressor')).toBeInstanceOf(Compressor);
      expect(streamModule.module('delay')).toBeInstanceOf(Delay);
      expect(streamModule.module('envelopegenerator')).toBeInstanceOf(EnvelopeGenerator);
      expect(streamModule.module('equalizer')).toBeInstanceOf(Equalizer);
      expect(streamModule.module('filter')).toBeInstanceOf(Filter);
      expect(streamModule.module('flanger')).toBeInstanceOf(Flanger);
      expect(streamModule.module('fuzz')).toBeInstanceOf(Fuzz);
      expect(streamModule.module('listener')).toBeInstanceOf(Listener);
      expect(streamModule.module('noisegate')).toBeInstanceOf(NoiseGate);
      expect(streamModule.module('noisesuppressor')).toBeInstanceOf(NoiseSuppressor);
      expect(streamModule.module('overdrive')).toBeInstanceOf(OverDrive);
      expect(streamModule.module('panner')).toBeInstanceOf(Panner);
      expect(streamModule.module('phaser')).toBeInstanceOf(Phaser);
      expect(streamModule.module('pitchshifter')).toBeInstanceOf(PitchShifter);
      expect(streamModule.module('preamp')).toBeInstanceOf(Preamp);
      expect(streamModule.module('reverb')).toBeInstanceOf(Reverb);
      expect(streamModule.module('ringmodulator')).toBeInstanceOf(Ringmodulator);
      expect(streamModule.module('stereo')).toBeInstanceOf(Stereo);
      expect(streamModule.module('tremolo')).toBeInstanceOf(Tremolo);
      expect(streamModule.module('vocalcanceler')).toBeInstanceOf(VocalCanceler);
      expect(streamModule.module('wah')).toBeInstanceOf(Wah);
    });
  });

  describe(streamModule.params.name, () => {
    test('should return parameters for stream module as associative array', () => {
      /* eslint-disable dot-notation */
      expect(streamModule.params()).toStrictEqual({
        mastervolume     : 1,
        output           : true,
        track            : false,
        autopanner       : streamModule['autopanner'].params(),
        bitcrusher       : streamModule['bitcrusher'].params(),
        chorus           : streamModule['chorus'].params(),
        compressor       : streamModule['compressor'].params(),
        delay            : streamModule['delay'].params(),
        envelopegenerator: streamModule['envelopegenerator'].params(),
        equalizer        : streamModule['equalizer'].params(),
        filter           : streamModule['filter'].params(),
        flanger          : streamModule['flanger'].params(),
        fuzz             : streamModule['fuzz'].params(),
        listener         : streamModule['listener'].params(),
        noisegate        : streamModule['noisegate'].params(),
        noisesuppressor  : streamModule['noisesuppressor'].params(),
        overdrive        : streamModule['overdrive'].params(),
        panner           : streamModule['panner'].params(),
        phaser           : streamModule['phaser'].params(),
        pitchshifter     : streamModule['pitchshifter'].params(),
        preamp           : streamModule['preamp'].params(),
        reverb           : streamModule['reverb'].params(),
        ringmodulator    : streamModule['ringmodulator'].params(),
        stereo           : streamModule['stereo'].params(),
        tremolo          : streamModule['tremolo'].params(),
        vocalcanceler    : streamModule['vocalcanceler'].params(),
        wah              : streamModule['wah'].params()
      });
      /* eslint-enable dot-notation */
    });
  });

  describe(streamModule.edit.name, () => {
    test('should set edited modules and return previous modules', () => {
      // eslint-disable-next-line dot-notation
      const previousModules = streamModule['modules'];

      const modules = [streamModule.module('delay'), streamModule.module('reverb')];

      expect(streamModule.edit(modules)).toStrictEqual(previousModules);
      expect(modules[0]).toBeInstanceOf(Delay);
      expect(modules[1]).toBeInstanceOf(Reverb);
    });
  });
});
