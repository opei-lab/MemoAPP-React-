import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface FloatingActionButtonProps {
  onNewMemo: () => void
  onToggleTheme: () => void
  onToggleTrash: () => void
  darkMode: boolean
  showTrash: boolean
}

export const FloatingActionButton = ({ 
  onNewMemo, 
  onToggleTheme, 
  onToggleTrash,
  darkMode,
  showTrash 
}: FloatingActionButtonProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const actions = [
    { icon: '📝', label: '新しいメモ', onClick: onNewMemo, color: 'bg-blue-500' },
    { icon: darkMode ? '☀️' : '🌙', label: 'テーマ切替', onClick: onToggleTheme, color: 'bg-purple-500' },
    { icon: '🗑️', label: 'ゴミ箱', onClick: onToggleTrash, color: showTrash ? 'bg-red-600' : 'bg-gray-500' },
  ]

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div className="absolute bottom-16 right-0 space-y-3">
            {actions.map((action, index) => (
              <motion.button
                key={action.label}
                initial={{ scale: 0, opacity: 0, y: 20 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1, 
                  y: 0,
                  transition: { delay: index * 0.1 }
                }}
                exit={{ 
                  scale: 0, 
                  opacity: 0, 
                  y: 20,
                  transition: { delay: (actions.length - index - 1) * 0.1 }
                }}
                whileHover={{ scale: 1.1, x: -5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  action.onClick()
                  setIsOpen(false)
                }}
                className={`${action.color} text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:shadow-xl transition-all relative group`}
              >
                <span className="text-2xl">{action.icon}</span>
                <span className="absolute right-full mr-3 px-3 py-1 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {action.label}
                </span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-xl hover:shadow-2xl transition-all"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ rotate: isOpen ? 45 : 0 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <span className="text-3xl">+</span>
      </motion.button>
    </div>
  )
}