import { motion } from 'framer-motion'

interface SlimeShapeProps {
  isHovered: boolean
  wobbleTime: number
  color: string
  children: React.ReactNode
}

/**
 * SVGパスで描画するスライムの形状
 * ホバー時に輪郭が歪む
 */
export function SlimeShape({ isHovered, wobbleTime, color, children }: SlimeShapeProps) {
  // 基本の形状
  const basePath = "M 160,40 C 240,40 280,80 280,140 L 280,220 C 280,260 240,280 200,280 L 120,280 C 80,280 40,260 40,220 L 40,140 C 40,80 80,40 160,40 Z"
  
  // ホバー時の歪んだ形状を動的に生成
  const getWobblePath = () => {
    if (!isHovered) return basePath
    
    // 各制御点に波形の変化を加える
    const wobbleX1 = Math.sin(wobbleTime * 1.2) * 15
    const wobbleY1 = Math.cos(wobbleTime * 0.8) * 10
    const wobbleX2 = Math.cos(wobbleTime * 0.9) * 20
    const wobbleY2 = Math.sin(wobbleTime * 1.1) * 15
    const wobbleX3 = Math.sin(wobbleTime * 1.3) * 10
    const wobbleY3 = Math.cos(wobbleTime * 0.7) * 20
    const wobbleX4 = Math.cos(wobbleTime * 1.0) * 15
    const wobbleY4 = Math.sin(wobbleTime * 0.6) * 10
    
    return `M ${160 + wobbleX1},${40 + wobbleY1} 
            C ${240 + wobbleX2},${40 + wobbleY1} ${280 + wobbleX3},${80 + wobbleY2} ${280 + wobbleX3},${140 + wobbleY2} 
            L ${280 + wobbleX3},${220 + wobbleY3} 
            C ${280 + wobbleX3},${260 + wobbleY3} ${240 + wobbleX4},${280 + wobbleY4} ${200 + wobbleX4},${280 + wobbleY4} 
            L ${120 - wobbleX4},${280 + wobbleY4} 
            C ${80 - wobbleX3},${280 + wobbleY4} ${40 - wobbleX2},${260 + wobbleY3} ${40 - wobbleX2},${220 + wobbleY3} 
            L ${40 - wobbleX2},${140 + wobbleY2} 
            C ${40 - wobbleX2},${80 + wobbleY2} ${80 - wobbleX1},${40 + wobbleY1} ${160 + wobbleX1},${40 + wobbleY1} Z`
  }
  
  return (
    <svg 
      width="320" 
      height="320" 
      style={{ position: 'absolute', top: 0, left: 0 }}
      viewBox="0 0 320 320"
    >
      <defs>
        <linearGradient id="slimeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor={color} stopOpacity="0.8" />
        </linearGradient>
        <filter id="slimeGlow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <filter id="slimeShadow">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodOpacity="0.3"/>
        </filter>
      </defs>
      
      <motion.path
        d={getWobblePath()}
        fill="url(#slimeGradient)"
        filter="url(#slimeShadow)"
        animate={{
          d: getWobblePath()
        }}
        transition={{
          type: "spring",
          stiffness: 50,
          damping: 20
        }}
      />
      
      <motion.path
        d={getWobblePath()}
        fill="none"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="2"
        filter="url(#slimeGlow)"
        animate={{
          d: getWobblePath()
        }}
        transition={{
          type: "spring",
          stiffness: 50,
          damping: 20
        }}
      />
      
      {/* 子要素を foreignObject で配置 */}
      <foreignObject x="0" y="0" width="320" height="320">
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          {children}
        </div>
      </foreignObject>
    </svg>
  )
}