import type { Inputs, Outputs } from '../../../worklet';
import type { PitchShifterParams } from '../PitchShifter';

import { OverlapAddProcessor } from '../../../worklet';

interface PitchShifterProcessorebAssemblyInstance extends WebAssembly.Exports {
  memory: WebAssembly.Memory;
  pitchshifter: (pitch: number, speed: number, fftSize: number, timeCursor: number) => number;
  alloc_memory_inputs: (bufferSize: number) => number;
};

/**
 * This class extends `OverlapAddProcessor`.
 * Override `processOverlapAdd` method for pitch shifter and Update parameters on message event.
 */
export class PitchShifterProcessor extends OverlapAddProcessor {
  private instance: WebAssembly.Instance | null = null;

  private timeCursor = 0;

  private isActive = true;
  private pitch = 1;
  private speed = 1;

  private dry = 0;
  private wet = 1;

  constructor(options: AudioWorkletNodeOptions) {
    super(options);

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

            case 'speed': {
              if (typeof value === 'number') {
                this.speed = value;
              }

              break;
            }

            case 'dry': {
              if (typeof value === 'number') {
                this.dry = value;
              }

              break;
            }

            case 'wet': {
              if (typeof value === 'number') {
                this.wet = value;
              }

              break;
            }
          }
        }
      }
    };
  }

  /** @override */
  protected override processOverlapAdd(inputs: Inputs, outputs: Outputs): void {
    if (this.instance === null) {
      return;
    }

    const input  = inputs[0];
    const output = outputs[0];

    if (!this.isActive || ((this.pitch === 1) && (this.speed === 1))) {
      for (let channelNumber = 0; channelNumber < input.length; channelNumber++) {
        output[channelNumber].set(input[channelNumber]);
      }

      return;
    }

    // HACK:
    const wasm = this.instance.exports as PitchShifterProcessorebAssemblyInstance;

    const linearMemory = wasm.memory.buffer;

    for (let channelNumber = 0; channelNumber < input.length; channelNumber++) {
      const offsetInput = wasm.alloc_memory_inputs(this.frameSize);

      const inputLinearMemory = new Float32Array(linearMemory, offsetInput, this.frameSize);

      inputLinearMemory.set(input[channelNumber]);

      const offsetOutput = wasm.pitchshifter(this.pitch, this.speed, this.frameSize, this.timeCursor);

      const shiftedOutput = new Float32Array(linearMemory, offsetOutput, this.frameSize);

      if (this.dry === 0) {
        output[channelNumber].set(shiftedOutput);
      } else {
        for (let n = 0; n < this.frameSize; n++) {
          output[channelNumber][n] = (this.dry * input[channelNumber][n]) + (this.wet * shiftedOutput[n]);
        }
      }
    }

    this.timeCursor += this.hopSize;
  }
}
