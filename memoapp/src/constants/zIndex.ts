/**
 * z-indexの統一管理
 * 数値が大きいほど前面に表示される
 */
export const Z_INDEX = {
  // 基本レイヤー
  base: 0,
  card: 10,
  cardHover: 20,
  
  // カード内要素
  cardFace: 30,
  cardButton: 40,
  cardEffect: 15,
  
  // 編集フォーム
  editForm: 50,
  
  // ドラッグ中
  dragging: 100,
  
  // モーダル・オーバーレイ
  modalBackdrop: 9999,
  modalContent: 10000,
  
  // 最前面
  tooltip: 20000,
  notification: 30000,
} as const

export type ZIndexKey = keyof typeof Z_INDEX