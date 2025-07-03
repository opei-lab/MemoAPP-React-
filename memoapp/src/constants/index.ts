// カラーパレット - ペールトーンの6色（色相環順）
export const MEMO_COLORS = {
  red: '#FFB3BA',         // ペールレッド
  orange: '#FFD4B3',      // ペールオレンジ
  yellow: '#FFF5B3',      // ペールイエロー
  green: '#BAFFC9',       // ペールグリーン
  blue: '#BAE1FF',        // ペールブルー
  purple: '#E6BAFF',      // ペールパープル
} as const

export const COLOR_OPTIONS = Object.entries(MEMO_COLORS).map(([name, value]) => ({
  name,
  value,
  label: {
    red: 'レッド',
    orange: 'オレンジ',
    yellow: 'イエロー',
    green: 'グリーン',
    blue: 'ブルー',
    purple: 'パープル',
  }[name] || name,
}))

// デフォルト値
export const DEFAULT_MEMO_COLOR = MEMO_COLORS.yellow

// アニメーション設定
export const ANIMATION_CONFIG = {
  spring: {
    type: "spring",
    stiffness: 300,
    damping: 30
  },
  jelly: {
    type: "spring",
    stiffness: 400,
    damping: 20,
    mass: 1.5
  }
} as const

// レイアウト設定
export const LAYOUT_CONFIG = {
  gridCols: {
    mobile: 1,
    tablet: 2,
    desktop: 3,
    wide: 4
  },
  gap: 8,
  headerHeight: 160,
  cardMinHeight: 280
} as const