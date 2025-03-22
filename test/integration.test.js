
const path = require('path');
const fs = require('fs').promises;
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

// 統合テストはデフォルトでは実行しない
// NODE_ENV=integration jest integration.test.js で実行可能
const shouldRunIntegrationTests = process.env.NODE_ENV === 'integration';

// テスト終了後に作成したファイルを削除する関数
async function cleanupFile(filePath) {
  try {
    await fs.access(filePath);
    await fs.unlink(filePath);
  } catch (error) {
    // ファイルが存在しない場合は何もしない
  }
}

// 統合テスト
(shouldRunIntegrationTests ? describe : describe.skip)('Integration Tests', () => {
  const outputFile = path.join(__dirname, 'test-output.mp3');
  
  // テスト後にファイルをクリーンアップ
  afterEach(async () => {
    await cleanupFile(outputFile);
  });

  it('CLIツールでテキストから音声ファイルを生成できる', async () => {
    // CLIコマンドを実行
    const cmd = `node ${path.join(__dirname, '../bin/tts-mcp.js')} -t "テスト音声です" -o ${outputFile}`;
    
    await execPromise(cmd);
    
    // ファイルが生成されたか確認
    const stats = await fs.stat(outputFile);
    expect(stats.size).toBeGreaterThan(0);
  }, 30000); // タイムアウトを30秒に設定

  it('CLIツールでテキストファイルから音声ファイルを生成できる', async () => {
    // テスト用テキストファイルを作成
    const textFile = path.join(__dirname, 'test-input.txt');
    await fs.writeFile(textFile, 'これはテストです。');
    
    // CLIコマンドを実行
    const cmd = `node ${path.join(__dirname, '../bin/tts-mcp.js')} -f ${textFile} -o ${outputFile}`;
    
    await execPromise(cmd);
    
    // ファイルが生成されたか確認
    const stats = await fs.stat(outputFile);
    expect(stats.size).toBeGreaterThan(0);
    
    // テスト用テキストファイルを削除
    await cleanupFile(textFile);
  }, 30000); // タイムアウトを30秒に設定

  // MCPサーバーのテストは複雑なため、ここでは省略
  // 実際の環境では、MCPクライアントを模擬するテストが必要
});
