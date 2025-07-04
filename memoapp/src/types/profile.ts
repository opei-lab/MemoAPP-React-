/**
 * ユーザープロフィール関連の型定義
 */

export interface UserProfile {
  id: string
  user_id: string
  username: string | null
  display_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export type ProfileUpdate = Partial<Pick<UserProfile, 'username' | 'display_name' | 'avatar_url'>>