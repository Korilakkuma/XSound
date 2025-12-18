import type { FFTParams } from '/src/SoundModule/Analyser/FFT';

import { AnalyserNodeMock } from '/mock/AnalyserNodeMock';
import { OscillatorNodeMock } from '/mock/OscillatorNodeMock';
import { canvasMock } from '/mock/CanvasMock';
import { FFT } from '/src/SoundModule/Analyser/FFT';

describe(FFT.name, () => {
  const sampleRate = 44100;
  const channel    = 0;
  const analyser   = new AnalyserNodeMock();
  const oscillator = new OscillatorNodeMock();

  describe('use `HTMLCanvasElement`', () => {
    // @ts-expect-error Because there is not Web Audio API in Jest environment (Node.js environment), mocks Web Audio API
    const fft = new FFT(sampleRate, channel, analyser);

    fft.setup(canvasMock);

    describe(fft.connect.name, () => {
      test('should call `connect` method', () => {
        const connectMock = jest.fn();

        const originalConnect = fft.connect;

        fft.connect = connectMock;

        // @ts-expect-error Because there is not Web Audio API in Jest environment (Node.js environment), mocks Web Audio API
        fft.connect(oscillator);

        expect(connectMock).toHaveBeenCalledTimes(1);

        fft.connect = originalConnect;
      });
    });

    describe(fft.param.name, () => {
      const defaultParams: FFTParams = {
        type                  : 'uint',
        size                  : 256,
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

      const params: FFTParams = {
        type                  : 'float',
        size                  : 128,
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
        fft.param(params);
      });

      afterAll(() => {
        fft.param(defaultParams);
      });

      test('should return `type`', () => {
        expect(fft.param('type')).toBe('float');
      });

      test('should return `size`', () => {
        expect(fft.param('size')).toBe(128);
      });

      test('should return `scale`', () => {
        expect(fft.param('scale')).toBe('logarithmic');
      });

      test('should return `logarithmicFrequencies`', () => {
        expect(fft.param('logarithmicFrequencies')).toStrictEqual([62.5, 125, 250, 500, 1000, 2000, 4000, 8000]);
      });

      test('should return `minFrequency`', () => {
        expect(fft.param('minFrequency')).toBeCloseTo(62.5, 1);
      });

      test('should return `maxFrequency`', () => {
        expect(fft.param('maxFrequency')).toBeCloseTo(8000, 1);
      });

      test('should return `interval`', () => {
        expect(fft.param('interval')).toBeCloseTo(0, 1);
      });

      test('should return `textInterval`', () => {
        expect(fft.param('textInterval')).toBeCloseTo(120, 1);
      });

      test('should return `styles`', () => {
        expect(fft.param('styles')).toStrictEqual({
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
    // @ts-expect-error Because there is not Web Audio API in Jest environment (Node.js environment), mocks Web Audio API
    const fft = new FFT(sampleRate, channel, analyser);

    const svg = document.createElementNS(FFT.XMLNS, 'svg');

    svg.appendChild(document.createElementNS(FFT.XMLNS, 'path'));

    fft.setup(svg);

    describe(fft.connect.name, () => {
      test('should call `connect` method', () => {
        const connectMock = jest.fn();

        const originalConnect = fft.connect;

        fft.connect = connectMock;

        // @ts-expect-error Because there is not Web Audio API in Jest environment (Node.js environment), mocks Web Audio API
        fft.connect(oscillator);

        expect(connectMock).toHaveBeenCalledTimes(1);

        fft.connect = originalConnect;
      });
    });

    describe(fft.param.name, () => {
      const defaultParams: FFTParams = {
        type                  : 'uint',
        size                  : 256,
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

      const params: FFTParams = {
        type                  : 'float',
        size                  : 128,
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
        fft.param(params);
      });

      afterAll(() => {
        fft.param(defaultParams);
      });

      test('should return `type`', () => {
        expect(fft.param('type')).toBe('float');
      });

      test('should return `size`', () => {
        expect(fft.param('size')).toBe(128);
      });

      test('should return `scale`', () => {
        expect(fft.param('scale')).toBe('logarithmic');
      });

      test('should return `logarithmicFrequencies`', () => {
        expect(fft.param('logarithmicFrequencies')).toStrictEqual([62.5, 125, 250, 500, 1000, 2000, 4000, 8000]);
      });

      test('should return `minFrequency`', () => {
        expect(fft.param('minFrequency')).toBeCloseTo(62.5, 1);
      });

      test('should return `maxFrequency`', () => {
        expect(fft.param('maxFrequency')).toBeCloseTo(8000, 1);
      });

      test('should return `interval`', () => {
        expect(fft.param('interval')).toBeCloseTo(0, 1);
      });

      test('should return `textInterval`', () => {
        expect(fft.param('textInterval')).toBeCloseTo(120, 1);
      });

      test('should return `styles`', () => {
        expect(fft.param('styles')).toStrictEqual({
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
