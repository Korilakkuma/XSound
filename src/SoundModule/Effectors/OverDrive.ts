import { Effector } from './Effector';

export type OverDriveType = 'natural' | 'warm' | 'crunch';

export type OverDriveCurve = Float32Array<ArrayBuffer> | null;

export type OverDriveParams = {
  state?: boolean,
  type?: OverDriveType,
  drive?: number,
  level?: number,
  numberOfSamples?: number,
  oversample?: OverSampleType
};

/**
 * Effector's subclass for OverDrive.
 */
export class OverDrive extends Effector {
  private type: OverDriveType = 'natural';

  private shaper: WaveShaperNode;
  private inputShaper: WaveShaperNode;
  private outputShaper: WaveShaperNode;
  private inputGain: GainNode;
  private outputGain: GainNode;
  private driveInput: ConstantSourceNode;
  private level: GainNode;

  private drive = 0;
  private numberOfSamples = 1024;


  /**
   * This static method creates instance of `Float32Array` for `WaveShaperNode`.
   * @param {number} numberOfSamples This argument is curve size. The default is `1024`.
   * @return {Float32Array|null} Return value is `WaveShaperNode`'s 'curve'.
   */
  public static createNaturalOverdriveCurve(numberOfSamples: number = 1024): OverDriveCurve {
    const index = Math.trunc(numberOfSamples / 2);

    const curves = new Float32Array(numberOfSamples);

    for (let i = 0; i < index; i++) {
      const r = Math.tanh((4 * i) / index) * 0.5;

      curves[index + i] =  r;
      curves[index - i] = -r;
    }

    return curves;
  };

  /**
   * This static method creates instance of `Float32Array` for `WaveShaperNode`.
   * @param {number} drive This argument is drive level.
   * @param {number} numberOfSamples This argument is curve size. The default is `1024`.
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
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   */
  constructor(context: AudioContext) {
    super(context);

    this.shaper       = this.context.createWaveShaper();
    this.inputShaper  = this.context.createWaveShaper();
    this.outputShaper = this.context.createWaveShaper();

    this.inputGain  = this.context.createGain();
    this.outputGain = this.context.createGain();

    this.driveInput = this.context.createConstantSource();

    this.level = this.context.createGain();

    // Initialize parameters
    const curve = OverDrive.createNaturalOverdriveCurve();

    const inputCurve = new Float32Array(101);

    for (let i = 0; i < 101; i++) {
      inputCurve[i] = 0.25;
    }

    for (let i = 52, d1 = 0.25; i < 101; i++, d1 *= 1.1) {
      inputCurve[i] = d1;
    }

    const outputCurve = new Float32Array([2, 2, 2, 2, 2, 0.9, 0.5, 0.35, 0.3]);

    this.shaper.curve       = curve;
    this.shaper.oversample  = '4x';
    this.inputShaper.curve  = inputCurve;
    this.outputShaper.curve = outputCurve;

    this.inputGain.gain.value  = 0;
    this.outputGain.gain.value = 0;

    this.driveInput.offset.value = this.drive;

    this.level.gain.value = 1;

    // `OverDrive` is not connected by default
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
    this.shaper.disconnect(0);
    this.inputShaper.disconnect(0);
    this.outputShaper.disconnect(0);
    this.inputGain.disconnect(0);
    this.outputGain.disconnect(0);
    this.driveInput.disconnect(0);
    this.level.disconnect(0);

    if (this.isActive) {
      // Effect ON

      switch (this.type) {
        case 'natural': {
          this.shaper.curve = OverDrive.createNaturalOverdriveCurve(this.numberOfSamples);

          // GainNode (Input) > GainNode (Input Gain) -> WaveShaperNode (OverDrive) -> GainNode (Output Gain) -> GainNode (OverDrive Level) -> GainNode (Output)
          this.input.connect(this.inputGain);
          this.inputGain.connect(this.shaper);
          this.shaper.connect(this.outputGain);
          this.outputGain.connect(this.level);
          this.level.connect(this.output);

          // ConstantSourceNode (Input as OverDrive) -> WaveShaperNode (Input Envelope Follower) -> AudioParam (gain as input)
          this.driveInput.connect(this.inputShaper);
          this.inputShaper.connect(this.inputGain.gain);

          // ConstantSourceNode (Input as OverDrive) -> WaveShaperNode (Output Envelope Follower) -> AudioParam (gain as output)
          this.driveInput.connect(this.outputShaper);
          this.outputShaper.connect(this.outputGain.gain);

          break;
        }

        case 'warm': {
          this.shaper.curve = OverDrive.createOverdriveCurve(this.drive, this.numberOfSamples, true);

          // GainNode (Input) > WaveShaperNode (OverDrive) -> GainNode (OverDrive Level) -> GainNode (Output)
          this.input.connect(this.shaper);
          this.shaper.connect(this.level);
          this.level.connect(this.output);

          break;
        }

        case 'crunch': {
          this.shaper.curve = OverDrive.createOverdriveCurve(this.drive, this.numberOfSamples, false);

          // GainNode (Input) > WaveShaperNode (OverDrive) -> GainNode (OverDrive Level) -> GainNode (Output)
          this.input.connect(this.shaper);
          this.shaper.connect(this.level);
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
  public param(params: 'numberOfSamples'): number;
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
          return this.drive;
        }

        case 'level': {
          return this.level.gain.value;
        }

        case 'numberOfSamples': {
          return this.numberOfSamples;
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
            if ((value === 'natural') || (value === 'warm') || (value === 'crunch')) {
              this.type = value;

              this.connect();
            }
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

        case 'numberOfSamples': {
          if (typeof value === 'number') {
            this.numberOfSamples = value;
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
      state          : this.isActive,
      type           : this.type,
      drive          : this.drive,
      level          : this.level.gain.value,
      numberOfSamples: this.numberOfSamples,
      oversample     : this.shaper.oversample
    };
  }
}
