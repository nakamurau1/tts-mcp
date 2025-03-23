import { textToSpeech } from './api';
import { readTextFile, ensureOutputDirectory, validateOptions, getOutputPath } from './utils';
import { CommandLineOptions, OpenAIVoice, OpenAIOutputFormat, OpenAITTSModel } from './types';

/**
 * メインのアプリケーションロジック
 * @param {CommandLineOptions} options - コマンドラインオプション
 * @returns {Promise<void>}
 */
export async function run(options: CommandLineOptions): Promise<void> {
  try {
    // オプションの検証
    validateOptions(options);
    
    // 出力パスの取得
    const outputPath = getOutputPath(options);
    
    // 出力ディレクトリの確認
    await ensureOutputDirectory(outputPath);
    
    // テキストの取得（ファイルまたは直接入力）
    let text = options.text || '';
    if (options.file) {
      text = await readTextFile(options.file);
    }
    
    // テキストを音声に変換
    await textToSpeech({
      text,
      outputPath,
      model: options.model || 'tts-1',
      voice: options.voice || 'alloy',
      speed: options.speed || 1.0,
      format: options.format || 'mp3',
      instructions: options.instructions,
      apiKey: options.apiKey || process.env.OPENAI_API_KEY || ''
    });
    
    console.log('処理が完了しました。');
  } catch (error) {
    console.error('エラー:', (error as Error).message);
    process.exit(1);
  }
}
