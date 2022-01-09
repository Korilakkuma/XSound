import { OscillatorModule } from '../OscillatorModule';
import { OneshotModule } from '../OneshotModule';
import { NoiseModule } from '../NoiseModule';
import { MMLSyntaxError } from './Tree';
import { Tokenizer } from './Tokenizer';
import { TreeConstructor } from './TreeConstructor';
import { Sequencer } from './Sequencer';
import { Sequence } from './Sequence';

/**
 * This class starts and stops each MML part.
 * @constructor
 */
export class Part {
  private sequences: Sequence[] = [];
  private source: OscillatorModule|OneshotModule|NoiseModule;
  private mml: string;
  private previous: Sequence | null = null;
  private timerId: number | null = null;
  private currentIndex = 0;
  private currentPosition = 0;
  private offset = 0;
  private callbacks: { [evenType: string]: (sequence?: Sequence | MMLSyntaxError, offset?: number) => void } = {};

  /**
   * @param {OscillatorModule|OneshotModule|NoiseModule} source This argument selects sound source.
   * @param {string} mml This argument is MML string.
   * @param {{ [evenType: string]: (sequence?: Sequence, offset?: number) => void }} callbacks This argument is callback functions.
   * @param {number} offset This argument corrects index of one-shot audio.
   */
  constructor(params: {
    source: OscillatorModule | OneshotModule | NoiseModule;
    mml: string;
    callbacks?: { [evenType: string]: (sequence?: Sequence | MMLSyntaxError, offset?: number) => void };
    offset?: number;
  }) {
    const { source, mml, callbacks, offset } = params;

    this.source = source;
    this.mml    = mml;
    this.offset = offset ?? 0;

    if (callbacks) {
      Object.keys(callbacks).forEach((eventType: string) => {
        const callback = callbacks[eventType];

        if (typeof callback === 'function') {
          this.callbacks[eventType] = callback;
        }
      });
    }

    const tokenizer       = new Tokenizer(mml);
    const treeConstructor = new TreeConstructor(tokenizer);
    const sequencer       = new Sequencer(treeConstructor);
    const sequences       = sequencer.get();

    if (sequences instanceof MMLSyntaxError) {
      if (this.callbacks.error) {
        this.callbacks.error(sequences);
      }
    } else {
      this.sequences = sequences;
    }
  }

  /**
   * This method starts MML. Moreover, this method schedules next sequence.
   * @param {boolean} highlight This argument is `true` in case of surrounding by `span.x-highlight` HTML.
   */
  public start(highlight: boolean): void {
    if (!this.sequences[this.currentIndex]) {
      this.stop();
      this.callbacks.ended();

      return;
    }

    const sequence = this.sequences[this.currentIndex++];

    if (highlight) {
      const prev    = this.mml.slice(0, this.currentPosition);
      const current = this.mml.slice(this.currentPosition).replace(sequence.note, `<span class="x-highlight">${sequence.note}</span>`);

      this.mml = `${prev}${current}`;

      this.currentPosition += this.mml.slice(this.currentPosition).indexOf('</span>') + '</span>'.length;
    } else {
      const prev    = this.mml.slice(0, this.currentPosition);
      const current = sequence.note;

      this.mml = `${prev}${current}`;

      this.currentPosition += current.length;
    }

    if (this.source instanceof OscillatorModule) {
      this.source.ready(0, sequence.duration).start(sequence.frequencies);
      this.callbacks.start(sequence);
    } else if (this.source instanceof OneshotModule) {
      for (let i = 0, len = sequence.indexes.length; i < len; i++) {
        if (sequence.indexes[i] !== -1) {
          this.source.ready(0, sequence.duration).start(sequence.indexes[i] + this.offset);
        }
      }

      this.callbacks.start(sequence, this.offset);
    } else if (this.source instanceof NoiseModule) {
      this.source.start();
      this.callbacks.start(sequence);
    }

    this.timerId = window.setTimeout(() => {
      if (this.source instanceof OscillatorModule) {
        this.callbacks.stop(sequence);
      } else if (this.source instanceof OneshotModule) {
        this.callbacks.stop(sequence, this.offset);
      } else if (this.source instanceof NoiseModule) {
        this.source.stop();
        this.callbacks.stop(sequence);
      }

      // for stopping MML
      this.previous = sequence;

      // Start next sequence
      this.start(highlight);
    }, (sequence.duration * 1000));
  }

  /**
   * This method stops MML.
   */
  public stop(): void {
    if (this.previous === null) {
      return;
    }

    if (this.source instanceof OscillatorModule) {
      this.source.stop();
      this.callbacks.stop(this.previous);
    } else if (this.source instanceof OneshotModule) {
      for (const index of this.previous.indexes) {
        if (index !== -1) {
          this.source.stop((index + this.offset));
        }
      }

      this.callbacks.stop(this.previous, this.offset);
    } else if (this.source instanceof NoiseModule) {
      this.source.stop();
      this.callbacks.stop(this.previous);
    }

    if (this.timerId) {
      window.clearTimeout(this.timerId);
    }

    this.timerId = null;
  }

  /**
   * This method is getter for MML string.
   */
  public getMML(): string {
    return this.mml;
  }

  /**
   * This method is getter for array that contains sequence.
   */
  public getSequences(): Sequence[] {
    return this.sequences;
  }

  /**
   * This method determines whether sequence exists.
   * @return {boolean} If sequence exists, this value is `true`. Otherwise, this value is `false`.
   */
  public has(): boolean {
    return this.sequences.length > 0;
  }

  /**
   * This method determines whether MML part is paused.
   * @return {boolean} If MML part are paused, this value is `true`. Otherwise, this value is `false`.
   */
  public paused(): boolean {
    return this.timerId === null;
  }

  /**
   * This method is getter for current sequence index.
   */
  public getCurrentIndex(): number {
    return this.currentIndex;
  }

  /**
   * This method is setter for current sequence index.
   * @param {number} index This argument is new sequence index.
   */
  public setCurrentIndex(index: number): void {
    if (index >= 0 && index < this.sequences.length) {
      this.currentIndex = index;
    }
  }
}
