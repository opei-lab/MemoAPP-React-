import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { COLOR_OPTIONS, DEFAULT_MEMO_COLOR } from '../constants'

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
                {COLOR_OPTIONS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setSelectedColor(color.value)}
                    className={`w-16 h-16 rounded-lg transition-all ${
                      selectedColor === color.value
                        ? 'ring-4 ring-blue-500'
                        : 'ring-2 ring-gray-300 hover:ring-gray-400'
                    }`}
                    style={{ 
                      backgroundColor: color.value,
                      border: `3px solid ${selectedColor === color.value ? '#3B82F6' : '#D1D5DB'}`
                    }}
                    title={color.label}
                  />
                ))}
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded font-medium transition-colors"
              >
                作成
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 rounded font-medium transition-colors"
              >
                キャンセル
              </button>
            </div>
          </form>
        )}
    </div>
  )
}