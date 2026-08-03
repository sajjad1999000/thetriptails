'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const AuthContext = createContext({
  user: null,
  loading: true,
  signOut: async () => {},
})

export function useAuth() {
  return useContext(AuthContext)
}

/**
 * Wrap the app with this once, in app/layout.jsx, so any component
 * anywhere can call useAuth() to read the logged-in user.
 *
 *   import AuthProvider from '@/components/auth/AuthProvider'
 *   ...
 *   <body>
 *     <AuthProvider>
 *       <Header />
 *       {children}
 *       <Footer />
 *     </AuthProvider>
 *   </body>
 */
export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    let mounted = true

    supabase.auth.getUser().then(({ data }) => {
      if (mounted) {
        setUser(data?.user ?? null)
        setLoading(false)
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [supabase])

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
