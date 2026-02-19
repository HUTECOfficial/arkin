"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Building2, MapPin, Home, X } from "lucide-react"

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
  {
    id: 1,
    nombre: "Torre Arkin Campestre",
    zona: "Campestre",
    tipo: "Departamentos de Lujo",
    disponibles: 12,
    total: 48,
    precioDesde: "$4,200,000",
    pisos: 18,
    color: "#C9A84C",
    x: 120, y: 80, width: 60, depth: 50, height: 140
  },
  {
    id: 2,
    nombre: "Residencial La Valenciana",
    zona: "La Valenciana",
    tipo: "Casas Residenciales",
    disponibles: 8,
    total: 32,
    precioDesde: "$3,800,000",
    pisos: 3,
    color: "#4A7C59",
    x: 260, y: 60, width: 80, depth: 60, height: 60
  },
  {
    id: 3,
    nombre: "Gran Jardín Tower",
    zona: "Gran Jardín",
    tipo: "Departamentos",
    disponibles: 24,
    total: 80,
    precioDesde: "$2,900,000",
    pisos: 22,
    color: "#2D6A9F",
    x: 420, y: 90, width: 55, depth: 45, height: 165
  },
  {
    id: 4,
    nombre: "Puerta Plata Residencial",
    zona: "Puerta Plata",
    tipo: "Casas Premium",
    disponibles: 5,
    total: 20,
    precioDesde: "$5,500,000",
    pisos: 2,
    color: "#8B5E3C",
    x: 560, y: 70, width: 90, depth: 70, height: 45
  },
  {
    id: 5,
    nombre: "Mayorazgo Business",
    zona: "Mayorazgo",
    tipo: "Oficinas y Locales",
    disponibles: 18,
    total: 40,
    precioDesde: "$3,100,000",
    pisos: 12,
    color: "#6B4C9A",
    x: 200, y: 200, width: 65, depth: 55, height: 100
  },
  {
    id: 6,
    nombre: "San Isidro Park",
    zona: "San Isidro",
    tipo: "Departamentos",
    disponibles: 30,
    total: 60,
    precioDesde: "$2,500,000",
    pisos: 14,
    color: "#C0392B",
    x: 370, y: 210, width: 58, depth: 48, height: 115
  },
  {
    id: 7,
    nombre: "El Refugio Towers",
    zona: "El Refugio",
    tipo: "Penthouse y Deptos",
    disponibles: 6,
    total: 24,
    precioDesde: "$6,800,000",
    pisos: 20,
    color: "#1A7A6E",
    x: 510, y: 190, width: 52, depth: 42, height: 155
  },
  {
    id: 8,
    nombre: "Cañada Lofts",
    zona: "La Cañada",
    tipo: "Lofts Modernos",
    disponibles: 14,
    total: 36,
    precioDesde: "$1,900,000",
    pisos: 8,
    color: "#D35400",
    x: 100, y: 290, width: 70, depth: 50, height: 75
  },
  {
    id: 9,
    nombre: "Centro Histórico Plaza",
    zona: "Centro",
    tipo: "Locales Comerciales",
    disponibles: 9,
    total: 30,
    precioDesde: "$2,200,000",
    pisos: 5,
    color: "#7D6608",
    x: 300, y: 310, width: 85, depth: 65, height: 55
  },
  {
    id: 10,
    nombre: "Arkin Select Tower",
    zona: "Campestre",
    tipo: "Departamentos Premium",
    disponibles: 3,
    total: 16,
    precioDesde: "$8,900,000",
    pisos: 28,
    color: "#C9A84C",
    x: 450, y: 300, width: 48, depth: 40, height: 200
  }
]

// Isometric projection
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
  const { x, y, width: w, depth: d, height: h, color } = edificio
  const active = isHovered || isSelected

  // 8 corners of the box in 3D (x, y, z)
  // Base corners
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

  const project = (cx: number, cy: number, cz: number) => {
    const iso = toIso(cx, cy)
    return { px: iso.sx + 400, py: iso.sy - cz * 0.6 + 350 }
  }

  const pts = corners.map(c => project(c.x, c.y, c.z))

  // Faces: top, left side, right side
  const topFace = [pts[4], pts[5], pts[6], pts[7]]
  const leftFace = [pts[0], pts[4], pts[7], pts[3]]
  const rightFace = [pts[1], pts[5], pts[6], pts[2]]
  const frontFace = [pts[0], pts[1], pts[5], pts[4]]

  const toPath = (face: { px: number; py: number }[]) =>
    face.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.px.toFixed(1)},${p.py.toFixed(1)}`).join(' ') + ' Z'

  // Darken/lighten helpers
  const darken = (hex: string, amt: number) => {
    const num = parseInt(hex.replace('#', ''), 16)
    const r = Math.max(0, (num >> 16) - amt)
    const g = Math.max(0, ((num >> 8) & 0xff) - amt)
    const b = Math.max(0, (num & 0xff) - amt)
    return `rgb(${r},${g},${b})`
  }
  const lighten = (hex: string, amt: number) => {
    const num = parseInt(hex.replace('#', ''), 16)
    const r = Math.min(255, (num >> 16) + amt)
    const g = Math.min(255, ((num >> 8) & 0xff) + amt)
    const b = Math.min(255, (num & 0xff) + amt)
    return `rgb(${r},${g},${b})`
  }

  const topColor = active ? lighten(color, 60) : lighten(color, 30)
  const leftColor = active ? lighten(color, 20) : color
  const rightColor = active ? darken(color, 20) : darken(color, 40)
  const frontColor = active ? lighten(color, 10) : darken(color, 20)

  // Glow rect for hover
  const minX = Math.min(...pts.map(p => p.px))
  const maxX = Math.max(...pts.map(p => p.px))
  const minY = Math.min(...pts.map(p => p.py))
  const maxY = Math.max(...pts.map(p => p.py))

  return (
    <g
      style={{ cursor: 'pointer' }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
    >
      {active && (
        <rect
          x={minX - 4} y={minY - 4}
          width={maxX - minX + 8} height={maxY - minY + 8}
          rx={4} fill="none"
          stroke={color} strokeWidth={2}
          opacity={0.6}
        />
      )}
      <path d={toPath(leftFace)} fill={leftColor} stroke="#fff" strokeWidth={0.5} opacity={0.95} />
      <path d={toPath(rightFace)} fill={rightColor} stroke="#fff" strokeWidth={0.5} opacity={0.95} />
      <path d={toPath(frontFace)} fill={frontColor} stroke="#fff" strokeWidth={0.5} opacity={0.95} />
      <path d={toPath(topFace)} fill={topColor} stroke="#fff" strokeWidth={0.5} opacity={0.95} />
      {/* Windows pattern on front face */}
      {edificio.pisos > 4 && Array.from({ length: Math.min(edificio.pisos, 8) }).map((_, i) => {
        const fy = frontFace[0].py + ((frontFace[3].py - frontFace[0].py) * (i + 0.5)) / Math.min(edificio.pisos, 8)
        const fx1 = frontFace[0].px + (frontFace[1].px - frontFace[0].px) * 0.2
        const fx2 = frontFace[0].px + (frontFace[1].px - frontFace[0].px) * 0.5
        const fx3 = frontFace[0].px + (frontFace[1].px - frontFace[0].px) * 0.8
        return (
          <g key={i}>
            <rect x={fx1 - 2} y={fy - 2} width={4} height={4} fill="rgba(255,255,200,0.7)" rx={0.5} />
            <rect x={fx2 - 2} y={fy - 2} width={4} height={4} fill="rgba(255,255,200,0.7)" rx={0.5} />
            <rect x={fx3 - 2} y={fy - 2} width={4} height={4} fill="rgba(255,255,200,0.7)" rx={0.5} />
          </g>
        )
      })}
      {/* Label on top */}
      {active && (
        <text
          x={(pts[4].px + pts[6].px) / 2}
          y={(pts[4].py + pts[6].py) / 2 - 8}
          textAnchor="middle"
          fontSize={10}
          fontWeight="bold"
          fill="#fff"
          stroke="#000"
          strokeWidth={2}
          paintOrder="stroke"
        >
          {edificio.disponibles} disp.
        </text>
      )}
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
      <div className="flex flex-wrap gap-2 mb-4 px-2">
        {zonas.map(zona => {
          const ed = edificios.find(e => e.zona === zona)!
          return (
            <button
              key={zona}
              onClick={() => {
                const found = edificios.find(e => e.zona === zona)
                if (found) setSelectedId(prev => prev === found.id ? null : found.id)
              }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all hover:scale-105"
              style={{
                borderColor: ed.color,
                color: ed.color,
                backgroundColor: `${ed.color}15`
              }}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ed.color }} />
              {zona}
            </button>
          )
        })}
      </div>

      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl overflow-hidden border border-slate-700">
        {/* Ground grid */}
        <svg
          viewBox="0 0 800 520"
          className="w-full"
          style={{ minHeight: 340 }}
        >
          {/* Ground plane */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(-30) skewX(30)">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
            </pattern>
            <radialGradient id="groundGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </radialGradient>
          </defs>

          {/* Ground */}
          <ellipse cx="400" cy="370" rx="380" ry="120" fill="url(#groundGrad)" />
          <ellipse cx="400" cy="370" rx="380" ry="120" fill="url(#grid)" />

          {/* Roads (simple lines in iso space) */}
          {[
            { x1: 50, y1: 180, x2: 700, y2: 180 },
            { x1: 50, y1: 280, x2: 700, y2: 280 },
            { x1: 300, y1: 50, x2: 300, y2: 400 },
            { x1: 500, y1: 50, x2: 500, y2: 400 },
          ].map((road, i) => {
            const p1 = toIso(road.x1, road.y1)
            const p2 = toIso(road.x2, road.y2)
            return (
              <line
                key={i}
                x1={p1.sx + 400} y1={p1.sy + 350}
                x2={p2.sx + 400} y2={p2.sy + 350}
                stroke="rgba(255,255,255,0.06)" strokeWidth={6}
              />
            )
          })}

          {/* Trees (simple dots) */}
          {[
            [180, 150], [340, 130], [480, 150], [620, 120],
            [150, 250], [400, 260], [650, 240],
            [220, 350], [460, 360], [580, 340]
          ].map(([tx, ty], i) => {
            const iso = toIso(tx, ty)
            return (
              <g key={i}>
                <line
                  x1={iso.sx + 400} y1={iso.sy + 350}
                  x2={iso.sx + 400} y2={iso.sy + 335}
                  stroke="#4a7c59" strokeWidth={1.5}
                />
                <circle cx={iso.sx + 400} cy={iso.sy + 330} r={6} fill="#2d5a3d" opacity={0.8} />
                <circle cx={iso.sx + 400} cy={iso.sy + 325} r={4} fill="#3d7a4d" opacity={0.9} />
              </g>
            )
          })}

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
          <g transform="translate(740, 60)">
            <circle cx={0} cy={0} r={18} fill="rgba(0,0,0,0.5)" stroke="rgba(255,255,255,0.2)" />
            <text x={0} y={-6} textAnchor="middle" fontSize={8} fill="white" fontWeight="bold">N</text>
            <polygon points="0,-14 3,-4 0,-8 -3,-4" fill="white" />
            <polygon points="0,14 3,4 0,8 -3,4" fill="rgba(255,255,255,0.4)" />
          </g>

          {/* Title */}
          <text x={20} y={30} fontSize={14} fontWeight="bold" fill="white" opacity={0.9}>
            León, Guanajuato
          </text>
          <text x={20} y={46} fontSize={10} fill="rgba(255,255,255,0.5)">
            Mapa de Desarrollos · Haz clic en un edificio
          </text>
        </svg>

        {/* Info panel */}
        {activeEdificio && (
          <div className="absolute top-4 right-4 w-64">
            <Card className="bg-slate-900/95 border-slate-600 backdrop-blur-sm shadow-2xl">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                    style={{ backgroundColor: activeEdificio.color }}
                  />
                  {selectedId === activeEdificio.id && (
                    <button
                      onClick={() => setSelectedId(null)}
                      className="text-slate-400 hover:text-white ml-auto"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <h3 className="font-bold text-white text-sm mb-1 leading-tight">
                  {activeEdificio.nombre}
                </h3>
                <div className="flex items-center gap-1 text-slate-400 text-xs mb-3">
                  <MapPin className="h-3 w-3" />
                  {activeEdificio.zona}
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Tipo</span>
                    <span className="text-white font-medium">{activeEdificio.tipo}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Pisos</span>
                    <span className="text-white font-medium">{activeEdificio.pisos}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Desde</span>
                    <span className="font-bold" style={{ color: activeEdificio.color }}>
                      {activeEdificio.precioDesde}
                    </span>
                  </div>
                </div>

                {/* Availability bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Disponibilidad</span>
                    <span className="text-white font-bold">
                      {activeEdificio.disponibles}/{activeEdificio.total}
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${(activeEdificio.disponibles / activeEdificio.total) * 100}%`,
                        backgroundColor: activeEdificio.color
                      }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {Math.round((activeEdificio.disponibles / activeEdificio.total) * 100)}% disponible
                  </p>
                </div>

                <Badge
                  className="text-xs w-full justify-center py-1"
                  style={{
                    backgroundColor: `${activeEdificio.color}20`,
                    color: activeEdificio.color,
                    border: `1px solid ${activeEdificio.color}40`
                  }}
                >
                  <Building2 className="h-3 w-3 mr-1" />
                  {activeEdificio.disponibles} unidades disponibles
                </Badge>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Stats bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-slate-900/80 backdrop-blur-sm border-t border-slate-700 px-4 py-2 flex gap-6 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Building2 className="h-3 w-3 text-arkin-gold" />
            {edificios.length} desarrollos
          </span>
          <span className="flex items-center gap-1">
            <Home className="h-3 w-3 text-green-400" />
            {edificios.reduce((s, e) => s + e.disponibles, 0)} unidades disponibles
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3 text-blue-400" />
            {zonas.length} zonas
          </span>
        </div>
      </div>
    </div>
  )
}
