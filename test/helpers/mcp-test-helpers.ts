import path from 'path';
import { promises as fs } from 'fs';
import { spawn, ChildProcess } from 'child_process';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

/**
 * MCPサーバーを起動する
 * @param {Object} options - 起動オプション
 * @param {string} options.apiKey - OpenAI APIキー
 * @param {string} options.voice - 使用する音声
 * @param {string} options.model - 使用するモデル
 * @returns {Promise<ChildProcess>} - サーバープロセス
 */
export async function startMcpServer(options: {
  apiKey?: string;
  voice?: string;
  model?: string;
  format?: string;
} = {}): Promise<ChildProcess> {
  const serverPath = path.join(__dirname, '../../dist/bin/tts-mcp-server.js');

  // コマンドライン引数を構築
  const args = [serverPath];

  if (options.voice) {
    args.push('--voice', options.voice);
  }

  if (options.model) {
    args.push('--model', options.model);
  }

  if (options.format) {
    args.push('--format', options.format);
  }

  // 環境変数を設定
  const env = {
    ...process.env,
    OPENAI_API_KEY: options.apiKey || process.env.OPENAI_API_KEY || 'dummy_key_for_test'
  };

  // サーバープロセスを起動
  const serverProcess = spawn('node', args, { env });

  // エラー処理
  serverProcess.on('error', (error) => {
    console.error('サーバープロセスエラー:', error);
  });

  // プロセスの標準エラー出力をキャプチャ（デバッグ用）
  serverProcess.stderr.on('data', (data) => {
    console.error('Server stderr:', data.toString());
  });

  // サーバーが起動するのを少し待つ
  await new Promise(resolve => setTimeout(resolve, 1000));

  return serverProcess;
}

/**
 * MCPクライアントを作成して接続する
 * @param {Object} options - クライアントオプション
 * @param {string} options.apiKey - OpenAI APIキー
 * @param {string} options.voice - 使用する音声
 * @param {string} options.model - 使用するモデル
 * @returns {Promise<Client>} - 接続済みMCPクライアント
 */
export async function createMcpClient(options: {
  apiKey?: string;
  voice?: string;
  model?: string;
  format?: string;
} = {}): Promise<Client> {
  const serverPath = path.join(__dirname, '../../dist/bin/tts-mcp-server.js');

  // コマンドライン引数を構築
  const args = [serverPath];

  if (options.voice) {
    args.push('--voice', options.voice);
  }

  if (options.model) {
    args.push('--model', options.model);
  }

  if (options.format) {
    args.push('--format', options.format);
  }

  // 環境変数を設定
  const env = {
    ...process.env,
    OPENAI_API_KEY: options.apiKey || process.env.OPENAI_API_KEY || 'dummy_key_for_test'
  };

  // トランスポートを作成
  const transport = new StdioClientTransport({
    command: 'node',
    args,
    env
  });

  // クライアントを作成
  const client = new Client(
    { name: 'test-client', version: '1.0.0' },
    { capabilities: { tools: {} } }
  );

  // 接続
  try {
    await client.connect(transport);
    return client;
  } catch (error) {
    console.error('クライアント接続エラー:', error);
    throw error;
  }
}

/**
 * テスト終了後にファイルを削除する
 * @param {string} filePath - 削除するファイルパス
 */
export async function cleanupFile(filePath: string): Promise<void> {
  try {
    await fs.access(filePath);
    await fs.unlink(filePath);
  } catch (error) {
    // ファイルが存在しない場合は何もしない
  }
}
