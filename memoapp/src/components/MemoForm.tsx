import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { COLOR_OPTIONS, DEFAULT_MEMO_COLOR } from '../constants'
import { SimpleColorButton } from './SimpleColorButton'

interface MemoFormProps {
  onSubmit: (title: string, content: string, color: string) => void
  isOpen?: boolean
  onClose?: () => void
}

export const MemoForm = ({ onSubmit, isOpen: externalIsOpen, onClose }: MemoFormProps) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [selectedColor, setSelectedColor] = useState(DEFAULT_MEMO_COLOR)
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim() || content.trim()) {
      onSubmit(title, content, selectedColor)
      setTitle('')
      setContent('')
      setSelectedColor(DEFAULT_MEMO_COLOR)
      if (externalIsOpen !== undefined && onClose) {
        onClose()
      } else {
        setInternalIsOpen(false)
      }
    }
  }
  
  const handleOpen = () => {
    if (externalIsOpen === undefined) {
      setInternalIsOpen(true)
    }
  }
  
  const handleClose = () => {
    if (externalIsOpen !== undefined && onClose) {
      onClose()
    } else {
      setInternalIsOpen(false)
    }
  }

  return (
    <div className="mb-8">
      {externalIsOpen === undefined && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleOpen}
          className="mb-4 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all font-semibold flex items-center gap-2 mx-auto"
        >
          <span className="text-2xl">+</span>
          新しいメモを作成
        </motion.button>
      )}

        {isOpen && (
          <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm p-6 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700"
          >
            <input
              type="text"
              placeholder="タイトル"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mb-4 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              placeholder="メモの内容"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="w-full mb-4 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            
            {/* Color picker */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">メモの色</p>
              <div className="flex gap-2 justify-center">
                {COLOR_OPTIONS.map((option) => (
                  <SimpleColorButton
                    key={option.name}
                    color={option.value}
                    isSelected={selectedColor === option.value}
                    onClick={() => setSelectedColor(option.value)}
                    size="sm"
                    title={option.label}
                  />
                ))}
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 font-medium"
                style={{
                  padding: '0.75rem',
                  borderRadius: '9999px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                  border: 'none',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                作成
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="font-medium"
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
          </form>
        )}
    </div>
  )
}