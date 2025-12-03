'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Building2, Lock, Mail, AlertCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const userData = await login(email, password)

      // Redirigir según el rol del usuario
      if (userData?.role === 'admin') {
        router.push('/panel-admin')
      } else if (userData?.role === 'propietario') {
        router.push('/panel-propietario')
      } else if (userData?.role === 'fotografo') {
        router.push('/panel-fotografo')
      } else if (userData?.role === 'asesor') {
        router.push('/panel-asesor')
      } else {
        router.push('/')
      }
    } catch (err: any) {
      setError(err.message || 'Credenciales incorrectas')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-arkin-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image
              src="/arkinlogo.jpg"
              alt="ARKIN SELECT"
              width={250}
              height={80}
              className="h-16 w-auto object-contain"
            />
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
            Acceso a Plataforma ARKIN SELECT
          </p>
        </div>

        {/* Formulario */}
        <div className="bg-gray-300/50 dark:bg-gray-800 rounded-3xl shadow-xl p-8 border border-gray-400/30 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-arkin-secondary/70 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-arkin-gold focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
                  placeholder="tu@arkin.mx"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-arkin-secondary/70 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-arkin-gold focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-arkin-gold hover:bg-arkin-gold/90 text-gray-800 font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-arkin-gold/20"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          {/* Info de prueba */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mb-3">
              Credenciales de prueba:
            </p>
            <div className="space-y-2 text-xs">
              <div className="p-2 bg-arkin-secondary/70 dark:bg-gray-900 rounded-lg">
                <p className="font-medium text-gray-700 dark:text-gray-300">Asesor:</p>
                <p className="text-gray-600 dark:text-gray-400">ana@arkin.mx / ana_arkin2025</p>
              </div>
              <div className="p-2 bg-arkin-secondary/70 dark:bg-gray-900 rounded-lg">
                <p className="font-medium text-gray-700 dark:text-gray-300">Propietario:</p>
                <p className="text-gray-600 dark:text-gray-400">eduardo@propietario.com / eduardo_arkin2025</p>
              </div>
              <div className="p-2 bg-arkin-secondary/70 dark:bg-gray-900 rounded-lg">
                <p className="font-medium text-gray-700 dark:text-gray-300">Fotógrafo:</p>
                <p className="text-gray-600 dark:text-gray-400">santiago@arkin.mx / santiago_arkin2025</p>
              </div>
            </div>
          </div>

          {/* Link a registro */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ¿No tienes cuenta?{' '}
              <Link href="/registro" className="text-arkin-gold hover:underline font-medium">
                Crear cuenta
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          © 2025 ARKIN SELECT. Todos los derechos reservados.
        </p>
      </div>
    </div>
  )
}
