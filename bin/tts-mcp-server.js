#!/usr/bin/env node

// 環境変数の読み込み
require('dotenv').config();

const { program } = require('commander');
const { startMcpServer } = require('../src/mcp-server');
const packageJson = require('../package.json');

// コマンドラインオプションの設定
program
  .name('tts-mcp-server')
  .description('OpenAI Text to Speech MCPサーバー')
  .version(packageJson.version)
  
  .option('-m, --model <model>', '使用するモデル', 'tts-1')
  .option('-v, --voice <voice>', '音声キャラクター', 'alloy')
  .option('-f, --format <format>', '音声フォーマット', 'mp3')
  .option('--api-key <key>', 'OpenAI APIキー（環境変数OPENAI_API_KEYでも設定可能）')
  
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

// コマンドラインオプションの解析
program.parse(process.argv);

// 設定を取得
const options = program.opts();

// OpenAI APIキーを環境変数からも取得
const apiKey = options.apiKey || process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error('エラー: OpenAI APIキーが設定されていません。--api-keyオプションか環境変数OPENAI_API_KEYを設定してください。');
  process.exit(1);
}

// サーバー設定
const serverConfig = {
  model: options.model,
  voice: options.voice,
  format: options.format,
  apiKey: apiKey
};

// MCPサーバー起動
startMcpServer(serverConfig).catch(error => {
  console.error('MCPサーバー起動エラー:', error);
  process.exit(1);
});
