import { AudioWorkletProcessor, Inputs, Outputs } from '/src/worklet';
import { VocalCancelerParams } from '/src/SoundModule/Effectors/VocalCanceler';

/**
 * This class extends `AudioWorkletProcessor`.
 * Override `process` method for vocal canceler and Update parameters on message event.
 * @extends {AudioWorkletGlobalScope.AudioWorkletProcessor}
 */
export class VocalCancelerProcessor extends AudioWorkletProcessor {
  private depth = 0;
  private isActive = true;

  constructor() {
    super();

    this.port.onmessage = (event: MessageEvent<VocalCancelerParams>) => {
      for (const [key, value] of Object.entries(event.data)) {
        switch (key) {
          case 'state': {
            if (typeof value === 'boolean') {
              this.isActive = value;
            }

            break;
          }

          case 'depth': {
            if (typeof value === 'number') {
              this.depth = value;
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

    if ((input.length !== 2) || (output.length !== 2)) {
      output[0].set(input[0]);

      return true;
    }

    const bufferSize = input[0].length;

    for (let i = 0; i < bufferSize; i++) {
      output[0][i] = this.cancel(input[0][i], input[1][i]);
      output[1][i] = this.cancel(input[1][i], input[0][i]);
    }

    return true;
  }

  /**
   * This method removes vocal part from audio on playing.
   * @param {number} dataL This argument is gain level for Left channel.
   * @param {number} dataR This argument is gain level for Right channel.
   * @return {number} Return value is audio data except vocal part.
   */
  private cancel(dataL: number, dataR: number): number {
    if (this.isActive) {
      return dataL - (this.depth * dataR);
    }

    return dataL;
  }
}
