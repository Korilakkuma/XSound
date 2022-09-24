import { AudioContextMock } from '../../mock/AudioContextMock';
import { Analyser } from '../../src/SoundModule/Analyser';
import { Recorder } from '../../src/SoundModule/Recorder';
import { Session } from '../../src/SoundModule/Session';
import { Autopanner } from '../../src/SoundModule/Effectors/Autopanner';
import { Chorus } from '../../src/SoundModule/Effectors/Chorus';
import { Compressor } from './../../src/SoundModule/Effectors/Compressor';
import { Delay } from '../../src/SoundModule/Effectors/Delay';
import { Distortion } from '../../src/SoundModule/Effectors/Distortion';
import { EnvelopeGenerator } from '../../src/SoundModule/Effectors/EnvelopeGenerator';
import { Equalizer } from '../../src/SoundModule/Effectors/Equalizer';
import { Filter } from '../../src/SoundModule/Effectors/Filter';
import { Flanger } from '../../src/SoundModule/Effectors/Flanger';
import { Listener } from '../../src/SoundModule/Effectors/Listener';
import { NoiseGate } from '../../src/SoundModule/Effectors/NoiseGate';
import { NoiseSuppressor } from '../../src/SoundModule/Effectors/NoiseSuppressor';
import { Panner } from '../../src/SoundModule/Effectors/Panner';
import { Phaser } from '../../src/SoundModule/Effectors/Phaser';
import { PitchShifter } from './../../src/SoundModule/Effectors/PitchShifter';
import { Reverb } from '../../src/SoundModule/Effectors/Reverb';
import { Ringmodulator } from '../../src/SoundModule/Effectors/Ringmodulator';
import { Stereo } from '../../src/SoundModule/Effectors/Stereo';
import { Tremolo } from '../../src/SoundModule/Effectors/Tremolo';
import { Wah } from '../../src/SoundModule/Effectors/Wah';
import { StreamModule, StreamModuleParams } from '../../src/StreamModule';

type Params = Partial<Pick<StreamModuleParams, 'mastervolume' | 'output' | 'track'>>;

// TODO: Add tests if use `MediaStreamTrackAudioSourceNode`
describe(StreamModule.name, () => {
  const context = new AudioContextMock();

  // @ts-ignore
  const streamModule = new StreamModule(context, 2048);

  streamModule.setup({
    video: true
  });

  describe(streamModule.setup.name, () => {
    test('should return merged `MediaStreamConstraints`', () => {
      // eslint-disable-next-line dot-notation
      expect(streamModule['constraints']).toStrictEqual({
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

          /* eslint-disable dot-notation */
          expect(streamModule['sources'].length).toBe(0);
          expect(streamModule['processor'].onaudioprocess).toBe(null);
          /* eslint-enable dot-notation */

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
      expect(streamModule.module('session')).toBeInstanceOf(Session);
      expect(streamModule.module('autopanner')).toBeInstanceOf(Autopanner);
      expect(streamModule.module('chorus')).toBeInstanceOf(Chorus);
      expect(streamModule.module('compressor')).toBeInstanceOf(Compressor);
      expect(streamModule.module('delay')).toBeInstanceOf(Delay);
      expect(streamModule.module('distortion')).toBeInstanceOf(Distortion);
      expect(streamModule.module('envelopegenerator')).toBeInstanceOf(EnvelopeGenerator);
      expect(streamModule.module('equalizer')).toBeInstanceOf(Equalizer);
      expect(streamModule.module('filter')).toBeInstanceOf(Filter);
      expect(streamModule.module('flanger')).toBeInstanceOf(Flanger);
      expect(streamModule.module('listener')).toBeInstanceOf(Listener);
      expect(streamModule.module('noisegate')).toBeInstanceOf(NoiseGate);
      expect(streamModule.module('noisesuppressor')).toBeInstanceOf(NoiseSuppressor);
      expect(streamModule.module('panner')).toBeInstanceOf(Panner);
      expect(streamModule.module('phaser')).toBeInstanceOf(Phaser);
      expect(streamModule.module('pitchshifter')).toBeInstanceOf(PitchShifter);
      expect(streamModule.module('reverb')).toBeInstanceOf(Reverb);
      expect(streamModule.module('ringmodulator')).toBeInstanceOf(Ringmodulator);
      expect(streamModule.module('stereo')).toBeInstanceOf(Stereo);
      expect(streamModule.module('tremolo')).toBeInstanceOf(Tremolo);
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
        envelopegenerator: streamModule['envelopegenerator'].params(),
        stereo           : streamModule['stereo'].params(),
        compressor       : streamModule['compressor'].params(),
        distortion       : streamModule['distortion'].params(),
        wah              : streamModule['wah'].params(),
        pitchshifter     : streamModule['pitchshifter'].params(),
        equalizer        : streamModule['equalizer'].params(),
        filter           : streamModule['filter'].params(),
        autopanner       : streamModule['autopanner'].params(),
        tremolo          : streamModule['tremolo'].params(),
        ringmodulator    : streamModule['ringmodulator'].params(),
        phaser           : streamModule['phaser'].params(),
        flanger          : streamModule['flanger'].params(),
        chorus           : streamModule['chorus'].params(),
        delay            : streamModule['delay'].params(),
        reverb           : streamModule['reverb'].params(),
        panner           : streamModule['panner'].params(),
        listener         : streamModule['listener'].params(),
        noisegate        : streamModule['noisegate'].params(),
        noisesuppressor  : streamModule['noisesuppressor'].params()
      });
      /* eslint-enable dot-notation */
    });
  });
});
