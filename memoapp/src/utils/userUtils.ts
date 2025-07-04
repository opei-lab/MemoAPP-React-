/**
 * ユーザー関連のユーティリティ関数
 */

/**
 * 時間帯に応じた挨拶を取得
 */
export function getGreeting(): string {
  const hour = new Date().getHours()
  
  if (hour >= 5 && hour < 12) {
    return 'おはようございます'
  } else if (hour >= 12 && hour < 17) {
    return 'こんにちは'
  } else if (hour >= 17 && hour < 21) {
    return 'こんばんは'
  } else {
    return 'お疲れ様です'
  }
}

/**
 * メールアドレスをマスク表示
 * 例: example@gmail.com → ex***@gmail.com
 */
export function maskEmail(email: string): string {
  if (!email) return ''
  
  const [localPart, domain] = email.split('@')
  if (!localPart || !domain) return email
  
  // ローカル部分をマスク（最初の2文字以外を*に）
  let maskedLocal = localPart
  if (localPart.length > 2) {
    maskedLocal = localPart.slice(0, 2) + '*'.repeat(Math.min(localPart.length - 2, 3))
  }
  
  return `${maskedLocal}@${domain}`
}

/**
 * ユーザー表示名を取得
 * プロフィールの表示名 > ユーザー名 > メールアドレスの@より前の部分の順で取得
 */
export function getUserDisplayName(
  email: string, 
  displayName?: string | null, 
  username?: string | null
): string {
  if (displayName) return displayName
  if (username) return username
  if (!email) return 'ユーザー'
  
  const localPart = email.split('@')[0]
  return localPart || 'ユーザー'
}

/**
 * 簡易版：メールアドレスから表示名を取得
 * ローカルストレージの表示名 > メールアドレスの@より前の部分
 */
export function getSimpleDisplayName(email: string, userId?: string): string {
  if (!email) return 'ユーザー'
  
  // ローカルストレージから表示名を取得
  if (userId) {
    const savedDisplayName = localStorage.getItem(`display_name_${userId}`)
    if (savedDisplayName) return savedDisplayName
  }
  
  const localPart = email.split('@')[0]
  return localPart || 'ユーザー'
}