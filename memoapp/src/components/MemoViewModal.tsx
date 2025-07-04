import { motion } from 'framer-motion'
import { Z_INDEX } from '../constants/zIndex'
import type { Memo } from '../types'

interface MemoViewModalProps {
  memo: Memo
  onClose: () => void
}

/**
 * メモ閲覧用モーダル
 * メモカードクリック時に表示
 */
export function MemoViewModal({ memo, onClose }: MemoViewModalProps) {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99999 }}>
      {/* モーダル背景 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
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
          zIndex: 100000,
          width: '70vw',
          height: 'calc(100vh - 40px)',
          maxHeight: 'calc(100vh - 40px)'
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            borderRadius: '28px',
            background: `linear-gradient(135deg, ${memo.color}, ${memo.color}dd)`,
            padding: '4px'
          }}
        >
          <div
            className="shadow-2xl relative"
            style={{ 
              borderRadius: '24px',
              background: 'linear-gradient(145deg, #fef7ff 0%, #f0f9ff 50%, #ecfdf5 100%)',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.2)',
              height: 'calc(100% - 8px)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* ヘッダー */}
            <div className="mb-6" style={{ padding: '24px 32px 0 32px' }}>
              <h2 className="text-3xl font-bold text-gray-800" style={{ wordBreak: 'break-word' }}>
                {memo.title || 'メモ'}
              </h2>
            </div>

            {/* 内容 */}
            <div className="text-gray-700 whitespace-pre-wrap flex-1 overflow-y-auto px-8" style={{ fontSize: '1.125rem', lineHeight: '1.75rem', minHeight: '200px' }}>
              {memo.content || '内容がありません'}
            </div>

            {/* 下部エリア */}
            <div className="px-8 pb-4">
              {/* 色インジケーター */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm text-gray-500">メモの色:</span>
                <div 
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: memo.color,
                    border: '2px solid white',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                />
              </div>
              
              {/* 閉じるボタン */}
              <div className="flex justify-end" style={{ marginRight: '8px', marginBottom: '8px' }}>
                <motion.button
                  onClick={onClose}
                  className="font-medium shadow-md"
                  style={{
                    padding: '20px 60px',
                    fontSize: '20px',
                    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                    color: '#4a5568',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
                    borderRadius: '24px'
                  }}
                  whileHover={{ 
                    scale: 1.03,
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.12)'
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  閉じる
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}