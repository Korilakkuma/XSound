import type { FilterParams } from '../../../../types';
import type { PreampCurve } from '../../AmpSimulator';

import { Effector } from '../../Effector';

export type PreEqualizerParams = {
  state?: boolean,
  curve?: PreampCurve,
  oversample?: OverSampleType,
  gain?: number,
  lead?: number
};

export type PostEqualizerParams = {
  state?: boolean,
  curve?: PreampCurve,
  oversample?: OverSampleType,
  bass?: number,
  middle?: number,
  treble?: number,
  presence?: number,
  frequency?: number
};

export type PreEqualizerFilterParams = {
  lowpass: Required<FilterParams>,
  highpasses: [Required<FilterParams>, Required<FilterParams>, Required<FilterParams>]
};

export type PostEqualizerFilterParams = {
  bass: Required<FilterParams>,
  middle: Required<FilterParams>,
  treble: Required<FilterParams>,
  lowpass: Required<FilterParams>,
  highpass: Required<FilterParams>
};

/**
 * Effector's subclass for Pre-Equalizer.
 */
export class PreEqualizer extends Effector {
  private shaper: WaveShaperNode;
  private preGain: GainNode;
  private leadGain: GainNode;
  private lowpass: BiquadFilterNode;
  private highpass1: BiquadFilterNode;
  private highpass2: BiquadFilterNode;
  private highpass3: BiquadFilterNode;

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   * @param {PreEqualizerFilterParams} filterParams This argument is.
   */
  constructor(context: AudioContext, filterParams: PreEqualizerFilterParams) {
    super(context);

    this.shaper = context.createWaveShaper();

    this.preGain  = context.createGain();
    this.leadGain = context.createGain();

    this.lowpass   = context.createBiquadFilter();
    this.highpass1 = context.createBiquadFilter();
    this.highpass2 = context.createBiquadFilter();
    this.highpass3 = context.createBiquadFilter();

    // Initialize parameters
    this.shaper.oversample = '4x';

    this.preGain.gain.value  = 0.5;
    this.leadGain.gain.value = 0.5;

    this.lowpass.type            = 'lowpass';
    this.lowpass.frequency.value = filterParams.lowpass.frequency;
    this.lowpass.Q.value         = filterParams.lowpass.Q;
    this.lowpass.gain.value      = 0;  // Not used

    this.highpass1.type            = 'highpass';
    this.highpass1.frequency.value = filterParams.highpasses[0].frequency;
    this.highpass1.Q.value         = filterParams.highpasses[0].Q;
    this.highpass1.gain.value      = 0;  // Not used

    this.highpass2.type            = 'highpass';
    this.highpass2.frequency.value = filterParams.highpasses[1].frequency;
    this.highpass2.Q.value         = filterParams.highpasses[1].Q;
    this.highpass2.gain.value      = 0;  // Not used

    this.highpass3.type            = 'highpass';
    this.highpass3.frequency.value = filterParams.highpasses[2].frequency;
    this.highpass3.Q.value         = filterParams.highpasses[2].Q;;
    this.highpass3.gain.value      = 0;  // Not used

    // `PreEqualizer` is not connected by default
    this.deactivate();
  }

  /** @override */
  public override connect(): GainNode {
    this.input.disconnect(0);

    if (this.isActive) {
      // Effect ON

      // GainNode (Input) -> BiquadFilterNode (High-pass) -> BiquadFilterNode (Low-pass) -> GainNode (Pre-gain) -> BiquadFilterNode (High-pass)
      this.input.connect(this.highpass1);
      this.highpass1.connect(this.lowpass);
      this.lowpass.connect(this.preGain);
      this.preGain.connect(this.highpass3);

      // GainNode (Input) -> BiquadFilterNode (High-pass) -> GainNode (Lead-gain) -> BiquadFilterNode (High-pass)
      this.input.connect(this.highpass2);
      this.highpass2.connect(this.leadGain);
      this.leadGain.connect(this.highpass3);

      // BiquadFilterNode (High-pass) -> WaveShaperNode (Clipping) -> GainNode (Output)
      this.highpass3.connect(this.shaper);
      this.shaper.connect(this.output);
    } else {
      // Effect OFF

      // GainNode (Input) -> GainNode (Output)
      this.input.connect(this.output);
    }

    return this.output;
  }

  /**
   * This method gets or sets parameters for pre-equalizer.
   * This method is overloaded for type interface and type check.
   * @param {keyof PreEqualizerParams|PreEqualizerParams} params This argument is string if getter. Otherwise, setter.
   * @return {PreEqualizerParams[keyof PreEqualizerParams]} Return value is parameter for pre-equalizer if getter.
   */
  public param(params: 'state'): boolean;
  public param(params: 'curve'): PreampCurve;
  public param(params: 'oversample'): OverSampleType;
  public param(params: 'gain'): number;
  public param(params: 'lead'): number;
  public param(params: PreEqualizerParams): void;
  public param(params: keyof PreEqualizerParams | PreEqualizerParams): PreEqualizerParams[keyof PreEqualizerParams] | void {
    if (typeof params === 'string') {
      switch (params) {
        case 'state': {
          return this.isActive;
        }

        case 'curve': {
          return this.shaper.curve;
        }

        case 'oversample': {
          return this.shaper.curve;
        }

        case 'gain': {
          return this.preGain.gain.value;
        }

        case 'lead': {
          return this.leadGain.gain.value;
        }
      }
    }

    for (const [key, value] of Object.entries(params)) {
      switch (key) {
        case 'state': {
          if (typeof value === 'boolean') {
            if (value) {
              this.activate();
            } else {
              this.deactivate();
            }
          }

          break;
        }

        case 'curve': {
          if ((typeof value !== 'number') && (typeof value !== 'boolean')) {
            if ((value instanceof Float32Array) || (value === null)) {
              this.shaper.curve = value;
            }
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

        case 'gain': {
          if (typeof value === 'number') {
            this.preGain.gain.value = value;
          }

          break;
        }

        case 'lead': {
          if (typeof value === 'number') {
            this.leadGain.gain.value = value;
          }

          break;
        }
      }
    }
  }

  /** @override */
  public override params(): Required<PreEqualizerParams> {
    return {
      state     : this.isActive,
      curve     : this.shaper.curve,
      gain      : this.preGain.gain.value,
      lead      : this.leadGain.gain.value,
      oversample: this.shaper.oversample
    };
  }
}

/**
 * Effector's subclass for Post-Equalizer.
 */
export class PostEqualizer extends Effector {
  private shaper: WaveShaperNode;

  private bass: BiquadFilterNode;
  private middle: BiquadFilterNode;
  private treble: BiquadFilterNode;
  private presence: BiquadFilterNode;

  private lowpass: BiquadFilterNode;
  private highpass: BiquadFilterNode;

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   * @param {PostEqualizerFilterParams} filterParams This argument is.
   */
  constructor(context: AudioContext, filterParams: PostEqualizerFilterParams) {
    super(context);

    this.shaper = context.createWaveShaper();

    this.bass     = context.createBiquadFilter();
    this.middle   = context.createBiquadFilter();
    this.treble   = context.createBiquadFilter();
    this.presence = context.createBiquadFilter();

    // Initialize parameters
    this.shaper.oversample = '4x';

    this.bass.type     = 'lowshelf';
    this.middle.type   = 'peaking';
    this.treble.type   = 'highshelf';
    this.presence.type = 'peaking';

    // Set cutoff frequency
    this.bass.frequency.value     = filterParams.bass.frequency;
    this.middle.frequency.value   = filterParams.middle.frequency;
    this.treble.frequency.value   = filterParams.treble.frequency;
    this.presence.frequency.value = 4000;

    // Set Q
    this.bass.Q.value     = 0;  // Not used
    this.middle.Q.value   = filterParams.middle.Q;
    this.treble.Q.value   = 0;  // Not used
    this.presence.Q.value = 0.7;

    // Set Gain
    this.bass.gain.value     = 0;
    this.middle.gain.value   = 0;
    this.treble.gain.value   = 0;
    this.presence.gain.value = 0;

    this.lowpass  = context.createBiquadFilter();
    this.highpass = context.createBiquadFilter();

    this.lowpass.type            = 'lowpass';
    this.lowpass.frequency.value = filterParams.lowpass.frequency;
    this.lowpass.Q.value         = filterParams.lowpass.Q;
    this.lowpass.gain.value      = 0;  // Not used

    this.highpass.type            = 'highpass';
    this.highpass.frequency.value = filterParams.highpass.frequency;
    this.highpass.Q.value         = filterParams.highpass.Q;
    this.highpass.gain.value      = 0;  // Not used

    // `PostEqualizer` is not connected by default
    this.deactivate();
  }

  /** @override */
  public override connect(): GainNode {
    this.input.disconnect(0);

    if (this.isActive) {
      // Effect ON

      // GainNode (Input) -> BiquadFilterNode (Low-pass) -> BiquadFilterNode (High-pass) -> WaveShaperNode (Clipping) -> BiquadFilterNode (Bass: Low-shelving) -> BiquadFilterNode (Middle: Peaking) -> BiquadFilterNode (Treble: High-shelving) -> BiquadFilterNode (Presence: Peaking) -> GainNode (Output)
      this.input.connect(this.lowpass);
      this.lowpass.connect(this.highpass);
      this.highpass.connect(this.shaper);
      this.shaper.connect(this.bass);
      this.bass.connect(this.middle);
      this.middle.connect(this.treble);
      this.treble.connect(this.presence);
      this.presence.connect(this.output);
    } else {
      // Effect OFF

      // GainNode (Input) -> GainNode (Output)
      this.input.connect(this.output);
    }

    return this.output;
  }

  /**
   * This method gets or sets parameters for post-equalizer.
   * This method is overloaded for type interface and type check.
   * @param {keyof PostEqualizerParams|PostEqualizerParams} params This argument is string if getter. Otherwise, setter.
   * @return {PostEqualizerParams[keyof PostEqualizerParams]} Return value is parameter for post-equalizer if getter.
   */
  public param(params: 'state'): boolean;
  public param(params: 'curve'): PreampCurve;
  public param(params: 'oversample'): OverSampleType;
  public param(params: 'bass'): number;
  public param(params: 'middle'): number;
  public param(params: 'treble'): number;
  public param(params: 'presence'): number;
  public param(params: 'frequency'): number;
  public param(params: PostEqualizerParams): void;
  public param(params: keyof PostEqualizerParams | PostEqualizerParams): PostEqualizerParams[keyof PostEqualizerParams] | void {
    if (typeof params === 'string') {
      switch (params) {
        case 'state': {
          return this.isActive;
        }

        case 'curve': {
          return this.shaper.curve;
        }

        case 'oversample': {
          return this.shaper.oversample;
        }

        case 'bass': {
          return this.bass.gain.value;
        }

        case 'middle': {
          return this.middle.gain.value;
        }

        case 'treble': {
          return this.treble.gain.value;
        }

        case 'presence': {
          return this.presence.gain.value;
        }

        case 'frequency': {
          return this.middle.frequency.value;
        }
      }
    }

    for (const [key, value] of Object.entries(params)) {
      switch (key) {
        case 'state': {
          if (typeof value === 'boolean') {
            if (value) {
              this.activate();
            } else {
              this.deactivate();
            }
          }

          break;
        }

        case 'curve': {
          if ((typeof value !== 'number') && (typeof value !== 'boolean')) {
            if ((value instanceof Float32Array) || (value === null)) {
              this.shaper.curve = value;
            }
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
            this.bass.gain.value = value;
          }

          break;
        }

        case 'middle': {
          if (typeof value === 'number') {
            this.middle.gain.value = value;
          }

          break;
        }

        case 'treble': {
          if (typeof value === 'number') {
            this.treble.gain.value = value;
          }

          break;
        }

        case 'presence': {
          if (typeof value === 'number') {
            this.presence.gain.value = value;
          }

          break;
        }

        case 'frequency': {
          if (typeof value === 'number') {
            this.middle.frequency.value = value;
          }

          break;
        }
      }
    }
  }

  /** @override */
  public override params(): Required<PostEqualizerParams> {
    return {
      state     : this.isActive,
      curve     : this.shaper.curve,
      oversample: this.shaper.oversample,
      bass      : this.bass.gain.value,
      middle    : this.middle.gain.value,
      treble    : this.treble.gain.value,
      presence  : this.presence.gain.value,
      frequency : this.middle.frequency.value
    };
  }
}
