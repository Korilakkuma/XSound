import { Statable } from '../interfaces';

export type NoiseGateParams = {
  state?: boolean,
  level?: number
};

/**
 * This private class is for Noise Gate.
 * @constructor
 * @implements {Statable}
 */
export class NoiseGate implements Statable {
  private level = 0;
  private isActive = true;

  // eslint-disable-next-line no-useless-constructor
  constructor() {
  }

  /**
   * This method detects background noise and removes this.
   * @param {number} data This argument is amplitude (between -1 and 1).
   * @return {number} Return value is `0` or the raw data.
   */
  public start(data: number): number {
    if (!this.isActive) {
      return data;
    }

    // data : Amplitude is equal to argument.
    //    0 : Because signal is detected as background noise, amplitude is `0`.
    return (Math.abs(data) > this.level) ? data : 0;
  }

  /**
   * This method gets or sets parameters for noise gate.
   * @param {keyof NoiseGateParams|NoiseGateParams} params This argument is string if getter. Otherwise, setter.
   * @return {NoiseGateParams[keyof NoiseGateParams]|NoiseGate} Return value is parameter for noise gate if getter.
   *     Otherwise, return value is for method chain.
   */
  public param(params: 'level'): number;
  public param(params: NoiseGateParams): NoiseGate;
  public param(params: keyof NoiseGateParams | NoiseGateParams): NoiseGateParams[keyof NoiseGateParams] | NoiseGate {
    if (typeof params === 'string') {
      switch (params) {
        case 'level':
          return this.level;
        default:
          return this;
      }
    }

    for (const [key, value] of Object.entries(params)) {
      switch (key) {
        case 'level':
          if (typeof value === 'number') {
            this.level = value;
          }

          break;
        default:
          break;
      }
    }

    return this;
  }

  /**
   * This method gets noise gate parameters as associative array.
   * @return {NoiseGateParams}
   */
  public params(): Required<NoiseGateParams> {
    return {
      state: this.isActive,
      level: this.level
    };
  }

  /**
   * This method gets noise gate state. If returns `true`, noise gate is active.
   * @return {boolean}
   */
  public state(): boolean {
    return this.isActive;
  }

  /**
   * This method activates noise gate.
   * @return {NoiseGate} Return value is for method chain.
   */
  public activate(): NoiseGate {
    this.isActive = true;
    return this;
  }

  /**
   * This method deactivates noise gate.
   * @return {NoiseGate} Return value is for method chain.
   */
  public deactivate(): NoiseGate {
    this.isActive = false;
    return this;
  }
}
