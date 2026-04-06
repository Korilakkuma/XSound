import type { AmplitudeSpectrumParams } from '/src/SoundModule/Analyser/AmplitudeSpectrum';

import { canvasMock } from '/mock/CanvasMock';
import { AmplitudeSpectrum } from '/src/SoundModule/Analyser/AmplitudeSpectrum';

describe(AmplitudeSpectrum.name, () => {
  const sampleRate = 48000;
  const channel    = 0;

  describe('use `HTMLCanvasElement`', () => {
    const amplitudeSpectrum = new AmplitudeSpectrum(sampleRate, channel);

    amplitudeSpectrum.setup(canvasMock);

    describe(amplitudeSpectrum.setRenderAmplitudeTextsFunction, () => {
      test('should call render method', () => {
        const renderMock = jest.fn();

        amplitudeSpectrum.setRenderAmplitudeTextsFunction(renderMock);
        amplitudeSpectrum.start(new Float32Array([]));

        expect(renderMock).toHaveBeenCalledTimes(1);
      });
    });

    describe(amplitudeSpectrum.param.name, () => {
      const defaultParams: AmplitudeSpectrumParams = {
        unit                  : 'none',
        scale                 : 'linear',
        logarithmicFrequencies: [32, 62.5, 125, 250, 500, 1000, 2000, 4000, 8000, 16000],
        interval              : 1000,
        textInterval          : 1000,
        styles                : {
          shape    : 'line',
          gradients: [
            {
              offset: 0,
              color : 'rgba(0, 128, 255, 1.0)'
            },
            {
              offset: 1,
              color : 'rgba(0, 0, 255, 1.0)'
            }
          ],
          wave     : 'rgba(0, 0, 255, 1.0)',
          grid     : 'rgba(255, 0, 0, 1.0)',
          text     : 'rgba(255, 255, 255, 1.0)',
          font     : {
            family: 'Arial',
            size  : '13px',
            style : 'normal'
          },
          width    : 1.5,
          cap      : 'round',
          join     : 'miter',
          top      : 15,
          right    : 30,
          bottom   : 15,
          left     : 30
        }
      };

      const params: AmplitudeSpectrumParams = {
        unit                  : 'decibel',
        scale                 : 'logarithmic',
        logarithmicFrequencies: [62.5, 125, 250, 500, 1000, 2000, 4000, 8000],
        interval              : 0,
        textInterval          : 120,
        styles                : {
          shape     : 'rect',
          gradients : [
            {
              offset: 0,
              color : 'rgba(0, 128, 255, 0.0)'
            },
            {
              offset: 0.5,
              color : 'rgba(0, 128, 255, 0.5)'
            },
            {
              offset: 1,
              color : 'rgba(0, 0, 255, 1.0)'
            }
          ],
          wave      : 'rgba(255, 255, 255, 0.5)',
          grid      : 'rgba(51, 51, 51, 0.5)',
          text      : 'rgba(221, 221, 221, 1.0)',
          font      : {
            family: 'Helvetica',
            size  : '16px',
            style : 'italic'
          },
          width     : 0,
          cap       : 'square',
          join      : 'round',
          top       : 0,
          right     : 0,
          bottom    : 0,
          left      : 0
        }
      };

      beforeAll(() => {
        amplitudeSpectrum.param(params);
      });

      afterAll(() => {
        amplitudeSpectrum.param(defaultParams);
      });

      test('should return `unit`', () => {
        expect(amplitudeSpectrum.param('unit')).toBe('decibel');
      });

      test('should return `scale`', () => {
        expect(amplitudeSpectrum.param('scale')).toBe('logarithmic');
      });

      test('should return `logarithmicFrequencies`', () => {
        expect(amplitudeSpectrum.param('logarithmicFrequencies')).toStrictEqual([62.5, 125, 250, 500, 1000, 2000, 4000, 8000]);
      });

      test('should return `minFrequency`', () => {
        expect(amplitudeSpectrum.param('minFrequency')).toBeCloseTo(62.5, 1);
      });

      test('should return `maxFrequency`', () => {
        expect(amplitudeSpectrum.param('maxFrequency')).toBeCloseTo(8000, 1);
      });

      test('should return `interval`', () => {
        expect(amplitudeSpectrum.param('interval')).toBeCloseTo(0, 1);
      });

      test('should return `textInterval`', () => {
        expect(amplitudeSpectrum.param('textInterval')).toBeCloseTo(120, 1);
      });

      test('should return `styles`', () => {
        expect(amplitudeSpectrum.param('styles')).toStrictEqual({
          shape    : 'rect',
          gradients: [
            {
              offset: 0,
              color : 'rgba(0, 128, 255, 0.0)'
            },
            {
              offset: 0.5,
              color : 'rgba(0, 128, 255, 0.5)'
            },
            {
              offset: 1,
              color : 'rgba(0, 0, 255, 1.0)'
            }
          ],
          wave     : 'rgba(255, 255, 255, 0.5)',
          grid     : 'rgba(51, 51, 51, 0.5)',
          text     : 'rgba(221, 221, 221, 1.0)',
          font     : {
            family: 'Helvetica',
            size  : '16px',
            style : 'italic'
          },
          width    : 0,
          cap      : 'square',
          join     : 'round',
          top      : 0,
          right    : 0,
          bottom   : 0,
          left     : 0
        });
      });
    });
  });

  describe('use `SVGElement`', () => {
    const amplitudeSpectrum = new AmplitudeSpectrum(sampleRate, channel);

    const svg = document.createElementNS(AmplitudeSpectrum.XMLNS, 'svg');

    svg.appendChild(document.createElementNS(AmplitudeSpectrum.XMLNS, 'path'));

    amplitudeSpectrum.setup(svg);

    describe(amplitudeSpectrum.setRenderAmplitudeTextsFunction, () => {
      test('should call render method', () => {
        const renderMock = jest.fn();

        amplitudeSpectrum.setRenderAmplitudeTextsFunction(renderMock);

        amplitudeSpectrum.start(new Float32Array([]));

        expect(renderMock).toHaveBeenCalledTimes(1);
      });
    });

    describe(amplitudeSpectrum.param.name, () => {
      const defaultParams: AmplitudeSpectrumParams = {
        unit                  : 'none',
        scale                 : 'linear',
        logarithmicFrequencies: [32, 62.5, 125, 250, 500, 1000, 2000, 4000, 8000, 16000],
        interval              : 1000,
        textInterval          : 1000,
        styles                : {
          shape    : 'line',
          gradients: [
            {
              offset: 0,
              color : 'rgba(0, 128, 255, 1.0)'
            },
            {
              offset: 1,
              color : 'rgba(0, 0, 255, 1.0)'
            }
          ],
          wave     : 'rgba(0, 0, 255, 1.0)',
          grid     : 'rgba(255, 0, 0, 1.0)',
          text     : 'rgba(255, 255, 255, 1.0)',
          font     : {
            family: 'Arial',
            size  : '13px',
            style : 'normal'
          },
          width    : 1.5,
          cap      : 'round',
          join     : 'miter',
          top      : 15,
          right    : 30,
          bottom   : 15,
          left     : 30
        }
      };

      const params: AmplitudeSpectrumParams = {
        unit                  : 'decibel',
        scale                 : 'logarithmic',
        logarithmicFrequencies: [62.5, 125, 250, 500, 1000, 2000, 4000, 8000],
        interval              : 0,
        textInterval          : 120,
        styles                : {
          shape     : 'rect',
          gradients : [
            {
              offset: 0,
              color : 'rgba(0, 128, 255, 0.0)'
            },
            {
              offset: 0.5,
              color : 'rgba(0, 128, 255, 0.5)'
            },
            {
              offset: 1,
              color : 'rgba(0, 0, 255, 1.0)'
            }
          ],
          wave      : 'rgba(255, 255, 255, 0.5)',
          grid      : 'rgba(51, 51, 51, 0.5)',
          text      : 'rgba(221, 221, 221, 1.0)',
          font      : {
            family: 'Helvetica',
            size  : '16px',
            style : 'italic'
          },
          width     : 0,
          cap       : 'square',
          join      : 'round',
          top       : 0,
          right     : 0,
          bottom    : 0,
          left      : 0
        }
      };

      beforeAll(() => {
        amplitudeSpectrum.param(params);
      });

      afterAll(() => {
        amplitudeSpectrum.param(defaultParams);
      });

      test('should return `unit`', () => {
        expect(amplitudeSpectrum.param('unit')).toBe('decibel');
      });

      test('should return `scale`', () => {
        expect(amplitudeSpectrum.param('scale')).toBe('logarithmic');
      });

      test('should return `logarithmicFrequencies`', () => {
        expect(amplitudeSpectrum.param('logarithmicFrequencies')).toStrictEqual([62.5, 125, 250, 500, 1000, 2000, 4000, 8000]);
      });

      test('should return `minFrequency`', () => {
        expect(amplitudeSpectrum.param('minFrequency')).toBeCloseTo(62.5, 1);
      });

      test('should return `maxFrequency`', () => {
        expect(amplitudeSpectrum.param('maxFrequency')).toBeCloseTo(8000, 1);
      });

      test('should return `interval`', () => {
        expect(amplitudeSpectrum.param('interval')).toBeCloseTo(0, 1);
      });

      test('should return `textInterval`', () => {
        expect(amplitudeSpectrum.param('textInterval')).toBeCloseTo(120, 1);
      });

      test('should return `styles`', () => {
        expect(amplitudeSpectrum.param('styles')).toStrictEqual({
          shape    : 'rect',
          gradients: [
            {
              offset: 0,
              color : 'rgba(0, 128, 255, 0.0)'
            },
            {
              offset: 0.5,
              color : 'rgba(0, 128, 255, 0.5)'
            },
            {
              offset: 1,
              color : 'rgba(0, 0, 255, 1.0)'
            }
          ],
          wave     : 'rgba(255, 255, 255, 0.5)',
          grid     : 'rgba(51, 51, 51, 0.5)',
          text     : 'rgba(221, 221, 221, 1.0)',
          font     : {
            family: 'Helvetica',
            size  : '16px',
            style : 'italic'
          },
          width    : 0,
          cap      : 'square',
          join     : 'round',
          top      : 0,
          right    : 0,
          bottom   : 0,
          left     : 0
        });
      });
    });
  });
});
