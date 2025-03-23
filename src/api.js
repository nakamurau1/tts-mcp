"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeClient = initializeClient;
exports.textToSpeech = textToSpeech;
const openai_1 = require("openai");
const fs_1 = require("fs");
/**
 * OpenAI APIのクライアントを初期化します
 * @param {string} apiKey - OpenAI APIキー
 * @returns {OpenAI} OpenAIクライアントインスタンス
 */
function initializeClient(apiKey) {
    if (!apiKey) {
        throw new Error('OpenAI APIキーが設定されていません。--api-keyオプションか環境変数OPENAI_API_KEYを設定してください。');
    }
    return new openai_1.OpenAI({
        apiKey: apiKey
    });
}
/**
 * テキストを音声に変換します
 * @param {TTSOptions} options - 変換オプション
 * @returns {Promise<void>}
 */
async function textToSpeech(options) {
    const client = initializeClient(options.apiKey);
    try {
        console.log('音声生成開始...');
        // ノバリッドボイスをサポートされている値に強制変換
        const safeVoice = (options.voice in ['alloy', 'ash', 'coral', 'echo', 'fable', 'onyx', 'nova', 'sage', 'shimmer'])
            ? options.voice
            : 'alloy';
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
        await fs_1.promises.writeFile(options.outputPath, buffer);
        console.log(`音声ファイルを生成しました: ${options.outputPath}`);
    }
    catch (error) {
        if (error.response) {
            console.error('API エラー:', error.response.data);
        }
        else {
            console.error('エラー:', error.message);
        }
        throw error;
    }
}
