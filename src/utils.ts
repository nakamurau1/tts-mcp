import { promises as fs } from 'fs';
import path from 'path';
import { CommandLineOptions } from './types';

/**
 * テキストファイルを読み込みます
 * @param {string} filePath - 読み込むファイルのパス
 * @returns {Promise<string>} ファイルの内容
 */
export async function readTextFile(filePath: string): Promise<string> {
  try {
    return await fs.readFile(filePath, 'utf-8');
  } catch (error) {
    throw new Error(`ファイルの読み込みに失敗しました: ${(error as Error).message}`);
  }
}

/**
 * 出力先ディレクトリが存在するか確認し、存在しなければ作成します
 * @param {string} outputPath - 出力ファイルパス
 */
export async function ensureOutputDirectory(outputPath: string): Promise<void> {
  const directory = path.dirname(outputPath);
  
  try {
    await fs.access(directory);
  } catch (error) {
    // ディレクトリが存在しない場合は作成
    try {
      await fs.mkdir(directory, { recursive: true });
      console.log(`ディレクトリを作成しました: ${directory}`);
    } catch (mkdirError) {
      throw new Error(`ディレクトリの作成に失敗しました: ${(mkdirError as Error).message}`);
    }
  }
}

/**
 * 入力値を検証します
 * @param {CommandLineOptions} options - 検証するオプション
 * @throws {Error} 検証エラー
 */
export function validateOptions(options: CommandLineOptions): void {
  // テキストかファイルのどちらかが必要
  if (!options.text && !options.file) {
    throw new Error('テキスト(-t, --text)かファイル(-f, --file)のいずれかを指定してください。');
  }
  
  // 速度は0.25〜4.0の範囲内
  if (options.speed && (options.speed < 0.25 || options.speed > 4.0)) {
    throw new Error('速度(-s, --speed)は0.25〜4.0の範囲で指定してください。');
  }
}

/**
 * デフォルトの出力ディレクトリに基づいて出力ファイル名を生成します
 * @param {CommandLineOptions} options - オプション
 * @returns {string} 出力ファイルパス
 */
export function getOutputPath(options: CommandLineOptions): string {
  if (options.output) {
    // パスが絶対パスか相対パスかを確認
    return path.isAbsolute(options.output) 
      ? options.output 
      : path.join(process.cwd(), options.output);
  }
  
  // 出力ファイル名がない場合はデフォルトのファイル名を生成
  const defaultFilename = `speech_${Date.now()}.${options.format || 'mp3'}`;
  return path.join(process.cwd(), 'output', defaultFilename);
}
