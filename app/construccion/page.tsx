'use client'

import { useEffect, useRef, useState } from 'react'

export default function ConstruccionPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [progress, setProgress] = useState(0)
  const [currentPhase, setCurrentPhase] = useState(0)

  const phases = [
    'Diseñando experiencias únicas',
    'Calibrando inteligencia artificial',
    'Preparando propiedades exclusivas',
    'Refinando cada detalle',
    'Casi listo para ti',
  ]

  // Animated progress
  useEffect(() => {
    const target = 73
    let current = 0
    const step = () => {
      current += 0.4
      if (current <= target) {
        setProgress(Math.floor(current))
        requestAnimationFrame(step)
      }
    }
    const t = setTimeout(() => requestAnimationFrame(step), 800)
    return () => clearTimeout(t)
  }, [])

  // Cycle phases
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhase(p => (p + 1) % phases.length)
    }, 2800)
    return () => clearInterval(interval)
  }, [])

  // Liquid blobs canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let t = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const blobs = [
      { x: 0.2, y: 0.3, r: 0.38, vx: 0.00012, vy: 0.00008, color: 'rgba(232,255,80,0.13)', colorBright: 'rgba(232,255,80,0.26)' },
      { x: 0.75, y: 0.2, r: 0.32, vx: -0.0001, vy: 0.00013, color: 'rgba(232,255,80,0.09)', colorBright: 'rgba(232,255,80,0.18)' },
      { x: 0.5, y: 0.7, r: 0.42, vx: 0.00008, vy: -0.0001, color: 'rgba(255,255,255,0.06)', colorBright: 'rgba(255,255,255,0.12)' },
      { x: 0.85, y: 0.65, r: 0.28, vx: -0.00013, vy: -0.00009, color: 'rgba(232,255,80,0.07)', colorBright: 'rgba(232,255,80,0.14)' },
      { x: 0.1, y: 0.8, r: 0.3, vx: 0.00015, vy: 0.00006, color: 'rgba(200,255,100,0.08)', colorBright: 'rgba(200,255,100,0.16)' },
    ]

    const draw = () => {
      t += 1
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      blobs.forEach((b, i) => {
        b.x += b.vx * Math.sin(t * 0.003 + i)
        b.y += b.vy * Math.cos(t * 0.004 + i * 1.3)
        if (b.x < 0 || b.x > 1) b.vx *= -1
        if (b.y < 0 || b.y > 1) b.vy *= -1

        const cx = b.x * canvas.width
        const cy = b.y * canvas.height
        const r = b.r * Math.min(canvas.width, canvas.height)

        // Liquid morph using bezier offset
        const wobble = 0.12
        ctx.beginPath()
        const pts = 8
        for (let p = 0; p <= pts; p++) {
          const angle = (p / pts) * Math.PI * 2
          const noise = 1 + wobble * Math.sin(t * 0.02 + p * 2.1 + i * 3.7)
          const px = cx + r * noise * Math.cos(angle)
          const py = cy + r * noise * Math.sin(angle)
          if (p === 0) ctx.moveTo(px, py)
          else ctx.lineTo(px, py)
        }
        ctx.closePath()

        const grad = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, 0, cx, cy, r)
        grad.addColorStop(0, b.colorBright)
        grad.addColorStop(0.5, b.color)
        grad.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = grad
        ctx.filter = 'blur(40px)'
        ctx.fill()
        ctx.filter = 'none'
      })

      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#080808] flex items-center justify-center">

      {/* Liquid blobs background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(232,255,80,0.03) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(232,255,80,0.03) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
          zIndex: 1,
        }}
      />

      {/* Radial vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)',
          zIndex: 2,
        }}
      />

      {/* MAIN GLASS CARD */}
      <div
        className="relative flex flex-col items-center text-center px-8 py-12 md:px-16 md:py-16 max-w-2xl w-full mx-4"
        style={{
          zIndex: 10,
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(48px) saturate(1.8)',
          WebkitBackdropFilter: 'blur(48px) saturate(1.8)',
          borderRadius: '32px',
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: `
            0 0 0 1px rgba(232,255,80,0.08),
            0 32px 80px rgba(0,0,0,0.6),
            0 8px 32px rgba(232,255,80,0.06),
            inset 0 1px 0 rgba(255,255,255,0.15),
            inset 0 -1px 0 rgba(0,0,0,0.2)
          `,
        }}
      >
        {/* Inner highlight rim */}
        <div
          className="absolute inset-0 pointer-events-none rounded-[32px]"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%, rgba(232,255,80,0.04) 100%)',
          }}
        />

        {/* Logo + badge */}
        <div className="relative mb-8 flex flex-col items-center">
          {/* Glow ring */}
          <div
            className="absolute rounded-full animate-pulse"
            style={{
              width: 88, height: 88,
              background: 'radial-gradient(circle, rgba(232,255,80,0.25) 0%, transparent 70%)',
              filter: 'blur(12px)',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
          <div
            className="relative w-20 h-20 rounded-[22px] flex items-center justify-center"
            style={{
              background: 'rgba(255,255,255,0.06)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.14)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
            }}
          >
            <img src="/arkinlogo.jpg" alt="ARKIN" className="w-12 h-12 object-contain rounded-lg" />
          </div>
        </div>

        {/* Title */}
        <div className="mb-2">
          <span
            className="text-xs font-semibold tracking-[0.25em] uppercase"
            style={{ color: 'rgba(232,255,80,0.9)' }}
          >
            Arkin Select
          </span>
        </div>

        <h1
          className="text-4xl md:text-5xl font-bold mb-3 leading-tight"
          style={{
            color: 'rgba(255,255,255,0.95)',
            fontFamily: "'Helvetica Neue Extended', 'Helvetica Neue', Helvetica, Arial, sans-serif",
            letterSpacing: '-0.02em',
          }}
        >
          Algo grande<br />
          <span style={{ color: '#e8ff50' }}>está llegando.</span>
        </h1>

        <p
          className="text-base md:text-lg mb-10 max-w-md leading-relaxed"
          style={{ color: 'rgba(255,255,255,0.45)' }}
        >
          Estamos construyendo la plataforma inmobiliaria más exclusiva de México. Pronto podrás vivir la experiencia completa.
        </p>

        {/* Animated phase text */}
        <div
          className="mb-8 h-6 flex items-center justify-center"
          key={currentPhase}
          style={{
            animation: 'fadeSlideIn 0.5s ease forwards',
          }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: '#e8ff50' }}
            />
            <span
              className="text-sm font-medium tracking-wide"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              {phases[currentPhase]}
            </span>
          </div>
        </div>

        {/* Progress bar — liquid glass */}
        <div className="w-full mb-3">
          <div
            className="relative w-full h-2 rounded-full overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.08)',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.4)',
            }}
          >
            <div
              className="absolute left-0 top-0 h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, rgba(232,255,80,0.7) 0%, #e8ff50 60%, rgba(255,255,180,0.9) 100%)',
                boxShadow: '0 0 12px rgba(232,255,80,0.6), 0 0 24px rgba(232,255,80,0.3)',
              }}
            />
            {/* Shimmer */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)',
                animation: 'shimmer 2s infinite',
                backgroundSize: '200% 100%',
              }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between w-full mb-10">
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Progreso</span>
          <span
            className="text-sm font-bold tabular-nums"
            style={{ color: '#e8ff50', textShadow: '0 0 12px rgba(232,255,80,0.5)' }}
          >
            {progress}%
          </span>
        </div>

        {/* Divider */}
        <div
          className="w-full mb-8"
          style={{
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
          }}
        />

        {/* Stats row — mini glass chips */}
        <div className="flex gap-4 flex-wrap justify-center mb-10">
          {[
            { label: 'Propiedades', value: '240+' },
            { label: 'Asesores', value: 'Elite' },
            { label: 'León, Gto.', value: '📍' },
          ].map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center px-5 py-3 rounded-2xl"
              style={{
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.09)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)',
              }}
            >
              <span className="text-lg font-bold" style={{ color: 'rgba(255,255,255,0.9)' }}>{s.value}</span>
              <span className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* CTA notify */}
        <div
          className="flex items-center gap-3 px-5 py-3 rounded-2xl w-full max-w-sm"
          style={{
            background: 'rgba(232,255,80,0.07)',
            border: '1px solid rgba(232,255,80,0.2)',
            boxShadow: '0 0 24px rgba(232,255,80,0.08)',
          }}
        >
          <div
            className="w-2 h-2 rounded-full flex-shrink-0 animate-pulse"
            style={{ background: '#e8ff50', boxShadow: '0 0 8px #e8ff50' }}
          />
          <span className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Visita pronto{' '}
            <span style={{ color: 'rgba(232,255,80,0.9)', fontWeight: 600 }}>arkinselect.com</span>
          </span>
        </div>

        {/* Footer */}
        <p className="mt-8 text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
          © 2026 ARKIN Select · Plataforma Inmobiliaria Exclusiva
        </p>
      </div>

      <style jsx global>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  )
}
