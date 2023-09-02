import {
  EQUAL_TEMPERAMENT,
  QUARTER_NOTE,
  SHARP,
  HALF_UP,
  HALF_DOWN,
  DOT,
  isPitchChar,
  computeIndex,
  computeFrequency
} from '/src/XSound';
import { Token } from '/src/MML/Token';
import { Tree, MMLSyntaxError } from '/src/MML/Tree';
import { TreeConstructor } from '/src/MML/TreeConstructor';
import { Sequence } from '/src/MML/Sequence';

/**
 * This class converts syntax tree to array that contains musical note.
 * @constructor
 */
export class Sequencer {
  private sequences: Sequence[] = [];
  private treeConstructor: TreeConstructor;
  private syntaxTree = '';

  private timeOf4note = 0;
  private octave      = -1;
  private currentTime = 0;

  private errorCallback: (error: MMLSyntaxError) => void;

  /**
   * @param {TreeConstructor} treeConstructor This argument is instance of `TreeConstructor`.
   * @param {function} errorCallback This argument is invoked on error.
   */
  constructor(treeConstructor: TreeConstructor, errorCallback?: (error: MMLSyntaxError) => void) {
    this.treeConstructor = treeConstructor;

    if (errorCallback) {
      this.errorCallback = errorCallback;
    } else {
      this.errorCallback = (error: MMLSyntaxError) => {
        throw error;
      };
    }
  }

  /**
   * This method calculates pitch and music time from Parse Tree.
   * @return {Array<Sequence>} Return value is array that contains instance of `Sequence`.
   *     If error occurs, error handler is invoked. Return value is `undefined`.
   */
  public get(): Sequence[] | void {
    TreeConstructor.id = 0;

    const trees = this.treeConstructor.parse();

    if (!trees) {
      this.errorCallback(new MMLSyntaxError(new Token('1', 'UNKNOWN', '')));
      return;
    }

    if (trees instanceof MMLSyntaxError) {
      this.errorCallback(trees);
      return;
    }

    this.timeOf4note = 0;
    this.octave      = -1;
    this.currentTime = 0;

    let tree: Tree | null = trees[0];

    while (tree !== null) {
      if (!tree) {
        this.errorCallback(new MMLSyntaxError(new Token((this.sequences.length + 1).toString(10), 'UNKNOWN', '')));
        return;
      }

      if (tree instanceof MMLSyntaxError) {
        this.errorCallback(tree);
        return;
      }

      const operator = tree.operator;
      const type     = operator.type;

      const left = tree.left;

      const value = left !== null ? left.operator.value : -1;

      switch (type) {
        case 'TEMPO': {
          if (value <= 0) {
            this.errorCallback(new MMLSyntaxError(operator));
            return;
          }

          this.timeOf4note = 60 / value;

          tree = tree.right;
          break;
        }

        case 'OCTAVE': {
          if (value < 0) {
            this.errorCallback(new MMLSyntaxError(operator));
            return;
          }

          this.octave = value;

          tree = tree.right;
          break;
        }

        case 'NOTE':
        case 'REST':
        case 'TIE' : {
          const r = this.push(type === 'TIE' ? tree.right : tree);

          if (r instanceof MMLSyntaxError) {
            this.errorCallback(r);
            return;
          }

          if (type === 'TIE') {
            this.concat();

            tree = tree.right?.right ?? null;
          } else {
            tree = tree.right;
          }

          break;
        }

        case 'EOS': {
          tree = tree.right;
          break;
        }

        default: {
          this.errorCallback(new MMLSyntaxError(tree.operator));
          return;
        }
      }
    }

    this.syntaxTree = trees[0].toString();

    // Release Memory for improving MML performance
    this.treeConstructor.free();

    return this.sequences;
  }

  /**
   * This method returns string that represents MML syntax tree.
   * @return {string}
   */
  public getSyntaxTree(): string {
    return this.syntaxTree;
  }

  /**
   * This method constructs syntax tree.
   * @param {Tree|null} tree This argument is instance of `Tree` that is added to syntax tree.
   */
  private push(tree: Tree | null): Tree | void {
    if (tree === null) {
      return;
    }

    const left  = tree.left;
    const right = tree.right;

    // Not leaf
    if ((left === null) || (right === null)) {
      return;
    }

    // Not leaf
    const leftToken  = left.operator;
    const rightToken = right.operator;

    if ((leftToken === null) && (rightToken === null)) {
      // Traverse tree by recursive call
      this.push(left);
      this.push(right);
      return;
    }

    // Leaf
    const token  = tree.operator.token;
    const value  = leftToken.value;
    const digits = leftToken.token;

    const indexes: number[]     = [];
    const frequencies: number[] = [];

    if (!token) {
      return;
    }

    for (let i = 0, len = token.length; i < len; i++) {
      const note = token.charAt(i);

      if (!isPitchChar(note)) {
        continue;
      }

      let index = computeIndex(this.octave, note);

      // Sharp or Flat (Half up or Half down) ?
      switch (token.charAt(i + 1)) {
        case HALF_UP:
        case SHARP  : {
          index++;
          i++;
          break;
        }

        case HALF_DOWN: {
          index--;
          i++;
          break;
        }

        default: {
          // Normal (Natural)
          break;
        }
      }

      // in case of chord
      if (index >= indexes[0]) {
        index -= EQUAL_TEMPERAMENT;
      }

      if ((index !== -1) && (index < 0)) {
        // eslint-disable-next-line no-console
        console.assert();
        return;
      }

      indexes.push(index);
    }

    for (const index of indexes) {
      const frequency = computeFrequency(index);

      // Validation
      if (frequency < 0) {
        // eslint-disable-next-line no-console
        console.assert();
        return;
      }

      frequencies.push(frequency);
    }

    let duration = 0;

    switch (value) {
      case   1:
      case   2:
      case   4:
      case   8:
      case  16:
      case  32:
      case  64:
      case 128:
      case 256: {
        if (digits) {
          const numberOf4note = QUARTER_NOTE / value;

          // Dotted note ?
          if (digits.includes(DOT)) {
            duration += 1.5 * (numberOf4note * this.timeOf4note);
          } else {
            duration += numberOf4note * this.timeOf4note;
          }
        }

        break;
      }

      case 6: {
        // Triplet of half note
        duration += (2 * this.timeOf4note) / 3;
        break;
      }

      case 12: {
        // Triplet of quarter note
        duration += this.timeOf4note / 3;
        break;
      }

      case 18: {
        // Nonuplet of half note
        duration += (2 * this.timeOf4note) / 9;
        break;
      }

      case 24: {
        // Triplet of 8th note
        duration += (0.5 * this.timeOf4note) / 3;
        break;
      }

      case 36: {
        // Nonuplet of quarter note
        duration += this.timeOf4note / 9;
        break;
      }

      case 48: {
        // Triplet of 16th note
        duration += (0.25 * this.timeOf4note) / 3;
        break;
      }

      case 72: {
        // Nonuplet of 8th note
        duration += (0.5 * this.timeOf4note) / 9;
        break;
      }

      case 96: {
        // Triplet of 32th note
        duration += (0.125 * this.timeOf4note) / 3;
        break;
      }

      case 144: {
        // Nonuplet of 16th note
        duration += (0.25 * this.timeOf4note) / 9;
        break;
      }

      case 192: {
        // Triplet of 64th note
        duration += (0.0625 * this.timeOf4note) / 3;
        break;
      }

      default: {
        this.errorCallback(new MMLSyntaxError(leftToken));
        return;
      }
    }

    const id    = (this.sequences.length + 1).toString(10);
    const note  = `${token}${digits}`;
    const start = this.currentTime;
    const stop  = start + duration;

    this.sequences.push(new Sequence({ id, note, indexes, frequencies, start, stop, duration }));

    this.currentTime += duration;
  }

  /**
   * This method concatenates previous sequence and current sequence in case of tie.
   */
  private concat(): void {
    const current  = this.sequences.pop();
    const previous = this.sequences.pop();

    if (previous && current) {
      this.sequences.push(previous.concat(current));
    }
  }
}
