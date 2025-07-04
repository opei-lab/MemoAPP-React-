import { memo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { BUTTON_STYLES, BUTTON_HOVER_EFFECTS } from '../constants/styles'

interface StyledButtonProps {
  variant: 'primary' | 'secondary' | 'purple' | 'round'
  children: React.ReactNode
  onClick?: () => void
  onPointerDown?: (e: React.PointerEvent) => void
  className?: string
  style?: React.CSSProperties
  whileHover?: any
  whileTap?: any
  [key: string]: any
}

/**
 * スタイル済み共通ボタンコンポーネント
 * ホバーエフェクトを自動で適用
 */
export const StyledButton = memo(({ 
  variant, 
  children, 
  onClick,
  onPointerDown,
  className = '',
  style = {},
  whileHover = { scale: 1.1 },
  whileTap = { scale: 0.95 },
  ...props 
}: StyledButtonProps) => {
  
  const buttonStyle = BUTTON_STYLES[variant]
  const hoverEffect = BUTTON_HOVER_EFFECTS[variant]
  
  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (hoverEffect?.enter) {
      Object.assign(e.currentTarget.style, hoverEffect.enter)
    }
  }, [hoverEffect])
  
  const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (hoverEffect?.leave) {
      Object.assign(e.currentTarget.style, hoverEffect.leave)
    }
  }, [hoverEffect])
  
  return (
    <motion.button
      onClick={onClick}
      onPointerDown={onPointerDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={whileHover}
      whileTap={whileTap}
      className={className}
      style={{
        ...buttonStyle,
        ...style
      }}
      {...props}
    >
      {children}
    </motion.button>
  )
})

StyledButton.displayName = 'StyledButton'