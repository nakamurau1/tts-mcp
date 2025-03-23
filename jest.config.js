module.exports = {
  // テスト環境（Node.js環境で実行）
  testEnvironment: 'node',
  
  // TypeScript対応
  preset: 'ts-jest',
  
  // テスト対象ファイルのパターン
  testMatch: ['**/test/**/*.test.ts'],
  
  // テスト綴扱から除外するディレクトリとファイル
  modulePathIgnorePatterns: [
    '<rootDir>/dist/'
  ],
  
  // カバレッジレポートの設定
  collectCoverageFrom: [
    'src/**/*.ts',
    '!**/node_modules/**',
    '!**/vendor/**',
    '!**/*.d.ts'
  ],
  
  // モック対象のパス
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  
  // 各テスト実行の間にモックをリセット
  clearMocks: true,
  
  // テストのタイムアウト時間（ミリ秒）
  testTimeout: 10000,
  
  // カバレッジレポートの出力ディレクトリ
  coverageDirectory: 'coverage',
  
  // テスト前に実行するスクリプト
  setupFiles: ['./test/setup.ts'],
  
  // TypeScript設定
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json'
    }
  }
};
