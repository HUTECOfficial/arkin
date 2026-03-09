'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Code2,
  Webhook,
  Database,
  Zap,
  Shield,
  Globe,
  ArrowRight,
  Copy,
  Check,
  Terminal,
  BookOpen,
  MessageSquare,
  Bot,
} from 'lucide-react'

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={copy}
      className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5 text-gray-400" />}
    </button>
  )
}

const endpoints = [
  {
    method: 'GET',
    path: '/api/propiedades',
    desc: 'Listar propiedades disponibles',
    color: 'bg-green-500/20 text-green-400',
  },
  {
    method: 'GET',
    path: '/api/anuncios?ubicacion=entre-secciones',
    desc: 'Obtener anuncios activos por ubicación',
    color: 'bg-green-500/20 text-green-400',
  },
  {
    method: 'POST',
    path: '/api/ai/chat',
    desc: 'Chat con ARKIN AI (Claude)',
    color: 'bg-blue-500/20 text-blue-400',
  },
  {
    method: 'POST',
    path: '/api/telegram/webhook',
    desc: 'Webhook del bot de Telegram',
    color: 'bg-purple-500/20 text-purple-400',
  },
  {
    method: 'POST',
    path: '/api/anuncios',
    desc: 'Registrar impresión o click de anuncio',
    color: 'bg-blue-500/20 text-blue-400',
  },
  {
    method: 'GET',
    path: '/api/admin/anuncios',
    desc: 'Listar todos los anuncios (admin)',
    color: 'bg-green-500/20 text-green-400',
  },
  {
    method: 'POST',
    path: '/api/admin/anuncios',
    desc: 'Crear anuncio (admin)',
    color: 'bg-blue-500/20 text-blue-400',
  },
  {
    method: 'PATCH',
    path: '/api/admin/anuncios/:id',
    desc: 'Actualizar / pausar / reanudar anuncio (admin)',
    color: 'bg-yellow-500/20 text-yellow-400',
  },
  {
    method: 'DELETE',
    path: '/api/admin/anuncios/:id',
    desc: 'Eliminar anuncio (admin)',
    color: 'bg-red-500/20 text-red-400',
  },
]

const telegramCommands = [
  { cmd: '/admin', desc: 'Panel de control administrativo' },
  { cmd: '/stats', desc: 'Estadísticas del sistema' },
  { cmd: '/asesores', desc: 'Lista de asesores' },
  { cmd: '/anuncios', desc: 'Ver y gestionar anuncios' },
  { cmd: '/todas_propiedades', desc: 'Ver todas las propiedades' },
  { cmd: '/panel', desc: 'Links a paneles de administración' },
  { cmd: '/propiedades', desc: 'Ver propiedades disponibles' },
  { cmd: '/contacto', desc: 'Información de contacto' },
]

const naturalCommands = [
  '"crea un asesor llamado Juan, email juan@arkin.mx"',
  '"cambia la propiedad 15 a vendida"',
  '"pausa el anuncio casa personalidad"',
  '"reanuda el anuncio casa personalidad"',
  '"suspende el anuncio [nombre]"',
  '"elimina el anuncio [nombre]"',
]

export default function DesarrolladorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#111] to-[#0a0a0a] text-white">
      {/* Hero */}
      <section className="pt-28 pb-16 px-4 sm:px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#D4AF37]/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full text-[#D4AF37] text-sm font-medium mb-6">
            <Code2 className="h-4 w-4" />
            Documentación para Desarrolladores
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 leading-tight">
            ¿Eres <span className="text-[#D4AF37]">Desarrollador</span>?
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Integra ARKIN SELECT en tus proyectos. API REST, bot de Telegram con IA, y base de datos en tiempo real.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="#api">
              <Button className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-black font-bold px-8 py-3 rounded-2xl">
                <Terminal className="h-4 w-4 mr-2" />
                Ver API
              </Button>
            </Link>
            <Link href="#telegram">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/5 px-8 py-3 rounded-2xl">
                <Bot className="h-4 w-4 mr-2" />
                Bot Telegram
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stack */}
      <section className="py-12 px-4 sm:px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10 text-gray-300">Stack tecnológico</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Globe, label: 'Next.js 15', sub: 'App Router + RSC', color: 'text-white' },
              { icon: Database, label: 'Supabase', sub: 'PostgreSQL + RLS', color: 'text-green-400' },
              { icon: Zap, label: 'Claude AI', sub: 'claude-haiku-4-5', color: 'text-orange-400' },
              { icon: MessageSquare, label: 'Telegram Bot', sub: 'Webhooks + AI', color: 'text-blue-400' },
              { icon: Shield, label: 'Row Level Security', sub: 'Supabase RLS', color: 'text-yellow-400' },
              { icon: Webhook, label: 'API Routes', sub: 'Next.js API', color: 'text-purple-400' },
              { icon: Code2, label: 'TypeScript', sub: 'Full type safety', color: 'text-blue-300' },
              { icon: Bot, label: 'Vercel', sub: 'Edge deployment', color: 'text-gray-300' },
            ].map((item) => (
              <Card key={item.label} className="bg-white/5 border-white/10 hover:border-[#D4AF37]/30 transition-colors">
                <CardContent className="p-5 text-center">
                  <item.icon className={`h-6 w-6 mx-auto mb-2 ${item.color}`} />
                  <p className="font-semibold text-sm text-white">{item.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.sub}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* API Endpoints */}
      <section id="api" className="py-16 px-4 sm:px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-[#D4AF37]/10 rounded-xl flex items-center justify-center">
              <Webhook className="h-5 w-5 text-[#D4AF37]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">API REST</h2>
              <p className="text-gray-400 text-sm">Base URL: <code className="text-[#D4AF37]">https://www.arkinselect.com</code></p>
            </div>
          </div>

          <div className="space-y-2">
            {endpoints.map((ep) => (
              <div
                key={ep.path}
                className="flex items-center gap-4 p-4 bg-white/3 hover:bg-white/6 border border-white/8 rounded-xl transition-colors group"
              >
                <span className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-bold font-mono ${ep.color}`}>
                  {ep.method}
                </span>
                <code className="text-sm text-gray-200 font-mono flex-1 truncate">{ep.path}</code>
                <span className="text-xs text-gray-500 hidden sm:block">{ep.desc}</span>
              </div>
            ))}
          </div>

          {/* Example */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-300">Ejemplo: Obtener anuncios activos</h3>
            <div className="relative bg-[#0d1117] border border-white/10 rounded-2xl overflow-hidden">
              <CopyButton text={`fetch('https://www.arkinselect.com/api/anuncios?ubicacion=entre-secciones')\n  .then(r => r.json())\n  .then(data => console.log(data.anuncios))`} />
              <pre className="p-5 text-sm text-gray-300 overflow-x-auto font-mono leading-relaxed">
{`fetch('https://www.arkinselect.com/api/anuncios?ubicacion=entre-secciones')
  .then(r => r.json())
  .then(data => console.log(data.anuncios))

// Respuesta:
{
  "anuncios": [
    {
      "id": "ad-xxx",
      "titulo": "Casa Personalidad",
      "descripcion": "Contenido del anuncio",
      "imagen": "https://...",
      "enlace": "https://...",
      "texto_boton": "Ver más",
      "ubicacion": "entre-secciones",
      "estilo": "elegante",
      "estado": "activo",
      "clicks": 0,
      "impresiones": 0
    }
  ]
}`}
              </pre>
            </div>
          </div>

          {/* Gestión de anuncios */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-300">Gestión de anuncios (Admin)</h3>
            <div className="relative bg-[#0d1117] border border-white/10 rounded-2xl overflow-hidden">
              <CopyButton text={`// Pausar un anuncio\nfetch('/api/admin/anuncios/ad-xxx', {\n  method: 'PATCH',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify({ estado: 'pausado', activo: false })\n})\n\n// Reanudar un anuncio\nfetch('/api/admin/anuncios/ad-xxx', {\n  method: 'PATCH',\n  body: JSON.stringify({ estado: 'activo', activo: true })\n})\n\n// Eliminar un anuncio\nfetch('/api/admin/anuncios/ad-xxx', { method: 'DELETE' })`} />
              <pre className="p-5 text-sm text-gray-300 overflow-x-auto font-mono leading-relaxed">
{`// Pausar un anuncio
fetch('/api/admin/anuncios/ad-xxx', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ estado: 'pausado', activo: false })
})

// Reanudar un anuncio
fetch('/api/admin/anuncios/ad-xxx', {
  method: 'PATCH',
  body: JSON.stringify({ estado: 'activo', activo: true })
})

// Eliminar un anuncio
fetch('/api/admin/anuncios/ad-xxx', { method: 'DELETE' })`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Telegram Bot */}
      <section id="telegram" className="py-16 px-4 sm:px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
              <Bot className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Bot de Telegram con IA</h2>
              <p className="text-gray-400 text-sm">Webhook: <code className="text-blue-400">/api/telegram/webhook</code></p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Comandos */}
            <div>
              <h3 className="text-base font-semibold text-gray-300 mb-4 flex items-center gap-2">
                <Terminal className="h-4 w-4 text-[#D4AF37]" />
                Comandos disponibles
              </h3>
              <div className="space-y-2">
                {telegramCommands.map((c) => (
                  <div key={c.cmd} className="flex items-center gap-3 p-3 bg-white/3 border border-white/8 rounded-xl">
                    <code className="text-sm text-[#D4AF37] font-mono shrink-0">{c.cmd}</code>
                    <span className="text-xs text-gray-400">{c.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Lenguaje natural */}
            <div>
              <h3 className="text-base font-semibold text-gray-300 mb-4 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-blue-400" />
                Lenguaje natural (Admin)
              </h3>
              <div className="space-y-2">
                {naturalCommands.map((c) => (
                  <div key={c} className="p-3 bg-white/3 border border-white/8 rounded-xl">
                    <code className="text-xs text-blue-300 font-mono">{c}</code>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-gray-500">
                El bot usa Claude AI para interpretar comandos en lenguaje natural y ejecutar acciones directamente sobre Supabase.
              </p>
            </div>
          </div>

          {/* Schema */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-300">Webhook payload (Telegram → Next.js)</h3>
            <div className="relative bg-[#0d1117] border border-white/10 rounded-2xl overflow-hidden">
              <pre className="p-5 text-sm text-gray-300 overflow-x-auto font-mono leading-relaxed">
{`// POST /api/telegram/webhook
{
  "message": {
    "chat": { "id": 1234567890 },
    "from": { "id": 1322017996, "first_name": "Admin" },
    "text": "/anuncios"
  }
}

// El bot responde con acciones en tiempo real:
// - Consultas a Supabase
// - Ejecución de Claude AI (claude-haiku-4-5)
// - Respuesta HTML formateada para Telegram`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* DB Schema */}
      <section className="py-16 px-4 sm:px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
              <Database className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Base de Datos</h2>
              <p className="text-gray-400 text-sm">Supabase / PostgreSQL con Row Level Security</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                table: 'propiedades',
                fields: ['id', 'titulo', 'ubicacion', 'precio', 'tipo', 'habitaciones', 'banos', 'area', 'status', 'categoria', 'usuario_id'],
                color: 'text-green-400',
              },
              {
                table: 'anuncios',
                fields: ['id', 'titulo', 'descripcion', 'imagen', 'enlace', 'texto_boton', 'ubicacion', 'estilo', 'activo', 'estado', 'fecha_inicio', 'fecha_fin', 'clicks', 'impresiones'],
                color: 'text-[#D4AF37]',
              },
              {
                table: 'usuarios',
                fields: ['id', 'email', 'nombre', 'telefono', 'role', 'avatar', 'plan'],
                color: 'text-blue-400',
              },
              {
                table: 'solicitudes_propiedad',
                fields: ['id', 'nombre', 'email', 'telefono', 'mensaje', 'tipo', 'estado', 'created_at'],
                color: 'text-purple-400',
              },
            ].map((t) => (
              <div key={t.table} className="bg-white/3 border border-white/8 rounded-2xl p-5">
                <h3 className={`font-mono font-bold mb-3 ${t.color}`}>{t.table}</h3>
                <div className="space-y-1">
                  {t.fields.map((f) => (
                    <div key={f} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-600 shrink-0" />
                      <code className="text-xs text-gray-400 font-mono">{f}</code>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-black mb-4">¿Tienes preguntas técnicas?</h2>
          <p className="text-gray-400 mb-8">Contáctanos para integrar tu plataforma con ARKIN SELECT</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contacto">
              <Button className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-black font-bold px-8 py-3 rounded-2xl">
                <MessageSquare className="h-4 w-4 mr-2" />
                Contactar
              </Button>
            </Link>
            <Link href="/panel-admin">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/5 px-8 py-3 rounded-2xl">
                Panel Admin
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
