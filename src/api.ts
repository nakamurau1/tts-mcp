import { OpenAI } from 'openai';
import { promises as fs } from 'fs';
import { TTSOptions } from './types';

/**
 * OpenAI APIのクライアントを初期化します
 * @param {string} apiKey - OpenAI APIキー
 * @returns {OpenAI} OpenAIクライアントインスタンス
 */
export function initializeClient(apiKey: string): OpenAI {
  if (!apiKey) {
    throw new Error('OpenAI APIキーが設定されていません。--api-keyオプションか環境変数OPENAI_API_KEYを設定してください。');
  }
  
  return new OpenAI({
    apiKey: apiKey
  });
}

/**
 * テキストを音声に変換します
 * @param {TTSOptions} options - 変換オプション
 * @returns {Promise<void>}
 */
export async function textToSpeech(options: TTSOptions): Promise<void> {
  const client = initializeClient(options.apiKey);
  
  try {
    console.log('音声生成開始...');
    
    // サポートされている音声を確認
    const validVoices = ['alloy', 'ash', 'coral', 'echo', 'fable', 'onyx', 'nova', 'sage', 'shimmer'];
    const safeVoice = validVoices.includes(options.voice) ? options.voice : 'alloy';
      
    const response = await client.audio.speech.create({
      model: options.model,
      voice: safeVoice,
      input: options.text,
      speed: options.speed,
      response_format: options.format,
      ...(options.instructions ? { instructions: options.instructions } : {})
    });

    const buffer = Buffer.from(await response.arrayBuffer());
    
    if (!options.outputPath) {
      throw new Error('出力ファイルパスが指定されていません。');
    }
    
    await fs.writeFile(options.outputPath, buffer);
    
    console.log(`音声ファイルを生成しました: ${options.outputPath}`);
  } catch (error) {
    // APIエラーをより詳細に表示
    if ((error as any).response) {
      const apiError = (error as any).response.data;
      console.error('OpenAI API エラー:');
      console.error(`- ステータス: ${(error as any).response.status}`);
      console.error(`- メッセージ: ${apiError.error?.message || 'エラー詳細なし'}`);
      console.error(`- タイプ: ${apiError.error?.type || 'エラータイプなし'}`);
      
      // より詳細なエラー情報を構築して投げる
      throw new Error(`OpenAI API エラー: ${apiError.error?.message || 'APIリクエストが失敗しました'}`);
    } else {
      // 一般的なエラー
      console.error('エラー:', (error as Error).message);
      throw error;
    }
  }
}
