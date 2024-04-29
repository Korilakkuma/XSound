import type { Frame } from './Frame';

/**
 * This class is entity for recording channel.
 * @constructor
 */
export class Channel {
  private id: string;
  private frames: Frame[] = [];
  private channelGain = 1;

  /**
   * @param {string} id This argument is channel ID.
   */
  constructor(id: string) {
    this.id = id;
  }

  /**
   * This method appends instance of `Frame`.
   * @param {Frame} frame This argument is instance of `Frame` as recording frame.
   * @return {Channel} Return value is for method chain.
   */
  public append(frame: Frame): Channel {
    this.frames.push(frame);
    return this;
  }

  /**
   * This method gets designated frame or array that contains the all of frames.
   * This method is overloaded for type interface and type check.
   * @param {number} frameNumber This argument is target frame number.
   * @return {Frame|Array<Frame>}
   */
  public get(frameNumber: number): Frame;
  public get(): Frame[];
  public get(frameNumber?: number): Frame | Frame[] {
    if ((typeof frameNumber === 'number') && (frameNumber >= 0) && (frameNumber < this.frames.length)) {
      return this.frames[frameNumber];
    }

    return this.frames;
  }

  /**
   * This method gets or sets channel gain.
   * This method is overloaded for type interface and type check.
   * @param {number} param This argument is channel gain.
   * @return {number} Return value is channel gain.
   */
  public gain(): number;
  public gain(param: number): void;
  public gain(param?: number): number | void {
    if ((typeof param === 'number') && (param >= 0) && (param <= 1)) {
      this.channelGain = param;
      return;
    }

    return this.channelGain;
  }

  /**
   * This method gets the number of frames.
   * @return {number}
   */
  public length(): number {
    return this.frames.length;
  }

  /** @override */
  public toString(): string {
    return this.id;
  }
}
