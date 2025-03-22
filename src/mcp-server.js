const { McpServer } = require("@modelcontextprotocol/sdk/server/mcp.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const { OpenAI } = require("openai");
const z = require("zod");
const fs = require("fs").promises;
const path = require("path");
const os = require("os");  // 一時ディレクトリのパスを取得するために使用
const player = require("play-sound")({});

// ログファイルパス
const logFile = path.join(process.cwd(), 'tts-mcp.log');

/**
 * ログファイルにメッセージを追加します
 * @param {string} message - ログメッセージ
 */
async function logToFile(message) {
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
function initializeClient(apiKey) {
  if (!apiKey) {
    throw new Error('OpenAI APIキーが設定されていません。--api-keyオプションか環境変数OPENAI_API_KEYを設定してください。');
  }
  
  return new OpenAI({
    apiKey: apiKey
  });
}

/**
 * テキストを音声に変換して再生します
 * @param {Object} options - 変換オプション
 * @returns {Promise<Object>} 処理結果
 */
async function textToSpeechAndPlay(options) {
  const client = initializeClient(options.apiKey);
  let tempFilePath = null;
  
  try {
    await logToFile('音声生成開始...');
    
    const response = await client.audio.speech.create({
      model: options.model,
      voice: options.voice,
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
    await new Promise((resolve, reject) => {
      player.play(tempFilePath, (err) => {
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
      await logToFile(`一時ファイルの削除に失敗しました: ${cleanupError.message}`);
      // 削除に失敗しても処理は続行
    }
    
    return {
      duration,
      textLength: options.text.length
    };
  } catch (error) {
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
 * @param {Object} config - サーバー設定
 * @returns {Promise<McpServer>} 設定済みMCPサーバー
 */
async function createMcpServer(config) {
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
              text: `エラー: 音声の生成または再生に失敗しました - ${error.message}`
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
 * @param {Object} config - サーバー設定
 * @returns {Promise<void>}
 */
async function startMcpServer(config) {
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
    await logToFile(`MCPサーバー起動エラー: ${error.message}`);
    // stderrにもエラーを出力
    process.stderr.write(`エラー: ${error.message}\n`);
    throw error;
  }
}

module.exports = {
  startMcpServer
};
