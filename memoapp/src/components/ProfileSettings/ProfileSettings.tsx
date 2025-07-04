import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Session } from '@supabase/supabase-js'
import { useProfile } from '../../hooks/useProfile'
import type { ProfileUpdate } from '../../types/profile'

interface ProfileSettingsProps {
  session: Session
  onClose: () => void
}

export function ProfileSettings({ session, onClose }: ProfileSettingsProps) {
  const { profile, loading, updateProfile } = useProfile(session.user.id)
  const [formData, setFormData] = useState({
    username: profile?.username || '',
    display_name: profile?.display_name || ''
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    const updates: ProfileUpdate = {
      username: formData.username || null,
      display_name: formData.display_name || null
    }

    const result = await updateProfile(updates)
    
    if (result.success) {
      setMessage('プロフィールを更新しました')
      setTimeout(() => {
        onClose()
      }, 1000)
    } else {
      setMessage(result.error || '更新に失敗しました')
    }
    
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
          <div className="text-center">読み込み中...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold dark:text-white">プロフィール設定</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-white">
              ユーザー名
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="例: yamada_taro"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <p className="text-xs text-gray-500 mt-1">
              半角英数字、アンダースコア、ハイフンが使用できます
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 dark:text-white">
              表示名
            </label>
            <input
              type="text"
              value={formData.display_name}
              onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
              placeholder="例: 山田太郎"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <p className="text-xs text-gray-500 mt-1">
              日本語や絵文字も使用できます
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 dark:text-white">
              メールアドレス
            </label>
            <input
              type="email"
              value={session.user.email || ''}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 dark:bg-gray-600 dark:border-gray-600 dark:text-gray-300"
            />
            <p className="text-xs text-gray-500 mt-1">
              メールアドレスは変更できません
            </p>
          </div>

          {message && (
            <div className={`text-sm p-2 rounded ${
              message.includes('失敗') || message.includes('エラー')
                ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
            }`}>
              {message}
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? '保存中...' : '保存'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}