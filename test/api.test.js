
const fs = require('fs').promises;
const nock = require('nock');
const api = require('../src/api');

// fs.writeFileをモック化
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

describe('api', () => {
  let consoleLogSpy;
  let consoleErrorSpy;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    
    // モックをリセット
    jest.clearAllMocks();
  });

  afterEach(() => {
    // モックをリストア
    nock.cleanAll();
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  describe('initializeClient', () => {
    it('APIキーがない場合、エラーをスロー', () => {
      expect(() => api.textToSpeech({
        text: 'テスト',
        outputPath: 'output.mp3',
        model: 'tts-1',
        voice: 'alloy',
        speed: 1,
        format: 'mp3',
        apiKey: undefined
      })).rejects.toThrow('OpenAI APIキーが設定されていません');
    });
  });

  describe('textToSpeech', () => {
    it('正常なリクエストでは音声ファイルを生成する', async () => {
      // OpenAI APIモックレスポンス
      const mockArrayBuffer = new Uint8Array([1, 2, 3, 4]).buffer;
      const mockResponse = {
        arrayBuffer: jest.fn().mockResolvedValue(mockArrayBuffer)
      };
      
      // OpenAIクライアントのcreateメソッドをモック化
      const mockCreateMethod = jest.fn().mockResolvedValue(mockResponse);
      
      // OpenAIコンストラクタをモック化
      const OpenAIMock = jest.fn().mockImplementation(() => ({
        audio: {
          speech: {
            create: mockCreateMethod
          }
        }
      }));
      
      // apiモジュールのOpenAIをモック化
      const originalOpenAI = require('openai').OpenAI;
      require('openai').OpenAI = OpenAIMock;

      // テスト実行
      const options = {
        text: 'テスト音声',
        outputPath: 'output.mp3',
        model: 'tts-1',
        voice: 'alloy',
        speed: 1,
        format: 'mp3',
        apiKey: 'test_api_key'
      };

      await api.textToSpeech(options);

      // APIが正しいパラメータで呼ばれたか検証
      expect(mockCreateMethod).toHaveBeenCalledWith(expect.objectContaining({
        model: 'tts-1',
        voice: 'alloy',
        input: 'テスト音声',
        speed: 1,
        response_format: 'mp3'
      }));

      // ファイルが書き込まれたか検証
      expect(fs.writeFile).toHaveBeenCalledWith(
        'output.mp3',
        expect.any(Buffer)
      );

      // コンソールログが出力されたか検証
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('音声ファイルを生成しました'));

      // モックを元に戻す
      require('openai').OpenAI = originalOpenAI;
    });

    it('APIエラーが発生した場合、エラーを処理する', async () => {
      // API エラーをシミュレート
      const apiError = new Error('API error');
      apiError.response = {
        data: { error: 'API error details' }
      };
      
      // OpenAIクライアントのcreateメソッドをモック化
      const mockCreateMethod = jest.fn().mockRejectedValue(apiError);
      
      // OpenAIコンストラクタをモック化
      const OpenAIMock = jest.fn().mockImplementation(() => ({
        audio: {
          speech: {
            create: mockCreateMethod
          }
        }
      }));
      
      // apiモジュールのOpenAIをモック化
      const originalOpenAI = require('openai').OpenAI;
      require('openai').OpenAI = OpenAIMock;

      // テスト実行
      const options = {
        text: 'テスト音声',
        outputPath: 'output.mp3',
        model: 'tts-1',
        voice: 'alloy',
        speed: 1,
        format: 'mp3',
        apiKey: 'test_api_key'
      };

      await expect(api.textToSpeech(options)).rejects.toThrow();

      // エラーログが出力されたか検証
      expect(consoleErrorSpy).toHaveBeenCalledWith('API エラー:', { error: 'API error details' });

      // モックを元に戻す
      require('openai').OpenAI = originalOpenAI;
    });

    it('その他のエラーが発生した場合、エラーを処理する', async () => {
      // 一般的なエラーをシミュレート
      const generalError = new Error('General error');
      
      // OpenAIクライアントのcreateメソッドをモック化
      const mockCreateMethod = jest.fn().mockRejectedValue(generalError);
      
      // OpenAIコンストラクタをモック化
      const OpenAIMock = jest.fn().mockImplementation(() => ({
        audio: {
          speech: {
            create: mockCreateMethod
          }
        }
      }));
      
      // apiモジュールのOpenAIをモック化
      const originalOpenAI = require('openai').OpenAI;
      require('openai').OpenAI = OpenAIMock;

      // テスト実行
      const options = {
        text: 'テスト音声',
        outputPath: 'output.mp3',
        model: 'tts-1',
        voice: 'alloy',
        speed: 1,
        format: 'mp3',
        apiKey: 'test_api_key'
      };

      await expect(api.textToSpeech(options)).rejects.toThrow();

      // エラーログが出力されたか検証
      expect(consoleErrorSpy).toHaveBeenCalledWith('エラー:', expect.any(String));

      // モックを元に戻す
      require('openai').OpenAI = originalOpenAI;
    });
  });
});
