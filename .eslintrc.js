module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  plugins: ['@typescript-eslint'],
  env: {
    node: true,
    es6: true,
    jest: true,
  },
  rules: {
    // エラー
    'no-var': 'error',
    'no-console': ['error', { allow: ['log', 'warn', 'error'] }],
    'no-unused-vars': 'off', // TypeScriptのルールを使用
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-constant-condition': 'error',
    
    // 警告
    '@typescript-eslint/explicit-module-boundary-types': 'warn',
    'prefer-const': 'warn',
    
    // ルール無効化
    '@typescript-eslint/no-explicit-any': 'off',
  },
  ignorePatterns: ['dist', 'node_modules', 'coverage'],
};
