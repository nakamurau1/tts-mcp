module.exports = {
  // テスト環境（Node.js環境で実行）
  testEnvironment: 'node',
  
  // テスト対象ファイルのパターン
  testMatch: ['**/test/**/*.test.js'],
  
  // カバレッジレポートの設定
  collectCoverageFrom: [
    'src/**/*.js',
    '!**/node_modules/**',
    '!**/vendor/**'
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
  setupFiles: ['./test/setup.js']
};
