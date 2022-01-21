import { Token } from '../../src/MML/Token';
import { Tree } from '../../src/MML/Tree';

describe(Tree.name, () => {
  const left  = new Tree('2', new Token('2', 'NUMBER', '60'), null, null);
  const right = new Tree('3', new Token('3', 'EOS', undefined), null, null);
  const root  = new Tree('1', new Token('1', 'TEMPO', 'T'), left, right);

  const rightLeft = new Tree('5', new Token('5', 'NUMBER', '4'), null, null);
  const nextRight = new Tree('4', new Token('4', 'OCTAVE', 'O'), rightLeft, right);

  describe(root.concat.name, () => {
    test('should return concatenated right tree', () => {
      root.concat(nextRight);

      expect(root.right).toStrictEqual(nextRight);
    });
  });

  describe('operator', () => {
    test('should return operator (instance of `Token`)', () => {
      expect(root.operator).toStrictEqual(new Token('1', 'TEMPO', 'T'));
      expect(left.operator).toStrictEqual(new Token('2', 'NUMBER', '60'));
      expect(right.operator).toStrictEqual(new Token('3', 'EOS', undefined));
    });
  });

  describe('left and right', () => {
    test('should return left child and right child (instance of `Tree`)', () => {
      expect(root.left).toStrictEqual(left);
      expect(root.right).toStrictEqual(nextRight);
    });
  });

  describe(root.toString.name, () => {
    test('should return string that represents tree structure (syntax tree)', () => {
      expect(root.toString().replace(/\s/g, '')).toBe('T(id=1)/\\60(id=2)O(id=4)/\\4(id=5)EOS');
      root.clear();
      expect(root.toString().replace(/\s/g, '')).toBe('T(id=1)/\\60(id=2)O(id=4)/\\4(id=5)EOS');
    });
  });
});
