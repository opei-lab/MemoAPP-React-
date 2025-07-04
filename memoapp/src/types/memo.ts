/**
 * メモ関連の型定義
 */

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

/**
 * メモの部分更新用型
 * IDや作成日時など、更新できないフィールドを除外
 */
export type MemoUpdate = Partial<Pick<Memo, 
  'title' | 'content' | 'color' | 'position'
>>

/**
 * メモ新規作成用型
 * システムが自動生成するフィールドを除外
 */
export type MemoCreate = Omit<Memo, 'id' | 'created_at' | 'updated_at'>

/**
 * メモカードのProps型
 */
export interface MemoCardProps {
  memo: Memo
  onUpdate: (id: string, updates: MemoUpdate) => void
  onDelete: (id: string) => void
  index: number
}

/**
 * メモコンテンツのProps型
 */
export interface MemoContentProps {
  title: string
  content: string
}

/**
 * メモ編集フォームのProps型
 */
export interface MemoEditFormProps {
  initialTitle: string
  initialContent: string
  initialColor: string
  onSave: (updates: MemoUpdate) => void
  onCancel: () => void
}