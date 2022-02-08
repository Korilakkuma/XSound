import { Sequence } from '../../src/MML/Sequence';

describe(Sequence.name, () => {
  const sequence = new Sequence({
    id         : '1',
    note       : 'A4',
    indexes    : [49],
    frequencies: [440],
    start      : 0,
    stop       : 0.5,
    duration   : 0.5
  });

  describe(sequence.concat.name, () => {
    test('should return concatenated sequence', () => {
      const concatenatedSequence = sequence.concat(sequence);

      expect(concatenatedSequence.note).toBe('A4&A4');
      expect(concatenatedSequence.indexes).toStrictEqual([49]);
      expect(concatenatedSequence.frequencies[0]).toBeCloseTo(440, 0);
      expect(concatenatedSequence.start).toBeCloseTo(0, 0);
      expect(concatenatedSequence.stop).toBeCloseTo(1, 0);
      expect(concatenatedSequence.duration).toBeCloseTo(1, 0);
    });
  });
});
