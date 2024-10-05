// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.ts', 'test/**/*.ts', 'mock/**/*.ts'],
    languageOptions: {
      'parser': tseslint.parser
    },
    linterOptions: {
      'reportUnusedDisableDirectives': 'error'
    },
    extends: [
      ...tseslint.configs.recommended
    ],
    rules: {
      'default-param-last': 'off',
      'dot-notation': 'error',
      'indent': ['error', 2, {
        'ignoredNodes': ['TemplateLiteral'],
        'SwitchCase': 1
      }],
      'key-spacing': 'off',
      'no-case-declarations': 'error',
      'no-console': 'warn',
      'no-constant-condition': 'off',
      'no-else-return': 'error',
      'no-multi-spaces': 'off',
      'no-unneeded-ternary': 'off',
      'no-unused-vars': ['off', { 'vars': 'all', 'args': 'after-used' }],
      'no-use-before-define': 'error',
      'no-useless-constructor': 'error',
      'no-var': 'warn',
      'prefer-promise-reject-errors': 'off',
      'quote-props': 'off',
      'quotes': ['error', 'single'],
      'radix': 'warn',
      'semi': ['error', 'always'],
      'space-before-function-paren': 'off',
      'template-curly-spacing': 'off',
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
      '@typescript-eslint/no-use-before-define': 'error'
    },
    settings: {
      'import/resolver': {
        'typescript': {}
      }
    }
  }
);
