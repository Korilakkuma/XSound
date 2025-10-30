import type { ChannelNumber } from '../../types';
import type { VisualizerParams, GraphicsStyles, SpectrumScale } from './Visualizer';

import { Visualizer } from './Visualizer';

export type SpectrogramParams = VisualizerParams & {
  size?: number,
  scale?: SpectrumScale,
  duration?: number,
  plotInterval?: number,
  timeTextInterval?: number,
  readonly minFrequency?: number,
  readonly maxFrequency?: number
};

/**
 * This private class visualizes spectrogram.
 */
export class Spectrogram extends Visualizer {
  // for logarithmic
  private static readonly MIN_FREQUENCY           = 32 as const;
  private static readonly MAX_FREQUENCY           = 16000 as const;
  private static readonly LOGARITHMIC_FREQUENCIES = [32, 62.5, 125, 250, 500, 1000, 2000, 4000, 8000, 16000] as const;

  private scale: SpectrumScale = 'logarithmic';

  private duration = 10;

  private plotInterval = 4;
  private timeTextInterval = 16;
  private timeOffset = 1;
  private numberOfSamples = 0;

  private renderSize = 256;

  private imagedata: ImageData | null = null;

  private colorFromNumber: ((data: Uint8Array[0]) => string) | null = null;

  /**
   * This function maps unsigned int 8 bits to color string by Jet colormap.
   * @param {Uint8Array[0]} data This argument is converted to color string based on Jet colormap.
   * @return {string} Return value is color string.
   */
  public static numberToJetColor(data: Uint8Array[0]): string {
    const rgba = 4 * (data / 255);

    const r = Math.max(0, Math.min(255, Math.trunc(Math.min((rgba - 1.5), (0 - rgba + 4.5)) * 255)));
    const g = Math.max(0, Math.min(255, Math.trunc(Math.min((rgba - 0.5), (0 - rgba + 3.5)) * 255)));
    const b = Math.max(0, Math.min(255, Math.trunc(Math.min((rgba + 0.5), (0 - rgba + 2.5)) * 255)));

    return `rgb(${r} ${g} ${b})`;
  };

  /**
   * @param {number} sampleRate This argument is sample rate.
   * @param {ChannelNumber} channel This argument is channel number (Left: 0, Right: 1 ...).
   */
  constructor(sampleRate: number, channel: ChannelNumber) {
    super(sampleRate, channel);

    this.interval = 40;
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
  public override param(params: 'duration'): number;
  public override param(params: 'plotInterval'): number;
  public override param(params: 'timeTextInterval'): number;
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

        case 'duration': {
          return this.duration;
        }

        case 'plotInterval': {
          return this.plotInterval;
        }

        case 'timeTextInterval': {
          return this.timeTextInterval;
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

        case 'duration': {
          if (typeof value === 'number') {
            if (value > 0) {
              this.duration = value;
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

        case 'timeTextInterval': {
          if (typeof value === 'number') {
            if (value > 0) {
              this.timeTextInterval = value;
            }
          }

          break;
        }
      }
    }

    super.param(params);

    return this;
  }

  /**
   * This method sets function that converts number to color string.
   * @param {function} func This argument is function that converts number to color string;
   * @return {Spectrogram} Return value is for method chain.
   */
  public setColorFromNumberFunction(func: ((data: Uint8Array[0]) => string) | null): Spectrogram {
    this.colorFromNumber = func;

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

    const frequencyBinCount = data.length;
    const fftSize           = 2 * frequencyBinCount;

    // Frequency resolution (Sampling rate / FFT size)
    const frequencyResolution = this.sampleRate / fftSize;

    const samples = this.duration * this.sampleRate;

    if (this.numberOfSamples >= samples) {
      this.imagedata = null;

      this.timeOffset      = 1;
      this.numberOfSamples = 0;
    }

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

      // X axis (time)
      context.textAlign = 'start';

      const textInterval = samples / this.timeTextInterval;

      for (let k = 0; k < samples; k++) {
        if ((k % textInterval) !== 0) {
          continue;
        }

        const x = k * (innerWidth / samples) + left;
        const y = top + innerHeight + parseInt((this.styles.font?.size ?? '13'), 10);

        const time = (k / samples) * this.duration;

        if ((time !== 0) && (time < 0.0001)) {
          context.fillText(`${(time * 1000).toFixed(1)} msec`, x, y);
        } else {
          context.fillText(`${time.toFixed(2)} sec`, x, y);
        }
      }

      context.textAlign = 'end';

      // Y axis (frequency)
      switch (this.scale) {
        case 'linear': {
          const length = Math.min(frequencyBinCount, this.renderSize);

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
          Spectrogram.LOGARITHMIC_FREQUENCIES.forEach((f: 32 | 62.5 | 125 | 250 | 500 | 1000 | 2000 | 4000 | 8000 | 16000, index: number) => {
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
        const length = Math.min(frequencyBinCount, this.renderSize);

        const h = parseInt((this.styles.font?.size ?? '13'), 10);

        for (let k = 0; k < length; k++) {
          const f = k * frequencyResolution;
          const x = left + this.timeOffset;
          const y = (top + innerHeight) - Math.trunc(f * (innerHeight / length));

          if (((y - h) < top) || (y > (top + innerHeight))) {
            continue;
          }

          if (this.colorFromNumber === null) {
            const color = Spectrogram.numberToJetColor(data[k]);

            context.fillStyle = color;
            context.fillRect(x, (y - h), 1, h);
          } else {
            const color = this.colorFromNumber(data[k]);

            context.fillStyle = color;
            context.fillRect(x, (y - h), 1, h);
          }
        }

        break;
      }

      case 'logarithmic': {
        const ratio = Math.log10(Spectrogram.MAX_FREQUENCY / Spectrogram.MIN_FREQUENCY);

        const h = innerHeight / Spectrogram.LOGARITHMIC_FREQUENCIES.length;

        for (let k = 0; k < frequencyBinCount; k++) {
          if (k === 0) {
            continue;
          }

          if ((k % this.plotInterval) !== 0) {
            continue;
          }

          const x = left + this.timeOffset;
          const y = (top + innerHeight) - ((Math.log10((k * frequencyResolution) / Spectrogram.MIN_FREQUENCY) / ratio) * innerHeight);

          if (((y - h) < top) || (y > (top + innerHeight))) {
            continue;
          }

          if (this.colorFromNumber === null) {
            const color = Spectrogram.numberToJetColor(data[k]);

            context.fillStyle = color;
            context.fillRect(x, (y - h), 1, h);
          } else {
            const color = this.colorFromNumber(data[k]);

            context.fillStyle = color;
            context.fillRect(x, (y - h), 1, h);
          }
        }

        break;
      }
    }

    // Render time text
    context.fillStyle = textColor;
    context.font      = this.createFontString();
    context.textAlign = 'center';

    this.numberOfSamples += frequencyBinCount;

    this.timeOffset = (this.numberOfSamples * (1 / this.sampleRate)) * (innerWidth / this.duration);

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

    const frequencyBinCount = data.length;
    const fftSize           = 2 * frequencyBinCount;

    // Frequency resolution (Sampling rate / FFT size)
    const frequencyResolution = this.sampleRate / fftSize;

    const samples = this.duration * this.sampleRate;

    if (this.numberOfSamples >= samples) {
      svg.innerHTML = '';

      this.timeOffset      = 1;
      this.numberOfSamples = 0;
    }

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

      // X axis (time)
      const g = document.createElementNS(Spectrogram.XMLNS, 'g');

      const textInterval = samples / this.timeTextInterval;

      for (let k = 0; k < samples; k++) {
        if ((k % textInterval) !== 0) {
          continue;
        }

        const x = k * (innerWidth / samples) + left;
        const y = top + innerHeight + fontSize;

        const text = document.createElementNS(Spectrogram.XMLNS, 'text');

        const time = (k / samples) * this.duration;

        if ((time !== 0) && (time < 0.0001)) {
          text.textContent = `${(time * 1000).toFixed(1)} msec`;
        } else {
          text.textContent = `${time.toFixed(2)} sec`;
        }

        text.setAttribute('x', x.toString(10));
        text.setAttribute('y', y.toString(10));
        text.setAttribute('text-anchor', 'start');
        text.setAttribute('stroke', 'none');
        text.setAttribute('fill', textColor);
        text.setAttribute('font-size', fontSize.toString(10));

        g.appendChild(text);
      }

      svg.appendChild(g);

      // Y axis (frequency)
      switch (this.scale) {
        case 'linear': {
          const length = Math.min(frequencyBinCount, this.renderSize);

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

          Spectrogram.LOGARITHMIC_FREQUENCIES.forEach((f: 32 | 62.5 | 125 | 250 | 500 | 1000 | 2000 | 4000 | 8000 | 16000, index: number) => {
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
        const length = Math.min(frequencyBinCount, this.renderSize);

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

          if (this.colorFromNumber === null) {
            const color = Spectrogram.numberToJetColor(data[k]);

            rect.setAttribute('fill', color);
          } else {
            const color = this.colorFromNumber(data[k]);

            rect.setAttribute('fill', color);
          }

          rect.setAttribute('x', x.toString(10));
          rect.setAttribute('y', (y - h).toString(10));
          rect.setAttribute('width', (this.styles.width ? this.styles.width.toString(10) : '1'));
          rect.setAttribute('height', h.toString(10));
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

        for (let k = 0; k < frequencyBinCount; k++) {
          if (k === 0) {
            continue;
          }

          if ((k % this.plotInterval) !== 0) {
            continue;
          }

          const x = left + this.timeOffset;
          const y = (top + innerHeight) - ((Math.log10((k * frequencyResolution) / Spectrogram.MIN_FREQUENCY) / ratio) * innerHeight);

          if (((y - h) < top) || (y > (top + innerHeight))) {
            continue;
          }

          const rect = document.createElementNS(Spectrogram.XMLNS, 'rect');

          if (this.colorFromNumber === null) {
            const color = Spectrogram.numberToJetColor(data[k]);

            rect.setAttribute('fill', color);
          } else {
            const color = this.colorFromNumber(data[k]);

            rect.setAttribute('fill', color);
          }

          rect.setAttribute('x', x.toString(10));
          rect.setAttribute('y', ((y - h) - 0).toString(10));
          rect.setAttribute('width', (this.styles.width ? this.styles.width.toString(10) : '1'));
          rect.setAttribute('height', h.toString(10));
          rect.setAttribute('stroke', 'none');

          g.appendChild(rect);
        }

        svg.appendChild(g);

        break;
      }
    }


    this.numberOfSamples += frequencyBinCount;

    this.timeOffset = (this.numberOfSamples * (1 / this.sampleRate)) * (innerWidth / this.duration);
  }
}
