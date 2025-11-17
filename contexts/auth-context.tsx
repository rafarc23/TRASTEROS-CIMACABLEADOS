"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User } from "@/types"
import { getCurrentUser, setCurrentUser, getUsers, initializeData } from "@/lib/storage"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => boolean
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Inicializar datos y cargar usuario actual
    initializeData()
    const currentUser = getCurrentUser()
    setUser(currentUser)
    setIsLoading(false)
  }, [])

  const login = (email: string, password: string): boolean => {
    const users = getUsers()
    const foundUser = users.find((u) => u.email === email && u.password === password)

    if (foundUser) {
      setUser(foundUser)
      setCurrentUser(foundUser)
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    setCurrentUser(null)
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
