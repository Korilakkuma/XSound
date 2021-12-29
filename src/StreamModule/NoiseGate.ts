export type NoiseGateParams = {
  level?: number
};

/**
 * This private class is for Noise Gate.
 * @constructor
 */
export class NoiseGate {
  private level = 0;

  // eslint-disable-next-line no-useless-constructor
  constructor() {
  }

  /**
   * This method detects background noise and removes this.
   * @param {number} data This argument is amplitude (between -1 and 1).
   * @return {number} Return value is `0` or the raw data.
   */
  public start(data: number): number {
    // data : Amplitude is equal to argument.
    //    0 : Because signal is detected as background noise, amplitude is `0`.
    return (Math.abs(data) > this.level) ? data : 0;
  }

  /**
   * This method gets or sets parameters for noise gate.
   * @param {keyof NoiseGateParams|NoiseGateParams} params This argument is string if getter. Otherwise, setter.
   * @return {NoiseGateParams[keyof NoiseGateParams]} Return value is parameter for noise gate if getter.
   */
  public param(params: keyof NoiseGateParams | NoiseGateParams): NoiseGateParams[keyof NoiseGateParams] | void {
    if (typeof params === 'string') {
      switch (params) {
        case 'level':
          return this.level;
        default:
          return;
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
  }

  /**
   * This method gets noise gate parameters as associative array.
   * @return {NoiseGateParams}
   */
  public params(): NoiseGateParams {
    return {
      level: this.level
    };
  }

  /** @override */
  public toString(): string {
    return '[StreamModule NoiseGate]';
  }
}
