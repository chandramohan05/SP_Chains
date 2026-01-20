import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User } from '../types'

const API_BASE = import.meta.env.VITE_API_BASE_URL

interface AuthContextType {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // ================= FETCH CURRENT USER =================
  const fetchMe = async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        credentials: 'include'
      })

      if (!res.ok) {
        setUser(null)
        return
      }

      const data = await res.json()
      setUser(data.user)
    } catch {
      setUser(null)
    }
  }

  // ================= REFRESH USER =================
  const refreshUser = async () => {
    await fetchMe()
  }

  // ================= SIGN OUT =================
  const signOut = async () => {
    await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    })
    setUser(null)
  }

  // ================= INIT =================
  useEffect(() => {
    fetchMe().finally(() => setLoading(false))
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

// ================= HOOK =================
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
