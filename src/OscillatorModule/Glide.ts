export type GlideType = 'linear' | 'exponential';

export type GlideParams = {
  type?: GlideType,
  time?: number
};

/**
 * This private class is for oscillator glide.
 * @constructor
 */
export class Glide {
  private context: AudioContext;

  private type: GlideType = 'linear';

  private time = 0;  // Glide time

  private prevFrequency = -1;  // Abnormal value (for the 1st sound)
  private nextFrequency = 0;

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   */
  constructor(context: AudioContext) {
    this.context = context;
  }

  /**
   * This method sets frequencies for glide.
   * @param {number} frequency This argument is next frequency for glide.
   */
  public ready(frequency: number): void {
    this.nextFrequency = frequency;

    const diff = (this.prevFrequency === -1) ? 0 : (this.nextFrequency - this.prevFrequency);

    if ((this.time === 0) || (diff === 0)) {
      // The 1st sound or Glide OFF or The same sound
      this.prevFrequency = this.nextFrequency;
    }
  }

  /**
   * This method starts glide.
   * @param {OscillatorNode} oscillator This argument is instance of `OscillatorNode`.
   * @param {number} startTime This argument is start time for glide.
   */
  public start(oscillator: OscillatorNode, startTime?: number): void {
    const t0 = startTime ?? this.context.currentTime;
    const t1 = t0 + this.time;

    // Start glide
    oscillator.frequency.cancelScheduledValues(t0);
    oscillator.frequency.setValueAtTime(this.prevFrequency, t0);

    if (this.type === 'exponential') {
      oscillator.frequency.exponentialRampToValueAtTime(this.nextFrequency, t1);
    } else {
      oscillator.frequency.linearRampToValueAtTime(this.nextFrequency, t1);
    }
  }

  /**
   * This method stops glide. Moreover, This method prepares for next glide.
   */
  public stop(): void {
    // Stop glide or on the way of glide
    this.prevFrequency = this.nextFrequency;
  }

  /**
   * This method gets or sets parameters for glide.
   * @param {keyof GlideParams|GlideParams} params This argument is string if getter. Otherwise, setter.
   * @return {GlideParams[keyof GlideParams} Return value is parameter for glide if getter.
   */
  public param(params: keyof GlideParams | GlideParams): GlideParams[keyof GlideParams] | void {
    if (typeof params === 'string') {
      switch (params) {
        case 'type':
          return this.type;
        case 'time':
          return this.time;
        default:
          return;
      }
    }

    for (const [key, value] of Object.entries(params)) {
      switch (key) {
        case 'type':
          if (typeof value === 'string') {
            this.type = value;
          }

          break;
        case 'time':
          if (typeof value === 'number') {
            this.time = value;
          }

          break;
        default:
          break;
      }
    }
  }

  /**
   * This method gets glide parameters as associative array.
   * @return {GlideParams}
   */
  public params(): GlideParams {
    return {
      type: this.type,
      time: this.time
    };
  }

  /** @override */
  public toString(): string {
    return '[OscillatorModule Glide]';
  }
}
