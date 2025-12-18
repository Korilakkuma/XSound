import type { TimeParams } from '/src/SoundModule/Analyser/Time';

import { AnalyserNodeMock } from '/mock/AnalyserNodeMock';
import { OscillatorNodeMock } from '/mock/OscillatorNodeMock';
import { canvasMock } from '/mock/CanvasMock';
import { Time } from '/src/SoundModule/Analyser/Time';

describe(Time.name, () => {
  const sampleRate = 44100;
  const channel    = 0;
  const analyser   = new AnalyserNodeMock();
  const oscillator = new OscillatorNodeMock();

  describe('use `HTMLCanvasElement`', () => {
    // @ts-expect-error Because there is not Web Audio API in Jest environment (Node.js environment), mocks Web Audio API
    const time = new Time(sampleRate, channel, analyser);

    time.setup(canvasMock);

    describe(time.connect.name, () => {
      test('should call `connect` method', () => {
        const connectMock = jest.fn();

        const originalConnect = time.connect;

        time.connect = connectMock;

        // @ts-expect-error Because there is not Web Audio API in Jest environment (Node.js environment), mocks Web Audio API
        time.connect(oscillator);

        expect(connectMock).toHaveBeenCalledTimes(1);

        time.connect = originalConnect;
      });
    });

    describe(time.param.name, () => {
      const defaultParams: TimeParams = {
        type        : 'uint',
        textInterval: 0.005,
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

      const params: TimeParams = {
        type        : 'float',
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
        time.param(params);
      });

      afterAll(() => {
        time.param(defaultParams);
      });

      test('should return `type`', () => {
        expect(time.param('type')).toBe('float');
      });

      test('should return `textInterval`', () => {
        expect(time.param('textInterval')).toBeCloseTo(120, 1);
      });

      test('should return `interval`', () => {
        expect(time.param('interval')).toBeCloseTo(0, 1);
      });

      test('should return `styles`', () => {
        expect(time.param('styles')).toStrictEqual({
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
    const time = new Time(sampleRate, channel, analyser);

    const svg = document.createElementNS(Time.XMLNS, 'svg');

    svg.appendChild(document.createElementNS(Time.XMLNS, 'path'));

    time.setup(svg);

    describe(time.connect.name, () => {
      test('should call `connect` method', () => {
        const connectMock = jest.fn();

        const originalConnect = time.connect;

        time.connect = connectMock;

        // @ts-expect-error Because there is not Web Audio API in Jest environment (Node.js environment), mocks Web Audio API
        time.connect(oscillator);

        expect(connectMock).toHaveBeenCalledTimes(1);

        time.connect = originalConnect;
      });
    });

    describe(time.param.name, () => {
      const defaultParams: TimeParams = {
        type        : 'uint',
        textInterval: 0.005,
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

      const params: TimeParams = {
        type        : 'float',
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
        time.param(params);
      });

      afterAll(() => {
        time.param(defaultParams);
      });

      test('should return `type`', () => {
        expect(time.param('type')).toBe('float');
      });

      test('should return `textInterval`', () => {
        expect(time.param('textInterval')).toBeCloseTo(120, 1);
      });

      test('should return `interval`', () => {
        expect(time.param('interval')).toBeCloseTo(0, 1);
      });

      test('should return `styles`', () => {
        expect(time.param('styles')).toStrictEqual({
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
