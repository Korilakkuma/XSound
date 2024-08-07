/**
 * This class is entity for sequence that has musical note.
 */
export class Sequence {
  private _id: string;
  private _note: string;
  private _indexes: number[];
  private _frequencies: number[];
  private _start: number;
  private _stop: number;
  private _duration: number;

  /**
   * @property {string} id This argument is string that identifies sequence.
   * @property {string} note This argument is string that corresponds to MML token.
   * @property {Array<number>} indexes This argument is array that contains index that corresponds to 12 equal temperament.
   * @property {Array<number>} frequencies This argument is array that contains frequency.
   * @property {number} start This argument is start time.
   * @property {number} stop This argument is stop time.
   * @property {number} duration This argument is duration.
   */
  constructor(params: {
    id: string;
    note: string;
    indexes: number[];
    frequencies: number[];
    start: number;
    stop: number;
    duration: number;
  }) {
    const { id, note, indexes, frequencies, start, stop, duration } = params;

    this._id          = id;
    this._note        = note;
    this._indexes     = indexes;
    this._frequencies = frequencies;
    this._start       = start;
    this._stop        = stop;
    this._duration    = duration;
  }

  /**
   * This method concatenates sequence in case of tie.
   * @param {Sequence} sequence This argument is instance of `Sequence`.
   * @return {Sequence} Return value is new instance of `Sequence` that concatenates previous sequence.
   */
  public concat(sequence: Sequence): Sequence {
    return new Sequence({
      id         : this._id,
      note       : `${this._note}&${sequence.note}`,
      indexes    : this._indexes,
      frequencies: this._frequencies,
      start      : this._start,
      duration   : this._duration + sequence.duration,
      stop       : this._start + (this._duration + sequence.duration)
    });
  }

  /**
   * This method is getter for musical note as MML token.
   */
  public get note(): string {
    return this._note;
  }

  /**
   * This method is getter for array that contains index that corresponds to 12 equal temperament.
   */
  public get indexes(): number[] {
    return this._indexes;
  }

  /**
   * This method is getter for array that contains frequency.
   */
  public get frequencies(): number[] {
    return this._frequencies;
  }

  /**
   * This method is getter for start time.
   */
  public get start(): number {
    return this._start;
  }

  /**
   * This method is getter for stop time.
   */
  public get stop(): number {
    return this._stop;
  }

  /**
   * This method is getter for duration,
   */
  public get duration(): number {
    return this._duration;
  }

  /**
   * This method returns fields that `Sequence` has as JSON.
   */
  public toString(): string {
    return JSON.stringify({
      id         : this._id,
      note       : this._note,
      indexes    : this._indexes,
      frequencies: this._frequencies,
      start      : this._start,
      stop       : this._stop,
      duration   : this._duration
    });
  }
}
