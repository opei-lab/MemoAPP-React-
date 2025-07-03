// 型定義
interface Memo {
  id: string
  user_id: string
  title: string
  content: string
  color: string
  position: number
  created_at: string
  updated_at: string
  is_deleted?: boolean
}

type SortBy = 'created_at' | 'color' | 'position'
type FilterColor = string | null

// メモのフィルタリング
export const filterMemos = (memos: Memo[], filterColor: FilterColor): Memo[] => {
  if (!filterColor) return memos
  return memos.filter(memo => memo.color === filterColor)
}

// HSL色空間での色相を計算（12色相環順のソート用）
const getHueFromHex = (hex: string): number => {
  // hexからRGBへ変換
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const diff = max - min

  if (diff === 0) return 0

  let hue = 0
  if (max === r) {
    hue = ((g - b) / diff + (g < b ? 6 : 0)) / 6
  } else if (max === g) {
    hue = ((b - r) / diff + 2) / 6
  } else {
    hue = ((r - g) / diff + 4) / 6
  }

  return hue * 360 // 0-360度の色相を返す
}

// 色の優先度マップ（赤を最初に）
const colorPriorityMap: Record<string, number> = {
  '#FFB3BA': 0,  // ペールレッド
  '#FFD4B3': 1,  // ペールオレンジ  
  '#FFF5B3': 2,  // ペールイエロー
  '#BAFFC9': 3,  // ペールグリーン
  '#BAE1FF': 4,  // ペールブルー
  '#E6BAFF': 5,  // ペールパープル
}

// メモのソート
export const sortMemos = (memos: Memo[], sortBy: SortBy): Memo[] => {
  const sorted = [...memos]
  
  switch (sortBy) {
    case 'created_at':
      return sorted.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
    case 'color':
      // 定義された色順でソート
      return sorted.sort((a, b) => {
        const priorityA = colorPriorityMap[a.color] ?? 999
        const priorityB = colorPriorityMap[b.color] ?? 999
        return priorityA - priorityB
      })
    case 'position':
      return sorted.sort((a, b) => a.position - b.position)
    default:
      return sorted
  }
}

// フィルタリングとソートを組み合わせた処理
export const processMemosForDisplay = (
  memos: Memo[], 
  { sortBy, filterColor }: { sortBy: SortBy; filterColor: FilterColor }
): Memo[] => {
  const filtered = filterMemos(memos, filterColor)
  return sortMemos(filtered, sortBy)
}

// ポジションの再計算
export const recalculatePositions = (memos: Memo[]): Memo[] => {
  return memos.map((memo, index) => ({
    ...memo,
    position: index
  }))
}

// メモの移動処理
export const moveMemo = (
  memos: Memo[], 
  fromIndex: number, 
  toIndex: number
): Memo[] => {
  const result = [...memos]
  const [removed] = result.splice(fromIndex, 1)
  result.splice(toIndex, 0, removed)
  return recalculatePositions(result)
}