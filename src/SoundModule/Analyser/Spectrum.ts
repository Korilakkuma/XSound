import type { ChannelNumber } from '../../types';
import type { VisualizerParams, GraphicsStyles, SpectrumScale } from './Visualizer';

import { Visualizer } from './Visualizer';

export type SpectrumParams = VisualizerParams & {
  scale?: SpectrumScale,
  logarithmicFrequencies?: number[],
  textInterval?: number,
  readonly minFrequency?: number,
  readonly maxFrequency?: number
};

/**
 * This private class visualizes spectrum.
 */
export abstract class Spectrum extends Visualizer {
  protected scale: SpectrumScale = 'linear';

  // for logarithmic
  protected logarithmicFrequencies: number[] = [32, 62.5, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
  protected minFrequency = this.logarithmicFrequencies[0];
  protected maxFrequency = this.logarithmicFrequencies[this.logarithmicFrequencies.length - 1];
  protected ratio = this.maxFrequency / this.minFrequency;
  protected log10Ratio = Math.log10(this.ratio);

  // Visualize text at intervals of this value [Hz]
  protected textInterval = 1000;

  /**
   * @param {number} sampleRate This argument is sample rate.
   * @param {ChannelNumber} channel This argument is channel number (Left: 0, Right: 1 ...).
   */
  // eslint-disable-next-line no-useless-constructor
  constructor(sampleRate: number, channel: ChannelNumber) {
    super(sampleRate, channel);
  }

  /**
   * This method gets or sets parameters for visualizing spectrum.
   * This method is overloaded for type interface and type check.
   * @param {keyof SpectrumParams|SpectrumParams} params This argument is string if getter. Otherwise, setter.
   * @return {SpectrumParams[keyof SpectrumParams]|Spectrum} Return value is parameter for visualizing spectrum if getter.
   *     Otherwise, return value is for method chain.
   * @override
   */
  public override param(params: 'interval'): number;  // HACK: Not used
  public override param(params: 'styles'): GraphicsStyles;
  public override param(params: 'scale'): SpectrumScale;
  public override param(params: 'logarithmicFrequencies'): number[];
  public override param(params: 'minFrequency'): number;
  public override param(params: 'maxFrequency'): number;
  public override param(params: 'textInterval'): number;
  public override param(params: SpectrumParams): Spectrum;
  public override param(params: keyof SpectrumParams | SpectrumParams): SpectrumParams[keyof SpectrumParams] | Spectrum {
    if (typeof params === 'string') {
      switch (params) {
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
}
