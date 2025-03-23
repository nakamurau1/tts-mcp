import path from 'path';
import mockFs from 'mock-fs';
import * as utils from '../src/utils';
import { CommandLineOptions } from '../src/types';

describe('utils', () => {
  // テスト終了後に必ずmockFsをリストアする
  afterEach(() => {
    mockFs.restore();
    jest.restoreAllMocks();
  });

  describe('readTextFile', () => {
    it('ファイルが存在する場合、内容を読み込む', async () => {
      // ファイルシステムをモック化
      mockFs({
        'test-file.txt': 'テストファイルの内容'
      });

      const content = await utils.readTextFile('test-file.txt');
      expect(content).toBe('テストファイルの内容');
    });

    it('ファイルが存在しない場合、エラーをスロー', async () => {
      mockFs({}); // 空のファイルシステム

      await expect(utils.readTextFile('non-existent.txt'))
        .rejects
        .toThrow('ファイルの読み込みに失敗しました');
    });
  });

  describe('ensureOutputDirectory', () => {
    it('ディレクトリが存在する場合、何もしない', async () => {
      mockFs({
        '/existing/directory': {}
      });

      const consoleSpy = jest.spyOn(console, 'log');
      await utils.ensureOutputDirectory('/existing/directory/file.txt');
      
      expect(consoleSpy).not.toHaveBeenCalled();
    });

    it('ディレクトリが存在しない場合、作成する', async () => {
      mockFs({
        '/existing': {}
      });

      const consoleSpy = jest.spyOn(console, 'log');
      await utils.ensureOutputDirectory('/existing/new/directory/file.txt');
      
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('ディレクトリを作成しました'));
    });
  });

  describe('validateOptions', () => {
    it('テキストとファイルの両方が欠けている場合、エラーをスロー', () => {
      const options: CommandLineOptions = {
        output: 'output.mp3'
      };

      expect(() => utils.validateOptions(options))
        .toThrow('テキスト(-t, --text)かファイル(-f, --file)のいずれかを指定してください');
    });

    it('速度が範囲外の場合、エラーをスロー', () => {
      const optionsTooSlow: CommandLineOptions = {
        text: 'テスト',
        speed: 0.1
      };

      const optionsTooFast: CommandLineOptions = {
        text: 'テスト',
        speed: 5.0
      };

      expect(() => utils.validateOptions(optionsTooSlow))
        .toThrow('速度(-s, --speed)は0.25〜4.0の範囲で指定してください');
      
      expect(() => utils.validateOptions(optionsTooFast))
        .toThrow('速度(-s, --speed)は0.25〜4.0の範囲で指定してください');
    });

    it('有効なオプションの場合、エラーをスローしない', () => {
      const options: CommandLineOptions = {
        text: 'テスト',
        speed: 1.5
      };

      expect(() => utils.validateOptions(options)).not.toThrow();
    });
  });

  describe('getOutputPath', () => {
    it('絶対パスで出力を指定した場合、そのパスを使用', () => {
      const absolutePath = path.resolve('/absolute/path/output.mp3');
      const options: CommandLineOptions = {
        output: absolutePath
      };

      expect(utils.getOutputPath(options)).toBe(absolutePath);
    });

    it('相対パスで出力を指定した場合、カレントディレクトリからの相対パスを使用', () => {
      const options: CommandLineOptions = {
        output: 'relative/path/output.mp3'
      };

      const expected = path.join(process.cwd(), 'relative/path/output.mp3');
      expect(utils.getOutputPath(options)).toBe(expected);
    });

    it('出力パスを指定しない場合、デフォルトのパスを生成', () => {
      const originalDateNow = Date.now;
      Date.now = jest.fn(() => 1234567890) as any;

      const options: CommandLineOptions = {
        format: 'mp3'
      };

      const expected = path.join(process.cwd(), 'output', 'speech_1234567890.mp3');
      expect(utils.getOutputPath(options)).toBe(expected);

      Date.now = originalDateNow;
    });
  });
});
