import { AudioWorkletProcessor, Inputs, Outputs } from '../worklet';

/**
 * This class extends `AudioWorkletProcessor`.
 * Overrides `process` method for sound source (bypass).
 * @extends {AudioWorkletGlobalScope.AudioWorkletProcessor}
 */
export class AudioModuleProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
  }

  /** @override */
  protected override process(inputs: Inputs, outputs: Outputs): boolean {
    const input  = inputs[0];
    const output = outputs[0];

    if ((input.length > 0) && (input[0].length > 0)) {
      // @ts-ignore
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
