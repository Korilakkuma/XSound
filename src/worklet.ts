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

  protected blockSize = 2048;
  protected hopSize = 128;
  protected numberOfOverlaps: number;

  private inputBuffers: Inputs = [[]];
  private inputBuffersHead: Inputs = [[]];
  private inputBuffersToSend: Inputs = [[]];

  private outputBuffers: Outputs = [[]];
  private outputBuffersToRetrieve: Outputs = [[]];

  constructor(options: AudioWorkletNodeOptions) {
    super(options);

    if (options.processorOptions) {
      this.blockSize = options.processorOptions.blockSize ?? 2048;
    }

    this.numberOfOverlaps = this.blockSize / this.hopSize;

    this.allocateInputChannels(1);
    this.allocateOutputChannels(1);
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
    const inputNumberOfChannels = inputs[0].length;

    if (inputNumberOfChannels !== this.inputBuffers[0].length) {
      this.allocateInputChannels(inputNumberOfChannels);
    }

    const outputNumberOfChannels = outputs[0].length;

    if (outputNumberOfChannels !== this.outputBuffers[0].length) {
      this.allocateOutputChannels(outputNumberOfChannels);
    }
  }

  private allocateInputChannels(numberOfChannels: number): void {
    this.inputBuffers = [[]];

    for (let channelNumber = 0; channelNumber < numberOfChannels; channelNumber++) {
      this.inputBuffers[0][channelNumber] = new Float32Array(this.blockSize + OverlapAddProcessor.RENDER_QUANTUM_SIZE);
    }

    this.inputBuffersHead   = [[]];
    this.inputBuffersToSend = [[]];

    for (let channelNumber = 0; channelNumber < numberOfChannels; channelNumber++) {
      this.inputBuffersHead[0][channelNumber]   = this.inputBuffers[0][channelNumber].subarray(0, this.blockSize);
      this.inputBuffersToSend[0][channelNumber] = new Float32Array(this.blockSize);
    }
  }

  private allocateOutputChannels(numberOfChannels: number): void {
    this.outputBuffers = [[]];

    for (let channelNumber = 0; channelNumber < numberOfChannels; channelNumber++) {
      this.outputBuffers[0][channelNumber] = new Float32Array(this.blockSize);
    }

    this.outputBuffersToRetrieve = [[]];

    for (let channelNumber = 0; channelNumber < numberOfChannels; channelNumber++) {
      this.outputBuffersToRetrieve[0][channelNumber] = new Float32Array(this.blockSize);
    }
  }

  private readInputs(inputs: Inputs): void {
    if (inputs[0].length && (inputs[0][0].length === 0)) {
      for (let channelNumber = 0; channelNumber < this.inputBuffers[0].length; channelNumber++) {
        this.inputBuffers[0][channelNumber].fill(0, this.blockSize);
      }

      return;
    }

    for (let channelNumber = 0; channelNumber < this.inputBuffers[0].length; channelNumber++) {
      this.inputBuffers[0][channelNumber].set(inputs[0][channelNumber], this.blockSize);
    }
  }

  private writeOutputs(outputs: Outputs): void {
    for (let channelNumber = 0; channelNumber < this.inputBuffers[0].length; channelNumber++) {
      outputs[0][channelNumber].set(this.outputBuffers[0][channelNumber].subarray(0, OverlapAddProcessor.RENDER_QUANTUM_SIZE));
    }
  }

  private shiftInputBuffers(): void {
    for (let channelNumber = 0; channelNumber < this.inputBuffers[0].length; channelNumber++) {
      this.inputBuffers[0][channelNumber].copyWithin(0, OverlapAddProcessor.RENDER_QUANTUM_SIZE);
    }
  }

  private shiftOutputBuffers(): void {
    for (let channelNumber = 0; channelNumber < this.outputBuffers[0].length; channelNumber++) {
      this.outputBuffers[0][channelNumber].copyWithin(0, OverlapAddProcessor.RENDER_QUANTUM_SIZE);
      this.outputBuffers[0][channelNumber].subarray(this.blockSize - OverlapAddProcessor.RENDER_QUANTUM_SIZE).fill(0);
    }
  }

  private prepareInputBuffersToSend(): void {
    for (let channelNumber = 0; channelNumber < this.inputBuffers[0].length; channelNumber++) {
      this.inputBuffersToSend[0][channelNumber].set(this.inputBuffersHead[0][channelNumber]);
    }
  }

  private handleOutputBuffersToRetrieve(): void {
    for (let channelNumber = 0; channelNumber < this.outputBuffers[0].length; channelNumber++) {
      for (let n = 0; n < this.blockSize; n++) {
        this.outputBuffers[0][channelNumber][n] += this.outputBuffersToRetrieve[0][channelNumber][n] / this.numberOfOverlaps;
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
