import { useState, memo, forwardRef, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { COLOR_OPTIONS, ANIMATION_CONFIG, Z_INDEX, COMMON_STYLES, SLIME_STYLES } from '../../constants'
import { MemoContent } from './MemoContent'
import { MemoActions } from './MemoActions'
import { MemoEditForm } from './MemoEditForm'
import { SlimeFace } from './SlimeFace'
import { SlimeEffects, SlimeShadows } from './SlimeEffects'
import { useGestures } from '../../hooks/useGestures'
import { useSlimeAnimation } from '../../hooks/useSlimeAnimation'
import { useTheme } from '../../contexts'

import type { Memo, MemoUpdate, MemoCardProps } from '../../types'

export const MemoCard = memo(forwardRef<HTMLDivElement, MemoCardProps>(({ memo: memoData, onUpdate, onDelete, index }, ref) => {
  const { isDarkMode } = useTheme()
  const [isEditing, setIsEditing] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  
  // メモのIDから顔のバリエーションを生成
  const faceVariation = useMemo(() => {
    const hash = memoData.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return {
      eyeGap: 50 + (hash % 20) * 2, // 目の間隔: 50-90 (さらに離す)
      eyeSize: 24 + (hash % 8) * 2, // 目のサイズ: 24-38 (さらに大きく)
      pupilSize: 14 + (hash % 6) * 2, // 瞳のサイズ: 14-24 (さらに大きく)
      mouthWidth: 70 + (hash % 40), // 口の幅: 70-109 (さらに横長に)
      mouthCurve: 25 + (hash % 15), // 口のカーブ: 25-39 (さらに深く)
      eyeY: 70 + (hash % 15), // 目の位置: 70-84 (上半分に)
    }
  }, [memoData.id])

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: memoData.id,
    disabled: isEditing
  })

  // アニメーション用フック
  const {
    x,
    y,
    springX,
    springY,
    handleMouseMove: handleSlimeMouseMove,
    handleMouseLeave: handleSlimeMouseLeave
  } = useSlimeAnimation({ isDragging, isHovered, isEditing })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const handleUpdate = (updates: MemoUpdate) => {
    onUpdate(memoData.id, updates)
    setIsEditing(false)
  }
  
  // ジェスチャーハンドラー
  useGestures(cardRef, {
    onDoubleTap: () => setIsEditing(true),
    onSwipeLeft: () => {
      if (window.confirm('このメモを削除しますか？')) {
        onDelete(memoData.id)
      }
    },
    onLongPress: () => {
      // 長押しでメモを振動させる
      if (navigator.vibrate) {
        navigator.vibrate(50)
      }
      setIsEditing(true)
    },
  })

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        position: 'relative',
        zIndex: isDragging && !isMemoEditing ? Z_INDEX.dragging : Z_INDEX.card
      }}
      className={`p-8 ${isDragging && !isMemoEditing ? 'opacity-50' : ''}`}
    >
      <motion.div
        ref={cardRef}
        style={{
          position: 'relative',
          rotateX: springX,
          rotateY: springY,
          transformStyle: 'preserve-3d',
        }}
        onMouseMove={(e) => handleSlimeMouseMove(e, cardRef)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          handleSlimeMouseLeave()
          setIsHovered(false)
        }}
        animate={{
          scale: isHovered ? 1.02 : 1,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <motion.div
          {...attributes}
          {...listeners}
          className="w-full h-[320px]"
          onClick={(e) => e.stopPropagation()}
          style={{
            ...SLIME_STYLES.body,
            '--memo-color': memoData.color,
            backgroundColor: 'var(--memo-color)',
            backgroundImage: `
              radial-gradient(ellipse at top left, var(--memo-color) 0%, var(--memo-color) 50%)
            `,
            transform: 'translateZ(50px)',
            boxShadow: `
              inset 0 8px 32px rgba(255,255,255,0.6),
              inset 0 -8px 32px rgba(0,0,0,0.2),
              0 25px 50px -12px rgba(0,0,0,0.4),
              0 15px 30px -8px var(--memo-color)
            `,
            filter: 'none',
          } as React.CSSProperties}
          animate={{
            borderRadius: isHovered 
              ? `${60 + Math.sin(Date.now() * 0.003) * 5}% ${60 + Math.cos(Date.now() * 0.003) * 5}% ${20 + Math.sin(Date.now() * 0.004) * 3}% ${20 + Math.cos(Date.now() * 0.004) * 3}% / ${80 + Math.sin(Date.now() * 0.002) * 5}% ${80 + Math.cos(Date.now() * 0.002) * 5}% ${20 + Math.sin(Date.now() * 0.003) * 2}% ${20 + Math.cos(Date.now() * 0.003) * 2}%`
              : '60% 60% 20% 20% / 80% 80% 20% 20%',
          }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          whileTap={{ scale: 0.96 }}
        >
          {/* スライムの顔 */}
          <SlimeFace faceVariation={faceVariation} isHovered={isHovered} />
          
          {/* スライムの照り効果 */}
          <SlimeEffects 
            isHovered={isHovered}
            springX={springX}
            springY={springY}
            x={x}
            y={y}
          />
          {/* 編集・削除ボタン */}
          {!isEditing && (
            <div style={{ 
              ...SLIME_STYLES.buttonContainer,
              zIndex: Z_INDEX.cardButton
            }}>
              <motion.button
                onClick={(e) => {
                  e.stopPropagation()
                  setIsEditing(true)
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white/90 transition-colors shadow-md"
              >
                <span className="text-sm">✏️</span>
              </motion.button>
              <motion.button
                onClick={(e) => {
                  e.stopPropagation()
                  if (window.confirm('このメモを削除しますか？')) {
                    onDelete(memoData.id)
                  }
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white/90 transition-colors shadow-md"
              >
                <span className="text-sm">🗑️</span>
              </motion.button>
            </div>
          )}

          {/* コンテンツ */}
          <div 
            style={{
              position: 'absolute',
              zIndex: Z_INDEX.cardButton,
              bottom: '48px',
              left: '64px',
              right: '64px',
              top: '55%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {isEditing ? (
              <MemoEditForm
                initialTitle={memoData.title}
                initialContent={memoData.content}
                initialColor={memoData.color}
                onSave={handleUpdate}
                onCancel={() => setIsEditing(false)}
              />
            ) : (
              <MemoContent
                title={memoData.title}
                content={memoData.content}
              />
            )}
          </div>
          
          {/* アクションボタンを削除 */}
        </motion.div>

        {/* 影のエフェクト */}
        <SlimeShadows isHovered={isHovered} color={memoData.color} />
      </motion.div>
      
    </div>
  )
}))