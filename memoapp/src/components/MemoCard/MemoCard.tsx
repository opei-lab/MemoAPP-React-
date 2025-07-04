import { useState, memo, forwardRef, useRef, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { COLOR_OPTIONS, ANIMATION_CONFIG, Z_INDEX, COMMON_STYLES, SLIME_STYLES, BUTTON_STYLES } from '../../constants'
import { MemoContent } from './MemoContent'
import { MemoActions } from './MemoActions'
import { MemoEditForm } from './MemoEditForm'
import { SlimeFace } from './SlimeFace'
import { SlimeEffects, SlimeShadows } from './SlimeEffects'
import { SlimeShape } from './SlimeShape'
import { StyledButton } from '../StyledButton'
import { useGestures } from '../../hooks/useGestures'
import { useSlimeAnimation } from '../../hooks/useSlimeAnimation'
import { useTheme } from '../../contexts'
import { getSlimeBorderRadius, getSlimeTransform, getSlimeFaceAnimation, getGhostPath, getWobbleIncrement, getWobbleDecrement, ANIMATION_CONFIGS } from '../../utils/animations'
import type { Memo, MemoUpdate, MemoCardProps } from '../../types'

export const MemoCard = memo(forwardRef<HTMLDivElement, MemoCardProps>(({ memo: memoData, onUpdate, onDelete, onView, onLargeEdit, index }, ref) => {
  const { isDarkMode } = useTheme()
  const [isEditing, setIsEditing] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [wobbleTime, setWobbleTime] = useState(0)
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

  // ホバー時の波形アニメーション
  useEffect(() => {
    let animationId: number
    if (isHovered) {
      const animate = () => {
        setWobbleTime(prev => prev + getWobbleIncrement())
        animationId = requestAnimationFrame(animate)
      }
      animationId = requestAnimationFrame(animate)
    } else {
      // ゆっくり元に戻す
      const animate = () => {
        setWobbleTime(prev => {
          if (prev > 0) {
            animationId = requestAnimationFrame(animate)
            return Math.max(0, prev - getWobbleDecrement())
          }
          return 0
        })
      }
      if (wobbleTime > 0) {
        animationId = requestAnimationFrame(animate)
      }
    }
    return () => {
      if (animationId) cancelAnimationFrame(animationId)
    }
  }, [isHovered, wobbleTime])
  
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
        zIndex: isDragging && !isEditing ? Z_INDEX.dragging : Z_INDEX.card
      }}
      className={`p-8 ${isDragging && !isEditing ? 'opacity-50' : ''}`}
    >
      <motion.div
        ref={cardRef}
        style={{
          position: 'relative',
          rotateX: springX,
          rotateY: springY,
          transformStyle: 'preserve-3d',
        }}
        onMouseMove={(e) => {
          handleSlimeMouseMove(e, cardRef)
          if (cardRef.current) {
            const rect = cardRef.current.getBoundingClientRect()
            setMousePos({
              x: e.clientX - rect.left,
              y: e.clientY - rect.top
            })
          }
        }}
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
        {isDarkMode ? (
          // ダークモード時はSVGで幽霊形状を描画
          <motion.svg
            {...attributes}
            {...listeners}
            className="w-full h-[320px]"
            onDoubleClick={() => !isEditing && onView?.(memoData)}
            style={{
              ...SLIME_STYLES.body,
              transform: 'translateZ(50px)',
              filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.3)) drop-shadow(0 15px 30px var(--memo-color))',
              outline: 'none',
            }}
            viewBox="0 0 320 320"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id={`ghost-gradient-${memoData.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={memoData.color} stopOpacity="1" />
                <stop offset="100%" stopColor={memoData.color} stopOpacity="0.8" />
              </linearGradient>
            </defs>
            <motion.path
              d={getGhostPath(Date.now())}
              fill={`url(#ghost-gradient-${memoData.id})`}
              style={{
                filter: 'url(#glow)',
              }}
            />
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            {/* スライムの顔（SVG内に配置） */}
            <foreignObject x="0" y="0" width="320" height="320" style={{ overflow: 'visible' }}>
              <div xmlns="http://www.w3.org/1999/xhtml" style={{ width: '100%', height: '100%', position: 'relative' }}>
                <SlimeFace faceVariation={faceVariation} isHovered={isHovered} />
                
                {/* 編集・削除ボタン */}
                {!isEditing && (
                  <div style={{ 
                    ...SLIME_STYLES.buttonContainer,
                    zIndex: Z_INDEX.cardButton
                  }}>
                    <StyledButton
                      variant="round"
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation()
                        setIsEditing(true)
                      }}
                    >
                      <span style={{ 
                        fontSize: '14px', 
                        lineHeight: '1', 
                        display: 'block',
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                        width: '14px',
                        height: '14px',
                        textAlign: 'center'
                      }}>✏️</span>
                    </StyledButton>
                    <StyledButton
                      variant="round"
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation()
                        if (window.confirm('このメモを削除しますか？')) {
                          onDelete(memoData.id)
                        }
                      }}
                    >
                      <span style={{ 
                        fontSize: '14px', 
                        lineHeight: '1', 
                        display: 'block',
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                        width: '14px',
                        height: '14px',
                        textAlign: 'center'
                      }}>🗑️</span>
                    </StyledButton>
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
                      onOpenLargeEdit={() => {
                        setIsEditing(false)
                        onLargeEdit?.(memoData)
                      }}
                    />
                  ) : (
                    <MemoContent
                      title={memoData.title}
                      content={memoData.content}
                    />
                  )}
                </div>
              </div>
            </foreignObject>
          </motion.svg>
        ) : (
          // 通常のスライム形状
          <motion.div
            {...attributes}
            {...listeners}
            className="w-full h-[320px]"
            onDoubleClick={() => !isEditing && onView?.(memoData)}
            style={{
              ...SLIME_STYLES.body,
              '--memo-color': memoData.color,
              backgroundColor: 'var(--memo-color)',
              backgroundImage: `
                radial-gradient(ellipse at top left, var(--memo-color) 0%, var(--memo-color) 50%)
              `,
              boxShadow: `
                inset 0 8px 32px rgba(255,255,255,0.6),
                inset 0 -8px 32px rgba(0,0,0,0.2),
                0 25px 50px -12px rgba(0,0,0,0.4),
                0 15px 30px -8px var(--memo-color)
              `,
              filter: 'none',
              transform: getSlimeTransform(wobbleTime, isHovered),
            } as React.CSSProperties}
            animate={{
              borderRadius: getSlimeBorderRadius(wobbleTime, isHovered),
            }}
            transition={ANIMATION_CONFIGS.slimeJelly}
            whileTap={{ scale: 0.96 }}
          >
          {/* スライムの顔 */}
          <motion.div
            animate={getSlimeFaceAnimation(wobbleTime, isHovered)}
            transition={ANIMATION_CONFIGS.faceMovement}
          >
            <SlimeFace faceVariation={faceVariation} isHovered={isHovered} />
          </motion.div>
          
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
                onPointerDown={(e) => e.stopPropagation()}
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
                onPointerDown={(e) => e.stopPropagation()}
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
                onOpenLargeEdit={() => {
                  setIsEditing(false)
                  onLargeEdit?.(memoData)
                }}
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
        )}

        {/* 影のエフェクト */}
        <SlimeShadows isHovered={isHovered} color={memoData.color} />
      </motion.div>
    </div>
  )
}))