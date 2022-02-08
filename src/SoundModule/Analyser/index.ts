import { Connectable } from '../../interfaces';
import { Color, GraphicsApi, Gradient, Gradients, Shape, Font, GraphicsStyles } from './Visualizer';
import { TimeOverview, TimeOverviewParams, CurrentTimeStyles, DragMode, DragCallbackFunction } from './TimeOverview';
import { Time, TimeParams } from './Time';
import { FFT, FFTParams } from './FFT';

export type Domain   = 'timeoverview' | 'time' | 'fft';
export type Channel  = 0 | 1;
export type DataType = 'uint' | 'float';  // unsigned int 8 bit (`Uint8Array`) or float 32 bit (`Float32Array`)
export type FFTSize  = 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096 | 8192 | 16384 | 32768;

export type {
  Color,
  GraphicsApi,
  Gradient,
  Gradients,
  Shape,
  Font,
  GraphicsStyles,
  TimeOverview,
  TimeOverviewParams,
  CurrentTimeStyles,
  DragMode,
  DragCallbackFunction,
  TimeParams,
  FFTParams
};

export type AnalyserParams = {
  fftSize?: FFTSize,
  readonly frequencyBinCount?: number,
  minDecibels?: number,
  maxDecibels?: number,
  smoothingTimeConstant?: number
};

/**
 * This private class manages 3 private classes (`TimeOverview`, `Time`, `FFT`) for visualizing sound wave.
 * @constructor
 * @implements {Connectable}
 */
export class Analyser implements Connectable {
  private analyser: AnalyserNode;
  private input: GainNode;

  private timeOverviewL: TimeOverview;
  private timeOverviewR: TimeOverview;
  private time: Time;
  private fft: FFT;

  private timeDomainAnimationId: ReturnType<typeof window.requestAnimationFrame> | null = null;
  private timeDomainTimerId: number | null = null;
  private frequencyDomainAnimationId: ReturnType<typeof window.requestAnimationFrame> | null = null;
  private frequencyDomainTimerId: number | null = null;

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   */
  constructor(context: AudioContext) {
    this.analyser = context.createAnalyser();
    this.input    = context.createGain();

    // GainNode (Input) -> AnalyserNode
    this.input.connect(this.analyser);

    this.timeOverviewL = new TimeOverview(context.sampleRate, 0);
    this.timeOverviewR = new TimeOverview(context.sampleRate, 1);
    this.time          = new Time(context.sampleRate, 0);
    this.fft           = new FFT(context.sampleRate, 0);

    // Set default value
    this.analyser.fftSize               = 2048;
    this.analyser.minDecibels           = -100;
    this.analyser.maxDecibels           = -30;
    this.analyser.smoothingTimeConstant = 0.8;
  }

  /**
   * This method visualizes sound wave.
   * @param {Domain} domain This argument is one of 'timeoverview', 'time', 'fft'.
   * @param {Channel} channel This argument is channel number (Left: 0, Right: 1 ...).
   * @param {AudioBuffer} buffer This argument is instance of `AudioBuffer` (If domain is 'timeoverview', this argument is required).
   * @return {Analyser} Return value is for method chain.
   */
  public start(domain: Domain, channel?: Channel, buffer?: AudioBuffer): Analyser {
    switch (domain) {
      case 'timeoverview':
        if (((channel === 0) || (channel === 1)) && buffer) {
          switch (channel) {
            case 0:
              if (buffer.numberOfChannels > channel) {
                const data = new Float32Array(buffer.length);
                data.set(buffer.getChannelData(channel));
                this.timeOverviewL.start(data);
              }

              break;
            case 1:
              if (buffer.numberOfChannels > channel) {
                const data = new Float32Array(buffer.length);
                data.set(buffer.getChannelData(channel));
                this.timeOverviewR.start(data);
              }

              break;
            default:
              break;
          }
        }

        break;
      case 'time': {
        const interval = this.time.param('interval');

        if (this.time.param('type') === 'uint') {
          const data = new Uint8Array(this.analyser.fftSize);
          this.analyser.getByteTimeDomainData(data);
          this.time.start(data);
        } else {
          const data = new Float32Array(this.analyser.fftSize);
          this.analyser.getFloatTimeDomainData(data);
          this.time.start(data);
        }

        if (typeof interval === 'number') {
          this.stop(domain);

          if (interval < 0) {
            this.timeDomainAnimationId = window.requestAnimationFrame(() => {
              this.start(domain);
            });
          } else {
            this.timeDomainTimerId = window.setTimeout(() => {
              this.start(domain);
            }, interval);
          }
        }

        break;
      }

      case 'fft': {
        const interval = this.fft.param('interval');

        if (this.fft.param('type') === 'uint') {
          const data = new Uint8Array(this.analyser.frequencyBinCount);
          this.analyser.getByteFrequencyData(data);
          this.fft.start(data);
        } else {
          const data = new Float32Array(this.analyser.frequencyBinCount);
          this.analyser.getFloatFrequencyData(data);
          this.fft.start(data, this.analyser.minDecibels, this.analyser.maxDecibels);
        }

        if (typeof interval === 'number') {
          this.stop(domain);

          if (interval < 0) {
            this.frequencyDomainAnimationId = window.requestAnimationFrame(() => {
              this.start(domain);
            });
          } else {
            this.frequencyDomainTimerId = window.setTimeout(() => {
              this.start(domain);
            }, interval);
          }
        }

        break;
      }

      default:
        break;
    }

    return this;
  }

  /**
   * This method stops visualizer.
   * @param {Domain} domain This argument is one of 'timeoverview', 'time', 'fft'.
   * @return {Analyser} Return value is for method chain.
   */
  public stop(domain: Domain): Analyser {
    switch (domain) {
      case 'time': {
        const interval = this.time.param('interval');

        if (typeof interval === 'number') {
          if ((interval < 0) && this.timeDomainAnimationId) {
            window.cancelAnimationFrame(this.timeDomainAnimationId);

            this.timeDomainAnimationId = null;
          } else if (this.timeDomainTimerId) {
            window.clearTimeout(this.timeDomainTimerId);

            this.timeDomainTimerId = null;
          }
        }

        break;
      }

      case 'fft': {
        const interval = this.fft.param('interval');

        if (typeof interval === 'number') {
          if ((interval < 0) && this.frequencyDomainAnimationId) {
            window.cancelAnimationFrame(this.frequencyDomainAnimationId);

            this.frequencyDomainAnimationId = null;
          } else if (this.frequencyDomainTimerId) {
            window.clearTimeout(this.frequencyDomainTimerId);

            this.frequencyDomainTimerId = null;
          }
        }

        break;
      }

      default:
        break;
    }

    return this;
  }

  /**
   * This method gets or sets parameters for analyser.
   * This method is overloaded for type interface and type check.
   * @param {keyof AnalyserParams|AnalyserParams} params This argument is string if getter. Otherwise, setter.
   * @return {AnalyserParams[keyof AnalyserParams]|Analyser} Return value is parameter for analyser if getter.
   *     Otherwise, return value is for method chain.
   */
  public param(params: 'fftSize'): number;
  public param(params: 'frequencyBinCount'): number;
  public param(params: 'minDecibels'): number;
  public param(params: 'maxDecibels'): number;
  public param(params: 'smoothingTimeConstant'): number;
  public param(params: AnalyserParams): Analyser;
  public param(params: keyof AnalyserParams | AnalyserParams): AnalyserParams[keyof AnalyserParams] | Analyser {
    if (typeof params === 'string') {
      switch (params) {
        case 'fftSize':
          return this.analyser.fftSize;
        case 'frequencyBinCount':
          return this.analyser.frequencyBinCount;
        case 'minDecibels':
          return this.analyser.minDecibels;
        case 'maxDecibels':
          return this.analyser.maxDecibels;
        case 'smoothingTimeConstant':
          return this.analyser.smoothingTimeConstant;
        default:
          return this;
      }
    }

    for (const [key, value] of Object.entries(params)) {
      switch (key) {
        case 'fftSize':
          this.analyser.fftSize = value;
          break;
        case 'minDecibels':
          this.analyser.minDecibels = value;
          break;
        case 'maxDecibels':
          this.analyser.maxDecibels = value;
          break;
        case 'smoothingTimeConstant':
          this.analyser.smoothingTimeConstant = value;
          break;
        default:
          break;
      }
    }

    return this;
  }

  /**
   * This method selects domain for visualization.
   * This method is overloaded for type interface and type check.
   * @param {Domain} domain This argument is one of 'timeoverview', 'time', 'fft'.
   * @param {Channel} channel This argument is channel number (Left: 0, Right: 1 ...).
   * @return {TimeOverview|Time|FFT|Analyser} Return value is instance of selected `Visualizer` class.
   */
  public domain(domain: 'timeoverview', channel?: Channel): TimeOverview;
  public domain(domain: 'time', channel?: Channel): Time;
  public domain(domain: 'fft', channel?: Channel): FFT;
  public domain(domain: Domain, channel?: Channel): TimeOverview | Time | FFT | Analyser {
    switch (domain) {
      case 'timeoverview':
        switch (channel) {
          case 0:
            return this.timeOverviewL;
          case 1:
            return this.timeOverviewR;
          default:
            return this.timeOverviewL;
        }
      case 'time':
        return this.time;
      case 'fft' :
        return this.fft;
      default:
        return this;
    }

    return this;
  }

  /**
   * This method gets instance of `AnalyserNode`.
   * @return {AnalyserNode}
   */
  public get(): AnalyserNode {
    return this.analyser;
  }

  /** @override */
  public get INPUT(): GainNode {
    return this.input;
  }

  /** @override */
  public get OUTPUT(): GainNode {
    return this.input;
  }
}
