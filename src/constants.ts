// Common constants

// Array of supported voice types
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

// Array of supported models
export const VALID_MODELS = [
  'tts-1',
  'tts-1-hd',
  'gpt-4o-mini-tts'
] as const;

// Array of supported output formats
export const VALID_FORMATS = [
  'mp3',
  'opus',
  'aac',
  'flac',
  'wav',
  'pcm'
] as const;

// Default values
export const DEFAULT_VOICE = 'alloy';
export const DEFAULT_MODEL = 'gpt-4o-mini-tts';
export const DEFAULT_FORMAT = 'mp3';
