import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'

export const Auth = () => {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  // ログイン画面では常にライトモード
  useEffect(() => {
    document.documentElement.classList.remove('dark')
    document.body.classList.remove('dark')
  }, [])

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error
        setSuccess('確認メールを送信しました！メールをご確認ください。')
      }
    } catch (error: any) {
      setError(error.error_description || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* 背景の装飾 */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 left-20 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full"
        style={{ maxWidth: '400px' }}
      >
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden">
          {/* ヘッダー */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-white text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="inline-block"
            >
              <span className="text-6xl mb-4 inline-block">📝</span>
            </motion.div>
            <h1 className="text-3xl font-bold mt-4">ぷるんぷるんメモ</h1>
            <p className="text-blue-100 mt-2">思い出を美しく保存</p>
          </div>
          {/* フォーム */}
          <form onSubmit={handleAuth} className="p-8 space-y-6">
            <AnimatePresence mode="wait">
              {(error || success) && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`p-4 rounded-xl text-sm ${
                    success 
                      ? 'bg-green-100 text-green-700 border border-green-300' 
                      : 'bg-red-100 text-red-700 border border-red-300'
                  }`}
                >
                  {error || success}
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                メールアドレス
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full font-medium"
                style={{
                  padding: '0.875rem 1.25rem',
                  borderRadius: '9999px',
                  border: '2px solid rgba(229, 231, 235, 1)',
                  backgroundColor: 'rgba(249, 250, 251, 0.5)',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  fontSize: '0.95rem',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#667eea'
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 1)'
                  e.currentTarget.style.boxShadow = '0 0 0 4px rgba(102, 126, 234, 0.1)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(229, 231, 235, 1)'
                  e.currentTarget.style.backgroundColor = 'rgba(249, 250, 251, 0.5)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
                placeholder="example@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                パスワード
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full font-medium"
                style={{
                  padding: '0.875rem 1.25rem',
                  borderRadius: '9999px',
                  border: '2px solid rgba(229, 231, 235, 1)',
                  backgroundColor: 'rgba(249, 250, 251, 0.5)',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  fontSize: '0.95rem',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#667eea'
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 1)'
                  e.currentTarget.style.boxShadow = '0 0 0 4px rgba(102, 126, 234, 0.1)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(229, 231, 235, 1)'
                  e.currentTarget.style.backgroundColor = 'rgba(249, 250, 251, 0.5)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
                placeholder="6文字以上"
                minLength={6}
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full font-medium text-white"
              style={{
                padding: '1rem',
                borderRadius: '9999px',
                background: loading 
                  ? '#9CA3AF'
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: loading 
                  ? 'none'
                  : '0 4px 15px rgba(102, 126, 234, 0.4)',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)'
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)'
                }
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  処理中...
                </span>
              ) : (
                isLogin ? 'ログイン' : '新規登録'
              )}
            </motion.button>
            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin)
                  setError(null)
                  setSuccess(null)
                }}
                className="font-medium"
                style={{
                  color: '#667eea',
                  padding: '0.5rem 1rem',
                  borderRadius: '9999px',
                  backgroundColor: 'transparent',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(102, 126, 234, 0.1)'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                {isLogin ? '新規アカウント作成' : 'すでにアカウントをお持ちの方'}
              </button>
            </div>
          </form>
        </div>

        {/* フッター */}
        <p className="text-center text-gray-600 text-sm mt-8">
          美しいメモで、毎日をもっと楽しく ✨
        </p>
      </motion.div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}