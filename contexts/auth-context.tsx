'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { users as mockUsers } from '@/data/internal-users'

interface User {
  id: string
  email: string
  nombre?: string
  role: 'admin' | 'propietario' | 'asesor' | 'fotografo' | 'cliente'
  telefono?: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<User | null>
  signup: (email: string, password: string, userData: Partial<User>) => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar sesión activa al cargar
    checkUser()

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await loadUserProfile(session.user.id)
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        await loadUserProfile(session.user.id)
      }
    } catch (error) {
      console.error('Error checking user:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error loading profile:', error)
        // Si no hay perfil en usuarios, usar datos básicos de auth
        const { data: { user: authUser } } = await supabase.auth.getUser()
        if (authUser) {
          setUser({
            id: authUser.id,
            email: authUser.email || '',
            role: 'cliente',
          })
        }
        return
      }

      setUser({
        id: profile.id,
        email: profile.email,
        nombre: profile.nombre || undefined,
        role: profile.role as 'admin' | 'propietario' | 'asesor' | 'cliente',
        telefono: profile.telefono || undefined,
        avatar: profile.avatar || undefined,
      })
    } catch (error) {
      console.error('Error loading user profile:', error)
    }
  }

  const signup = async (email: string, password: string, userData: Partial<User>) => {
    try {
      throw new Error('Signup no está disponible. Contacta al administrador.')
    } catch (error: any) {
      console.error('Error en signup:', error)
      throw new Error(error.message || 'Error al crear la cuenta')
    }
  }

  const login = async (email: string, password: string): Promise<User | null> => {
    try {
      // Primero intentar con usuarios mock (para desarrollo/pruebas)
      const mockUser = mockUsers.find(u => u.email === email)
      
      if (mockUser) {
        // Verificar contraseña mock
        const expectedPassword = mockUser.password || 
          (mockUser.role === 'admin' ? 'arkin2025' : `${email.split('@')[0]}_arkin2025`)
        
        if (password === expectedPassword) {
          const userData: User = {
            id: mockUser.id,
            email: mockUser.email,
            nombre: mockUser.nombre,
            role: mockUser.role as User['role'],
            telefono: mockUser.telefono,
            avatar: mockUser.avatar,
          }
          setUser(userData)
          return userData
        }
      }

      // Si no hay usuario mock o la contraseña no coincide, intentar con Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('Supabase auth error:', error)
        throw new Error('Credenciales inválidas')
      }

      if (!data.user) {
        throw new Error('No se pudo iniciar sesión')
      }

      // Cargar perfil del usuario desde Supabase
      await loadUserProfile(data.user.id)
      
      return user
    } catch (error: any) {
      console.error('Error en login:', error)
      throw new Error(error.message || 'Credenciales inválidas')
    }
  }

  const logout = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
    } catch (error: any) {
      console.error('Error en logout:', error)
      throw new Error(error.message || 'Error al cerrar sesión')
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      logout,
      isAuthenticated: !!user,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
