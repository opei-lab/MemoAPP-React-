import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  resultCount?: number
}

export const SearchBar = ({ value, onChange, resultCount }: SearchBarProps) => {
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Ctrl+F or Cmd+F でフォーカス
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative transition-all"
      style={{ width: '400px' }}
    >
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="メモを検索... (Ctrl+F)"
          className="w-full text-sm font-medium"
          style={{
            paddingLeft: '3rem',
            paddingRight: '3rem',
            paddingTop: '0.75rem',
            paddingBottom: '0.75rem',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '9999px',
            border: isFocused ? '2px solid #667eea' : '1px solid rgba(0, 0, 0, 0.06)',
            outline: 'none',
            transition: 'all 0.3s ease',
            boxShadow: isFocused 
              ? '0 0 0 4px rgba(102, 126, 234, 0.1), 0 4px 15px rgba(102, 126, 234, 0.2)' 
              : '0 2px 8px rgba(0, 0, 0, 0.08)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
          }}
        />
        
        {/* 検索アイコン */}
        <motion.div 
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          animate={{ scale: isFocused ? 1.1 : 1 }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </motion.div>
        
        {/* クリアボタン */}
        <AnimatePresence>
          {value && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => onChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      
      {/* 検索結果数 */}
      <AnimatePresence>
        {value && resultCount !== undefined && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute right-12 top-1/2 -translate-y-1/2 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-xs font-medium"
          >
            {resultCount === 0 ? '見つかりません' : `${resultCount}件`}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}