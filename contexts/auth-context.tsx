'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { users as mockUsers } from '@/data/internal-users'

interface User {
  id: string
  email: string
  nombre?: string
  role: 'admin' | 'propietario' | 'asesor' | 'fotografo' | 'cliente' | 'broker' | 'empresa'
  telefono?: string
  avatar?: string
  propiedadId?: number
  plan?: 'core' | 'elite' | 'team-core' | 'team-elite'
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

const MOCK_USER_STORAGE_KEY = 'arkin_mock_user'

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
        // Solo limpiar si no hay mock user guardado
        const savedMockUser = localStorage.getItem(MOCK_USER_STORAGE_KEY)
        if (!savedMockUser) {
          setUser(null)
        }
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkUser = async () => {
    try {
      // Primero verificar si hay un mock user guardado
      const savedMockUser = localStorage.getItem(MOCK_USER_STORAGE_KEY)
      if (savedMockUser) {
        try {
          const parsedUser = JSON.parse(savedMockUser) as User
          setUser(parsedUser)
          setLoading(false)
          return
        } catch {
          localStorage.removeItem(MOCK_USER_STORAGE_KEY)
        }
      }

      // Si no hay mock user, verificar sesión de Supabase
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
      // Crear usuario en Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        console.error('Supabase signup error:', error)
        throw new Error(error.message || 'Error al crear la cuenta')
      }

      if (!data.user) {
        throw new Error('No se pudo crear la cuenta')
      }

      // Crear perfil del usuario en la tabla usuarios
      const { error: profileError } = await supabase
        .from('usuarios')
        .insert({
          id: data.user.id,
          email: email,
          nombre: userData.nombre || '',
          telefono: userData.telefono || '',
          role: 'cliente', // Por defecto todos los nuevos usuarios son clientes
        })

      if (profileError) {
        console.error('Error creating profile:', profileError)
        // No lanzar error aquí, el usuario ya fue creado en auth
      }

      // Establecer el usuario en el estado
      setUser({
        id: data.user.id,
        email: email,
        nombre: userData.nombre,
        role: 'cliente',
        telefono: userData.telefono,
      })

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
        
        console.log('Mock user found:', email, 'Expected password:', expectedPassword)
        
        if (password === expectedPassword) {
          // Intentar obtener el UUID real de Supabase por email via API (evita RLS)
          let realUserId = mockUser.id
          try {
            const res = await fetch(`/api/auth/user-id?email=${encodeURIComponent(email)}`)
            if (res.ok) {
              const { userId } = await res.json()
              if (userId) {
                realUserId = userId
              }
            }
          } catch {
            // Si falla, usar el ID mock
          }

          const userData: User = {
            id: realUserId,
            email: mockUser.email,
            nombre: mockUser.nombre,
            role: mockUser.role as User['role'],
            telefono: mockUser.telefono,
            avatar: mockUser.avatar,
            propiedadId: mockUser.propiedadId,
            plan: (mockUser as any).plan || undefined,
          }
          setUser(userData)
          try {
            localStorage.setItem(MOCK_USER_STORAGE_KEY, JSON.stringify(userData))
          } catch (e) {
            // Si localStorage está lleno, limpiar y reintentar
            console.warn('localStorage lleno, limpiando...')
            localStorage.clear()
            try {
              localStorage.setItem(MOCK_USER_STORAGE_KEY, JSON.stringify(userData))
            } catch (e2) {
              console.error('No se pudo guardar usuario en localStorage:', e2)
            }
          }
          return userData
        } else {
          // Si es usuario mock pero contraseña incorrecta, NO intentar con Supabase
          console.error('Mock user password mismatch')
          throw new Error('Contraseña incorrecta')
        }
      }

      // Solo intentar con Supabase si NO es un usuario mock
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
      // Limpiar mock user de localStorage
      localStorage.removeItem(MOCK_USER_STORAGE_KEY)
      setUser(null)
      try {
        await supabase.auth.signOut()
      } catch {
        // Ignorar errores de signOut (puede no haber sesión real)
      }
    } catch (error: any) {
      console.error('Error en logout:', error)
      // Forzar limpieza aunque falle
      localStorage.removeItem(MOCK_USER_STORAGE_KEY)
      setUser(null)
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
