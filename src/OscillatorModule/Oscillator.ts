import { Connectable, Statable } from '/src/interfaces';

export type OscillatorCustomType = {
  real: Float32Array,
  imag: Float32Array
};

export type OscillatorParams = {
  state?: boolean,
  type?: OscillatorType | OscillatorCustomType,
  octave?: number,
  fine?: number,
  volume?: number
};

/**
 * This private class is entity for oscillator.
 * @constructor
 * @implements {Connectable}
 * @implements {Statable}
 */
export class Oscillator implements Connectable, Statable {
  // 1 Octave = 1200 cent
  public static readonly OCTAVE = 1200 as const;

  private context: AudioContext;
  private source: OscillatorNode;
  private volume: GainNode;

  private octave = 0;
  private fine = 0;
  private custom: OscillatorCustomType = {
    real: new Float32Array([0, 1]),
    imag: new Float32Array([0, 1])
  };

  private isActive: boolean;

  // in order to not call in duplicate `start` or `stop`  method in instance of `OscillatorNode`
  private paused = true;

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   * @param {boolean} state This argument is initial state.
   */
  constructor(context: AudioContext, state: boolean) {
    this.context = context;
    this.source  = context.createOscillator();
    this.volume  = context.createGain();

    this.isActive = state;
  }

  /**
   * This method connects `AudioNode`s.
   * @param {AudioNode} output This argument is instance of `AudioNode` as output.
   */
  public ready(output: AudioNode): void {
    if (!this.isActive) {
      return;
    }

    // Store parameters
    const type      = this.source.type;
    const frequency = this.source.frequency.value;
    const detune    = this.source.detune.value;

    if (!this.paused) {
      this.source.stop(this.context.currentTime);
      this.source.disconnect(0);
    }

    this.source = this.context.createOscillator();

    if (type === 'custom') {
      // Custom wave
      const reals        = this.custom.real;
      const imags        = this.custom.imag;
      const periodicWave = this.context.createPeriodicWave(reals, imags);

      this.source.setPeriodicWave(periodicWave);
    } else {
      this.source.type = type;
    }

    this.source.frequency.value = frequency;
    this.source.detune.value    = detune;

    this.volume.connect(output);
  }

  /**
   * This method starts sound.
   * @param {number} startTime This argument is start time.
   */
  public start(startTime?: number): void {
    if (this.isActive) {
      this.source.start(startTime ?? this.context.currentTime);
      this.paused = false;
    } else {
      if (!this.paused) {
        this.source.stop(this.context.currentTime);
        this.paused = true;
      }

      this.source.disconnect(0);
    }
  }

  /**
   * This method stops sound.
   * @param {number} stopTime This argument is stop time.
   */
  public stop(stopTime?: number): void {
    if (this.paused) {
      return;
    }

    this.source.stop(stopTime ?? this.context.currentTime);
    this.source.disconnect(0);

    this.paused = true;
  }

  /**
   * This method gets or sets parameters for oscillator.
   * @param {keyof OscillatorParams|OscillatorParams} params This argument is string if getter. Otherwise, setter.
   * @return {OscillatorParams[keyof OscillatorParams]} Return value is parameter for oscillator if getter.
   *     Otherwise, return value is for method chain.
   */
  public param(params: 'state'): boolean;
  public param(params: 'type'): OscillatorType | OscillatorCustomType;
  public param(params: 'octave'): number;
  public param(params: 'fine'): number;
  public param(params: 'volume'): number;
  public param(params: OscillatorParams): Oscillator;
  public param(params: keyof OscillatorParams | OscillatorParams): OscillatorParams[keyof OscillatorParams] | Oscillator {
    if (typeof params === 'string') {
      switch (params) {
        case 'state':
          return this.isActive;
        case 'type':
          return this.source.type;
        case 'octave':
          return this.octave;
        case 'fine':
          return this.fine;
        case 'volume':
          return this.volume.gain.value;
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
        case 'type':
          if (typeof value === 'string') {
            this.source.type = value;
          } else if (typeof value === 'object') {
            let { real, imag } = value;

            const MAX_SIZE = 4096;  // This size is defined by specification

            if (real.length > MAX_SIZE) { real = real.subarray(0, MAX_SIZE); }
            if (imag.length > MAX_SIZE) { imag = imag.subarray(0, MAX_SIZE); }

            // The 1st value is fixed by 0 (This is is defined by specification)
            if (real[0] !== 0) { real[0] = 0; }
            if (imag[0] !== 0) { imag[0] = 0; }

            const periodicWave = this.context.createPeriodicWave(real, imag);

            this.source.setPeriodicWave(periodicWave);

            this.custom.real = real;
            this.custom.imag = imag;
          }

          break;
        case 'octave':
          if (typeof value === 'number') {
            this.octave = value;
            this.source.detune.value = this.fine + (value * Oscillator.OCTAVE);
          }

          break;
        case 'fine':
          if (typeof value === 'number') {
            this.fine = value;
            this.source.detune.value = value + (this.octave * Oscillator.OCTAVE);
          }

          break;
        case 'volume':
          if (typeof value === 'number') {
            this.volume.gain.value = value;
          }

          break;
        default:
          break;
      }
    }

    return this;
  }

  /**
   * This method gets instance of `OscillatorNode`.
   * @return {OscillatorNode}
   */
  public get(): OscillatorNode {
    return this.source;
  }

  /** @override */
  public state(): boolean {
    return this.isActive;
  }

  /** @override */
  public activate(): Oscillator {
    this.isActive = true;
    return this;
  }

  /** @override */
  public deactivate(): Oscillator {
    this.isActive = false;
    return this;
  }

  /**
   * This method gets oscillator parameters as associative array.
   * @return {OscillatorParams}
   */
  public params(): Required<OscillatorParams> {
    return {
      state : this.isActive,
      type  : this.source.type,
      octave: this.octave,
      fine  : this.fine,
      volume: this.volume.gain.value
    };
  }

  /** @override */
  public get INPUT(): OscillatorNode {
    return this.source;
  }

  /** @override */
  public get OUTPUT(): GainNode {
    return this.volume;
  }
}
