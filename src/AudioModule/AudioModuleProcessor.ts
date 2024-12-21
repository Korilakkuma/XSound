import type { Inputs, Outputs } from '../worklet';

import { AudioWorkletProcessor } from '../worklet';

/**
 * This class extends `AudioWorkletProcessor`.
 * Overrides `process` method for sound source (bypass).
 */
export class AudioModuleProcessor extends AudioWorkletProcessor {
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    super();
  }

  /** @override */
  protected override process(inputs: Inputs, outputs: Outputs): boolean {
    const input  = inputs[0];
    const output = outputs[0];

    if ((input.length > 0) && (input[0].length > 0)) {
      if ((currentFrame % 16384) === 0) {
        // Fire `onmessage` event (that main thread has) every `16384` samples
        this.port.postMessage({});
      }
    }

    for (let channelNumber = 0, numberOfChannels = input.length; channelNumber < numberOfChannels; channelNumber++) {
      output[channelNumber].set(input[channelNumber]);
    }

    return true;
  }
}
