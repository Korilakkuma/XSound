import { AudioWorkletProcessor, Inputs, Outputs } from '/src/worklet';
import { NoiseGateParams } from '/src/SoundModule/Effectors/NoiseGate';

/**
 * This class extends `AudioWorkletProcessor`.
 * Override `process` method for noise gate and Update parameters on message event.
 * @extends {AudioWorkletGlobalScope.AudioWorkletProcessor}
 */
export class NoiseGateProcessor extends AudioWorkletProcessor {
  private level = 0;
  private isActive = true;

  constructor() {
    super();

    this.port.onmessage = (event: MessageEvent<NoiseGateParams>) => {
      for (const [key, value] of Object.entries(event.data)) {
        switch (key) {
          case 'state': {
            if (typeof value === 'boolean') {
              this.isActive = value;
            }

            break;
          }

          case 'level': {
            if (typeof value === 'number') {
              this.level = value;
            }

            break;
          }

          default: {
            break;
          }
        }
      }
    };
  }

  /** @override */
  protected override process(inputs: Inputs, outputs: Outputs): boolean {
    const input  = inputs[0];
    const output = outputs[0];

    if ((input.length === 0) || (output.length === 0)) {
      return true;
    }

    const bufferSize = input[0].length;

    for (let channelNumber = 0, numberOfChannels = input.length; channelNumber < numberOfChannels; channelNumber++) {
      for (let i = 0; i < bufferSize; i++) {
        output[channelNumber][i] = this.gate(input[channelNumber][i]);
      }
    }

    return true;
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
