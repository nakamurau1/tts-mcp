// テスト環境のセットアップファイル

// 環境変数を設定
process.env.NODE_ENV = 'test';

// テスト用のAPIキーを設定
process.env.OPENAI_API_KEY = 'test_api_key';

// コンソール出力をモック化（必要に応じてコメント解除）
/*
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  // テスト中はコンソール出力を抑制
  console.log = jest.fn();
  console.error = jest.fn();
  console.warn = jest.fn();
});

afterAll(() => {
  // テスト終了後は元に戻す
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});
*/
