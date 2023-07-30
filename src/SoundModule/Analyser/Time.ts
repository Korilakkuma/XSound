import { ChannelNumber } from '/src/types';
import { DataType } from '/src/SoundModule/Analyser';
import { Visualizer, VisualizerParams, GraphicsStyles } from '/src/SoundModule/Analyser/Visualizer';

export type TimeParams = VisualizerParams & {
  type?: DataType,
  textInterval?: number
};

/**
 * This private class visualizes sound wave in time domain.
 * @constructor
 * @extends {Visualizer}
 */
export class Time extends Visualizer {
  private type: DataType = 'uint';

  // Visualize text at intervals this value [sec]
  private textInterval = 0.005;

  /**
   * @param {number} sampleRate This argument is sample rate.
   * @param {ChannelNumber} channel This argument is channel number (Left: 0, Right: 1 ...).
   */
  constructor(sampleRate: number, channel: ChannelNumber) {
    super(sampleRate, channel);
  }

  /** @override */
  public override setup(element: HTMLCanvasElement | SVGSVGElement): Time {
    super.setup(element);
    return this;
  }

  /**
   * This method gets or sets parameters for visualizing sound wave.
   * This method is overloaded for type interface and type check.
   * @param {keyof TimeParams|TimeParams} params This argument is string if getter. Otherwise, setter.
   * @return {TimeParams[keyof TimeParams]|Time} Return value is parameter for visualizing sound wave if getter.
   *     Otherwise, return value is for method chain.
   * @override
   */
  public override param(params: 'interval'): number;
  public override param(params: 'styles'): GraphicsStyles;
  public override param(params: 'type'): DataType;
  public override param(params: 'textInterval'): number;
  public override param(params: TimeParams): Time;
  public override param(params: keyof TimeParams | TimeParams): TimeParams[keyof TimeParams] | Time {
    if (typeof params === 'string') {
      switch (params) {
        case 'type':
          return this.type;
        case 'textInterval':
          return this.textInterval;
        case 'interval':
          return super.param(params);
        case 'styles':
          return super.param(params);
        default:
          return this;
      }
    }

    for (const [key, value] of Object.entries(params)) {
      switch (key) {
        case 'type':
          if (typeof value === 'string') {
            if ((value === 'uint') || (value === 'float')) {
              this.type = value;
            }
          }

          break;
        case 'textInterval':
          if (typeof value === 'number') {
            this.textInterval = value;
          }

          break;
        default:
          break;
      }
    }

    super.param(params);

    return this;
  }

  /** @override */
  public override clear(): Time {
    super.clear();
    return this;
  }

  /** @override */
  public override activate(): Time {
    super.activate();
    return this;
  }

  /** @override */
  public override deactivate(): Time {
    super.deactivate();
    return this;
  }

  /**
   * This method visualizes sound wave in time domain to Canvas.
   * @param {Uint8Array|Float32Array} data This argument is sound data for visualization.
   * @override
   */
  protected override visualizeOnCanvas(data: Uint8Array | Float32Array, _minDecibels?: number, _maxDecibels?: number): void {
    if ((this.canvas === null) || (this.context === null) || !this.isActive) {
      return;
    }

    const context = this.context;

    const width       = this.canvas.width;
    const height      = this.canvas.height;
    const top         = this.styles.top ?? 15;
    const bottom      = this.styles.bottom ?? 15;
    const left        = this.styles.left ?? 30;
    const right       = this.styles.right ?? 30;
    const innerWidth  = width  - (left + right);
    const innerHeight = height - (top  + bottom);
    const middle      = Math.trunc(innerHeight / 2) + top;

    const lineWidth = this.styles.width ?? 1.5;
    const lineCap   = this.styles.cap ?? 'round';
    const lineJoin  = this.styles.join ?? 'miter';

    const waveColor = this.styles.wave ?? 'rgba(0, 0, 255, 1.0)';
    const gridColor = this.styles.grid ?? 'none';
    const textColor = this.styles.text ?? 'none';
    const fontSize  = parseInt((this.styles.font?.size ?? '13px'), 10);

    // Visualize text at intervals of `this.textInterval`
    const numberOfTexts = Math.trunc(this.textInterval * this.sampleRate);

    // Erase previous wave
    context.clearRect(0, 0, width, height);

    // Begin visualization
    switch (this.type) {
      case 'float':
        if (data instanceof Float32Array) {
          this.visualizeTimeDomainFloat32ArrayOnCanvas(context, data, innerWidth, innerHeight, middle);
        }

        break;
      case 'uint':
      default    :
        switch (this.styles.shape) {
          case 'line':
            // Set style
            context.strokeStyle = waveColor;
            context.lineWidth   = lineWidth;
            context.lineCap     = lineCap;
            context.lineJoin    = lineJoin;

            // Visualize wave
            context.beginPath();

            for (let i = 0, len = data.length; i < len; i++) {
              const x = ((i / len) * innerWidth) + left;
              const y = ((1 - (data[i] / 255)) * innerHeight) + top;

              if (i === 0) {
                context.moveTo((x + (lineWidth / 2)), y);
              } else {
                context.lineTo(x, y);
              }
            }

            context.stroke();

            break;
          case 'rect':
            // Visualize wave
            for (let i = 0, len = data.length; i < len; i++) {
              const x = ((i / len) * innerWidth) + left;
              const y = (0.5 - (data[i] / 255)) * innerHeight;

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

              context.fillRect(x, middle, 1, y);
            }

            break;
          default:
            break;
        }

        break;
    }

    if ((gridColor !== 'none') || (textColor !== 'none')) {
      // Visualize grid and text (X axis)
      for (let i = 0, len = data.length; i < len; i++) {
        if ((i % numberOfTexts) === 0) {
          const x = Math.trunc((i / len) * innerWidth) + left;
          const t = `${Math.trunc((i / this.sampleRate) * 1000)} ms`;

          // Visualize grid
          if (gridColor !== 'none') {
            context.fillStyle = gridColor;
            context.fillRect(x, top, 1, innerHeight);
          }

          // Visualize text
          if (textColor !== 'none') {
            context.fillStyle = textColor;
            context.font      = this.createFontString();
            context.fillText(t, (x - (context.measureText(t).width / 2)), (top + innerHeight + fontSize));
          }
        }
      }

      // Visualize grid and text (Y axis)
      for (const t of ['-1.00', '-0.50', ' 0.00', ' 0.50', ' 1.00']) {
        const x = Math.trunc(left - context.measureText(t).width);
        const y = Math.trunc((1 - Number(t.trim())) * (innerHeight / 2)) + top;

        // Visualize grid
        if (gridColor !== 'none') {
          context.fillStyle = gridColor;
          context.fillRect(left, y, innerWidth, 1);
        }

        // Visualize text
        if (textColor !== 'none') {
          context.fillStyle = textColor;
          context.font      = this.createFontString();
          context.fillText(t, x, (y - Math.trunc(fontSize / 4)));
        }
      }
    }
  }

  /**
   * This method visualizes sound wave in time domain to SVG.
   * @param {Uint8Array|Float32Array} data This argument is sound data for visualization.
   * @override
   */
  protected override visualizeBySVG(data: Uint8Array | Float32Array, _minDecibels?: number, _maxDecibels?: number): void {
    if ((this.svg === null) || !this.isActive) {
      return;
    }

    const svg = this.svg;

    const width       = Number((svg.getAttribute('width') ?? '0'));
    const height      = Number((svg.getAttribute('height') ?? '0'));
    const top         = this.styles.top ?? 15;
    const bottom      = this.styles.bottom ?? 15;
    const left        = this.styles.left ?? 30;
    const right       = this.styles.right ?? 30;
    const innerWidth  = width  - (left + right);
    const innerHeight = height - (top  + bottom);
    const middle      = Math.trunc(innerHeight / 2) + top;

    const lineWidth = this.styles.width ?? 1.5;
    const lineCap   = this.styles.cap ?? 'round';
    const lineJoin  = this.styles.join ?? 'miter';

    const waveColor = this.styles.wave ?? 'rgba(0, 0, 255, 1.0)';
    const gridColor = this.styles.grid ?? 'none';
    const textColor = this.styles.text ?? 'none';
    const fontSize  = parseInt((this.styles.font?.size ?? '13px'), 10);

    // Visualize text at intervals of `this.textInterval`
    const numberOfTexts = Math.trunc(this.textInterval * this.sampleRate);

    // Begin visualization
    svg.innerHTML = '';

    // Begin visualization
    switch (this.type) {
      case 'float':
        if (data instanceof Float32Array) {
          const element = this.visualizeTimeDomainFloat32ArrayBySVG(data, innerWidth, innerHeight, middle, 0, Time.SVG_LINEAR_GRADIENT_ID_TIME);

          if (element !== null) {
            svg.appendChild(element);
          }
        }
        break;
      case 'uint':
      default    :
        switch (this.styles.shape) {
          case 'line': {
            // Visualize wave
            const path = document.createElementNS(Time.XMLNS, 'path');

            let d = '';

            for (let i = 0, len = data.length; i < len; i++) {
              const x = ((i / len) * innerWidth) + left;
              const y = ((1 - (data[i] / 255)) * innerHeight) + top;

              if (i === 0) {
                d += `M${x + (lineWidth / 2)} ${y}`;
              } else {
                d += ` L${x} ${y}`;
              }
            }

            path.setAttribute('d', d);

            path.setAttribute('stroke',          waveColor);
            path.setAttribute('fill',            'none');
            path.setAttribute('stroke-width',    lineWidth.toString(10));
            path.setAttribute('stroke-linecap',  lineCap);
            path.setAttribute('stroke-linejoin', lineJoin);

            svg.appendChild(path);

            break;
          }

          case 'rect': {
            let defs = null;

            if (this.styles.gradients) {
              defs = this.createSVGLinearGradient(`${Time.SVG_LINEAR_GRADIENT_ID_TIME}-${this.channel}`);
            }

            // Visualize wave
            const g = document.createElementNS(Time.XMLNS, 'g');

            if (defs !== null) {
              g.appendChild(defs);
            }

            for (let i = 0, len = data.length; i < len; i++) {
              const rect = document.createElementNS(Time.XMLNS, 'rect');

              const x = ((i / len) * innerWidth) + left;
              const y = ((data[i] / 255) - 0.5) * innerHeight;

              rect.setAttribute('x',     x.toString(10));
              rect.setAttribute('y',     middle.toString(10));
              rect.setAttribute('width', lineWidth.toString(10));
              rect.setAttribute('height', Math.abs(y).toString(10));

              if (y >= 0) {
                rect.setAttribute('transform', `rotate(180 ${x + (lineWidth / 2)} ${middle})`);
              }

              rect.setAttribute('stroke', 'none');
              rect.setAttribute('fill',   ((defs === null) ? waveColor : `url(#${Time.SVG_LINEAR_GRADIENT_ID_TIME}-${this.channel})`));

              g.appendChild(rect);
            }

            svg.appendChild(g);

            break;
          }

          default:
            break;
        }

        break;
    }

    if ((gridColor !== 'none') || (textColor !== 'none')) {
      // Visualize grid and text (X axis)
      for (let i = 0, len = data.length; i < len; i++) {
        if ((i % numberOfTexts) === 0) {
          const x = Math.trunc((i / len) * innerWidth) + left;
          const t = `${Math.trunc((i / this.sampleRate) * 1000)} ms`;

          // Visualize grid
          if (gridColor !== 'none') {
            const rect = document.createElementNS(Time.XMLNS, 'rect');

            rect.setAttribute('x',      x.toString(10));
            rect.setAttribute('y',      top.toString(10));
            rect.setAttribute('width',  '1');
            rect.setAttribute('height', innerHeight.toString(10));

            rect.setAttribute('stroke', 'none');
            rect.setAttribute('fill',   gridColor);

            svg.appendChild(rect);
          }

          // Visualize text
          if (textColor !== 'none') {
            const text = document.createElementNS(Time.XMLNS, 'text');

            text.textContent = t;

            text.setAttribute('x', x.toString(10));
            text.setAttribute('y', (top + innerHeight + fontSize).toString(10));

            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('stroke',      'none');
            text.setAttribute('fill',        textColor);
            text.setAttribute('font-family', this.styles.font?.family ?? 'Arial');
            text.setAttribute('font-size',   fontSize.toString(10));
            text.setAttribute('font-style',  this.styles.font?.style ?? 'normal');
            text.setAttribute('font-weight', this.styles.font?.weight ?? 'normal');

            svg.appendChild(text);
          }
        }
      }

      // Visualize grid and text (Y axis)
      for (const t of ['-1.00', '-0.50', ' 0.00', ' 0.50', ' 1.00']) {
        const x = left;
        const y = Math.trunc((1 - Number(t.trim())) * (innerHeight / 2)) + top;

        // Visualize grid
        if (gridColor !== 'none') {
          const rect = document.createElementNS(Time.XMLNS, 'rect');

          rect.setAttribute('x',      x.toString(10));
          rect.setAttribute('y',      y.toString(10));
          rect.setAttribute('width',  innerWidth.toString(10));
          rect.setAttribute('height', '1');

          rect.setAttribute('stroke', 'none');
          rect.setAttribute('fill',   gridColor);

          svg.appendChild(rect);
        }

        // Visualize text
        if (textColor !== 'none') {
          const text = document.createElementNS(Time.XMLNS, 'text');

          text.textContent = t;

          text.setAttribute('x', x.toString(10));
          text.setAttribute('y', (y - Math.trunc(fontSize / 4)).toString(10));

          text.setAttribute('text-anchor', 'end');
          text.setAttribute('stroke',      'none');
          text.setAttribute('fill',        textColor);
          text.setAttribute('font-family', (this.styles.font?.family ?? 'Arial'));
          text.setAttribute('font-size',   fontSize.toString(10));
          text.setAttribute('font-style',  (this.styles.font?.style ?? 'normal'));
          text.setAttribute('font-weight', (this.styles.font?.weight ?? 'normal'));

          svg.appendChild(text);
        }
      }
    }
  }
}
