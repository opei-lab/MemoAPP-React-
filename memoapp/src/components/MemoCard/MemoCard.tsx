import { useState, memo, forwardRef, useEffect, useRef } from 'react'
import { motion, useSpring, useTransform, useMotionValue, AnimatePresence } from 'framer-motion'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
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
import { COLOR_OPTIONS, ANIMATION_CONFIG } from '../../constants'
import { MemoContent } from './MemoContent'
import { MemoActions } from './MemoActions'
import { MemoEditForm } from './MemoEditForm'
import { MemoDetail } from './MemoDetail'
import { useGestures } from '../../hooks/useGestures'

interface MemoCardProps {
  memo: Memo
  onUpdate: (id: string, updates: MemoUpdate) => void
  onDelete: (id: string) => void
  index: number
}

export const MemoCard = memo(forwardRef<HTMLDivElement, MemoCardProps>(({ memo: memoData, onUpdate, onDelete, index }, ref) => {
  const [isEditing, setIsEditing] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  
  // ぷるんぷるんアニメーション用の状態
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-100, 100], [30, -30])
  const rotateY = useTransform(x, [-100, 100], [-30, 30])
  
  const springConfig = { stiffness: 300, damping: 20 }
  const springX = useSpring(rotateX, springConfig)
  const springY = useSpring(rotateY, springConfig)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: memoData.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }
  
  // マウストラッキングでぷるんぷるん効果
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current || isDragging) return
    
    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const moveX = e.clientX - centerX
    const moveY = e.clientY - centerY
    
    x.set(moveX * 0.2)
    y.set(moveY * 0.2)
  }
  
  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    setIsHovered(false)
  }
  
  // ジェリーアニメーション
  useEffect(() => {
    if (!isDragging) {
      const timer = setInterval(() => {
        if (!isHovered && !isEditing) {
          x.set(Math.random() * 4 - 2)
          y.set(Math.random() * 4 - 2)
          setTimeout(() => {
            x.set(0)
            y.set(0)
          }, 300)
        }
      }, 3000 + Math.random() * 2000)
      
      return () => clearInterval(timer)
    }
  }, [isDragging, isHovered, isEditing, x, y])

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
      style={style}
      className={`relative p-8 ${isDragging ? 'z-50 opacity-50' : 'z-10'}`}
    >
      <motion.div
        ref={cardRef}
        className="relative"
        style={{
          rotateX: springX,
          rotateY: springY,
          transformStyle: 'preserve-3d',
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        animate={{
          scale: isHovered ? 1.02 : 1,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <motion.div
          {...attributes}
          {...listeners}
          className="w-full h-[320px] cursor-pointer transition-all duration-300 relative overflow-visible"
          onClick={() => !isEditing && setShowDetail(true)}
          style={{
            backgroundColor: memoData.color,
            backgroundImage: `
              radial-gradient(ellipse at top left, ${memoData.color}ff 0%, ${memoData.color}ee 50%)
            `,
            transform: 'translateZ(50px)',
            boxShadow: `
              inset 0 8px 32px rgba(255,255,255,0.6),
              inset 0 -8px 32px rgba(0,0,0,0.2),
              0 25px 50px -12px rgba(0,0,0,0.4),
              0 15px 30px -8px ${memoData.color}80
            `,
          }}
          animate={{
            borderRadius: isHovered 
              ? `${60 + Math.sin(Date.now() * 0.003) * 5}% ${60 + Math.cos(Date.now() * 0.003) * 5}% ${20 + Math.sin(Date.now() * 0.004) * 3}% ${20 + Math.cos(Date.now() * 0.004) * 3}% / ${80 + Math.sin(Date.now() * 0.002) * 5}% ${80 + Math.cos(Date.now() * 0.002) * 5}% ${20 + Math.sin(Date.now() * 0.003) * 2}% ${20 + Math.cos(Date.now() * 0.003) * 2}%`
              : '60% 60% 20% 20% / 80% 80% 20% 20%',
          }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          whileTap={{ scale: 0.96 }}
        >
          {/* スライムの顔 */}
          <div className="absolute top-1/4 left-0 right-0 pointer-events-none z-20">
            {/* 目 */}
            <div className="flex justify-center gap-8 mb-4">
              <motion.div 
                className="relative"
                animate={{
                  scaleY: isHovered ? 0.3 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-6 h-8 bg-gray-800 rounded-full">
                  <motion.div 
                    className="absolute top-2 left-2 w-2 h-2 bg-white rounded-full"
                    animate={{
                      x: Math.sin(Date.now() * 0.001) * 2,
                      y: Math.cos(Date.now() * 0.001) * 1,
                    }}
                  />
                </div>
              </motion.div>
              <motion.div 
                className="relative"
                animate={{
                  scaleY: isHovered ? 0.3 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-6 h-8 bg-gray-800 rounded-full">
                  <motion.div 
                    className="absolute top-2 left-2 w-2 h-2 bg-white rounded-full"
                    animate={{
                      x: Math.sin(Date.now() * 0.001) * 2,
                      y: Math.cos(Date.now() * 0.001) * 1,
                    }}
                  />
                </div>
              </motion.div>
            </div>
            
            {/* 口 */}
            <div className="flex justify-center">
              <motion.div 
                className="w-12 h-3 bg-gray-800 rounded-full"
                animate={{
                  scaleX: isHovered ? 1.5 : 1,
                  scaleY: isHovered ? 2 : 1,
                }}
                transition={{ type: "spring", stiffness: 300 }}
              />
            </div>
          </div>
          
          {/* スライムの照り効果 */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ borderRadius: '60% 60% 20% 20% / 80% 80% 20% 20%' }}>
            {/* メインハイライト - ぷるんぷるんと連動 */}
            <motion.div 
              className="absolute top-2 left-3 w-24 h-16"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.6) 50%, transparent 70%)',
                filter: 'blur(8px)',
                rotateX: springX,
                rotateY: springY,
              }}
              animate={{
                x: isHovered ? 10 : 0,
                y: isHovered ? 5 : 0,
              }}
            />
            
            {/* サブハイライト */}
            <motion.div 
              className="absolute top-8 right-12 w-16 h-10"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.7) 0%, transparent 60%)',
                filter: 'blur(12px)',
                transform: 'rotate(45deg)',
              }}
              animate={{
                opacity: isHovered ? 0.8 : 0.5,
                scale: isHovered ? 1.2 : 1,
              }}
            />
            
            {/* 底部の光沢 - スライムの厚みを演出 */}
            <div 
              className="absolute bottom-2 left-0 right-0 h-8"
              style={{
                background: 'linear-gradient(to top, rgba(0,0,0,0.1) 0%, transparent 100%)',
              }}
            />
            
            {/* アニメーションする反射光 */}
            <motion.div 
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle at ${x.get()}% ${y.get()}%, rgba(255,255,255,0.3) 0%, transparent 50%)`,
              }}
            />
          </div>
          {/* 編集・削除ボタン */}
          {!isEditing && (
            <div className="absolute top-3 left-3 flex gap-2 z-20">
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
          <div className="absolute bottom-12 left-16 right-16 top-[55%] z-10 flex flex-col overflow-hidden">
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

        {/* 3Dシャドウエフェクト - スライムの重み */}
        <motion.div
          className="absolute inset-x-2 bottom-0 h-6 -z-10"
          style={{
            background: `radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, transparent 80%)`,
            filter: 'blur(16px)',
            transform: 'translateZ(-20px) scaleY(0.3)',
          }}
          animate={{
            scaleX: isHovered ? 1.15 : 1,
            opacity: isHovered ? 0.7 : 0.5,
          }}
        />
        
        {/* スライムの影 - ぷるんぷるんと連動 */}
        <motion.div
          className="absolute inset-0 -z-20"
          style={{
            background: memoData.color,
            filter: 'blur(40px)',
            opacity: 0.3,
            transform: 'translateZ(-80px) scale(0.85)',
            borderRadius: '60% 60% 20% 20% / 80% 80% 20% 20%',
          }}
          animate={{
            scale: isHovered ? 0.9 : 0.85,
            translateY: `${Math.sin(Date.now() * 0.001) * 5}px`,
          }}
        />
      </motion.div>
      
      {/* 詳細表示 */}
      <MemoDetail 
        memo={memoData}
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
        onEdit={() => {
          setShowDetail(false)
          setIsEditing(true)
        }}
        onDelete={() => {
          setShowDetail(false)
          if (window.confirm('このメモを削除しますか？')) {
            onDelete(memoData.id)
          }
        }}
      />
    </div>
  )
}))