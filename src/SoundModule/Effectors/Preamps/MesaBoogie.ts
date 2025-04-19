import type { CabinetParams } from './Cabinet';

import { Effector } from '../Effector';
import { createCurve } from '../Preamp';
import { Cabinet } from './Cabinet';

export type PreEqualizerParams = {
  state?: boolean,
  gain?: number,
  bass?: number,
  middle?: number,
  treble?: number,
  level?: number,
  samples?: number,
  oversample?: OverSampleType,
  postFilters?: boolean
};

export type PostEqualizerParams = {
  state?: boolean,
  fc100?: number,
  fc360?: number,
  fc720?: number,
  fc1600?: number,
  fc4800?: number
};

export type MesaBoogieParams = {
  state?: boolean,
  pre?: PreEqualizerParams,
  post?: PostEqualizerParams,
  cabinet?: CabinetParams
};

/**
 * Effector's subclass for Pre-Equalizer.
 */
class PreEqualizer extends Effector {
  private preGain: GainNode;

  private preHighpass: BiquadFilterNode;
  private postHighpass: BiquadFilterNode;

  private bass: BiquadFilterNode;
  private middle: BiquadFilterNode;
  private treble: BiquadFilterNode;

  private shapers: WaveShaperNode[] = [];

  // for creating curve
  private level           = 0;
  private numberOfSamples = 1024;

  // Optional filters
  private usePostFilters = true;
  private lowpass: BiquadFilterNode;
  private highpass: BiquadFilterNode;

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   */
  constructor(context: AudioContext) {
    super(context);

    this.preGain = context.createGain();

    // Initialize parameters
    this.preGain.gain.value = 0.5;

    this.preHighpass  = context.createBiquadFilter();
    this.postHighpass = context.createBiquadFilter();

    // Initialize parameters
    this.preHighpass.type  = 'highpass';
    this.postHighpass.type = 'highpass';

    this.preHighpass.frequency.value  = 40;  // 40 Hz
    this.postHighpass.frequency.value = 80;  // 80 Hz

    this.preHighpass.Q.value  = -3;
    this.postHighpass.Q.value = -3;

    this.bass   = context.createBiquadFilter();
    this.middle = context.createBiquadFilter();
    this.treble = context.createBiquadFilter();

    // Initialize parameters
    this.bass.type   = 'lowshelf';
    this.middle.type = 'peaking';
    this.treble.type = 'highshelf';

    // Set cutoff frequency
    this.bass.frequency.value   = 160;  // 160 Hz
    this.middle.frequency.value = 284;  // 284 Hz
    this.treble.frequency.value = 1200; // 1.2 kHz

    // Set Q
    this.middle.Q.value = 1.5;

    // Set Gain
    this.bass.gain.value   = 0;
    this.middle.gain.value = 0;
    this.treble.gain.value = 0;

    const curve = createCurve(this.level, this.numberOfSamples);

    // Initialize parameters
    for (let i = 0; i < 2; i++) {
      this.shapers[i] = context.createWaveShaper();

      this.shapers[i].curve      = curve;
      this.shapers[i].oversample = '4x';
    }

    this.lowpass  = context.createBiquadFilter();
    this.highpass = context.createBiquadFilter();

    // Initialize parameters
    this.lowpass.type  = 'lowpass';
    this.highpass.type = 'highpass';

    this.lowpass.frequency.value  = 4000;  // 4 kHz
    this.highpass.frequency.value = 40;  // 40 Hz

    this.lowpass.Q.value  = -3;
    this.highpass.Q.value = -3;

    // `PreEqualizer` is not connected by default
    this.deactivate();
  }

  /** @override */
  public override connect(): GainNode {
    this.input.disconnect(0);

    if (this.isActive) {
      // Effect ON

      // GainNode (Input) -> GainNode (Pre-gain) -> BiquadFilterNode (High-pass) -> BiquadFilterNode (Bass: Low-shelving) -> BiquadFilterNode (Middle: Peaking) -> BiquadFilterNode (Treble: High-shelving) -> WaveShaperNode (Clipping) -> BiquadFilterNode (Low-pass)
      this.input.connect(this.preGain);
      this.preGain.connect(this.preHighpass);
      this.preHighpass.connect(this.bass);
      this.bass.connect(this.middle);
      this.middle.connect(this.treble);
      this.treble.connect(this.postHighpass);
      this.postHighpass.connect(this.shapers[0]);

      if (this.usePostFilters) {
        // WaveShaperNode (Clipping) -> BiquadFilterNode (Low-pass) -> BiquadFilterNode (High-pass) -> WaveShaperNode (Clipping)
        this.shapers[0].connect(this.lowpass);
        this.lowpass.connect(this.highpass);
        this.highpass.connect(this.shapers[1]);
      } else {
        // WaveShaperNode (Clipping) -> WaveShaperNode (Clipping)
        this.shapers[0].connect(this.shapers[1]);
      }

      // WaveShaperNode (Clipping) -> GainNode (Output);
      this.shapers[1].connect(this.output);
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
  public param(params: 'gain'): number;
  public param(params: 'bass'): number;
  public param(params: 'middle'): number;
  public param(params: 'treble'): number;
  public param(params: 'level'): number;
  public param(params: 'samples'): number;
  public param(params: 'oversample'): OverSampleType;
  public param(params: 'postFilters'): boolean;
  public param(params: PreEqualizerParams): void;
  public param(params: keyof PreEqualizerParams | PreEqualizerParams): PreEqualizerParams[keyof PreEqualizerParams] | void {
    if (typeof params === 'string') {
      switch (params) {
        case 'state': {
          return this.isActive;
        }

        case 'gain': {
          return this.preGain.gain.value;
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

        case 'level': {
          return this.level;
        }

        case 'samples': {
          return this.numberOfSamples;
        }

        case 'oversample': {
          return this.shapers[0].oversample;
        }

        case 'postFilters': {
          return this.usePostFilters;
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

        case 'gain': {
          if (typeof value === 'number') {
            this.preGain.gain.value = value;
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

        case 'level': {
          if (typeof value === 'number') {
            this.level = value;

            const curve = createCurve(this.level, this.numberOfSamples);

            for (let i = 0; i < 2; i++) {
              this.shapers[i].curve = curve;
            }
          }

          break;
        }

        case 'samples': {
          if (typeof value === 'number') {
            this.numberOfSamples = value;

            const curve = createCurve(this.level, this.numberOfSamples);

            for (let i = 0; i < 2; i++) {
              this.shapers[i].curve = curve;
            }
          }

          break;
        }

        case 'oversample': {
          if (typeof value === 'string') {
            if ((value === 'none') || (value === '2x') || (value === '4x')) {
              for (let i = 0; i < 2; i++) {
                this.shapers[i].oversample = value;
              }
            }
          }

          break;
        }

        case 'postFilters': {
          if (typeof value === 'boolean') {
            this.usePostFilters = value;
            this.connect();
          }
        }
      }
    }
  }

  /** @override */
  public override params(): Required<PreEqualizerParams> {
    return {
      state      : this.isActive,
      gain       : this.preGain.gain.value,
      bass       : this.bass.gain.value,
      middle     : this.middle.gain.value,
      treble     : this.treble.gain.value,
      level      : this.level,
      samples    : this.numberOfSamples,
      oversample : this.shapers[0].oversample,
      postFilters: this.usePostFilters
    };
  }
}

/**
 * Effector's subclass for Post-Equalizer.
 */
class PostEqualizer extends Effector {
  private peakingFilters: BiquadFilterNode[] = [];

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   */
  constructor(context: AudioContext) {
    super(context);

    for (let i = 0; i < 5; i++) {
      this.peakingFilters[i] = context.createBiquadFilter();

      // Initialize parameters
      this.peakingFilters[i].type       = 'peaking';
      this.peakingFilters[i].gain.value = 0;
    }

    // Set cutoff frequency
    this.peakingFilters[0].frequency.value =  100;  // 100 Hz
    this.peakingFilters[1].frequency.value =  360;  // 360 Hz
    this.peakingFilters[2].frequency.value =  720;  // 720 Hz
    this.peakingFilters[3].frequency.value = 1600;  // 1.6 kHz
    this.peakingFilters[4].frequency.value = 4800;  // 4.8 kHz

    // Set Q
    this.peakingFilters[0].Q.value = 1.5;
    this.peakingFilters[1].Q.value = 2.0;
    this.peakingFilters[2].Q.value = 2.0;
    this.peakingFilters[3].Q.value = 1.1;
    this.peakingFilters[4].Q.value = 1.2;

    // `PostEqualizer` is not connected by default
    this.deactivate();
  }

  /** @override */
  public override connect(): GainNode {
    this.input.disconnect(0);

    if (this.isActive) {
      // Effect ON
      this.input.connect(this.peakingFilters[0]);

      for (let i = 0, len = (this.peakingFilters.length - 1); i < len; i++) {
        this.peakingFilters[i].connect(this.peakingFilters[i + 1]);
      }

      this.peakingFilters[4].connect(this.output);
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
  public param(params: 'fc100'): number;
  public param(params: 'fc360'): number;
  public param(params: 'fc720'): number;
  public param(params: 'fc1600'): number;
  public param(params: 'fc4800'): number;
  public param(params: PostEqualizerParams): void;
  public param(params: keyof PostEqualizerParams | PostEqualizerParams): PostEqualizerParams[keyof PostEqualizerParams] | void {
    if (typeof params === 'string') {
      switch (params) {
        case 'state': {
          return this.isActive;
        }

        case 'fc100': {
          return this.peakingFilters[0].gain.value;
        }

        case 'fc360': {
          return this.peakingFilters[1].gain.value;
        }

        case 'fc720': {
          return this.peakingFilters[2].gain.value;
        }

        case 'fc1600': {
          return this.peakingFilters[3].gain.value;
        }

        case 'fc4800': {
          return this.peakingFilters[4].gain.value;
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

        case 'fc100': {
          if (typeof value === 'number') {
            this.peakingFilters[0].gain.value = value;
          }

          break;
        }

        case 'fc360': {
          if (typeof value === 'number') {
            this.peakingFilters[1].gain.value = value;
          }

          break;
        }

        case 'fc720': {
          if (typeof value === 'number') {
            this.peakingFilters[2].gain.value = value;
          }

          break;
        }

        case 'fc1600': {
          if (typeof value === 'number') {
            this.peakingFilters[3].gain.value = value;
          }

          break;
        }

        case 'fc4800': {
          if (typeof value === 'number') {
            this.peakingFilters[4].gain.value = value;
          }

          break;
        }
      }
    }
  }
  /** @override */
  public override params(): Required<PostEqualizerParams> {
    return {
      state : this.isActive,
      fc100 : this.peakingFilters[0].gain.value,
      fc360 : this.peakingFilters[1].gain.value,
      fc720 : this.peakingFilters[2].gain.value,
      fc1600: this.peakingFilters[3].gain.value,
      fc4800: this.peakingFilters[4].gain.value,
    };
  }
}

/**
 * Effector's subclass for Preamplifier (MesaBoogie).
 */
export class MesaBoogie extends Effector {
  private preEQ: PreEqualizer;
  private postEQ: PostEqualizer;
  private cabinet: Cabinet;

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

      // GainNode (Input) -> Pre-Equalizer -> Cabinet -> Post-Equalizer -> GainNode (Output)
      this.input.connect(this.preEQ.INPUT);
      this.preEQ.OUTPUT.connect(this.cabinet.INPUT);
      this.cabinet.OUTPUT.connect(this.postEQ.INPUT);
      this.postEQ.OUTPUT.connect(this.output);
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
   * @param {keyof MesaBoogieParams|MesaBoogieParams} params This argument is string if getter. Otherwise, setter.
   * @return {MesaBoogieParams[keyof MesaBoogieParams]|MesaBoogie} Return value is parameter for preamp effector if getter.
   *     Otherwise, return value is for method chain.
   */
  public param(params: 'state'): boolean;
  public param(params: 'pre'): MesaBoogieParams['pre'];
  public param(params: 'post'): MesaBoogieParams['post'];
  public param(params: 'cabinet'): CabinetParams;
  public param(params: MesaBoogieParams): MesaBoogie;
  public param(params: keyof MesaBoogieParams | MesaBoogieParams): MesaBoogieParams[keyof MesaBoogieParams] | MesaBoogie {
    if (typeof params === 'string') {
      switch (params) {
        case 'state': {
          return this.isActive;
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
  public override params(): Required<MesaBoogieParams> {
    return {
      state  : this.isActive,
      pre    : this.preEQ.params(),
      post   : this.postEQ.params(),
      cabinet: this.cabinet.params()
    };
  }
}
