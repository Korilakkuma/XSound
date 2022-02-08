import { Tokenizer } from '../../src/MML/Tokenizer';
import { TreeConstructor } from '../../src/MML/TreeConstructor';
import { Sequence } from '../../src/MML/Sequence';
import { Sequencer } from '../../src/MML/Sequencer';

describe(Sequencer.name, () => {
  // FIXME: `TreeConstructor` should be mocked
  const treeConstructor = new TreeConstructor(new Tokenizer('T60 O4 C4 R2. C4&C4'));

  const sequencer = new Sequencer(treeConstructor);

  describe(sequencer.get.name, () => {
    test('should return array that contains instance of `Sequence`', () => {
      expect(sequencer.get()).toStrictEqual([
        new Sequence({ id: '1', note: 'C4',    indexes: [39], frequencies: [261.6255653005991], start: 0, stop: 1, duration: 1 }),
        new Sequence({ id: '2', note: 'R2.',   indexes: [-1], frequencies: [0.000000000000000], start: 1, stop: 4, duration: 3 }),
        new Sequence({ id: '3', note: 'C4&C4', indexes: [39], frequencies: [261.6255653005991], start: 4, stop: 6, duration: 2 })
      ]);
    });
  });

  describe(sequencer.getSyntaxTree.name, () => {
    test('should return string that represents MML syntax tree', () => {
      expect(sequencer.getSyntaxTree().replace(/\s/g, '')).toBe('T(id=1)/\\60O(id=3)/\\4C(id=5)/\\4R(id=7)/\\2.C(id=9)/\\4&(id=11)/\\C(id=12)/\\4EOS');
    });
  });
});
