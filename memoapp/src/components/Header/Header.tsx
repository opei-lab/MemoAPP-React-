import { memo } from 'react'
import { motion } from 'framer-motion'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../../lib/supabase'
import { SearchBar } from '../SearchBar'
import { SimpleColorButton } from '../SimpleColorButton'
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
    <header className="fixed left-0 right-0 w-full z-50 shadow-lg bg-white/95 dark:bg-gray-900/95"
            style={{
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}>
      <div className="relative w-full py-4" style={{ paddingLeft: '2rem', paddingRight: '2rem' }}>
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
              className="relative"
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.75rem',
                backgroundColor: showTrash ? 'rgba(254, 202, 202, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                color: showTrash ? '#DC2626' : '#374151',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)'
              }}
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
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.75rem',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                color: '#374151',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)'
              }}
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
              className="font-medium"
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '9999px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                border: 'none',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              ログアウト
            </motion.button>
          </div>
        </div>
        
        {/* 第2行：検索とソート */}
        <div className="flex items-center gap-4 mb-3" style={{ flexWrap: 'nowrap' }}>
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
              className="text-sm font-medium"
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '9999px',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                color: '#374151',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(0, 0, 0, 0.06)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                cursor: 'pointer',
                outline: 'none',
                appearance: 'none',
                paddingRight: '2rem',
                backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23374151' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.5rem center',
                backgroundSize: '1.2rem',
              }}
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
                (色相環順)
              </span>
            )}
          </div>
          
        </div>
        
        {/* 第3行：色フィルター */}
        <div className="flex items-center gap-2" style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>
            <label className="text-sm text-gray-600 dark:text-gray-400">色:</label>
            <div className="flex gap-1">
              {/* すべて表示ボタン */}
              <div
                onClick={() => setFilterColor(null)}
                title="すべて表示"
                style={{
                  width: '56px',
                  height: '56px',
                  background: `linear-gradient(135deg, 
                    #FFB3BA 0%, 
                    #FFD4B3 20%, 
                    #FFF5B3 40%, 
                    #BAFFC9 60%, 
                    #BAE1FF 80%, 
                    #E6BAFF 100%
                  )`,
                  border: filterColor === null ? '4px solid #3B82F6' : '3px solid white',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  boxShadow: filterColor === null 
                    ? '0 0 0 3px white, 0 0 0 6px #3B82F6'
                    : '0 4px 15px rgba(0,0,0,0.15)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              >
                {filterColor === null && (
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '24px',
                    height: '24px',
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                  }}>
                    <span style={{ color: '#3B82F6', fontWeight: 'bold' }}>✓</span>
                  </div>
                )}
              </div>
              
              {/* カラーオプション */}
              {COLOR_OPTIONS.map((option) => (
                <SimpleColorButton
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
        <div className="flex items-center gap-4 mt-2" style={{ paddingLeft: '2rem', paddingRight: '2rem' }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNewMemo}
            className="font-medium"
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
              border: 'none',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>+</span>
            新しいメモ
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
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400" style={{ paddingLeft: '2rem', paddingRight: '2rem' }}>
          👋 こんにちは、{session.user.email}
        </div>
    </header>
  )
})