import { Effector } from './Effector';

export type BitCrusherParams = {
  state?: boolean,
  bits?: number
};

/**
 * Effector's subclass for BitCrusher.
 * @constructor
 * @extends {Effector}
 */
export class BitCrusher extends Effector {
  private shaper: WaveShaperNode;
  private inputShaper: WaveShaperNode;
  private outputShaper: WaveShaperNode;
  private inputLevel: GainNode;
  private outputLevel: GainNode;
  private bitsInput: ConstantSourceNode;
  private bitsGain: GainNode;

  private bits = 0;

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   */
  constructor(context: AudioContext) {
    super(context);

    this.shaper       = this.context.createWaveShaper();
    this.inputShaper  = this.context.createWaveShaper();
    this.outputShaper = this.context.createWaveShaper();

    this.inputLevel  = this.context.createGain();
    this.outputLevel = this.context.createGain();

    this.bitsInput = this.context.createConstantSource();
    this.bitsGain  = this.context.createGain();

    // Initialize parameters
    const curve = new Float32Array(1023);

    for (let i = 0; i < 512; i++) {
      const v = (((i / 512) * 128) | 0) / 128;

      curve[511 + i] =  v;
      curve[511 - i] = -v;
    }

    const inputCurve  = new Float32Array(10);
    const outputCurve = new Float32Array(10);

    for (let i = 0, d = 64; i < 6; i++, d *= 0.5) {
      inputCurve[0 + i] = 1 / 64;
      inputCurve[4 + i] = 1 / d;

      outputCurve[0 + i] = 64;
      outputCurve[4 + i] = d;
    }

    this.shaper.curve       = curve;
    this.inputShaper.curve  = inputCurve;
    this.outputShaper.curve = outputCurve;

    this.inputLevel.gain.value  = 0;
    this.outputLevel.gain.value = 0;

    this.bitsInput.offset.value = this.bits;
    this.bitsGain.gain.value    = 1 / 8;

    // `BitCrusher` is not connected by default
    this.deactivate();
  }

  /** @override */
  public override start(_startTime?: number): void {
    if (!this.isActive || !this.paused) {
      return;
    }

    this.bitsInput.start(this.context.currentTime);

    this.paused = false;
  }

  /** @override */
  public override stop(_stopTime?: number, _releaseTime?: number): void {
    if (!this.isActive || this.paused) {
      return;
    }

    this.bitsInput.stop(this.context.currentTime);

    // Create instance of `ConstantSourceNode` again
    this.bitsInput = this.context.createConstantSource();

    // Restore parameters
    this.bitsInput.offset.value = this.bits;

    this.paused = true;

    // Connect again
    this.connect();
  }

  /** @override */
  public override connect(): GainNode {
    // Clear connection
    this.input.disconnect(0);
    this.shaper.disconnect(0);
    this.inputShaper.disconnect(0);
    this.outputShaper.disconnect(0);
    this.inputLevel.disconnect(0);
    this.outputLevel.disconnect(0);
    this.bitsInput.disconnect(0);
    this.bitsGain.disconnect(0);

    if (this.isActive) {
      // Effect ON

      // GainNode (Input) > GainNode (Input Gain) -> WaveShaperNode (Bit Crusher) -> GainNode (Output Gain) -> GainNode (Output)
      this.input.connect(this.inputLevel);
      this.inputLevel.connect(this.shaper);
      this.shaper.connect(this.outputLevel);
      this.outputLevel.connect(this.output);

      // ConstantSourceNode (Input as Bit Crusher) -> GainNode (Bit Crusher Gain)
      this.bitsInput.connect(this.bitsGain);

      // GainNode (Bit Crusher Gain) -> WaveShaperNode (Input Envelope Follower) -> AudioParam (gain as input)
      this.bitsGain.connect(this.inputShaper);
      this.inputShaper.connect(this.inputLevel.gain);

      // GainNode (Bit Crusher Gain) -> WaveShaperNode (Output Envelope Follower) -> AudioParam (gain as output)
      this.bitsGain.connect(this.outputShaper);
      this.outputShaper.connect(this.outputLevel.gain);
    } else {
      // Effect OFF

      // GainNode (Input) -> GainNode (Output)
      this.input.connect(this.output);
    }

    return this.output;
  }

  /**
   * This method gets or sets parameters for bit crusher effector.
   * This method is overloaded for type interface and type check.
   * @param {keyof BitCrusherParams|BitCrusherParams} params This argument is string if getter. Otherwise, setter.
   * @return {BitCrusherParams[keyof BitCrusherParams]|BitCrusher} Return value is parameter for bit crusher effector if getter.
   *     Otherwise, return value is for method chain.
   */
  public param(params: 'state'): boolean;
  public param(params: 'bits'): number;
  public param(params: BitCrusherParams): BitCrusher;
  public param(params: keyof BitCrusherParams | BitCrusherParams): BitCrusherParams[keyof BitCrusherParams] | BitCrusher {
    if (typeof params === 'string') {
      switch (params) {
        case 'state':
          return this.isActive;
        case 'bits':
          return this.bits;
        default:
          return this;
      }
    }

    for (const [key, value] of Object.entries(params)) {
      switch (key) {
        case 'state':
          if (typeof value === 'boolean') {
            this.isActive = value;
          }

          break;
        case 'bits':
          if (typeof value === 'number') {
            this.bits = value;
            this.bitsInput.offset.value = this.bits;
          }

          break;
        default:
          break;
      }
    }

    return this;
  }

  /** @override */
  public override params(): Required<BitCrusherParams> {
    return {
      state: this.isActive,
      bits : this.bits
    };
  }

  /** @override */
  public override activate(): BitCrusher {
    super.activate();
    return this;
  }

  /** @override */
  public override deactivate(): BitCrusher {
    super.deactivate();
    return this;
  }
}
