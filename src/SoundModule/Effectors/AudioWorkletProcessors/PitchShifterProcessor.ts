import type { Inputs, Outputs } from '../../../worklet';
import type { PitchShifterParams } from '../PitchShifter';

import { OverlapAddProcessor } from '../../../worklet';

/**
 * This class extends `OverlapAddProcessor`.
 * Override `processOverlapAdd` method for pitch shifter and Update parameters on message event.
 */
export class PitchShifterProcessor extends OverlapAddProcessor {
  private hanningWindow: Float32Array;

  private inverse: -1 | 0 | 1 = 0;
  private csize: number;
  private width: number;
  private table: number[];
  private bitReverser: number[];
  private out: Float32Array | null = null;
  private data: Float32Array | null = null;

  private spectrumComplexBuffer: Float32Array;
  private spectrumComplexBufferShifted: Float32Array;
  private timeComplexBuffer: Float32Array;
  private magnitudes: Float32Array;
  private peakIndexes: Int32Array;
  private numberOfPeaks = 0;
  private timeCursor = 0;

  private isActive = true;
  private pitch = 1;

  private static generateHanningWindow(size: number): Float32Array {
    const hanning = new Float32Array(size);

    for (let n = 0; n < size; n++) {
      if ((n % 2) === 0) {
        hanning[n] = 0.5 - (0.5 * Math.cos((2 * Math.PI * n) / size));
      } else {
        hanning[n] = 0.5 - (0.5 * Math.cos((2 * Math.PI * (n + 0.5)) / size));
      }
    }

    return hanning;
  }

  constructor(options: AudioWorkletNodeOptions) {
    super(options);

    this.hanningWindow = PitchShifterProcessor.generateHanningWindow(this.blockSize);

    this.csize = this.blockSize << 1;

    this.table = new Array(this.blockSize * 2);

    for (let i = 0; i < this.table.length; i += 2) {
      const angle = Math.PI * i / this.blockSize;

      this.table[i + 0] = 0 + Math.cos(angle);
      this.table[i + 1] = 0 - Math.sin(angle);
    }

    // Find size's power of two
    let power = 0;

    for (let t = 1; this.blockSize > t; t <<= 1) {
      ++power;
    }

    // Calculate initial step's width:
    //   * If we are full radix-4 - it is 2x smaller to give inital len=8
    //   * Otherwise it is the same as `power` to give len=4
    this.width = power % 2 === 0 ? power - 1 : power;

    // Pre-compute bit-reversal patterns
    this.bitReverser = new Array(1 << this.width);

    for (let i = 0; i < this.bitReverser.length; i++) {
      this.bitReverser[i] = 0;

      for (let shift = 0; shift < this.width; shift += 2) {
        const revShift = this.width - shift - 2;

        this.bitReverser[i] |= ((i >>> shift) & 3) << revShift;
      }
    }

    this.spectrumComplexBuffer        = new Float32Array(this.csize);
    this.spectrumComplexBufferShifted = new Float32Array(this.csize);

    this.timeComplexBuffer = new Float32Array(this.csize);

    this.magnitudes  = new Float32Array((this.blockSize / 2) + 1);
    this.peakIndexes = new Int32Array(this.magnitudes.length);

    this.numberOfPeaks = 0;
    this.timeCursor    = 0;

    this.port.onmessage = async (event: MessageEvent<PitchShifterParams>) => {
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
        }
      }
    };
  }

  /** @override */
  protected override processOverlapAdd(inputs: Inputs, outputs: Outputs): void {
    if (!this.isActive || (this.pitch === 1)) {
      for (let i = 0; i < this.numberOfInputs; i++) {
        for (let channelNumber = 0; channelNumber < inputs[i].length; channelNumber++) {
          outputs[i][channelNumber].set(inputs[i][channelNumber]);
        }
      }

      return;
    }

    for (let i = 0; i < this.numberOfInputs; i++) {
      for (let channelNumber = 0; channelNumber < inputs[i].length; channelNumber++) {
        const input  = inputs[i][channelNumber];
        const output = outputs[i][channelNumber];

        this.applyHanningWindow(input);

        this.realTransform(this.spectrumComplexBuffer, input);

        this.computeMagnitudes();
        this.findPeaks();
        this.shiftPeaks();

        this.completeSpectrum(this.spectrumComplexBufferShifted);
        this.inverseTransform(this.timeComplexBuffer, this.spectrumComplexBufferShifted);
        this.fromComplexArray(this.timeComplexBuffer, output);

        this.applyHanningWindow(output);
      }
    }

    this.timeCursor += this.hopSize;
  }

  private applyHanningWindow(input: Float32Array): void {
    for (let n = 0; n < this.blockSize; n++) {
      input[n] *= this.hanningWindow[n];
    }
  }

  private computeMagnitudes(): void {
    let i = 0;
    let j = 0;

    while (i < this.magnitudes.length) {
      const real = this.spectrumComplexBuffer[j + 0];
      const imag = this.spectrumComplexBuffer[j + 1];

      // no need to sqrt for peak finding
      this.magnitudes[i] = (real ** 2) + (imag ** 2);

      i += 1;
      j += 2;
    }
  }

  private findPeaks(): void {
    this.numberOfPeaks = 0;

    let i = 2;

    const end = this.magnitudes.length - 2;

    while (i < end) {
      const magnitude = this.magnitudes[i];

      if ((this.magnitudes[i - 1] >= magnitude) || (this.magnitudes[i - 2] >= magnitude)) {
        ++i;
        continue;
      }

      if ((this.magnitudes[i + 1] >= magnitude) || (this.magnitudes[i + 2] >= magnitude)) {
        ++i;
        continue;
      }

      this.peakIndexes[this.numberOfPeaks] = i;
      this.numberOfPeaks++;

      i += 2;
    }
  }

  private shiftPeaks(): void {
    // zero-fill new spectrum
    this.spectrumComplexBufferShifted.fill(0);

    for (let n = 0; n < this.numberOfPeaks; n++) {
      const peakIndex = this.peakIndexes[n];

      const peakIndexShifted = Math.round(peakIndex * this.pitch);

      if (peakIndexShifted > this.magnitudes.length) {
        break;
      }

      let startIndex = 0;
      let endIndex   = this.blockSize;

      if (n > 0) {
        const peakIndexBefore = this.peakIndexes[n - 1];

        startIndex = peakIndex - Math.floor((peakIndex - peakIndexBefore) / 2);
      }

      if (n < (this.numberOfPeaks - 1)) {
        const peakIndexAfter = this.peakIndexes[n + 1];

        endIndex = peakIndex + Math.ceil((peakIndexAfter - peakIndex) / 2);
      }

      const startOffset = startIndex - peakIndex;
      const endOffset = endIndex - peakIndex;

      for (let i = startOffset; i < endOffset; i++) {
        const binCountIndex = peakIndex + i;
        const binCountIndexShifted = peakIndexShifted + i;

        if (binCountIndexShifted >= this.magnitudes.length) {
          break;
        }

        const omegaDelta     = 2 * Math.PI * (binCountIndexShifted - binCountIndex) / this.blockSize;
        const phaseShiftReal = Math.cos(omegaDelta * this.timeCursor);
        const phaseShiftImag = Math.sin(omegaDelta * this.timeCursor);

        const indexReal = binCountIndex * 2;
        const indexImag = indexReal + 1;
        const valueReal = this.spectrumComplexBuffer[indexReal];
        const valueImag = this.spectrumComplexBuffer[indexImag];

        const valueShiftedReal = valueReal * phaseShiftReal - valueImag * phaseShiftImag;
        const valueShiftedImag = valueReal * phaseShiftImag + valueImag * phaseShiftReal;

        const indexShiftedReal = binCountIndexShifted * 2;
        const indexShiftedImag = indexShiftedReal + 1;

        this.spectrumComplexBufferShifted[indexShiftedReal] += valueShiftedReal;
        this.spectrumComplexBufferShifted[indexShiftedImag] += valueShiftedImag;
      }
    }
  }

  private fromComplexArray(complex: Float32Array, storage: Float32Array): Float32Array {
    const complexes = storage || new Float32Array(complex.length >>> 1);

    for (let i = 0; i < complex.length; i += 2) {
      complexes[i >>> 1] = complex[i];
    }

    return complexes;
  }

  private completeSpectrum(spectrum: Float32Array): void {
    const half = this.csize >>> 1;

    for (let i = 2; i < half; i += 2) {
      spectrum[this.csize - i + 0] = 0 + spectrum[i + 0];
      spectrum[this.csize - i + 1] = 0 - spectrum[i + 1];
    }
  }

  private realTransform(out: Float32Array, data: Float32Array): void {
    if (out === data) {
      return;
    }

    this.out  = out;
    this.data = data;

    this.inverse = 0;
    this.realTransform4();

    this.out  = null;
    this.data = null;
  }

  public inverseTransform(out: Float32Array, data: Float32Array): void {
    if (out === data) {
      return;
    }

    this.out  = out;
    this.data = data;

    this.inverse = 1;
    this.transform4();

    for (let n = 0; n < out.length; n++) {
      out[n] /= this.blockSize;
    }

    this.out  = null;
    this.data = null;
  };

  // radix-4 implementation
  private transform4(): void {
    if (this.out === null) {
      return;
    }

    // Initial step (permute and transform)
    let step = 1 << this.width;
    let len = (this.csize / step) << 1;
    let outOff;
    let t;

    if (len === 4) {
      for (outOff = 0, t = 0; outOff < this.csize; outOff += len, t++) {
        const off = this.bitReverser[t];
        this.singleTransform2(outOff, off, step);
      }
    } else {
      // len === 8
      for (outOff = 0, t = 0; outOff < this.csize; outOff += len, t++) {
        const off = this.bitReverser[t];
        this.singleTransform4(outOff, off, step);
      }
    }

    // Loop through steps in decreasing order
    const inverse = this.inverse ? -1 : 1;

    for (step >>= 2; step >= 2; step >>= 2) {
      len = (this.csize / step) << 1;

      const quarterLen = len >>> 2;

      // Loop through offsets in the data
      for (outOff = 0; outOff < this.csize; outOff += len) {
        // Full case
        const limit = outOff + quarterLen;

        for (let i = outOff, k = 0; i < limit; i += 2, k += step) {
          const A = i;
          const B = A + quarterLen;
          const C = B + quarterLen;
          const D = C + quarterLen;

          const Ar = this.out[A + 0];
          const Ai = this.out[A + 1];
          const Br = this.out[B + 0];
          const Bi = this.out[B + 1];
          const Cr = this.out[C + 0];
          const Ci = this.out[C + 1];
          const Dr = this.out[D + 0];
          const Di = this.out[D + 1];

          const MAr = Ar;
          const MAi = Ai;

          const tableBr = this.table[k];
          const tableBi = inverse * this.table[k + 1];
          const MBr = Br * tableBr - Bi * tableBi;
          const MBi = Br * tableBi + Bi * tableBr;

          const tableCr = this.table[2 * k];
          const tableCi = inverse * this.table[2 * k + 1];
          const MCr = Cr * tableCr - Ci * tableCi;
          const MCi = Cr * tableCi + Ci * tableCr;

          const tableDr = this.table[3 * k];
          const tableDi = inverse * this.table[3 * k + 1];
          const MDr = Dr * tableDr - Di * tableDi;
          const MDi = Dr * tableDi + Di * tableDr;

          const T0r = MAr + MCr;
          const T0i = MAi + MCi;
          const T1r = MAr - MCr;
          const T1i = MAi - MCi;
          const T2r = MBr + MDr;
          const T2i = MBi + MDi;
          const T3r = inverse * (MBr - MDr);
          const T3i = inverse * (MBi - MDi);

          const FAr = T0r + T2r;
          const FAi = T0i + T2i;

          const FCr = T0r - T2r;
          const FCi = T0i - T2i;

          const FBr = T1r + T3i;
          const FBi = T1i - T3r;

          const FDr = T1r - T3i;
          const FDi = T1i + T3r;

          this.out[A + 0] = FAr;
          this.out[A + 1] = FAi;
          this.out[B + 0] = FBr;
          this.out[B + 1] = FBi;
          this.out[C + 0] = FCr;
          this.out[C + 1] = FCi;
          this.out[D + 0] = FDr;
          this.out[D + 1] = FDi;
        }
      }
    }
  }

  private realTransform4(): void {
    if (this.out === null) {
      return;
    }

    let step = 1 << this.width;
    let len = (this.csize / step) << 1;
    let outOff;
    let t;

    if (len === 4) {
      for (outOff = 0, t = 0; outOff < this.csize; outOff += len, t++) {
        const off = this.bitReverser[t];
        this.singleRealTransform2(outOff, off >>> 1, step >>> 1);
      }
    } else {
      // len === 8
      for (outOff = 0, t = 0; outOff < this.csize; outOff += len, t++) {
        const off = this.bitReverser[t];
        this.singleRealTransform4(outOff, off >>> 1, step >>> 1);
      }
    }

    // Loop through steps in decreasing order
    const inverse = this.inverse ? -1 : 1;

    for (step >>= 2; step >= 2; step >>= 2) {
      len = (this.csize / step) << 1;

      const halfLen = len >>> 1;
      const quarterLen = halfLen >>> 1;
      const hquarterLen = quarterLen >>> 1;

      // Loop through offsets in the data
      for (outOff = 0; outOff < this.csize; outOff += len) {
        for (let i = 0, k = 0; i <= hquarterLen; i += 2, k += step) {
          const A = outOff + i;
          const B = A + quarterLen;
          const C = B + quarterLen;
          const D = C + quarterLen;

          const Ar = this.out[A + 0];
          const Ai = this.out[A + 1];
          const Br = this.out[B + 0];
          const Bi = this.out[B + 1];
          const Cr = this.out[C + 0];
          const Ci = this.out[C + 1];
          const Dr = this.out[D + 0];
          const Di = this.out[D + 1];

          // Middle values
          const MAr = Ar;
          const MAi = Ai;

          const tableBr = this.table[k];
          const tableBi = inverse * this.table[k + 1];
          const MBr = Br * tableBr - Bi * tableBi;
          const MBi = Br * tableBi + Bi * tableBr;

          const tableCr = this.table[2 * k];
          const tableCi = inverse * this.table[2 * k + 1];
          const MCr = Cr * tableCr - Ci * tableCi;
          const MCi = Cr * tableCi + Ci * tableCr;

          const tableDr = this.table[3 * k];
          const tableDi = inverse * this.table[3 * k + 1];
          const MDr = Dr * tableDr - Di * tableDi;
          const MDi = Dr * tableDi + Di * tableDr;

          // Pre-Final values
          const T0r = MAr + MCr;
          const T0i = MAi + MCi;
          const T1r = MAr - MCr;
          const T1i = MAi - MCi;
          const T2r = MBr + MDr;
          const T2i = MBi + MDi;
          const T3r = inverse * (MBr - MDr);
          const T3i = inverse * (MBi - MDi);

          const FAr = T0r + T2r;
          const FAi = T0i + T2i;

          const FBr = T1r + T3i;
          const FBi = T1i - T3r;

          this.out[A + 0] = FAr;
          this.out[A + 1] = FAi;
          this.out[B + 0] = FBr;
          this.out[B + 1] = FBi;

          // Output final middle point
          if (i === 0) {
            const FCr = T0r - T2r;
            const FCi = T0i - T2i;

            this.out[C + 0] = FCr;
            this.out[C + 1] = FCi;

            continue;
          }

          // Do not overwrite ourselves
          if (i === hquarterLen) {
            continue;
          }

          // In the flipped case:
          // MAi = -MAi
          // MBr=-MBi, MBi=-MBr
          // MCr=-MCr
          // MDr=MDi, MDi=MDr
          const ST0r = T1r;
          const ST0i = -T1i;
          const ST1r = T0r;
          const ST1i = -T0i;
          const ST2r = -inverse * T3i;
          const ST2i = -inverse * T3r;
          const ST3r = -inverse * T2i;
          const ST3i = -inverse * T2r;

          const SFAr = ST0r + ST2r;
          const SFAi = ST0i + ST2i;

          const SFBr = ST1r + ST3i;
          const SFBi = ST1i - ST3r;

          const SA = outOff + quarterLen - i;
          const SB = outOff + halfLen - i;

          this.out[SA + 0] = SFAr;
          this.out[SA + 1] = SFAi;
          this.out[SB + 0] = SFBr;
          this.out[SB + 1] = SFBi;
        }
      }
    }
  }

  // radix-2 implementation
  private singleTransform2(outOff: number, off: number, step: number): void {
    if ((this.out === null) || (this.data === null)) {
      return;
    }

    const evenR = this.data[off + 0];
    const evenI = this.data[off + 1];
    const oddR  = this.data[off + step + 0];
    const oddI  = this.data[off + step + 1];

    const leftR  = evenR + oddR;
    const leftI  = evenI + oddI;
    const rightR = evenR - oddR;
    const rightI = evenI - oddI;

    this.out[outOff + 0] = leftR;
    this.out[outOff + 1] = leftI;
    this.out[outOff + 2] = rightR;
    this.out[outOff + 3] = rightI;
  }

  // radix-4
  private singleTransform4(outOff: number, off: number, step: number): void {
    if ((this.out === null) || (this.data === null)) {
      return;
    }

    const inverse = this.inverse ? -1 : 1;

    const step2 = step * 2;
    const step3 = step * 3;

    const Ar = this.data[off + 0];
    const Ai = this.data[off + 1];
    const Br = this.data[off + step + 0];
    const Bi = this.data[off + step + 1];
    const Cr = this.data[off + step2 + 0];
    const Ci = this.data[off + step2 + 1];
    const Dr = this.data[off + step3 + 0];
    const Di = this.data[off + step3 + 1];

    const T0r = Ar + Cr;
    const T0i = Ai + Ci;

    const T1r = Ar - Cr;
    const T1i = Ai - Ci;
    const T2r = Br + Dr;
    const T2i = Bi + Di;
    const T3r = inverse * (Br - Dr);
    const T3i = inverse * (Bi - Di);

    const FAr = T0r + T2r;
    const FAi = T0i + T2i;

    const FBr = T1r + T3i;
    const FBi = T1i - T3r;

    const FCr = T0r - T2r;
    const FCi = T0i - T2i;

    const FDr = T1r - T3i;
    const FDi = T1i + T3r;

    this.out[outOff + 0] = FAr;
    this.out[outOff + 1] = FAi;
    this.out[outOff + 2] = FBr;
    this.out[outOff + 3] = FBi;
    this.out[outOff + 4] = FCr;
    this.out[outOff + 5] = FCi;
    this.out[outOff + 6] = FDr;
    this.out[outOff + 7] = FDi;
  }

  // radix-2 implementation
  private singleRealTransform2(outOff: number, off: number, step: number): void {
    if ((this.out === null) || (this.data === null)) {
      return;
    }

    const evenR = this.data[off + 0];
    const oddR  = this.data[off + step];

    const leftR  = evenR + oddR;
    const rightR = evenR - oddR;

    this.out[outOff + 0] = leftR;
    this.out[outOff + 1] = 0;
    this.out[outOff + 2] = rightR;
    this.out[outOff + 3] = 0;
  }

  // radix-4
  private singleRealTransform4(outOff: number, off: number, step: number): void {
    if ((this.out === null) || (this.data === null)) {
      return;
    }

    const inverse = this.inverse ? -1 : 1;

    const step2 = step * 2;
    const step3 = step * 3;

    const Ar = this.data[off + 0];
    const Br = this.data[off + step];
    const Cr = this.data[off + step2];
    const Dr = this.data[off + step3];

    const T0r = Ar + Cr;
    const T1r = Ar - Cr;
    const T2r = Br + Dr;
    const T3r = inverse * (Br - Dr);

    const FAr = T0r + T2r;

    const FBr = T1r;
    const FBi = -T3r;

    const FCr = T0r - T2r;

    const FDr = T1r;
    const FDi = T3r;

    this.out[outOff + 0] = FAr;
    this.out[outOff + 1] = 0;
    this.out[outOff + 2] = FBr;
    this.out[outOff + 3] = FBi;
    this.out[outOff + 4] = FCr;
    this.out[outOff + 5] = 0;
    this.out[outOff + 6] = FDr;
    this.out[outOff + 7] = FDi;
  }
}
