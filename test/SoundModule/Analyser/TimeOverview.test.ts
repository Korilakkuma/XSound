import { canvasMock } from '../../../mocks/CanvasMock';
import { Channel } from '../../../src/SoundModule/Analyser';
import { TimeOverview, TimeOverviewParams } from '../../../src/SoundModule/Analyser/TimeOverview';

describe(TimeOverview.name, () => {
  const sampleRate       = 44100;
  const channel: Channel = 0;

  describe('use `HTMLCanvasElement`', () => {
    const timeOverview = new TimeOverview(sampleRate, channel);

    timeOverview.setup(canvasMock);

    describe(timeOverview.param.name, () => {
      const defaultParams: TimeOverviewParams = {
        currentTime: {
          width: 1,
          color: 'rgba(0, 0, 0, 0.5)'
        },
        sprite      : 'rgba(255, 255, 255, 0.25)',
        plotInterval: 0.0625,
        textInterval: 60,
        mode        : 'update',
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

      const params: TimeOverviewParams = {
        currentTime : {
          width: 4,
          color: 'rgba(255, 255, 255, 0.5)'
        },
        sprite      : 'rgba(0, 0, 0, 0.25)',
        plotInterval: 0.125,
        textInterval: 120,
        mode        : 'sprite',
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
        timeOverview.param(params);
      });

      afterAll(() => {
        timeOverview.param(defaultParams);
      });

      test('should return `currentTime`', () => {
        expect(timeOverview.param('currentTime')).toStrictEqual({
          width: 4,
          color: 'rgba(255, 255, 255, 0.5)'
        });
      });

      test('should return `sprite`', () => {
        expect(timeOverview.param('sprite')).toBe('rgba(0, 0, 0, 0.25)');
      });

      test('should return `plotInterval`', () => {
        expect(timeOverview.param('plotInterval')).toBeCloseTo(0.125, 3);
      });

      test('should return `textInterval`', () => {
        expect(timeOverview.param('textInterval')).toBeCloseTo(120, 1);
      });

      test('should return `mode`', () => {
        expect(timeOverview.param('mode')).toBe('sprite');
      });

      test('should return `interval`', () => {
        expect(timeOverview.param('interval')).toBeCloseTo(0, 1);
      });

      test('should return `styles`', () => {
        expect(timeOverview.param('styles')).toStrictEqual({
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

    // TODO:
    describe(timeOverview.update.name, () => {
      test('should update canvas', () => {
        expect(timeOverview.update(1000)).toBeInstanceOf(TimeOverview);
      });
    });
  });

  describe('use `SVGElement`', () => {
    const timeOverview = new TimeOverview(sampleRate, channel);

    const svg = document.createElement('svg');

    svg.appendChild(document.createElementNS(TimeOverview.XMLNS, 'path'));

    timeOverview.setup(svg);

    describe(timeOverview.param.name, () => {
      const defaultParams: TimeOverviewParams = {
        currentTime: {
          width: 1,
          color: 'rgba(0, 0, 0, 0.5)'
        },
        sprite      : 'rgba(255, 255, 255, 0.25)',
        plotInterval: 0.0625,
        textInterval: 60,
        mode        : 'update',
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

      const params: TimeOverviewParams = {
        currentTime : {
          width: 4,
          color: 'rgba(255, 255, 255, 0.5)'
        },
        sprite      : 'rgba(0, 0, 0, 0.25)',
        plotInterval: 0.125,
        textInterval: 120,
        mode        : 'sprite',
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
        timeOverview.param(params);
      });

      afterAll(() => {
        timeOverview.param(defaultParams);
      });

      test('should return `currentTime`', () => {
        expect(timeOverview.param('currentTime')).toStrictEqual({
          width: 4,
          color: 'rgba(255, 255, 255, 0.5)'
        });
      });

      test('should return `sprite`', () => {
        expect(timeOverview.param('sprite')).toBe('rgba(0, 0, 0, 0.25)');
      });

      test('should return `plotInterval`', () => {
        expect(timeOverview.param('plotInterval')).toBeCloseTo(0.125, 3);
      });

      test('should return `textInterval`', () => {
        expect(timeOverview.param('textInterval')).toBeCloseTo(120, 1);
      });

      test('should return `mode`', () => {
        expect(timeOverview.param('mode')).toBe('sprite');
      });

      test('should return `interval`', () => {
        expect(timeOverview.param('interval')).toBeCloseTo(0, 1);
      });

      test('should return `styles`', () => {
        expect(timeOverview.param('styles')).toStrictEqual({
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

    // TODO:
    describe(timeOverview.update.name, () => {
      test('should update SVG', () => {
        expect(timeOverview.update(1000)).toBeInstanceOf(TimeOverview);
      });
    });
  });
});
