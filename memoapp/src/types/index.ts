// メモの型定義
export interface Memo {
  id: string
  user_id: string
  title: string
  content: string
  color: string
  position: number
  created_at: string
  updated_at: string
  is_deleted?: boolean
}

// メモの作成・更新用の型
export type MemoInput = Omit<Memo, 'id' | 'created_at' | 'updated_at' | 'user_id'>
export type MemoUpdate = Partial<MemoInput>

// フィルター・ソートの型定義
export type SortBy = 'created_at' | 'color' | 'position'
export type FilterColor = string | null

// アプリケーション全体の状態
export interface AppState {
  memos: Memo[]
  trashedMemos: Memo[]
  sortBy: SortBy
  filterColor: FilterColor
  darkMode: boolean
  showTrash: boolean
  isLoading: boolean
}

// アクションの型定義
export type MemoAction = 
  | { type: 'SET_MEMOS'; payload: Memo[] }
  | { type: 'ADD_MEMO'; payload: Memo }
  | { type: 'UPDATE_MEMO'; payload: { id: string; updates: MemoUpdate } }
  | { type: 'DELETE_MEMO'; payload: string }
  | { type: 'MOVE_TO_TRASH'; payload: string }
  | { type: 'RESTORE_FROM_TRASH'; payload: string }
  | { type: 'EMPTY_TRASH' }
  | { type: 'SET_SORT_BY'; payload: SortBy }
  | { type: 'SET_FILTER_COLOR'; payload: FilterColor }
  | { type: 'SET_DARK_MODE'; payload: boolean }
  | { type: 'SET_SHOW_TRASH'; payload: boolean }
  | { type: 'SET_LOADING'; payload: boolean }