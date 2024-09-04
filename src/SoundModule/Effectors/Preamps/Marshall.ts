import type { PreampCurve } from '../Preamp';
import type { CabinetParams } from './Cabinet';

import { Effector } from '../Effector';
import { createCurve } from '../Preamp';
import { Cabinet } from './Cabinet';

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
  frequency?: number
};

export type MarshallParams = {
  state?: boolean,
  level?: number,
  samples?: number,
  pre?: PreEqualizerParams,
  post?: PostEqualizerParams,
  cabinet?: CabinetParams
};

/**
 * Effector's subclass for Pre-Equalizer.
 */
class PreEqualizer extends Effector {
  private shaper: WaveShaperNode;
  private preGain: GainNode;
  private leadGain: GainNode;
  private lowpass: BiquadFilterNode;
  private highpass1: BiquadFilterNode;
  private highpass2: BiquadFilterNode;
  private highpass3: BiquadFilterNode;

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   */
  constructor(context: AudioContext) {
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
    this.lowpass.frequency.value = 3200;
    this.lowpass.Q.value         = -3;
    this.lowpass.gain.value      = 0;  // Not used

    this.highpass1.type            = 'highpass';
    this.highpass1.frequency.value = 80;
    this.highpass1.Q.value         = -3;
    this.highpass1.gain.value      = 0;  // Not used

    this.highpass2.type            = 'highpass';
    this.highpass2.frequency.value = 640;
    this.highpass2.Q.value         = -3;
    this.highpass2.gain.value      = 0;  // Not used

    this.highpass3.type            = 'highpass';
    this.highpass3.frequency.value = 80;
    this.highpass3.Q.value         = -3;
    this.highpass3.gain.value      = 0;  // Not used

    // `PreEqualizer` is not connected by default
    this.deactivate();
  }

  /** @override */
  public override connect(): GainNode {
    this.input.disconnect(0);

    if (this.isActive) {
      // Effect ON

      // GainNode (Input) -> BiquadFilterNode (High-pass) -> GainNode (Pre-gain) -> BiquadFilterNode (High-pass) -> GainNode (Output)
      this.input.connect(this.highpass1);
      this.highpass1.connect(this.preGain);
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
  public param(params: 'curve'): Float32Array | null;
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
class PostEqualizer extends Effector {
  private shaper: WaveShaperNode;

  private bass: BiquadFilterNode;
  private middle: BiquadFilterNode;
  private treble: BiquadFilterNode;

  private lowpass: BiquadFilterNode;
  private highpass: BiquadFilterNode;

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   */
  constructor(context: AudioContext) {
    super(context);

    this.shaper = context.createWaveShaper();

    this.bass   = context.createBiquadFilter();
    this.middle = context.createBiquadFilter();
    this.treble = context.createBiquadFilter();

    // Initialize parameters
    this.shaper.oversample = '4x';

    this.bass.type   = 'lowshelf';
    this.middle.type = 'peaking';
    this.treble.type = 'highshelf';

    // Set cutoff frequency
    this.bass.frequency.value   = 240;  // 240 Hz
    this.middle.frequency.value = 500;  // 500 Hz
    this.treble.frequency.value = 1600; // 1.6 kHz

    // Set Q
    this.bass.Q.value   = Math.SQRT1_2;
    this.middle.Q.value = Math.SQRT1_2;
    this.treble.Q.value = Math.SQRT1_2;

    // Set Gain
    this.bass.gain.value   = 0;
    this.middle.gain.value = 0;
    this.treble.gain.value = 0;

    this.lowpass  = context.createBiquadFilter();
    this.highpass = context.createBiquadFilter();

    this.lowpass.type            = 'lowpass';
    this.lowpass.frequency.value = 20000;
    this.lowpass.Q.value         = -3;
    this.lowpass.gain.value      = 0;  // Not used

    this.highpass.type            = 'highpass';
    this.highpass.frequency.value = 40;
    this.highpass.Q.value         = -3;
    this.highpass.gain.value      = 0;  // Not used

    // `PostEqualizer` is not connected by default
    this.deactivate();
  }

  /** @override */
  public override connect(): GainNode {
    this.input.disconnect(0);

    if (this.isActive) {
      // Effect ON

      // GainNode (Input) -> BiquadFilterNode (Low-pass) -> BiquadFilterNode (High-pass) -> WaveShaperNode (Clipping) -> BiquadFilterNode (Bass: Low-shelving) -> BiquadFilterNode (Middle: Peaking) -> BiquadFilterNode (Treble: High-shelving) -> GainNode (Output)
      this.input.connect(this.lowpass);
      this.lowpass.connect(this.highpass);
      this.highpass.connect(this.shaper);
      this.shaper.connect(this.bass);
      this.bass.connect(this.middle);
      this.middle.connect(this.treble);
      this.treble.connect(this.output);
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
  public param(params: 'curve'): Float32Array | null;
  public param(params: 'oversample'): OverSampleType;
  public param(params: 'bass'): number;
  public param(params: 'middle'): number;
  public param(params: 'treble'): number;
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
      frequency : this.middle.frequency.value
    };
  }
}

/**
 * Effector's subclass for Preamplifier (Marshall).
 */
export class Marshall extends Effector {
  private preEQ: PreEqualizer;
  private postEQ: PostEqualizer;
  private cabinet: Cabinet;

  // for creating curve
  private level           = 0;
  private numberOfSamples = 1024;

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   */
  constructor(context: AudioContext) {
    super(context);

    this.preEQ   = new PreEqualizer(context);
    this.postEQ  = new PostEqualizer(context);
    this.cabinet = new Cabinet(context);

    // `Preamp` is not connected by default
    this.deactivate();
  }

  /** @override */
  public override connect(): GainNode {
    // Clear connection
    this.input.disconnect(0);

    if (this.isActive) {
      // Effect ON

      // GainNode (Input) -> Pre-Equalizer -> Post-Equalizer -> Cabinet -> GainNode (Output)
      this.input.connect(this.preEQ.INPUT);
      this.preEQ.OUTPUT.connect(this.postEQ.INPUT);
      this.postEQ.OUTPUT.connect(this.cabinet.INPUT);
      this.cabinet.OUTPUT.connect(this.output);
    } else {
      // Effect OFF

      // GainNode (Input) -> GainNode (Output)
      this.input.connect(this.output);
    }

    return this.output;
  }

  /**
   * This method gets or sets parameters for preamp effector.
   * This method is overloaded for type interface and type check.
   * @param {keyof MarshallParams|MarshallParams} params This argument is string if getter. Otherwise, setter.
   * @return {MarshallParams[keyof MarshallParams]|Marshall} Return value is parameter for preamp effector if getter.
   *     Otherwise, return value is for method chain.
   */
  public param(params: 'state'): boolean;
  public param(params: 'level'): number;
  public param(params: 'samples'): number;
  public param(params: 'pre'): MarshallParams['pre'];
  public param(params: 'post'): MarshallParams['post'];
  public param(params: 'cabinet'): CabinetParams;
  public param(params: MarshallParams): Marshall;
  public param(params: keyof MarshallParams | MarshallParams): MarshallParams[keyof MarshallParams] | Marshall {
    if (typeof params === 'string') {
      switch (params) {
        case 'state': {
          return this.isActive;
        }

        case 'level': {
          return this.level;
        }

        case 'samples': {
          return this.numberOfSamples;
        }

        case 'pre': {
          return this.preEQ.params();
        }

        case 'post': {
          return this.postEQ.params();
        }

        case 'cabinet': {
          return this.cabinet.params();
        }
      }
    }

    for (const [key, value] of Object.entries(params)) {
      switch (key) {
        case 'state': {
          if (typeof value === 'boolean') {
            if (value) {
              this.activate();
              this.preEQ.activate();
              this.postEQ.activate();
            } else {
              this.deactivate();
              this.preEQ.deactivate();
              this.postEQ.deactivate();
            }
          }

          break;
        }

        case 'level': {
          if (typeof value === 'number') {
            this.level = value;

            const curve = createCurve(this.level, this.numberOfSamples);

            this.preEQ.param({ curve });
            this.postEQ.param({ curve });
          }

          break;
        }

        case 'samples': {
          if (typeof value === 'number') {
            this.numberOfSamples = value;

            const curve = createCurve(this.level, this.numberOfSamples);

            this.preEQ.param({ curve });
            this.postEQ.param({ curve });
          }

          break;
        }

        case 'pre': {
          if (typeof value === 'object') {
            this.preEQ.param(value);
          }

          break;
        }

        case 'post': {
          if (typeof value === 'object') {
            this.postEQ.param(value);
          }

          break;
        }

        case 'cabinet': {
          if (typeof value === 'object') {
            this.cabinet.param(value);
          }

          break;
        }
      }
    }

    return this;
  }

  /** @override */
  public override params(): Required<MarshallParams> {
    return {
      state  : this.isActive,
      level  : this.level,
      samples: this.numberOfSamples,
      pre    : this.preEQ.params(),
      post   : this.postEQ.params(),
      cabinet: this.cabinet.params()
    };
  }

  /** @override */
  public override activate(): Marshall {
    super.activate();
    return this;
  }

  /** @override */
  public override deactivate(): Marshall {
    super.deactivate();
    return this;
  }
}
