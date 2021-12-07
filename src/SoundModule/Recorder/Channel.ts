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
   * This method gets designated track.
   * @param {number} trackNumber This argument is target track number.
   * @return {Track|null}
   */
  public get(trackNumber: number): Track | null {
    if ((trackNumber >= 0) && (trackNumber < this.tracks.length)) {
      return this.tracks[trackNumber];
    }

    return null;
  }

  /**
   * This method gets array that contains the all of tracks.
   * @return {Array<Track>}
   */
  public getAllTracks(): Track[] {
    return this.tracks;
  }

  /**
   * This method gets channel gain.
   * @return {number} Return value is channel gain.
   */
  public getGain(): number {
    return this.channelGain;
  }

  /**
   * This method sets channel gain.
   * @param {number} gain This argument is channel gain.
   */
  public setGain(gain: number): void {
    if ((gain >= 0) && (gain <= 1)) {
      this.channelGain = gain;
    }
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
