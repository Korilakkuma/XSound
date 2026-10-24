import { Effector } from './Effector';

export type OverDriveType = 'overdrive' | 'natural' | 'warm' | 'crunch';

export type OverDriveCurve = Float32Array<ArrayBuffer> | null;

export type OverDriveParams = {
  state?: boolean,
  type?: OverDriveType,
  drive?: number,
  level?: number,
  oversample?: OverSampleType
};

/**
 * Effector's subclass for OverDrive.
 */
export class OverDrive extends Effector {
  private type: OverDriveType = 'natural';

  private shaper: WaveShaperNode;
  private level: GainNode;
  private drive: GainNode;
  private lowCut: BiquadFilterNode;
  private highCut: BiquadFilterNode;

  private driveValue = 0;

  /**
   * This static method creates instance of `Float32Array` for `WaveShaperNode`.
   * @param {number} drive This argument is drive level.
   * @param {number} numberOfSamples This argument is curve size. The default value is `1024`.
   * @param {boolean} asymmetrical This argument is asymmetrical clipping if this value is `true`. The default value is `false`
   * @return {Float32Array|null} Return value is `WaveShaperNode`'s 'curve'.
   */
  public static createOverdriveCurve(drive: number, numberOfSamples: number = 1024, asymmetrical: boolean = false): OverDriveCurve {
    if (drive < 0 || drive > 1) {
      return null;
    }

    if (drive === 1) {
      drive = 0.95;
    }

    const curves = new Float32Array(numberOfSamples);

    const k = (2 * drive) / (1 - drive);

    for (let n = 0; n < numberOfSamples; n++) {
      const x = (((n - 0) * (1 - (-1))) / (numberOfSamples - 0)) + (-1);
      const y = ((1 + k) * x) / (1 + (k * Math.abs(x)));

      // Asymmetrical clipping curve ?
      if (asymmetrical) {
        curves[n] = (y > 0) ? y : ((1 - ((drive > 0.25) ? 0.25 : drive)) * y);
      } else {
        curves[n] = y;
      }
    }

    return curves;
  }

  /**
   * This static method creates instance of `Float32Array` for `WaveShaperNode`.
   * @param {number} amount This argument is curve shape. The default value is `100`.
   * @param {number} numberOfSamples This argument is curve size. The default value is `48000`.
   * @param {boolean} asymmetrical This argument is asymmetrical clipping if this value is `true`. The default value is `true`.
   * @return {Float32Array|null} Return value is `WaveShaperNode`'s 'curve'.
   */
  public static createOverDriveCurve(amount: number = 100, numberOfSamples: number = 48000, asymmetrical: boolean = true): OverDriveCurve {
    const curves = new Float32Array(numberOfSamples);

    const deg = Math.PI / 180;

    for (let n = 0; n < numberOfSamples; n++) {
      const x = ((n * 2) / numberOfSamples) - 1;

      if (asymmetrical) {
        if (x >= 0) {
          curves[n] = ((3 + amount) * x * 20 * deg) / (Math.PI + (amount * Math.abs(x)));
        } else {
          const k = 1.4 * amount;
          const y = ((3 + k) * x * 20 * deg) / (Math.PI + (k * Math.abs(x)));

          curves[n] = 0.88 * y;
        }
      } else {
        curves[n] = ((3 + amount) * x * 20 * deg) / (Math.PI + (amount * Math.abs(x)));
      }
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
    this.shaper.curve       = OverDrive.createOverDriveCurve(150 * this.driveValue);
    this.shaper.oversample  = '4x';

    this.drive.gain.value = 0;
    this.level.gain.value = 1;

    this.lowCut.type  = 'highpass';
    this.highCut.type = 'lowpass';

    this.lowCut.frequency.value  = 300;
    this.highCut.frequency.value = 3800;

    this.lowCut.Q.value  = Math.SQRT1_2;
    this.highCut.Q.value = Math.SQRT1_2;

    // `OverDrive` is not connected by default
    this.deactivate();
  }

  /** @override */
  public override connect(): GainNode {
    // Clear connection
    this.input.disconnect(0);
    this.shaper.disconnect(0);
    this.drive.disconnect(0);
    this.level.disconnect(0);
    this.lowCut.disconnect(0);
    this.highCut.disconnect(0);

    if (this.isActive && (this.drive.gain.value > 0)) {
      // Effect ON

      switch (this.type) {
        case 'overdrive': {
          this.shaper.curve = OverDrive.createOverDriveCurve(100 * this.driveValue);
          break;
        }

        case 'natural': {
          this.shaper.curve = OverDrive.createOverDriveCurve(30 * this.driveValue);
          break;
        }

        case 'warm': {
          this.shaper.curve = OverDrive.createOverDriveCurve((50 * this.driveValue), this.context.sampleRate, false);
          break;
        }

        case 'crunch': {
          this.shaper.curve = OverDrive.createOverDriveCurve((10 * this.driveValue), this.context.sampleRate, false);
          break;
        }
      }

      // GainNode (Input) -> BiquadFilterNode (Low Cut) -> GainNode (Drive) > WaveShaperNode (OverDrive) -> BiquadFilterNode (High Cut) -> GainNode (Level) -> GainNode (Output)
      this.input.connect(this.lowCut);
      this.lowCut.connect(this.drive);
      this.drive.connect(this.shaper);
      this.shaper.connect(this.highCut);
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
   * This method gets or sets parameters for overdrive effector.
   * This method is overloaded for type interface and type check.
   * @param {keyof OverDriveParams|OverDriveParams} params This argument is string if getter. Otherwise, setter.
   * @return {OverDriveParams[keyof OverDriveParams]|OverDrive} Return value is parameter for overdrive effector if getter.
   *     Otherwise, return value is for method chain.
   */
  public param(params: 'state'): boolean;
  public param(params: 'type'): OverDriveType;
  public param(params: 'drive'): number;
  public param(params: 'level'): number;
  public param(params: 'oversample'): OverSampleType;
  public param(params: OverDriveParams): OverDrive;
  public param(params: keyof OverDriveParams | OverDriveParams): OverDriveParams[keyof OverDriveParams] | OverDrive {
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
            if ((value === 'overdrive') || (value === 'natural') || (value === 'warm') || (value === 'crunch')) {
              this.type = value;

              this.connect();
            }
          }

          break;
        }

        case 'drive': {
          if (typeof value === 'number') {
            this.driveValue       = value;
            this.drive.gain.value = 10 * this.driveValue;

            if (this.drive.gain.value > 10) {
              this.driveValue       = 1;
              this.drive.gain.value = 10;
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
  public override params(): Required<OverDriveParams> {
    return {
      state     : this.isActive,
      type      : this.type,
      drive     : this.driveValue,
      level     : this.level.gain.value,
      oversample: this.shaper.oversample
    };
  }
}
