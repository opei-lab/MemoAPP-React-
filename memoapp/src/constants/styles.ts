/**
 * 共通スタイル定義
 * CSS競合を避けるため、重要なスタイルはここに定義
 */

// ポジション関連
export const POSITION_STYLES = {
  absolute: {
    position: 'absolute' as const,
  },
  relative: {
    position: 'relative' as const,
  },
  fixed: {
    position: 'fixed' as const,
  },
  sticky: {
    position: 'sticky' as const,
  },
} as const

// 共通のスタイルパターン
export const COMMON_STYLES = {
  // フルサイズ
  fullSize: {
    width: '100%',
    height: '100%',
  },
  // 中央配置
  centerFlex: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // オーバーレイ
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  // インタラクション無効化
  noPointerEvents: {
    pointerEvents: 'none' as const,
  },
  // インタラクション有効化
  pointerEvents: {
    pointerEvents: 'auto' as const,
  },
} as const

// スライム関連のスタイル
export const SLIME_STYLES = {
  // スライム本体
  body: {
    position: 'relative' as const,
    overflow: 'visible',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  // 顔のコンテナ
  faceContainer: {
    position: 'absolute' as const,
    pointerEvents: 'none' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
  },
  // ボタンコンテナ
  buttonContainer: {
    position: 'absolute' as const,
    top: '12px',
    left: '12px',
    display: 'flex',
    gap: '8px',
  },
} as const

// ボタンスタイル定義
export const BUTTON_STYLES = {
  // プライマリボタン（保存）
  primary: {
    padding: '0.75rem 1rem',
    borderRadius: '9999px',
    background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
    color: 'white',
    boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
    border: 'none',
    transition: 'all 0.3s ease',
    whiteSpace: 'nowrap' as const,
    minWidth: '0',
    cursor: 'pointer',
  },
  // セカンダリボタン（キャンセル）
  secondary: {
    padding: '0.75rem 1.5rem',
    borderRadius: '9999px',
    backgroundColor: 'rgba(243, 244, 246, 0.9)',
    color: '#374151',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    border: '1px solid rgba(0, 0, 0, 0.06)',
    transition: 'all 0.3s ease',
    whiteSpace: 'nowrap' as const,
    minWidth: '0',
    cursor: 'pointer',
  },
  // パープルボタン（大画面で修正）
  purple: {
    padding: '0.75rem 1rem',
    borderRadius: '9999px',
    background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
    color: 'white',
    boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)',
    border: 'none',
    transition: 'all 0.3s ease',
    whiteSpace: 'nowrap' as const,
    cursor: 'pointer',
  },
  // 小さい丸ボタン（編集・削除）
  round: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    border: 'none',
    cursor: 'pointer',
    padding: '0',
    flexShrink: 0,
    transition: 'background-color 0.2s',
  }
} as const

// ボタンホバーエフェクト
export const BUTTON_HOVER_EFFECTS = {
  primary: {
    enter: {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(59, 130, 246, 0.5)'
    },
    leave: {
      transform: 'translateY(0)',
      boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)'
    }
  },
  secondary: {
    enter: {
      backgroundColor: 'rgba(229, 231, 235, 0.9)',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)'
    },
    leave: {
      backgroundColor: 'rgba(243, 244, 246, 0.9)',
      transform: 'translateY(0)',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
    }
  },
  purple: {
    enter: {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(139, 92, 246, 0.5)'
    },
    leave: {
      transform: 'translateY(0)',
      boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)'
    }
  },
  round: {
    enter: {
      backgroundColor: 'rgba(255, 255, 255, 0.9)'
    },
    leave: {
      backgroundColor: 'rgba(255, 255, 255, 0.8)'
    }
  }
} as const

// カラーボタンサイズ定義
export const COLOR_BUTTON_SIZES = {
  xs: { width: '32px', height: '32px' },
  sm: { width: '64px', height: '64px' },
  md: { width: '56px', height: '56px' },
  lg: { width: '100px', height: '100px' }
} as const

// カラーボタンスタイル
export const COLOR_BUTTON_STYLES = {
  base: {
    borderRadius: '16px',
    cursor: 'pointer',
    position: 'relative' as const,
    transition: 'all 0.3s ease',
    display: 'inline-block',
    verticalAlign: 'top',
  },
  unselected: {
    border: '3px solid #ffffff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
  },
  selected: {
    border: '4px solid #3B82F6',
    boxShadow: '0 0 0 3px #ffffff, 0 0 0 6px #3B82F6',
  },
  checkmark: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '24px',
    height: '24px',
    backgroundColor: '#ffffff',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
  }
} as const

// モーダルスタイル定義
export const MODAL_STYLES = {
  // モーダル背景コンテナ
  backdropContainer: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 99999
  },
  // モーダル背景
  backdrop: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
  },
  // 大画面編集モーダル
  editModal: {
    position: 'fixed' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 100000,
    width: '70vw',
    height: 'calc(100vh - 40px)',
    maxHeight: 'calc(100vh - 40px)'
  },
  // モーダル外枠（カラーボーダー）
  editModalFrame: {
    width: '100%',
    height: '100%',
    borderRadius: '24px',
    padding: '4px'
  },
  // モーダル内容
  editModalContent: {
    borderRadius: '24px',
    background: 'linear-gradient(145deg, #fef7ff 0%, #f0f9ff 50%, #ecfdf5 100%)',
    boxShadow: '0 25px 60px rgba(0, 0, 0, 0.2)',
    height: 'calc(100% - 8px)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column' as const
  },
  // モーダルヘッダー
  editModalHeader: {
    padding: '24px 32px',
    flexShrink: 0
  },
  // 編集エリア
  editArea: {
    minHeight: 0,
    paddingBottom: '8px',
    gap: '8px'
  },
  // タイトル入力
  titleInput: {
    fontSize: '1.5rem',
    backgroundColor: 'transparent',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    flexShrink: 0
  },
  // テキストエリア
  contentTextarea: {
    fontSize: '1.25rem',
    lineHeight: '1.75',
    backgroundColor: 'transparent',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    minHeight: 0
  },
  // 下部エリア
  bottomArea: {
    flexShrink: 0
  },
  // 色パネルコンテナ
  colorPanelContainer: {
    paddingLeft: '16px',
    paddingTop: '16px', 
    paddingBottom: '16px'
  }
} as const

// モーダルボタンスタイル
export const MODAL_BUTTON_STYLES = {
  // キャンセルボタン
  cancel: {
    padding: '16px 48px',
    fontSize: '18px',
    background: 'linear-gradient(145deg, #f8f8f8, #e0e0e0)',
    color: '#4a5568',
    borderRadius: '50px',
    border: 'none',
    boxShadow: 'inset 3px 3px 6px rgba(255,255,255,0.8), inset -3px -3px 6px rgba(0,0,0,0.08)',
    cursor: 'pointer'
  },
  // 保存ボタン  
  save: {
    padding: '16px 48px',
    fontSize: '18px',
    background: 'linear-gradient(145deg, #7986fc, #6872e5)',
    borderRadius: '50px',
    border: 'none',
    boxShadow: '0 4px 8px rgba(104, 114, 229, 0.3), inset 2px 2px 4px rgba(255,255,255,0.2), inset -2px -2px 4px rgba(0,0,0,0.1)',
    color: 'white',
    cursor: 'pointer'
  }
} as const

// モーダルアニメーション設定
export const MODAL_ANIMATIONS = {
  backdrop: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  modal: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
    transition: { type: 'spring', damping: 25, stiffness: 300 }
  },
  buttonHover: {
    cancel: {
      scale: 1.03,
      background: 'linear-gradient(145deg, #e0e0e0, #f8f8f8)'
    },
    save: {
      scale: 1.03,
      boxShadow: '0 6px 12px rgba(104, 114, 229, 0.4), inset 2px 2px 4px rgba(255,255,255,0.2), inset -2px -2px 4px rgba(0,0,0,0.1)'
    }
  },
  buttonTap: { scale: 0.98 }
} as const