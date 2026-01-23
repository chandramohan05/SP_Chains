import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type Role = 'admin' | 'dealer'

export interface AuthUser {
  id: string
  role: Role
}

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signIn: (user: AuthUser) => void
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  const signIn = (user: AuthUser) => {
    localStorage.setItem('user', JSON.stringify(user))
    setUser(user)
  }

  /* ---------------- INIT AUTH ---------------- */
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken')
    const dealerToken = localStorage.getItem('dealerToken')

    if (adminToken) {
      setUser({ id: 'admin', role: 'admin' })
    } else if (dealerToken) {
      setUser({ id: 'dealer', role: 'dealer' })
    }

    setLoading(false)
  }, [])

  /* ---------------- LOGOUT ---------------- */
  const signOut = () => {
  localStorage.removeItem('adminToken')
  localStorage.removeItem('dealerToken')
  localStorage.removeItem('user')
  setUser(null)
}


  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
