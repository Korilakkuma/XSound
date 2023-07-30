import { AudioContextMock } from '/mock/AudioContextMock';
import { Track } from '/src/SoundModule/Recorder/Track';
import { Recorder, RecorderParams } from '/src/SoundModule/Recorder';

describe(Recorder.name, () => {
  const context = new AudioContextMock();

  // @ts-ignore
  const recorder = new Recorder(context);

  const numberOfChannels = 2;
  const numberOfTracks   = 4;

  recorder.setup(numberOfChannels, numberOfTracks);

  describe(recorder.ready.name, () => {
    test('should return track number', () => {
      recorder.ready(0);
      expect(recorder.get()).toBe(0);

      recorder.ready(3);
      expect(recorder.get()).toBe(3);
    });

    test('should return -1', () => {
      recorder.ready(-1);
      expect(recorder.get()).toBe(-1);

      recorder.ready(4);
      expect(recorder.get()).toBe(-1);
    });
  });

  describe(recorder.stop.name, () => {
    test('should return `-1`', () => {
      recorder.ready(3);
      recorder.stop();
      expect(recorder.get()).toBe(-1);
    });
  });

  describe(recorder.param.name, () => {
    const defaultParams: RecorderParams = {
      '0': 1,
      '1': 1
    };

    const params: RecorderParams = {
      '0': 0.5,
      '1': 0.5
    };

    beforeAll(() => {
      recorder.param(params);
    });

    afterAll(() => {
      recorder.param(defaultParams);
    });

    test('should return channel gain', () => {
      expect(recorder.param('0')).toBeCloseTo(0.5, 1);
      expect(recorder.param('1')).toBeCloseTo(0.5, 1);
    });
  });

  describe(recorder.clear.name, () => {
    test('should call `clear` method', () => {
      const originalClear = Track.prototype.clear;
      const clearMock     = jest.fn();

      Track.prototype.clear = clearMock;

      recorder.clear(3);

      expect(clearMock).toHaveBeenCalledTimes(2);

      recorder.clear(-1);

      expect(clearMock).toHaveBeenCalledTimes(10);

      Track.prototype.clear = originalClear;
    });
  });

  describe(recorder.create.name, () => {
    const originalHas = recorder.has;

    // eslint-disable-next-line dot-notation
    const originalMixTrack = recorder['mixTrack'];

    const originalCreateObjectURL = URL.createObjectURL;

    beforeAll(() => {
      const hasMock      = jest.fn(() => true);
      const mixTrackMock = jest.fn(() => new Float32Array([1, 0, -1, 0]));

      recorder.has = hasMock;

      // eslint-disable-next-line dot-notation
      recorder['mixTrack'] = mixTrackMock;

      Object.defineProperty(URL, 'createObjectURL', {
        configurable: true,
        writable    : true,
        value       : () => 'https://xxx'
      });
    });

    afterAll(() => {
      recorder.has = originalHas;

      // eslint-disable-next-line dot-notation
      recorder['mixTrack'] = originalMixTrack;

      URL.createObjectURL = originalCreateObjectURL;
    });

    test('should create WAVE file (the highest quality)', () => {
      const waveAsBase64    = recorder.create(-1, 2, 16, 'base64');
      const waveAsDataURL   = recorder.create(-1, 2, 16, 'dataURL');
      const waveAsBlob      = recorder.create(-1, 2, 16, 'blob');
      const waveAsObjectURL = recorder.create(-1, 2, 16, 'objectURL');

      expect(waveAsBase64).toBe('UklGRjQAAABXQVZFZm10IBAAAAABAAIARKwAABCxAgAEABAAZGF0YRAAAAD/f/9/AAAAAACAAIAAAAAA');
      expect(waveAsDataURL).toBe('data:audio/wav;base64,UklGRjQAAABXQVZFZm10IBAAAAABAAIARKwAABCxAgAEABAAZGF0YRAAAAD/f/9/AAAAAACAAIAAAAAA');
      expect(waveAsBlob).toBeInstanceOf(Blob);
      expect(waveAsObjectURL).toBe('https://xxx');
    });

    test('should create WAVE file (the lowest quality)', () => {
      const waveAsBase64    = recorder.create(3, 1, 8, 'base64');
      const waveAsDataURL   = recorder.create(3, 1, 8, 'dataURL');
      const waveAsBlob      = recorder.create(3, 1, 8, 'blob');
      const waveAsObjectURL = recorder.create(3, 1, 8, 'objectURL');

      expect(waveAsBase64).toBe('UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAESsAAABAAgAZGF0YQAAAAA=');
      expect(waveAsDataURL).toBe('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAESsAAABAAgAZGF0YQAAAAA=');
      expect(waveAsBlob).toBeInstanceOf(Blob);
      expect(waveAsObjectURL).toBe('https://xxx');
    });
  });

  describe(recorder.has.name, () => {
    test('should return `true`', () => {
      const originalHas = Track.prototype.has;
      const hasMock     = jest.fn(() => true);

      Track.prototype.has = hasMock;

      expect(recorder.has(-1, -1)).toBe(true);
      expect(recorder.has(1, -1)).toBe(true);
      expect(recorder.has(1, 1)).toBe(true);

      Track.prototype.has = originalHas;
    });

    test('should return `false`', () => {
      const originalHas = Track.prototype.has;
      const hasMock     = jest.fn(() => false);

      Track.prototype.has = hasMock;

      expect(recorder.has(-1, -1)).toBe(false);
      expect(recorder.has(1, -1)).toBe(false);
      expect(recorder.has(1, 1)).toBe(false);

      Track.prototype.has = originalHas;
    });
  });

  describe(recorder.hasChannel.name, () => {
    test('should return `true`', () => {
      expect(recorder.hasChannel(0)).toBe(true);
      expect(recorder.hasChannel(1)).toBe(true);
    });

    test('should return `false`', () => {
      expect(recorder.hasChannel(-1)).toBe(false);
    });
  });

  describe(recorder.hasTrack.name, () => {
    test('should return `true`', () => {
      expect(recorder.hasTrack(0)).toBe(true);
      expect(recorder.hasTrack(1)).toBe(true);
      expect(recorder.hasTrack(2)).toBe(true);
      expect(recorder.hasTrack(3)).toBe(true);
    });

    test('should return `false`', () => {
      expect(recorder.hasTrack(-1)).toBe(false);
      expect(recorder.hasTrack(4)).toBe(false);
    });
  });
});
