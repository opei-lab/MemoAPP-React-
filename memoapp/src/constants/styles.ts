/**
 * 共通スタイル定義
 * CSS競合を避けるため、重要なスタイルはここに定義
 */

// ポジション関連
export const POSITION_STYLES = {
  absolute: {
    position: 'absolute' as const,
  },
  relative: {
    position: 'relative' as const,
  },
  fixed: {
    position: 'fixed' as const,
  },
  sticky: {
    position: 'sticky' as const,
  },
} as const

// 共通のスタイルパターン
export const COMMON_STYLES = {
  // フルサイズ
  fullSize: {
    width: '100%',
    height: '100%',
  },
  // 中央配置
  centerFlex: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // オーバーレイ
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  // インタラクション無効化
  noPointerEvents: {
    pointerEvents: 'none' as const,
  },
  // インタラクション有効化
  pointerEvents: {
    pointerEvents: 'auto' as const,
  },
} as const

// スライム関連のスタイル
export const SLIME_STYLES = {
  // スライム本体
  body: {
    position: 'relative' as const,
    overflow: 'visible',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  // 顔のコンテナ
  faceContainer: {
    position: 'absolute' as const,
    pointerEvents: 'none' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
  },
  // ボタンコンテナ
  buttonContainer: {
    position: 'absolute' as const,
    top: '12px',
    left: '12px',
    display: 'flex',
    gap: '8px',
  },
} as const