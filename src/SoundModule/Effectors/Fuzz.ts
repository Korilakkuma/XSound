import { Effector } from './Effector';

export type FuzzType = 'full-rectifier' | 'half-rectifier';

export type FuzzParams = {
  state?: boolean,
  type?: FuzzType,
  drive?: number,
  level?: number,
  tone?: number,
  oversample?: OverSampleType
};

/**
 * Effector's subclass for Fuzz.
 */
export class Fuzz extends Effector {
  private type: FuzzType = 'full-rectifier';

  private rectifier: WaveShaperNode;
  private drive: GainNode;
  private level: GainNode;
  private lowCut: BiquadFilterNode;
  private highCut: BiquadFilterNode;

  private driveValue = 1;

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   */
  constructor(context: AudioContext) {
    super(context);

    this.rectifier = this.context.createWaveShaper();
    this.drive     = this.context.createGain();
    this.level     = this.context.createGain();
    this.lowCut    = this.context.createBiquadFilter();
    this.highCut   = this.context.createBiquadFilter();

    // Initialize parameters
    this.rectifier.oversample = '4x';

    this.drive.gain.value = this.driveValue;

    this.lowCut.type  = 'highpass';
    this.highCut.type = 'lowpass';

    this.lowCut.frequency.value  = 250;
    this.highCut.frequency.value = 6000;

    // `Fuzz` is not connected by default
    this.deactivate();
  }

  /** @override */
  public override connect(): GainNode {
    // Clear connection
    this.input.disconnect(0);
    this.rectifier.disconnect(0);
    this.drive.disconnect(0);
    this.level.disconnect(0);
    this.lowCut.disconnect(0);
    this.highCut.disconnect(0);

    if (this.isActive && (this.drive.gain.value > 0 )) {
      // Effect ON

      switch (this.type) {
        case 'full-rectifier': {
          this.rectifier.curve = new Float32Array([1, 0, 1]);
          break;
        }

        case 'half-rectifier': {
          this.rectifier.curve = new Float32Array([0, 0, 1]);
          break;
        }
      }

      // GainNode (Input) -> BiquadFilterNode (Low Cut) -> GainNode (Drive) -> WaveShaperNode (Fuzz) -> BiquadFilterNode (High Cut) -> GainNode (Level) -> GainNode (Output)
      this.input.connect(this.lowCut);
      this.lowCut.connect(this.drive);
      this.drive.connect(this.rectifier);
      this.rectifier.connect(this.highCut);
      this.highCut.connect(this.level);
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
  public param(params: 'type'): FuzzType;
  public param(params: 'drive'): number;
  public param(params: 'level'): number;
  public param(params: 'tone'): number;
  public param(params: 'oversample'): OverSampleType;
  public param(params: FuzzParams): Fuzz;
  public param(params: keyof FuzzParams | FuzzParams): FuzzParams[keyof FuzzParams] | Fuzz {
    if (typeof params === 'string') {
      switch (params) {
        case 'state': {
          return this.isActive;
        }

        case 'type': {
          return this.type;
        }

        case 'drive': {
          return this.driveValue;
        }

        case 'level': {
          return this.level.gain.value;
        }

        case 'tone': {
          return this.highCut.frequency.value;
        }

        case 'oversample': {
          return this.rectifier.oversample;
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

        case 'type': {
          if (typeof value === 'string') {
            if ((value === 'full-rectifier') || (value === 'half-rectifier')) {
              this.type = value;

              this.connect();
            }
          }

          break;
        }

        case 'drive': {
          if (typeof value === 'number') {
            this.driveValue       = value;
            this.drive.gain.value = 50 * this.driveValue;

            if (this.drive.gain.value > 50) {
              this.drive.gain.value = 50;
              this.driveValue       = 1;
            }

            this.connect();
          }

          break;
        }

        case 'level': {
          if (typeof value === 'number') {
            this.level.gain.value = value;
          }

          break;
        }

        case 'tone': {
          if (typeof value === 'number') {
            this.highCut.frequency.value = value;
          }

          break;
        }

        case 'oversample': {
          if (typeof value === 'string') {
            if ((value === 'none') || (value === '2x') || (value === '4x')) {
              this.rectifier.oversample = value;
            }
          }

          break;
        }
      }
    }

    return this;
  }

  /** @override */
  public override params(): Required<FuzzParams> {
    return {
      state     : this.isActive,
      type      : this.type,
      drive     : this.driveValue,
      level     : this.level.gain.value,
      tone      : this.highCut.frequency.value,
      oversample: this.rectifier.oversample
    };
  }
}
