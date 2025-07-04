import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { COLOR_OPTIONS, DEFAULT_MEMO_COLOR } from '../constants'
import { SimpleColorButton } from './SimpleColorButton'
import { Z_INDEX } from '../constants/zIndex'

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

        <AnimatePresence>
          {isOpen && (
            <>
              {/* モーダル背景 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleClose}
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  zIndex: Z_INDEX.modalBackdrop,
                  backdropFilter: 'blur(4px)',
                  WebkitBackdropFilter: 'blur(4px)',
                }}
              />
              
              {/* モーダルコンテンツ */}
              <div
                style={{ 
                  position: 'fixed',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: Z_INDEX.modalContent,
                  width: '70vw',
                  height: '70vh',
                  maxWidth: '800px',
                  maxHeight: '600px'
                }}
              >
                <motion.form
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  onSubmit={handleSubmit}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '40px 40px 16px 16px',
                    background: 'linear-gradient(135deg, #a855f7, #ec4899, #10b981)',
                    padding: '4px',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <div
                    className="p-8 shadow-2xl relative flex flex-col h-full"
                    style={{ 
                      borderRadius: '36px 36px 12px 12px',
                      background: 'linear-gradient(145deg, #fef7ff 0%, #f0f9ff 50%, #ecfdf5 100%)',
                      boxShadow: '0 25px 60px rgba(168, 85, 247, 0.35)',
                    }}
                  >
                    {/* ヘッダー */}
                    <div className="flex justify-center items-center mb-6">
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        🎆 新しいメモを作成
                      </h2>
                    </div>

                    <input
                      type="text"
                      placeholder="タイトルを入力"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full mb-5 px-5 py-4 rounded-2xl focus:outline-none transition-all duration-200 font-bold placeholder-gray-400"
                      style={{ 
                        background: 'rgba(249, 245, 255, 0.7)',
                        color: '#1f2937',
                        fontSize: '1.75rem',
                        lineHeight: '2rem',
                        border: '2px solid #e5e7eb',
                        borderRadius: '1rem'
                      }}
                    />
                    <textarea
                      placeholder="メモの内容を入力..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="w-full mb-5 px-5 py-4 rounded-2xl focus:outline-none transition-all duration-200 resize-none flex-1 placeholder-gray-400"
                      style={{ 
                        background: 'rgba(249, 245, 255, 0.5)',
                        color: '#1f2937',
                        fontSize: '1.125rem',
                        lineHeight: '1.75rem',
                        border: 'none'
                      }}
                    />
            
                    {/* Color picker */}
                    <div className="mb-6">
                      <p className="text-sm font-medium mb-3 text-gray-700">🎨 メモの色を選択</p>
                      <div className="flex gap-2 justify-center">
                        {COLOR_OPTIONS.map((option) => (
                          <SimpleColorButton
                            key={option.name}
                            color={option.value}
                            isSelected={selectedColor === option.value}
                            onClick={() => setSelectedColor(option.value)}
                            size="md"
                            title={option.label}
                          />
                        ))}
                      </div>
                    </div>
            
                    <div className="flex gap-3 pt-2">
                      <button
                        type="submit"
                        className="flex-1 font-bold text-lg"
                        style={{
                          padding: '0.875rem',
                          borderRadius: '9999px',
                          background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                          color: 'white',
                          boxShadow: '0 4px 20px rgba(139, 92, 246, 0.4)',
                          border: 'none',
                          transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = '0 6px 25px rgba(139, 92, 246, 0.5)'
                          e.currentTarget.style.transform = 'translateY(-2px)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = '0 4px 20px rgba(139, 92, 246, 0.4)'
                          e.currentTarget.style.transform = 'translateY(0)'
                        }}
                      >
                        🎉 作成する
                      </button>
                      <button
                        type="button"
                        onClick={handleClose}
                        className="flex-1 font-medium"
                        style={{
                          padding: '0.875rem',
                          borderRadius: '9999px',
                          backgroundColor: 'white',
                          color: '#6b7280',
                          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                          border: '2px solid #e5e7eb',
                          transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f9fafb'
                          e.currentTarget.style.transform = 'translateY(-1px)'
                          e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.15)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'white'
                          e.currentTarget.style.transform = 'translateY(0)'
                          e.currentTarget.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)'
                        }}
                      >
                        キャンセル
                      </button>
                    </div>
                  </div>
                </motion.form>
              </div>
            </>
          )}
        </AnimatePresence>
    </div>
  )
}