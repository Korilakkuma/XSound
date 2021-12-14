import { Effector } from './Effector';

export type CompressorParams = {
  state?: boolean,
  threshold?: number,
  knee?: number,
  ratio?: number,
  attack?: number,
  release?: number
};

/**
 * Effector's subclass for Compressor.
 * @constructor
 * @extends {Effector}
 */
export class Compressor extends Effector {
  private compressor: DynamicsCompressorNode;

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   */
  constructor(context: AudioContext) {
    super(context, 0);

    this.compressor = context.createDynamicsCompressor();

    // Initialize parameters
    this.compressor.threshold.value = -24;
    this.compressor.knee.value      = 30;
    this.compressor.ratio.value     = 12;
    this.compressor.attack.value    = 0.003;
    this.compressor.release.value   = 0.25;

    // `Compressor` is connected by default
    this.activate();
  }

  /** @override */
  public connect(): GainNode {
    // Clear connection
    this.input.disconnect(0);
    this.compressor.disconnect(0);

    if (this.isActive) {
      // Effect ON
      // GainNode (Input) -> DynamicsCompressorNode (Compressor) -> GainNode (Output)
      this.input.connect(this.compressor);
      this.compressor.connect(this.output);
    } else {
      // Effect OFF
      // GainNode (Input) -> GainNode (Output)
      this.input.connect(this.output);
    }

    return this.output;
  }

  /**
   * This method gets or sets parameters for compressor.
   * @param {keyof CompressorParams|CompressorParams} params This argument is string if getter. Otherwise, setter.
   * @return {CompressorParams[keyof CompressorParams]|Compressor} Return value is parameter for compressor if getter.
   *     Otherwise, return value is for method chain.
   */
  public param(params: keyof CompressorParams | CompressorParams): CompressorParams[keyof CompressorParams] | Compressor {
    if (typeof params === 'string') {
      switch (params) {
        case 'threshold':
          return this.compressor.threshold.value;
        case 'knee':
          return this.compressor.knee.value;
        case 'ratio':
          return this.compressor.ratio.value;
        case 'attack':
          return this.compressor.attack.value;
        case 'release':
          return this.compressor.release.value;
        default:
          return this;
      }
    }

    for (const [key, value] of Object.entries(params)) {
      switch (key) {
        case 'threshold':
          if (typeof value === 'number') {
            this.compressor.threshold.value = value;
          }

          break;
        case 'knee':
          if (typeof value === 'number') {
            this.compressor.knee.value = value;
          }

          break;
        case 'ratio':
          if (typeof value === 'number') {
            this.compressor.ratio.value = value;
          }

          break;
        case 'attack':
          if (typeof value === 'number') {
            this.compressor.attack.value = value;
          }

          break;
        case 'release':
          if (typeof value === 'number') {
            this.compressor.release.value = value;
          }

          break;
        default:
          break;
      }
    }

    return this;
  }

  /** @override */
  public params(): CompressorParams {
    return {
      state    : this.isActive,
      threshold: this.compressor.threshold.value,
      knee     : this.compressor.knee.value,
      ratio    : this.compressor.ratio.value,
      attack   : this.compressor.attack.value,
      release  : this.compressor.release.value
    };
  }

  /** @override */
  public toString(): string {
    return '[SoundModule Compressor]';
  }
}
