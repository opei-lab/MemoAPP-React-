import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import type { Session } from '@supabase/supabase-js'

import { Auth } from './components/Auth'
import { MemoBoard } from './components/MemoBoard/MemoBoard'
import { ThemeProvider } from './contexts'

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
        <div className="text-white text-2xl">読み込み中...</div>
      </div>
    )
  }

  return (
    <ThemeProvider>
      {!session ? <Auth /> : <MemoBoard session={session} />}
    </ThemeProvider>
  )
}

export default App