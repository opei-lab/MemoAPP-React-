# デプロイメントガイド

## Vercelへのデプロイ

### プロジェクト構造
このプロジェクトはモノレポ構造で、実際のアプリケーションは`memoapp`サブディレクトリに配置されています。

```
MemoAPP-React-/
├── .git/
├── vercel.json      # ルートに配置
└── memoapp/
    ├── package.json
    ├── vite.config.ts
    ├── src/
    └── dist/
```

### Vercel設定
**重要**: `vercel.json`はリポジトリのルートに配置する必要があります。

```json
{
  "buildCommand": "cd memoapp && npm install && npm run build",
  "outputDirectory": "memoapp/dist",
  "framework": "vite"
}
```

### 設定のポイント
1. **vercel.jsonの配置**: リポジトリのルートに配置（memoappディレクトリ内ではない）
2. **buildCommand**: `cd memoapp`でサブディレクトリに移動してからビルド
3. **outputDirectory**: `memoapp/dist`のようにサブディレクトリからの相対パス
4. **framework**: `vite`を明示的に指定

### トラブルシューティング

#### "vite: command not found"エラー
- 原因: node_modulesが正しくインストールされていない
- 解決策: buildCommandで`npm install`を実行してから`npm run build`

#### ビルドが失敗する場合
1. package.jsonの依存関係を確認
2. viteがdependenciesに含まれているか確認（devDependenciesではなく）
3. Node.jsのバージョン要件を確認（engines フィールド）

### 成功したビルド設定
```json
// package.json
{
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=8.0.0"
  },
  "scripts": {
    "build": "vite build"  // シンプルに保つ
  },
  "dependencies": {
    "vite": "^5.4.0"  // dependenciesに含める
  }
}
```

### デプロイ手順
1. 変更をコミット
2. `git push`でGitHubにプッシュ
3. Vercelが自動的にビルドを開始
4. Vercelダッシュボードでビルドログを確認

### 注意事項
- `root`プロパティはvercel.jsonでサポートされていない
- モノレポの場合は必ずコマンドで`cd`を使用
- ローカルのnode_modulesはコミットしない（.gitignoreに含める）