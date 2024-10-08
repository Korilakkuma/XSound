import type { Inputs } from '../../worklet';

import { AudioWorkletProcessor } from '../../worklet';

export type RecorderProcessorMessageEventData = {
  inputs: Inputs
};

/**
 * This class extends `AudioWorkletProcessor`.
 * Overrides `process` method (sends input audio data to main thread) for recording audio.
 */
export class RecorderProcessor extends AudioWorkletProcessor {
  public static readonly BUFFER_SIZE = 128 as const;

  // eslint-disable-next-line no-useless-constructor
  constructor() {
    super();
  }

  /** @override */
  protected override process(inputs: Inputs): boolean {
    if ((inputs.length === 0) || (inputs[0].length === 0)) {
      return true;
    }

    const message: RecorderProcessorMessageEventData = { inputs };

    this.port.postMessage(message);

    return true;
  }
}
