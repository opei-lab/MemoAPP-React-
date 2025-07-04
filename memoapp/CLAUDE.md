# Claude Code 開発ガイド

このファイルはClaude Codeによる開発時の参考情報を記載しています。

## プロジェクト概要

**プロジェクト名**: ぷるんぷるんメモアプリ  
**技術スタック**: React + TypeScript + Vite + TailwindCSS + Framer Motion + DnD Kit  
**説明**: スライム型のメモカードが特徴的なメモアプリケーション

## 開発規約

コーディング規約と設計ガイドラインは以下のファイルを参照してください：

- [コーディング規約](./docs/coding-guidelines.md)
- [CSS・スタイル規約](./docs/css-guidelines.md)
- [型定義規約](./docs/type-guidelines.md)

## ファイル構成

```
src/
├── components/           # UIコンポーネント
│   ├── MemoCard/        # メモカード関連
│   └── ...
├── constants/           # 定数管理
│   ├── index.ts         # エクスポート統括
│   ├── zIndex.ts        # z-index統一管理
│   ├── styles.ts        # 共通スタイル
│   └── ...
├── hooks/               # カスタムフック
├── types/               # 型定義（今後統一予定）
└── ...
```

## 最近の改善内容

### CSS競合問題の解決 (2025-01-04)
- z-index統一管理システム導入
- 重要なスタイルのインライン化
- Tailwindクラス依存の削減

### 型定義の統一管理 (2025-01-04)
- `src/types/`ディレクトリで統一管理
- Memo関連型の重複解消
- コーディング規約ドキュメント作成

### パフォーマンス最適化 (2025-01-04)
- ダークモード監視をThemeContextで一元管理
- MemoCardの重複MutationObserver削除
- 全体的なレンダリング効率改善

### 実装時の注意点
1. **z-index**: `Z_INDEX`定数を使用し、Tailwindの`z-*`クラスは使わない
2. **position**: 重要な配置は`style`属性で直接指定
3. **モーダル・オーバーレイ**: 必ず`Z_INDEX.modalBackdrop`以上を使用
4. **型定義**: `src/types`から統一型をインポート、重複定義を避ける

## 次の改善予定
- [x] 型定義の重複解消
- [x] ダークモード監視の一元化
- [ ] 状態管理の最適化  
- [ ] コンポーネント分割（MemoCardが大きすぎる）
- [ ] アニメーション値の定数化