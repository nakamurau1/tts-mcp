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
  .description('OpenAI Text to Speech MCP Server')
  .version(packageJson.version)
  
  .option('-m, --model <model>', 'TTS model to use', 'gpt-4o-mini-tts' as const)
  .option('-v, --voice <voice>', 'Voice character', 'alloy' as const)
  .option('-f, --format <format>', 'Audio format', 'mp3' as const)
  .option('--api-key <key>', 'OpenAI API key (can also be set via environment variable)')
  .option('--log-file <path>', 'Log file path', path.join(process.cwd(), 'tts-mcp.log'))
  
  .addHelpText('after', `
Examples:
  $ tts-mcp-server
  $ tts-mcp-server --model tts-1 --voice nova --format mp3
  $ tts-mcp-server --voice echo

Supported voices:
  alloy, ash, coral, echo, fable, onyx, nova, sage, shimmer

Supported models:
  tts-1, tts-1-hd, gpt-4o-mini-tts

Supported formats:
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
  log('Error: OpenAI API key is not set. Please provide it using --api-key option or OPENAI_API_KEY environment variable.');
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
  log(`MCP server startup error: ${error.message}`);
  process.exit(1);
});
