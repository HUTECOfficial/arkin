"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Building2, MapPin, Home, X, ChevronRight } from "lucide-react"

interface Edificio {
  id: number
  nombre: string
  zona: string
  tipo: string
  disponibles: number
  total: number
  precioDesde: string
  pisos: number
  color: string
  x: number
  y: number
  width: number
  depth: number
  height: number
}

const edificios: Edificio[] = [
  { id: 1, nombre: "Torre Arkin Campestre", zona: "Campestre", tipo: "Departamentos de Lujo", disponibles: 12, total: 48, precioDesde: "$4,200,000", pisos: 18, color: "#eab308", x: 120, y: 80, width: 60, depth: 50, height: 140 },
  { id: 2, nombre: "Residencial La Valenciana", zona: "La Valenciana", tipo: "Casas Residenciales", disponibles: 8, total: 32, precioDesde: "$3,800,000", pisos: 3, color: "#10b981", x: 260, y: 60, width: 80, depth: 60, height: 60 },
  { id: 3, nombre: "Gran Jardín Tower", zona: "Gran Jardín", tipo: "Departamentos", disponibles: 24, total: 80, precioDesde: "$2,900,000", pisos: 22, color: "#3b82f6", x: 420, y: 90, width: 55, depth: 45, height: 165 },
  { id: 4, nombre: "Puerta Plata Residencial", zona: "Puerta Plata", tipo: "Casas Premium", disponibles: 5, total: 20, precioDesde: "$5,500,000", pisos: 2, color: "#f97316", x: 560, y: 70, width: 90, depth: 70, height: 45 },
  { id: 5, nombre: "Mayorazgo Business", zona: "Mayorazgo", tipo: "Oficinas", disponibles: 18, total: 40, precioDesde: "$3,100,000", pisos: 12, color: "#8b5cf6", x: 200, y: 200, width: 65, depth: 55, height: 100 },
  { id: 6, nombre: "San Isidro Park", zona: "San Isidro", tipo: "Departamentos", disponibles: 30, total: 60, precioDesde: "$2,500,000", pisos: 14, color: "#ef4444", x: 370, y: 210, width: 58, depth: 48, height: 115 },
  { id: 7, nombre: "El Refugio Towers", zona: "El Refugio", tipo: "Penthouse", disponibles: 6, total: 24, precioDesde: "$6,800,000", pisos: 20, color: "#14b8a6", x: 510, y: 190, width: 52, depth: 42, height: 155 },
  { id: 8, nombre: "Cañada Lofts", zona: "La Cañada", tipo: "Lofts Modernos", disponibles: 14, total: 36, precioDesde: "$1,900,000", pisos: 8, color: "#f43f5e", x: 100, y: 290, width: 70, depth: 50, height: 75 },
  { id: 9, nombre: "Centro Histórico Plaza", zona: "Centro", tipo: "Locales Comerciales", disponibles: 9, total: 30, precioDesde: "$2,200,000", pisos: 5, color: "#d946ef", x: 300, y: 310, width: 85, depth: 65, height: 55 },
  { id: 10, nombre: "Arkin Select Tower", zona: "Campestre", tipo: "Departamentos Premium", disponibles: 3, total: 16, precioDesde: "$8,900,000", pisos: 28, color: "#eab308", x: 450, y: 300, width: 48, depth: 40, height: 200 }
]

const ISO_ANGLE = 30
const ISO_SCALE_X = Math.cos((ISO_ANGLE * Math.PI) / 180)
const ISO_SCALE_Y = Math.sin((ISO_ANGLE * Math.PI) / 180)

function toIso(x: number, y: number) {
  return {
    sx: (x - y) * ISO_SCALE_X,
    sy: (x + y) * ISO_SCALE_Y
  }
}

function Building3D({
  edificio,
  isHovered,
  isSelected,
  onHover,
  onLeave,
  onClick
}: {
  edificio: Edificio
  isHovered: boolean
  isSelected: boolean
  onHover: () => void
  onLeave: () => void
  onClick: () => void
}) {
  const { id, x, y, width: w, depth: d, height: h, color } = edificio
  const active = isHovered || isSelected

  // Coordinates projection (centered and scaled)
  const project = (cx: number, cy: number, cz: number) => {
    const iso = toIso(cx, cy)
    return { px: iso.sx + 500, py: iso.sy - cz * 0.8 + 300 }
  }

  // 8 corners
  const corners = [
    { x: x,     y: y,     z: 0 },
    { x: x + w, y: y,     z: 0 },
    { x: x + w, y: y + d, z: 0 },
    { x: x,     y: y + d, z: 0 },
    { x: x,     y: y,     z: h },
    { x: x + w, y: y,     z: h },
    { x: x + w, y: y + d, z: h },
    { x: x,     y: y + d, z: h },
  ]
  const pts = corners.map(c => project(c.x, c.y, c.z))

  // Faces
  const shadowFace = [pts[0], pts[1], pts[2], pts[3]]
  const topFace = [pts[4], pts[5], pts[6], pts[7]]
  const leftFace = [pts[0], pts[4], pts[7], pts[3]]
  const rightFace = [pts[1], pts[5], pts[6], pts[2]]
  const frontFace = [pts[0], pts[1], pts[5], pts[4]]

  const toPath = (face: { px: number; py: number }[]) =>
    face.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.px.toFixed(1)},${p.py.toFixed(1)}`).join(' ') + ' Z'

  return (
    <g style={{ cursor: 'pointer' }} onMouseEnter={onHover} onMouseLeave={onLeave} onClick={onClick} className="transition-all duration-300">
      
      {/* Drop Shadow */}
      <path d={toPath(shadowFace)} fill="rgba(0,0,0,0.6)" transform="translate(0, 15)" filter="blur(8px)" opacity={active ? 0.8 : 0.4} />

      {/* Building Faces */}
      <g style={{ transform: active ? 'translateY(-10px)' : 'translateY(0)', transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
        
        {/* Gradients */}
        <defs>
          <linearGradient id={`leftGrad_${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={active ? 0.9 : 0.6} />
            <stop offset="100%" stopColor={color} stopOpacity={0.2} />
          </linearGradient>
          <linearGradient id={`rightGrad_${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={active ? 0.7 : 0.4} />
            <stop offset="100%" stopColor={color} stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id={`frontGrad_${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={active ? 0.8 : 0.5} />
            <stop offset="100%" stopColor={color} stopOpacity={0.15} />
          </linearGradient>
        </defs>

        {/* Back faces (left & right) */}
        <path d={toPath(leftFace)} fill={`url(#leftGrad_${id})`} stroke={color} strokeWidth={active ? 1.5 : 0.5} strokeOpacity={active ? 1 : 0.5} />
        <path d={toPath(rightFace)} fill={`url(#rightGrad_${id})`} stroke={color} strokeWidth={active ? 1.5 : 0.5} strokeOpacity={active ? 1 : 0.5} />
        
        {/* Front Face */}
        <path d={toPath(frontFace)} fill={`url(#frontGrad_${id})`} stroke={color} strokeWidth={active ? 1.5 : 0.5} strokeOpacity={active ? 1 : 0.8} />
        
        {/* Top Face */}
        <path d={toPath(topFace)} fill={color} fillOpacity={active ? 0.9 : 0.7} stroke="#ffffff" strokeWidth={1} strokeOpacity={0.8} />

        {/* Tech lines / details */}
        {active && (
          <g opacity="0.6">
            <line x1={pts[4].px} y1={pts[4].py} x2={pts[4].px} y2={pts[4].py + 40} stroke="#ffffff" strokeWidth="2" />
            <line x1={pts[5].px} y1={pts[5].py} x2={pts[5].px} y2={pts[5].py + 40} stroke="#ffffff" strokeWidth="2" />
          </g>
        )}

        {/* Hover Label */}
        {active && (
          <g>
            <rect 
              x={pts[6].px - 40} 
              y={pts[6].py - 30} 
              width="80" 
              height="20" 
              rx="4" 
              fill="#0f172a" 
              stroke={color} 
              strokeWidth="1"
            />
            <text
              x={pts[6].px}
              y={pts[6].py - 16}
              textAnchor="middle"
              fontSize={10}
              fontWeight="bold"
              fill="#ffffff"
            >
              {edificio.disponibles} disp.
            </text>
            <line 
              x1={pts[6].px} y1={pts[6].py - 10} 
              x2={pts[6].px} y2={pts[6].py} 
              stroke={color} strokeWidth="1" 
            />
          </g>
        )}
      </g>
    </g>
  )
}

export function Leon3DMap() {
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const selectedEdificio = edificios.find(e => e.id === selectedId)
  const hoveredEdificio = edificios.find(e => e.id === hoveredId)
  const activeEdificio = selectedEdificio || hoveredEdificio

  const zonas = [...new Set(edificios.map(e => e.zona))]

  return (
    <div className="relative w-full">
      {/* Legend */}
      <div className="flex flex-wrap gap-2 mb-6 px-2">
        {zonas.map(zona => {
          const ed = edificios.find(e => e.zona === zona)!
          return (
            <button
              key={zona}
              onClick={() => {
                const found = edificios.find(e => e.zona === zona)
                if (found) setSelectedId(prev => prev === found.id ? null : found.id)
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all hover:scale-105"
              style={{
                borderColor: `${ed.color}50`,
                color: '#fff',
                backgroundColor: `${ed.color}20`,
                boxShadow: `0 0 10px ${ed.color}20`
              }}
            >
              <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: ed.color, boxShadow: `0 0 5px ${ed.color}` }} />
              {zona}
            </button>
          )
        })}
      </div>

      <div className="relative bg-[#0b0f19] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
        {/* Glow behind grid */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-arkin-primary/10 via-transparent to-transparent opacity-50 pointer-events-none" />

        {/* 3D Canvas */}
        <svg
          viewBox="0 0 1000 700"
          className="w-full h-auto"
          style={{ minHeight: 450, display: 'block' }}
        >
          <defs>
            <pattern id="iso-grid" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(-30) skewX(30)">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            </pattern>
            <radialGradient id="groundGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1e293b" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0b0f19" stopOpacity="1" />
            </radialGradient>
          </defs>

          {/* Ground */}
          <ellipse cx="500" cy="450" rx="480" ry="180" fill="url(#groundGrad)" />
          <ellipse cx="500" cy="450" rx="480" ry="180" fill="url(#iso-grid)" />

          {/* Glowing Ground Hubs */}
          {[
            { x: 300, y: 150, color: "#eab308" },
            { x: 500, y: 100, color: "#3b82f6" },
            { x: 200, y: 250, color: "#f43f5e" }
          ].map((hub, i) => {
            const iso = toIso(hub.x, hub.y)
            return (
              <ellipse 
                key={i} 
                cx={iso.sx + 500} 
                cy={iso.sy + 300} 
                rx="60" ry="25" 
                fill={`radial-gradient(ellipse, ${hub.color}30 0%, transparent 70%)`} 
                opacity="0.6"
              />
            )
          })}

          {/* Roads/Connections */}
          {[
            { x1: 100, y1: 100, x2: 600, y2: 100 },
            { x1: 100, y1: 200, x2: 600, y2: 200 },
            { x1: 300, y1: 50, x2: 300, y2: 350 },
            { x1: 450, y1: 50, x2: 450, y2: 350 },
          ].map((road, i) => {
            const p1 = toIso(road.x1, road.y1)
            const p2 = toIso(road.x2, road.y2)
            return (
              <line
                key={`road-${i}`}
                x1={p1.sx + 500} y1={p1.sy + 300}
                x2={p2.sx + 500} y2={p2.sy + 300}
                stroke="url(#roadGrad)" strokeWidth={4}
                opacity={0.3}
              />
            )
          })}
          <defs>
            <linearGradient id="roadGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>

          {/* Buildings — render back to front (sort by x+y) */}
          {[...edificios]
            .sort((a, b) => (a.x + a.y) - (b.x + b.y))
            .map(ed => (
              <Building3D
                key={ed.id}
                edificio={ed}
                isHovered={hoveredId === ed.id}
                isSelected={selectedId === ed.id}
                onHover={() => setHoveredId(ed.id)}
                onLeave={() => setHoveredId(null)}
                onClick={() => setSelectedId(prev => prev === ed.id ? null : ed.id)}
              />
            ))}

          {/* Compass */}
          <g transform="translate(900, 80)">
            <circle cx={0} cy={0} r={24} fill="rgba(15, 23, 42, 0.8)" stroke="rgba(255,255,255,0.1)" />
            <text x={0} y={-10} textAnchor="middle" fontSize={12} fill="#3b82f6" fontWeight="bold">N</text>
            <polygon points="0,-20 4,-5 0,-10 -4,-5" fill="#3b82f6" />
            <polygon points="0,20 4,5 0,10 -4,5" fill="rgba(255,255,255,0.2)" />
          </g>

        </svg>

        {/* Info panel overlay */}
        {activeEdificio && (
          <div className="absolute top-6 right-6 w-72 transition-all duration-300 animate-in fade-in slide-in-from-right-4">
            <Card className="bg-[#0f172a]/90 backdrop-blur-md border border-slate-700/50 shadow-2xl overflow-hidden">
              <div className="h-1 w-full" style={{ backgroundColor: activeEdificio.color }} />
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <Badge variant="outline" className="mb-2 text-[10px] uppercase tracking-wider font-semibold border-slate-600 bg-slate-800/50 text-slate-300">
                      {activeEdificio.zona}
                    </Badge>
                    <h3 className="font-bold text-white text-lg leading-tight">
                      {activeEdificio.nombre}
                    </h3>
                  </div>
                  {selectedId === activeEdificio.id && (
                    <button
                      onClick={() => setSelectedId(null)}
                      className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 p-1.5 rounded-full transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div className="bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/50">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-1">Tipo</p>
                    <p className="text-sm text-white font-medium truncate" title={activeEdificio.tipo}>{activeEdificio.tipo}</p>
                  </div>
                  <div className="bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/50">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-1">Pisos</p>
                    <p className="text-sm text-white font-medium">{activeEdificio.pisos} niveles</p>
                  </div>
                </div>

                <div className="mb-5">
                  <p className="text-sm text-slate-400 mb-1">Inversión desde</p>
                  <p className="text-2xl font-bold" style={{ color: activeEdificio.color }}>
                    {activeEdificio.precioDesde}
                  </p>
                </div>

                {/* Availability bar */}
                <div className="mb-5">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-slate-300 font-medium">Disponibilidad</span>
                    <span className="text-white font-bold">
                      {activeEdificio.disponibles} / {activeEdificio.total} unid.
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-700">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out relative"
                      style={{
                        width: `${(activeEdificio.disponibles / activeEdificio.total) * 100}%`,
                        backgroundColor: activeEdificio.color
                      }}
                    >
                      <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]" />
                    </div>
                  </div>
                </div>

                <button 
                  className="w-full py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:brightness-110"
                  style={{ backgroundColor: `${activeEdificio.color}20`, color: activeEdificio.color, border: `1px solid ${activeEdificio.color}50` }}
                >
                  Ver Unidades
                  <ChevronRight className="h-4 w-4" />
                </button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Bottom Stats bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-md border-t border-slate-800 px-6 py-3 flex flex-wrap gap-8 text-xs text-slate-300 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
          <span className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-arkin-gold" />
            <strong className="text-white text-sm">{edificios.length}</strong> proyectos activos
          </span>
          <span className="flex items-center gap-2">
            <Home className="h-4 w-4 text-emerald-400" />
            <strong className="text-white text-sm">{edificios.reduce((s, e) => s + e.disponibles, 0)}</strong> unidades disponibles
          </span>
          <span className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-blue-400" />
            <strong className="text-white text-sm">{zonas.length}</strong> zonas premium
          </span>
        </div>
      </div>
    </div>
  )
}
