import { Token } from '/src/MML/Token';
import { Tokenizer } from '/src/MML/Tokenizer';
import { Tree, MMLSyntaxError } from '/src/MML/Tree';
import { TreeConstructor } from '/src/MML/TreeConstructor';

describe(TreeConstructor.name, () => {
  // FIXME: `Tokenizer` should be mocked
  const treeConstructor = new TreeConstructor(new Tokenizer('T60 O4 C4 R2. C4&C4'));

  describe(treeConstructor.parse.name, () => {
    test('should return array that contains syntax tree', () => {
      const syntaxTree = treeConstructor.parse();

      if (syntaxTree instanceof MMLSyntaxError) {
        expect(syntaxTree).toBeInstanceOf(MMLSyntaxError);
        return;
      }

      syntaxTree.reverse();

      expect(syntaxTree[0]).toStrictEqual(new Tree('14', new Token('14', 'EOS', undefined), null, null));
      expect(syntaxTree[1]).toStrictEqual(new Tree('12', new Token('12', 'NOTE', 'C'), new Tree('13', new Token('13', 'NUMBER', '4'), null, null), syntaxTree[0]));
      expect(syntaxTree[2]).toStrictEqual(new Tree('11', new Token('11', 'TIE', '&'), null, syntaxTree[1]));
      expect(syntaxTree[3]).toStrictEqual(new Tree('9', new Token('9', 'NOTE', 'C'), new Tree('10', new Token('10', 'NUMBER', '4'), null, null), syntaxTree[2]));
      expect(syntaxTree[4]).toStrictEqual(new Tree('7', new Token('7', 'REST', 'R'), new Tree('8', new Token('8', 'NUMBER', '2.'), null, null), syntaxTree[3]));
      expect(syntaxTree[5]).toStrictEqual(new Tree('5', new Token('5', 'NOTE', 'C'), new Tree('6', new Token('6', 'NUMBER', '4'), null, null), syntaxTree[4]));
      expect(syntaxTree[6]).toStrictEqual(new Tree('3', new Token('3', 'OCTAVE', 'O'), new Tree('4', new Token('4', 'NUMBER', '4'), null, null), syntaxTree[5]));
      expect(syntaxTree[7]).toStrictEqual(new Tree('1', new Token('1', 'TEMPO', 'T'), new Tree('2', new Token('2', 'NUMBER', '60'), null, null), syntaxTree[6]));
    });
  });

  describe(treeConstructor.free.name, () => {
    test('should be empty array', () => {
      treeConstructor.free();

      // eslint-disable-next-line dot-notation
      expect(treeConstructor['syntaxTree'].length).toBe(0);
    });
  });
});
