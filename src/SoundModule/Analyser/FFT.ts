import { Channel, DataType } from '../Analyser';
import { Visualizer, VisualizerParams, GraphicsStyles } from './Visualizer';

export type FFTParams = VisualizerParams & {
  type?: DataType,
  size?: number,
  textInterval?: number
};

/**
 * This private class visualizes spectrum.
 * @constructor
 * @extends {Visualizer}
 */
export class FFT extends Visualizer {
  private type: DataType = 'uint';

  // Range for visualization
  private size = 256;

  // Visualize text at intervals of this value [Hz]
  private textInterval = 1000;

  /**
   * @param {number} sampleRate This argument is sample rate.
   * @param {Channel} channel This argument is channel number (Left: 0, Right: 1 ...).
   */
  // eslint-disable-next-line no-useless-constructor
  constructor(sampleRate: number, channel: Channel) {
    super(sampleRate, channel);
  }

  /**
   * This method gets or sets parameters for visualizing spectrum.
   * This method is overloaded for type interface and type check.
   * @param {keyof FFTParams|FFTParams} params This argument is string if getter. Otherwise, setter.
   * @return {FFTParams[keyof FFTParams]|FFT} Return value is parameter for visualizing spectrum if getter.
   *     Otherwise, return value is for method chain.
   * @override
   */
  public override param(params: 'interval'): number;
  public override param(params: 'styles'): GraphicsStyles;
  public override param(params: 'type'): DataType;
  public override param(params: 'size'): number;
  public override param(params: 'textInterval'): number;
  public override param(params: FFTParams): FFT;
  public override param(params: keyof FFTParams | FFTParams): FFTParams[keyof FFTParams] | FFT {
    if (typeof params === 'string') {
      switch (params) {
        case 'type':
          return this.type;
        case 'size':
          return this.size;
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
      // TODO:
      switch (key) {
        case 'type':
          if ((typeof value === 'string') && ((value === 'uint') || (value === 'float'))) {
            this.type = value;
          }

          break;
        case 'size':
          if (typeof value === 'number') {
            this.size = value;
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
  public override clear(): FFT {
    super.clear();
    return this;
  }

  /** @override */
  public override activate(): FFT {
    super.activate();
    return this;
  }

  /** @override */
  public override deactivate(): FFT {
    super.deactivate();
    return this;
  }

  /**
   * This method visualizes spectrum to Canvas.
   * @param {Uint8Array|Float32Array} data This argument is frequency domain data for spectrum.
   * @param {number} minDecibels This argument is in order to determine dB range of spectrum. The default value is -100 dB.
   * @param {number} maxDecibels This argument is in order to determine db range of spectrum. The default value is -30 dB.
   * @override
   */
  protected override visualizeOnCanvas(data: Uint8Array | Float32Array, minDecibels?: number, maxDecibels?: number): void {
    if ((this.canvas === null) || (this.context === null) || !this.isActive) {
      return;
    }

    const mindB = minDecibels ?? -100;
    const maxdB = maxDecibels ?? -30;
    const range = maxdB - mindB;

    const context = this.context;

    const width       = this.canvas.width;
    const height      = this.canvas.height;
    const top         = this.styles.top ?? 0;
    const bottom      = this.styles.bottom ?? 0;
    const left        = this.styles.left ?? 30;
    const right       = this.styles.right ?? 30;
    const innerWidth  = width  - (left + right);
    const innerHeight = height - (top  + bottom);

    const lineWidth = this.styles.width ?? 1.5;
    const lineCap   = this.styles.cap ?? 'round';
    const lineJoin  = this.styles.join ?? 'miter';

    const waveColor = this.styles.wave ?? 'rgba(0, 0, 255, 1.0)';  // line only
    const gridColor = this.styles.grid ?? 'none';
    const textColor = this.styles.text ?? 'none';
    const fontSize  = parseInt((this.styles.font?.size ?? '13px'), 10);

    const actualSize = (this.size > data.length) ? data.length : this.size;

    // Frequency resolution (Sampling rate / FFT size)
    const fsDivN = this.sampleRate / (2 * data.length);

    // Visualize text at intervals of `this.textInterval`
    const numberOfTexts = Math.floor(this.textInterval / fsDivN);

    // Erase previous wave
    context.clearRect(0, 0, width, height);

    // Begin visualization
    switch (this.type) {
      case 'float': {
        // Set style
        context.strokeStyle = waveColor;
        context.lineWidth   = lineWidth;
        context.lineCap     = lineCap;
        context.lineJoin    = lineJoin;

        // Visualize wave
        context.beginPath();

        for (let i = 0; i < actualSize; i++) {
          const x = ((i / actualSize) * innerWidth) + left;
          const y = (Math.abs(data[i] - maxdB) * (innerHeight / range)) + top;  // [dB] * [px / dB] = [px]

          if (i === 0) {
            context.moveTo((x + (lineWidth / 2)), y);
          } else {
            context.lineTo(x, y);
          }
        }

        context.stroke();

        break;
      }

      case 'uint':
      default    : {
        switch (this.styles.shape) {
          case 'line':
            // Set style
            context.strokeStyle = waveColor;
            context.lineWidth   = lineWidth;
            context.lineCap     = lineCap;
            context.lineJoin    = lineJoin;

            context.beginPath();

            // Visualize wave
            for (let i = 0; i < actualSize; i++) {
              const x = ((i / actualSize) * innerWidth) + left;
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
            for (let i = 0; i < actualSize; i++) {
              const x = ((i / actualSize) * innerWidth) + left;
              const y = -1 * ((data[i] / 255) * innerHeight);

              // Set style
              if (this.styles.gradients) {
                const upside   = innerHeight + top;
                const gradient = context.createLinearGradient(0, upside, 0, (upside + y));

                for (const gradients of this.styles.gradients) {
                  gradient.addColorStop(gradients.offset, gradients.color);
                }

                context.fillStyle = gradient;
              } else {
                context.fillStyle = waveColor;
              }

              context.fillRect(x, (innerHeight + top), lineWidth, y);
            }

            break;
          default:
            break;
        }

        break;
      }
    }

    if ((gridColor !== 'none') || (textColor !== 'none')) {
      // Visualize grid and text (X axis)
      for (let i = 0; i < actualSize; i++) {
        if ((i % numberOfTexts) === 0) {
          const x = Math.floor((i / actualSize) * innerWidth) + left;

          const f = Math.floor(this.textInterval * (i / numberOfTexts));
          const t = (f < 1000) ? `${f} Hz` : `${String(f / 1000).slice(0, 3)} kHz`;

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
      switch (this.type) {
        case 'float':
          for (let i = mindB; i <= maxdB; i += 10) {
            const t = `${i} dB`;
            const x = Math.floor(left - context.measureText(t).width);
            const y = Math.floor(((-1 * (i - maxdB)) / range) * innerHeight) + top;

            // Visualize grid
            if (gridColor !== 'none') {
              context.fillStyle = gridColor;
              context.fillRect(left, y, innerWidth, 1);
            }

            // Visualize text
            if (textColor !== 'none') {
              context.fillStyle = textColor;
              context.font      = this.createFontString();
              context.fillText(t, x, (y - Math.floor(fontSize)));
            }
          }

          break;
        case 'uint':
        default    :
          for (const t of ['0.00', '0.25', '0.50', '0.75', '1.00']) {
            const x = Math.floor(left - context.measureText(t).width);
            const y = ((1 - parseFloat(t)) * innerHeight) + top;

            // Visualize grid
            if (gridColor !== 'none') {
              context.fillStyle = gridColor;
              context.fillRect(left, y, innerWidth, 1);
            }

            // Visualize text
            if (textColor !== 'none') {
              context.fillStyle = textColor;
              context.font      = this.createFontString();
              context.fillText(t, x, (y - Math.floor(fontSize)));
            }
          }

          break;
      }
    }
  }

  /**
   * This method visualizes spectrum to SVG.
   * @param {Uint8Array|Float32Array} data This argument is frequency domain data for spectrum.
   * @param {number} minDecibels This argument is in order to determine dB range of spectrum. Default value is -100 dB.
   * @param {number} maxDecibels This argument is in order to determine db range of spectrum. Default value is -30 dB.
   * @override
   */
  protected override visualizeBySVG(data: Uint8Array | Float32Array, minDecibels?: number, maxDecibels?: number): void {
    if ((this.svg === null) || !this.isActive) {
      return;
    }

    const mindB = minDecibels ?? -100;
    const maxdB = maxDecibels ?? -30;
    const range = maxdB - mindB;

    const svg = this.svg;

    const width       = parseInt((svg.getAttribute('width') ?? '0'), 10);
    const height      = parseInt((svg.getAttribute('height') ?? '0'), 10);
    const top         = this.styles.top ?? 0;
    const bottom      = this.styles.bottom ?? 0;
    const left        = this.styles.left ?? 30;
    const right       = this.styles.right ?? 30;
    const innerWidth  = width  - (left + right);
    const innerHeight = height - (top  + bottom);

    const waveColor = this.styles.wave ?? 'rgba(0, 0, 255, 1.0)';  // line only
    const lineWidth = this.styles.width ?? 1.5;
    const lineCap   = this.styles.cap ?? 'round';
    const lineJoin  = this.styles.join ?? 'miter';

    const gridColor = this.styles.grid ?? 'none';
    const textColor = this.styles.text ?? 'none';
    const fontSize  = parseInt((this.styles.font?.size ?? '13px'), 10);

    const actualSize = (this.size > data.length) ? data.length : this.size;

    // Frequency resolution (Sampling rate / FFT size)
    const fsDivN = this.sampleRate / (2 * data.length);

    // Visualize text at intervals of `this.textInterval`
    const numberOfTexts = Math.floor(this.textInterval / fsDivN);

    // Erase previous wave
    svg.innerHTML = '';

    // Begin visualization
    switch (this.type) {
      case 'float': {
        // Visualize wave
        const path = document.createElementNS(FFT.XMLNS, 'path');

        let d = '';

        for (let i = 0; i < actualSize; i++) {
          const x = Math.floor((i / actualSize) * innerWidth) + left;
          const y = Math.floor(-1 * (data[i] - maxdB) * (innerHeight / range)) + top;

          if (i === 0) {
            d += `M${x + (lineWidth / 2)} ${y}`;
          } else {
            d += ` L${x} ${y}`;
          }
        }

        path.setAttribute('d', d);

        path.setAttribute('stroke',          waveColor);  // line only
        path.setAttribute('fill',            'none');
        path.setAttribute('stroke-width',    lineWidth.toString(10));
        path.setAttribute('stroke-linecap',  lineCap);
        path.setAttribute('stroke-linejoin', lineJoin);

        svg.appendChild(path);

        break;
      }

      case 'uint':
      default    : {
        switch (this.styles.shape) {
          case 'line': {
            // Visualize wave
            const path = document.createElementNS(FFT.XMLNS, 'path');

            let d = '';

            for (let i = 0; i < actualSize; i++) {
              const x = Math.floor((i / actualSize) * innerWidth) + left;
              const y = Math.floor((1 - (data[i] / 255)) * innerHeight) + top;

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
            // Visualize wave
            let defs = null;

            if (this.styles.gradients) {
              defs = this.createSVGLinearGradient(FFT.SVG_LINEAR_GRADIENT_ID_FFT);
            }

            // Visualize wave
            const g = document.createElementNS(FFT.XMLNS, 'g');

            if (defs !== null) {
              g.appendChild(defs);
            }

            for (let i = 0; i < actualSize; i++) {
              const rect = document.createElementNS(FFT.XMLNS, 'rect');

              const x = Math.floor((i / actualSize) * innerWidth) + left;
              const y = Math.floor((data[i] / 255) * innerHeight);

              rect.setAttribute('x',     x.toString(10));
              rect.setAttribute('y',     (top + innerHeight).toString(10));
              rect.setAttribute('width', lineWidth.toString(10));

              if (y < 0) {
                rect.setAttribute('height', `-${y}`);
              } else {
                rect.setAttribute('height',    y.toString(10));
                rect.setAttribute('transform', `rotate(180 ${x + (lineWidth / 2)} ${top + innerHeight})`);
              }

              rect.setAttribute('stroke', 'none');
              rect.setAttribute('fill',   (defs === null) ? waveColor : `url(#${FFT.SVG_LINEAR_GRADIENT_ID_FFT}-${this.channel})`);

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
    }

    if ((gridColor !== 'none') || (textColor !== 'none')) {
      // Visualize grid and text (X axis)
      for (let i = 0; i < actualSize; i++) {
        if ((i % numberOfTexts) === 0) {
          const x = Math.floor((i / actualSize) * innerWidth) + left;

          const f = Math.floor(this.textInterval * (i / numberOfTexts));
          const t = (f < 1000) ? `${f} Hz` : `${String(f / 1000).slice(0, 3)} kHz`;

          // Visualize grid
          if (gridColor !== 'none') {
            const rect = document.createElementNS(FFT.XMLNS, 'rect');

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
            const text = document.createElementNS(FFT.XMLNS, 'text');

            text.textContent = t;

            text.setAttribute('x', x.toString(10));
            text.setAttribute('y', (top + innerHeight + fontSize).toString(10));

            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('stroke',      'none');
            text.setAttribute('fill',        textColor);
            text.setAttribute('font-family', (this.styles.font?.family ?? 'Arial'));
            text.setAttribute('font-size',   fontSize.toString(10));
            text.setAttribute('font-style',  this.styles.font?.style ?? 'normal');
            text.setAttribute('font-weight',  this.styles.font?.weight ?? 'normal');

            svg.appendChild(text);
          }
        }
      }

      // Visualize grid and text (Y axis)
      switch (this.type) {
        case 'float': {
          for (let i = mindB; i <= maxdB; i += 10) {
            const t = `${i}dB`;
            const x = left;
            const y = Math.floor(((-1 * (i - maxdB)) / range) * innerHeight) + top;

            // Visualize grid
            if (gridColor !== 'none') {
              const rect = document.createElementNS(FFT.XMLNS, 'rect');

              rect.setAttribute('x',      x.toString(10));
              rect.setAttribute('y',      y.toString(10));
              rect.setAttribute('width',  innerWidth.toString(10));
              rect.setAttribute('height', '1');

              rect.setAttribute('stroke', 'none');
              rect.setAttribute('fill',   gridColor);

              svg.appendChild(rect);
            }

            // Visualize text
            if (gridColor !== 'none') {
              const text = document.createElementNS(FFT.XMLNS, 'text');

              text.textContent = t;

              text.setAttribute('x', x.toString(10));
              text.setAttribute('y', (y - Math.floor(fontSize / 4)).toString(10));

              text.setAttribute('text-anchor', 'end');
              text.setAttribute('stroke',      'none');
              text.setAttribute('fill',        textColor);
              text.setAttribute('font-family', this.styles.font?.family ?? 'Arial');
              text.setAttribute('font-size',   fontSize.toString(10));
              text.setAttribute('font-style',  this.styles.font?.style ?? 'normal');
              text.setAttribute('font-weight', this.styles.font?.weight ?? 'normal');

              svg.appendChild(text);
            }
          }

          break;
        }

        case 'uint':
        default    : {
          for (const t of ['0.00', '0.25', '0.50', '0.75', '1.00']) {
            const x = left;
            const y = ((1 - parseFloat(t)) * innerHeight) + top;

            // Visualize grid
            if (gridColor !== 'none') {
              const rect = document.createElementNS(FFT.XMLNS, 'rect');

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
              const text = document.createElementNS(FFT.XMLNS, 'text');

              text.textContent = t;

              text.setAttribute('x', x.toString(10));
              text.setAttribute('y', (y - Math.floor(fontSize / 4)).toString(10));

              text.setAttribute('text-anchor', 'end');
              text.setAttribute('stroke',      'none');
              text.setAttribute('fill',        textColor);
              text.setAttribute('font-family', this.styles.font?.family ?? 'Arial');
              text.setAttribute('font-size',   fontSize.toString(10));
              text.setAttribute('font-style',  this.styles.font?.style ?? 'normal');
              text.setAttribute('font-weight', this.styles.font?.weight ?? 'normal');

              svg.appendChild(text);
            }
          }

          break;
        }
      }
    }
  }
}
