import { useEffect } from 'react'
import { useMotionValue, useSpring, useTransform } from 'framer-motion'

interface UseSlimeAnimationProps {
  isDragging: boolean
  isHovered: boolean
  isEditing: boolean
}

/**
 * スライムのぷるんぷるんアニメーション用カスタムフック
 * マウストラッキングとジェリーアニメーションを管理
 */
export function useSlimeAnimation({ isDragging, isHovered, isEditing }: UseSlimeAnimationProps) {
  // ぷるんぷるんアニメーション用の状態
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-100, 100], [30, -30])
  const rotateY = useTransform(x, [-100, 100], [-30, 30])
  
  const springConfig = { stiffness: 300, damping: 20 }
  const springX = useSpring(rotateX, springConfig)
  const springY = useSpring(rotateY, springConfig)

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

  // マウストラッキングでぷるんぷるん効果
  const handleMouseMove = (e: React.MouseEvent, cardRef: React.RefObject<HTMLDivElement>) => {
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
  }

  return {
    x,
    y,
    springX,
    springY,
    handleMouseMove,
    handleMouseLeave
  }
}