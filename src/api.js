const { OpenAI } = require('openai');
const fs = require('fs').promises;

/**
 * OpenAI APIのクライアントを初期化します
 * @param {string} apiKey - OpenAI APIキー
 * @returns {OpenAI} OpenAIクライアントインスタンス
 */
function initializeClient(apiKey) {
  if (!apiKey) {
    throw new Error('OpenAI APIキーが設定されていません。--api-keyオプションか環境変数OPENAI_API_KEYを設定してください。');
  }
  
  return new OpenAI({
    apiKey: apiKey
  });
}

/**
 * テキストを音声に変換します
 * @param {Object} options - 変換オプション
 * @param {string} options.text - 変換するテキスト
 * @param {string} options.outputPath - 出力ファイルパス
 * @param {string} options.model - 使用するモデル
 * @param {string} options.voice - 音声キャラクター
 * @param {number} options.speed - 音声の速度
 * @param {string} options.format - 出力フォーマット
 * @param {string} options.instructions - 音声生成の追加指示
 * @param {string} options.apiKey - OpenAI APIキー
 * @returns {Promise<void>}
 */
async function textToSpeech(options) {
  const client = initializeClient(options.apiKey);
  
  try {
    console.log('音声生成開始...');
    
    const response = await client.audio.speech.create({
      model: options.model,
      voice: options.voice,
      input: options.text,
      speed: options.speed,
      response_format: options.format,
      ...(options.instructions ? { instructions: options.instructions } : {})
    });

    const buffer = Buffer.from(await response.arrayBuffer());
    await fs.writeFile(options.outputPath, buffer);
    
    console.log(`音声ファイルを生成しました: ${options.outputPath}`);
  } catch (error) {
    if (error.response) {
      console.error('API エラー:', error.response.data);
    } else {
      console.error('エラー:', error.message);
    }
    throw error;
  }
}

module.exports = {
  textToSpeech
};
