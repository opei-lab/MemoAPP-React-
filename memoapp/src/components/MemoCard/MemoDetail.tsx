import { motion, AnimatePresence } from 'framer-motion'
import { memo } from 'react'

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

interface MemoDetailProps {
  memo: Memo | null
  isOpen: boolean
  onClose: () => void
  onEdit: () => void
  onDelete: () => void
}

export const MemoDetail = memo(({ memo, isOpen, onClose, onEdit, onDelete }: MemoDetailProps) => {
  if (!memo) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* オーバーレイ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
          />
          
          {/* 拡大されたスライム */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed inset-0 flex items-center justify-center z-[101] p-8"
            onClick={onClose}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl h-[80vh] max-h-[600px]"
              style={{
                backgroundColor: memo.color,
                backgroundImage: `
                  radial-gradient(ellipse at top left, ${memo.color}ff 0%, ${memo.color}ee 50%)
                `,
                borderRadius: '60% 60% 20% 20% / 80% 80% 20% 20%',
                boxShadow: `
                  inset 0 8px 32px rgba(255,255,255,0.6),
                  inset 0 -8px 32px rgba(0,0,0,0.2),
                  0 25px 50px -12px rgba(0,0,0,0.4),
                  0 15px 30px -8px ${memo.color}80
                `,
              }}
              animate={{
                borderRadius: `${60 + Math.sin(Date.now() * 0.003) * 3}% ${60 + Math.cos(Date.now() * 0.003) * 3}% ${20 + Math.sin(Date.now() * 0.004) * 2}% ${20 + Math.cos(Date.now() * 0.004) * 2}% / ${80 + Math.sin(Date.now() * 0.002) * 3}% ${80 + Math.cos(Date.now() * 0.002) * 3}% ${20 + Math.sin(Date.now() * 0.003) * 2}% ${20 + Math.cos(Date.now() * 0.003) * 2}%`,
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* 閉じるボタンを削除 */}
              
              {/* スライムの顔（大きめ） */}
              <div className="absolute top-1/5 left-0 right-0 pointer-events-none">
                {/* 目 */}
                <div className="flex justify-center gap-16 mb-6">
                  <div className="w-12 h-16 bg-gray-800 rounded-full relative">
                    <motion.div 
                      className="absolute top-4 left-4 w-4 h-4 bg-white rounded-full"
                      animate={{
                        x: Math.sin(Date.now() * 0.001) * 3,
                        y: Math.cos(Date.now() * 0.001) * 2,
                      }}
                    />
                  </div>
                  <div className="w-12 h-16 bg-gray-800 rounded-full relative">
                    <motion.div 
                      className="absolute top-4 left-4 w-4 h-4 bg-white rounded-full"
                      animate={{
                        x: Math.sin(Date.now() * 0.001) * 3,
                        y: Math.cos(Date.now() * 0.001) * 2,
                      }}
                    />
                  </div>
                </div>
                
                {/* 口 */}
                <div className="flex justify-center">
                  <motion.div 
                    className="w-20 h-4 bg-gray-800 rounded-full"
                    animate={{ scaleX: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
              </div>
              
              {/* コンテンツ */}
              <div className="absolute bottom-8 left-12 right-12 top-2/5 overflow-y-auto">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center drop-shadow-lg">
                  {memo.title || '無題'}
                </h2>
                <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-6 shadow-inner">
                  <p className="text-gray-800 whitespace-pre-wrap leading-relaxed text-lg">
                    {memo.content}
                  </p>
                </div>
              </div>
              
              {/* アクションボタンを削除 */}
              
              {/* 光沢エフェクト */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ borderRadius: '60% 60% 20% 20% / 80% 80% 20% 20%' }}>
                <div 
                  className="absolute top-8 left-12 w-32 h-20"
                  style={{
                    background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.9) 0%, transparent 70%)',
                    filter: 'blur(10px)',
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
})