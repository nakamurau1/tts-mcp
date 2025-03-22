const { textToSpeech } = require('./api');
const { readTextFile, ensureOutputDirectory, validateOptions, getOutputPath } = require('./utils');

/**
 * メインのアプリケーションロジック
 * @param {Object} options - コマンドラインオプション
 * @returns {Promise<void>}
 */
async function run(options) {
  try {
    // オプションの検証
    validateOptions(options);
    
    // 出力パスの取得
    const outputPath = getOutputPath(options);
    
    // 出力ディレクトリの確認
    await ensureOutputDirectory(outputPath);
    
    // テキストの取得（ファイルまたは直接入力）
    let text = options.text;
    if (options.file) {
      text = await readTextFile(options.file);
    }
    
    // テキストを音声に変換
    await textToSpeech({
      text,
      outputPath,
      model: options.model,
      voice: options.voice,
      speed: options.speed,
      format: options.format,
      instructions: options.instructions,
      apiKey: options.apiKey || process.env.OPENAI_API_KEY
    });
    
    console.log('処理が完了しました。');
  } catch (error) {
    console.error('エラー:', error.message);
    process.exit(1);
  }
}

module.exports = { run };
