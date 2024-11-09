import '/mock/fetchMock';
import '/mock/instantiateStreamingMock';
import { Token } from '/src/MML/Token';
import { MMLSyntaxError } from '/src/MML/Tree';
import { Tokenizer } from '/src/MML/Tokenizer';
import { TreeConstructor } from '/src/MML/TreeConstructor';
import { Sequence } from '/src/MML/Sequence';
import { Sequencer } from '/src/MML/Sequencer';

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

    test.each`
        mml                       | expected
        ${'T0 O4 C4 R2. C4&C4'}   | ${{ type: 'TEMPO',   token: 'T' }}
        ${'T74 O-1 C4 R2. C4&C4'} | ${{ type: 'OCTAVE',  token: 'O' }}
        ${'T74 O4 C R2. C4&C4'}   | ${{ type: 'NOTE',    token: 'C' }}
        ${'T74 O4 C4 R C4&C4'}    | ${{ type: 'REST',    token: 'R' }}
        ${'T74 O4 C0 R2. C4&C4'}  | ${{ type: 'NUMBER',  token: '0' }}
        ${'T74 O4 C. R2. C4&C4'}  | ${{ type: 'NUMBER',  token: '.' }}
        ${'T74 O4 C4. R2. C4&'}   | ${{ type: 'NUMBER',  token: '&' }}
        ${'T74 O4 L4 R2. C4&C4'}  | ${{ type: 'UNKNOWN', token: 'L' }}
      `('"$mml" should invoke error handler with `$expected`', ({ mml, expected }) => {
      const treeConstructor = new TreeConstructor(new Tokenizer(mml));

      const sequencer = new Sequencer(treeConstructor, (error: MMLSyntaxError) => {
        expect(error).toBeInstanceOf(MMLSyntaxError);
        expect(error.token).toBeInstanceOf(Token);
        expect(error.token.type).toBe(expected.type);
        expect(error.token.token).toBe(expected.token);
      });

      sequencer.get();
    });
  });

  describe(sequencer.getSyntaxTree.name, () => {
    test('should return string that represents MML syntax tree', () => {
      expect(sequencer.getSyntaxTree().replace(/\s/g, '')).toBe('T(id=1)/\\60O(id=3)/\\4C(id=5)/\\4R(id=7)/\\2.C(id=9)/\\4&(id=11)/\\C(id=12)/\\4EOS');
    });
  });
});
