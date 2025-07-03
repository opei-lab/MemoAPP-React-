import { supabase, Session } from '../lib/supabase'
import { motion } from 'framer-motion'

interface HeaderProps {
  session: Session
  sortBy: 'created_at' | 'color'
  setSortBy: (value: 'created_at' | 'color') => void
  filterColor: string | null
  setFilterColor: (value: string | null) => void
  darkMode: boolean
  setDarkMode: (value: boolean) => void
  showTrash: boolean
  setShowTrash: (value: boolean) => void
  trashCount: number
  onEmptyTrash?: () => void
  onNewMemo?: () => void
}

const colorOptions = [
  { value: null, label: 'すべて', color: 'bg-gray-200' },
  { value: '#FFE4B5', label: 'ピーチ', color: 'bg-[#FFE4B5]' },
  { value: '#E6E6FA', label: 'ラベンダー', color: 'bg-[#E6E6FA]' },
  { value: '#98FB98', label: 'グリーン', color: 'bg-[#98FB98]' },
  { value: '#FFB6C1', label: 'ピンク', color: 'bg-[#FFB6C1]' },
  { value: '#87CEEB', label: 'スカイ', color: 'bg-[#87CEEB]' },
]

export const Header = ({ 
  session, 
  sortBy, 
  setSortBy, 
  filterColor, 
  setFilterColor,
  darkMode,
  setDarkMode,
  showTrash,
  setShowTrash,
  trashCount,
  onEmptyTrash,
  onNewMemo
}: HeaderProps) => {
  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <header className="fixed left-0 right-0 w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-lg z-50" style={{ top: 0, backgroundColor: darkMode ? '#1f2937' : '#ffffff' }}>
      <div className="w-full px-4 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <motion.h1 
            className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            ぷるんメモ
          </motion.h1>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* 新しいメモボタン */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNewMemo}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              <span className="text-xl">+</span>
              新しいメモ
            </motion.button>
            
            {/* ソート */}
            <div className="flex items-center gap-2 bg-white dark:bg-gray-700 rounded-full px-3 py-2 border border-gray-300 dark:border-gray-600">
              <span className="text-xs text-gray-600 dark:text-gray-400">並び順:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'created_at' | 'color')}
                className="bg-transparent text-sm font-medium focus:outline-none"
              >
                <option value="created_at">📅 新しい順</option>
                <option value="color">🎨 色順</option>
              </select>
            </div>
            
            {/* フィルター */}
            <div className="flex items-center gap-2 bg-white dark:bg-gray-700 rounded-full px-3 py-2 border border-gray-300 dark:border-gray-600">
              <span className="text-xs text-gray-600 dark:text-gray-400">色で絞込:</span>
              <div className="flex gap-2">
                {colorOptions.map((option) => (
                  <motion.button
                    key={option.value || 'all'}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setFilterColor(option.value)}
                    className={`w-10 h-10 rounded-full ${option.color} border-2 transition-all shadow-sm ${
                      filterColor === option.value 
                        ? 'border-purple-600 ring-2 ring-purple-400 scale-110' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    title={option.label}
                  />
                ))}
              </div>
            </div>
            
            {/* ゴミ箱 */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowTrash(!showTrash)}
                className={`p-2 rounded-full transition-all ${
                  showTrash 
                    ? 'bg-red-200 dark:bg-red-900' 
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
                title="ゴミ箱"
              >
                🗑️
                {trashCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {trashCount}
                  </span>
                )}
              </motion.button>
              
              {showTrash && trashCount > 0 && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onEmptyTrash}
                  className="absolute top-12 right-0 px-3 py-1 bg-red-500 text-white text-sm rounded-full shadow-lg"
                >
                  ゴミ箱を空にする
                </motion.button>
              )}
            </div>
            
            {/* ダークモード */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 transition-all"
            >
              {darkMode ? '🌙' : '☀️'}
            </motion.button>
            
            {/* ログアウト */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSignOut}
              className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full text-sm font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              ログアウト
            </motion.button>
          </div>
        </div>
        
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {session.user.email}
        </div>
      </div>
    </header>
  )
}