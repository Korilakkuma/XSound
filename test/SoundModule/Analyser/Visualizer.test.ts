import { canvasMock } from '../../../mocks/CanvasMock';
import { Channel } from '../../../src/SoundModule/Analyser';
import { Visualizer } from '../../../src/SoundModule/Analyser/Visualizer';

describe(Visualizer.name, () => {
  const sampleRate = 44100;
  const channel: Channel = 0;

  let visualizer = new Visualizer(sampleRate, channel);

  describe('use `HTMLCanvasElement`', () => {
    beforeEach(() => {
      visualizer = new Visualizer(sampleRate, channel);

      visualizer.setup(canvasMock);
    });

    describe(visualizer.start.name, () => {
      test('should call protected method just once', () => {
        // eslint-disable-next-line dot-notation
        const originalVisualizeOnCanvas = visualizer['visualizeOnCanvas'];

        const visualizeOnCanvasMock = jest.fn();

        // eslint-disable-next-line dot-notation
        visualizer['visualizeOnCanvas'] = visualizeOnCanvasMock;

        const data        = new Uint8Array([1, 0, -1]);
        const minDecibels = -100;
        const maxDecibels = -30;

        visualizer.start(data, minDecibels, maxDecibels);

        // eslint-disable-next-line dot-notation
        expect(visualizeOnCanvasMock).toHaveBeenCalledTimes(1);

        // eslint-disable-next-line dot-notation
        visualizer['visualizeOnCanvas'] = originalVisualizeOnCanvas;
      });
    });

    describe(visualizer.clear.name, () => {
      xtest('should call `clearRect` method', () => {
        // TODO:
      });
    });

    describe(visualizer.create.name, () => {
      test('should return Data URL', () => {
        const originalToDataURL = canvasMock.toDataURL;

        const toDataURLMock = () => 'data:image/octet-stream;base64,';

        canvasMock.toDataURL = toDataURLMock;

        expect(visualizer.create()).toBe('data:image/octet-stream;base64,');

        canvasMock.toDataURL = originalToDataURL;
      });
    });

    describe(`${visualizer.activate.name} and ${visualizer.deactivate.name}`, () => {
      test('should return boolean', () => {
        expect(visualizer.activate().state()).toBe(true);
        expect(visualizer.deactivate().state()).toBe(false);
      });
    });
  });

  describe('use `SVGElement`', () => {
    beforeEach(() => {
      visualizer = new Visualizer(sampleRate, channel);

      const svg = document.createElementNS(Visualizer.XMLNS, 'svg');

      svg.appendChild(document.createElementNS(Visualizer.XMLNS, 'path'));

      visualizer.setup(svg);
    });

    describe(visualizer.start.name, () => {
      test('should call protected method just once', () => {
        // eslint-disable-next-line dot-notation
        const originalVisualizeBySVG = visualizer['visualizeBySVG'];

        const visualizeBySVGMock = jest.fn();

        // eslint-disable-next-line dot-notation
        visualizer['visualizeBySVG'] = visualizeBySVGMock;

        const data        = new Uint8Array([1, 0, -1]);
        const minDecibels = -100;
        const maxDecibels = -30;

        visualizer.start(data, minDecibels, maxDecibels);

        // eslint-disable-next-line dot-notation
        expect(visualizeBySVGMock).toHaveBeenCalledTimes(1);

        // eslint-disable-next-line dot-notation
        visualizer['visualizeBySVG'] = originalVisualizeBySVG;
      });
    });

    describe(visualizer.clear.name, () => {
      test('should return empty element as string', () => {
        const svg = visualizer.get();

        visualizer.clear();

        expect(svg?.innerHTML).toBe('');
      });
    });

    describe(visualizer.create.name, () => {
      test('should return `SVGElement` as string', () => {
        expect(visualizer.create()).toBe('<svg><path></path></svg>');
      });
    });

    describe(`${visualizer.activate.name} and ${visualizer.deactivate.name}`, () => {
      test('should return boolean', () => {
        expect(visualizer.activate().state()).toBe(true);
        expect(visualizer.deactivate().state()).toBe(false);
      });
    });
  });
});
