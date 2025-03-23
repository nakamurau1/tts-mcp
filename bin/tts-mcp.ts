#!/usr/bin/env node

// 環境変数の読み込み
import 'dotenv/config';
import { Command } from 'commander';
import { run } from '../src/index';
import packageJson from '../package.json';

// コマンドラインオプションの設定
const program = new Command();
program
  .name('tts-mcp')
  .description('CLI tool using OpenAI Text to Speech API')
  .version(packageJson.version)
  
  .option('-t, --text <text>', 'Input text')
  .option('-f, --file <path>', 'Path to text file')
  .option('-o, --output <path>', 'Path to output audio file (defaults to output directory)')
  .option('-m, --model <n>', 'Model to use', 'gpt-4o-mini-tts' as const)
  .option('-v, --voice <n>', 'Voice character', 'alloy' as const)
  .option('-s, --speed <number>', 'Speech speed (0.25-4.0)', parseFloat, 1.0)
  .option('--format <format>', 'Output format', 'mp3' as const)
  .option('-i, --instructions <text>', 'Additional instructions for speech generation')
  .option('--api-key <key>', 'OpenAI API key (can also be set via environment variable)')
  
  .addHelpText('after', `
Examples:
  $ tts-mcp -t "Hello, world"
  $ tts-mcp -t "Hello, world" -o hello.mp3
  $ tts-mcp -f speech.txt -v nova
  $ tts-mcp -t "Welcome to the future" -m tts-1-hd -v echo -s 1.2 --format aac

Supported voices:
  alloy, ash, coral, echo, fable, onyx, nova, sage, shimmer

Supported models:
  tts-1, tts-1-hd, gpt-4o-mini-tts

Supported formats:
  mp3, opus, aac, flac, wav, pcm
  `);

// コマンドラインオプションの解析
program.parse(process.argv);

// 実行
run(program.opts());
