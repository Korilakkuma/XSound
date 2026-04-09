import type { ChannelNumber } from '../../types';
import type { DataType } from '../Analyser';
import type { VisualizerParams, GraphicsStyles, SpectrumScale } from './Visualizer';

import { Visualizer } from './Visualizer';

export type FFTParams = VisualizerParams & {
  type?: DataType,
  size?: number,
  scale?: SpectrumScale,
  logarithmicFrequencies?: number[],
  textInterval?: number,
  readonly minFrequency?: number,
  readonly maxFrequency?: number
};

/**
 * This private class visualizes spectrum.
 */
export class FFT extends Visualizer {
  private type: DataType = 'uint';

  // Range for visualization
  private size = 256;

  private scale: SpectrumScale = 'linear';

  // for logarithmic
  private logarithmicFrequencies: number[] = [32, 62.5, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
  private minFrequency = this.logarithmicFrequencies[0];
  private maxFrequency = this.logarithmicFrequencies[this.logarithmicFrequencies.length - 1];
  private ratio = this.maxFrequency / this.minFrequency;
  private log10Ratio = Math.log10(this.ratio);

  // Visualize text at intervals of this value [Hz]
  private textInterval = 1000;

  /**
   * @param {number} sampleRate This argument is sample rate.
   * @param {ChannelNumber} channel This argument is channel number (Left: 0, Right: 1 ...).
   * @param {AnalyserNode} analyser This argument is instance of `AnalyserNode`.
   */
  // eslint-disable-next-line no-useless-constructor
  constructor(sampleRate: number, channel: ChannelNumber, analyser: AnalyserNode) {
    super(sampleRate, channel, analyser);
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
  public override param(params: 'scale'): SpectrumScale;
  public override param(params: 'logarithmicFrequencies'): number[];
  public override param(params: 'minFrequency'): number;
  public override param(params: 'maxFrequency'): number;
  public override param(params: 'textInterval'): number;
  public override param(params: FFTParams): FFT;
  public override param(params: keyof FFTParams | FFTParams): FFTParams[keyof FFTParams] | FFT {
    if (typeof params === 'string') {
      switch (params) {
        case 'type': {
          return this.type;
        }

        case 'size': {
          return this.size;
        }

        case 'scale': {
          return this.scale;
        }

        case 'logarithmicFrequencies': {
          return this.logarithmicFrequencies;
        }

        case 'minFrequency': {
          return this.minFrequency;
        }

        case 'maxFrequency': {
          return this.maxFrequency;
        }

        case 'textInterval': {
          return this.textInterval;
        }

        case 'interval': {
          return super.param(params);
        }

        case 'styles': {
          return super.param(params);
        }
      }
    }

    for (const [key, value] of Object.entries(params)) {
      switch (key) {
        case 'type': {
          if (typeof value === 'string') {
            if ((value === 'uint') || (value === 'float')) {
              this.type = value;
            }
          }

          break;
        }

        case 'size': {
          if (typeof value === 'number') {
            this.size = value;
          }

          break;
        }

        case 'scale': {
          if (typeof value === 'string') {
            if ((value === 'linear') || (value === 'logarithmic')) {
              this.scale = value;
            }
          }

          break;
        }

        case 'logarithmicFrequencies': {
          if (Array.isArray(value)) {
            this.logarithmicFrequencies = value;

            this.minFrequency = value[0];
            this.maxFrequency = value[value.length - 1];
            this.ratio        = this.maxFrequency / this.minFrequency;
            this.log10Ratio   = Math.log10(this.ratio);
          }

          break;
        }

        case 'textInterval': {
          if (typeof value === 'number') {
            this.textInterval = value;
          }

          break;
        }
      }
    }

    super.param(params);

    return this;
  }

  /**
   * This method visualizes spectrum to Canvas.
   * @param {Uint8Array|Float32Array} data This argument is frequency domain data for spectrum.
   * @param {number} minDecibels This argument is in order to determine dB range of spectrum. The default value is -100 dB.
   * @param {number} maxDecibels This argument is in order to determine db range of spectrum. The default value is -30 dB.
   * @override
   */
  protected override renderCanvas(data: Uint8Array | Float32Array, minDecibels?: number, maxDecibels?: number): void {
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
    const frequencyResolution = this.sampleRate / (2 * data.length);

    // Visualize text at intervals of `this.textInterval`
    const numberOfTexts = Math.trunc(this.textInterval / frequencyResolution);

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

        switch (this.scale) {
          case 'linear': {
            for (let k = 0; k < actualSize; k++) {
              const x = ((k / actualSize) * innerWidth) + left;
              const y = ((0 - (data[k] - maxdB)) * (innerHeight / range)) + top;

              if (k === 0) {
                context.moveTo((x + (lineWidth / 2)), y);
              } else {
                context.lineTo(x, y);
              }
            }

            break;
          }

          case 'logarithmic': {
            for (let k = 0, len = data.length; k < len; k++) {
              if (k === 0) {
                continue;
              }

              const frequency           = k * frequencyResolution;
              const frequencyRatio      = frequency / this.minFrequency;
              const log10FrequencyRatio = Math.log10(frequencyRatio);

              const x = ((log10FrequencyRatio / this.log10Ratio) * innerWidth) + left;
              const y = ((0 - (data[k] - maxdB)) * (innerHeight / range)) + top;

              // HACK: Because of infinity sometimes
              if (!Number.isFinite(y)) {
                continue;
              }

              if ((x < left) || (x > (left + innerWidth))) {
                continue;
              }

              if (k === 1) {
                context.moveTo((left + (lineWidth / 2)), y);
              } else {
                context.lineTo(x, y);
              }
            }

            break;
          }
        }

        context.stroke();

        break;
      }

      case 'uint': {
        switch (this.styles.shape) {
          case 'line': {
            // Set style
            context.strokeStyle = waveColor;
            context.lineWidth   = lineWidth;
            context.lineCap     = lineCap;
            context.lineJoin    = lineJoin;

            context.beginPath();

            // Visualize wave
            for (let k = 0; k < actualSize; k++) {
              const x = ((k / actualSize) * innerWidth) + left;
              const y = ((1 - (data[k] / 255)) * innerHeight) + top;

              if (k === 0) {
                context.moveTo((x + (lineWidth / 2)), y);
              } else {
                context.lineTo(x, y);
              }
            }

            context.stroke();

            break;
          }

          case 'rect': {
            // Visualize wave
            for (let k = 0; k < actualSize; k++) {
              const x = ((k / actualSize) * innerWidth) + left;
              const y = (0 - (data[k] / 255)) * innerHeight;

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
          }
        }

        break;
      }
    }

    if ((gridColor !== 'none') || (textColor !== 'none')) {
      // Visualize grid and text (X axis)
      if ((this.type === 'uint') || ((this.type === 'float') && (this.scale === 'linear'))) {
        for (let k = 0; k < actualSize; k++) {
          if ((k % numberOfTexts) === 0) {
            const x = ((k / actualSize) * innerWidth) + left;

            const frequency     = k * frequencyResolution;
            const frequencyText = (frequency < 1000) ? `${frequency} Hz` : `${(frequency / 1000).toString(10).slice(0, 3)} kHz`;

            // Visualize grid
            if (gridColor !== 'none') {
              context.fillStyle = gridColor;
              context.fillRect(x, top, 1, innerHeight);
            }

            // Visualize text
            if (textColor !== 'none') {
              context.fillStyle = textColor;
              context.font      = this.createFontString();
              context.fillText(frequencyText, (x - (context.measureText(frequencyText).width / 2)), (top + innerHeight + fontSize));
            }
          }
        }
      } else {
        this.logarithmicFrequencies.forEach((frequency: number) => {
          const frequencyRatio      = frequency / this.minFrequency;
          const log10FrequencyRatio = Math.log10(frequencyRatio);

          const x = ((log10FrequencyRatio / this.log10Ratio) * innerWidth) + left;

          const frequencyText = (frequency < 1000) ? `${frequency} Hz` : `${(frequency / 1000).toString(10).slice(0, 3)} kHz`;

          // Visualize grid
          if (gridColor !== 'none') {
            context.fillStyle = gridColor;
            context.fillRect(x, top, 1, innerHeight);
          }

          // Visualize text
          if (textColor !== 'none') {
            context.fillStyle = textColor;
            context.font      = this.createFontString();
            context.fillText(frequencyText, (x - (context.measureText(frequencyText).width / 2)), (top + innerHeight + fontSize));
          }
        });
      }

      // Visualize grid and text (Y axis)
      switch (this.type) {
        case 'float': {
          for (let amplitude = mindB; amplitude <= maxdB; amplitude += 10) {
            const amplitudeText = `${amplitude} dB`;

            const x = (left - context.measureText(amplitudeText).width);
            const y = ((0 - (amplitude - maxdB)) * (innerHeight / range)) + top;

            // Visualize grid
            if (gridColor !== 'none') {
              context.fillStyle = gridColor;
              context.fillRect(left, y, innerWidth, 1);
            }

            // Visualize text
            if (textColor !== 'none') {
              context.fillStyle = textColor;
              context.font      = this.createFontString();
              context.fillText(amplitudeText, x, y);
            }
          }

          break;
        }

        case 'uint': {
          const amplitudes      = [1, 0.5, 0];
          const numberOfDivides = amplitudes.length - 1;

          amplitudes.forEach((amplitude, index) => {
            const amplitudeText = amplitude.toFixed(1);

            const x = (left - context.measureText(amplitudeText).width);
            const y = ((innerHeight / numberOfDivides) * index) + top;

            // Visualize grid
            if (gridColor !== 'none') {
              context.fillStyle = gridColor;
              context.fillRect(left, y, innerWidth, 1);
            }

            // Visualize text
            if (textColor !== 'none') {
              context.fillStyle = textColor;
              context.font      = this.createFontString();
              context.fillText(amplitudeText, x, y);
            }
          });

          break;
        }
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
  protected override renderSVG(data: Uint8Array | Float32Array, minDecibels?: number, maxDecibels?: number): void {
    if ((this.svg === null) || !this.isActive) {
      return;
    }

    const mindB = minDecibels ?? -100;
    const maxdB = maxDecibels ?? -30;
    const range = maxdB - mindB;

    const svg = this.svg;

    const width       = Number((svg.getAttribute('width') ?? '0'));
    const height      = Number((svg.getAttribute('height') ?? '0'));
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
    const frequencyResolution = this.sampleRate / (2 * data.length);

    // Visualize text at intervals of `this.textInterval`
    const numberOfTexts = Math.trunc(this.textInterval / frequencyResolution);

    // Erase previous wave
    svg.innerHTML = '';

    // Begin visualization
    switch (this.type) {
      case 'float': {
        // Visualize wave
        const path = document.createElementNS(FFT.XMLNS, 'path');

        let d = '';

        switch (this.scale) {
          case 'linear': {
            for (let k = 0; k < actualSize; k++) {
              const x = ((k / actualSize) * innerWidth) + left;
              const y = ((0 - (data[k] - maxdB)) * (innerHeight / range)) + top;

              // HACK: Because of infinity sometimes
              if (!Number.isFinite(x) || !Number.isFinite(y)) {
                continue;
              }

              if (d === '') {
                d += `M${x + (lineWidth / 2)} ${y}`;
              } else {
                d += ` L${x} ${y}`;
              }
            }

            break;
          }

          case 'logarithmic': {
            for (let k = 0; k < data.length; k++) {
              if (k === 0) {
                continue;
              }

              const frequency           = k * frequencyResolution;
              const frequencyRatio      = frequency / this.minFrequency;
              const log10FrequencyRatio = Math.log10(frequencyRatio);

              const x = ((log10FrequencyRatio / this.log10Ratio) * innerWidth) + left;
              const y = ((0 - (data[k] - maxdB)) * (innerHeight / range)) + top;

              // HACK: Because of infinity sometimes
              if (!Number.isFinite(y)) {
                continue;
              }

              if ((x < left) || (x > (left + innerWidth))) {
                continue;
              }

              if (d === '') {
                d += `M${x} ${y}`;
              } else {
                d += ` L${x} ${y}`;
              }
            }

            break;
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

      case 'uint': {
        switch (this.styles.shape) {
          case 'line': {
            // Visualize wave
            const path = document.createElementNS(FFT.XMLNS, 'path');

            let d = '';

            for (let k = 0; k < actualSize; k++) {
              const x = ((k / actualSize) * innerWidth) + left;
              const y = ((1 - (data[k] / 255)) * innerHeight) + top;

              if (k === 0) {
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
              defs = this.createSVGLinearGradient(`${FFT.SVG_LINEAR_GRADIENT_ID_FFT}-${this.channel}`);
            }

            // Visualize wave
            const g = document.createElementNS(FFT.XMLNS, 'g');

            if (defs !== null) {
              g.appendChild(defs);
            }

            for (let k = 0; k < actualSize; k++) {
              const rect = document.createElementNS(FFT.XMLNS, 'rect');

              const x = ((k / actualSize) * innerWidth) + left;
              const y = (data[k] / 255) * innerHeight;

              rect.setAttribute('x',     x.toString(10));
              rect.setAttribute('y',     (top + innerHeight).toString(10));
              rect.setAttribute('width', lineWidth.toString(10));
              rect.setAttribute('height', Math.abs(y).toString(10));

              if (y >= 0) {
                rect.setAttribute('transform', `rotate(180 ${x + (lineWidth / 2)} ${top + innerHeight})`);
              }

              rect.setAttribute('stroke', 'none');
              rect.setAttribute('fill',   (defs === null) ? waveColor : `url(#${FFT.SVG_LINEAR_GRADIENT_ID_FFT}-${this.channel})`);

              g.appendChild(rect);
            }

            svg.appendChild(g);

            break;
          }
        }

        break;
      }
    }

    if ((gridColor !== 'none') || (textColor !== 'none')) {
      // Visualize grid and text (X axis)
      if ((this.type === 'uint') || ((this.type === 'float') && (this.scale === 'linear'))) {
        for (let k = 0; k < actualSize; k++) {
          if ((k % numberOfTexts) === 0) {
            const x = ((k / actualSize) * innerWidth) + left;

            const frequency     = k * frequencyResolution;
            const frequencyText = (frequency < 1000) ? `${frequency} Hz` : `${(frequency / 1000).toString(10).slice(0, 3)} kHz`;

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

              text.textContent = frequencyText;

              text.setAttribute('x', x.toString(10));
              text.setAttribute('y', (top + innerHeight + bottom).toString(10));

              text.setAttribute('text-anchor', 'middle');
              text.setAttribute('stroke',      'none');
              text.setAttribute('fill',        textColor);
              text.setAttribute('font-family', (this.styles.font?.family ?? 'Arial'));
              text.setAttribute('font-size',   fontSize.toString(10));
              text.setAttribute('font-style',  this.styles.font?.style ?? 'normal');
              text.setAttribute('font-weight', this.styles.font?.weight ?? 'normal');

              svg.appendChild(text);
            }
          }
        }
      } else {
        this.logarithmicFrequencies.forEach((frequency: number) => {
          const frequencyRatio      = frequency / this.minFrequency;
          const log10FrequencyRatio = Math.log10(frequencyRatio);

          const x = ((log10FrequencyRatio / this.log10Ratio) * innerWidth) + left;

          const frequencyText = (frequency < 1000) ? `${frequency} Hz` : `${(frequency / 1000).toString(10).slice(0, 3)} kHz`;

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

            text.textContent = frequencyText;

            text.setAttribute('x', x.toString(10));
            text.setAttribute('y', (top + innerHeight + bottom).toString(10));

            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('stroke',      'none');
            text.setAttribute('fill',        textColor);
            text.setAttribute('font-family', (this.styles.font?.family ?? 'Arial'));
            text.setAttribute('font-size',   fontSize.toString(10));
            text.setAttribute('font-style',  this.styles.font?.style ?? 'normal');
            text.setAttribute('font-weight', this.styles.font?.weight ?? 'normal');

            svg.appendChild(text);
          }
        });
      }

      // Visualize grid and text (Y axis)
      switch (this.type) {
        case 'float': {
          for (let amplitude = mindB; amplitude <= maxdB; amplitude += 10) {
            const amplitudeText = `${amplitude} dB`;

            const x = left;
            const y = ((0 - (amplitude - maxdB)) * (innerHeight / range)) + top;

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

              text.textContent = amplitudeText;

              text.setAttribute('x', x.toString(10));
              text.setAttribute('y', (y - (fontSize / 4)).toString(10));

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

        case 'uint': {
          const amplitudes      = [1, 0.5, 0];
          const numberOfDivides = amplitudes.length - 1;

          amplitudes.forEach((amplitude, index) => {
            const amplitudeText = amplitude.toFixed(1);

            const x = left;
            const y = ((innerHeight / numberOfDivides) * index) + top;

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

              text.textContent = amplitudeText;

              text.setAttribute('x', x.toString(10));
              text.setAttribute('y', (y - (fontSize / 4)).toString(10));

              text.setAttribute('text-anchor', 'end');
              text.setAttribute('stroke',      'none');
              text.setAttribute('fill',        textColor);
              text.setAttribute('font-family', this.styles.font?.family ?? 'Arial');
              text.setAttribute('font-size',   fontSize.toString(10));
              text.setAttribute('font-style',  this.styles.font?.style ?? 'normal');
              text.setAttribute('font-weight', this.styles.font?.weight ?? 'normal');

              svg.appendChild(text);
            }
          });

          break;
        }
      }
    }
  }
}
