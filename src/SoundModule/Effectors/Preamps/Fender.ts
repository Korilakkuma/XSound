import type { CabinetParams } from './Cabinet';

import { Effector } from '../Effector';
import { createCurve } from '../Preamp';
import { Cabinet } from './Cabinet';

export type SpeakerInches = -1 | 10 | 12 | 15;

export type PreEqualizerParams = {
  state?: boolean,
  gain?: number,
  bass?: number,
  middle?: number,
  treble?: number,
  level?: number,
  samples?: number,
  oversample?: OverSampleType
};

export type PostFilterParams = {
  state?: boolean,
  inch?: SpeakerInches,
  tilt?: boolean
};

export type FenderParams = {
  state?: boolean,
  pre?: PreEqualizerParams,
  post?: PostFilterParams,
  cabinet?: CabinetParams
};

/**
 * Effector's subclass for Pre-Equalizer.
 */
class PreEqualizer extends Effector {
  private preGain: GainNode;

  private highpass: BiquadFilterNode;

  private bass: BiquadFilterNode;
  private middle: BiquadFilterNode;
  private treble: BiquadFilterNode;

  private gainEdge: GainNode;
  private gainBody: GainNode;
  private gainBottom: GainNode;

  private shapers: WaveShaperNode[] = [];
  private iirLowpassFilters: IIRFilterNode[] = [];
  private iirHighpassFilters: IIRFilterNode[] = [];

  private mixer: GainNode;

  // for creating curve
  private level           = 0;
  private numberOfSamples = 1024;

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   */
  constructor(context: AudioContext) {
    super(context);

    this.preGain = context.createGain();

    // Initialize parameters
    this.preGain.gain.value = 0.5;

    this.highpass = context.createBiquadFilter();

    // Initialize parameters
    this.highpass.type            = 'highpass';
    this.highpass.frequency.value = 40;  // 40 Hz
    this.highpass.Q.value         = 1;

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

    this.gainEdge   = context.createGain();
    this.gainBody   = context.createGain();
    this.gainBottom = context.createGain();

    // Initialize parameters
    this.gainEdge.gain.value   = 1;
    this.gainBody.gain.value   = 1;
    this.gainBottom.gain.value = 1;

    const curve = createCurve(this.level, this.numberOfSamples);

    // Initialize parameters
    for (let i = 0; i < 3; i++) {
      this.shapers[i] = context.createWaveShaper();

      this.shapers[i].curve      = curve;
      this.shapers[i].oversample = '4x';
    }

    const coefficient1 = (220 / context.sampleRate) * Math.PI;
    const coefficient2 = (220 / context.sampleRate) * Math.PI;

    const lowpassFeedforward1 = new Float32Array([coefficient1, coefficient1]);
    const lowpassFeedforward2 = new Float32Array([coefficient2, coefficient2]);
    const lowpassFeedback1    = new Float32Array([1.0 + coefficient1, -1.0 + coefficient1]);
    const lowpassFeedback2    = new Float32Array([1.0 + coefficient2, -1.0 + coefficient2]);

    const highpassFeedforward1 = new Float32Array([1.0, -1.0]);
    const highpassFeedforward2 = new Float32Array([1.0, -1.0]);
    const highpassFeedback1    = new Float32Array([1.0 + coefficient1, -1.0 + coefficient1]);
    const highpassFeedback2    = new Float32Array([1.0 + coefficient2, -1.0 + coefficient2]);

    this.iirLowpassFilters[0] = context.createIIRFilter(lowpassFeedforward1, lowpassFeedback1);
    this.iirLowpassFilters[1] = context.createIIRFilter(lowpassFeedforward2, lowpassFeedback2);

    this.iirHighpassFilters[0] = context.createIIRFilter(highpassFeedforward1, highpassFeedback1);
    this.iirHighpassFilters[1] = context.createIIRFilter(highpassFeedforward2, highpassFeedback2);

    this.mixer = context.createGain();

    // Initialize parameters
    this.mixer.gain.value = 1;

    // `PreEqualizer` is not connected by default
    this.deactivate();
  }

  /** @override */
  public override connect(): GainNode {
    this.input.disconnect(0);

    if (this.isActive) {
      // Effect ON

      // GainNode (Input) -> GainNode (Pre-gain) -> BiquadFilterNode (High-pass) -> BiquadFilterNode (Bass: Low-shelving) -> BiquadFilterNode (Middle: Peaking) -> BiquadFilterNode (Treble: High-shelving)
      this.input.connect(this.preGain);
      this.preGain.connect(this.highpass);
      this.highpass.connect(this.bass);
      this.bass.connect(this.middle);
      this.middle.connect(this.treble);

      // Edge distortion
      // BiquadFilterNode (Treble: High-shelving) -> IIRFilterNode (High-pass) -> WaveShaperNode (Clipping) -> GainNode (Edge volume) -> GainNode (Mixer)
      this.treble.connect(this.iirHighpassFilters[1]);
      this.iirHighpassFilters[1].connect(this.shapers[0]);
      this.shapers[0].connect(this.gainEdge);
      this.gainEdge.connect(this.mixer);

      // Middle distortion
      // BiquadFilterNode (Treble: High-shelving) -> IIRFilterNode (High-pass) -> WaveShaperNode (Clipping) -> IIRFilterNode (Low-pass) -> GainNode (Body volume) -> GainNode (Mixer)
      this.treble.connect(this.iirHighpassFilters[0]);
      this.iirHighpassFilters[0].connect(this.shapers[1]);
      this.shapers[1].connect(this.iirLowpassFilters[1]);
      this.iirLowpassFilters[1].connect(this.gainBody);
      this.gainBody.connect(this.mixer);

      // Low distortion
      // BiquadFilterNode (Treble: High-shelving) -> IIRFilterNode (Low-pass) -> WaveShaperNode (Clipping) -> GainNode (Bottom volume) -> GainNode (Mixer)
      this.treble.connect(this.iirLowpassFilters[0]);
      this.iirLowpassFilters[0].connect(this.shapers[2]);
      this.shapers[2].connect(this.gainBottom);
      this.gainBottom.connect(this.mixer);


      // GainNode (Mixer) -> GainNode (Output)
      this.mixer.connect(this.output);
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

            for (let i = 0; i < 3; i++) {
              this.shapers[i].curve = curve;
            }
          }

          break;
        }

        case 'samples': {
          if (typeof value === 'number') {
            this.numberOfSamples = value;

            const curve = createCurve(this.level, this.numberOfSamples);

            for (let i = 0; i < 3; i++) {
              this.shapers[i].curve = curve;
            }
          }

          break;
        }

        case 'oversample': {
          if (typeof value === 'string') {
            if ((value === 'none') || (value === '2x') || (value === '4x')) {
              for (let i = 0; i < 3; i++) {
                this.shapers[i].oversample = value;
              }
            }
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
      gain      : this.preGain.gain.value,
      bass      : this.bass.gain.value,
      middle    : this.middle.gain.value,
      treble    : this.treble.gain.value,
      level     : this.level,
      samples   : this.numberOfSamples,
      oversample: this.shapers[0].oversample
    };
  }
}

/**
 * Effector's subclass for Post-filter.
 */
class PostFilter extends Effector {
  private cabinet: Cabinet;

  private inch: SpeakerInches = -1;
  private tilt = false;

  private speakerFilter: BiquadFilterNode;
  private tiltFilter: BiquadFilterNode;

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   * @param {Cabinet} cabinet This argument is instance of `Cabinet`.
   */
  constructor(context: AudioContext, cabinet: Cabinet) {
    super(context);

    this.cabinet = cabinet;

    this.speakerFilter = context.createBiquadFilter();

    // Initialize parameters
    this.speakerFilter.type            = 'peaking';
    this.speakerFilter.frequency.value = 40;  // 40 Hz
    this.speakerFilter.Q.value         = -3;
    this.speakerFilter.gain.value      = 0;

    this.tiltFilter = context.createBiquadFilter();

    // Initialize parameters
    this.tiltFilter.type            = 'highshelf';
    this.tiltFilter.frequency.value = 3200;  // 3.2 kHz
    this.tiltFilter.Q.value         = Math.SQRT1_2;
    this.tiltFilter.gain.value      = 0;

    // `PostFilter` is not connected by default
    this.deactivate();
  }

  /** @override */
  public override connect(): GainNode {
    this.input.disconnect(0);

    if (this.isActive) {
      // Effect ON

      // GainNode (Input) -> Cabinet -> BiquadFilterNode (Speaker inch) -> BiquadFilterNode (Speaker tilt) ->  GainNode (Output)
      this.input.connect(this.cabinet.INPUT);
      this.cabinet.OUTPUT.connect(this.speakerFilter);
      this.speakerFilter.connect(this.tiltFilter);
      this.tiltFilter.connect(this.output);
    } else {
      // Effect OFF

      // GainNode (Input) -> GainNode (Output)
      this.input.connect(this.output);
    }

    return this.output;
  }

  /**
   * This method gets or sets parameters for post-filter.
   * This method is overloaded for type interface and type check.
   * @param {keyof PostFilterParams|PostFilterParams} params This argument is string if getter. Otherwise, setter.
   * @return {PostFilterParams[keyof PostFilterParams]} Return value is parameter for post-filter if getter.
   */
  public param(params: 'state'): boolean;
  public param(params: 'inch'): SpeakerInches;
  public param(params: 'tilt'): boolean;
  public param(params: PostFilterParams): void;
  public param(params: keyof PostFilterParams | PostFilterParams): PostFilterParams[keyof PostFilterParams] | void {
    if (typeof params === 'string') {
      switch (params) {
        case 'state': {
          return this.isActive;
        }

        case 'inch': {
          return this.inch;
        }

        case 'tilt': {
          return this.tilt;
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

        case 'inch': {
          if (typeof value === 'number') {
            switch (value) {
              case -1: {
                this.inch = -1;

                this.speakerFilter.frequency.value = 40;
                this.speakerFilter.Q.value         = Math.SQRT1_2;
                this.speakerFilter.gain.value      = 0;

                break;
              }

              case 10: {
                this.inch = 10;

                this.speakerFilter.frequency.value = 120;
                this.speakerFilter.Q.value         = 3;
                this.speakerFilter.gain.value      = 9;

                break;
              }

              case 12: {
                this.inch = 12;

                this.speakerFilter.frequency.value = 80;
                this.speakerFilter.Q.value         = 6;
                this.speakerFilter.gain.value      = 10;

                break;
              }

              case 15: {
                this.inch = 15;

                this.speakerFilter.frequency.value = 60;
                this.speakerFilter.Q.value         = 9;
                this.speakerFilter.gain.value      = 12;

                break;
              }
            }
          }

          break;
        }

        case 'tilt': {
          if (typeof value === 'boolean') {
            this.tilt = value;

            if (this.tilt) {
              this.tiltFilter.gain.value = 6;
            } else {
              this.tiltFilter.gain.value = 0;
            }
          }

          break;
        }
      }
    }
  }

  /** @override */
  public override params(): Required<PostFilterParams> {
    return {
      state: this.isActive,
      inch : this.inch,
      tilt : this.tilt
    };
  }
}

/**
 * Effector's subclass for Preamplifier (Fender).
 */
export class Fender extends Effector {
  private preEQ: PreEqualizer;
  private postFilter: PostFilter;
  private cabinet: Cabinet;

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   */
  constructor(context: AudioContext) {
    super(context);

    this.cabinet = new Cabinet(context);

    this.preEQ      = new PreEqualizer(context);
    this.postFilter = new PostFilter(context, this.cabinet);

    // `Preamp` is not connected by default
    this.deactivate();
  }

  /** @override */
  public override connect(): GainNode {
    this.input.disconnect(0);

    if (this.isActive) {
      // Effect ON

      // GainNode (Input) -> Pre-Equalizer -> Post-Filter (-> Cabinet) -> GainNode (Output)
      this.input.connect(this.preEQ.INPUT);
      this.preEQ.OUTPUT.connect(this.postFilter.INPUT);
      this.postFilter.OUTPUT.connect(this.output);
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
   * @param {keyof FenderParams|FenderParams} params This argument is string if getter. Otherwise, setter.
   * @return {FenderParams[keyof FenderParams]|Fender} Return value is parameter for preamp effector if getter.
   *     Otherwise, return value is for method chain.
   */
  public param(params: 'state'): boolean;
  public param(params: 'pre'): FenderParams['pre']
  public param(params: 'post'): FenderParams['post']
  public param(params: 'cabinet'): CabinetParams;
  public param(params: FenderParams): Fender;
  public param(params: keyof FenderParams | FenderParams): FenderParams[keyof FenderParams] | Fender {
    if (typeof params === 'string') {
      switch (params) {
        case 'state': {
          return this.isActive;
        }

        case 'pre': {
          return this.preEQ.params();
        }

        case 'post': {
          return this.postFilter.params();
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
              this.postFilter.activate();
            } else {
              this.deactivate();
              this.preEQ.deactivate();
              this.postFilter.deactivate();
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
            this.postFilter.param(value);
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
  public override params(): Required<FenderParams> {
    return {
      state  : this.isActive,
      pre    : this.preEQ.params(),
      post   : this.postFilter.params(),
      cabinet: this.cabinet.params()
    };
  }

  /** @override */
  public override activate(): Fender {
    super.activate();
    return this;
  }

  /** @override */
  public override deactivate(): Fender {
    super.deactivate();
    return this;
  }
}
