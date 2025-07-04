import { motion } from 'framer-motion'
import { Z_INDEX, SLIME_STYLES } from '../../constants'
import { useTheme } from '../../contexts/ThemeContext'

interface SlimeFaceProps {
  faceVariation: {
    eyeGap: number
    eyeSize: number
    pupilSize: number
    mouthWidth: number
    mouthCurve: number
    eyeY: number
  }
  isHovered: boolean
}

/**
 * スライムの顔コンポーネント
 * 目と口を描画し、ホバー時のアニメーションを管理
 * ダークモード時は幽霊風に
 */
export function SlimeFace({ faceVariation, isHovered }: SlimeFaceProps) {
  const { isDarkMode } = useTheme()
  
  return (
    <div style={{ 
      ...SLIME_STYLES.faceContainer,
      top: `${faceVariation.eyeY}px`,
      left: '64px',
      right: '64px',
      zIndex: Z_INDEX.cardFace
    }}>
      {/* 目 - くりくりおめめ */}
      <div className="flex mb-3"
           style={{ gap: `${faceVariation.eyeGap}px` }}>
        {/* 左目 */}
        <Eye 
          eyeSize={faceVariation.eyeSize}
          pupilSize={faceVariation.pupilSize}
          isHovered={isHovered}
          isDarkMode={isDarkMode}
        />
        {/* 右目 */}
        <Eye 
          eyeSize={faceVariation.eyeSize}
          pupilSize={faceVariation.pupilSize}
          isHovered={isHovered}
          isDarkMode={isDarkMode}
        />
      </div>
      
      {/* 口と舌 */}
      <div style={{ position: 'relative' }}>
        <motion.div 
          style={{
            width: `${faceVariation.mouthWidth}px`,
            height: `${faceVariation.mouthCurve}px`,
            borderBottom: isDarkMode ? '4px solid #E5E7EB' : '4px solid #1F2937',
            borderRadius: '0 0 50% 50%',
            transform: isHovered ? 'scaleX(1.2) scaleY(1.5)' : 'scaleX(1) scaleY(1)',
            position: 'relative',
            zIndex: 2,
          }}
          transition={{ type: "spring", stiffness: 300 }}
        />
        
        {/* 舌（ダークモード時のホバーのみ） */}
        {isDarkMode && (
          <motion.div
            style={{
              position: 'absolute',
              bottom: '-15px',
              left: '50%',
              width: `${faceVariation.mouthWidth * 0.4}px`,
              height: '20px',
              backgroundColor: '#FF6B9D',
              borderRadius: '50% 50% 50% 50%',
              transform: 'translateX(-50%)',
              boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.2)',
              zIndex: 1,
            }}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ 
              scaleY: isHovered ? 1 : 0,
              opacity: isHovered ? 1 : 0,
              y: isHovered ? 5 : 0
            }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          />
        )}
      </div>
    </div>
  )
}

/**
 * 目のコンポーネント
 */
function Eye({ eyeSize, pupilSize, isHovered, isDarkMode }: { 
  eyeSize: number; 
  pupilSize: number; 
  isHovered: boolean;
  isDarkMode: boolean;
}) {
  return (
    <motion.div 
      className="relative"
      animate={{
        scaleY: isHovered ? 0.2 : 1,
      }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        {/* 目の外側（白目） */}
        <div className="bg-white rounded-full shadow-inner"
             style={{
               width: `${eyeSize}px`,
               height: `${eyeSize}px`,
               boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2), 0 2px 8px rgba(0,0,0,0.1)'
             }}>
          {/* 瞳 */}
          <motion.div 
            className="absolute top-1/2 left-1/2 bg-gray-900 rounded-full"
            style={{
              width: `${pupilSize}px`,
              height: `${pupilSize}px`,
              transform: 'translate(-50%, -50%)',
            }}
            animate={{
              x: Math.sin(Date.now() * 0.001) * 3,
              y: Math.cos(Date.now() * 0.001) * 2,
            }}
          >
            {/* 光の反射 */}
            <div className="absolute bg-white rounded-full" 
                 style={{
                   top: '15%',
                   right: '15%',
                   width: `${pupilSize * 0.3}px`,
                   height: `${pupilSize * 0.3}px`,
                 }} />
            <div className="absolute bg-white rounded-full opacity-70"
                 style={{
                   bottom: '20%',
                   left: '20%',
                   width: `${pupilSize * 0.15}px`,
                   height: `${pupilSize * 0.15}px`,
                 }} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}