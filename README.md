# tts-mcp

OpenAI Text to Speech APIを活用した高品質音声生成コマンドラインツール

## 機能

- テキスト文字列やファイルから自然な音声を生成
- 複数の音声キャラクターや設定をサポート
- 様々な出力フォーマット（MP3, WAV, OPUS, AACなど）
- シンプルで使いやすいコマンドラインインターフェース

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

### 基本的な使い方

```bash
# テキストを直接指定
tts-mcp -t "こんにちは、世界" -o hello.mp3

# テキストファイルを変換
tts-mcp -f speech.txt -o speech.mp3

# カスタム音声を指定
tts-mcp -t "Welcome to the future" -o welcome.mp3 -v nova
```

### オプション

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

### 音声キャラクター

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

### サポートされているモデル

- tts-1 (デフォルト)
- tts-1-hd
- gpt-4o-mini-tts

### 出力フォーマット

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
