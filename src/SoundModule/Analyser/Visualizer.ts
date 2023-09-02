import { Statable } from '/src/interfaces';
import { ChannelNumber } from '/src/types';

export type Color = string;

export type GraphicsApi = 'canvas' | 'svg' | '';

export type Gradient = {
  offset: number,
  color: string
};

export type Gradients = Gradient[];

export type Shape = 'line' | 'rect';

export type Font = {
  family?: string,
  size?: string,
  style?: string,
  weight?: string
};

export type GraphicsStyles = {
  shape?: Shape,
  gradients?: Gradients,
  wave?: Color,
  grid?: Color,
  text?: Color,
  font?: Font,
  width?: number,
  cap?: CanvasLineCap,
  join?: CanvasLineJoin,
  top?: number,
  right?: number,
  bottom?: number,
  left?: number
};

export type VisualizerParams = {
  interval?: number,
  styles?: GraphicsStyles
};

/**
 * This private class is superclass for visualizer class (`TimeOverview`, `Time`, `FFT`).
 * @constructor
 * @abstract
 * @implements {Statable}
 */
export abstract class Visualizer implements Statable {
  public static readonly XMLNS = 'http://www.w3.org/2000/svg' as const;
  public static readonly XLINK = 'http://www.w3.org/1999/xlink' as const;

  protected static SVG_LINEAR_GRADIENT_ID_TIME_OVERVIEW = 'svg-linear-gradient-time-overview';
  protected static SVG_LINEAR_GRADIENT_ID_TIME          = 'svg-linear-gradient-time';
  protected static SVG_LINEAR_GRADIENT_ID_FFT           = 'svg-linear-gradient-fft';

  protected sampleRate: number;
  protected channel: ChannelNumber;

  protected isActive = false;
  protected graphics: GraphicsApi = '';

  protected canvas: HTMLCanvasElement | null = null;
  protected context: CanvasRenderingContext2D | null = null;

  protected svg: SVGSVGElement | null = null;

  protected interval = 1000;  // msec

  protected styles: GraphicsStyles = {
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
      style : 'normal',
      weight: 'normal'
    },
    width    : 1.5,
    cap      : 'round',
    join     : 'miter',
    top      : 15,
    right    : 30,
    bottom   : 15,
    left     : 30
  };

  /**
   * @param {number} sampleRate This argument is sample rate.
   */
  constructor(sampleRate: number, channel: ChannelNumber) {
    this.sampleRate = sampleRate;
    this.channel    = channel;
  }

  /**
   * This method sets up for using Canvas or SVG.
   * @param {HTMLCanvasElement|SVGSVGElement} element This argument is either `HTMLCanvasElement` or `SVGSVGElement`.
   * @return {Visualizer} Return value is for method chain.
   */
  public setup(element: HTMLCanvasElement | SVGSVGElement): Visualizer {
    if (element instanceof HTMLCanvasElement) {
      this.graphics = 'canvas';
      this.canvas   = element;
      this.context  = this.canvas.getContext('2d');
    } else if (element instanceof SVGSVGElement) {
      this.graphics = 'svg';
      this.svg      = element;
    }

    return this;
  }

  /**
   * This method visualizes sound wave to Canvas or SVG. This method conceals difference of API for visualization.
   * @param {Uint8Array|Float32Array} data This argument is sound data for visualization.
   * @param {number} minDecibels This argument is parameter for spectrum. The default value is -100 dB.
   * @param {number} maxDecibels This argument is parameter for spectrum. The default value is -30 dB.
   * @return {Visualizer} Return value is for method chain.
   */
  public start(data: Uint8Array | Float32Array, minDecibels?: number, maxDecibels?: number): Visualizer {
    switch (this.graphics) {
      case 'canvas': {
        this.visualizeOnCanvas(data, minDecibels, maxDecibels);
        break;
      }

      case 'svg': {
        this.visualizeBySVG(data, minDecibels, maxDecibels);
        break;
      }

      default: {
        break;
      }
    }

    return this;
  }

  /**
   * This method gets or sets parameters for visualization.
   * This method is overloaded for type interface and type check.
   * @param {keyof VisualizerParams|VisualizerParams} params This argument is string if getter. Otherwise, setter.
   * @return {VisualizerParams[keyof VisualizerParams]} Return value is parameter for visualization if getter.
   */
  public param(params: 'interval'): number;
  public param(params: 'styles'): GraphicsStyles;
  public param(params: VisualizerParams): void;
  public param(params: keyof VisualizerParams | VisualizerParams): VisualizerParams[keyof VisualizerParams] | void {
    if (typeof params === 'string') {
      switch (params) {
        case 'interval': {
          return this.interval;
        }

        case 'styles': {
          return this.styles;
        }

        default: {
          return;
        }
      }
    }

    for (const [key, value] of Object.entries(params)) {
      switch (key) {
        case 'interval': {
          if (typeof value === 'number') {
            this.interval = value;
          }

          break;
        }

        case 'styles': {
          if (typeof value === 'object') {
            this.styles = { ...this.styles, ...value };
          }

          break;
        }

        default: {
          break;
        }
      }
    }
  }

  /**
   * This method gets instance of `HTMLCanvasElement` or `SVGSVGElement`.
   * @return {HTMLCanvasElement|SVGSVGElement|null}
   */
  public get(): HTMLCanvasElement | SVGSVGElement | null {
    switch (this.graphics) {
      case 'canvas': {
        return this.canvas;
      }

      case 'svg': {
        return this.svg;
      }

      default: {
        return null;
      }
    }
  }

  /**
   * This method clears graphics.
   * @return {Visualizer} Return value is for method chain.
   */
  public clear(): Visualizer {
    switch (this.graphics) {
      case 'canvas': {
        if (this.canvas && this.context) {
          this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }

        break;
      }

      case 'svg': {
        if (this.svg) {
          this.svg.innerHTML = '';
        }

        break;
      }

      default: {
        break;
      }
    }

    return this;
  }

  /**
   * This method creates visualized graphics as string (Data URL or SVG).
   * @return {string}
   */
  public create(): string {
    switch (this.graphics) {
      case 'canvas': {
        if (this.canvas === null) {
          return '';
        }

        return this.canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
      }

      case 'svg': {
        if (this.svg === null) {
          return '';
        }

        return this.svg.outerHTML;
      }

      default: {
        return '';
      }
    }
  }

  /**
   * This method gets visualizer state. If returns `true`, visualizer is active.
   * @return {boolean}
   */
  public state(): boolean {
    return this.isActive;
  }

  /**
   * This method activates visualizer.
   * @return {Visualizer} Return value is for method chain.
   */
  public activate(): Visualizer {
    this.isActive = true;
    return this;
  }

  /**
   * This method deactivates visualizer.
   * @return {Visualizer} Return value is for method chain.
   */
  public deactivate(): Visualizer {
    this.isActive = false;
    return this;
  }

  /**
   * This method visualizes time domain data (`Float32Array`) to Canvas.
   * @param {CanvasRenderingContext2D} context This argument is instance of `CanvasRenderingContext2D`.
   * @param {Float32Array} data This argument is time domain data.
   * @param {number} innerWidth This argument is width of visualization area.
   * @param {number} innerHeight This argument is height of visualization area.
   * @param {number} middle This argument is middle of visualization area.
   * @param {number} numberOfPlots This argument is interval for visualization.
   */
  protected visualizeTimeDomainFloat32ArrayOnCanvas(context: CanvasRenderingContext2D, data: Float32Array, innerWidth: number, innerHeight: number, middle: number, numberOfPlots?: number): void {
    const top  = this.styles.top ?? 15;
    const left = this.styles.left ?? 30;

    const lineWidth = this.styles.width ?? 1.5;
    const lineCap   = this.styles.cap ?? 'round';
    const lineJoin  = this.styles.join ?? 'miter';

    const waveColor = this.styles.wave ?? 'rgba(0, 0, 255, 1.0)';

    // Begin visualization
    switch (this.styles.shape) {
      case 'line': {
        // Set style
        context.strokeStyle = waveColor;
        context.lineWidth   = lineWidth;
        context.lineCap     = lineCap;
        context.lineJoin    = lineJoin;

        // Visualize wave
        context.beginPath();

        for (let i = 0, len = data.length; i < len; i++) {
          if (!numberOfPlots || ((i % numberOfPlots) === 0)) {
            const x = ((i / len) * innerWidth) + left;
            const y = ((1 - data[i]) * (innerHeight / 2)) + top;

            if (i === 0) {
              context.moveTo((x + (context.lineWidth / 2)),  y);
            } else {
              context.lineTo(x, y);
            }
          }
        }

        context.stroke();

        break;
      }

      case 'rect': {
        // Visualize wave
        for (let i = 0, len = data.length; i < len; i++) {
          if (!numberOfPlots || ((i % numberOfPlots) === 0)) {
            const x = ((i / len) * innerWidth) + left;
            const y = -1 * (data[i] * (innerHeight / 2));

            // Set style
            if (this.styles.gradients) {
              const upside   = (innerHeight / 2) + top;
              const gradient = context.createLinearGradient(0, upside, 0, (upside + y));

              for (const gradients of this.styles.gradients) {
                gradient.addColorStop(gradients.offset, gradients.color);
              }

              context.fillStyle = gradient;
            } else {
              context.fillStyle = waveColor;
            }

            context.fillRect(x, middle, lineWidth, y);
          }
        }

        break;
      }

      default: {
        break;
      }
    }
  }

  /**
   * This method visualizes time domain data (`Float32Array`) to SVG.
   * @param {Float32Array} data This argument is time domain data.
   * @param {number} innerWidth This argument is width of visualization area.
   * @param {number} innerHeight This argument is height of visualization area.
   * @param {number} middle This argument is middle of visualization area.
   * @param {number} numberOfPlots This argument is interval for visualization.
   * @param {string} linearGradientId This argument is `id` attribute for `SVGLinearGradientElement`.
   * @return {SVGPathElement|SVGGElement} This value is instance of `SVGPathElement` or `SVGGElement`.
   */
  protected visualizeTimeDomainFloat32ArrayBySVG(data: Float32Array, innerWidth: number, innerHeight: number, middle: number, numberOfPlots: number, linearGradientId: string): SVGPathElement | SVGGElement | null {
    const top  = this.styles.top ?? 15;
    const left = this.styles.left ?? 30;

    const lineWidth = this.styles.width ?? 1.5;
    const lineCap   = this.styles.cap ?? 'round';
    const lineJoin  = this.styles.join ?? 'miter';

    const waveColor = this.styles.wave ?? 'rgba(0, 0, 255, 1.0)';

    switch (this.styles.shape) {
      case 'line': {
        // Visualize wave
        const path = document.createElementNS(Visualizer.XMLNS, 'path');

        let d = '';

        for (let i = 0, len = data.length; i < len; i++) {
          if ((i % numberOfPlots) === 0) {
            const x = ((i / len) * innerWidth) + left;
            const y = ((1 - data[i]) * (innerHeight / 2)) + top;

            if (i === 0) {
              d += `M${x + ((this.styles.width ?? 1.5) / 2)} ${y}`;
            } else {
              d += ` L${x} ${y}`;
            }
          }
        }

        path.setAttribute('d', d);

        path.setAttribute('stroke',          waveColor);
        path.setAttribute('fill',            'none');
        path.setAttribute('stroke-width',    lineWidth.toString(10));
        path.setAttribute('stroke-linecap',  lineCap);
        path.setAttribute('stroke-linejoin', lineJoin);

        return path;
      }

      case 'rect': {
        let defs = null;

        if (this.styles.gradients) {
          defs = this.createSVGLinearGradient(linearGradientId);
        }

        // Visualize wave
        const g = document.createElementNS(Visualizer.XMLNS, 'g');

        if (defs !== null) {
          g.appendChild(defs);
        }

        for (let i = 0, len = data.length; i < len; i++) {
          if ((i % numberOfPlots) === 0) {
            const rect = document.createElementNS(Visualizer.XMLNS, 'rect');

            const x = ((i / len) * innerWidth) + left;
            const y = data[i] * (innerHeight / 2);

            rect.setAttribute('x',     x.toString(10));
            rect.setAttribute('y',     middle.toString(10));
            rect.setAttribute('width', lineWidth.toString(10));
            rect.setAttribute('height', Math.abs(y).toString(10));

            if (y >= 0) {
              rect.setAttribute('transform', `rotate(180 ${x + (lineWidth / 2)} ${middle})`);
            }

            rect.setAttribute('stroke', 'none');
            rect.setAttribute('fill',   ((defs === null) ? waveColor : `url(#${linearGradientId})`));

            g.appendChild(rect);
          }
        }

        return g;
      }

      default: {
        return null;
      }
    }
  }

  /**
   * This method creates elements for SVG linear gradient.
   * @param {string} linearGradientId This argument is `id` attribute for `SVGLinearGradientElement`.
   * @return {SVGDefsElement} This value is as instance of `SVGDefsElement`.
   */
  protected createSVGLinearGradient(linearGradientId: string): SVGDefsElement | null {
    if (!this.styles.gradients) {
      return null;
    }

    const defs           = document.createElementNS(Visualizer.XMLNS, 'defs');
    const linearGradient = document.createElementNS(Visualizer.XMLNS, 'linearGradient');

    linearGradient.setAttribute('id', linearGradientId);
    linearGradient.setAttribute('x1', '0%');
    linearGradient.setAttribute('y1', '0%');
    linearGradient.setAttribute('x2', '0%');
    linearGradient.setAttribute('y2', '100%');

    for (const gradients of this.styles.gradients) {
      const stop = document.createElementNS(Visualizer.XMLNS, 'stop');

      stop.setAttribute('offset',     gradients.offset.toString(10));
      stop.setAttribute('stop-color', gradients.color);

      linearGradient.appendChild(stop);
    }

    defs.appendChild(linearGradient);

    return defs;
  }

  /**
   * This method creates string for font styles.
   * @return {string}
   */
  protected createFontString(): string {
    const { style, weight, size, family } = this.styles.font ?? {};

    return `${style ?? 'normal'} ${weight ?? 'normal'} ${size ?? '13px'} "${family ?? 'Arial'}"`;
  }

  /** @abstract */
  protected abstract visualizeOnCanvas(data: Uint8Array | Float32Array, minDecibels?: number, maxDecibels?: number): void;

  /** @abstract */
  protected abstract visualizeBySVG(data: Uint8Array | Float32Array, minDecibels?: number, maxDecibels?: number): void;
}
