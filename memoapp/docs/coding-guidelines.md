# コーディング規約

## 基本方針

### 1. 型安全性の確保
- TypeScriptの型システムを最大限活用
- `any`型の使用を避け、適切な型定義を行う
- 型定義は統一管理し、重複を避ける

### 2. 保守性の向上
- 単一責任の原則に従ったコンポーネント設計
- 定数やスタイルの統一管理
- 明確な命名規則の遵守

## ファイル・ディレクトリ構成

### コンポーネント構成
```
components/
├── ComponentName/           # PascalCase
│   ├── index.ts            # エクスポート用
│   ├── ComponentName.tsx   # メインコンポーネント
│   ├── SubComponent.tsx    # サブコンポーネント
│   └── types.ts            # ローカル型定義
```

### 定数管理
```
constants/
├── index.ts                # 全体エクスポート
├── zIndex.ts              # z-index管理
├── styles.ts              # 共通スタイル
├── colors.ts              # カラーパレット
└── animations.ts          # アニメーション設定
```

## 命名規則

### 変数・関数
- **camelCase**: `userName`, `handleClick`, `isVisible`
- **boolean**: `is*`, `has*`, `can*`で始める
- **イベントハンドラー**: `handle*`, `on*`で始める

### 定数
- **UPPER_SNAKE_CASE**: `Z_INDEX`, `COMMON_STYLES`
- **as const**: 型安全性のため必須

### コンポーネント
- **PascalCase**: `MemoCard`, `SimpleButton`
- **Props型**: `ComponentNameProps`

## インポート規則

### インポート順序
1. React関連
2. 外部ライブラリ
3. 内部モジュール（相対パス）
4. 型定義（最後）

```typescript
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSortable } from '@dnd-kit/sortable'

import { Z_INDEX, COMMON_STYLES } from '../../constants'
import { MemoContent } from './MemoContent'

import type { Memo, MemoUpdate } from '../../types'
```