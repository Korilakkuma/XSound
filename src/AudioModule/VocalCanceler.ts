export type VocalCancelerParams = {
  depth?: number
};

/**
 * This private class is for Vocal Canceler.
 * @constructor
 */
export class VocalCanceler {
  private depth = 0;

  // eslint-disable-next-line no-useless-constructor
  constructor() {
  }

  /**
   * This method removes vocal part from audio on playing.
   * @param {number} dataL This argument is gain level for Left channel.
   * @param {number} dataR This argument is gain level for Right channel.
   * @return {number} Return value is audio data except vocal part.
   */
  public start(dataL: number, dataR: number): number {
    return dataL - (this.depth * dataR);
  }

  /**
   * This method gets or sets parameters for vocal canceler.
   * @param {keyof VocalCancelerParams|VocalCancelerParams} params This argument is string if getter. Otherwise, setter.
   * @return {VocalCancelerParams[keyof VocalCancelerParams]|VocalCanceler} Return value is parameter for vocal canceler if getter.
   *     Otherwise, return value is for method chain.
   */
  public param(params: keyof VocalCancelerParams | VocalCancelerParams): VocalCancelerParams[keyof VocalCancelerParams] | VocalCanceler {
    if (typeof params === 'string') {
      switch (params) {
        case 'depth':
          return this.depth;
        default:
          return this;
      }
    }

    for (const [key, value] of Object.entries(params)) {
      switch (key) {
        case 'depth':
          if (typeof value === 'number') {
            this.depth = value;
          }

          break;
        default:
          break;
      }
    }

    return this;
  }

  /**
   * This method gets vocal canceler parameters as associative array.
   * @return {VocalCancelerParams}
   */
  public params(): VocalCancelerParams {
    return {
      depth: this.depth
    };
  }

  /** @override */
  public toString(): string {
    return '[AudioModule VocalCanceler]';
  }
}
