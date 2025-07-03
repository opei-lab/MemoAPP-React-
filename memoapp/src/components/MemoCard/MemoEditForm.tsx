import { useState, memo } from 'react'
import { motion } from 'framer-motion'
import { COLOR_OPTIONS } from '../../constants'
import { ColorButton } from '../ColorButton'
interface Memo {
  id: string
  user_id: string
  title: string
  content: string
  color: string
  position: number
  created_at: string
  updated_at: string
}

type MemoUpdate = Partial<Memo>

interface MemoEditFormProps {
  initialTitle: string
  initialContent: string
  initialColor: string
  onSave: (updates: MemoUpdate) => void
  onCancel: () => void
}

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
        className="w-full px-4 py-3 bg-white/90 rounded-xl text-gray-800 font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400 shadow-inner"
        placeholder="タイトル"
        autoFocus
      />
      
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full px-4 py-3 bg-white/90 rounded-xl text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400 shadow-inner flex-1"
        placeholder="内容"
      />
      
      <div className="space-y-3">
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl text-white font-bold transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
          >
            保存する
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-3 bg-gray-300 hover:bg-gray-400 active:bg-gray-500 rounded-xl text-gray-700 font-bold transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
          >
            キャンセル
          </button>
        </div>
        
        {/* 色選択（大きく、下に配置） */}
        <div className="bg-white/90 rounded-2xl p-6 shadow-inner">
          <p className="text-sm font-bold text-gray-700 mb-4 text-center">メモの色を選択</p>
          <div className="flex justify-center gap-4 flex-wrap">
            {COLOR_OPTIONS.map((option) => (
              <ColorButton
                key={option.name}
                color={option.value}
                isSelected={color === option.value}
                onClick={() => setColor(option.value)}
                size="lg"
                title={option.label}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
})