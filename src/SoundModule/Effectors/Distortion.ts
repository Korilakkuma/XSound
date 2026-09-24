import { Effector } from './Effector';

export type DistortionType = 'distortion' | 'metal' | 'core';

export type DistortionCurve = Float32Array<ArrayBuffer> | null;

export type DistortionParams = {
  state?: boolean,
  type?: DistortionType,
  drive?: number,
  level?: number,
  oversample?: OverSampleType
  bass?: number,
  middle?: number,
  treble?: number
};

/**
 * Effector's subclass for Distortion.
 */
export class Distortion extends Effector {
  private type: DistortionType = 'distortion';

  private shaper: WaveShaperNode;
  private drive: GainNode;
  private level: GainNode;

  private preLowCut: BiquadFilterNode;
  private preMiddle: BiquadFilterNode;

  private postBass: BiquadFilterNode;
  private postMiddle: BiquadFilterNode;
  private postTreble: BiquadFilterNode;
  private postHighCut: BiquadFilterNode;

  /**
   * This static method creates instance of `Float32Array` for `WaveShaperNode`.
   * @param {number} drive This argument is drive level.
   * @param {number} numberOfSamples This argument is curve size. The default is `1024`.
   * @return {Float32Array|null} Return value is `WaveShaperNode`'s 'curve'.
   */
  public static createDistortionCurve(amount: number = 500, numberOfSamples: number = 48000): DistortionCurve {
    const curve = new Float32Array(numberOfSamples);

    const deg = Math.PI / 180;

    for (let n = 0; n < numberOfSamples; n++) {
      const x = ((n * 2) / numberOfSamples) - 1;

      curve[n] = ((3 + amount) * x * 20 * deg) / (Math.PI + (amount * Math.abs(x)));
    }

    return curve;
  }

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   */
  constructor(context: AudioContext) {
    super(context);

    this.shaper = this.context.createWaveShaper();
    this.drive  = this.context.createGain();
    this.level  = this.context.createGain();

    this.preLowCut = this.context.createBiquadFilter();
    this.preMiddle = this.context.createBiquadFilter();

    this.postBass    = this.context.createBiquadFilter();
    this.postMiddle  = this.context.createBiquadFilter();
    this.postTreble  = this.context.createBiquadFilter();
    this.postHighCut = this.context.createBiquadFilter();

    // Initialize parameters
    const curve = Distortion.createDistortionCurve();

    this.shaper.curve       = curve;
    this.shaper.oversample  = '4x';

    this.drive.gain.value = 0;
    this.level.gain.value = 1;

    this.preLowCut.type   = 'highpass';
    this.preMiddle.type   = 'peaking';
    this.postBass.type    = 'lowshelf';
    this.postMiddle.type  = 'peaking';
    this.postTreble.type  = 'highshelf';
    this.postHighCut.type = 'lowpass';

    this.preLowCut.frequency.value   = 250;
    this.preMiddle.frequency.value   = 1000;
    this.postBass.frequency.value    = 100;
    this.postMiddle.frequency.value  = 500;
    this.postTreble.frequency.value  = 5000;
    this.postHighCut.frequency.value = 6500;

    this.preLowCut.Q.value   = Math.SQRT1_2;
    this.preMiddle.Q.value   = Math.SQRT1_2;
    this.postBass.Q.value    = Math.SQRT1_2;  // Not used
    this.postMiddle.Q.value  = 1.5;
    this.postTreble.Q.value  = Math.SQRT1_2;  // Not used
    this.postHighCut.Q.value = Math.SQRT1_2;

    this.preLowCut.gain.value   = 0;  // Not used
    this.preMiddle.gain.value   = 0;
    this.postBass.gain.value    = 0;
    this.postMiddle.gain.value  = 0;
    this.postTreble.gain.value  = 0;
    this.postHighCut.gain.value = 0;  // Not used

    // `Distortion` is not connected by default
    this.deactivate();
  }

  /** @override */
  public override connect(): GainNode {
    // Clear connection
    this.input.disconnect(0);
    this.drive.disconnect(0);
    this.shaper.disconnect(0);
    this.level.disconnect(0);
    this.preLowCut.disconnect(0);
    this.preMiddle.disconnect(0);
    this.postBass.disconnect(0);
    this.postMiddle.disconnect(0);
    this.postTreble.disconnect(0);
    this.postHighCut.disconnect(0);

    if (this.isActive && (this.drive.gain.value > 0)) {
      // Effect ON
      switch (this.type) {
        case 'distortion': {
          this.shaper.curve = Distortion.createDistortionCurve(500 * this.drive.gain.value);

          this.preLowCut.frequency.value = 250;

          this.postMiddle.frequency.value = 800;
          this.postMiddle.Q.value         = 0.7;

          this.postHighCut.frequency.value = 4500;

          // GainNode (Input) > BiquadFilterNode (Low Cut) -> GainNode (Drive) -> WaveShaperNode (Distortion) -> BiquadFilterNode (Tone) -> BiquadFilterNode (High Cut) -> GainNode (Level) -> GainNode (Output)
          this.input.connect(this.preLowCut);
          this.preLowCut.connect(this.drive);
          this.drive.connect(this.shaper);
          this.shaper.connect(this.postMiddle);
          this.postMiddle.connect(this.postHighCut);
          this.postHighCut.connect(this.level);
          this.level.connect(this.output);

          break;
        }

        case 'metal': {
          this.shaper.curve = Distortion.createDistortionCurve(1000 * this.drive.gain.value);

          this.preLowCut.frequency.value = 150;
          this.preLowCut.Q.value         = Math.SQRT1_2;

          this.preMiddle.frequency.value = 1000;
          this.preMiddle.Q.value         = 1.0;
          this.preMiddle.gain.value      = 12;

          this.postBass.frequency.value   = 100;
          this.postTreble.frequency.value = 5000;
          this.postMiddle.frequency.value = 500;
          this.postMiddle.Q.value         = 1.5;

          this.postHighCut.frequency.value = 6500;

          // GainNode (Input) > BiquadFilterNode (Low Cut) -> BiquadFilterNode (Pre Middle Booster) -> GainNode (Drive) -> WaveShaperNode (Distortion) -> BiquadFilterNode (Bass) -> BiquadFilterNode (Middle) -> BiquadFilterNode (Treble) -> BiquadFilterNode (High Cut) -> GainNode (Level) -> GainNode (Output)
          this.input.connect(this.preLowCut);
          this.preLowCut.connect(this.preMiddle);
          this.preMiddle.connect(this.drive);
          this.drive.connect(this.shaper);
          this.shaper.connect(this.postBass);
          this.postBass.connect(this.postMiddle);
          this.postMiddle.connect(this.postTreble);
          this.postTreble.connect(this.postHighCut);
          this.postHighCut.connect(this.level);
          this.level.connect(this.output);

          break;
        }

        case 'core': {
          this.shaper.curve = Distortion.createDistortionCurve(1000 * this.drive.gain.value);

          this.preLowCut.frequency.value = 90;
          this.preLowCut.Q.value         = 0.7;

          this.preMiddle.frequency.value = 2500;
          this.preMiddle.Q.value         = 1.2;
          this.preMiddle.gain.value      = 6;

          this.postBass.frequency.value   = 120;
          this.postTreble.frequency.value = 4500;
          this.postMiddle.frequency.value = 600;
          this.postMiddle.Q.value         = 1;

          this.postHighCut.frequency.value = 7500;

          // GainNode (Input) > BiquadFilterNode (Low Cut) -> BiquadFilterNode (Pre Middle Booster) -> GainNode (Drive) -> WaveShaperNode (Distortion) -> BiquadFilterNode (Bass) -> BiquadFilterNode (Middle) -> BiquadFilterNode (Treble) -> BiquadFilterNode (High Cut) -> GainNode (Level) -> GainNode (Output)
          this.input.connect(this.preLowCut);
          this.preLowCut.connect(this.preMiddle);
          this.preMiddle.connect(this.drive);
          this.drive.connect(this.shaper);
          this.shaper.connect(this.postBass);
          this.postBass.connect(this.postMiddle);
          this.postMiddle.connect(this.postTreble);
          this.postTreble.connect(this.postHighCut);
          this.postHighCut.connect(this.level);
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
   * This method gets or sets parameters for distortion effector.
   * This method is overloaded for type interface and type check.
   * @param {keyof DistortionParams|DistortionParams} params This argument is string if getter. Otherwise, setter.
   * @return {DistortionParams[keyof DistortionParams]|Distortion} Return value is parameter for distortion effector if getter.
   *     Otherwise, return value is for method chain.
   */
  public param(params: 'state'): boolean;
  public param(params: 'type'): DistortionType;
  public param(params: 'drive'): number;
  public param(params: 'level'): number;
  public param(params: 'oversample'): OverSampleType;
  public param(params: 'bass'): number;
  public param(params: 'middle'): number;
  public param(params: 'treble'): number;
  public param(params: DistortionParams): Distortion;
  public param(params: keyof DistortionParams | DistortionParams): DistortionParams[keyof DistortionParams] | Distortion {
    if (typeof params === 'string') {
      switch (params) {
        case 'state': {
          return this.isActive;
        }

        case 'type': {
          return this.type;
        }

        case 'drive': {
          return this.drive.gain.value / 10;
        }

        case 'level': {
          return this.level.gain.value;
        }

        case 'oversample': {
          return this.shaper.oversample;
        }

        case 'bass': {
          return this.postBass.gain.value;
        }

        case 'middle': {
          return this.postMiddle.gain.value;
        }

        case 'treble': {
          return this.postTreble.gain.value;
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
            if ((value === 'distortion') || (value === 'metal') || (value === 'core')) {
              this.type = value;

              this.connect();
            }
          }

          break;
        }

        case 'drive': {
          if (typeof value === 'number') {
            this.drive.gain.value = 10 * value;

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

        case 'bass': {
          if (typeof value === 'number') {
            this.postBass.gain.value = value;
          }

          break;
        }

        case 'middle': {
          if (typeof value === 'number') {
            this.postMiddle.gain.value = value;
          }

          break;
        }

        case 'treble': {
          if (typeof value === 'number') {
            this.postTreble.gain.value = value;
          }

          break;
        }
      }
    }

    return this;
  }

  /** @override */
  public override params(): Required<DistortionParams> {
    return {
      state     : this.isActive,
      type      : this.type,
      drive     : this.drive.gain.value / 10,
      level     : this.level.gain.value,
      oversample: this.shaper.oversample,
      bass      : this.postBass.gain.value,
      middle    : this.postMiddle.gain.value,
      treble    : this.postTreble.gain.value
    };
  }
}
