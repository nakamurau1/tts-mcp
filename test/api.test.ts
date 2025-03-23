import { promises as fs } from 'fs';
import { OpenAI } from 'openai';
import { TTSOptions } from '../src/types';

// モジュールをモック化
jest.mock('openai');
jest.mock('fs', () => {
  const originalFs = jest.requireActual('fs');
  return {
    ...originalFs,
    promises: {
      ...originalFs.promises,
      writeFile: jest.fn().mockResolvedValue(undefined)
    }
  };
});

// モック化が完了した後にモジュールをインポート
import * as api from '../src/api';

describe('api', () => {
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    // コンソール出力をモック
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    
    // モックをリセット
    jest.clearAllMocks();
  });

  afterEach(() => {
    // モックをリストア
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  describe('initializeClient', () => {
    it('APIキーがない場合、エラーをスロー', async () => {
      await expect(api.textToSpeech({
        text: 'テスト',
        outputPath: 'output.mp3',
        model: 'tts-1',
        voice: 'alloy',
        speed: 1,
        format: 'mp3',
        apiKey: undefined as unknown as string
      })).rejects.toThrow('OpenAI APIキーが設定されていません');
    });
  });

  describe('textToSpeech', () => {
    it('正常なリクエストでは音声ファイルを生成する', async () => {
      // API呼び出しの成功をモック
      const mockCreate = jest.fn().mockResolvedValue({
        arrayBuffer: jest.fn().mockResolvedValue(new Uint8Array([1, 2, 3, 4]).buffer)
      });
      
      (OpenAI as jest.MockedClass<typeof OpenAI>).mockImplementation(() => ({
        audio: {
          speech: {
            create: mockCreate
          }
        }
      } as unknown as OpenAI));

      // テスト実行
      const options: TTSOptions = {
        text: 'テスト音声',
        outputPath: 'output.mp3',
        model: 'tts-1',
        voice: 'alloy',
        speed: 1,
        format: 'mp3',
        apiKey: 'test_api_key'
      };

      await api.textToSpeech(options);

      // APIクライアントが作成されたか検証
      expect(OpenAI).toHaveBeenCalledWith({
        apiKey: 'test_api_key'
      });

      // APIメソッドが呼ばれたか検証
      expect(mockCreate).toHaveBeenCalled();

      // ファイルが書き込まれたか検証
      expect(fs.writeFile).toHaveBeenCalled();

      // コンソールログが出力されたか検証
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('音声ファイルを生成しました'));
    });

    it('APIエラーが発生した場合、エラーを処理する', async () => {
      // APIエラーをモック
      const apiError = new Error('API error');
      (apiError as any).response = {
        data: { error: 'テストエラー' }
      };

      (OpenAI as jest.MockedClass<typeof OpenAI>).mockImplementation(() => ({
        audio: {
          speech: {
            create: jest.fn().mockRejectedValue(apiError)
          }
        }
      } as unknown as OpenAI));

      // テスト実行
      const options: TTSOptions = {
        text: 'テスト音声',
        outputPath: 'output.mp3',
        model: 'tts-1',
        voice: 'alloy',
        speed: 1,
        format: 'mp3',
        apiKey: 'test_api_key'
      };

      await expect(api.textToSpeech(options)).rejects.toThrow();

      // エラーログが出力されたことを検証
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('その他のエラーが発生した場合、エラーを処理する', async () => {
      // 一般的なエラーをモック
      const generalError = new Error('一般的なエラー');

      (OpenAI as jest.MockedClass<typeof OpenAI>).mockImplementation(() => ({
        audio: {
          speech: {
            create: jest.fn().mockRejectedValue(generalError)
          }
        }
      } as unknown as OpenAI));

      // テスト実行
      const options: TTSOptions = {
        text: 'テスト音声',
        outputPath: 'output.mp3',
        model: 'tts-1',
        voice: 'alloy',
        speed: 1,
        format: 'mp3',
        apiKey: 'test_api_key'
      };

      await expect(api.textToSpeech(options)).rejects.toThrow();

      // エラーログが出力されたことを検証
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });
});
