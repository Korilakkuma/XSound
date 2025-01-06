// HACK:
export type FrozenArray<T> = Array<T>;

export type Inputs     = FrozenArray<FrozenArray<Float32Array>>;
export type Outputs    = FrozenArray<FrozenArray<Float32Array>>;
export type Parameters = { [parameterName: string]: Float32Array };

/**
 * This class enables to use inline AudioWorklet.
 */
export abstract class AudioWorkletProcessor {
  protected port = new MessagePort();
  protected abstract process(inputs: Inputs, outputs: Outputs, parameters: Parameters): boolean;

  // eslint-disable-next-line no-useless-constructor
  constructor(_options?: AudioWorkletNodeOptions) {
  }
}

/**
 * This class extends `AudioWorkletProcessor`.
 */
export abstract class OverlapAddProcessor extends AudioWorkletProcessor {
  private static readonly RENDER_QUANTUM_SIZE = 128;

  protected numberOfInputs = 1;
  protected numberOfOutputs = 1;

  protected blockSize = 1024;
  protected hopSize = 128;
  protected numberOfOverlaps: number;

  private inputBuffers: Inputs;
  private inputBuffersHead: Inputs;
  private inputBuffersToSend: Inputs;

  private outputBuffers: Outputs;
  private outputBuffersToRetrieve: Outputs;

  constructor(options: AudioWorkletNodeOptions) {
    super(options);

    this.numberOfInputs  = options.numberOfInputs ?? 1;
    this.numberOfOutputs = options.numberOfOutputs ?? 1;

    if (options.processorOptions) {
      this.blockSize = options.processorOptions.blockSize ?? 1024;
    }

    this.numberOfOverlaps = this.blockSize / this.hopSize;

    this.inputBuffers       = new Array(this.numberOfInputs);
    this.inputBuffersHead   = new Array(this.numberOfInputs);
    this.inputBuffersToSend = new Array(this.numberOfInputs);

    for (let index = 0; index < this.numberOfInputs; index++) {
      this.allocateInputChannels(index, 1);
    }

    this.outputBuffers           = new Array(this.numberOfOutputs);
    this.outputBuffersToRetrieve = new Array(this.numberOfOutputs);

    for (let index = 0; index < this.numberOfOutputs; index++) {
      this.allocateOutputChannels(index, 1);
    }
  }

  protected abstract processOverlapAdd(inputs: Inputs, outputs: Outputs, parameters: Parameters): void;

  /** @override */
  protected override process(inputs: Inputs, outputs: Outputs, parameters: Parameters): boolean {
    this.reallocateChannelsIfNeeded(inputs, outputs);

    this.readInputs(inputs);
    this.shiftInputBuffers();
    this.prepareInputBuffersToSend();
    this.processOverlapAdd(this.inputBuffersToSend, this.outputBuffersToRetrieve, parameters);
    this.handleOutputBuffersToRetrieve();
    this.writeOutputs(outputs);
    this.shiftOutputBuffers();

    return true;
  }

  private reallocateChannelsIfNeeded(inputs: Inputs, outputs: Outputs): void {
    for (let index = 0; index < this.numberOfInputs; index++) {
      const numberOfChannels = inputs[index].length;

      if (numberOfChannels !== this.inputBuffers[index].length) {
        this.allocateInputChannels(index, numberOfChannels);
      }
    }

    for (let index = 0; index < this.numberOfOutputs; index++) {
      const numberOfChannels = outputs[index].length;

      if (numberOfChannels !== this.outputBuffers[index].length) {
        this.allocateOutputChannels(index, numberOfChannels);
      }
    }
  }

  private allocateInputChannels(index: number, numberOfChannels: number): void {
    this.inputBuffers[index] = new Array(numberOfChannels);

    for (let channelNumber = 0; channelNumber < numberOfChannels; channelNumber++) {
      this.inputBuffers[index][channelNumber] = new Float32Array(this.blockSize + OverlapAddProcessor.RENDER_QUANTUM_SIZE);
      this.inputBuffers[index][channelNumber].fill(0);
    }

    this.inputBuffersHead[index]   = new Array(numberOfChannels);
    this.inputBuffersToSend[index] = new Array(numberOfChannels);

    for (let channelNumber = 0; channelNumber < numberOfChannels; channelNumber++) {
      this.inputBuffersHead[index][channelNumber]   = this.inputBuffers[index][channelNumber].subarray(0, this.blockSize);
      this.inputBuffersToSend[index][channelNumber] = new Float32Array(this.blockSize);
    }
  }

  private allocateOutputChannels(index: number, numberOfChannels: number): void {
    this.outputBuffers[index] = new Array(numberOfChannels);

    for (let channelNumber = 0; channelNumber < numberOfChannels; channelNumber++) {
      this.outputBuffers[index][channelNumber] = new Float32Array(this.blockSize);
      this.outputBuffers[index][channelNumber].fill(0);
    }

    this.outputBuffersToRetrieve[index] = new Array(numberOfChannels);

    for (let channelNumber = 0; channelNumber < numberOfChannels; channelNumber++) {
      this.outputBuffersToRetrieve[index][channelNumber] = new Float32Array(this.blockSize);
      this.outputBuffersToRetrieve[index][channelNumber].fill(0);
    }
  }

  private readInputs(inputs: Inputs): void {
    if (inputs[0].length && (inputs[0][0].length === 0)) {
      for (let index = 0; index < this.numberOfInputs; index++) {
        for (let channelNumber = 0; channelNumber < this.inputBuffers[index].length; channelNumber++) {
          this.inputBuffers[index][channelNumber].fill(0, this.blockSize);
        }
      }

      return;
    }

    for (let index = 0; index < this.numberOfInputs; index++) {
      for (let channelNumber = 0; channelNumber < this.inputBuffers[index].length; channelNumber++) {
        this.inputBuffers[index][channelNumber].set(inputs[index][channelNumber], this.blockSize);
      }
    }
  }

  private writeOutputs(outputs: Outputs): void {
    for (let index = 0; index < this.numberOfOutputs; index++) {
      for (let channelNumber = 0; channelNumber < this.inputBuffers[index].length; channelNumber++) {
        outputs[index][channelNumber].set(this.outputBuffers[index][channelNumber].subarray(0, OverlapAddProcessor.RENDER_QUANTUM_SIZE));
      }
    }
  }

  private shiftInputBuffers(): void {
    for (let index = 0; index < this.numberOfInputs; index++) {
      for (let channelNumber = 0; channelNumber < this.inputBuffers[index].length; channelNumber++) {
        this.inputBuffers[index][channelNumber].copyWithin(0, OverlapAddProcessor.RENDER_QUANTUM_SIZE);
      }
    }
  }

  private shiftOutputBuffers(): void {
    for (let index = 0; index < this.numberOfOutputs; index++) {
      for (let channelNumber = 0; channelNumber < this.outputBuffers[index].length; channelNumber++) {
        this.outputBuffers[index][channelNumber].copyWithin(0, OverlapAddProcessor.RENDER_QUANTUM_SIZE);
        this.outputBuffers[index][channelNumber].subarray(this.blockSize - OverlapAddProcessor.RENDER_QUANTUM_SIZE).fill(0);
      }
    }
  }

  private prepareInputBuffersToSend(): void {
    for (let index = 0; index < this.numberOfInputs; index++) {
      for (let channelNumber = 0; channelNumber < this.inputBuffers[index].length; channelNumber++) {
        this.inputBuffersToSend[index][channelNumber].set(this.inputBuffersHead[index][channelNumber]);
      }
    }
  }

  private handleOutputBuffersToRetrieve(): void {
    for (let index = 0; index < this.numberOfOutputs; index++) {
      for (let channelNumber = 0; channelNumber < this.outputBuffers[index].length; channelNumber++) {
        for (let n = 0; n < this.blockSize; n++) {
          this.outputBuffers[index][channelNumber][n] += this.outputBuffersToRetrieve[index][channelNumber][n] / this.numberOfOverlaps;
        }
      }
    }
  }
}

/**
 * This function creates AudioWorklet script as Data URL.
 * @param {AudioWorkletGlobalScope.AudioWorkletProcessor} processor This argument is class that extends `AudioWorkletProcessor`.
 * @return {string} Return value is AudioWorklet script as Data URL.
 */
export function createModule(processor: new (options: AudioWorkletNodeOptions) => AudioWorkletProcessor): string {
  return `data:text/javascript,${encodeURIComponent(OverlapAddProcessor.toString())}; ${encodeURIComponent(processor.toString())}; registerProcessor('${processor.name}', ${processor.name})`;
}

/**
 * This function adds module as AudioWorklet.
 * @param {AudioContext} context This argument is instance of `AudioContext` for adding AudioWorklet module.
 * @param {AudioWorkletGlobalScope.AudioWorkletProcessor} processor This argument is class that extends `AudioWorkletProcessor`.
 * @param {WorkletOptions} options This argument is one of 'omit', 'same-origin', 'include'. The default value is 'same-origin'.
 * @return {Promise<void>} Return value is `Promise` that `addModule` returns.
 */
export function addAudioWorklet(context: AudioContext, processor: new (options: AudioWorkletNodeOptions) => AudioWorkletProcessor, options?: WorkletOptions): Promise<void> {
  return context.audioWorklet.addModule(createModule(processor), options);
}
