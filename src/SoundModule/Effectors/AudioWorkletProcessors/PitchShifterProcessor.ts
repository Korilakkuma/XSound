import type { Inputs, Outputs } from '../../../worklet';
import type { PitchShifterParams } from '../PitchShifter';

import { AudioWorkletProcessor } from '../../../worklet';

interface PitchShifterProcessorWebAssemblyInstance extends WebAssembly.Exports {
  memory: WebAssembly.Memory;
  pitchshifter: (pitch: number) => number;
  alloc_memory_inputs: () => number;
};

/**
 * This class extends `AudioWorkletProcessor`.
 * Override `process` method for pitch shifter and Update parameters on message event.
 */
export class PitchShifterProcessor extends AudioWorkletProcessor {
  private instance: WebAssembly.Instance | null = null;

  private isActive = true;
  private pitch = 1;

  constructor() {
    super();

    this.port.onmessage = async (event: MessageEvent<ArrayBuffer | PitchShifterParams>) => {
      if (event.data instanceof ArrayBuffer) {
        WebAssembly.instantiate(event.data)
          .then(({ instance }) => {
            this.instance = instance;
          })
          .catch((error: Error) => {
            throw error;
          });
      } else {
        for (const [key, value] of Object.entries(event.data)) {
          switch (key) {
            case 'state': {
              if (typeof value === 'boolean') {
                this.isActive = value;
              }

              break;
            }

            case 'pitch': {
              if (typeof value === 'number') {
                this.pitch = value;
              }

              break;
            }
          }
        }
      }
    };
  }

  /** @override */
  protected override process(inputs: Inputs, outputs: Outputs): boolean {
    if (this.instance === null) {
      return false;
    }

    const input  = inputs[0];
    const output = outputs[0];

    if ((input.length === 0) || (output.length === 0)) {
      return true;
    }

    if (!this.isActive || (this.pitch === 1)) {
      for (let channelNumber = 0, numberOfChannels = input.length; channelNumber < numberOfChannels; channelNumber++) {
        output[channelNumber].set(input[channelNumber]);
      }

      return true;
    }

    // HACK:
    const wasm = this.instance.exports as PitchShifterProcessorWebAssemblyInstance;

    const linearMemory = wasm.memory.buffer;

    const bufferSize = input[0].length;

    for (let channelNumber = 0, numberOfChannels = input.length; channelNumber < numberOfChannels; channelNumber++) {
      const inputOffset = wasm.alloc_memory_inputs();

      const inputLinearMemory = new Float32Array(linearMemory, inputOffset, bufferSize);

      inputLinearMemory.set(input[channelNumber]);

      const outputOffset = wasm.pitchshifter(this.pitch);

      output[channelNumber].set(new Float32Array(linearMemory, outputOffset, bufferSize));
    }

    return true;
  }
}
