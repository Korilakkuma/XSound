import type { ChannelNumber } from '../../types';
import type { VisualizerParams, GraphicsStyles, SpectrumScale } from './Visualizer';

import { Visualizer } from './Visualizer';

export type SpectrogramParams = VisualizerParams & {
  size?: number,
  scale?: SpectrumScale,
  plotInterval?: number,
  readonly minFrequency?: number,
  readonly maxFrequency?: number
};

/**
 * This private class visualizes spectrogram.
 */
export class Spectrogram extends Visualizer {
  // for logarithmic
  private static readonly MIN_FREQUENCY           = 62.5 as const;
  private static readonly MAX_FREQUENCY           = 8000 as const;
  private static readonly LOGARITHMIC_FREQUENCIES = [62.5, 125, 250, 500, 1000, 2000, 4000, 8000] as const;

  private scale: SpectrumScale = 'logarithmic';

  private plotInterval = 4;
  private timeOffset = 1;

  private renderSize = 256;

  private imagedata: ImageData | null = null;

  /**
   * This function maps unsigned int 8 bits to alpha value.
   * @param {Uint8Array[0]} data This argument is converted to alpha value based on mapping algorithm.
   * @return {string} Return value is alpha value between `0%` and `100%`.
   */
  static numberToAlpha(data: Uint8Array[0]): string {
    if (data > 200) {
      return '100%';
    }

    if (data > 128) {
      return '25%';
    }

    if (data > 64) {
      return '12%';
    }

    return '6%';
  };

  /**
   * @param {number} sampleRate This argument is sample rate.
   * @param {ChannelNumber} channel This argument is channel number (Left: 0, Right: 1 ...).
   */
  // eslint-disable-next-line no-useless-constructor
  constructor(sampleRate: number, channel: ChannelNumber) {
    super(sampleRate, channel);
  }

  /**
   * This method gets or sets parameters for visualizing spectrogram.
   * This method is overloaded for type interface and type check.
   * @param {keyof SpectrogramParams|SpectrogramParams} params This argument is string if getter. Otherwise, setter.
   * @return {SpectrogramParams[keyof SpectrogramParams]|Spectrogram} Return value is parameter for visualizing spectrogram if getter.
   *     Otherwise, return value is for method chain.
   * @override
   */
  public override param(params: 'interval'): number;
  public override param(params: 'styles'): GraphicsStyles;
  public override param(params: 'size'): number;
  public override param(params: 'scale'): SpectrumScale;
  public override param(params: 'plotInterval'): number;
  public override param(params: 'minFrequency'): number;
  public override param(params: 'maxFrequency'): number;
  public override param(params: SpectrogramParams): Spectrogram;
  public override param(params: keyof SpectrogramParams | SpectrogramParams): SpectrogramParams[keyof SpectrogramParams] | Spectrogram {
    if (typeof params === 'string') {
      switch (params) {
        case 'size': {
          return this.renderSize;
        }

        case 'scale': {
          return this.scale;
        }

        case 'plotInterval': {
          return this.plotInterval;
        }

        case 'minFrequency': {
          return Spectrogram.MIN_FREQUENCY;
        }

        case 'maxFrequency': {
          return Spectrogram.MAX_FREQUENCY;
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
        case 'size': {
          if (typeof value === 'number') {
            this.renderSize = value;
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

        case 'plotInterval': {
          if (typeof value === 'number') {
            this.plotInterval = value;
          }

          break;
        }
      }
    }

    super.param(params);

    return this;
  }

  /**
   * This method visualizes spectrogram to Canvas.
   * @param {Uint8Array} data This argument is frequency domain data for spectrogram.
   * @override
   */
  protected override visualizeOnCanvas(data: Uint8Array): void {
    if ((this.canvas === null) || (this.context === null) || !this.isActive) {
      return;
    }

    const context = this.context;

    const width       = this.canvas.width;
    const height      = this.canvas.height;
    const top         = this.styles.top ?? 0;
    const bottom      = this.styles.bottom ?? 0;
    const left        = this.styles.left ?? 30;
    const right       = this.styles.right ?? 30;
    const innerWidth  = width  - (left + right);
    const innerHeight = height - (top  + bottom);

    const gridColor = this.styles.grid ?? 'none';
    const textColor = this.styles.text ?? 'none';

    // Frequency resolution (Sampling rate / FFT size)
    const frequencyResolution = this.sampleRate / (2 * data.length);

    if (this.imagedata === null) {
      // Erase previous wave
      context.clearRect(0, 0, width, height);

      // Render Graph
      context.fillStyle = gridColor;
      context.fillRect(left, (top + innerHeight), innerWidth, 2);
      context.fillRect(left, top, 2, innerHeight);

      // Render coordinate
      context.fillStyle = textColor;
      context.font      = this.createFontString();
      context.textAlign = 'end';

      switch (this.scale) {
        case 'linear': {
          const length = Math.min(data.length, this.renderSize);

          const h = innerHeight / length;

          for (let k = 0; k < length; k++) {
            const f = k * frequencyResolution;
            const x = left;
            const y = (top + innerHeight) - Math.trunc(f * (innerHeight / length));

            if (((y - h) < top) || (y > (top + innerHeight))) {
              continue;
            }

            if (f >= 1000) {
              context.fillText(`${Math.trunc(f / 1000)} kHz`, x, y);
            } else {
              context.fillText(`${Math.trunc(f)} Hz`, x, y);
            }
          }

          break;
        }

        case 'logarithmic': {
          Spectrogram.LOGARITHMIC_FREQUENCIES.forEach((f: 62.5 | 125 | 250 | 500 | 1000 | 2000 | 4000 | 8000, index: number) => {
            const x = left;
            const y = (top + innerHeight) - ((index / Spectrogram.LOGARITHMIC_FREQUENCIES.length) * innerHeight);

            if (f >= 1000) {
              context.fillText(`${Math.trunc(f / 1000)} kHz`, x, y);
            } else {
              context.fillText(`${f} Hz`, x, y);
            }
          });

          break;
        }
      }
    } else {
      context.putImageData(this.imagedata, 0, 0);
    }

    // Render spectrogram
    switch (this.scale) {
      case 'linear': {
        const length = Math.min(data.length, this.renderSize);

        const h = parseInt((this.styles.font?.size ?? '13'), 10);

        for (let k = 0; k < length; k++) {
          const f = k * frequencyResolution;
          const x = left + this.timeOffset;
          const y = (top + innerHeight) - Math.trunc(f * (innerHeight / length));

          if (((y - h) < top) || (y > (top + innerHeight))) {
            continue;
          }

          // TODO: Mapping function that maps uint 8 or float 32 to color value
          const alpha = Spectrogram.numberToAlpha(data[k]);

          context.fillStyle = `rgba(0 0 255 / ${alpha})`;
          context.fillRect(x, (y - h), 1, h);
        }

        break;
      }

      case 'logarithmic': {
        const ratio = Math.log10(Spectrogram.MAX_FREQUENCY / Spectrogram.MIN_FREQUENCY);

        const h = innerHeight / Spectrogram.LOGARITHMIC_FREQUENCIES.length;

        for (let k = 0, len = data.length; k < len; k++) {
          if (k === 0) {
            continue;
          }

          if (k % this.plotInterval !== 0) {
            continue;
          }

          const x = left + this.timeOffset;
          const y = (top + innerHeight) - ((Math.log10((k * frequencyResolution) / Spectrogram.MIN_FREQUENCY) / ratio) * innerHeight);

          if (((y - h) < top) || (y > (top + innerHeight))) {
            continue;
          }

          // TODO: Mapping function that maps uint 8 or float 32 to color value
          const alpha = Spectrogram.numberToAlpha(data[k]);

          context.fillStyle = `rgba(0 0 255 / ${alpha})`;
          context.fillRect(x, (y - h), 1, h);
        }

        break;
      }
    }

    // Render time text
    context.fillStyle = textColor;
    context.font      = this.createFontString();
    context.textAlign = 'center';

    this.timeOffset += 1;

    this.imagedata = context.getImageData(0, 0, width, height);
  }

  /**
   * This method visualizes spectrogram to SVG.
   * @param {Uint8Array} data This argument is frequency domain data for spectrogram.
   * @override
   */
  protected override visualizeBySVG(data: Uint8Array): void {
    if ((this.svg === null) || !this.isActive) {
      return;
    }

    const svg = this.svg;

    const width       = Number((svg.getAttribute('width') ?? '0'));
    const height      = Number((svg.getAttribute('height') ?? '0'));
    const top         = this.styles.top ?? 0;
    const bottom      = this.styles.bottom ?? 0;
    const left        = this.styles.left ?? 30;
    const right       = this.styles.right ?? 30;
    const innerWidth  = width  - (left + right);
    const innerHeight = height - (top  + bottom);

    const gridColor = this.styles.grid ?? 'none';
    const textColor = this.styles.text ?? 'none';
    const fontSize  = parseInt((this.styles.font?.size ?? '13px'), 10);

    // Frequency resolution (Sampling rate / FFT size)
    const frequencyResolution = this.sampleRate / (2 * data.length);

    if (svg.innerHTML.length === 0) {
      // Render Graph
      const rectX = document.createElementNS(Spectrogram.XMLNS, 'rect');

      rectX.setAttribute('x', left.toString(10));
      rectX.setAttribute('y', (top + innerHeight).toString(10));
      rectX.setAttribute('width', innerWidth.toString(10));
      rectX.setAttribute('height', '2');
      rectX.setAttribute('fill', gridColor);
      rectX.setAttribute('stroke', 'none');

      const rectY = document.createElementNS(Spectrogram.XMLNS, 'rect');

      rectY.setAttribute('x', left.toString(10));
      rectY.setAttribute('y', top.toString(10));
      rectY.setAttribute('width', '2');
      rectY.setAttribute('height', innerHeight.toString(10));
      rectY.setAttribute('fill', gridColor);
      rectY.setAttribute('stroke', 'none');

      svg.appendChild(rectX);
      svg.appendChild(rectY);

      // Render coordinate
      switch (this.scale) {
        case 'linear': {
          const length = Math.min(data.length, this.renderSize);

          const h = innerHeight / length;

          const g = document.createElementNS(Spectrogram.XMLNS, 'g');

          for (let k = 0; k < length; k++) {
            const f = k * frequencyResolution;
            const x = left;
            const y = (top + innerHeight) - Math.trunc(f * (innerHeight / length));

            if (((y - h) < top) || (y > (top + innerHeight))) {
              continue;
            }

            const text = document.createElementNS(Spectrogram.XMLNS, 'text');

            if (f >= 1000) {
              text.textContent = `${Math.trunc(f / 1000)} kHz`;
            } else {
              text.textContent = `${Math.trunc(f)} Hz`;
            }

            text.setAttribute('x', x.toString(10));
            text.setAttribute('y', y.toString(10));
            text.setAttribute('text-anchor', 'end');
            text.setAttribute('stroke', 'none');
            text.setAttribute('fill', textColor);
            text.setAttribute('font-size', fontSize.toString(10));

            g.appendChild(text);
          }

          svg.appendChild(g);

          break;
        }

        case 'logarithmic': {
          const g = document.createElementNS(Spectrogram.XMLNS, 'g');

          Spectrogram.LOGARITHMIC_FREQUENCIES.forEach((f: 62.5 | 125 | 250 | 500 | 1000 | 2000 | 4000 | 8000, index: number) => {
            const x = left;
            const y = (top + innerHeight) - ((index / Spectrogram.LOGARITHMIC_FREQUENCIES.length) * innerHeight);

            const text = document.createElementNS(Spectrogram.XMLNS, 'text');

            if (f >= 1000) {
              text.textContent = `${Math.trunc(f / 1000)} kHz`;
            } else {
              text.textContent = `${f} Hz`;
            }

            text.setAttribute('x', x.toString(10));
            text.setAttribute('y', y.toString(10));
            text.setAttribute('text-anchor', 'end');
            text.setAttribute('stroke', 'none');
            text.setAttribute('fill', textColor);
            text.setAttribute('font-size', fontSize.toString(10));

            g.appendChild(text);
          });

          svg.appendChild(g);

          break;
        }
      }
    }

    // Render spectrogram
    switch (this.scale) {
      case 'linear': {
        const length = Math.min(data.length, this.renderSize);

        const h = parseInt((this.styles.font?.size ?? '13'), 10);

        const g = document.createElementNS(Spectrogram.XMLNS, 'g');

        for (let k = 0; k < length; k++) {
          const f = k * frequencyResolution;
          const x = left + this.timeOffset;
          const y = (top + innerHeight) - Math.trunc(f * (innerHeight / length));

          if (((y - h) < top) || (y > (top + innerHeight))) {
            continue;
          }

          const rect = document.createElementNS(Spectrogram.XMLNS, 'rect');

          // TODO: Mapping function that maps uint 8 or float 32 to color value
          const alpha = Spectrogram.numberToAlpha(data[k]);

          rect.setAttribute('x', x.toString(10));
          rect.setAttribute('y', (y - h).toString(10));
          rect.setAttribute('width', '1');
          rect.setAttribute('height', h.toString(10));
          rect.setAttribute('fill', `rgba(0 0 255 / ${alpha})`);
          rect.setAttribute('stroke', 'none');

          g.appendChild(rect);
        }

        svg.appendChild(g);

        break;
      }

      case 'logarithmic': {
        const g = document.createElementNS(Spectrogram.XMLNS, 'g');

        const ratio = Math.log10(Spectrogram.MAX_FREQUENCY / Spectrogram.MIN_FREQUENCY);

        const h = innerHeight / Spectrogram.LOGARITHMIC_FREQUENCIES.length;

        for (let k = 0, len = data.length; k < len; k++) {
          if (k === 0) {
            continue;
          }

          if (k % this.plotInterval !== 0) {
            continue;
          }

          const x = left + this.timeOffset;
          const y = (top + innerHeight) - ((Math.log10((k * frequencyResolution) / Spectrogram.MIN_FREQUENCY) / ratio) * innerHeight);

          if (((y - h) < top) || (y > (top + innerHeight))) {
            continue;
          }

          const rect = document.createElementNS(Spectrogram.XMLNS, 'rect');

          // TODO: Mapping function that maps uint 8 or float 32 to color value
          const alpha = Spectrogram.numberToAlpha(data[k]);

          rect.setAttribute('x', x.toString(10));
          rect.setAttribute('y', ((y - h) - 0).toString(10));
          rect.setAttribute('width', '1');
          rect.setAttribute('height', h.toString(10));
          rect.setAttribute('fill', `rgba(0 0 255 / ${alpha})`);
          rect.setAttribute('stroke', 'none');

          g.appendChild(rect);
        }

        svg.appendChild(g);

        break;
      }
    }

    this.timeOffset += 1;
  }
}
