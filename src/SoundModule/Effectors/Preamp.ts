import { Effector } from './Effector';

export type PreampCurve = Float32Array | null;

export type PreEqualizerParams = {
  state?: boolean,
  curve?: PreampCurve,
  gain?: number,
  lead?: number
};

export type PostEqualizerParams = {
  state?: boolean,
  curve?: PreampCurve,
  bass?: number,
  middle?: number,
  treble?: number,
  frequency?: number
};

export type CabinetParams = {
  state?: boolean
};

export type PreampParams = {
  state?: boolean,
  level?: number,
  samples?: number,
  pre?: PreEqualizerParams,
  post?: PostEqualizerParams,
  cabinet?: CabinetParams
};

/**
 * Effector's subclass for Pre-Equalizer.
 * @constructor
 * @extends {Effector}
 */
export class PreEqualizer extends Effector {
  private shaper: WaveShaperNode;
  private gain: GainNode;
  private leadGain: GainNode;
  private lowpass: BiquadFilterNode;
  private highpass1: BiquadFilterNode;
  private highpass2: BiquadFilterNode;
  private highpass3: BiquadFilterNode;

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   */
  constructor(context: AudioContext) {
    super(context, 0);

    this.shaper = context.createWaveShaper();

    this.gain     = context.createGain();
    this.leadGain = context.createGain();

    this.lowpass   = context.createBiquadFilter();
    this.highpass1 = context.createBiquadFilter();
    this.highpass2 = context.createBiquadFilter();
    this.highpass3 = context.createBiquadFilter();

    // Initialize parameters
    this.gain.gain.value     = 0.5;
    this.leadGain.gain.value = 0.5;

    this.lowpass.type            = 'lowpass';
    this.lowpass.frequency.value = 3200;
    this.lowpass.Q.value         = Math.SQRT1_2;
    this.lowpass.gain.value      = 0;  // Not used

    this.highpass1.type            = 'highpass';
    this.highpass1.frequency.value = 80;
    this.highpass1.Q.value         = Math.SQRT1_2;
    this.highpass1.gain.value      = 0;  // Not used

    this.highpass2.type            = 'highpass';
    this.highpass2.frequency.value = 640;
    this.highpass2.Q.value         = Math.SQRT1_2;
    this.highpass2.gain.value      = 0;  // Not used

    this.highpass3.type            = 'highpass';
    this.highpass3.frequency.value = 80;
    this.highpass3.Q.value         = Math.SQRT1_2;
    this.highpass3.gain.value      = 0;  // Not used

    // `PreEqualizer` is not connected by default
    this.deactivate();
  }

  /** @override */
  public override connect(): GainNode {
    this.input.disconnect(0);

    if (this.isActive) {
      // Effect ON

      // GainNode (Input) -> BiquadFilterNode (High-pass) -> GainNode (Gain) -> BiquadFilterNode (High-pass) -> GainNode (Output)
      this.input.connect(this.highpass1);
      this.highpass1.connect(this.gain);
      this.gain.connect(this.highpass3);

      // GainNode (Input) -> BiquadFilterNode (High-pass) -> GainNode (Lead Gain) -> BiquadFilterNode (High-pass)
      this.input.connect(this.highpass2);
      this.highpass2.connect(this.leadGain);
      this.leadGain.connect(this.highpass3);

      // BiquadFilterNode (High-pass) -> WaveShaperNode (Preamplifier) -> GainNode (Output)
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
  public param(params: 'gain'): number;
  public param(params: 'lead'): number;
  public param(params: PreEqualizerParams): void;
  public param(params: keyof PreEqualizerParams | PreEqualizerParams): PreEqualizerParams[keyof PreEqualizerParams] | void {
    if (typeof params === 'string') {
      switch (params) {
        case 'state':
          return this.isActive;
        case 'curve':
          return this.shaper.curve;
        case 'gain':
          return this.gain.gain.value;
        case 'lead':
          return this.leadGain.gain.value;
        default:
          return;
      }
    }

    for (const [key, value] of Object.entries(params)) {
      switch (key) {
        case 'state':
          if (typeof value === 'boolean') {
            if (value) {
              this.activate();
            } else {
              this.deactivate();
            }
          }

          break;
        case 'curve':
          if ((typeof value !== 'number') && (typeof value !== 'boolean')) {
            if ((value instanceof Float32Array) || (value === null)) {
              this.shaper.curve = value;
            }
          }

          break;
        case 'gain':
          if (typeof value === 'number') {
            this.gain.gain.value = value;
          }

          break;
        case 'lead':
          if (typeof value === 'number') {
            this.leadGain.gain.value = value;
          }

          break;
        default:
          break;
      }
    }
  }

  /** @override */
  public override params(): Required<PreEqualizerParams> {
    return {
      state: this.isActive,
      curve: this.shaper.curve,
      gain : this.gain.gain.value,
      lead : this.leadGain.gain.value
    };
  }
}

/**
 * Effector's subclass for Post-Equalizer.
 * @constructor
 * @extends {Effector}
 */
export class PostEqualizer extends Effector {
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
    super(context, 0);

    this.shaper = context.createWaveShaper();

    this.bass   = context.createBiquadFilter();
    this.middle = context.createBiquadFilter();
    this.treble = context.createBiquadFilter();

    // Initialize parameters
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
    this.lowpass.frequency.value = 24000;
    this.lowpass.Q.value         = Math.SQRT1_2;
    this.lowpass.gain.value      = 0;  // Not used

    this.highpass.type            = 'highpass';
    this.highpass.frequency.value = 40;
    this.highpass.Q.value         = Math.SQRT1_2;
    this.highpass.gain.value      = 0;  // Not used

    // `PostEqualizer` is not connected by default
    this.deactivate();
  }

  /** @override */
  public override connect(): GainNode {
    this.input.disconnect(0);

    if (this.isActive) {
      // Effect ON

      // GainNode (Input) -> BiquadFilterNode (Low-pass) -> BiquadFilterNode (High-pass) -> WaveShaperNode (Preamplifier) -> BiquadFilterNode (Bass: Low-shelving) -> BiquadFilterNode (Middle: Peaking) -> BiquadFilterNode (Treble: High-shelving) -> GainNode (Output)
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
  public param(params: 'bass'): number;
  public param(params: 'middle'): number;
  public param(params: 'treble'): number;
  public param(params: 'frequency'): number;
  public param(params: PostEqualizerParams): void;
  public param(params: keyof PostEqualizerParams | PostEqualizerParams): PostEqualizerParams[keyof PostEqualizerParams] | void {
    if (typeof params === 'string') {
      switch (params) {
        case 'state':
          return this.isActive;
        case 'curve':
          return this.shaper.curve;
        case 'bass':
          return this.bass.gain.value;
        case 'middle':
          return this.middle.gain.value;
        case 'treble':
          return this.treble.gain.value;
        case 'frequency':
          return this.middle.frequency.value;
        default:
          return;
      }
    }

    for (const [key, value] of Object.entries(params)) {
      switch (key) {
        case 'state':
          if (typeof value === 'boolean') {
            if (value) {
              this.activate();
            } else {
              this.deactivate();
            }
          }

          break;
        case 'curve':
          if ((typeof value !== 'number') && (typeof value !== 'boolean')) {
            if ((value instanceof Float32Array) || (value === null)) {
              this.shaper.curve = value;
            }
          }

          break;
        case 'bass':
          if (typeof value === 'number') {
            this.bass.gain.value = value;
          }

          break;
        case 'middle':
          if (typeof value === 'number') {
            this.middle.gain.value = value;
          }

          break;
        case 'treble':
          if (typeof value === 'number') {
            this.treble.gain.value = value;
          }

          break;
        case 'frequency':
          if (typeof value === 'number') {
            this.middle.frequency.value = value;
          }

          break;
        default:
          break;
      }
    }
  }

  /** @override */
  public override params(): Required<PostEqualizerParams> {
    return {
      state    : this.isActive,
      curve    : this.shaper.curve,
      bass     : this.bass.gain.value,
      middle   : this.middle.gain.value,
      treble   : this.treble.gain.value,
      frequency: this.middle.frequency.value
    };
  }
}

/**
 * Effector's subclass for Cabinet.
 * @constructor
 * @extends {Effector}
 */
export class Cabinet extends Effector {
  private lowpass: BiquadFilterNode;
  private notch: BiquadFilterNode;

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   */
  constructor(context: AudioContext) {
    super(context, 0);

    this.lowpass = context.createBiquadFilter();
    this.notch   = context.createBiquadFilter();

    // Initialize parameters
    this.lowpass.type            = 'lowpass';
    this.lowpass.frequency.value = 3200;
    this.lowpass.Q.value         = 6;
    this.lowpass.gain.value      = 0;  // Not used

    this.notch.type            = 'notch';
    this.notch.frequency.value = 8000;
    this.notch.Q.value         = 1;
    this.notch.gain.value      = 0;  // Not used

    // `Cabinet` is connected by default
    this.activate();
  }

  /** @override */
  public override connect(): GainNode {
    // Clear connection
    this.input.disconnect(0);

    if (this.isActive) {
      // Effect ON

      // GainNode (Input) -> BiquadFilterNode (Notch) -> BiquadFilterNode (Low-pass) -> GainNode (Output)
      this.input.connect(this.notch);
      this.notch.connect(this.lowpass);
      this.lowpass.connect(this.output);
    } else {
      // Effect OFF

      // GainNode (Input) -> GainNode (Output)
      this.input.connect(this.output);
    }

    return this.output;
  }

  /**
   * This method gets or sets parameters for cabinet.
   * This method is overloaded for type interface and type check.
   * @param {keyof CabinetParams|CabinetParams} params This argument is string if getter. Otherwise, setter.
   * @return {CabinetParams[keyof CabinetParams]} Return value is parameter for cabinet if getter.
   */
  public param(params: 'state'): boolean;
  public param(params: CabinetParams): void;
  public param(params: keyof CabinetParams | CabinetParams): CabinetParams[keyof CabinetParams] | void {
    if (typeof params === 'string') {
      switch (params) {
        case 'state':
          return this.isActive;
        default:
          return;
      }
    }

    for (const [key, value] of Object.entries(params)) {
      switch (key) {
        case 'state':
          if (typeof value === 'boolean') {
            if (value) {
              this.activate();
            } else {
              this.deactivate();
            }
          }

          break;
        default:
          break;
      }
    }
  }

  /** @override */
  public override params(): Required<CabinetParams> {
    return {
      state: this.isActive
    };
  }
}

/**
 * Effector's subclass for Preamplifier.
 * @constructor
 * @extends {Effector}
 */
export class Preamp extends Effector {
  /**
   * This class (static) method creates instance of `Float32Array` for `WaveShaperNode`.
   * @param {number} level This argument is preamp effect level.
   * @param {number} numberOfSamples This argument is curve size.
   * @return {Float32Array|null} Return value is `WaveShaperNode`'s 'curve'.
   */
  public static createCurve(level: number, numberOfSamples: number): Float32Array | null {
    const index = Math.trunc((numberOfSamples - 1) / 2);

    const curves = new Float32Array(numberOfSamples);

    const d = (10 ** ((level / 5.0) - 1.0)) - 0.1;
    const c = (d / 5.0) + 1.0;

    let peak = 0.4;

    if (c === 1) {
      peak = 1.0;
    } else if ((c > 1) && (c < 1.04)) {
      peak = (-15.5 * c) + 16.52;
    }

    for (let i = 0; i < index; i++) {
      curves[index + i] = peak * (+1 - (c ** -i) + (i * (c ** -index)) / index);
      curves[index - i] = peak * (-1 + (c ** -i) - (i * (c ** -index)) / index);
    }

    curves[index] = 0;

    return curves;
  }

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
    super(context, 0);

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
   * @param {keyof PreampParams|PreampParams} params This argument is string if getter. Otherwise, setter.
   * @return {PreampParams[keyof PreampParams]|Preamp} Return value is parameter for preamp effector if getter.
   *     Otherwise, return value is for method chain.
   */
  public param(params: 'state'): boolean;
  public param(params: 'level'): number;
  public param(params: 'samples'): number;
  public param(params: 'pre'): PreEqualizerParams;
  public param(params: 'post'): PostEqualizerParams;
  public param(params: 'cabinet'): CabinetParams;
  public param(params: PreampParams): Preamp;
  public param(params: keyof PreampParams | PreampParams): PreampParams[keyof PreampParams] | Preamp {
    if (typeof params === 'string') {
      switch (params) {
        case 'state':
          return this.isActive;
        case 'level':
          return this.level;
        case 'samples':
          return this.numberOfSamples;
        case 'pre':
          return this.preEQ.params();
        case 'post':
          return this.postEQ.params();
        case 'cabinet':
          return this.cabinet.params();
        default:
          return this;
      }
    }

    for (const [key, value] of Object.entries(params)) {
      switch (key) {
        case 'state':
          if (typeof value === 'boolean') {
            this.isActive = value;
          }

          break;
        case 'level':
          if (typeof value === 'number') {
            this.level = value;

            const curve = Preamp.createCurve(this.level, this.numberOfSamples);

            this.preEQ.param({ curve });
            this.postEQ.param({ curve });
          }

          break;
        case 'samples':
          if (typeof value === 'number') {
            this.numberOfSamples = value;
          }

          break;
        case 'pre':
          if (typeof value === 'object') {
            this.preEQ.param(value);
          }

          break;
        case 'post':
          if (typeof value === 'object') {
            this.postEQ.param(value);
          }

          break;
        case 'cabinet':
          if (typeof value === 'object') {
            this.cabinet.param(value);
          }

          break;
        default:
          break;
      }
    }

    return this;
  }

  /** @override */
  public override params(): Required<PreampParams> {
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
  public override activate(): Preamp {
    super.activate();
    return this;
  }

  /** @override */
  public override deactivate(): Preamp {
    super.deactivate();
    return this;
  }
}
