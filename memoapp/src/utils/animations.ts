/**
 * アニメーション関連のユーティリティ関数
 * ハードコードされたアニメーション計算を抽出
 */

/**
 * スライムのボーダーラディウスを計算
 * @param time - アニメーション時間
 * @param isHovered - ホバー状態
 * @returns CSS border-radius 値
 */
export const getSlimeBorderRadius = (time: number, isHovered: boolean): string => {
  if (!isHovered) return '60% 60% 20% 20% / 80% 80% 20% 20%'
  
  return `${60 + Math.sin(time) * 20}% ${60 + Math.cos(time * 1.2) * 20}% ${20 + Math.sin(time * 0.8) * 15}% ${20 + Math.cos(time * 0.9) * 15}% / ${80 + Math.sin(time * 1.1) * 15}% ${80 + Math.cos(time * 0.7) * 15}% ${20 + Math.sin(time * 1.3) * 10}% ${20 + Math.cos(time * 0.6) * 10}%`
}

/**
 * スライムのトランスフォームを計算
 * @param time - アニメーション時間
 * @param isHovered - ホバー状態
 * @returns CSS transform 値
 */
export const getSlimeTransform = (time: number, isHovered: boolean): string => {
  if (!isHovered) return 'translateZ(50px)'
  
  const scale = 1 + Math.sin(time * 2) * 0.05
  const translateX = Math.sin(time * 1.5) * 8
  const translateY = Math.cos(time * 1.8) * 5
  const rotate = Math.sin(time * 0.8) * 3
  
  return `translateZ(50px) scale(${scale}) translateX(${translateX}px) translateY(${translateY}px) rotateZ(${rotate}deg)`
}

/**
 * スライムの顔アニメーションを計算
 * @param time - アニメーション時間
 * @param isHovered - ホバー状態
 * @returns 顔のアニメーション値
 */
export const getSlimeFaceAnimation = (time: number, isHovered: boolean) => {
  if (!isHovered) return { x: 0, y: 0, rotate: 0 }
  
  return {
    x: Math.sin(time * 2.5) * 3,
    y: Math.cos(time * 2) * 2,
    rotate: Math.sin(time * 1.5) * 1
  }
}

/**
 * 幽霊形状のSVGパスを生成
 * @param time - 現在時刻（Date.now()）
 * @returns SVG path文字列
 */
export const getGhostPath = (time: number): string => {
  const t = time * 0.001 // ミリ秒を秒に変換
  
  return `M 160,30
           C 220,30 280,80 280,140
           L 280,240
           C 280,260 280,280 270,${290 + Math.sin(t * 3) * 10}
           Q 250,${300 + Math.cos(t * 4) * 8} 230,${295 + Math.sin(t * 2) * 12}
           T 190,${300 + Math.cos(t * 3) * 10}
           T 160,${295 + Math.sin(t * 4) * 8}
           T 130,${300 + Math.cos(t * 2) * 10}
           T 90,${295 + Math.sin(t * 3) * 12}
           Q 70,${300 + Math.cos(t * 4) * 8} 50,${290 + Math.sin(t * 2) * 10}
           C 40,280 40,260 40,240
           L 40,140
           C 40,80 100,30 160,30
           Z`
}

/**
 * ホバー時の波形アニメーション増分を取得
 * @returns アニメーション増分値
 */
export const getWobbleIncrement = (): number => 0.15

/**
 * 非ホバー時の波形アニメーション減少値を取得
 * @returns アニメーション減少値
 */
export const getWobbleDecrement = (): number => 0.3

/**
 * スプリングアニメーション設定
 */
export const ANIMATION_CONFIGS = {
  // スライムのプルプル
  slimeJelly: {
    type: "spring",
    stiffness: 40,
    damping: 15,
    mass: 1.2
  },
  // 顔の微細な動き
  faceMovement: {
    type: "spring",
    stiffness: 200,
    damping: 10
  },
  // ホバー時のスケール
  hoverScale: {
    type: 'spring',
    stiffness: 300,
    damping: 25
  }
} as const