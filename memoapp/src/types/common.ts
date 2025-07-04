/**
 * 共通型定義
 */

/**
 * 基本的なイベントハンドラー型
 */
export type ClickHandler = (event: React.MouseEvent<HTMLElement>) => void
export type ChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => void
export type KeyDownHandler = (event: React.KeyboardEvent<HTMLElement>) => void

/**
 * カスタムイベントハンドラー型
 */
export type MemoUpdateHandler = (id: string, updates: Partial<any>) => void
export type MemoDeleteHandler = (id: string) => void

/**
 * スタイル関連の型
 */
export interface StyleProps {
  className?: string
  style?: React.CSSProperties
}

/**
 * 共通のProps型
 */
export interface CommonProps extends StyleProps {
  children?: React.ReactNode
  id?: string
}

/**
 * アニメーション状態
 */
export type AnimationState = 'idle' | 'hover' | 'active' | 'disabled'

/**
 * カードの状態
 */
export type CardState = 'normal' | 'editing' | 'dragging' | 'hover'

/**
 * テーマ関連
 */
export type ThemeMode = 'light' | 'dark'

/**
 * レスポンシブブレークポイント
 */
export type Breakpoint = 'mobile' | 'tablet' | 'desktop' | 'wide'