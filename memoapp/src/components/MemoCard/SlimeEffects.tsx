import { motion, MotionValue } from 'framer-motion'

interface SlimeEffectsProps {
  isHovered: boolean
  springX: MotionValue<number>
  springY: MotionValue<number>
  x: MotionValue<number>
  y: MotionValue<number>
}

/**
 * スライムの照明効果コンポーネント
 * ハイライトや影など、スライムのツヤ感を表現
 */
export function SlimeEffects({ isHovered, springX, springY, x, y }: SlimeEffectsProps) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
  )
}

/**
 * スライムの影エフェクト
 */
export function SlimeShadows({ isHovered, color }: { isHovered: boolean; color: string }) {
  return (
    <>
      {/* 3Dシャドウエフェクト - スライムの重み */}
      <motion.div
        className="absolute inset-x-2 bottom-0 h-6"
        style={{
          background: `radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, transparent 80%)`,
          filter: 'blur(16px)',
          transform: 'translateZ(-20px) scaleY(0.3)',
          zIndex: -1,
        }}
        animate={{
          scaleX: isHovered ? 1.15 : 1,
          opacity: isHovered ? 0.7 : 0.5,
        }}
      />
      
      {/* スライムの影 - ぷるんぷるんと連動 */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: color,
          filter: 'blur(40px)',
          opacity: 0.3,
          transform: 'translateZ(-80px) scale(0.85)',
          borderRadius: '60% 60% 20% 20% / 80% 80% 20% 20%',
          zIndex: -2,
        }}
        animate={{
          scale: isHovered ? 0.9 : 0.85,
          translateY: `${Math.sin(Date.now() * 0.001) * 5}px`,
        }}
      />
    </>
  )
}