import { Effector } from '/src/SoundModule/Effectors/Effector';

export type FuzzParams = {
  state?: boolean,
  drive?: number,
  level?: number
};

/**
 * Effector's subclass for Fuzz.
 * @constructor
 * @extends {Effector}
 */
export class Fuzz extends Effector {
  private positiveShaper: WaveShaperNode;
  private negativeShaper: WaveShaperNode;
  private positiveInputGain: GainNode;
  private negativeInputGain: GainNode;
  private positiveOutputGain: GainNode;
  private negativeOutputGain: GainNode;
  private outFilter: BiquadFilterNode;
  private driveInput: ConstantSourceNode;
  private level: GainNode;

  private drive = 0;

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   */
  constructor(context: AudioContext) {
    super(context);

    this.positiveShaper     = this.context.createWaveShaper();
    this.negativeShaper     = this.context.createWaveShaper();
    this.positiveInputGain  = this.context.createGain();
    this.negativeInputGain  = this.context.createGain();
    this.positiveOutputGain = this.context.createGain();
    this.negativeOutputGain = this.context.createGain();

    this.driveInput = this.context.createConstantSource();

    this.outFilter = this.context.createBiquadFilter();

    this.level = this.context.createGain();

    // Initialize parameters
    const curve = new Float32Array(1024);

    for (let i = 0; i < 512; i++) {
      const r = Math.tanh((4 * i) / 512) * 0.5;
      const v = 1 - (i / 512);

      curve[512 + i] = r;
      curve[511 - i] = r * (v ** 4);
    }

    this.positiveShaper.curve = curve;
    this.negativeShaper.curve = curve;

    this.positiveInputGain.gain.value =  1;
    this.negativeInputGain.gain.value = -1;

    this.positiveOutputGain.gain.value =  1;
    this.negativeOutputGain.gain.value = -1;

    this.driveInput.offset.value = this.drive;

    this.outFilter.type            = 'highpass';
    this.outFilter.frequency.value = 80;
    this.outFilter.Q.value         = 1;
    this.outFilter.gain.value      = 0;

    this.level.gain.value = 1;

    // `Fuzz` is not connected by default
    this.deactivate();
  }

  /** @override */
  public override start(_startTime?: number): void {
    if (!this.isActive || !this.paused) {
      return;
    }

    this.driveInput.start(this.context.currentTime);

    this.paused = false;
  }

  /** @override */
  public override stop(_stopTime?: number, _releaseTime?: number): void {
    if (!this.isActive || this.paused) {
      return;
    }

    this.driveInput.stop(this.context.currentTime);

    // Create instance of `ConstantSourceNode` again
    this.driveInput = this.context.createConstantSource();

    // Restore parameters
    this.driveInput.offset.value = this.drive;

    this.paused = true;

    // Connect again
    this.connect();
  }

  /** @override */
  public override connect(): GainNode {
    // Clear connection
    this.input.disconnect(0);
    this.positiveShaper.disconnect(0);
    this.negativeShaper.disconnect(0);
    this.positiveInputGain.disconnect(0);
    this.negativeInputGain.disconnect(0);
    this.positiveOutputGain.disconnect(0);
    this.negativeOutputGain.disconnect(0);
    this.driveInput.disconnect(0);
    this.outFilter.disconnect(0);
    this.level.disconnect(0);

    if (this.isActive) {
      // Effect ON

      // GainNode (Input) > GainNode (Positive Input Gain) -> WaveShaperNode (+Fuzz) -> GainNode (Positive Output Gain) -> BiquadFilterNode (High-pass)
      this.input.connect(this.positiveInputGain);
      this.positiveInputGain.connect(this.positiveShaper);
      this.positiveShaper.connect(this.positiveOutputGain);
      this.positiveOutputGain.connect(this.outFilter);

      // GainNode (Input) > GainNode (Negative Input Gain) -> WaveShaperNode (-Fuzz) -> GainNode (Negative Output Gain) -> BiquadFilterNode (High-pass)
      this.input.connect(this.negativeInputGain);
      this.negativeInputGain.connect(this.negativeShaper);
      this.negativeShaper.connect(this.negativeOutputGain);
      this.negativeOutputGain.connect(this.outFilter);

      // ConstantSourceNode (Input as Fuzz) -> AudioParam (gain as negative output gain)
      this.driveInput.connect(this.negativeOutputGain.gain);

      // BiquadFilterNode (High-pass) -> GainNode (Fuzz Level) -> GainNode (Output)
      this.outFilter.connect(this.level);
      this.level.connect(this.output);
    } else {
      // Effect OFF

      // GainNode (Input) -> GainNode (Output)
      this.input.connect(this.output);
    }

    return this.output;
  }

  /**
   * This method gets or sets parameters for fuzz effector.
   * This method is overloaded for type interface and type check.
   * @param {keyof FuzzParams|FuzzParams} params This argument is string if getter. Otherwise, setter.
   * @return {FuzzParams[keyof FuzzParams]|Fuzz} Return value is parameter for fuzz effector if getter.
   *     Otherwise, return value is for method chain.
   */
  public param(params: 'state'): boolean;
  public param(params: 'drive'): number;
  public param(params: 'level'): number;
  public param(params: FuzzParams): Fuzz;
  public param(params: keyof FuzzParams | FuzzParams): FuzzParams[keyof FuzzParams] | Fuzz {
    if (typeof params === 'string') {
      switch (params) {
        case 'state': {
          return this.isActive;
        }

        case 'drive': {
          return this.drive;
        }

        case 'level': {
          return this.level.gain.value;
        }

        default: {
          return this;
        }
      }
    }

    for (const [key, value] of Object.entries(params)) {
      switch (key) {
        case 'state': {
          if (typeof value === 'boolean') {
            this.isActive = value;
          }

          break;
        }

        case 'drive': {
          if (typeof value === 'number') {
            this.drive = value;
            this.driveInput.offset.value = this.drive;
          }

          break;
        }

        case 'level': {
          if (typeof value === 'number') {
            this.level.gain.value = value;
          }

          break;
        }

        default: {
          break;
        }
      }
    }

    return this;
  }

  /** @override */
  public override params(): Required<FuzzParams> {
    return {
      state: this.isActive,
      drive: this.drive,
      level: this.level.gain.value
    };
  }

  /** @override */
  public override activate(): Fuzz {
    super.activate();
    return this;
  }

  /** @override */
  public override deactivate(): Fuzz {
    super.deactivate();
    return this;
  }
}
