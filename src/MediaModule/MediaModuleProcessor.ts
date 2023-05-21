import { AudioWorkletProcessor, Inputs, Outputs } from '../worklet';

/**
 * @constructor
 * @extends {AudioWorkletGlobalScope.AudioWorkletProcessor}
 */
export class MediaModuleProcessor extends AudioWorkletProcessor {
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
