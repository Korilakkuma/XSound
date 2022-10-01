import { AudioContextMock } from '../../../mock/AudioContextMock';
import { VocalCanceler, VocalCancelerParams } from '../../../src/SoundModule/Effectors/VocalCanceler';

describe(VocalCanceler.name, () => {
  const context = new AudioContextMock();

  // @ts-ignore
  const vocalcanceler = new VocalCanceler(context, 2048);

  // eslint-disable-next-line dot-notation
  describe(vocalcanceler['cancel'].name, () => {
    test('should return difference between left and right channel', () => {
      // eslint-disable-next-line dot-notation
      expect(vocalcanceler['cancel'](1, 1)).toBeCloseTo(1, 1);

      vocalcanceler.param({ depth: 0.5 });

      // eslint-disable-next-line dot-notation
      expect(vocalcanceler['cancel'](1, 1)).toBeCloseTo(0.5, 1);
    });
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
      expect(vocalcanceler.param('depth')).toBeCloseTo(1, 1);
    });
  });

  describe(vocalcanceler.params.name, () => {
    test('should return parameters for vocal canceler as associative array', () => {
      expect(vocalcanceler.params()).toStrictEqual({
        state: true,
        depth: 0
      });
    });
  });
});
