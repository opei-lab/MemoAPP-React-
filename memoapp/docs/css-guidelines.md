# CSS・スタイル規約

## 基本方針

### 1. CSS競合の回避
- 重要なスタイルは**インライン**で記述
- Tailwindクラスは基本的なレイアウトのみに使用
- z-indexは必ず統一定数を使用

### 2. 予測可能なスタイル
- スタイルの優先順位を明確化
- 共通パターンは定数として管理

## z-index管理

### 使用方法
```typescript
import { Z_INDEX } from '../constants'

// ❌ 避けるべき
className="z-10"
className="z-[100]"

// ✅ 推奨
style={{ zIndex: Z_INDEX.card }}
style={{ zIndex: Z_INDEX.modalBackdrop }}
```

### z-index階層
```typescript
Z_INDEX = {
  base: 0,           // 基本レイヤー
  card: 10,          // カード
  cardHover: 20,     // ホバー時
  cardFace: 30,      // 顔パーツ
  cardButton: 40,    // ボタン
  editForm: 50,      // 編集フォーム
  dragging: 100,     // ドラッグ中
  modalBackdrop: 9999,   // モーダル背景
  modalContent: 10000,   // モーダル内容
  tooltip: 20000,        // ツールチップ
  notification: 30000,   // 通知
}
```

## スタイル記述ルール

### 1. 重要なスタイルはインライン
```typescript
// ❌ 避けるべき
className="absolute top-4 right-4 z-50"

// ✅ 推奨
style={{
  position: 'absolute',
  top: '16px',
  right: '16px',
  zIndex: Z_INDEX.cardButton
}}
```

### 2. 共通スタイルは定数化
```typescript
// 定数で定義
export const COMMON_STYLES = {
  centerFlex: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  }
}

// 使用時
style={{ ...COMMON_STYLES.centerFlex }}
```

### 3. アニメーション値の管理
```typescript
// ❌ ハードコード
animate={{
  borderRadius: `${60 + Math.sin(Date.now() * 0.003) * 5}%...`
}}

// ✅ 定数化（今後実装予定）
animate={{
  borderRadius: getSlimeBorderRadius(time, isHovered)
}}
```

## モーダル・オーバーレイの実装

### 基本パターン
```typescript
// 背景オーバーレイ
<div style={{
  ...COMMON_STYLES.overlay,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  zIndex: Z_INDEX.modalBackdrop
}} />

// モーダル内容
<div style={{
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: Z_INDEX.modalContent
}} />
```

## 禁止事項

1. **z-indexのハードコード**
   - `z-10`, `z-[100]`等のTailwindクラス
   - `zIndex: 999`等の直接指定

2. **重要な配置のTailwindクラス依存**
   - モーダルの`fixed`配置
   - オーバーレイの`absolute`配置

3. **スタイルの重複定義**
   - 同じパターンの繰り返し
   - コンポーネント間でのスタイル重複