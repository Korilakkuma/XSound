/**
 * This class is entity for recording track.
 * Namely, this class has recorded sound data.
 * @constructor
 */
export class Track {
  private id: string;
  private dataBlocks: Float32Array[] = [];

  /**
   * @param {id} id This argument is track ID.
   */
  constructor(id: string) {
    this.id = id;
  }

  /**
   * This method gets array that contains recorded sound data.
   * @return {Array<Float32Array>}
   */
  public get(): Float32Array[] {
    return this.dataBlocks;
  }

  /**
   * This method appends recorded sound data as `Float32Array`.
   * @param {Float32Array} dataBlock This argument is instance of `Float32Array` that has recorded sound data.
   * @return {Track} Return value is for method chain.
   */
  public append(dataBlock: Float32Array): Track {
    this.dataBlocks.push(dataBlock);
    return this;
  }

  /**
   * This method clears data blocks.
   */
  public clear(): void {
    this.dataBlocks.length = 0;
  }

  /**
   * This method determines whether contains recorded sound data.
   * @return {boolean} If track has recorded data, this value is `true`. Otherwise, this value is `false`.
   */
  public has(): boolean {
    return this.dataBlocks.length > 0;
  }

  /** @override */
  public toString(): string {
    return this.id;
  }
}
