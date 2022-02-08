import { NoiseGate, NoiseGateParams } from '../../src/StreamModule/NoiseGate';

describe(NoiseGate.name, () => {
  const noisegate = new NoiseGate();

  describe(noisegate.start.name, () => {
    beforeAll(() => {
      noisegate.param({ level: 0.002 });
    });

    test('should return raw data', () => {
      expect(noisegate.start(0.005)).toBeCloseTo(0.005, 3);
      expect(noisegate.start(-0.005)).toBeCloseTo(-0.005, 3);
    });

    test('should return `0`', () => {
      expect(noisegate.start(0.002)).toBeCloseTo(0, 3);
      expect(noisegate.start(-0.002)).toBeCloseTo(0, 3);
    });
  });

  describe(noisegate.param.name, () => {
    const defaultParams: NoiseGateParams = {
      level: 0
    };

    const params: NoiseGateParams = {
      level: 0.5
    };

    beforeAll(() => {
      noisegate.param(params);
    });

    afterAll(() => {
      noisegate.param(defaultParams);
    });

    test('should return `level`', () => {
      expect(noisegate.param('level')).toBeCloseTo(0.5, 1);
    });
  });

  describe(noisegate.params.name, () => {
    test('should return parameters for noise gate as associative array', () => {
      expect(noisegate.params()).toStrictEqual({
        level: 0
      });
    });
  });
});
