// @ts-check

const eslint   = require('@eslint/js');
const tseslint = require('typescript-eslint');

module.exports = tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.ts', 'test/**/*.ts', 'mock/**/*.ts'],
    plugins: {
      '@typescript-lint': tseslint.plugin
    },
    languageOptions: {
      'parser': tseslint.parser
    },
    rules: {
      'default-param-last': 'off',
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
