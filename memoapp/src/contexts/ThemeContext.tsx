import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

import type { ThemeMode } from '../types'

interface ThemeContextType {
  isDarkMode: boolean
  theme: ThemeMode
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: ReactNode
}

/**
 * テーマ（ダークモード）の状態を管理するProvider
 * MutationObserverを1箇所で管理し、全コンポーネントで共有
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    // 初期状態をチェック
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark')
      setIsDarkMode(isDark)
    }
    
    checkDarkMode()
    
    // MutationObserverでクラスの変更を監視（1箇所のみ）
    const observer = new MutationObserver(checkDarkMode)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })
    
    return () => observer.disconnect()
  }, [])

  const value: ThemeContextType = {
    isDarkMode,
    theme: isDarkMode ? 'dark' : 'light'
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

/**
 * テーマ情報を取得するカスタムフック
 */
export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}