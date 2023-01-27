import { MMLScheduleWorkerEventData } from '../types';
import { createWorkerObjectURL } from '../worker';
import { OscillatorModule } from '../OscillatorModule';
import { OneshotModule } from '../OneshotModule';
import { NoiseModule } from '../NoiseModule';
import { MMLSyntaxError } from './Tree';
import { Tokenizer } from './Tokenizer';
import { TreeConstructor } from './TreeConstructor';
import { Sequencer } from './Sequencer';
import { Sequence } from './Sequence';
import { schedule } from './ScheduleWorker';

/**
 * This class starts and stops each MML part.
 * @constructor
 */
export class Part {
  private sequences: Sequence[] = [];
  private source: OscillatorModule|OneshotModule|NoiseModule;
  private mml: string;
  private syntaxTree: string;
  private previous: Sequence | null = null;
  private scheduleWorker: Worker | null = null;
  private currentIndex = 0;
  private currentPosition = 0;
  private offset = 0;
  private startCallback?(sequence: Sequence, offset?: number): void;
  private stopCallback?(sequence: Sequence, offset?: number): void;
  private endedCallback?(): void;
  private errorCallback?(error: MMLSyntaxError): void;

  /**
   * @param {OscillatorModule|OneshotModule|NoiseModule} source This argument selects sound source.
   * @param {string} mml This argument is MML string.
   * @param {number} offset This argument corrects index of one-shot audio.
   * @param {function} startCallback This argument is invoked on start musical note.
   * @param {function} stopCallback This argument is invoked on stop musical note.
   * @param {function} endedCallback This argument is invoked on ended.
   * @param {function} errorCallback This argument is invoked on syntax error.
   */
  constructor(params: {
    source: OscillatorModule | OneshotModule | NoiseModule;
    mml: string;
    offset?: number;
    startCallback?(sequence: Sequence, offset?: number): void;
    stopCallback?(sequence: Sequence, offset?: number): void;
    endedCallback?(): void;
    errorCallback?(error: MMLSyntaxError): void;
  }) {
    const {
      source,
      mml,
      offset,
      startCallback,
      stopCallback,
      endedCallback,
      errorCallback
    } = params;

    this.source = source;
    this.mml    = mml;
    this.offset = offset ?? 0;

    if (startCallback) {
      this.startCallback = startCallback;
    }

    if (stopCallback) {
      this.stopCallback = stopCallback;
    }

    if (endedCallback) {
      this.endedCallback = endedCallback;
    }

    if (errorCallback) {
      this.errorCallback = errorCallback;
    }

    const tokenizer       = new Tokenizer(mml);
    const treeConstructor = new TreeConstructor(tokenizer);
    const sequencer       = new Sequencer(treeConstructor, this.errorCallback);
    const sequences       = sequencer.get();

    if (sequences) {
      this.sequences = sequences;
    }

    this.syntaxTree = sequencer.getSyntaxTree();

    const workerObjectURL = createWorkerObjectURL(schedule.toString());

    this.scheduleWorker = new Worker(workerObjectURL);

    window.URL.revokeObjectURL(workerObjectURL);
  }

  /**
   * This method starts MML. Moreover, this method schedules next sequence.
   * @param {boolean} highlight This argument is `true` in case of surrounding by `span.x-highlight` HTML.
   */
  public start(highlight: boolean): void {
    if (this.scheduleWorker === null) {
      return;
    }

    if (!this.sequences[this.currentIndex]) {
      this.stop();

      if (this.endedCallback) {
        this.endedCallback();
      }

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

      if (this.startCallback) {
        this.startCallback(sequence);
      }
    } else if (this.source instanceof OneshotModule) {
      const indexes = sequence.indexes
        .filter((index: number) => index !== -1)
        .map((index: number) => index + this.offset);

      this.source.ready(0, sequence.duration).start(indexes);

      if (this.startCallback) {
        this.startCallback(sequence, this.offset);
      }
    } else if (this.source instanceof NoiseModule) {
      this.source.start();

      if (this.startCallback) {
        this.startCallback(sequence);
      }
    }

    // ref: https://web.dev/audio-scheduling/
    const message: MMLScheduleWorkerEventData = {
      type    : 'schedule',
      duration: sequence.duration
    };

    this.scheduleWorker.postMessage(message);

    this.scheduleWorker.onmessage = (event: MessageEvent<MMLScheduleWorkerEventData>) => {
      if (event.data.type !== 'next') {
        return;
      }

      if (this.source instanceof OscillatorModule) {
        if (this.stopCallback) {
          this.stopCallback(sequence);
        }
      } else if (this.source instanceof OneshotModule) {
        if (this.stopCallback) {
          this.stopCallback(sequence, this.offset);
        }
      } else if (this.source instanceof NoiseModule) {
        this.source.stop();

        if (this.stopCallback) {
          this.stopCallback(sequence);
        }
      }

      // for stopping MML
      this.previous = sequence;

      // Start next sequence
      this.start(highlight);
    };
  }

  /**
   * This method stops MML.
   */
  public stop(): void {
    if (this.scheduleWorker === null) {
      return;
    }

    if (this.previous === null) {
      return;
    }

    if (this.source instanceof OscillatorModule) {
      this.source.stop();

      if (this.stopCallback) {
        this.stopCallback(this.previous);
      }
    } else if (this.source instanceof OneshotModule) {
      const indexes = this.previous.indexes
        .filter((index: number) => index !== -1)
        .map((index: number) => index + this.offset);

      this.source.stop(indexes);

      if (this.stopCallback) {
        this.stopCallback(this.previous, this.offset);
      }
    } else if (this.source instanceof NoiseModule) {
      this.source.stop();

      if (this.stopCallback) {
        this.stopCallback(this.previous);
      }
    }

    const message: MMLScheduleWorkerEventData = { type: 'stop' };

    this.scheduleWorker.postMessage(message);
    this.scheduleWorker.terminate();
    this.scheduleWorker = null;
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
   * This method is getter for string that represents MML syntax tree.
   */
  public getSyntaxTree(): string {
    return this.syntaxTree;
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
    return this.scheduleWorker === null;
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
