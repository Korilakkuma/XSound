import type { Connectable, Statable } from '../../interfaces';

/**
 * This class is superclass for stereo effector classes.
 * Also, this class is used for implementing custom stereo effector.
 */
export abstract class StereoEffector implements Connectable, Statable {
  protected context: AudioContext;
  protected input: GainNode;
  protected output: GainNode;

  protected lfos: [OscillatorNode, OscillatorNode];
  protected depths: [GainNode, GainNode];
  protected rates: [AudioParam, AudioParam];

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
    this.lfos   = [context.createOscillator(), context.createOscillator()];
    this.depths = [context.createGain(), context.createGain()];
    this.rates  = [this.lfos[0].frequency, this.lfos[1].frequency];
  }

  /**
   * This method starts LFO. Namely, this method starts effector.
   * @param {number} startTime This argument is in order to schedule parameter.
   */
  public start(startTime?: number): void {
    if (!this.isActive || !this.paused) {
      return;
    }

    this.lfos[0].start(startTime ?? this.context.currentTime);
    this.lfos[1].start(startTime ?? this.context.currentTime);

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
    const type0 = this.lfos[0].type;
    const rate0 = this.lfos[0].frequency.value;
    const type1 = this.lfos[1].type;
    const rate1 = this.lfos[1].frequency.value;

    // Destroy instance of `OscillatorNode`
    this.lfos[0].stop((stopTime ?? this.context.currentTime) + (releaseTime ?? 0));
    this.lfos[1].stop((stopTime ?? this.context.currentTime) + (releaseTime ?? 0));

    // Create instance of `OscillatorNode` again
    this.lfos[0] = this.context.createOscillator();
    this.lfos[1] = this.context.createOscillator();

    // Restore parameters
    this.lfos[0].type            = type0;
    this.lfos[0].frequency.value = rate0;
    this.lfos[1].type            = type1;
    this.lfos[1].frequency.value = rate1;

    this.rates[0] = this.lfos[0].frequency;
    this.rates[1] = this.lfos[1].frequency;

    this.paused = true;
  }

  /**
   * This method connects `AudioNode`s for effector.
   * @return {GainNode} Return value is for `connect` method chain.  */
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
   * @return {StereoEffector} Return value is for method chain.
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
   * @return {StereoEffector} Return value is for method chain.
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
