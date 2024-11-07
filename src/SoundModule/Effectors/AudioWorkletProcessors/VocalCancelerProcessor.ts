import type { Inputs, Outputs } from '../../../worklet';
import type { VocalCancelerParams } from '../VocalCanceler';

import { AudioWorkletProcessor } from '../../../worklet';

interface VocalCancelerProcessorWebAssemblyInstance extends WebAssembly.Exports {
  memory: WebAssembly.Memory;
  vocalcancelerL: (depth: number) => number;
  vocalcancelerR: (depth: number) => number;
  alloc_memory_inputLs: () => number;
  alloc_memory_inputRs: () => number;
};
/**
 * This class extends `AudioWorkletProcessor`.
 * Override `process` method for vocal canceler and Update parameters on message event.
 */
export class VocalCancelerProcessor extends AudioWorkletProcessor {
  private instance: WebAssembly.Instance | null = null;

  private depth = 0;
  private isActive = true;

  constructor() {
    super();

    this.port.onmessage = (event: MessageEvent<ArrayBuffer | VocalCancelerParams>) => {
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

            case 'depth': {
              if (typeof value === 'number') {
                this.depth = value;
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

    if ((input.length !== 2) || (output.length !== 2)) {
      for (let channelNumber = 0, numberOfChannels = input.length; channelNumber < numberOfChannels; channelNumber++) {
        output[channelNumber].set(input[channelNumber]);
      }

      return true;
    }

    if (!this.isActive || (this.depth === 0)) {
      for (let channelNumber = 0, numberOfChannels = input.length; channelNumber < numberOfChannels; channelNumber++) {
        output[channelNumber].set(input[channelNumber]);
      }

      return true;
    }

    // HACK:
    const wasm = this.instance.exports as VocalCancelerProcessorWebAssemblyInstance;

    const linearMemory = wasm.memory.buffer;

    const bufferSize = input[0].length;

    for (let i = 0; i < bufferSize; i++) {
      const offsetInputL = wasm.alloc_memory_inputLs();
      const offsetInputR = wasm.alloc_memory_inputRs();

      const inputLinearMemoryL = new Float32Array(linearMemory, offsetInputL, bufferSize);
      const inputLinearMemoryR = new Float32Array(linearMemory, offsetInputR, bufferSize);

      inputLinearMemoryL.set(input[0]);
      inputLinearMemoryR.set(input[1]);

      const offsetOutputL = wasm.vocalcancelerL(this.depth);
      const offsetOutputR = wasm.vocalcancelerR(this.depth);

      output[0].set(new Float32Array(linearMemory, offsetOutputL, bufferSize));
      output[1].set(new Float32Array(linearMemory, offsetOutputR, bufferSize));
    }

    return true;
  }
}
