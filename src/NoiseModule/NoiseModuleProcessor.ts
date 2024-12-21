import type { Inputs, Outputs } from '../worklet';
import type { NoiseType, NoiseModuleParams } from './';

import { AudioWorkletProcessor } from '../worklet';

interface NoiseModuleProcessorWebAssemblyInstance extends WebAssembly.Exports {
  memory: WebAssembly.Memory;
  whitenoise: (frame: number) => number;
  pinknoise: (frame: number) => number;
  browniannoise: (frame: number) => number;
};

export type NoiseProcessingMessageEventData = {
  processing?: boolean;
};

/**
 * This class extends `AudioWorkletProcessor`.
 * Overrides `process` method for generating noise.
 */
export class NoiseModuleProcessor extends AudioWorkletProcessor {
  private instance: WebAssembly.Instance | null = null;

  private processing = false;

  private type: NoiseType = 'whitenoise';

  constructor() {
    super();

    this.port.onmessage = (event: MessageEvent<ArrayBuffer | (NoiseModuleParams & NoiseProcessingMessageEventData)>) => {
      if (event.data instanceof ArrayBuffer) {
        WebAssembly.instantiate(event.data)
          .then(({ instance }) => {
            this.instance = instance;
          })
          .catch((error: Error) => {
            throw error;
          });
      } else {
        if (typeof event.data.processing === 'boolean') {
          this.processing = event.data.processing;
        }

        if (event.data.type) {
          this.type = event.data.type;
        }
      }
    };
  }

  /** @override */
  protected override process(_inputs: Inputs, outputs: Outputs): boolean {
    if (this.instance === null) {
      return false;
    }

    if (!this.processing) {
      // Prevent from calling private method for noise processor if not active
      return true;
    }

    const output = outputs[0];

    // HACK:
    const wasm = this.instance.exports as NoiseModuleProcessorWebAssemblyInstance;

    const linearMemory = wasm.memory.buffer;

    for (let channelNumber = 0, numberOfChannels = output.length; channelNumber < numberOfChannels; channelNumber++) {
      const bufferSize = output[channelNumber].length;

      switch (this.type) {
        case 'whitenoise': {
          const offsetOutput = wasm.whitenoise(currentFrame);

          output[channelNumber].set(new Float32Array(linearMemory, offsetOutput, bufferSize));
          break;
        }

        case 'pinknoise': {
          const offsetOutput = wasm.pinknoise(currentFrame);

          output[channelNumber].set(new Float32Array(linearMemory, offsetOutput, bufferSize));
          break;
        }

        case 'browniannoise': {
          const offsetOutput = wasm.browniannoise(currentFrame);

          output[channelNumber].set(new Float32Array(linearMemory, offsetOutput, bufferSize));
          break;
        }
      }
    }

    return true;
  }
}
