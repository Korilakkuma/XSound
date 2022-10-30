import { Effector } from './Effector';

export type NoiseGateParams = {
  state?: boolean,
  level?: number
};

/**
 * This private class is for Noise Gate.
 * @constructor
 * @extends {Effector}
 */
export class NoiseGate extends Effector {
  private level = 0;

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   */
  constructor(context: AudioContext) {
    super(context, 0);

    this.activate();
  }

  /** @override */
  public override start(): void {
    if (!this.isActive || !this.paused) {
      return;
    }

    this.paused = false;

    const bufferSize = this.processor.bufferSize;

    this.processor.onaudioprocess = (event: AudioProcessingEvent) => {
      const inputLs  = event.inputBuffer.getChannelData(0);
      const inputRs  = event.inputBuffer.getChannelData(1);
      const outputLs = event.outputBuffer.getChannelData(0);
      const outputRs = event.outputBuffer.getChannelData(1);

      for (let i = 0; i < bufferSize; i++) {
        outputLs[i] = this.gate(inputLs[i]);
        outputRs[i] = this.gate(inputRs[i]);
      }
    };
  }

  /** @override */
  public override stop(): void {
    // Effector's state is active ?
    if (!this.isActive) {
      return;
    }

    this.paused = true;

    // Stop `onaudioprocess` event
    this.processor.disconnect(0);
    this.processor.onaudioprocess = null;

    // Connect `AudioNode`s again
    this.connect();
  }

  /** @override */
  public override connect(): GainNode {
    // Clear connection
    this.input.disconnect(0);
    this.processor.disconnect(0);

    if (this.isActive) {
      // GainNode (Input) -> ScriptProcessorNode (Noise Gate) -> GainNode (Output);
      this.input.connect(this.processor);
      this.processor.connect(this.output);
    } else {
      // GainNode (Input) -> GainNode (Output)
      this.input.connect(this.output);
    }

    return this.output;
  }

  /**
   * This method gets or sets parameters for noise gate.
   * @param {keyof NoiseGateParams|NoiseGateParams} params This argument is string if getter. Otherwise, setter.
   * @return {NoiseGateParams[keyof NoiseGateParams]|NoiseGate} Return value is parameter for noise gate if getter.
   *     Otherwise, return value is for method chain.
   */
  public param(params: 'state'): boolean;
  public param(params: 'level'): number;
  public param(params: NoiseGateParams): NoiseGate;
  public param(params: keyof NoiseGateParams | NoiseGateParams): NoiseGateParams[keyof NoiseGateParams] | NoiseGate {
    if (typeof params === 'string') {
      switch (params) {
        case 'state':
          return this.isActive;
        case 'level':
          return this.level;
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
          }

          break;
        default:
          break;
      }
    }

    return this;
  }

  /** @override */
  public params(): Required<NoiseGateParams> {
    return {
      state: this.isActive,
      level: this.level
    };
  }

  /** @override */
  public override activate(): NoiseGate {
    super.activate();
    return this;
  }

  /** @override */
  public override deactivate(): NoiseGate {
    super.deactivate();
    return this;
  }

  /**
   * This method detects background noise and removes this.
   * @param {number} data This argument is amplitude (between -1 and 1).
   * @return {number} Return value is `0` or raw data.
   */
  private gate(data: number): number {
    if (!this.isActive) {
      return data;
    }

    // data : Amplitude is equal to argument.
    //    0 : Because signal is detected as background noise, amplitude is `0`.
    return (Math.abs(data) > this.level) ? data : 0;
  }
}
