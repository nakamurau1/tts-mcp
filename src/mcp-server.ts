import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { OpenAI } from "openai";
import * as z from "zod";
import { promises as fs } from "fs";
import path from "path";
import os from "os";  // 一時ディレクトリのパスを取得するために使用
import playSound from "play-sound";
import { MCPServerConfig, OpenAIVoice, OpenAIOutputFormat, OpenAITTSModel } from "./types";

// プレイヤーの初期化
const player = playSound({});

// ログファイルパス
let logFile = path.join(process.cwd(), 'tts-mcp.log');

/**
 * ログファイルにメッセージを追加します
 * @param {string} message - ログメッセージ
 */
async function logToFile(message: string): Promise<void> {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} - ${message}\n`;
  
  try {
    await fs.appendFile(logFile, logMessage);
  } catch (error) {
    // ログ書き込みエラーは無視（エラー処理のループを避けるため）
  }
}

/**
 * OpenAI APIのクライアントを初期化します
 * @param {string} apiKey - OpenAI APIキー
 * @returns {OpenAI} OpenAIクライアントインスタンス
 */
export function initializeClient(apiKey: string): OpenAI {
  if (!apiKey) {
    throw new Error('OpenAI APIキーが設定されていません。--api-keyオプションか環境変数OPENAI_API_KEYを設定してください。');
  }
  
  return new OpenAI({
    apiKey: apiKey
  });
}

interface TTSPlayOptions {
  text: string;
  model: OpenAITTSModel;
  voice: OpenAIVoice;
  speed: number;
  format: OpenAIOutputFormat;
  instructions?: string;
  apiKey: string;
}

interface TTSPlayResult {
  duration: string;
  textLength: number;
}

/**
 * テキストを音声に変換して再生します
 * @param {TTSPlayOptions} options - 変換オプション
 * @returns {Promise<TTSPlayResult>} 処理結果
 */
async function textToSpeechAndPlay(options: TTSPlayOptions): Promise<TTSPlayResult> {
  const client = initializeClient(options.apiKey);
  let tempFilePath: string | null = null;
  
  try {
    await logToFile('音声生成開始...');
    
    // ノバリッドボイスをサポートされている値に強制変換
    const safeVoice = (options.voice as string in ['alloy', 'ash', 'coral', 'echo', 'fable', 'onyx', 'nova', 'sage', 'shimmer']) 
      ? options.voice 
      : 'alloy';
      
    const response = await client.audio.speech.create({
      model: options.model,
      voice: safeVoice,
      input: options.text,
      speed: options.speed,
      response_format: options.format,
      ...(options.instructions ? { instructions: options.instructions } : {})
    });

    // 音声データを取得
    const buffer = Buffer.from(await response.arrayBuffer());
    
    // 直接一時ファイルパスを生成
    tempFilePath = path.join(os.tmpdir(), `speech_${Date.now()}.${options.format}`);
    
    // バッファをファイルに書き込む
    await fs.writeFile(tempFilePath, buffer);
    
    await logToFile(`音声ファイルを作成しました: ${tempFilePath}`);
    
    // 再生開始時間を記録
    const startTime = Date.now();
    
    await logToFile(`音声を再生します: ${tempFilePath}`);
    
    // 音声を再生（Promise化）
    await new Promise<void>((resolve, reject) => {
      player.play(tempFilePath!, (err: Error | null) => {
        if (err) reject(err);
        else resolve();
      });
    });
    
    // 再生時間を計算（秒単位）
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    
    await logToFile(`音声の再生が完了しました（再生時間: ${duration}秒）`);
    
    // 一時ファイルの削除を試みる（任意）
    try {
      await fs.unlink(tempFilePath);
      await logToFile(`一時ファイルを削除しました: ${tempFilePath}`);
    } catch (cleanupError) {
      await logToFile(`一時ファイルの削除に失敗しました: ${(cleanupError as Error).message}`);
      // 削除に失敗しても処理は続行
    }
    
    return {
      duration,
      textLength: options.text.length
    };
  } catch (error: any) {
    // エラーが発生した場合、一時ファイルが存在していれば削除を試みる
    if (tempFilePath) {
      try {
        await fs.unlink(tempFilePath);
      } catch (cleanupError) {
        // 削除エラーは無視
      }
    }
    
    if (error.response) {
      await logToFile(`API エラー: ${JSON.stringify(error.response.data)}`);
    } else {
      await logToFile(`エラー: ${error.message}`);
    }
    throw error;
  }
}

/**
 * MCPサーバーを作成して設定します
 * @param {MCPServerConfig} config - サーバー設定
 * @returns {Promise<McpServer>} 設定済みMCPサーバー
 */
async function createMcpServer(config: MCPServerConfig): Promise<McpServer> {
  // カスタムログファイルがあれば設定
  if (config.logFile) {
    logFile = config.logFile;
  }

  // ログファイルを初期化
  await logToFile('---------------------------------------');
  await logToFile(`MCPサーバーを初期化しています...`);
  await logToFile(`設定: モデル=${config.model}, 音声=${config.voice}, フォーマット=${config.format}`);

  // MCPサーバーを作成
  const server = new McpServer({
    name: "tts-mcp",
    version: "1.0.0",
    // サポートする機能を明示的に定義
    capabilities: {
      tools: {}
    }
  });

  // テキスト音声変換と再生ツールを追加
  server.tool(
    "text-to-speech",
    {
      text: z.string(),
      speed: z.number().min(0.25).max(4.0).optional().default(1.0),
      instructions: z.string().optional(),
    },
    async (params) => {
      try {
        const result = await textToSpeechAndPlay({
          text: params.text,
          model: config.model,
          voice: config.voice,
          speed: params.speed,
          format: config.format,
          instructions: params.instructions,
          apiKey: config.apiKey
        });
        
        return {
          content: [
            {
              type: "text",
              text: `テキストを音声で再生しました（再生時間: ${result.duration}秒）`
            }
          ],
          metadata: {
            duration: result.duration,
            text_length: result.textLength
          }
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `エラー: 音声の生成または再生に失敗しました - ${(error as Error).message}`
            }
          ],
          isError: true
        };
      }
    }
  );

  return server;
}

/**
 * MCPサーバーを起動します
 * @param {MCPServerConfig} config - サーバー設定
 * @returns {Promise<void>}
 */
export async function startMcpServer(config: MCPServerConfig): Promise<void> {
  // stderr経由でコンテキスト情報を出力
  process.stderr.write(`モデル=${config.model}, 音声=${config.voice}, フォーマット=${config.format}\n`);

  try {
    // サーバーを作成
    const server = await createMcpServer(config);
    
    // STDIOトランスポートを使用
    const transport = new StdioServerTransport();
    
    // サーバーを接続して開始
    await server.connect(transport);
    
    await logToFile("MCPサーバーが起動しました");
  } catch (error) {
    await logToFile(`MCPサーバー起動エラー: ${(error as Error).message}`);
    // stderrにもエラーを出力
    process.stderr.write(`エラー: ${(error as Error).message}\n`);
    throw error;
  }
}
