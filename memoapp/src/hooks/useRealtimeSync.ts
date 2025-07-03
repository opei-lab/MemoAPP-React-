import { useEffect, useCallback } from 'react'
import { RealtimeChannel } from '@supabase/supabase-js'
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
}

interface UseRealtimeSyncProps {
  userId: string
  onMemoUpdate: (memo: Memo) => void
  onMemoDelete: (id: string) => void
  onMemoCreate: (memo: Memo) => void
}

export const useRealtimeSync = ({ userId, onMemoUpdate, onMemoDelete, onMemoCreate }: UseRealtimeSyncProps) => {
  const setupRealtimeSubscription = useCallback(() => {
    const channel: RealtimeChannel = supabase
      .channel('memos-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'memos',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('Realtime INSERT:', payload)
          if (payload.new && typeof payload.new === 'object') {
            onMemoCreate(payload.new as Memo)
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'memos',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('Realtime UPDATE:', payload)
          if (payload.new && typeof payload.new === 'object') {
            onMemoUpdate(payload.new as Memo)
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'memos',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('Realtime DELETE:', payload)
          if (payload.old && typeof payload.old === 'object' && 'id' in payload.old) {
            onMemoDelete(payload.old.id as string)
          }
        }
      )
      .subscribe()

    return channel
  }, [userId, onMemoUpdate, onMemoDelete, onMemoCreate])

  useEffect(() => {
    const channel = setupRealtimeSubscription()
    
    return () => {
      supabase.removeChannel(channel)
    }
  }, [setupRealtimeSubscription])
}