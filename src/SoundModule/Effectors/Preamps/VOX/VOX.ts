import type { PreampCurve } from '../../AmpSimulator';

import { Effector } from '../../Effector';

export type PreEqualizerParams = {
  state?: boolean,
  curve?: PreampCurve,
  oversample?: OverSampleType,
  gain?: number
};

export type PostEqualizerParams = {
  state?: boolean,
  curve?: PreampCurve,
  oversample?: OverSampleType,
  bass?: number,
  treble?: number,
  tone?: number
};

/**
 * Effector's subclass for Pre-Equalizer.
 */
export class PreEqualizer extends Effector {
  private shaper: WaveShaperNode;
  private preGain: GainNode;
  private highpass: BiquadFilterNode;
  private lowpass: BiquadFilterNode;

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   */
  constructor(context: AudioContext) {
    super(context);

    this.shaper = context.createWaveShaper();

    this.preGain = context.createGain();

    this.highpass = context.createBiquadFilter();
    this.lowpass  = context.createBiquadFilter();

    this.shaper.oversample = '4x';

    this.preGain.gain.value = 0.5;

    this.highpass.type            = 'highpass';
    this.highpass.frequency.value = 160;
    this.highpass.Q.value         = 1.0;

    this.lowpass.type            = 'lowpass';
    this.lowpass.frequency.value = 5000;
    this.lowpass.Q.value         = -3;

    // `PreEqualizer` is not connected by default
    this.deactivate();
  }

  /** @override */
  public override connect(): GainNode {
    this.input.disconnect(0);

    if (this.isActive) {
      // Effect ON

      // GainNode (Input) -> BiquadFilterNode (High-pass) -> BiquadFilterNode (Low-pass) -> GainNode (Pre-gain) -> WaveShaperNode (Clipping) -> (Output)
      this.input.connect(this.highpass);
      this.highpass.connect(this.lowpass);
      this.lowpass.connect(this.preGain);
      this.preGain.connect(this.shaper);
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
          return this.shaper.oversample;
        }

        case 'gain': {
          return this.preGain.gain.value;
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
      }
    }
  }

  /** @override */
  public override params(): Required<PreEqualizerParams> {
    return {
      state     : this.isActive,
      curve     : this.shaper.curve,
      gain      : this.preGain.gain.value,
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
  private treble: BiquadFilterNode;

  private tone: BiquadFilterNode;

  private toneValue = 0;

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   */
  constructor(context: AudioContext) {
    super(context);

    this.shaper = context.createWaveShaper();

    this.bass   = context.createBiquadFilter();
    this.treble = context.createBiquadFilter();

    this.tone = context.createBiquadFilter();

    // Initialize parameters
    this.shaper.oversample = '4x';

    this.bass.type   = 'lowshelf';
    this.treble.type = 'highshelf';

    this.bass.frequency.value   = 120;
    this.treble.frequency.value = 2500;

    this.bass.gain.value   = 0;
    this.treble.gain.value = 0;

    this.tone.type            = 'lowpass';
    this.tone.frequency.value = 10000;
    this.tone.Q.value         = 0.5;

    // `PostEqualizer` is not connected by default
    this.deactivate();
  }

  /** @override */
  public override connect(): GainNode {
    this.input.disconnect(0);

    if (this.isActive) {
      // GainNode (Input) -> WaveShaperNode (Clipping) -> BiquadFilterNode (Bass) -> BiquadFilterNode (Treble) -> BiquadFilterNode (Tone) -> GainNode (Output)
      this.input.connect(this.shaper);
      this.shaper.connect(this.bass);
      this.bass.connect(this.treble);
      this.treble.connect(this.tone);
      this.tone.connect(this.output);
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
  public param(params: 'treble'): number;
  public param(params: 'tone'): number;
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

        case 'treble': {
          return this.treble.gain.value;
        }

        case 'tone': {
          return this.toneValue;
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

        case 'treble': {
          if (typeof value === 'number') {
            this.treble.gain.value = value;
          }

          break;
        }

        case 'tone': {
          if (typeof value === 'number') {
            this.toneValue = Math.max(0, Math.min(10, value));

            const cutoff = 10000 - (this.toneValue / 10) * 9200;

            this.tone.frequency.value = Math.max(800, cutoff);
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
      treble    : this.treble.gain.value,
      tone      : this.toneValue
    };
  }
}
