import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Session } from '@supabase/supabase-js'

interface SimpleProfileModalProps {
  session: Session
  onClose: () => void
  onProfileUpdate?: () => void
}

/**
 * 簡易版プロフィール設定モーダル
 * まずは表示名の設定のみ実装
 */
export function SimpleProfileModal({ session, onClose, onProfileUpdate }: SimpleProfileModalProps) {
  const [displayName, setDisplayName] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 今はローカルストレージに保存（後でデータベースに変更）
    if (displayName.trim()) {
      localStorage.setItem(`display_name_${session.user.id}`, displayName.trim())
      setMessage('表示名を保存しました')
      setTimeout(() => {
        onClose()
        window.location.reload() // 簡易的な更新
      }, 1000)
    }
  }

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center" 
      style={{ 
        zIndex: 10000,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        position: 'fixed'
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative"
        style={{
          width: '500px',
          maxWidth: '90vw',
          borderRadius: '40px 40px 12px 12px',
          background: 'linear-gradient(45deg, #a855f7, #ec4899, #10b981)',
          padding: '4px'
        }}
      >
        <div
          className="shadow-2xl relative"
          style={{ 
            padding: '3rem 4rem',
            borderRadius: '36px 36px 8px 8px',
            background: 'linear-gradient(145deg, #fef7ff 0%, #f0f9ff 50%, #ecfdf5 100%)',
            boxShadow: '0 25px 50px rgba(168, 85, 247, 0.3)',
            color: 'black'
          }}
        >
        <div className="flex justify-center items-center mb-10">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            ✨ プロフィール設定
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-xl font-semibold mb-4 text-gray-700">
              表示名
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="例: 山田太郎"
              className="w-full px-6 py-6 border-2 border-purple-200 rounded-2xl focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-200 placeholder-gray-400"
              style={{ 
                background: 'linear-gradient(145deg, #faf5ff, #f3e8ff)',
                fontSize: '1.5rem',
                lineHeight: '2rem'
              }}
            />
            <p className="text-base text-gray-500 mt-3">
              日本語や絵文字も使用できます
            </p>
          </div>

          <div>
            <label className="block text-xl font-semibold mb-4 text-gray-700">
              メールアドレス
            </label>
            <input
              type="email"
              value={session.user.email || ''}
              disabled
              className="w-full px-6 py-6 rounded-2xl bg-gradient-to-r from-gray-50 to-blue-50 text-gray-600"
              style={{
                border: 'none',
                fontSize: '1.5rem',
                lineHeight: '2rem'
              }}
            />
          </div>

          {message && (
            <div className="text-lg p-5 rounded-2xl bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-2 border-green-300 shadow-md font-semibold">
              ✅ {message}
            </div>
          )}

          <div className="flex space-x-4 pt-8">
            <button
              type="submit"
              className="flex-1 px-6 py-5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 font-bold text-xl transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              💾 保存
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-5 border-2 border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 font-semibold text-xl transform hover:scale-105 transition-all duration-200"
            >
              キャンセル
            </button>
          </div>
        </form>
        </div>
      </motion.div>
    </div>
  )
}