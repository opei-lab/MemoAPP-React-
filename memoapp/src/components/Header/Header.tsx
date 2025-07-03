import { memo } from 'react'
import { motion } from 'framer-motion'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../../lib/supabase'
import { SearchBar } from '../SearchBar'
import { ColorButton } from '../ColorButton'
type SortBy = 'created_at' | 'color' | 'position'
type FilterColor = string | null
import { COLOR_OPTIONS } from '../../constants'

interface HeaderProps {
  session: Session
  sortBy: SortBy
  setSortBy: (value: SortBy) => void
  filterColor: FilterColor
  setFilterColor: (value: FilterColor) => void
  darkMode: boolean
  setDarkMode: (value: boolean) => void
  showTrash: boolean
  setShowTrash: (value: boolean) => void
  trashCount: number
  onEmptyTrash?: () => void
  onNewMemo?: () => void
  searchQuery: string
  setSearchQuery: (value: string) => void
  searchResultCount?: number
}

const sortOptions = [
  { value: 'position' as const, label: '手動並び順' },
  { value: 'created_at' as const, label: '作成日順' },
  { value: 'color' as const, label: '色順' },
]

export const Header = memo(({ 
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
  onNewMemo,
  searchQuery,
  setSearchQuery,
  searchResultCount
}: HeaderProps) => {
  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <header className="fixed left-0 right-0 w-full z-50 shadow-lg border-b border-gray-200/20 dark:border-gray-700/20 bg-white/95 dark:bg-gray-900/95"
            style={{
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}>
      <div className="relative w-full py-4" style={{ paddingLeft: '2rem', paddingRight: '2rem' }}>
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />
        {/* 第1行：ロゴとメイン操作 */}
        <div className="flex items-center justify-between mb-3">
          {/* ロゴ */}
          <div className="flex items-center gap-3">
            <h1 className="text-5xl font-black"
                style={{ 
                  fontFamily: "'M PLUS Rounded 1c', sans-serif",
                  background: 'linear-gradient(to right, #3B82F6, #8B5CF6, #EC4899)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                  letterSpacing: '0.05em'
                }}>
              ぷるんぷるんメモ
            </h1>
          </div>
          
          {/* メイン操作 */}
          <div className="flex items-center gap-3">
            {/* ゴミ箱 */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowTrash(!showTrash)}
              className={`relative px-4 py-2 rounded-xl transition-all ${
                showTrash 
                  ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' 
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              title="ゴミ箱"
            >
              <span className="text-xl">🗑️</span>
              {trashCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg"
                >
                  {trashCount > 99 ? '99+' : trashCount}
                </motion.span>
              )}
            </motion.button>
            
            {/* ダークモード */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setDarkMode(!darkMode)}
              className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-all"
              title={darkMode ? 'ライトモード' : 'ダークモード'}
            >
              <motion.span 
                className="text-xl"
                animate={{ rotate: darkMode ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {darkMode ? '🌙' : '☀️'}
              </motion.span>
            </motion.button>
            
            {/* ログアウト */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSignOut}
              className="px-5 py-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
            >
              ログアウト
            </motion.button>
          </div>
        </div>
        
        {/* 第2行：検索とソート */}
        <div className="flex flex-wrap items-center gap-4 mb-3">
          {/* 検索バー */}
          <SearchBar 
            value={searchQuery}
            onChange={setSearchQuery}
            resultCount={searchResultCount}
          />
          {/* ソート */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">並び順:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-sm"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {sortBy === 'position' && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                (ドラッグ&ドロップで並び替え可能)
              </span>
            )}
            {sortBy === 'color' && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                (12色相環順)
              </span>
            )}
          </div>
          
        </div>
        
        {/* 第3行：色フィルター */}
        <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">色:</label>
            <div className="flex gap-1">
              {/* すべて表示ボタン */}
              <div
                onClick={() => setFilterColor(null)}
                className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl cursor-pointer transition-all hover:scale-105"
                style={{
                  background: `linear-gradient(135deg, 
                    #FFB3BA 0%, 
                    #FFD4B3 20%, 
                    #FFF5B3 40%, 
                    #BAFFC9 60%, 
                    #BAE1FF 80%, 
                    #E6BAFF 100%
                  )`,
                  border: filterColor === null ? '4px solid #3B82F6' : '3px solid white',
                  boxShadow: filterColor === null 
                    ? '0 0 0 3px white, 0 0 0 6px #3B82F6'
                    : '0 4px 15px rgba(0,0,0,0.15)',
                  backgroundImage: 'linear-gradient(135deg, #FFB3BA 0%, #FFD4B3 20%, #FFF5B3 40%, #BAFFC9 60%, #BAE1FF 80%, #E6BAFF 100%)',
                }}
                title="すべて表示"
              >
                {filterColor === null && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center">
                      <span className="text-blue-600 font-bold">✓</span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* カラーオプション */}
              {COLOR_OPTIONS.map((option) => (
                <ColorButton
                  key={option.name}
                  color={option.value}
                  isSelected={filterColor === option.value}
                  onClick={() => setFilterColor(option.value)}
                  size="md"
                  title={option.label}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* 第4行：新しいメモボタンとゴミ箱ボタン */}
        <div className="flex items-center gap-4 mt-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNewMemo}
            className="px-5 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
          >
            <span className="flex items-center gap-2">
              <span className="text-lg">+</span>
              新しいメモ
            </span>
          </motion.button>
          
          {/* ゴミ箱を空にするボタン */}
          {showTrash && trashCount > 0 && (
            <button
              onClick={onEmptyTrash}
              className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded shadow"
            >
              ゴミ箱を空にする
            </button>
          )}
        </div>
        
        {/* ユーザー情報 */}
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          👋 こんにちは、{session.user.email}
        </div>
    </header>
  )
})