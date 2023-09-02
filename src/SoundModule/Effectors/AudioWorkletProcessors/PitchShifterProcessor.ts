import { AudioWorkletProcessor, Inputs, Outputs } from '/src/worklet';
import { PitchShifterParams } from '/src/SoundModule/Effectors/PitchShifter';

/**
 * This class extends `AudioWorkletProcessor`.
 * Override `process` method for pitch shifter and Update parameters on message event.
 * @extends {AudioWorkletGlobalScope.AudioWorkletProcessor}
 */
export class PitchShifterProcessor extends AudioWorkletProcessor {
  private static readonly GAIN_CORRECTION = 2 as const;

  /**
   * This class (static) method executes FFT.
   * @param {Float32Array} reals This argument is instance of `Float32Array` for real number.
   * @param {Float32Array} imags This argument is instance of `Float32Array` for imaginary number.
   * @param {number} size This argument is FFT size (power of two).
   */
  private static FFT(reals: Float32Array, imags: Float32Array, size: number): void {
    const pow2 = (n: number) => 2 ** n;

    const indexes = new Uint16Array(size);

    const numberOfStages = Math.log2(size);

    for (let stage = 1; stage <= numberOfStages; stage++) {
      for (let i = 0; i < pow2(stage - 1); i++) {
        const rest = numberOfStages - stage;

        for (let j = 0; j < pow2(rest); j++) {
          const n = i * pow2(rest + 1) + j;
          const m = pow2(rest) + n;
          const r = j * pow2(stage - 1);

          const areal = reals[n];
          const aimag = imags[n];
          const breal = reals[m];
          const bimag = imags[m];
          const creal = Math.cos((2.0 * Math.PI * r) / size);
          const cimag = -1 * Math.sin((2.0 * Math.PI * r) / size);

          if (stage < numberOfStages) {
            reals[n] = areal + breal;
            imags[n] = aimag + bimag;
            reals[m] = (creal * (areal - breal)) - (cimag * (aimag - bimag));
            imags[m] = (creal * (aimag - bimag)) + (cimag * (areal - breal));
          } else {
            reals[n] = areal + breal;
            imags[n] = aimag + bimag;
            reals[m] = areal - breal;
            imags[m] = aimag - bimag;
          }
        }
      }
    }

    for (let stage = 1; stage <= numberOfStages; stage++) {
      const rest = numberOfStages - stage;

      for (let i = 0; i < pow2(stage - 1); i++) {
        indexes[pow2(stage - 1) + i] = indexes[i] + pow2(rest);
      }
    }

    for (let k = 0; k < size; k++) {
      if (indexes[k] <= k) {
        continue;
      }

      const real = reals[indexes[k]];
      const imag = imags[indexes[k]];

      reals[indexes[k]] = reals[k];
      imags[indexes[k]] = imags[k];

      reals[k] = real;
      imags[k] = imag;
    }
  }

  /**
   * This class (static) method executes IFFT.
   * @param {Float32Array} reals This argument is instance of `Float32Array` for real number.
   * @param {Float32Array} imags This argument is instance of `Float32Array` for imaginary number.
   * @param {number} size This argument is IFFT size (power of two).
   */
  private static IFFT(reals: Float32Array, imags: Float32Array, size: number): void {
    const pow2 = (n: number) => 2 ** n;

    const indexes = new Uint16Array(size);

    const numberOfStages = Math.log2(size);

    for (let stage = 1; stage <= numberOfStages; stage++) {
      for (let i = 0; i < pow2(stage - 1); i++) {
        const rest = numberOfStages - stage;

        for (let j = 0; j < pow2(rest); j++) {
          const n = i * pow2(rest + 1) + j;
          const m = pow2(rest) + n;
          const r = j * pow2(stage - 1);

          const areal = reals[n];
          const aimag = imags[n];
          const breal = reals[m];
          const bimag = imags[m];
          const creal = Math.cos((2.0 * Math.PI * r) / size);
          const cimag = Math.sin((2.0 * Math.PI * r) / size);

          if (stage < numberOfStages) {
            reals[n] = areal + breal;
            imags[n] = aimag + bimag;
            reals[m] = (creal * (areal - breal)) - (cimag * (aimag - bimag));
            imags[m] = (creal * (aimag - bimag)) + (cimag * (areal - breal));
          } else {
            reals[n] = areal + breal;
            imags[n] = aimag + bimag;
            reals[m] = areal - breal;
            imags[m] = aimag - bimag;
          }
        }
      }
    }

    for (let stage = 1; stage <= numberOfStages; stage++) {
      const rest = numberOfStages - stage;

      for (let i = 0; i < pow2(stage - 1); i++) {
        indexes[pow2(stage - 1) + i] = indexes[i] + pow2(rest);
      }
    }

    for (let k = 0; k < size; k++) {
      if (indexes[k] <= k) {
        continue;
      }

      const real = reals[indexes[k]];
      const imag = imags[indexes[k]];

      reals[indexes[k]] = reals[k];
      imags[indexes[k]] = imags[k];

      reals[k] = real;
      imags[k] = imag;
    }

    for (let k = 0; k < size; k++) {
      reals[k] /= size;
      imags[k] /= size;
    }
  }

  private isActive = true;
  private pitch = 1;

  constructor() {
    super();

    this.port.onmessage = (event: MessageEvent<PitchShifterParams>) => {
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

          default: {
            break;
          }
        }
      }
    };
  }

  /** @override */
  protected override process(inputs: Inputs, outputs: Outputs): boolean {
    const input  = inputs[0];
    const output = outputs[0];

    if ((input.length === 0) || (output.length === 0)) {
      return true;
    }

    if (this.isActive) {
      const bufferSize = input[0].length;

      for (let channelNumber = 0, numberOfChannels = input.length; channelNumber < numberOfChannels; channelNumber++) {
        this.shift(input[channelNumber], output[channelNumber], bufferSize);
      }
    } else {
      output[0].set(input[0]);
      output[1].set(input[1]);
    }

    return true;
  }

  /**
   * This method shifts pitch.
   * @param {Float32Array} inputs This argument is instance of `Float32Array` as input.
   * @param {Float32Array} outputs This argument is instance of `Float32Array` as output.
   * @param {number} size This argument is FFT size (power of two).
   */
  private shift(inputs: Float32Array, outputs: Float32Array, fftSize: number): void {
    if (this.pitch === 1) {
      outputs.set(inputs);
      return;
    }

    const inputReals = new Float32Array(inputs);
    const inputImags = new Float32Array(fftSize);

    PitchShifterProcessor.FFT(inputReals, inputImags, fftSize);

    const outputReals = new Float32Array(fftSize);
    const outputImags = new Float32Array(fftSize);

    for (let i = 0; i < fftSize; i++) {
      const offset = Math.trunc(this.pitch * i);

      let eq = 1;

      if (i > (fftSize / 2)) {
        eq = 0;
      }

      if ((offset >= 0) && (offset < fftSize)) {
        outputReals[offset] += PitchShifterProcessor.GAIN_CORRECTION * eq * inputReals[i];
        outputImags[offset] += PitchShifterProcessor.GAIN_CORRECTION * eq * inputImags[i];
      }
    }

    PitchShifterProcessor.IFFT(outputReals, outputImags, fftSize);

    outputs.set(outputReals);
  }
}
