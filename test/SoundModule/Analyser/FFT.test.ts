import { canvasMock } from '../../../mocks/CanvasMock';
import { Channel } from '../../../src/SoundModule/Analyser';
import { FFT, FFTParams } from '../../../src/SoundModule/Analyser/FFT';

describe(FFT.name, () => {
  const sampleRate       = 44100;
  const channel: Channel = 0;

  describe('use `HTMLCanvasElement`', () => {
    const fft = new FFT(sampleRate, channel);

    fft.setup(canvasMock);

    describe(fft.param.name, () => {
      const defaultParams: FFTParams = {
        type        : 'uint',
        size        : 256,
        textInterval: 1000,
        interval    : 1000,
        styles      : {
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
        type        : 'float',
        size        : 128,
        textInterval: 120,
        interval    : 0,
        styles      : {
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

      test('should return `textInterval`', () => {
        expect(fft.param('textInterval')).toBe(120);
      });

      test('should return `interval`', () => {
        expect(fft.param('interval')).toBe(0);
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
    const fft = new FFT(sampleRate, channel);

    const svg = document.createElement('svg');

    svg.appendChild(document.createElementNS(FFT.XMLNS, 'path'));

    fft.setup(svg);

    describe(fft.param.name, () => {
      const defaultParams: FFTParams = {
        type        : 'uint',
        size        : 256,
        textInterval: 1000,
        interval    : 1000,
        styles      : {
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
        type        : 'float',
        size        : 128,
        textInterval: 120,
        interval    : 0,
        styles      : {
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

      test('should return `textInterval`', () => {
        expect(fft.param('textInterval')).toBe(120);
      });

      test('should return `interval`', () => {
        expect(fft.param('interval')).toBe(0);
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
