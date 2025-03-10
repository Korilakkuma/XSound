import type { Inputs, Outputs } from '../../../worklet';
import type { NoiseGateParams } from '../NoiseGate';

import { AudioWorkletProcessor } from '../../../worklet';

interface NoiseGateProcessorWebAssemblyInstance extends WebAssembly.Exports {
  memory: WebAssembly.Memory;
  noisegate: (level: number) => number;
  alloc_memory_inputs: () => number;
};

/**
 * This class extends `AudioWorkletProcessor`.
 * Override `process` method for noise gate and Update parameters on message event.
 */
export class NoiseGateProcessor extends AudioWorkletProcessor {
  private instance: WebAssembly.Instance | null = null;

  private level = 0;
  private isActive = true;

  constructor() {
    super();

    this.port.onmessage = (event: MessageEvent<ArrayBuffer | NoiseGateParams>) => {
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

            case 'level': {
              if (typeof value === 'number') {
                this.level = value;
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

    if (!this.isActive || (this.level === 0)) {
      for (let channelNumber = 0, numberOfChannels = input.length; channelNumber < numberOfChannels; channelNumber++) {
        output[channelNumber].set(input[channelNumber]);
      }

      return true;
    }

    // HACK:
    const wasm = this.instance.exports as NoiseGateProcessorWebAssemblyInstance;;

    const linearMemory = wasm.memory.buffer;

    const bufferSize = input[0].length;

    for (let channelNumber = 0, numberOfChannels = input.length; channelNumber < numberOfChannels; channelNumber++) {
      const offsetInput = wasm.alloc_memory_inputs();

      const inputLinearMemory = new Float32Array(linearMemory, offsetInput, bufferSize);

      inputLinearMemory.set(input[channelNumber]);

      const offsetOutput = wasm.noisegate(this.level);

      output[channelNumber].set(new Float32Array(linearMemory, offsetOutput, bufferSize));
    }

    return true;
  }
}
