import { AudioWorkletProcessor, Inputs, Outputs } from '../../../worklet';
import { StereoParams } from '../Stereo';

/**
 * This class extends `AudioWorkletProcessor`.
 * Override `process` method for stereo effect and Update parameters on message event.
 * @extends {AudioWorkletGlobalScope.AudioWorkletProcessor}
 */
export class StereoProcessor extends AudioWorkletProcessor {
  private isActive = false;

  constructor() {
    super();

    this.port.onmessage = (event: MessageEvent<StereoParams>) => {
      for (const [key, value] of Object.entries(event.data)) {
        switch (key) {
          case 'state': {
            if (typeof value === 'boolean') {
              this.isActive = value;
            }

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

    if (this.isActive) {
      const bufferSize = input[0].length;

      for (let i = 0; i < bufferSize; i++) {
        output[0][i] =  input[0][i];
        output[1][i] = -input[1][i];
      }
    } else {
      output[0].set(input[0]);
      output[1].set(input[1]);
    }

    return true;
  }
}
