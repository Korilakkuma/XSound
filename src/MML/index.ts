import { OscillatorModule } from '../OscillatorModule';
import { OneshotModule } from '../OneshotModule';
import { NoiseModule } from '../NoiseModule';
import { TokenType, TokenMap, Token } from './Token';
import { Tree, MMLSyntaxError } from './Tree';
import { Sequence } from './Sequence';
import { Part } from './Part';

export type {
  Part,
  Sequence,
  MMLSyntaxError,
  Tree,
  TokenType,
  TokenMap,
  Token
};

/**
 * This class manages instance of `Part` for playing MML (Music Macro Language).
 * @constructor
 */
export class MML {
  private parts: Part[] = [];

  private startCallback?(sequence: Sequence, offset?: number): void;
  private stopCallback?(sequence: Sequence, offset?: number): void;
  private endedCallback?(): void;
  private errorCallback?(error: MMLSyntaxError): void;

  // eslint-disable-next-line no-useless-constructor
  constructor() {
  }

  /**
   * @param {function} startCallback This argument is invoked on starting MML.
   * @param {function} stopCallback This argument is invoked on stopping MML.
   * @param {function} endedCallback This argument is invoked on ending MML.
   * @param {function} errorCallback This argument is invoked on occurring MML syntax error.
   */
  public setup(callbacks?: {
    startCallback?(sequence: Sequence, offset?: number): void;
    stopCallback?(sequence: Sequence, offset?: number): void;
    endedCallback?(): void;
    errorCallback?(error: MMLSyntaxError): void;
  }): MML {
    if (callbacks?.startCallback) {
      this.startCallback = callbacks.startCallback;
    }

    if (callbacks?.stopCallback) {
      this.stopCallback = callbacks.stopCallback;
    }

    if (callbacks?.endedCallback) {
      this.endedCallback = callbacks.endedCallback;
    }

    if (callbacks?.errorCallback) {
      this.errorCallback = callbacks.errorCallback;
    }

    return this;
  }

  /**
   * This method parses MML string.
   * @param {OscillatorModule|OneshotModule|NoiseModule} source This argument selects sound source.
   * @param {Array<string>} mmls This argument is MML strings.
   * @param {number} offset This argument is in order to adjust index of one-shot audio.
   * @return {MML} Return value is for method chain.
   */
  public ready(params: {
    source: OscillatorModule | OneshotModule | NoiseModule;
    mmls: string[];
    offset?: number;
  }): MML {
    const { source, mmls, offset } = params;

    this.stop();
    this.clear();

    for (const mml of mmls) {
      this.parts.push(new Part({
        source       : source,
        mml          : mml,
        offset       : offset,
        startCallback: this.startCallback,
        stopCallback : this.stopCallback,
        endedCallback: this.endedCallback,
        errorCallback: this.errorCallback
      }));
    }

    return this;
  }

  /**
   * This method starts designated MML part. Moreover, this method schedules next sequence.
   * @param {number} partNumber This argument is part of MML.
   * @param {boolean} highlight This argument is `true` in case of surrounding by `span.x-highlight` HTML. The default value is `false`.
   * @return {MML} Return value is for method chain.
   */
  public start(partNumber: number, highlight?: boolean): MML {
    if ((partNumber >= 0) && (partNumber < this.parts.length)) {
      const part = this.parts[partNumber];

      part.start(highlight ?? false);
    }

    return this;
  }

  /**
   * This method stops the all of MML parts.
   * @return {MML} Return value is for method chain.
   */
  public stop(): MML {
    for (const part of this.parts) {
      part.stop();
    }

    return this;
  }

  /**
   * This method gets MML string.
   * @param {number} index This argument selects MML part.
   * @return {string}
   */
  public getMML(index: number): string {
    if ((index >= 0) && (index < this.parts.length)) {
      return this.parts[index].getMML();
    }

    return '';
  }

  /**
   * This method gets array that contains MML string.
   * @return {Array<string>}
   */
  public getMMLs(): string[] {
    return this.parts.map((part: Part) => part.getMML());
  }

  /**
   * This method determines whether sequences exist.
   * @return {boolean} If sequences exist, this value is `true`. Otherwise, this value is `false`.
   */
  public has(): boolean {
    return (this.parts.length > 0) && this.parts.every((part: Part) => part.has());
  }

  /**
   * This method gets array that contains instance of `Sequence`.
   * @param {number} index This argument selects MML part.
   * @return {Array<Sequence>}
   */
  public getSequences(index: number): Sequence[] {
    if ((index >= 0) && (index < this.parts.length)) {
      return this.parts[index].getSequences();
    }

    return [];
  }

  /**
   * This method gets array that contains instance of `Sequence` from the all of MML parts.
   * @return {Array<Array<Sequence>>}
   */
  public getAllSequences(): Sequence[][] {
    return this.parts.map((part: Part) => part.getSequences());
  }

  /**
   * This method determines whether MMLs are paused.
   * @return {boolean} If MMLs are paused, this value is `true`. Otherwise, this value is `false`.
   */
  public paused(): boolean {
    return (this.parts.length === 0) || this.parts.every((part: Part) => part.paused());
  }

  /**
   * This method gets or sets current sequence index.
   * This method is overloaded for type interface and type check.
   * @param {number} partNumber This argument is part of MML.
   * @param {number} sequenceIndex This argument is sequence index.
   *     If this argument is omitted, this method is getter for current sequence index.
   * @return {number|MML} Return value is for current sequence index. Otherwise, Return value is for method chain.
   */
  public currentIndex(partNumber: number): number;
  public currentIndex(partNumber: number, sequenceIndex: number): MML;
  public currentIndex(partNumber: number, sequenceIndex?: number): number | MML {
    if ((partNumber < 0) || (partNumber >= this.parts.length)) {
      return this;
    }

    if (sequenceIndex) {
      this.parts[partNumber].setCurrentIndex(sequenceIndex);
      return this;
    }

    return this.parts[partNumber].getCurrentIndex();
  }

  /**
   * This method clears instance of `Part`.
   * @return {MML} Return value is for method chain.
   */
  public clear(): MML {
    for (const part of this.parts) {
      part.stop();
    }

    // Garbage Collection
    this.parts.length = 0;

    return this;
  }

  /**
   * This method converts MML to ABC Notation.
   * @param {string} mml This argument is MML string.
   * @param {number} X This argument is file number in ABC Notation.
   * @param {string} T This argument is title in ABC Notation.
   * @param {string} M This argument is beat in ABC Notation.
   * @param {string} L This argument is note duration in ABC Notation.
   * @param {string} K This argument is tone in ABC Notation.
   * @return {string} This is returned as ABC Notation.
   */
  // TODO: Refactor to use syntax tree
  public toABC(mml: string, X?: number, T?: string, M?: string, L?: string, K?: string): string {
    let abc = '';

    abc += `X:${X ? X : 1}\n`;
    abc += `T:${T ? T : ''}\n`;
    abc += `M:${M ? M : '4/4'}\n`;
    abc += `L:${L ? L : '1/256'}\n`;
    abc += `K:${K ? K : ''}\n`;

    const notes = mml.match(/\s*(?:T\d+)\s*|\s*(?:O\d+)\s*|\s*(?:(?:[CDEFGABR][#+-]?)+(?:256|192|144|128|96|72|64|48|36|32|24|18|16|12|8|6|4|2|1)\.?)(?:&(?:[CDEFGABR][#+-]?)+(?:256|192|144|128|96|72|64|48|36|32|24|18|16|12|8|6|4|2|1)\.?)*\s*/gi);

    if (notes === null) {
      return abc;
    }

    let octave        = null;
    let totalDuration = 0;

    while (notes.length > 0) {
      const note = notes.shift()?.trim();

      if (!note) {
        return abc;
      }

      if (/T\d+/i.test(note)) {
        const Q = parseInt(note.slice(1), 10);

        if (Q <= 0) {
          return abc;
        }

        abc += `Q:1/4=${Q}\n`;
      } else if (/O\d+/i.test(note)) {
        octave = parseInt(note.slice(1), 10);

        if (octave < 0) {
          return abc;
        }
      } else if (/(?:(?:[CDEFGABR][#+-]?)+)(?:256|192|144|128|96|72|64|48|36|32|24|18|16|12|8|6|4|2|1)(?:&(?:[CDEFGABR][#+-]?)+(?:256|192|144|128|96|72|64|48|36|32|24|18|16|12|8|6|4|2|1)\.?)*/i.test(note)) {
        if (octave === null) {
          return abc;
        }

        let splittedNotes = null;

        if (note.includes('&')) {
          splittedNotes = note.split('&');
        } else {
          splittedNotes = [note];
        }

        let chord = '';

        while (splittedNotes.length > 0) {
          const splittedNote = splittedNotes.shift();

          if (!splittedNote) {
            return abc;
          }

          const duration = parseInt(splittedNote.replace(/^.+?(\d+)\.*$/, '$1'), 10);

          let n = '';
          let d = 0;

          switch (duration) {
            case 1:
              n = splittedNote.replace('1', '256');
              break;
            case 2:
              n = splittedNote.replace('2', '128');
              break;
            case 4:
              n = splittedNote.replace('4', '64');
              break;
            case 8:
              n = splittedNote.replace('8', '32');
              break;
            case 16:
              n = splittedNote.replace('16', '16');
              break;
            case 32:
              n = splittedNote.replace('32', '8');
              break;
            case 64:
              n = splittedNote.replace('64', '4');
              break;
            case 128:
              n = splittedNote.replace('128', '2');
              break;
            case 256:
              n = splittedNote.replace('256', '1');
              break;
              // Tuplet
            case 6:
              n = `(3${splittedNote.replace('6', '128')}`;
              d = 128 / 3;
              break;
            case 12:
              n = `(3${splittedNote.replace('12', '64')}`;
              d = 64 / 3;
              break;
            case 18:
              n = `(9${splittedNote.replace('18', '128')}`;
              d = 128 / 9;
              break;
            case 24:
              n = `(3${splittedNote.replace('24', '32')}`;
              d = 32 / 3;
              break;
            case 36:
              n = `(9${splittedNote.replace('36', '64')}`;
              d = 64 / 9;
              break;
            case 48:
              n = `(3${splittedNote.replace('48', '16')}`;
              d = 16 / 3;
              break;
            case 72:
              n = `(9${splittedNote.replace('72', '32')}`;
              d = 32 / 9;
              break;
            case 96:
              n = `(3${splittedNote.replace('96', '8')}`;
              d = 8 / 3;
              break;
            case 144:
              n = `(9${splittedNote.replace('144', '16')}`;
              d = 16 / 9;
              break;
            case 192:
              n = `(3${splittedNote.replace('192', '4')}`;
              d = 4 / 3;
              break;
            default:
              return abc;
          }

          if (n.includes('.')) {
            n = n.replace(/^(.+?)\d+\.+$/, `$1${1.5 * parseInt(n.replace(/^.+?(\d+)\.+$/, '$1'), 10)}`);
          }

          if (n.includes('(')) {
            totalDuration += parseInt(n.replace(/^.+?(\d+)\.*$/i, '$1'), 10);
          } else {
            totalDuration += d;
          }

          if (totalDuration >= 256) {
            n += ' | ';
            totalDuration = 0;
          }

          if (/R/i.test(n)) {
            abc += `${n} `;
            continue;
          }

          let o = '';

          switch (octave) {
            case 0:
              o = ',,,,';
              break;
            case 1:
              o = ',,,';
              break;
            case 2:
              o = ',,';
              break;
            case 3:
              o = ',';
              break;
            case 5:
              o = '\'';
              break;
            case 6:
              o = '\'\'';
              break;
            case 7:
              o = '\'\'\'';
              break;
            case 4 :
            default:
              break;
          }

          const matches = n.match(/^(\(\d+)?((?:[CDEFGAB][#+-]?)+)(.*)$/i);

          if (matches === null) {
            return abc;
          }

          const tuplet      = matches[1] ? matches[1] : '';
          const chordLength = matches[2].length;
          const restNote    = matches[3] ? matches[3] : '';

          let start = 0;

          if (tuplet.length > 0) {
            n = n.replace(/^(?:\(\d+)?((?:[CDEFGAB][#+-]?)+)(.*)$/i, '$1$2');
          }

          if (chordLength === 1) {
            chord += `${tuplet}${n.slice(0, 1)}${o}${restNote}`;
          } else if ((chordLength === 2) && /[#+-]/.test(n.charAt(1))) {
            chord += `${tuplet}${n.slice(1, 2)}${n.slice(0, 1)}${o}${restNote}`;
          } else {
            while (start < chordLength) {
              if (start === 0) {
                chord += `${tuplet}[`;
              }

              if (/[#+-]/.test(n.charAt(start + 1))) {
                chord += `${n.slice((start + 1), (start + 2))}${n.slice(start, (start + 1))}${o}`;
                start += 2;
              } else {
                chord += `${n.slice(start, (start + 1))}${o}`;
                start++;
              }

              if (start === chordLength) {
                chord += `]${restNote}`;
              }
            }
          }

          if (splittedNotes.length > 0) {
            chord += '&';
          } else {
            abc += `${chord} `;
          }
        }
      }
    }

    return abc.replace(/R/gi, 'z')
      .replace(/[#+]/g, '^')
      .replace(/-/g, '_')
      .replace(/&/g, '-')
      .replace(/\s{2}/g, ' ')
      .trim();
  }
}
