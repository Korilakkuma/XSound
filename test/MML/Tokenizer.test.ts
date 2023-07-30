import { Token } from '/src/MML/Token';
import { Tokenizer } from '/src/MML/Tokenizer';

describe(Tokenizer.name, () => {
  describe('get', () => {
    afterEach(() => {
      Tokenizer.id = 0;
    });

    test('should return instance of `Token`', () => {
      const tokenizer = new Tokenizer('T60 O4 C4 C4 G4 G4 A4 A4 G4&G4 R4.');

      expect(tokenizer.get()).toStrictEqual(new Token('1',  'TEMPO',  'T'));
      expect(tokenizer.get()).toStrictEqual(new Token('2',  'NUMBER', '60'));
      expect(tokenizer.get()).toStrictEqual(new Token('3',  'OCTAVE', 'O'));
      expect(tokenizer.get()).toStrictEqual(new Token('4',  'NUMBER', '4'));
      expect(tokenizer.get()).toStrictEqual(new Token('5',  'NOTE',   'C'));
      expect(tokenizer.get()).toStrictEqual(new Token('6',  'NUMBER', '4'));
      expect(tokenizer.get()).toStrictEqual(new Token('7',  'NOTE',   'C'));
      expect(tokenizer.get()).toStrictEqual(new Token('8',  'NUMBER', '4'));
      expect(tokenizer.get()).toStrictEqual(new Token('9',  'NOTE',   'G'));
      expect(tokenizer.get()).toStrictEqual(new Token('10', 'NUMBER', '4'));
      expect(tokenizer.get()).toStrictEqual(new Token('11', 'NOTE',   'G'));
      expect(tokenizer.get()).toStrictEqual(new Token('12', 'NUMBER', '4'));
      expect(tokenizer.get()).toStrictEqual(new Token('13', 'NOTE',   'A'));
      expect(tokenizer.get()).toStrictEqual(new Token('14', 'NUMBER', '4'));
      expect(tokenizer.get()).toStrictEqual(new Token('15', 'NOTE',   'A'));
      expect(tokenizer.get()).toStrictEqual(new Token('16', 'NUMBER', '4'));
      expect(tokenizer.get()).toStrictEqual(new Token('17', 'NOTE',   'G'));
      expect(tokenizer.get()).toStrictEqual(new Token('18', 'NUMBER', '4'));
      expect(tokenizer.get()).toStrictEqual(new Token('19', 'TIE',    '&'));
      expect(tokenizer.get()).toStrictEqual(new Token('20', 'NOTE',   'G'));
      expect(tokenizer.get()).toStrictEqual(new Token('21', 'NUMBER', '4'));
      expect(tokenizer.get()).toStrictEqual(new Token('22', 'REST',   'R'));
      expect(tokenizer.get()).toStrictEqual(new Token('23', 'NUMBER', '4.'));
      expect(tokenizer.get()).toStrictEqual(new Token('24', 'EOS',    undefined));
    });

    test('should return instance of `Token`', () => {
      const tokenizer = new Tokenizer('T6Z');

      expect(tokenizer.get()).toStrictEqual(new Token('1', 'TEMPO',   'T'));
      expect(tokenizer.get()).toStrictEqual(new Token('2', 'UNKNOWN', 'Z'));
    });
  });
});
