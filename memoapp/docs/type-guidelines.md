# 型定義規約

## 基本方針

### 1. 型の統一管理
- 共通型は`src/types/`ディレクトリで管理
- コンポーネント固有の型はローカルで定義
- 型の重複を避け、単一の情報源を維持

### 2. 型安全性の確保
- 厳密な型定義でランタイムエラーを防止
- `as const`による型の厳密化
- 適切なジェネリクスの活用

## ディレクトリ構成

```
src/
├── types/
│   ├── index.ts         # 全体エクスポート
│   ├── memo.ts          # メモ関連型
│   ├── common.ts        # 共通型
│   └── ...
└── components/
    └── Component/
        └── types.ts     # ローカル型定義
```

## 型定義ルール

### 1. 基本エンティティ型
```typescript
// src/types/memo.ts
export interface Memo {
  id: string
  user_id: string
  title: string
  content: string
  color: string
  position: number
  created_at: string
  updated_at: string
}

// 部分更新用
export type MemoUpdate = Partial<Pick<Memo, 
  'title' | 'content' | 'color' | 'position'
>>

// 新規作成用
export type MemoCreate = Omit<Memo, 'id' | 'created_at' | 'updated_at'>
```

### 2. Props型の命名
```typescript
// コンポーネント名 + Props
export interface MemoCardProps {
  memo: Memo
  onUpdate: (id: string, updates: MemoUpdate) => void
  onDelete: (id: string) => void
  index: number
}
```

### 3. 定数型の厳密化
```typescript
// as const で厳密な型を生成
export const Z_INDEX = {
  card: 10,
  modal: 9999,
} as const

export type ZIndexKey = keyof typeof Z_INDEX
```

### 4. イベントハンドラー型
```typescript
// 標準的なイベントハンドラー
type ClickHandler = (event: React.MouseEvent<HTMLElement>) => void
type ChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => void

// カスタムハンドラー
type MemoUpdateHandler = (id: string, updates: MemoUpdate) => void
```

## 型のインポート・エクスポート

### エクスポート
```typescript
// src/types/index.ts
export type { Memo, MemoUpdate, MemoCreate } from './memo'
export type { CommonProps, StyleProps } from './common'
```

### インポート
```typescript
// 型のみのインポートを明示
import type { Memo, MemoUpdate } from '../types'
import type { MemoCardProps } from './types'
```

## ユーティリティ型の活用

### 1. 条件型の使用
```typescript
// 状態に応じた型
type MemoCardState = 'idle' | 'editing' | 'dragging'

type MemoCardProps<T extends MemoCardState> = T extends 'editing'
  ? { isEditing: true; onSave: () => void }
  : { isEditing: false }
```

### 2. 型ガードの実装
```typescript
export function isMemo(obj: unknown): obj is Memo {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof (obj as Memo).id === 'string' &&
    typeof (obj as Memo).title === 'string'
  )
}
```

## 禁止事項

1. **any型の使用**
   - 型不明の場合は`unknown`を使用
   - 段階的に型を絞り込む

2. **型の重複定義**
   - 同じ構造の型を複数箇所で定義
   - 共通部分は抽出して再利用

3. **非厳密な定数定義**
   - `as const`を忘れる
   - 型推論に頼りすぎる

## 型定義の移行計画

### Phase 1: 共通型の統一
- [ ] Memo型の統一
- [ ] Props型の整理
- [ ] 定数型の厳密化

### Phase 2: 型安全性の向上
- [ ] 型ガードの導入
- [ ] ユーティリティ型の活用
- [ ] 厳密な型チェック