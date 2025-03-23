import { OpenAI } from 'openai';
import { TTSOptions } from './types';
/**
 * OpenAI APIのクライアントを初期化します
 * @param {string} apiKey - OpenAI APIキー
 * @returns {OpenAI} OpenAIクライアントインスタンス
 */
export declare function initializeClient(apiKey: string): OpenAI;
/**
 * テキストを音声に変換します
 * @param {TTSOptions} options - 変換オプション
 * @returns {Promise<void>}
 */
export declare function textToSpeech(options: TTSOptions): Promise<void>;
