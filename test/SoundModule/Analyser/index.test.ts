import { AudioContextMock } from '../../../mocks/AudioContextMock';
import { AnalyserNodeMock } from '../../../mocks/AnalyserNodeMock';
import { Analyser, AnalyserParams, Channel } from '../../../src/SoundModule/Analyser';
import { TimeOverview } from '../../../src/SoundModule/Analyser/TimeOverview';
import { Time } from '../../../src/SoundModule/Analyser/Time';
import { FFT } from '../../../src/SoundModule/Analyser/FFT';

jest.useFakeTimers();

describe(Analyser.name, () => {
  const context = new AudioContextMock();

  // @ts-ignore
  const analyser = new Analyser(context);

  const channelL: Channel = 0;
  const channelR: Channel = 1;

  afterEach(() => {
    jest.clearAllTimers();
  });

  describe(analyser.start.name, () => {
    test('should call method for drawing left channel time overview', () => {
      const originalStart = TimeOverview.prototype.start;

      const startMock = jest.fn();

      TimeOverview.prototype.start = startMock;

      const buffer = context.createBuffer(1);

      // @ts-ignore
      analyser.start('timeoverview', channelL, buffer);

      expect(startMock).toHaveBeenCalledTimes(1);
      expect(startMock).toHaveBeenCalledWith(buffer.getChannelData(0));

      TimeOverview.prototype.start = originalStart;
    });

    test('should call method for drawing left and right channel time overview', () => {
      const originalStart = TimeOverview.prototype.start;

      const startMock = jest.fn();

      TimeOverview.prototype.start = startMock;

      const buffer = context.createBuffer(2);

      // @ts-ignore
      analyser.start('timeoverview', channelL, buffer);

      // @ts-ignore
      analyser.start('timeoverview', channelR, buffer);

      expect(startMock).toHaveBeenCalledTimes(2);
      expect(startMock).toHaveBeenCalledWith(buffer.getChannelData(0));
      expect(startMock).toHaveBeenCalledWith(buffer.getChannelData(1));

      TimeOverview.prototype.start = originalStart;
    });

    test('should call method for drawing time domain on real time', () => {
      const originalStart = Time.prototype.start;

      const startMock = jest.fn();

      Time.prototype.start = startMock;

      analyser.start('time');

      expect(startMock).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(1000);

      expect(startMock).toHaveBeenCalledTimes(2);

      analyser.stop('time');

      Time.prototype.start = originalStart;
    });

    test('should call method for drawing frequency domain (spectrum) on real time', () => {
      const originalStart = FFT.prototype.start;

      const startMock = jest.fn();

      FFT.prototype.start = startMock;

      analyser.start('fft');

      expect(startMock).toHaveBeenCalledTimes(1);

      analyser.stop('fft');

      FFT.prototype.start = originalStart;
    });

    test('should call method for drawing frequency domain (spectrum) on real time (if interval is less than 0)', () => {
      const originalStart = FFT.prototype.start;

      const startMock = jest.fn();

      FFT.prototype.start = startMock;

      analyser.domain('fft', channelL).param({ interval: -1 });
      analyser.start('fft');

      expect(startMock).toHaveBeenCalledTimes(1);

      jest.advanceTimersToNextTimer(1);

      expect(startMock).toHaveBeenCalledTimes(2);

      analyser.stop('fft');
      analyser.domain('fft', channelL).param({ interval: 1000 });

      FFT.prototype.start = originalStart;
    });
  });

  describe(analyser.stop.name, () => {
    beforeEach(() => {
      jest.spyOn(window, 'requestAnimationFrame').mockImplementation(() => {
        return 1000;
      });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    describe('Time domain', () => {
      test('should call method for stopping visualization in time domain', () => {
        const originalClearTimeout = window.clearTimeout;

        const clearTimeoutMock = jest.fn();

        Object.defineProperty(window, 'clearTimeout', {
          configurable: true,
          writable    : true,
          value       : clearTimeoutMock
        });

        analyser.start('time');
        analyser.stop('time');

        expect(clearTimeoutMock).toHaveBeenCalledTimes(1);

        jest.advanceTimersByTime(1000);

        expect(clearTimeoutMock).toHaveBeenCalledTimes(1);

        window.clearTimeout = originalClearTimeout;
      });

      test('should call method for stopping visualization in time domain (if interval is less than 0)', () => {
        const originalCancelAnimationFrame = window.cancelAnimationFrame;

        const cancelAnimationFrameMock = jest.fn();

        Object.defineProperty(window, 'cancelAnimationFrame', {
          configurable: true,
          writable    : true,
          value       : cancelAnimationFrameMock
        });

        analyser.domain('time', channelL).param({ interval: -1 });
        analyser.start('time');
        analyser.stop('time');

        expect(cancelAnimationFrameMock).toHaveBeenCalledTimes(1);

        jest.advanceTimersToNextTimer(1);

        expect(cancelAnimationFrameMock).toHaveBeenCalledTimes(1);

        analyser.domain('time', channelL).param({ interval: 1000 });

        window.cancelAnimationFrame = originalCancelAnimationFrame;
      });
    });

    describe('Frequency domain (Spectrum)', () => {
      test('should call method for stopping visualization in frequency domain', () => {
        const originalClearTimeout = window.clearTimeout;

        const clearTimeoutMock = jest.fn();

        Object.defineProperty(window, 'clearTimeout', {
          configurable: true,
          writable    : true,
          value       : clearTimeoutMock
        });

        analyser.start('fft');
        analyser.stop('fft');

        expect(clearTimeoutMock).toHaveBeenCalledTimes(1);

        jest.advanceTimersByTime(1000);

        expect(clearTimeoutMock).toHaveBeenCalledTimes(1);

        window.clearTimeout = originalClearTimeout;
      });

      test('should call method for stopping visualization in frequency domain (if interval is less than 0)', () => {
        const originalCancelAnimationFrame = window.cancelAnimationFrame;

        const cancelAnimationFrameMock = jest.fn();

        Object.defineProperty(window, 'cancelAnimationFrame', {
          configurable: true,
          writable    : true,
          value       : cancelAnimationFrameMock
        });

        analyser.domain('fft', channelL).param({ interval: -1 });
        analyser.start('fft');
        analyser.stop('fft');

        expect(cancelAnimationFrameMock).toHaveBeenCalledTimes(1);

        jest.advanceTimersToNextTimer(1);

        expect(cancelAnimationFrameMock).toHaveBeenCalledTimes(1);

        analyser.domain('fft', channelL).param({ interval: 1000 });

        window.cancelAnimationFrame = originalCancelAnimationFrame;
      });
    });
  });

  describe(analyser.param.name, () => {
    const defaultParams: AnalyserParams = {
      fftSize              : 2048,
      minDecibels          : -100,
      maxDecibels          : -30,
      smoothingTimeConstant: 0.8
    };

    const params: AnalyserParams = {
      fftSize              : 1024,
      minDecibels          : -80,
      maxDecibels          : -20,
      smoothingTimeConstant: 1
    };

    beforeAll(() => {
      analyser.param(params);
    });

    afterAll(() => {
      analyser.param(defaultParams);
    });

    test('should return `fftSize`', () => {
      expect(analyser.param('fftSize')).toBe(1024);
    });

    test('should return half of `fftSize`', () => {
      // HACK:
      expect(analyser.param('frequencyBinCount')).toBe(1024);
    });

    test('should return `minDecibels`', () => {
      expect(analyser.param('minDecibels')).toBe(-80);
    });

    test('should return `maxDecibels`', () => {
      expect(analyser.param('maxDecibels')).toBe(-20);
    });

    test('should return `smoothingTimeConstant`', () => {
      expect(analyser.param('smoothingTimeConstant')).toBe(1);
    });
  });

  describe(analyser.domain.name, () => {
    test('should return instance of `TimeOverview`', () => {
      expect(analyser.domain('timeoverview', channelL)).toBeInstanceOf(TimeOverview);
      expect(analyser.domain('timeoverview', channelR)).toBeInstanceOf(TimeOverview);
    });

    test('should return instance of `Time`', () => {
      expect(analyser.domain('time', channelL)).toBeInstanceOf(Time);
    });

    test('should return instance of `FFT`', () => {
      expect(analyser.domain('fft', channelL)).toBeInstanceOf(FFT);
    });
  });

  describe(analyser.get.name, () => {
    test('should return instance of `AnalyserNode`', () => {
      expect(analyser.get()).toBeInstanceOf(AnalyserNodeMock);
    });
  });
});
