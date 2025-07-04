import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../contexts/ThemeContext'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  opacity: number
  glowIntensity?: number
  flashIntensity?: number
}

export const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>()
  const mouseRef = useRef({ x: 0, y: 0 })
  const { isDarkMode } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // パーティクル初期化
    const colors = ['#FFB3BA', '#FFD4B3', '#FFF5B3', '#BAFFC9', '#BAE1FF', '#E6BAFF']
    const particleCount = 150 // 300から削減
    
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 4 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.6 + 0.2,
        glowIntensity: Math.random() * 0.5 + 0.5,
        flashIntensity: 0,
      })
    }

    // マウストラッキング
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', handleMouseMove)

    // アニメーションループ
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((particle, index) => {
        // マウス近くのパーティクルを反発
        const dx = mouseRef.current.x - particle.x
        const dy = mouseRef.current.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < 100) {
          const force = (100 - distance) / 100
          particle.vx -= (dx / distance) * force * 0.2
          particle.vy -= (dy / distance) * force * 0.2
          
          // ホバー時のフラッシュ効果を追加
          if (distance < 50 && particle.flashIntensity !== undefined) {
            particle.flashIntensity = Math.min(particle.flashIntensity + 0.2, 1.5)
          }
        }
        
        // フラッシュ効果を徐々に減衰
        if (particle.flashIntensity !== undefined && particle.flashIntensity > 0) {
          particle.flashIntensity = Math.max(particle.flashIntensity - 0.05, 0)
        }

        // 位置更新
        particle.x += particle.vx
        particle.y += particle.vy

        // 摩擦
        particle.vx *= 0.99
        particle.vy *= 0.99

        // 境界チェック
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        // 描画
        ctx.globalAlpha = particle.opacity
        
        // ダークモードの時は光る効果を追加
        if (isDarkMode && particle.glowIntensity) {
          const flashBoost = particle.flashIntensity || 0
          
          // 明るさの3段階（基本を明るく）
          // 通常: 1.2倍（以前の1倍から増加）
          // ちょっと明るい: 1.8倍
          // さらに明るい: 3倍
          const brightnessFactor = flashBoost > 0.7 ? 3 : (flashBoost > 0 ? 1.8 : 1.2)
          const glowSize = 1.2 + flashBoost * 0.8
          
          // 常に黄色みのある光（段階的に強く）
          const centerColor = flashBoost > 0.7 ? '#FFFF66' : (flashBoost > 0 ? '#FFFFAA' : '#FFFFDD')
          
          // シンプルなグロー効果
          const glowGradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.size * 3.5 * glowSize
          )
          glowGradient.addColorStop(0, centerColor)
          glowGradient.addColorStop(0.2, '#FFFFEE')
          glowGradient.addColorStop(0.4, particle.color + 'FF')
          glowGradient.addColorStop(0.7, particle.color + '80')
          glowGradient.addColorStop(1, particle.color + '00')
          
          ctx.fillStyle = glowGradient
          ctx.globalAlpha = Math.min(particle.opacity * particle.glowIntensity * brightnessFactor, 1)
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size * 3.5 * glowSize, 0, Math.PI * 2)
          ctx.fill()
        }
        
        // 通常のパーティクル描画
        ctx.globalAlpha = particle.opacity
        ctx.fillStyle = particle.color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
      })

      animationRef.current = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isDarkMode])

  return (
    <motion.canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    />
  )
}