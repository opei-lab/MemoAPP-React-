import { useCallback } from 'react'
import { supabase } from '../lib/supabase'

interface Memo {
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

type MemoUpdate = Partial<Memo>

export const useMemoOperations = (userId: string) => {
  // メモの取得
  const fetchMemos = useCallback(async (): Promise<Memo[]> => {
    const { data, error } = await supabase
      .from('memos')
      .select('*')
      .eq('user_id', userId)
      .order('position', { ascending: true })

    if (error) {
      console.error('Error fetching memos:', error)
      throw error
    }

    return data || []
  }, [userId])

  // メモの作成
  const createMemo = useCallback(async (
    title: string,
    content: string,
    color: string,
    position: number
  ): Promise<Memo> => {
    const { data, error } = await supabase
      .from('memos')
      .insert([{
        user_id: userId,
        title,
        content,
        color,
        position,
      }])
      .select()
      .single()

    if (error) {
      console.error('Error creating memo:', error)
      throw error
    }

    return data
  }, [userId])

  // メモの更新
  const updateMemo = useCallback(async (
    id: string,
    updates: MemoUpdate
  ): Promise<void> => {
    const { error } = await supabase
      .from('memos')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)

    if (error) {
      console.error('Error updating memo:', error)
      throw error
    }
  }, [userId])

  // メモの削除
  const deleteMemo = useCallback(async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('memos')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) {
      console.error('Error deleting memo:', error)
      throw error
    }
  }, [userId])

  // ポジションの一括更新
  const updatePositions = useCallback(async (
    updates: Array<{ id: string; position: number }>
  ): Promise<void> => {
    try {
      await Promise.all(
        updates.map(({ id, position }) =>
          supabase
            .from('memos')
            .update({ position })
            .eq('id', id)
            .eq('user_id', userId)
        )
      )
    } catch (error) {
      console.error('Error updating positions:', error)
      throw error
    }
  }, [userId])

  return {
    fetchMemos,
    createMemo,
    updateMemo,
    deleteMemo,
    updatePositions,
  }
}