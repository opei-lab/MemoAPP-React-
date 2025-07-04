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
  onCancel 
}: MemoEditFormProps) => {
  const [title, setTitle] = useState(initialTitle)
  const [content, setContent] = useState(initialContent)
  const [color, setColor] = useState(initialColor)

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
      className="w-full max-w-sm mx-auto flex flex-col gap-3"
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
        
        {/* 色選択（大きく、下に配置） */}
        <div className="bg-white/90 rounded-2xl p-6 shadow-inner">
          <p className="text-sm font-bold text-gray-700 mb-4 text-center">メモの色を選択</p>
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