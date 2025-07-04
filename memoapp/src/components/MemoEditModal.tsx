import { useState } from 'react'
import { motion } from 'framer-motion'
import { COLOR_OPTIONS, MODAL_STYLES, MODAL_BUTTON_STYLES, MODAL_ANIMATIONS } from '../constants'
import { SimpleColorButton } from './SimpleColorButton'
import type { Memo, MemoUpdate } from '../types'

interface MemoEditModalProps {
  memo: Memo
  onSave: (updates: MemoUpdate) => void
  onClose: () => void
}

/**
 * メモ編集用大画面モーダル
 * 編集フォームから「大画面で修正」ボタンで開く
 */
export function MemoEditModal({ memo, onSave, onClose }: MemoEditModalProps) {
  const [title, setTitle] = useState(memo.title)
  const [content, setContent] = useState(memo.content)
  const [color, setColor] = useState(memo.color)

  const handleSave = () => {
    onSave({ title, content, color })
    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSave()
    }
  }

  return (
    <div style={MODAL_STYLES.backdropContainer}>
      {/* モーダル背景 */}
      <motion.div
        {...MODAL_ANIMATIONS.backdrop}
        onClick={onClose}
        style={MODAL_STYLES.backdrop}
      />
      
      {/* モーダルコンテンツ */}
      <div style={MODAL_STYLES.editModal}>
        <motion.div
          {...MODAL_ANIMATIONS.modal}
          onClick={(e) => e.stopPropagation()}
          style={{
            ...MODAL_STYLES.editModalFrame,
            background: `linear-gradient(135deg, ${color}, ${color}dd)`,
          }}
        >
          <div
            className="shadow-2xl relative"
            style={MODAL_STYLES.editModalContent}
          >
            {/* ヘッダー */}
            <div className="flex items-center justify-between" style={MODAL_STYLES.editModalHeader}>
              <h2 className="text-3xl font-bold text-gray-800">メモを編集</h2>
            </div>

            {/* 編集エリア */}
            <div className="flex-1 px-8 flex flex-col overflow-hidden" style={MODAL_STYLES.editArea}>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full px-6 py-4 text-gray-800 font-bold focus:outline-none placeholder-gray-400"
                style={MODAL_STYLES.titleInput}
                placeholder="タイトル"
                autoFocus
              />
              
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 w-full px-6 py-4 text-gray-800 focus:outline-none placeholder-gray-400 resize-none"
                style={MODAL_STYLES.contentTextarea}
                placeholder="メモの内容"
              />
            </div>

            {/* 下部エリア */}
            <div className="flex justify-between items-center px-8 py-8" style={MODAL_STYLES.bottomArea}>
              {/* 色選択（左下） */}
              <div className="flex gap-2" style={MODAL_STYLES.colorPanelContainer}>
                {COLOR_OPTIONS.map((option) => (
                  <SimpleColorButton
                    key={option.name || option.value}
                    color={option.value}
                    isSelected={color === option.value}
                    onClick={() => setColor(option.value)}
                    size="md"
                    title={option.label}
                  />
                ))}
              </div>
              
              {/* ボタン（右下） */}
              <div className="flex gap-4" style={{ alignItems: 'center' }}>
              <motion.button
                onClick={onClose}
                className="font-medium"
                style={MODAL_BUTTON_STYLES.cancel}
                whileHover={MODAL_ANIMATIONS.buttonHover.cancel}
                whileTap={MODAL_ANIMATIONS.buttonTap}
              >
                キャンセル
              </motion.button>
              
              <motion.button
                onClick={handleSave}
                className="font-medium text-white"
                style={MODAL_BUTTON_STYLES.save}
                whileHover={MODAL_ANIMATIONS.buttonHover.save}
                whileTap={MODAL_ANIMATIONS.buttonTap}
              >
                保存
              </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}