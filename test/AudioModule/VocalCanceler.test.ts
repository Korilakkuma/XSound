import { VocalCanceler, VocalCancelerParams } from '../../src/AudioModule/VocalCanceler';

describe(VocalCanceler.name, () => {
  const vocalcanceler = new VocalCanceler();

  describe(vocalcanceler.start.name, () => {
    expect(vocalcanceler.start(1, 1)).toBe(1);

    vocalcanceler.param({ depth: 0.5 });

    expect(vocalcanceler.start(1, 1)).toBeCloseTo(0.5, 1);
  });

  describe(vocalcanceler.param.name, () => {
    const defaultParams: VocalCancelerParams = {
      depth: 0
    };

    const params: VocalCancelerParams = {
      depth: 1
    };

    beforeAll(() => {
      vocalcanceler.param(params);
    });

    afterEach(() => {
      vocalcanceler.param(defaultParams);
    });

    test('should return `depth`', () => {
      expect(vocalcanceler.param('depth')).toBe(1);
    });
  });

  describe(vocalcanceler.params.name, () => {
    test('should return parameters for vocal canceler as associative array', () => {
      expect(vocalcanceler.params()).toStrictEqual({
        depth: 0
      });
    });
  });
});