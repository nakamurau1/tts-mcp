import { OpenAI } from "openai";
import { MCPServerConfig } from "./types";
/**
 * OpenAI APIのクライアントを初期化します
 * @param {string} apiKey - OpenAI APIキー
 * @returns {OpenAI} OpenAIクライアントインスタンス
 */
export declare function initializeClient(apiKey: string): OpenAI;
/**
 * MCPサーバーを起動します
 * @param {MCPServerConfig} config - サーバー設定
 * @returns {Promise<void>}
 */
export declare function startMcpServer(config: MCPServerConfig): Promise<void>;
