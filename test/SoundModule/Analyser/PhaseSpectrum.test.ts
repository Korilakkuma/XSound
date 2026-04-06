import type { PhaseSpectrumParams } from '/src/SoundModule/Analyser/PhaseSpectrum';

import { canvasMock } from '/mock/CanvasMock';
import { PhaseSpectrum } from '/src/SoundModule/Analyser/PhaseSpectrum';

describe(PhaseSpectrum.name, () => {
  const sampleRate = 48000;
  const channel    = 0;

  describe('use `HTMLCanvasElement`', () => {
    const phaseSpectrum = new PhaseSpectrum(sampleRate, channel);

    phaseSpectrum.setup(canvasMock);

    describe(phaseSpectrum.setRenderPhaseTextsFunction, () => {
      test('should call render method', () => {
        const renderMock = jest.fn();

        phaseSpectrum.setRenderPhaseTextsFunction(renderMock);
        phaseSpectrum.start(new Float32Array([]));

        expect(renderMock).toHaveBeenCalledTimes(1);
      });
    });

    describe(phaseSpectrum.param.name, () => {
      const defaultParams: PhaseSpectrumParams = {
        unit                  : 'radian',
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

      const params: PhaseSpectrumParams = {
        unit                  : 'degree',
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
        phaseSpectrum.param(params);
      });

      afterAll(() => {
        phaseSpectrum.param(defaultParams);
      });

      test('should return `unit`', () => {
        expect(phaseSpectrum.param('unit')).toBe('degree');
      });

      test('should return `scale`', () => {
        expect(phaseSpectrum.param('scale')).toBe('logarithmic');
      });

      test('should return `logarithmicFrequencies`', () => {
        expect(phaseSpectrum.param('logarithmicFrequencies')).toStrictEqual([62.5, 125, 250, 500, 1000, 2000, 4000, 8000]);
      });

      test('should return `minFrequency`', () => {
        expect(phaseSpectrum.param('minFrequency')).toBeCloseTo(62.5, 1);
      });

      test('should return `maxFrequency`', () => {
        expect(phaseSpectrum.param('maxFrequency')).toBeCloseTo(8000, 1);
      });

      test('should return `interval`', () => {
        expect(phaseSpectrum.param('interval')).toBeCloseTo(0, 1);
      });

      test('should return `textInterval`', () => {
        expect(phaseSpectrum.param('textInterval')).toBeCloseTo(120, 1);
      });

      test('should return `styles`', () => {
        expect(phaseSpectrum.param('styles')).toStrictEqual({
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
    const phaseSpectrum = new PhaseSpectrum(sampleRate, channel);

    const svg = document.createElementNS(PhaseSpectrum.XMLNS, 'svg');

    svg.appendChild(document.createElementNS(PhaseSpectrum.XMLNS, 'path'));

    phaseSpectrum.setup(svg);

    describe(phaseSpectrum.setRenderPhaseTextsFunction, () => {
      test('should call render method', () => {
        const renderMock = jest.fn();

        phaseSpectrum.setRenderPhaseTextsFunction(renderMock);
        phaseSpectrum.start(new Float32Array([]));

        expect(renderMock).toHaveBeenCalledTimes(1);
      });
    });

    describe(phaseSpectrum.param.name, () => {
      const defaultParams: PhaseSpectrumParams = {
        unit                  : 'radian',
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

      const params: PhaseSpectrumParams = {
        unit                  : 'degree',
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
        phaseSpectrum.param(params);
      });

      afterAll(() => {
        phaseSpectrum.param(defaultParams);
      });

      test('should return `unit`', () => {
        expect(phaseSpectrum.param('unit')).toBe('degree');
      });

      test('should return `scale`', () => {
        expect(phaseSpectrum.param('scale')).toBe('logarithmic');
      });

      test('should return `logarithmicFrequencies`', () => {
        expect(phaseSpectrum.param('logarithmicFrequencies')).toStrictEqual([62.5, 125, 250, 500, 1000, 2000, 4000, 8000]);
      });

      test('should return `minFrequency`', () => {
        expect(phaseSpectrum.param('minFrequency')).toBeCloseTo(62.5, 1);
      });

      test('should return `maxFrequency`', () => {
        expect(phaseSpectrum.param('maxFrequency')).toBeCloseTo(8000, 1);
      });

      test('should return `interval`', () => {
        expect(phaseSpectrum.param('interval')).toBeCloseTo(0, 1);
      });

      test('should return `textInterval`', () => {
        expect(phaseSpectrum.param('textInterval')).toBeCloseTo(120, 1);
      });

      test('should return `styles`', () => {
        expect(phaseSpectrum.param('styles')).toStrictEqual({
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
