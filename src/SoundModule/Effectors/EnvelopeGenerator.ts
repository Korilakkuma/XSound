import { Statable } from '../../interfaces';

export type EnvelopeGeneratorParams = {
  state?: boolean,
  attack?: number,
  decay?: number,
  sustain?: number,
  release?: number
};

/**
 * This private class is for Envelope Generator.
 * @constructor
 * @implements {Statable}
 */
export class EnvelopeGenerator implements Statable {
  public static MIN_GAIN = 1e-3;

  private context: AudioContext;
  private generators: GainNode[] = [];
  private activeIndexes: number[] = [];
  private activeCounter = 0;

  private attack  = 0.01;
  private decay   = 0.3;
  private sustain = 0.5;
  private release = 1.0;

  private isActive = true;

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   */
  constructor(context: AudioContext) {
    this.context = context;
  }

  /**
   * This method connects instance of `AudioNode`.
   * @param {number} index This argument is in order to select instance of `GainNode` that is Envelope Generator.
   * @param {AudioNode} input This argument is instance of `AudioNode` as input.
   * @param {AudioNode} output This argument is instance of `AudioNode` as output.
   */
  public ready(index: number, input: AudioNode | null, output: AudioNode | null): void {
    if (input && output && this.generators[index]) {
      input.connect(this.generators[index]);
      this.generators[index].connect(output);
    } else if (input && (output === null) && this.generators[index]) {
      input.connect(this.generators[index]);
    } else if ((input === null) && output && this.generators[index]) {
      this.generators[index].connect(output);
    }

    this.activeIndexes[index] = index;
    this.activeCounter++;
  }

  /**
   * This method changes gain (Attack -> Decay -> Sustain).
   * @param {number} startTime This argument is start time of Attack.
   */
  public start(startTime: number): void {
    // Attack -> Decay -> Sustain
    const t0      = startTime;
    const t1      = t0 + this.attack;
    const t2      = this.decay;
    const t2Value = this.sustain;

    for (const activeIndex of this.activeIndexes) {
      if (activeIndex === undefined) {
        continue;
      }

      if (!this.isActive) {
        this.generators[activeIndex].gain.value = 1;
        continue;
      }

      // Start from `gain.value = 0`
      this.generators[activeIndex].gain.cancelScheduledValues(t0);
      this.generators[activeIndex].gain.setValueAtTime(0, t0);

      // Attack : `gain.value` increases linearly until assigned time (t1)
      this.generators[activeIndex].gain.linearRampToValueAtTime(1, t1);

      // Decay -> Sustain : `gain.value` gradually decreases to value of Sustain during of Decay time (t2) from assigned time (t1)
      this.generators[activeIndex].gain.setTargetAtTime(t2Value, t1, t2);
    }
  }

  /**
   * This method changes gain (Attack or Decay or Sustain -> Release).
   * @param {number} stopTime This argument is start time of Release.
   * @param {boolean} useCurve This argument is to use different methods. The default value is `false`.
   */
  public stop(stopTime: number, useCurve?: boolean): void {
    const s = stopTime - this.release;

    // Sustain -> Release
    const t3 = s >= this.context.currentTime ? s : this.context.currentTime;
    const t4 = this.release;

    for (const activeIndex of this.activeIndexes) {
      if (activeIndex === undefined) {
        continue;
      }

      if (!this.isActive) {
        this.generators[activeIndex].gain.value = 0;
        continue;
      }

      // in case of mouseup on the way of Decay
      this.generators[activeIndex].gain.cancelScheduledValues(t3);

      // Release : `gain.value` gradually decreases to 0 during of Release time (t4) from assigned time (t3)
      // NOTE: https://www.w3.org/TR/webaudio/#dom-audioparam-settargetattime
      if (useCurve) {
        this.generators[activeIndex].gain.setValueCurveAtTime(new Float32Array([1, 0.5, 0.25, 0]), t3, t4);
      } else {
        this.generators[activeIndex].gain.setTargetAtTime(0, t3, t4);
      }
    }
  }

  /**
   * This method gets or sets parameters for envelope generator.
   * This method is overloaded for type interface and type check.
   * @param {keyof EnvelopeGeneratorParams|EnvelopeGeneratorParams} params This argument is string if getter. Otherwise, setter.
   * @return {EnvelopeGeneratorParams[keyof EnvelopeGeneratorParams]|EnvelopeGenerator} Return value is parameter for envelope generator if getter.
   *     Otherwise, return value is for method chain.
   */
  public param(params: 'state'): boolean;
  public param(params: 'attack'): number;
  public param(params: 'decay'): number;
  public param(params: 'sustain'): number;
  public param(params: 'release'): number;
  public param(params: EnvelopeGeneratorParams): EnvelopeGenerator;
  public param(params: keyof EnvelopeGeneratorParams | EnvelopeGeneratorParams): EnvelopeGeneratorParams[keyof EnvelopeGeneratorParams] | EnvelopeGenerator {
    if (typeof params === 'string') {
      switch (params) {
        case 'state': {
          return this.isActive;
        }

        case 'attack': {
          return this.attack;
        }

        case 'decay': {
          return this.decay;
        }

        case 'sustain': {
          return this.sustain;
        }

        case 'release': {
          return this.release;
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

        case 'attack': {
          if (typeof value === 'number') {
            this.attack = value;
          }

          break;
        }

        case 'decay': {
          if (typeof value === 'number') {
            this.decay = value;
          }

          break;
        }

        case 'sustain': {
          if (typeof value === 'number') {
            this.sustain = value;
          }

          break;
        }

        case 'release': {
          if (typeof value === 'number') {
            this.release = value;
          }

          break;
        }
      }
    }

    return this;
  }

  /**
   * This method gets instance of `GainNode` for Envelope Generator.
   * @param {number} index This argument is index of array that contains instance of `GainNode` for Envelope Generator.
   * @return {GainNode} This is returned as instance of `GainNode` for Envelope Generator.
   */
  public getGenerator(index: number): GainNode | null {
    if ((index >= 0) && (index < this.generators.length)) {
      return this.generators[index];
    }

    return null;
  }

  /**
   * This method sets instance of `GainNode` for Envelope Generator.
   * @param {number} index This argument is index of array that contains instance of `GainNode` for Envelope Generator.
   * @return {EnvelopeGenerator} This is returned for method chain.
   */
  public setGenerator(index: number): void {
    this.generators[index] = this.context.createGain();
  }

  /**
   * This method determines whether the all of gain schedulings have ended.
   * @return {boolean} If the all of gain schedulings have ended, this value is `true`. Otherwise, this value is `false`.
   */
  public paused(): boolean {
    let counter = 0;

    for (const activeIndex of this.activeIndexes) {
      if (activeIndex === undefined) {
        continue;
      }

      if (this.generators[activeIndex].gain.value > EnvelopeGenerator.MIN_GAIN) {
        return false;
      }

      counter++;

      // the all of schedulings are stopped ?
      if (counter === this.activeCounter) {
        return true;
      }
    }

    return false;
  }

  /**
   * This method clears variables for managing instance of `GainNode`.
   * @param {boolean} isDisconnect This argument is in order to determine whether disconnect `AudioNode`.
   * @return {EnvelopeGenerator} This is returned for method chain.
   */
  public clear(disconnected: boolean): void {
    this.activeIndexes.length = 0;
    this.activeCounter = 0;

    for (const generator of this.generators) {
      generator.gain.cancelScheduledValues(this.context.currentTime);
      generator.gain.value = 1;

      if (disconnected) {
        generator.disconnect(0);
      }
    }
  }

  /**
   * This method gets effector's parameters as associative array.
   * @return {EnvelopeGeneratorParams}
   */
  public params(): Required<EnvelopeGeneratorParams> {
    return {
      state  : this.isActive,
      attack : this.attack,
      decay  : this.decay,
      sustain: this.sustain,
      release: this.release
    };
  }

  /**
   * This method gets effector's parameters as JSON.
   * @return {string}
   */
  public toJSON(): string {
    return JSON.stringify(this.params());
  }

  /**
   * This method gets envelope generator state. If returns `true`, envelope generator is active.
   * @return {boolean}
   */
  public state(): boolean {
    return this.isActive;
  }

  /**
   * This method activates envelope generator.
   * @return {EnvelopeGenerator} Return value is for method chain.
   */
  public activate(): EnvelopeGenerator {
    this.isActive = true;
    return this;
  }

  /**
   * This method deactivates envelope generator.
   * @return {EnvelopeGenerator} Return value is for method chain.
   */
  public deactivate(): EnvelopeGenerator {
    this.isActive = false;
    return this;
  }
}
