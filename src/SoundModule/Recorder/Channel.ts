import { Track } from './Track';

/**
 * This class is entity for recording channel.
 * @constructor
 */
export class Channel {
  private id: string;
  private tracks: Track[] = [];
  private channelGain = 1;

  /**
   * @param {string} id This argument is channel ID.
   */
  constructor(id: string) {
    this.id = id;
  }

  /**
   * This method appends instance of `Track`.
   * @param {Track} track This argument is instance of `Track` as recording track.
   * @return {Channel} Return value is for method chain.
   */
  public append(track: Track): Channel {
    this.tracks.push(track);
    return this;
  }

  /**
   * This method gets designated track or array that contains the all of tracks.
   * This method is overloaded for type interface and type check.
   * @param {number} trackNumber This argument is target track number.
   * @return {Track|Array<Track>}
   */
  public get(trackNumber: number): Track;
  public get(): Track[];
  public get(trackNumber?: number): Track | Track[] {
    if ((typeof trackNumber === 'number') && (trackNumber >= 0) && (trackNumber < this.tracks.length)) {
      return this.tracks[trackNumber];
    }

    return this.tracks;
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
   * This method gets the number of tracks.
   * @return {number}
   */
  public length(): number {
    return this.tracks.length;
  }

  /** @override */
  public toString(): string {
    return this.id;
  }
}
