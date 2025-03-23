#!/usr/bin/env node

// 環境変数の読み込み
require('dotenv').config();

const { program } = require('commander');
const { run } = require('../dist/src/index');
const packageJson = require('../package.json');

// コマンドラインオプションの設定
program
  .name('tts-mcp')
  .description('OpenAI Text to Speech APIを使用したコマンドラインツール')
  .version(packageJson.version)
  
  .option('-t, --text <text>', 'テキスト入力')
  .option('-f, --file <path>', 'テキストファイルのパス')
  .option('-o, --output <path>', '出力音声ファイルのパス（指定しない場合はoutputディレクトリに生成）')
  .option('-m, --model <n>', '使用するモデル', 'tts-1')
  .option('-v, --voice <n>', '音声キャラクター', 'alloy')
  .option('-s, --speed <number>', '音声の速度（0.25-4.0）', parseFloat, 1.0)
  .option('--format <format>', '出力フォーマット', 'mp3')
  .option('-i, --instructions <text>', '音声生成の追加指示')
  .option('--api-key <key>', 'OpenAI APIキー（環境変数OPENAI_API_KEYでも設定可能）')
  
  .addHelpText('after', `
例:
  $ tts-mcp -t "こんにちは、世界"
  $ tts-mcp -t "こんにちは、世界" -o hello.mp3
  $ tts-mcp -f speech.txt -v nova
  $ tts-mcp -t "Welcome to the future" -m tts-1-hd -v echo -s 1.2 --format aac

サポートされている音声:
  alloy, ash, ballad, coral, echo, fable, onyx, nova, sage, shimmer, verse

サポートされているモデル:
  tts-1, tts-1-hd, gpt-4o-mini-tts

サポートされているフォーマット:
  mp3, opus, aac, flac, wav, pcm
  `);

// コマンドラインオプションの解析
program.parse(process.argv);

// 実行
run(program.opts());
