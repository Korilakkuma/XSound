import { Effector } from './Effector';

export type BoosterType = 'clean' | 'drive';

export type BoosterCurve = Float32Array<ArrayBuffer> | null;

export type BoosterParams = {
  state?: boolean,
  type?: BoosterType,
  drive?: number,
  level?: number,
  oversample?: OverSampleType
};

/**
 * Effector's subclass for Booster.
 */
export class Booster extends Effector {
  private type: BoosterType = 'clean';

  private drive: GainNode;
  private shaper: WaveShaperNode;
  private level: GainNode;
  private lowCut: BiquadFilterNode;
  private highCut: BiquadFilterNode;

  private driveValue = 0;

  /**
   * This static method creates instance of `Float32Array` for `WaveShaperNode`.
   * @param {number} drive This argument is drive level.
   * @param {number} numberOfSamples This argument is curve size. The default is `48000`.
   * @return {Float32Array|null} Return value is `WaveShaperNode`'s 'curve'.
   */
  public static createBoosterCurve(drive: number = 1, numberOfSamples: number = 48000): BoosterCurve {
    const curves = new Float32Array(numberOfSamples);

    for (let n = 0; n < numberOfSamples; n++) {
      const x = (n * 2) / (numberOfSamples - 1);

      curves[n] = Math.tanh(x * drive);
    }

    return curves;
  }

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   */
  constructor(context: AudioContext) {
    super(context);

    this.shaper  = this.context.createWaveShaper();
    this.drive   = this.context.createGain();
    this.level   = this.context.createGain();
    this.lowCut  = this.context.createBiquadFilter();
    this.highCut = this.context.createBiquadFilter();

    // Initialize parameters
    const curve = Booster.createBoosterCurve(this.drive.gain.value);

    this.shaper.curve       = curve;
    this.shaper.oversample  = 'none';

    this.drive.gain.value = 0;
    this.level.gain.value = 1;

    this.lowCut.type  = 'highpass';
    this.highCut.type = 'lowpass';

    this.lowCut.frequency.value  = 15;
    this.highCut.frequency.value = 22000;

    // `Booster` is not connected by default
    this.deactivate();
  }

  /** @override */
  public override connect(): GainNode {
    // Clear connection
    this.input.disconnect(0);
    this.drive.disconnect(0);
    this.shaper.disconnect(0);
    this.level.disconnect(0);
    this.lowCut.disconnect(0);
    this.highCut.disconnect(0);

    if (this.isActive && (this.drive.gain.value > 0)) {
      // Effect ON
      switch (this.type) {
        case 'clean': {
          // GainNode (Input) -> BiquadFilterNode (Low Cut) -> GainNode (Booster) -> BiquadFilterNode (High Cut) -> GainNode (Output)
          this.input.connect(this.lowCut);
          this.lowCut.connect(this.drive);
          this.drive.connect(this.highCut);
          this.highCut.connect(this.output);

          break;
        }

        case 'drive': {
          this.shaper.curve = Booster.createBoosterCurve(this.driveValue);

          // GainNode (Input) -> BiquadFilterNode (Low Cut) -> GainNode (Booster) -> WaveShaperNode (Drive) -> BiquadFilterNode (High Cut) -> GainNode (Level) -> GainNode (Output)
          this.input.connect(this.lowCut);
          this.lowCut.connect(this.drive);
          this.drive.connect(this.shaper);
          this.shaper.connect(this.highCut);
          this.highCut.connect(this.level);
          this.level.connect(this.output);

          break;
        }
      }
    } else {
      // Effect OFF

      // GainNode (Input) -> GainNode (Output)
      this.input.connect(this.output);
    }

    return this.output;
  }

  /**
   * This method gets or sets parameters for booster effector.
   * This method is overloaded for type interface and type check.
   * @param {keyof BoosterParams|BoosterParams} params This argument is string if getter. Otherwise, setter.
   * @return {BoosterParams[keyof BoosterParams]|Booster} Return value is parameter for booster effector if getter.
   *     Otherwise, return value is for method chain.
   */
  public param(params: 'state'): boolean;
  public param(params: 'type'): BoosterType;
  public param(params: 'drive'): number;
  public param(params: 'level'): number;
  public param(params: 'oversample'): OverSampleType;
  public param(params: BoosterParams): Booster;
  public param(params: keyof BoosterParams | BoosterParams): BoosterParams[keyof BoosterParams] | Booster {
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

        case 'oversample': {
          return this.shaper.oversample;
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
            if ((value === 'clean') || (value === 'drive')) {
              this.type = value;

              this.connect();
            }
          }

          break;
        }

        case 'drive': {
          if (typeof value === 'number') {
            this.driveValue = value;

            this.drive.gain.value = 20 * this.driveValue;

            if (this.drive.gain.value > 20) {
              this.drive.gain.value = 20;
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

        case 'oversample': {
          if (typeof value === 'string') {
            if ((value === 'none') || (value === '2x') || (value === '4x')) {
              this.shaper.oversample = value;
            }
          }

          break;
        }
      }
    }

    return this;
  }

  /** @override */
  public override params(): Required<BoosterParams> {
    return {
      state     : this.isActive,
      type      : this.type,
      drive     : this.driveValue,
      level     : this.level.gain.value,
      oversample: this.shaper.oversample
    };
  }
}
