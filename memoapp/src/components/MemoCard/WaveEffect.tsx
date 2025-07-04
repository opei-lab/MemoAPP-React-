import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface WaveEffectProps {
  isHovered: boolean
  mouseX: number
  mouseY: number
  color: string
}

/**
 * ホバー時の波打ちエフェクト
 * マウスの位置から波紋が広がるような効果を演出
 */
export function WaveEffect({ isHovered, mouseX, mouseY, color }: WaveEffectProps) {
  const [waves, setWaves] = useState<Array<{ id: number; x: number; y: number }>>([])

  useEffect(() => {
    if (isHovered) {
      const newWave = {
        id: Date.now(),
        x: mouseX,
        y: mouseY
      }
      setWaves(prev => [...prev, newWave])

      // 古い波を削除
      const timer = setTimeout(() => {
        setWaves(prev => prev.filter(wave => wave.id !== newWave.id))
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [mouseX, mouseY, isHovered])

  return (
    <>
      {waves.map(wave => (
        <motion.div
          key={wave.id}
          style={{
            position: 'absolute',
            left: wave.x,
            top: wave.y,
            width: 0,
            height: 0,
            borderRadius: '50%',
            backgroundColor: color,
            opacity: 0.3,
            pointerEvents: 'none',
            transform: 'translate(-50%, -50%)',
            zIndex: 5
          }}
          animate={{
            width: [0, 300],
            height: [0, 300],
            opacity: [0.3, 0],
          }}
          transition={{
            duration: 1,
            ease: 'easeOut'
          }}
        />
      ))}
    </>
  )
}