import type { Inputs, Outputs } from '../../../worklet';
import type { NoiseSuppressorParams } from '../NoiseSuppressor';

import { OverlapAddProcessor } from '../../../worklet';

interface NoiseSuppressorProcessorWebAssemblyInstance extends WebAssembly.Exports {
  memory: WebAssembly.Memory;
  noisesuppressor: (threshold: number, fftSize: number) => number;
  alloc_memory_inputs: (bufferSize: number) => number;
};

/**
 * This class extends `OverlapAddProcessor`.
 * Override `processOverlapAdd` method for noise suppressor and Update parameters on message event.
 */
export class NoiseSuppressorProcessor extends OverlapAddProcessor {
  private instance: WebAssembly.Instance | null = null;

  private threshold = 0;
  private isActive = true;

  constructor(options: AudioWorkletNodeOptions) {
    super(options);

    this.port.onmessage = async (event: MessageEvent<ArrayBuffer | NoiseSuppressorParams>) => {
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

            case 'threshold': {
              if (typeof value === 'number') {
                this.threshold = value;
              }

              break;
            }
          }
        }
      }
    };
  }

  /** @override */
  protected override processOverlapAdd(inputs: Inputs, outputs: Outputs): boolean {
    if (this.instance === null) {
      return false;
    }

    const input  = inputs[0];
    const output = outputs[0];

    if ((input.length === 0) || (output.length === 0)) {
      return true;
    }

    if (!this.isActive || (this.threshold === 0)) {
      for (let channelNumber = 0, numberOfChannels = input.length; channelNumber < numberOfChannels; channelNumber++) {
        output[channelNumber].set(input[channelNumber]);
      }

      return true;
    }

    // HACK:
    const wasm = this.instance.exports as NoiseSuppressorProcessorWebAssemblyInstance;

    const linearMemory = wasm.memory.buffer;

    for (let channelNumber = 0, numberOfChannels = input.length; channelNumber < numberOfChannels; channelNumber++) {
      const offsetInput = wasm.alloc_memory_inputs(this.blockSize);

      const inputLinearMemory = new Float32Array(linearMemory, offsetInput, this.blockSize);

      inputLinearMemory.set(input[channelNumber]);

      const offsetOutput = wasm.noisesuppressor(this.threshold, this.blockSize);

      output[channelNumber].set(new Float32Array(linearMemory, offsetOutput, this.blockSize));
    }

    return true;
  }
}
