import { useState, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { COLOR_OPTIONS } from '../../constants'

interface MemoActionsProps {
  memoId: string
  currentColor: string
  isVisible: boolean
  onEdit: () => void
  onColorChange: (color: string) => void
  onDelete: () => void
}

export const MemoActions = memo(({ 
  currentColor, 
  isVisible, 
  onEdit, 
  onColorChange, 
  onDelete 
}: MemoActionsProps) => {
  const [showColorPicker, setShowColorPicker] = useState(false)

  const handleDelete = () => {
    if (window.confirm('このメモを削除しますか？')) {
      onDelete()
    }
  }

  const handleColorSelect = (color: string) => {
    onColorChange(color)
    setShowColorPicker(false)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="mt-3 flex justify-center gap-2"
        >
          {/* カラーピッカー */}
          <div className="relative">
            <motion.button
              onClick={() => setShowColorPicker(!showColorPicker)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-white/50 transition-all duration-200"
              title="色を変更"
            >
              <span className="text-2xl">🎨</span>
            </motion.button>
            
            <AnimatePresence>
              {showColorPicker && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 10 }}
                  className="absolute bottom-14 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-2xl p-4 z-50"
                  style={{ minWidth: '280px' }}
                >
                  <p className="text-sm font-medium text-gray-700 mb-3 text-center">色を選択</p>
                  <div className="grid grid-cols-5 gap-3">
                    {COLOR_OPTIONS.map(({ name, value, label }) => (
                      <button
                        key={name}
                        onClick={() => handleColorSelect(value)}
                        className={`w-12 h-12 rounded-lg transition-all ${
                          currentColor === value 
                            ? 'ring-4 ring-blue-500 scale-110' 
                            : 'ring-2 ring-gray-300 hover:ring-gray-400 hover:scale-105'
                        }`}
                        style={{ 
                          backgroundColor: value,
                          border: `3px solid ${currentColor === value ? '#3B82F6' : '#fff'}`
                        }}
                        title={label}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 編集ボタン */}
          <motion.button
            onClick={onEdit}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-white/50 transition-all duration-200"
            title="編集"
          >
            <span className="text-2xl">✏️</span>
          </motion.button>

          {/* 削除ボタン */}
          <motion.button
            onClick={handleDelete}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 bg-red-100/90 backdrop-blur-sm hover:bg-red-200/90 rounded-full flex items-center justify-center shadow-lg border-2 border-red-200/50 transition-all duration-200"
            title="削除"
          >
            <span className="text-2xl">🗑️</span>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  )
})