import { useState, memo } from 'react'
import { motion } from 'framer-motion'

import { COLOR_OPTIONS } from '../../constants'
import { SimpleColorButton } from '../SimpleColorButton'
import { StyledButton } from '../StyledButton'

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
          <StyledButton
            variant="primary"
            onClick={handleSave}
            className="flex-1 font-bold"
          >
            保存する
          </StyledButton>
          <StyledButton
            variant="secondary"
            onClick={onCancel}
            className="font-bold"
          >
            キャンセル
          </StyledButton>
        </div>

        {/* 大画面で修正ボタン */}
        {onOpenLargeEdit && (
          <StyledButton
            variant="purple"
            onClick={onOpenLargeEdit}
            className="w-full font-bold"
          >
            大画面で修正
          </StyledButton>
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