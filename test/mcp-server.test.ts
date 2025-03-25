import sinon from 'sinon';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { promises as fs } from 'fs';
import { OpenAI } from 'openai';
import { startMcpServer, initializeClient } from '../src/mcp-server';
import { MCPServerConfig } from '../src/types';

// モック設定
jest.mock('@modelcontextprotocol/sdk/server/mcp.js');
jest.mock('@modelcontextprotocol/sdk/server/stdio.js');
jest.mock('openai');
jest.mock('play-sound', () => {
  return () => ({
    play: jest.fn((file: string, cb: (err: Error | null) => void) => cb(null))
  });
});

// fsのモック
jest.mock('fs', () => {
  const originalFs = jest.requireActual('fs');
  return {
    ...originalFs,
    promises: {
      ...originalFs.promises,
      appendFile: jest.fn().mockResolvedValue(undefined),
      writeFile: jest.fn().mockResolvedValue(undefined),
      unlink: jest.fn().mockResolvedValue(undefined)
    }
  };
});

describe('mcp-server', () => {
  let mockServerInstance: any;
  let mockTransportInstance: any;
  let consoleErrorSpy: jest.SpyInstance;
  let stderrWriteSpy: jest.SpyInstance;

  beforeEach(() => {
    // コンソール出力とstderrをモック化
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    stderrWriteSpy = jest.spyOn(process.stderr, 'write').mockImplementation();
    
    // McpServerのモックインスタンス
    mockServerInstance = {
      tool: jest.fn().mockReturnThis(),
      connect: jest.fn().mockResolvedValue(undefined)
    };
    (McpServer as unknown as jest.Mock).mockImplementation(() => mockServerInstance);
    
    // StdioServerTransportのモックインスタンス
    mockTransportInstance = {};
    (StdioServerTransport as unknown as jest.Mock).mockImplementation(() => mockTransportInstance);
    
    // OpenAIのモック
    const mockArrayBuffer = new Uint8Array([1, 2, 3, 4]).buffer;
    const mockSpeechResponse = {
      arrayBuffer: jest.fn().mockResolvedValue(mockArrayBuffer)
    };
    
    const mockOpenAIInstance = {
      audio: {
        speech: {
          create: jest.fn().mockResolvedValue(mockSpeechResponse)
        }
      }
    };
    
    (OpenAI as unknown as jest.Mock).mockImplementation(() => mockOpenAIInstance);
    
    // モックをリセット
    jest.clearAllMocks();
  });

  afterEach(() => {
    // モックをリストア
    consoleErrorSpy.mockRestore();
    stderrWriteSpy.mockRestore();
    jest.restoreAllMocks();
    sinon.restore();
  });

  describe('startMcpServer', () => {
    it('有効な設定でMCPサーバーを開始する', async () => {
      // テスト設定
      const config: MCPServerConfig = {
        model: 'tts-1',
        voice: 'alloy',
        format: 'mp3',
        apiKey: 'test_api_key'
      };
      
      // サーバー起動
      await startMcpServer(config);
      
      // stderrに設定情報が出力されたか検証
      expect(stderrWriteSpy).toHaveBeenCalledWith(expect.stringContaining('モデル=tts-1'));
      
      // McpServerが正しく初期化されたか検証
      expect(McpServer).toHaveBeenCalledWith({
        name: "tts-mcp",
        version: "1.1.0",
        capabilities: { tools: {} }
      });
      
      // toolメソッドが呼ばれたか検証
      expect(mockServerInstance.tool).toHaveBeenCalledWith(
        "text-to-speech",
        expect.any(String), // Description string now included
        expect.any(Object),
        expect.any(Function)
      );
      
      // connectメソッドが呼ばれたか検証
      expect(mockServerInstance.connect).toHaveBeenCalledWith(mockTransportInstance);
      
      // ログが記録されたか検証
      expect(fs.appendFile).toHaveBeenCalled();
    });
    
    it('APIキーがない場合エラーをスロー', () => {
      // エラー処理の検証
      const mockLog = jest.spyOn(process.stderr, 'write');
      mockLog.mockImplementation(() => true);
      
      expect(() => {
        initializeClient('' as any);
      }).toThrow();
      
      mockLog.mockRestore();
    });
  });

  // text-to-speech機能のテストは複雑なため、ここではMcpServerのtoolメソッドが
  // 正しく呼ばれることだけを検証します。実際の機能テストは別途行う必要があります。
});
