export type OpenAIVoice = 'alloy' | 'ash' | 'coral' | 'echo' | 'fable' | 'onyx' | 'nova' | 'sage' | 'shimmer';
export type ExtendedOpenAIVoice = OpenAIVoice | 'ballad' | 'verse';
export type OpenAIOutputFormat = 'mp3' | 'opus' | 'aac' | 'flac' | 'wav' | 'pcm';
export type OpenAITTSModel = 'tts-1' | 'tts-1-hd' | 'gpt-4o-mini-tts';
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
