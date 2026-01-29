import type { ChannelNumber } from '../../types';
import type { GraphicsStyles, SpectrumScale } from './Visualizer';
import type { SpectrumParams } from './Spectrum';

import { Spectrum } from './Spectrum';

export type PhaseSpectrumUnit = 'radian' | 'degree';

export type PhaseSpectrumParams = SpectrumParams & {
  unit?: PhaseSpectrumUnit
};

/**
 * This private class visualizes phase spectrum.
 */
export class PhaseSpectrum extends Spectrum {
  private unit: PhaseSpectrumUnit = 'radian';
  private renderPhaseTexts: ((data: Float32Array) => void) | null = null;

  /**
   * @param {number} sampleRate This argument is sample rate.
   * @param {ChannelNumber} channel This argument is channel number (Left: 0, Right: 1 ...).
   */
  // eslint-disable-next-line no-useless-constructor
  constructor(sampleRate: number, channel: ChannelNumber) {
    super(sampleRate, channel);
  }

  /**
   * This method gets or sets parameters for visualizing phase spectrum.
   * This method is overloaded for type interface and type check.
   * @param {keyof PhaseSpectrumParams|PhaseSpectrumParams} params This argument is string if getter. Otherwise, setter.
   * @return {PhaseSpectrumParams[keyof PhaseSpectrumParams]|PhaseSpectrum} Return value is parameter for visualizing phase spectrum if getter.
   *     Otherwise, return value is for method chain.
   * @override
   */
  public override param(params: 'interval'): number;
  public override param(params: 'styles'): GraphicsStyles;
  public override param(params: 'scale'): SpectrumScale;
  public override param(params: 'logarithmicFrequencies'): number[];
  public override param(params: 'minFrequency'): number;
  public override param(params: 'maxFrequency'): number;
  public override param(params: 'textInterval'): number;
  public override param(params: 'unit'): PhaseSpectrumUnit;
  public override param(params: PhaseSpectrumParams): PhaseSpectrum;
  public override param(params: keyof PhaseSpectrumParams | PhaseSpectrumParams): PhaseSpectrumParams[keyof PhaseSpectrumParams] | PhaseSpectrum {
    if (typeof params === 'string') {
      switch (params) {
        case 'unit': {
          return this.unit;
        }

        case 'scale': {
          return this.scale;
        }

        case 'logarithmicFrequencies': {
          return super.param(params);
        }

        case 'minFrequency': {
          return super.param(params);
        }

        case 'maxFrequency': {
          return super.param(params);
        }

        case 'textInterval': {
          return super.param(params);
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
        case 'unit': {
          if (typeof value === 'string') {
            if ((value === 'radian') || (value === 'degree')) {
              this.unit = value;
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
   * This method sets function that render phase texts on y coordinate.
   * @param {function|null} renderer This argument is function that render phase texts on y coordinate.
   * @return {PhaseSpectrum} Return value is for method chain.
   */
  public setRenderPhaseTextsFunction(renderer: ((data: Float32Array) => void) | null): PhaseSpectrum {
    this.renderPhaseTexts = renderer;

    return this;
  }

  /**
   * This method visualizes phase spectrum to Canvas.
   * @param {Float32Array} data This argument is frequency domain data phase for spectrum.
   * @override
   */
  protected override renderCanvas(data: Float32Array): void {
    if ((this.canvas === null) || (this.context === null)) {
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

    const lineWidth = this.styles.width ?? 1.5;
    const lineCap   = this.styles.cap ?? 'round';
    const lineJoin  = this.styles.join ?? 'miter';

    const waveColor = this.styles.wave ?? 'rgba(0, 0, 255, 1.0)';  // line only
    const gridColor = this.styles.grid ?? 'none';
    const textColor = this.styles.text ?? 'none';
    const fontSize  = Number.parseInt((this.styles.font?.size ?? '13px'), 10);

    const renderSize = data.length;

    // Frequency resolution (Sampling rate / FFT size)
    const frequencyResolution = this.sampleRate / (2 * data.length);

    // Visualize text at intervals of `this.textInterval`
    const numberOfTexts = Math.trunc(this.textInterval / frequencyResolution);

    // Erase previous wave
    context.clearRect(0, 0, width, height);

    // Begin visualization

    // Set style
    context.strokeStyle = waveColor;
    context.lineWidth   = lineWidth;
    context.lineCap     = lineCap;
    context.lineJoin    = lineJoin;

    // Visualize wave
    context.beginPath();

    switch (this.scale) {
      case 'linear': {
        for (let k = 0; k < renderSize; k++) {
          const x = ((k / renderSize) * innerWidth) + left;
          const y = ((1 - (data[k] / Math.PI)) * (innerHeight / 2)) + top;

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
          const y = ((1 - (data[k] / Math.PI)) * (innerHeight / 2)) + top;

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

    if ((gridColor !== 'none') || (textColor !== 'none')) {
      // Visualize grid and text (X axis)
      switch (this.scale) {
        case 'linear': {
          for (let k = 0; k < renderSize; k++) {
            if ((k % numberOfTexts) === 0) {
              const x = ((k / renderSize) * innerWidth) + left;

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

          break;
        }

        case 'logarithmic': {
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
      }

      if (typeof this.renderPhaseTexts === 'function') {
        this.renderPhaseTexts(data);
      } else {
        switch (this.unit) {
          case 'radian': {
            const phases          = ['π', '0', '-π'];
            const numberOfDivides = phases.length - 1;

            phases.forEach((phase, index) => {
              const phaseText = `${phase} rad`;

              const x = (left - context.measureText(phaseText).width);
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
                context.fillText(phaseText, x, y);
              }
            });

            break;
          }

          case 'degree': {
            const phases          = ['180', '0', '-180'];
            const numberOfDivides = phases.length - 1;

            phases.forEach((phase, index) => {
              const phaseText = `${phase}°`;

              const x = (left - context.measureText(phaseText).width);
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
                context.fillText(phaseText, x, y);
              }
            });

            break;
          }
        }
      }
    }
  }

  /**
   * This method visualizes phase spectrum to SVG.
   * @param {Float32Array} data This argument is frequency domain data for phase spectrum.
   * @override
   */
  protected override renderSVG(data: Float32Array): void {
    if (this.svg === null) {
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

    const lineWidth = this.styles.width ?? 1.5;
    const lineCap   = this.styles.cap ?? 'round';
    const lineJoin  = this.styles.join ?? 'miter';

    const waveColor = this.styles.wave ?? 'rgba(0, 0, 255, 1.0)';  // line only
    const gridColor = this.styles.grid ?? 'none';
    const textColor = this.styles.text ?? 'none';
    const fontSize  = Number.parseInt((this.styles.font?.size ?? '13px'), 10);

    const renderSize = data.length;

    // Frequency resolution (Sampling rate / FFT size)
    const frequencyResolution = this.sampleRate / (2 * data.length);

    // Visualize text at intervals of `this.textInterval`
    const numberOfTexts = Math.trunc(this.textInterval / frequencyResolution);

    // Erase previous wave
    svg.innerHTML = '';

    // Begin visualization
    const path = document.createElementNS(Spectrum.XMLNS, 'path');

    let d = '';

    switch (this.scale) {
      case 'linear': {
        for (let k = 0; k < renderSize; k++) {
          const x = ((k / renderSize) * innerWidth) + left;
          const y = ((1 - (data[k] / Math.PI)) * (innerHeight / 2)) + top;

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
          const y = ((1 - (data[k] / Math.PI)) * (innerHeight / 2)) + top;

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

    if ((gridColor !== 'none') || (textColor !== 'none')) {
      // Visualize grid and text (X axis)
      switch (this.scale) {
        case 'linear': {
          for (let k = 0; k < renderSize; k++) {
            if ((k % numberOfTexts) === 0) {
              const x = ((k / renderSize) * innerWidth) + left;

              const frequency     = k * frequencyResolution;
              const frequencyText = (frequency < 1000) ? `${frequency} Hz` : `${(frequency / 1000).toString(10).slice(0, 3)} kHz`;

              // Visualize grid
              if (gridColor !== 'none') {
                const rect = document.createElementNS(Spectrum.XMLNS, 'rect');

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
                const text = document.createElementNS(Spectrum.XMLNS, 'text');

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

          break;
        }

        case 'logarithmic': {
          this.logarithmicFrequencies.forEach((frequency: number) => {
            const frequencyRatio      = frequency / this.minFrequency;
            const log10FrequencyRatio = Math.log10(frequencyRatio);

            const x = ((log10FrequencyRatio / this.log10Ratio) * innerWidth) + left;

            const frequencyText = (frequency < 1000) ? `${frequency} Hz` : `${(frequency / 1000).toString(10).slice(0, 3)} kHz`;

            // Visualize grid
            if (gridColor !== 'none') {
              const rect = document.createElementNS(Spectrum.XMLNS, 'rect');

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
              const text = document.createElementNS(Spectrum.XMLNS, 'text');

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

          break;
        }
      }

      if (typeof this.renderPhaseTexts === 'function') {
        this.renderPhaseTexts(data);
      } else {
        switch (this.unit) {
          case 'radian': {
            const phases          = ['π', '0', '-π'];
            const numberOfDivides = phases.length - 1;

            phases.forEach((phase, index) => {
              const phaseText = `${phase} rad`;

              const x = left;
              const y = ((innerHeight / numberOfDivides) * index) + top;

              if (gridColor !== 'none') {
                const rect = document.createElementNS(Spectrum.XMLNS, 'rect');

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
                const text = document.createElementNS(Spectrum.XMLNS, 'text');

                text.textContent = phaseText;

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

          case 'degree': {
            const phases          = ['180', '0', '-180'];
            const numberOfDivides = phases.length - 1;

            phases.forEach((phase, index) => {
              const phaseText = `${phase}°`;

              const x = left;
              const y = ((innerHeight / numberOfDivides) * index) + top;

              if (gridColor !== 'none') {
                const rect = document.createElementNS(Spectrum.XMLNS, 'rect');

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
                const text = document.createElementNS(Spectrum.XMLNS, 'text');

                text.textContent = phaseText;

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
}
