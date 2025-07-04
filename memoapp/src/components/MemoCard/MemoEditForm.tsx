import { useState, memo } from 'react'
import { motion } from 'framer-motion'

import { COLOR_OPTIONS } from '../../constants'
import { SimpleColorButton } from '../SimpleColorButton'

import type { MemoUpdate, MemoEditFormProps } from '../../types'

export const MemoEditForm = memo(({ 
  initialTitle, 
  initialContent,
  initialColor, 
  onSave, 
  onCancel,
  onOpenLargeEdit
}: MemoEditFormProps) => {
  const [title, setTitle] = useState(initialTitle)
  const [content, setContent] = useState(initialContent)
  const [color, setColor] = useState(initialColor)
  
  // SVG内かどうかを判定（ダークモード時）
  const isInSVG = typeof window !== 'undefined' && document.documentElement.classList.contains('dark')
  
  // ダークモード時はTailwindクラスが効かないため、スタイルを完全にインライン化
  const containerStyle = isInSVG ? {
    backgroundColor: 'transparent',
    padding: '16px 0',
  } : {}
  
  const wrapperStyle = isInSVG ? {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.1)'
  } : {}

  const handleSave = () => {
    onSave({ title, content, color })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCancel()
    } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSave()
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full flex flex-col gap-3"
      onClick={(e) => e.stopPropagation()}
    >
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full px-4 py-3 bg-white/90 rounded-xl text-gray-800 font-semibold text-lg focus:outline-none placeholder-gray-400 shadow-inner"
        placeholder="タイトル"
        autoFocus
      />
      
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full px-4 py-3 bg-white/90 rounded-xl text-gray-700 resize-none focus:outline-none placeholder-gray-400 shadow-inner flex-1"
        placeholder="内容"
      />
      
      <div className="space-y-3">
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="flex-1 font-bold"
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
              color: 'white',
              boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
              border: 'none',
              transition: 'all 0.3s ease',
              whiteSpace: 'nowrap',
              minWidth: '0',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.5)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.4)'
            }}
          >
            保存する
          </button>
          <button
            onClick={onCancel}
            className="font-bold"
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(243, 244, 246, 0.9)',
              color: '#374151',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              border: '1px solid rgba(0, 0, 0, 0.06)',
              transition: 'all 0.3s ease',
              whiteSpace: 'nowrap',
              minWidth: '0',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(229, 231, 235, 0.9)'
              e.currentTarget.style.transform = 'translateY(-1px)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.12)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(243, 244, 246, 0.9)'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)'
            }}
          >
            キャンセル
          </button>
        </div>

        {/* 大画面で修正ボタン */}
        {onOpenLargeEdit && (
          <button
            onClick={onOpenLargeEdit}
            className="w-full font-bold"
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
              color: 'white',
              boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)',
              border: 'none',
              transition: 'all 0.3s ease',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(139, 92, 246, 0.5)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(139, 92, 246, 0.4)'
            }}
          >
            大画面で修正
          </button>
        )}
        
        {/* 色選択（大きく、下に配置） */}
        <div style={{
          backgroundColor: 'transparent',
          padding: isInSVG ? '12px 0' : '6px 0',
          marginTop: isInSVG ? '-8px' : '0'
        }}>
          <div className="flex justify-center gap-4 flex-wrap">
            {COLOR_OPTIONS.map((option) => (
              <SimpleColorButton
                key={option.name}
                color={option.value}
                isSelected={color === option.value}
                onClick={() => setColor(option.value)}
                size="xs"
                title={option.label}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
})