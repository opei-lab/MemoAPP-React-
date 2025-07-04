import { createContext, useContext, useState, ReactNode } from 'react'

interface MemoEditContextType {
  editingMemoId: string | null
  setEditingMemoId: (id: string | null) => void
  isEditing: (id: string) => boolean
  startEditing: (id: string) => void
  stopEditing: () => void
}

const MemoEditContext = createContext<MemoEditContextType | undefined>(undefined)

interface MemoEditProviderProps {
  children: ReactNode
}

/**
 * メモの編集状態を一元管理するProvider
 * 同時に複数のメモが編集状態になることを防ぐ
 */
export function MemoEditProvider({ children }: MemoEditProviderProps) {
  const [editingMemoId, setEditingMemoId] = useState<string | null>(null)

  const isEditing = (id: string): boolean => {
    return editingMemoId === id
  }

  const startEditing = (id: string) => {
    // 他のメモが編集中の場合は先に停止
    setEditingMemoId(id)
  }

  const stopEditing = () => {
    setEditingMemoId(null)
  }

  const value: MemoEditContextType = {
    editingMemoId,
    setEditingMemoId,
    isEditing,
    startEditing,
    stopEditing
  }

  return (
    <MemoEditContext.Provider value={value}>
      {children}
    </MemoEditContext.Provider>
  )
}

/**
 * メモ編集状態を取得するカスタムフック
 */
export function useMemoEdit() {
  const context = useContext(MemoEditContext)
  if (context === undefined) {
    throw new Error('useMemoEdit must be used within a MemoEditProvider')
  }
  return context
}