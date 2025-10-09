import type { Connectable } from '../../interfaces';
import type { ChannelNumber } from '../../types';
import type { Visualizer, VisualizerParams, Color, GraphicsApi, Gradient, Gradients, Shape, Font, GraphicsStyles, SpectrumScale } from './Visualizer';
import type { TimeOverviewParams, CurrentTimeStyles, MouseEventTypes, DragMode, DragCallbackFunction } from './TimeOverview';
import type { TimeParams } from './Time';
import type { FFTParams } from './FFT';
import type { SpectrogramParams } from './Spectrogram';

import { TimeOverview } from './TimeOverview';
import { Time } from './Time';
import { FFT } from './FFT';
import { Spectrogram } from './Spectrogram';

export type Domain   = 'timeoverview' | 'time' | 'fft' | 'spectrogram';
export type DataType = 'uint' | 'float';  // unsigned int 8 bit (`Uint8Array`) or float 32 bit (`Float32Array`)
export type FFTSize  = 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096 | 8192 | 16384 | 32768;

export type {
  Visualizer,
  VisualizerParams,
  Color,
  GraphicsApi,
  Gradient,
  Gradients,
  Shape,
  Font,
  GraphicsStyles,
  SpectrumScale,
  TimeOverview,
  TimeOverviewParams,
  CurrentTimeStyles,
  MouseEventTypes,
  DragMode,
  DragCallbackFunction,
  Time,
  TimeParams,
  FFT,
  FFTParams,
  Spectrogram,
  SpectrogramParams
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
 */
export class Analyser implements Connectable {
  private analysers: [AnalyserNode, AnalyserNode];
  private splitter: ChannelSplitterNode;
  private input: GainNode;

  private timeOverviews: [TimeOverview, TimeOverview];
  private times: [Time, Time];
  private ffts: [FFT, FFT];
  private spectrograms: [Spectrogram, Spectrogram];

  private timeDomainAnimationIds: [ReturnType<typeof window.requestAnimationFrame> | null, ReturnType<typeof window.requestAnimationFrame> | null] = [null, null];
  private timeDomainTimerIds: [number | null, number | null] = [null, null];
  private frequencyDomainAnimationIds: [ReturnType<typeof window.requestAnimationFrame> | null, ReturnType<typeof window.requestAnimationFrame> | null] = [null, null];
  private frequencyDomainTimerIds: [number | null, number | null] = [null, null];
  private spectrogramAnimationIds: [ReturnType<typeof window.requestAnimationFrame> | null, ReturnType<typeof window.requestAnimationFrame> | null] = [null, null];
  private spectrogramTimerIds: [number | null, number | null] = [null, null];

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   */
  constructor(context: AudioContext) {
    this.analysers = [context.createAnalyser(), context.createAnalyser()];
    this.splitter  = context.createChannelSplitter(2);
    this.input     = context.createGain();

    // GainNode (Input) -> ChannelSplitterNode (L / R) -> AnalyserNode
    this.input.connect(this.splitter);
    this.splitter.connect(this.analysers[0], 0, 0);
    this.splitter.connect(this.analysers[1], 1, 0);

    this.timeOverviews = [new TimeOverview(context.sampleRate, 0), new TimeOverview(context.sampleRate, 1)];
    this.times         = [new Time(context.sampleRate, 0), new Time(context.sampleRate, 1)];
    this.ffts          = [new FFT(context.sampleRate, 0), new FFT(context.sampleRate, 1)];
    this.spectrograms  = [new Spectrogram(context.sampleRate, 0), new Spectrogram(context.sampleRate, 1)];

    // Set default value
    this.analysers.forEach((analyser: AnalyserNode) => {
      analyser.fftSize               = 2048;
      analyser.minDecibels           = -100;
      analyser.maxDecibels           = -30;
      analyser.smoothingTimeConstant = 0.8;
    });
  }

  /**
   * This method visualizes sound wave.
   * @param {Domain} domain This argument is one of 'timeoverview', 'time', 'fft', 'spectrogram'.
   * @param {ChannelNumber} channelNumber This argument is channel number (Left: 0, Right: 1 ...).
   * @param {AudioBuffer} buffer This argument is instance of `AudioBuffer` (If domain is 'timeoverview', this argument is required).
   * @return {Analyser} Return value is for method chain.
   */
  public start(domain: Domain, channelNumber?: ChannelNumber, buffer?: AudioBuffer): Analyser {
    let channel = channelNumber;

    if ((channel === undefined) || (channel === -1)) {
      this.input.disconnect(this.splitter);
      this.splitter.disconnect(0);
      this.splitter.disconnect(1);

      // GainNode (Input) -> AnalyserNode
      this.input.connect(this.analysers[0]);

      channel = 0;
    }

    switch (domain) {
      case 'timeoverview': {
        if (buffer && (buffer.numberOfChannels > channel)) {
          const data = new Float32Array(buffer.length);

          data.set(buffer.getChannelData(channel));

          this.timeOverviews[channel].start(data);
        }

        break;
      }

      case 'time': {
        const interval = this.times[channel].param('interval');

        switch (this.times[channel].param('type')) {
          case 'uint': {
            const data = new Uint8Array(this.analysers[channel].fftSize);

            this.analysers[channel].getByteTimeDomainData(data);
            this.times[channel].start(data);

            break;
          }

          case 'float': {
            const data = new Float32Array(this.analysers[channel].fftSize);

            this.analysers[channel].getFloatTimeDomainData(data);
            this.times[channel].start(data);

            break;
          }
        }

        if (typeof interval === 'number') {
          this.stop(domain, channelNumber);

          if (interval < 0) {
            this.timeDomainAnimationIds[channel] = window.requestAnimationFrame(() => {
              this.start(domain, channelNumber);
            });
          } else {
            this.timeDomainTimerIds[channel] = window.setTimeout(() => {
              this.start(domain, channelNumber);
            }, interval);
          }
        }

        break;
      }

      case 'fft': {
        const interval = this.ffts[channel].param('interval');

        switch (this.ffts[channel].param('type')) {
          case 'uint': {
            const data = new Uint8Array(this.analysers[channel].frequencyBinCount);

            this.analysers[channel].getByteFrequencyData(data);
            this.ffts[channel].start(data);

            break;
          }

          case 'float': {
            const data = new Float32Array(this.analysers[channel].frequencyBinCount);

            this.analysers[channel].getFloatFrequencyData(data);
            this.ffts[channel].start(data, this.analysers[channel].minDecibels, this.analysers[channel].maxDecibels);

            break;
          }
        }

        if (typeof interval === 'number') {
          this.stop(domain, channelNumber);

          if (interval < 0) {
            this.frequencyDomainAnimationIds[channel] = window.requestAnimationFrame(() => {
              this.start(domain, channelNumber);
            });
          } else {
            this.frequencyDomainTimerIds[channel] = window.setTimeout(() => {
              this.start(domain, channelNumber);
            }, interval);
          }
        }

        break;
      }

      case 'spectrogram': {
        const interval = this.spectrograms[channel].param('interval');

        const data = new Uint8Array(this.analysers[channel].frequencyBinCount);

        this.analysers[channel].getByteFrequencyData(data);
        this.spectrograms[channel].start(data);

        if (typeof interval === 'number') {
          this.stop(domain, channelNumber);

          if (interval < 0) {
            this.spectrogramAnimationIds[channel] = window.requestAnimationFrame(() => {
              this.start(domain, channelNumber);
            });
          } else {
            this.spectrogramTimerIds[channel] = window.setTimeout(() => {
              this.start(domain, channelNumber);
            }, interval);
          }
        }

        break;
      }
    }

    return this;
  }

  /**
   * This method stops visualizer.
   * @param {Domain} domain This argument is one of 'timeoverview', 'time', 'fft', 'spectrogram'.
   * @param {ChannelNumber} channelNumber This argument is channel number (Left: 0, Right: 1 ...).
   * @return {Analyser} Return value is for method chain.
   */
  public stop(domain: Domain, channelNumber?: ChannelNumber): Analyser {
    let channel = channelNumber;

    if ((channel === undefined) || (channel === -1)) {
      channel = 0;
    }

    switch (domain) {
      case 'time': {
        const interval = this.times[channel].param('interval');

        if (typeof interval === 'number') {
          const animationId = this.timeDomainAnimationIds[channel];
          const timerId     = this.timeDomainTimerIds[channel];

          if ((interval < 0) && animationId) {
            window.cancelAnimationFrame(animationId);

            this.timeDomainAnimationIds[channel]= null;
          } else if (timerId) {
            window.clearTimeout(timerId);

            this.timeDomainTimerIds[channel]= null;
          }
        }

        break;
      }

      case 'fft': {
        const interval = this.ffts[channel].param('interval');

        if (typeof interval === 'number') {
          const animationId = this.frequencyDomainAnimationIds[channel];
          const timerId     = this.frequencyDomainTimerIds[channel];

          if ((interval < 0) && animationId) {
            window.cancelAnimationFrame(animationId);

            this.frequencyDomainAnimationIds[channel] = null;
          } else if (timerId) {
            window.clearTimeout(timerId);

            this.frequencyDomainTimerIds[channel] = null;
          }
        }

        break;
      }

      case 'spectrogram': {
        const interval = this.spectrograms[channel].param('interval');

        if (typeof interval === 'number') {
          const animationId = this.spectrogramAnimationIds[channel];
          const timerId     = this.spectrogramTimerIds[channel];

          if ((interval < 0) && animationId) {
            window.cancelAnimationFrame(animationId);

            this.spectrogramAnimationIds[channel] = null;
          } else if (timerId) {
            window.clearTimeout(timerId);

            this.spectrogramTimerIds[channel] = null;
          }
        }

        break;
      }
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
        case 'fftSize': {
          return this.analysers[0].fftSize;
        }

        case 'frequencyBinCount': {
          return this.analysers[0].frequencyBinCount;
        }

        case 'minDecibels': {
          return this.analysers[0].minDecibels;
        }

        case 'maxDecibels': {
          return this.analysers[0].maxDecibels;
        }

        case 'smoothingTimeConstant': {
          return this.analysers[0].smoothingTimeConstant;
        }
      }
    }

    for (const [key, value] of Object.entries(params)) {
      switch (key) {
        case 'fftSize': {
          this.analysers[0].fftSize = value;
          this.analysers[1].fftSize = value;
          break;
        }

        case 'minDecibels': {
          this.analysers[0].minDecibels = value;
          this.analysers[1].minDecibels = value;
          break;
        }

        case 'maxDecibels': {
          this.analysers[0].maxDecibels = value;
          this.analysers[1].maxDecibels = value;
          break;
        }

        case 'smoothingTimeConstant': {
          this.analysers[0].smoothingTimeConstant = value;
          this.analysers[1].smoothingTimeConstant = value;
          break;
        }
      }
    }

    return this;
  }

  /**
   * This method selects domain for visualization.
   * This method is overloaded for type interface and type check.
   * @param {Domain} domain This argument is one of 'timeoverview', 'time', 'fft', `spectrogram`.
   * @param {ChannelNumber} channelNumber This argument is channel number (Left: 0, Right: 1 ...).
   * @return {TimeOverview|Time|FFT|Analyser} Return value is instance of selected `Visualizer` class.
   */
  public domain(domain: 'timeoverview', channelNumber: ChannelNumber): TimeOverview;
  public domain(domain: 'time', channelNumber?: ChannelNumber): Time;
  public domain(domain: 'fft', channelNumber?: ChannelNumber): FFT;
  public domain(domain: 'spectrogram', channelNumber?: ChannelNumber): Spectrogram;
  public domain(domain: Domain, channelNumber?: ChannelNumber): TimeOverview | Time | FFT | Spectrogram | Analyser {
    let channel = channelNumber;

    if ((channel === undefined) || (channel === -1)) {
      channel = 0;
    }

    switch (domain) {
      case 'timeoverview': {
        return this.timeOverviews[channel];
      }

      case 'time': {
        return this.times[channel];
      }

      case 'fft': {
        return this.ffts[channel];
      }

      case 'spectrogram': {
        return this.spectrograms[channel];
      }
    }

    return this;
  }

  /**
   * This method gets instance of `AnalyserNode`.
   * @param {ChannelNumber} channelNumber This argument is channel number (Left: 0, Right: 1 ...).
   * @return {AnalyserNode}
   */
  public get(channelNumber?: ChannelNumber): AnalyserNode | null {
    let channel = channelNumber;

    if ((channel === undefined) || (channel === -1)) {
      channel = 0;
    }

    return this.analysers[channel];
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
