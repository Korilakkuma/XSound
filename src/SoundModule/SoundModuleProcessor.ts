import { AudioWorkletProcessor, Inputs, Outputs } from '/src/worklet';

/**
 * This class extends `AudioWorkletProcessor`.
 * Overrides `process` method for sound source (bypass).
 * However, this processor is not used.
 * @extends {AudioWorkletGlobalScope.AudioWorkletProcessor}
 */
export class SoundModuleProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
  }

  /** @override */
  protected override process(inputs: Inputs, outputs: Outputs): boolean {
    const input  = inputs[0];
    const output = outputs[0];

    for (let channelNumber = 0, numberOfChannels = input.length; channelNumber < numberOfChannels; channelNumber++) {
      output[channelNumber].set(input[channelNumber]);
    }

    return true;
  }
}
