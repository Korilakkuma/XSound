import { AudioContextMock } from '../../../mocks/AudioContextMock';
import { AnalyserNodeMock } from '../../../mocks/AnalyserNodeMock';
import { Analyser, AnalyserParams } from '../../../src/SoundModule/Analyser';

describe(Analyser.name, () => {
  const context = new AudioContextMock();

  // @ts-ignore
  const analyser = new Analyser(context);

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

    // Setter
    test('should return instance of Analyser', () => {
      expect(analyser.param(params)).toBeInstanceOf(Analyser);
    });

    // Getter
    test('should return fftSize', () => {
      expect(analyser.param('fftSize')).toBe(1024);
    });

    test('should return half of fftSize', () => {
      // HACK:
      expect(analyser.param('frequencyBinCount')).toBe(1024);
    });

    test('should return minDecibels', () => {
      expect(analyser.param('minDecibels')).toBe(-80);
    });

    test('should return maxDecibels', () => {
      expect(analyser.param('maxDecibels')).toBe(-20);
    });

    test('should return smoothingTimeConstant', () => {
      expect(analyser.param('smoothingTimeConstant')).toBe(1);
    });

    analyser.param(defaultParams);
  });

  describe(analyser.get.name, () => {
    test('should return instance of AnalyserNode', () => {
      expect(analyser.get()).toBeInstanceOf(AnalyserNodeMock);
    });
  });

  describe('INPUT and OUTPUT', () => {
    test('should return instance of GainNode', () => {
      expect(analyser.INPUT).toBeInstanceOf(GainNode);
      expect(analyser.OUTPUT).toBeInstanceOf(GainNode);
    });
  });

  describe(analyser.toString.name, () => {
    test('should return [SoundModule Analyser]', () => {
      expect(analyser.toString()).toBe('[SoundModule Analyser]');
    });
  });
});
