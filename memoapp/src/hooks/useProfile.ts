import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { UserProfile, ProfileUpdate } from '../types/profile'

/**
 * ユーザープロフィール管理のカスタムフック
 */
export function useProfile(userId: string) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // プロフィールを取得
  const fetchProfile = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // プロフィールが存在しない場合は作成
          await createProfile(userId)
          return
        }
        throw error
      }

      setProfile(data)
    } catch (err) {
      console.error('Error fetching profile:', err)
      setError(err instanceof Error ? err.message : 'プロフィールの取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  // プロフィールを作成
  const createProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          user_id: userId,
          username: null,
          display_name: null,
          avatar_url: null
        })
        .select()
        .single()

      if (error) throw error
      setProfile(data)
    } catch (err) {
      console.error('Error creating profile:', err)
      setError(err instanceof Error ? err.message : 'プロフィールの作成に失敗しました')
    }
  }

  // プロフィールを更新
  const updateProfile = async (updates: ProfileUpdate) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single()

      if (error) throw error
      setProfile(data)
      return { success: true }
    } catch (err) {
      console.error('Error updating profile:', err)
      const message = err instanceof Error ? err.message : 'プロフィールの更新に失敗しました'
      setError(message)
      return { success: false, error: message }
    }
  }

  useEffect(() => {
    if (userId) {
      fetchProfile()
    }
  }, [userId])

  return {
    profile,
    loading,
    error,
    updateProfile,
    refetch: fetchProfile
  }
}