# テスト実装について

このドキュメントでは、tts-mcpリポジトリのテスト実装について説明します。

## テスト環境

- **フレームワーク**: Jest
- **モックライブラリ**: mock-fs, sinon, nock
- **テストタイプ**: ユニットテスト、統合テスト

## テストファイル構造

- `test/utils.test.ts` - ユーティリティ関数のテスト
- `test/api.test.ts` - OpenAI API関連機能のテスト
- `test/mcp-server.test.ts` - MCPサーバー機能のユニットテスト
- `test/integration.test.ts` - CLIと基本機能の統合テスト（デフォルトではスキップ）
- `test/mcp-client.test.ts` - MCPクライアント・サーバー間の統合テスト（デフォルトではスキップ）
- `test/helpers/mcp-test-helpers.ts` - 統合テスト用のヘルパー関数

## 実行方法

```bash
# 通常のテスト実行（ユニットテストのみ）
npm test

# カバレッジレポート生成
npm run test:coverage

# すべての統合テスト実行（実際のAPIを使用するため注意）
INTEGRATION_TEST=true npm test

# 特定の統合テストのみ実行
INTEGRATION_TEST=true npm test -- test/integration.test.ts
INTEGRATION_TEST=true npm test -- test/mcp-client.test.ts
```

## 新規追加された統合テスト

### MCPサーバー起動テスト (`integration.test.ts`)
- MCPサーバーが正常に起動することを確認
- コマンドラインオプションの動作を確認
- バージョン情報とヘルプの表示を確認

### MCPクライアント・サーバー連携テスト (`mcp-client.test.ts`)
- MCPサーバーとクライアント間の接続を確認
- ツールの登録と検出を確認
- text-to-speechツールの呼び出しを確認（実際のAPIキーが必要）

## ヘルパー関数

`test/helpers/mcp-test-helpers.ts` には以下のヘルパー関数が用意されています：

- `startMcpServer()`: テスト用MCPサーバーを起動
- `createMcpClient()`: テスト用MCPクライアントを作成して接続
- `cleanupFile()`: テストで生成したファイルを削除

## テストカバレッジ

現在のテストカバレッジ状況：

- **utils.ts**: 95% 以上（非常に良好）
- **api.ts**: 76%（改善の余地あり）
- **mcp-server.ts**: 40%（改善中）
- **index.ts**: 0%（テスト未実装）

## 今後の改善点

1. **MCPサーバーテストの強化**:
   - サーバーとクライアント間の統合テストの拡充
   - エラー発生時の挙動をテスト

2. **index.tsのテスト追加**:
   - メインエントリーポイントのテストを実装

3. **CI/CD連携**:
   - GitHub ActionsなどのCI環境でテストを自動実行
   - テスト実行をGit hookに組み込む

## 注意事項

- 統合テストを実行するには `INTEGRATION_TEST=true` 環境変数を設定して実行してください
- テスト実行時は `.env` ファイルの実際のAPIキーが使用されないよう注意してください
- 統合テストを実行する場合は、必ずテスト用のAPIキーを使用してください
- APIキーがない場合、一部のテストは自動的にスキップされます
