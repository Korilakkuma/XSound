import { AudioContextMock } from '../../../mock/AudioContextMock';
import { NoiseSuppressor, NoiseSuppressorParams } from '../../../src/SoundModule/Effectors/NoiseSuppressor';

describe(NoiseSuppressor.name, () => {
  const context = new AudioContextMock();

  // @ts-ignore
  const noisesuppressor = new NoiseSuppressor(context, 2048);

  // eslint-disable-next-line dot-notation
  describe(noisesuppressor['suppress'].name, () => {
    const bufferSize = 8;
    const inputs     = new Float32Array([0.5, 0.25, 0, -0.25, -0.5, -0.25, 0, 0.25]);
    const outputs    = new Float32Array(bufferSize);

    test('should return raw data (if threshold is `0`)', () => {
      // eslint-disable-next-line dot-notation
      noisesuppressor['suppress'](inputs, outputs, bufferSize);

      expect(outputs).toStrictEqual(inputs);
    });

    test('should return sound data that background noise is removed from', () => {
      noisesuppressor.param({ threshold: 0.3 });

      // eslint-disable-next-line dot-notation
      noisesuppressor['suppress'](inputs, outputs, bufferSize);

      expect(outputs[0]).toBeCloseTo(0.35177671909332275, 5);
      expect(outputs[1]).toBeCloseTo(0.2487436980009079, 5);
      expect(outputs[2]).toBeCloseTo(0, 5);
      expect(outputs[3]).toBeCloseTo(-0.2487436980009079, 5);
      expect(outputs[4]).toBeCloseTo(-0.35177671909332275, 5);
      expect(outputs[5]).toBeCloseTo(-0.2487436980009079, 5);
      expect(outputs[6]).toBeCloseTo(0, 5);
      expect(outputs[7]).toBeCloseTo(0.2487436980009079, 5);
    });
  });

  describe(noisesuppressor.param.name, () => {
    const defaultParams: NoiseSuppressorParams = {
      threshold: 0
    };

    const params: NoiseSuppressorParams = {
      threshold: 0.03
    };

    beforeAll(() => {
      noisesuppressor.param(params);
    });

    afterAll(() => {
      noisesuppressor.param(defaultParams);
    });

    test('should return `threshold`', () => {
      expect(noisesuppressor.param('threshold')).toBeCloseTo(0.03, 2);
    });
  });

  describe(noisesuppressor.params.name, () => {
    test('should return parameters for noise suppressor as associative array', () => {
      expect(noisesuppressor.params()).toStrictEqual({
        state    : true,
        threshold: 0
      });
    });
  });
});
