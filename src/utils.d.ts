import { CommandLineOptions } from './types';
/**
 * テキストファイルを読み込みます
 * @param {string} filePath - 読み込むファイルのパス
 * @returns {Promise<string>} ファイルの内容
 */
export declare function readTextFile(filePath: string): Promise<string>;
/**
 * 出力先ディレクトリが存在するか確認し、存在しなければ作成します
 * @param {string} outputPath - 出力ファイルパス
 */
export declare function ensureOutputDirectory(outputPath: string): Promise<void>;
/**
 * 入力値を検証します
 * @param {CommandLineOptions} options - 検証するオプション
 * @throws {Error} 検証エラー
 */
export declare function validateOptions(options: CommandLineOptions): void;
/**
 * デフォルトの出力ディレクトリに基づいて出力ファイル名を生成します
 * @param {CommandLineOptions} options - オプション
 * @returns {string} 出力ファイルパス
 */
export declare function getOutputPath(options: CommandLineOptions): string;
