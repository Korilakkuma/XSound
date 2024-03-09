import type { TokenType } from '/src/MML/Token';

import { Token, TokenMap } from '/src/MML/Token';

describe('TokenMap', () => {
  test('should correspond to `TokenType`', () => {
    TokenMap.forEach((type: TokenType, token: string | undefined) => {
      expect(TokenMap.get(token)).toBe(type);
    });
  });
});

describe(Token.name, () => {
  describe('`TokenType` is `TEMPO`', () => {
    const token = new Token('1', 'TEMPO', 'T');

    test('should return `TEMPO`', () => {
      expect(token.type).toBe('TEMPO');
    });

    test('should return `T60`', () => {
      expect(token.token).toBe('T');
    });

    test('should return `T60`', () => {
      expect(token.value).toBe(-1);
    });
  });

  describe('`TokenType` is `NUMBER`', () => {
    const token = new Token('2', 'NUMBER', '4');

    test('should return `NUMBER`', () => {
      expect(token.type).toBe('NUMBER');
    });

    test('should return `4`', () => {
      expect(token.token).toBe('4');
    });

    test('should return `4`', () => {
      expect(token.value).toBe(4);
    });
  });
});
