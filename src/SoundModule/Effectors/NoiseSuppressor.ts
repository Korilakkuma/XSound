import { Effector } from './Effector';
import { NoiseSuppressorProcessor } from './AudioWorkletProcessors/NoiseSuppressorProcessor';

// @ts-expect-error Because of import WebAssembly Module
import wasm from './AudioWorkletProcessors/WebAssemblyModules/noisesuppressor.wasm';

export type NoiseSuppressorParams = {
  state?: boolean,
  threshold?: number
};

/**
 * This private class is for Noise Suppressor.
 */
export class NoiseSuppressor extends Effector {
  private processor: AudioWorkletNode;

  private threshold = 0;

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   */
  constructor(context: AudioContext) {
    super(context);

    this.processor = new AudioWorkletNode(this.context, NoiseSuppressorProcessor.name, {
      processorOptions: {
        frameSize: 1024
      }
    });

    fetch(wasm)
      .then(async (response) => {
        const wasm = await response.arrayBuffer();

        this.processor.port.postMessage(wasm);
        this.activate();
      })
      .catch((error: Error) => {
        throw error;
      });
  }

  /** @override */
  public override start(): void {
  }

  /** @override */
  public override stop(): void {
  }

  /** @override */
  public override connect(): GainNode {
    // Clear connection
    this.input.disconnect(0);
    this.processor.disconnect(0);

    if (this.isActive) {
      // GainNode (Input) -> AudioWorkletNode (Noise Suppressor) -> GainNode (Output);
      this.input.connect(this.processor);
      this.processor.connect(this.output);
    } else {
      // GainNode (Input) -> GainNode (Output)
      this.input.connect(this.output);
    }

    return this.output;
  }

  /**
   * This method gets or sets parameters for noise suppressor.
   * @param {keyof NoiseSuppressorParams|NoiseSuppressorParams} params This argument is string if getter. Otherwise, setter.
   * @return {NoiseSuppressorParams[keyof NoiseSuppressorParams]|NoiseSuppressor} Return value is parameter for noise suppressor if getter.
   *     Otherwise, return value is for method chain.
   */
  public param(params: 'state'): boolean;
  public param(params: 'threshold'): number;
  public param(params: NoiseSuppressorParams): NoiseSuppressor;
  public param(params: keyof NoiseSuppressorParams | NoiseSuppressorParams): NoiseSuppressorParams[keyof NoiseSuppressorParams] | NoiseSuppressor {
    if (typeof params === 'string') {
      switch (params) {
        case 'state': {
          return this.isActive;
        }

        case 'threshold': {
          return this.threshold;
        }
      }
    }

    for (const [key, value] of Object.entries(params)) {
      switch (key) {
        case 'state': {
          if (typeof value === 'boolean') {
            this.isActive = value;

            const message: NoiseSuppressorParams = { state: value };

            this.processor.port.postMessage(message);
          }

          break;
        }

        case 'threshold': {
          if (typeof value === 'number') {
            if (value >= 0) {
              this.threshold = value;

              const message: NoiseSuppressorParams = { threshold: value };

              this.processor.port.postMessage(message);
            }
          }

          break;
        }
      }
    }

    return this;
  }

  /** @override */
  public override params(): Required<NoiseSuppressorParams> {
    return {
      state    : this.isActive,
      threshold: this.threshold
    };
  }
}
