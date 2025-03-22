# tts-mcp

OpenAI Text to Speech APIを活用した高品質音声生成コマンドラインツールとMCPサーバー

## 機能

- テキスト文字列やファイルから自然な音声を生成
- 複数の音声キャラクターや設定をサポート
- 様々な出力フォーマット（MP3, WAV, OPUS, AACなど）
- シンプルで使いやすいコマンドラインインターフェース
- **NEW**: Model Context Protocol (MCP) サーバー対応

## インストール

```bash
# リポジトリをクローン
git clone https://github.com/nakamurau1/tts-mcp.git
cd tts-mcp

# 依存関係をインストール
npm install

# グローバルにインストール（オプション）
npm install -g .
```

## 使い方

### コマンドラインツールとして

```bash
# テキストを直接指定
tts-mcp -t "こんにちは、世界" -o hello.mp3

# テキストファイルを変換
tts-mcp -f speech.txt -o speech.mp3

# カスタム音声を指定
tts-mcp -t "Welcome to the future" -o welcome.mp3 -v nova
```

### MCPサーバーとして

```bash
# デフォルト設定でサーバーを起動
npm run server

# カスタム設定でサーバーを起動
npm run server -- --voice nova --model tts-1-hd

# または直接実行
node bin/tts-mcp-server.js --voice echo
```

## コマンドラインオプション

### tts-mcp（コマンドラインツール）

```
オプション:
  -V, --version             バージョン情報表示
  -t, --text <text>         変換するテキスト
  -f, --file <path>         入力テキストファイルのパス
  -o, --output <path>       出力音声ファイルのパス（必須）
  -m, --model <n>           使用するモデル (デフォルト: "tts-1")
  -v, --voice <n>           音声キャラクター (デフォルト: "alloy")
  -s, --speed <number>      音声の速度（0.25-4.0） (デフォルト: 1)
  --format <format>         出力フォーマット (デフォルト: "mp3")
  -i, --instructions <text> 音声生成の追加指示
  --api-key <key>           OpenAI APIキー（環境変数でも設定可能）
  -h, --help                ヘルプ表示
```

### tts-mcp-server（MCPサーバー）

```
オプション:
  -V, --version             バージョン情報表示
  -m, --model <model>       使用するモデル (デフォルト: "tts-1")
  -v, --voice <voice>       音声キャラクター (デフォルト: "alloy")
  -f, --format <format>     音声フォーマット (デフォルト: "mp3")
  --api-key <key>           OpenAI APIキー（環境変数でも設定可能）
  -h, --help                ヘルプ表示
```

## MCP対応クライアントでの使用

このMCPサーバーは、Claude DesktopなどのMCP対応クライアントで使用できます。例えば、Claude Desktopでは以下のように設定します：

1. Claude Desktopの設定ファイル（通常は`~/Library/Application Support/Claude/claude_desktop_config.json`）を開きます
2. 以下の設定を追加します：

```json
{
  "mcpServers": {
    "tts-mcp": {
      "command": "node",
      "args": ["フルパス/bin/tts-mcp-server.js", "--voice", "nova"]
    }
  }
}
```

3. Claude Desktopを再起動します
4. 「テキストを読み上げてほしい」などとリクエストすると、テキストが音声で再生されます

### MCPサーバーが提供するツール

- **text-to-speech**: テキストを音声に変換して再生するツール

## 音声キャラクター

以下の音声キャラクターがサポートされています：
- alloy (デフォルト)
- ash
- ballad
- coral
- echo
- fable
- onyx
- nova
- sage
- shimmer
- verse

## サポートされているモデル

- tts-1 (デフォルト)
- tts-1-hd
- gpt-4o-mini-tts

## 出力フォーマット

以下の出力フォーマットがサポートされています：
- mp3 (デフォルト)
- opus
- aac
- flac
- wav
- pcm

## 環境変数

`.env`ファイルまたは環境変数で以下の設定が可能です：

```
OPENAI_API_KEY=your-api-key-here
```

## ライセンス

MIT
