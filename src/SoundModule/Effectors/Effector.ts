import type { Connectable, Statable } from '../../interfaces';

/**
 * This class is superclass for effector classes.
 * Also, this class is used for implementing custom effector.
 */
export abstract class Effector implements Connectable, Statable {
  protected context: AudioContext;
  protected input: GainNode;
  protected output: GainNode;

  protected lfo: OscillatorNode;
  protected depth: GainNode;
  protected rate: AudioParam;

  protected isActive = true;
  protected paused = true;

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   */
  constructor(context: AudioContext) {
    this.context = context;

    // for connecting external modules
    this.input  = context.createGain();
    this.output = context.createGain();

    // for LFO (Low Frequency Oscillator)
    // LFO changes parameter cyclically
    this.lfo   = context.createOscillator();
    this.depth = context.createGain();
    this.rate  = this.lfo.frequency;
  }

  /**
   * This method starts LFO. Namely, this method starts effector.
   * @param {number} startTime This argument is in order to schedule parameter.
   */
  public start(startTime?: number): void {
    if (!this.isActive || !this.paused) {
      return;
    }

    this.lfo.start(startTime ?? this.context.currentTime);
    this.paused = false;
  }

  /**
   * This method stops LFO, then creates instance of `OscillatorNode` again.
   * @param {number} stopTime This argument is in order to schedule parameter.
   * @param {number} releaseTime This argument is in order to schedule parameter when it is necessary to consider release time.
   */
  public stop(stopTime?: number, releaseTime?: number): void {
    if (!this.isActive || this.paused) {
      return;
    }

    // Store parameters
    const type = this.lfo.type;
    const rate = this.lfo.frequency.value;

    // Destroy instance of `OscillatorNode`
    this.lfo.stop((stopTime ?? this.context.currentTime) + (releaseTime ?? 0));

    // Create instance of `OscillatorNode` again
    this.lfo = this.context.createOscillator();

    // Restore parameters
    this.lfo.type            = type;
    this.lfo.frequency.value = rate;

    this.rate = this.lfo.frequency;

    this.paused = true;
  }

  /**
   * This method connects `AudioNode`s for effector.
   * @return {GainNode} Return value is for `connect` method chain.
   */
  public abstract connect(): GainNode;

  /**
   * This method gets effector's parameters as associative array.
   */
  public abstract params(): void;

  /**
   * This method gets effector's parameters as JSON.
   * @return {string}
   */
  public toJSON(): string {
    return JSON.stringify(this.params());
  }

  /**
   * This method gets effector state. If returns `true`, effector is active.
   * @return {boolean}
   */
  public state(): boolean {
    return this.isActive;
  }

  /**
   * This method activates effector.
   * @return {Effector} Return value is for method chain.
   */
  public activate() {
    this.isActive = true;

    // Update connection
    this.connect();

    // Start LFO
    this.start(0);

    // Type inference every subclass
    return this;
  }

  /**
   * This method deactivates effector.
   * @return {Effector} Return value is for method chain.
   */
  public deactivate() {
    // Stop LFO
    this.stop(0);

    this.isActive = false;

    // Update connection
    this.connect();

    // Type inference every subclass
    return this;
  }

  /**
   * Connector for input.
   */
  public get INPUT(): GainNode {
    return this.input;
  }

  /**
   * Connector for output.
   */
  public get OUTPUT(): GainNode {
    return this.output;
  }
}
