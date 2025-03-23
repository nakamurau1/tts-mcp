// 共通の型定義

import { VALID_VOICES, VALID_MODELS, VALID_FORMATS } from './constants';

// 定数配列から型を生成
export type OpenAIVoice = typeof VALID_VOICES[number];
export type OpenAITTSModel = typeof VALID_MODELS[number];
export type OpenAIOutputFormat = typeof VALID_FORMATS[number];

/**
 * テキスト音声変換のオプション
 */
export interface TTSOptions {
  text: string;
  outputPath?: string;
  model: OpenAITTSModel;
  voice: OpenAIVoice;
  speed: number;
  format: OpenAIOutputFormat;
  instructions?: string;
  apiKey: string;
}

/**
 * コマンドラインオプション
 */
export interface CommandLineOptions {
  text?: string;
  file?: string;
  output?: string;
  model?: OpenAITTSModel;
  voice?: OpenAIVoice;
  speed?: number;
  format?: OpenAIOutputFormat;
  instructions?: string;
  apiKey?: string;
  logFile?: string;
}

/**
 * MCPサーバー設定
 */
export interface MCPServerConfig {
  model: OpenAITTSModel;
  voice: OpenAIVoice;
  format: OpenAIOutputFormat;
  apiKey: string;
  logFile?: string;
}
