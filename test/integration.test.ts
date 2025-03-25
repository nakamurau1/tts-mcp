import path from 'path';
import { promises as fs } from 'fs';
import { exec, spawn } from 'child_process';
import util from 'util';
const execPromise = util.promisify(exec);

// 統合テストはデフォルトでは実行しない
// INTEGRATION_TEST=true jest integration.test.js で実行可能
const shouldRunIntegrationTests = process.env.INTEGRATION_TEST === 'true';

// デバッグのために環境変数をログに出力
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('INTEGRATION_TEST:', process.env.INTEGRATION_TEST);
console.log('Should run integration tests:', shouldRunIntegrationTests);

// テスト終了後に作成したファイルを削除する関数
async function cleanupFile(filePath: string): Promise<void> {
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
    const cmd = `node ${path.join(__dirname, '../dist/bin/tts-mcp.js')} -t "テスト音声です" -o ${outputFile}`;
    
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
    const cmd = `node ${path.join(__dirname, '../dist/bin/tts-mcp.js')} -f ${textFile} -o ${outputFile}`;
    
    await execPromise(cmd);
    
    // ファイルが生成されたか確認
    const stats = await fs.stat(outputFile);
    expect(stats.size).toBeGreaterThan(0);
    
    // テスト用テキストファイルを削除
    await cleanupFile(textFile);
  }, 30000); // タイムアウトを30秒に設定

  it('MCPサーバーが正常に起動して初期化される', async () => {
    // バージョン確認で基本的な起動テスト
    const versionCmd = `node ${path.join(__dirname, '../dist/bin/tts-mcp-server.js')} --version`;
    
    try {
      const versionCheck = await execPromise(versionCmd);
      expect(versionCheck.stdout.trim()).toMatch(/\d+\.\d+\.\d+/); // セマンティックバージョニング形式をチェック
    } catch (error) {
      fail(`バージョン確認コマンドの実行に失敗しました: ${error}`);
    }
    
    // ヘルプコマンドで基本的な動作確認
    const helpCmd = `node ${path.join(__dirname, '../dist/bin/tts-mcp-server.js')} --help`;
    
    try {
      const helpCheck = await execPromise(helpCmd);
      expect(helpCheck.stdout).toContain('Usage:'); // ヘルプメッセージが表示されることを確認
      expect(helpCheck.stdout).toContain('Options:'); // オプション一覧が表示されることを確認
    } catch (error) {
      fail(`ヘルプコマンドの実行に失敗しました: ${error}`);
    }
    
    // サーバープロセスを起動して監視
    const serverProcess = spawn('node', [path.join(__dirname, '../dist/bin/tts-mcp-server.js')], {
      env: {
        ...process.env,
        OPENAI_API_KEY: process.env.OPENAI_API_KEY || 'dummy_key_for_test'
      }
    });
    
    let stderrData = '';
    
    serverProcess.stderr.on('data', (data) => {
      stderrData += data.toString();
    });
    
    // サーバーの初期化を待つ
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      // サーバープロセスが起動していることを確認
      expect(serverProcess.killed).toBe(false);
      
      // stderr出力に必要な初期化情報が含まれていることを確認
      expect(stderrData).toContain('モデル='); // サーバーがモデル情報を出力したか確認
      
      // エラーメッセージが出力されていないことを確認
      // 注意: dummy_key_for_testを使用しているため、APIキーエラーは出るかもしれない
      if (!process.env.OPENAI_API_KEY) {
        expect(stderrData).toContain('API key'); // APIキーエラーは許容
      } else {
        expect(stderrData).not.toContain('エラー:'); // その他のエラーがないことを確認
      }
    } finally {
      // 必ずサーバープロセスを終了
      serverProcess.kill('SIGTERM');
    }
  }, 15000); // タイムアウトを15秒に設定
});
