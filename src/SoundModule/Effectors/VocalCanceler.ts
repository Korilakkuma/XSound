import { Effector } from './Effector';
import { VocalCancelerProcessor } from './AudioWorkletProcessors/VocalCancelerProcessor';

// @ts-expect-error Because of import WebAssembly Module
import wasm from './AudioWorkletProcessors/WebAssemblyModules/vocalcanceler.wasm';

export type VocalCancelerAlgorithm = 'time' | 'spectrum';

export type VocalCancelerParams = {
  state?: boolean,
  algorithm?: VocalCancelerAlgorithm,
  depth?: number,
  minFrequency?: number,
  maxFrequency?: number,
  threshold?: number
};

/**
 * This private class is for Vocal Canceler.
 */
export class VocalCanceler extends Effector {
  private processor: AudioWorkletNode;

  private algorithm: VocalCancelerAlgorithm = 'time';
  private minFrequency = 200;
  private maxFrequency = 8000;
  private threshold = 0.05;

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   */
  constructor(context: AudioContext) {
    super(context);

    this.depth.gain.value = 0;

    this.processor = new AudioWorkletNode(this.context, VocalCancelerProcessor.name);

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
      // GainNode (Input) -> AudioWorkletNode (Vocal Canceler) -> GainNode (Output);
      this.input.connect(this.processor);
      this.processor.connect(this.output);
    } else {
      // GainNode (Input) -> GainNode (Output)
      this.input.connect(this.output);
    }

    return this.output;
  }

  /**
   * This method gets or sets parameters for vocal canceler.
   * @param {keyof VocalCancelerParams|VocalCancelerParams} params This argument is string if getter. Otherwise, setter.
   * @return {VocalCancelerParams[keyof VocalCancelerParams]|VocalCanceler} Return value is parameter for vocal canceler if getter.
   *     Otherwise, return value is for method chain.
   */
  public param(params: 'state'): boolean;
  public param(params: 'algorithm'): VocalCancelerAlgorithm;
  public param(params: 'depth'): number;
  public param(params: 'minFrequency'): number;
  public param(params: 'maxFrequency'): number;
  public param(params: 'threshold'): number;
  public param(params: VocalCancelerParams): VocalCanceler;
  public param(params: keyof VocalCancelerParams | VocalCancelerParams): VocalCancelerParams[keyof VocalCancelerParams] | VocalCanceler {
    if (typeof params === 'string') {
      switch (params) {
        case 'state': {
          return this.isActive;
        }

        case 'algorithm': {
          return this.algorithm;
        }

        case 'depth': {
          return this.depth.gain.value;
        }

        case 'minFrequency': {
          return this.minFrequency;
        }

        case 'maxFrequency': {
          return this.maxFrequency;
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

            const message: VocalCancelerParams = { state: value };

            this.processor.port.postMessage(message);
          }

          break;
        }

        case 'algorithm': {
          if (typeof value === 'string') {
            this.algorithm = value;

            const message: VocalCancelerParams = { algorithm: value };

            this.processor.port.postMessage(message);
          }

          break;
        }

        case 'depth': {
          if (typeof value === 'number') {
            this.depth.gain.value = value;

            const message: VocalCancelerParams = { depth: value };

            this.processor.port.postMessage(message);
          }

          break;
        }

        case 'minFrequency': {
          if (typeof value === 'number') {
            this.minFrequency = value;

            const message: VocalCancelerParams = { minFrequency: value };

            this.processor.port.postMessage(message);
          }

          break;
        }

        case 'maxFrequency': {
          if (typeof value === 'number') {
            this.maxFrequency = value;

            const message: VocalCancelerParams = { maxFrequency: value };

            this.processor.port.postMessage(message);
          }

          break;
        }

        case 'threshold': {
          if (typeof value === 'number') {
            this.threshold = value;

            const message: VocalCancelerParams = { threshold: value };

            this.processor.port.postMessage(message);
          }

          break;
        }
      }
    }

    return this;
  }

  /**
   * This method gets vocal canceler parameters as associative array.
   * @return {VocalCancelerParams}
   */
  public params(): Required<VocalCancelerParams> {
    return {
      state       : this.isActive,
      algorithm   : this.algorithm,
      depth       : this.depth.gain.value,
      minFrequency: this.minFrequency,
      maxFrequency: this.maxFrequency,
      threshold   : this.threshold
    };
  }
}
