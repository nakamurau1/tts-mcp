#!/usr/bin/env node

// 環境変数の読み込み
import 'dotenv/config';
import { Command } from 'commander';
import { startMcpServer } from '../src/mcp-server';
import packageJson from '../package.json';
import { promises as fs } from 'fs';
import path from 'path';
import { MCPServerConfig } from '../src/types';

// stderrのみに出力する関数（stdoutはMCP通信用に残す）
function log(message: string): void {
  process.stderr.write(`${message}\n`);
}

// コマンドラインオプションの設定
const program = new Command();
program
  .name('tts-mcp-server')
  .description('OpenAI Text to Speech MCPサーバー')
  .version(packageJson.version)
  
  .option('-m, --model <model>', '使用するモデル', 'tts-1' as const)
  .option('-v, --voice <voice>', '音声キャラクター', 'alloy' as const)
  .option('-f, --format <format>', '音声フォーマット', 'mp3' as const)
  .option('--api-key <key>', 'OpenAI APIキー（環境変数OPENAI_API_KEYでも設定可能）')
  .option('--log-file <path>', 'ログファイルパス', path.join(process.cwd(), 'tts-mcp.log'))
  
  .addHelpText('after', `
例:
  $ tts-mcp-server
  $ tts-mcp-server --model tts-1 --voice nova --format mp3
  $ tts-mcp-server --voice echo

サポートされている音声:
  alloy, ash, ballad, coral, echo, fable, onyx, nova, sage, shimmer, verse

サポートされているモデル:
  tts-1, tts-1-hd, gpt-4o-mini-tts

サポートされているフォーマット:
  mp3, opus, aac, flac, wav, pcm
  `);

// エラーによる終了時にメッセージを表示
process.on('uncaughtException', (error) => {
  log(`致命的なエラー: ${error.message}`);
  process.exit(1);
});

// コマンドラインオプションの解析
program.parse(process.argv);

// 設定を取得
const options = program.opts();

// OpenAI APIキーを環境変数からも取得
const apiKey = options.apiKey || process.env.OPENAI_API_KEY;
if (!apiKey) {
  log('エラー: OpenAI APIキーが設定されていません。--api-keyオプションか環境変数OPENAI_API_KEYを設定してください。');
  process.exit(1);
}

// サーバー設定
const serverConfig: MCPServerConfig = {
  model: options.model,
  voice: options.voice,
  format: options.format,
  apiKey: apiKey,
  logFile: options.logFile
};

// MCPサーバー起動
startMcpServer(serverConfig).catch(error => {
  log(`MCPサーバー起動エラー: ${error.message}`);
  process.exit(1);
});
