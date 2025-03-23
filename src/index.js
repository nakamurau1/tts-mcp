"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = run;
const api_1 = require("./api");
const utils_1 = require("./utils");
/**
 * メインのアプリケーションロジック
 * @param {CommandLineOptions} options - コマンドラインオプション
 * @returns {Promise<void>}
 */
async function run(options) {
    try {
        // オプションの検証
        (0, utils_1.validateOptions)(options);
        // 出力パスの取得
        const outputPath = (0, utils_1.getOutputPath)(options);
        // 出力ディレクトリの確認
        await (0, utils_1.ensureOutputDirectory)(outputPath);
        // テキストの取得（ファイルまたは直接入力）
        let text = options.text || '';
        if (options.file) {
            text = await (0, utils_1.readTextFile)(options.file);
        }
        // テキストを音声に変換
        await (0, api_1.textToSpeech)({
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
    }
    catch (error) {
        console.error('エラー:', error.message);
        process.exit(1);
    }
}
