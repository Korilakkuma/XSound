import type { SpectrogramParams } from '/src/SoundModule/Analyser/Spectrogram';

import { AnalyserNodeMock } from '/mock/AnalyserNodeMock';
import { OscillatorNodeMock } from '/mock/OscillatorNodeMock';
import { canvasMock } from '/mock/CanvasMock';
import { Spectrogram } from '/src/SoundModule/Analyser/Spectrogram';

describe(Spectrogram.name, () => {
  const sampleRate = 44100;
  const channel    = 0;
  const analyser   = new AnalyserNodeMock();
  const oscillator = new OscillatorNodeMock();

  describe('use `HTMLCanvasElement`', () => {
    // @ts-expect-error Because there is not Web Audio API in Jest environment (Node.js environment), mocks Web Audio API
    const spectrogram = new Spectrogram(sampleRate, channel, analyser);

    spectrogram.setup(canvasMock);

    describe(spectrogram.connect.name, () => {
      test('should call `connect` method', () => {
        const connectMock = jest.fn();

        const originalConnect = spectrogram.connect;

        spectrogram.connect = connectMock;

        // @ts-expect-error Because there is not Web Audio API in Jest environment (Node.js environment), mocks Web Audio API
        spectrogram.connect(oscillator);

        expect(connectMock).toHaveBeenCalledTimes(1);

        spectrogram.connect = originalConnect;
      });
    });

    describe(spectrogram.param.name, () => {
      const defaultParams: SpectrogramParams = {
        interval                   : 40,
        duration                   : 10,
        plotInterval               : 4,
        linearFrequencyTextInterval: 8,
        timeTextInterval           : 16,
        logarithmicFrequencies     : [32, 62.5, 125, 250, 500, 1000, 2000, 4000, 8000, 16000],
        styles                     : {
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

      const params: SpectrogramParams = {
        interval                   : 2.5,
        duration                   : 600.25,
        plotInterval               : 8,
        linearFrequencyTextInterval: 16,
        timeTextInterval           : 24,
        logarithmicFrequencies     : [62.5, 125, 250, 500, 1000, 2000, 4000, 8000],
        styles                     : {
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
        spectrogram.param(params);
      });

      afterAll(() => {
        spectrogram.param(defaultParams);
      });

      test('should return `interval`', () => {
        expect(spectrogram.param('interval')).toBeCloseTo(2.5, 1);
      });

      test('should return `duration`', () => {
        expect(spectrogram.param('duration')).toBeCloseTo(600.25, 2);
      });

      test('should return `plotInterval`', () => {
        expect(spectrogram.param('plotInterval')).toBe(8);
      });

      test('should return `linearFrequencyTextInterval`', () => {
        expect(spectrogram.param('linearFrequencyTextInterval')).toBe(16);
      });

      test('should return `timeTextInterval`', () => {
        expect(spectrogram.param('timeTextInterval')).toBe(24);
      });

      test('should return `logarithmicFrequencies`', () => {
        expect(spectrogram.param('logarithmicFrequencies')).toStrictEqual([62.5, 125, 250, 500, 1000, 2000, 4000, 8000]);
      });

      test('should return `styles`', () => {
        expect(spectrogram.param('styles')).toStrictEqual({
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
    const spectrogram = new Spectrogram(sampleRate, channel, analyser);

    const svg = document.createElementNS(Spectrogram.XMLNS, 'svg');

    svg.appendChild(document.createElementNS(Spectrogram.XMLNS, 'path'));

    spectrogram.setup(svg);

    describe(spectrogram.connect.name, () => {
      test('should call `connect` method', () => {
        const connectMock = jest.fn();

        const originalConnect = spectrogram.connect;

        spectrogram.connect = connectMock;

        // @ts-expect-error Because there is not Web Audio API in Jest environment (Node.js environment), mocks Web Audio API
        spectrogram.connect(oscillator);

        expect(connectMock).toHaveBeenCalledTimes(1);

        spectrogram.connect = originalConnect;
      });
    });

    describe(spectrogram.param.name, () => {
      const defaultParams: SpectrogramParams = {
        interval                   : 40,
        duration                   : 10,
        plotInterval               : 4,
        linearFrequencyTextInterval: 8,
        timeTextInterval           : 16,
        logarithmicFrequencies     : [32, 62.5, 125, 250, 500, 1000, 2000, 4000, 8000, 16000],
        styles                     : {
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

      const params: SpectrogramParams = {
        interval                   : 2.5,
        duration                   : 600.25,
        plotInterval               : 8,
        linearFrequencyTextInterval: 16,
        timeTextInterval           : 24,
        logarithmicFrequencies     : [62.5, 125, 250, 500, 1000, 2000, 4000, 8000],
        styles                     : {
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
        spectrogram.param(params);
      });

      afterAll(() => {
        spectrogram.param(defaultParams);
      });

      test('should return `interval`', () => {
        expect(spectrogram.param('interval')).toBeCloseTo(2.5, 1);
      });

      test('should return `duration`', () => {
        expect(spectrogram.param('duration')).toBeCloseTo(600.25, 2);
      });

      test('should return `plotInterval`', () => {
        expect(spectrogram.param('plotInterval')).toBe(8);
      });

      test('should return `linearFrequencyTextInterval`', () => {
        expect(spectrogram.param('linearFrequencyTextInterval')).toBe(16);
      });

      test('should return `logarithmicFrequencies`', () => {
        expect(spectrogram.param('logarithmicFrequencies')).toStrictEqual([62.5, 125, 250, 500, 1000, 2000, 4000, 8000]);
      });

      test('should return `timeTextInterval`', () => {
        expect(spectrogram.param('timeTextInterval')).toBe(24);
      });

      test('should return `styles`', () => {
        expect(spectrogram.param('styles')).toStrictEqual({
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
