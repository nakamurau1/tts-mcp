// 共通の定数

// サポートされる音声タイプの配列
export const VALID_VOICES = [
  'alloy',
  'ash',
  'coral',
  'echo',
  'fable',
  'onyx',
  'nova',
  'sage',
  'shimmer'
] as const;

// サポートされるモデルの配列
export const VALID_MODELS = [
  'tts-1',
  'tts-1-hd',
  'gpt-4o-mini-tts'
] as const;

// サポートされる出力フォーマットの配列
export const VALID_FORMATS = [
  'mp3',
  'opus',
  'aac',
  'flac',
  'wav',
  'pcm'
] as const;

// デフォルト値
export const DEFAULT_VOICE = 'alloy';
export const DEFAULT_MODEL = 'gpt-4o-mini-tts';
export const DEFAULT_FORMAT = 'mp3';
