"use client"

import { useState, useRef, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Building2, MapPin, Home, X, ChevronRight } from "lucide-react"
import { Canvas, useFrame, type ThreeElements } from "@react-three/fiber"
import { OrbitControls, ContactShadows, Edges, Grid, Cylinder, Cone, Box } from "@react-three/drei"
import * as THREE from "three"

// Fix for React 19 / R3F IntrinsicElements typing
declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}

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
  { id: 2, nombre: "Residencial La Valenciana", zona: "La Valenciana", tipo: "Casas Residenciales", disponibles: 8, total: 32, precioDesde: "$3,800,000", pisos: 3, color: "#10b981", x: 260, y: 60, width: 80, depth: 60, height: 30 },
  { id: 3, nombre: "Gran Jardín Tower", zona: "Gran Jardín", tipo: "Departamentos", disponibles: 24, total: 80, precioDesde: "$2,900,000", pisos: 22, color: "#3b82f6", x: 420, y: 90, width: 55, depth: 45, height: 165 },
  { id: 4, nombre: "Puerta Plata Residencial", zona: "Puerta Plata", tipo: "Casas Premium", disponibles: 5, total: 20, precioDesde: "$5,500,000", pisos: 2, color: "#f97316", x: 560, y: 70, width: 90, depth: 70, height: 25 },
  { id: 5, nombre: "Mayorazgo Business", zona: "Mayorazgo", tipo: "Oficinas", disponibles: 18, total: 40, precioDesde: "$3,100,000", pisos: 12, color: "#8b5cf6", x: 200, y: 200, width: 65, depth: 55, height: 100 },
  { id: 6, nombre: "San Isidro Park", zona: "San Isidro", tipo: "Departamentos", disponibles: 30, total: 60, precioDesde: "$2,500,000", pisos: 14, color: "#ef4444", x: 370, y: 210, width: 58, depth: 48, height: 115 },
  { id: 7, nombre: "El Refugio Towers", zona: "El Refugio", tipo: "Penthouse", disponibles: 6, total: 24, precioDesde: "$6,800,000", pisos: 20, color: "#14b8a6", x: 510, y: 190, width: 52, depth: 42, height: 155 },
  { id: 8, nombre: "Cañada Lofts", zona: "La Cañada", tipo: "Lofts Modernos", disponibles: 14, total: 36, precioDesde: "$1,900,000", pisos: 8, color: "#f43f5e", x: 100, y: 290, width: 70, depth: 50, height: 75 },
  { id: 9, nombre: "Centro Histórico Plaza", zona: "Centro", tipo: "Locales Comerciales", disponibles: 9, total: 30, precioDesde: "$2,200,000", pisos: 5, color: "#d946ef", x: 300, y: 310, width: 85, depth: 65, height: 55 },
  { id: 10, nombre: "Arkin Select Tower", zona: "Campestre", tipo: "Departamentos Premium", disponibles: 3, total: 16, precioDesde: "$8,900,000", pisos: 28, color: "#eab308", x: 450, y: 300, width: 48, depth: 40, height: 200 }
]

function Tree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <Cylinder args={[0.05, 0.05, 0.4, 8]} position={[0, 0.2, 0]} castShadow>
        <meshStandardMaterial color="#452c1e" />
      </Cylinder>
      <Cone args={[0.3, 0.6, 8]} position={[0, 0.6, 0]} castShadow>
        <meshStandardMaterial color="#059669" roughness={0.9} />
      </Cone>
    </group>
  )
}

function BuildingModel({ 
  h, w, d, pisos, color, active 
}: { 
  h: number, w: number, d: number, pisos: number, color: string, active: boolean 
}) {
  if (pisos >= 15) {
    // Skyscraper: Glass tower with structural framing
    return (
      <group>
        {/* Podium */}
        <Box args={[w * 1.2, h * 0.05, d * 1.2]} position={[0, h * 0.025, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#0f172a" />
        </Box>
        {/* Inner Core */}
        <Box args={[w * 0.4, h * 0.95, d * 0.4]} position={[0, h * 0.05 + (h * 0.95)/2, 0]}>
          <meshStandardMaterial color={active ? color : "#334155"} emissive={active ? color : "#000000"} emissiveIntensity={active ? 0.5 : 0} />
        </Box>
        {/* Main Tower Glass */}
        <Box args={[w, h * 0.9, d]} position={[0, h * 0.05 + (h * 0.9)/2, 0]} castShadow>
          <meshPhysicalMaterial color={active ? color : "#e0f2fe"} transmission={0.9} roughness={0.1} metalness={0.8} />
          <Edges linewidth={1} color={active ? "#ffffff" : "#38bdf8"} opacity={0.3} transparent />
        </Box>
        {/* Horizontal Louvers */}
        {Array.from({ length: Math.min(20, Math.floor(h / 0.5)) }).map((_, i) => (
          <Box key={i} args={[w * 1.05, 0.02, d * 1.05]} position={[0, h * 0.1 + i * 0.5, 0]}>
            <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.8} />
          </Box>
        ))}
        {/* Roof Helipad / Spire */}
        <Cylinder args={[w*0.3, w*0.3, 0.1, 16]} position={[0, h * 0.95 + 0.05, 0]} castShadow>
          <meshStandardMaterial color="#64748b" />
        </Cylinder>
        <Cylinder args={[0.02, 0.05, h*0.15, 8]} position={[w*0.3, h + (h*0.15)/2, -d*0.3]} castShadow>
          <meshStandardMaterial color="#ef4444" />
        </Cylinder>
      </group>
    )
  } else if (pisos <= 3) {
    // House / Residential Villa
    return (
      <group>
        {/* Platform */}
        <Box args={[w*1.2, 0.1, d*1.2]} position={[0, 0.05, 0]} receiveShadow>
          <meshStandardMaterial color="#e2e8f0" />
        </Box>
        {/* Pool */}
        <Box args={[w*0.5, 0.11, d*0.4]} position={[w*0.25, 0.05, d*0.3]}>
          <meshPhysicalMaterial color="#38bdf8" transmission={0.9} roughness={0.1} />
        </Box>
        {/* Ground Floor Glass */}
        <Box args={[w*0.7, h*0.4, d*0.7]} position={[-w*0.1, 0.1 + (h*0.4)/2, -d*0.1]} castShadow>
          <meshPhysicalMaterial color="#e0f2fe" transmission={0.7} roughness={0.1} />
        </Box>
        {/* Stone Wall */}
        <Box args={[0.2, h*0.9, d*0.8]} position={[-w*0.4, 0.1 + (h*0.9)/2, -d*0.1]} castShadow>
          <meshStandardMaterial color="#475569" roughness={0.9} />
        </Box>
        {/* Second Floor Cantilever */}
        <Box args={[w*0.9, h*0.5, d*0.6]} position={[w*0.05, 0.1 + h*0.4 + (h*0.5)/2, -d*0.15]} castShadow>
          <meshStandardMaterial color={active ? color : "#f8fafc"} roughness={0.3} emissive={active ? color : "#000000"} emissiveIntensity={active ? 0.2 : 0} />
        </Box>
        {/* Wood Slats */}
        {Array.from({length: 6}).map((_, i) => (
          <Box key={i} args={[0.05, h*0.5, 0.05]} position={[w*0.45, 0.1 + h*0.4 + (h*0.5)/2, -d*0.25 + i*0.1]}>
            <meshStandardMaterial color="#b45309" roughness={0.7} />
          </Box>
        ))}
        <Tree position={[w*0.4, 0, -d*0.4]} />
        <Tree position={[-w*0.4, 0, d*0.4]} />
      </group>
    )
  } else {
    // Mid-rise / Office
    return (
      <group>
        {/* Base Commercial */}
        <Box args={[w, h*0.2, d]} position={[0, (h*0.2)/2, 0]} castShadow>
          <meshStandardMaterial color="#1e293b" />
        </Box>
        {/* Main Glass Body */}
        <Box args={[w*0.8, h*0.8, d*0.8]} position={[-w*0.1, h*0.2 + (h*0.8)/2, -d*0.1]} castShadow>
          <meshPhysicalMaterial color={active ? color : "#bae6fd"} transmission={0.7} roughness={0.2} metalness={0.5} />
        </Box>
        {/* Secondary Solid Volume */}
        <Box args={[w*0.5, h*0.6, d*0.9]} position={[w*0.25, h*0.2 + (h*0.6)/2, 0]} castShadow>
          <meshStandardMaterial color={active ? color : "#f1f5f9"} roughness={0.8} emissive={active ? color : "#000000"} emissiveIntensity={active ? 0.2 : 0} />
          <Edges linewidth={1} color="#cbd5e1" />
        </Box>
        {/* Balconies */}
        {Array.from({ length: Math.max(1, Math.floor(h*0.6 / 0.6)) }).map((_, i) => (
          <Box key={i} args={[w*0.55, 0.05, d*0.95]} position={[w*0.25, h*0.2 + i*0.6, 0]}>
            <meshStandardMaterial color="#94a3b8" />
          </Box>
        ))}
        {/* Green Roof */}
        <Box args={[w*0.8, 0.05, d*0.8]} position={[-w*0.1, h, -d*0.1]}>
          <meshStandardMaterial color="#10b981" />
        </Box>
        <Tree position={[w*0.5, 0, -d*0.5]} />
      </group>
    )
  }
}

function BuildingMesh({
  edificio,
  isHovered,
  isSelected,
  onClick,
  onPointerOver,
  onPointerOut
}: {
  edificio: Edificio
  isHovered: boolean
  isSelected: boolean
  onClick: () => void
  onPointerOver: () => void
  onPointerOut: () => void
}) {
  const meshRef = useRef<THREE.Group>(null)
  
  // Transform SVG coordinates to 3D space
  const scale = 0.05
  const w = edificio.width * scale
  const d = edificio.depth * scale
  const h = edificio.height * scale
  const px = (edificio.x - 400) * scale
  const pz = (edificio.y - 260) * scale

  const active = isHovered || isSelected

  // Animate hover effect
  useFrame((state) => {
    if (meshRef.current) {
      const targetY = active ? 0.5 : 0
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.1)
    }
  })

  return (
    <group 
      position={[px + w/2, 0, pz + d/2]}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onPointerOver={(e) => { e.stopPropagation(); onPointerOver(); }}
      onPointerOut={(e) => { e.stopPropagation(); onPointerOut(); }}
    >
      {/* Ground Glow indicator */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[w * 1.5, d * 1.5]} />
        <meshBasicMaterial 
          color={edificio.color} 
          transparent 
          opacity={active ? 0.4 : 0.0} 
          depthWrite={false}
        />
      </mesh>

      <group ref={meshRef}>
        <BuildingModel h={h} w={w} d={d} pisos={edificio.pisos} color={edificio.color} active={active} />
      </group>
    </group>
  )
}

function Scene({ 
  hoveredId, 
  selectedId, 
  setHoveredId, 
  setSelectedId 
}: { 
  hoveredId: number | null, 
  selectedId: number | null,
  setHoveredId: (id: number | null) => void,
  setSelectedId: (id: number | null) => void
}) {
  return (
    <>
      <color attach="background" args={["#080b14"]} />
      <fog attach="fog" args={["#080b14", 15, 45]} />
      
      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[10, 20, 10]} 
        intensity={1.5} 
        castShadow 
        shadow-mapSize={[2048, 2048]}
      />
      <pointLight position={[-10, 10, -10]} intensity={1} color="#3b82f6" />
      <pointLight position={[10, 5, 10]} intensity={0.5} color="#eab308" />

      {/* Grid Floor */}
      <Grid 
        args={[100, 100]} 
        cellSize={1} 
        cellThickness={0.5} 
        cellColor="#1e293b" 
        sectionSize={5} 
        sectionThickness={1} 
        sectionColor="#334155" 
        fadeDistance={30} 
        fadeStrength={1.5} 
      />

      <ContactShadows 
        position={[0, 0, 0]} 
        opacity={0.5} 
        scale={40} 
        blur={2} 
        far={10} 
        resolution={1024} 
        color="#000000"
      />

      {/* Map center indicator */}
      <mesh position={[0, 0.1, 0]} rotation={[-Math.PI/2, 0, 0]}>
        <ringGeometry args={[12, 12.1, 64]} />
        <meshBasicMaterial color="#334155" transparent opacity={0.5} />
      </mesh>

      <group position={[0, 0, 0]}>
        {edificios.map(ed => (
          <BuildingMesh
            key={ed.id}
            edificio={ed}
            isHovered={hoveredId === ed.id}
            isSelected={selectedId === ed.id}
            onClick={() => setSelectedId(selectedId === ed.id ? null : ed.id)}
            onPointerOver={() => setHoveredId(ed.id)}
            onPointerOut={() => setHoveredId(null)}
          />
        ))}
      </group>

      <OrbitControls 
        makeDefault 
        minPolarAngle={Math.PI / 6} 
        maxPolarAngle={Math.PI / 2.1} 
        minDistance={10} 
        maxDistance={40} 
        autoRotate={!hoveredId && !selectedId}
        autoRotateSpeed={0.5}
        enablePan={true}
        enableZoom={true}
        enableDamping
        dampingFactor={0.05}
      />
    </>
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

      <div className="relative bg-[#080b14] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl h-[500px] lg:h-[600px] cursor-grab active:cursor-grabbing">
        
        {/* React Three Fiber Canvas */}
        <Canvas 
          shadows 
          camera={{ position: [0, 15, 25], fov: 45 }}
          gl={{ antialias: true, alpha: false }}
        >
          <Scene 
            hoveredId={hoveredId} 
            selectedId={selectedId} 
            setHoveredId={setHoveredId}
            setSelectedId={setSelectedId}
          />
        </Canvas>

        {/* UI Overlay: Instructions */}
        <div className="absolute top-4 left-4 pointer-events-none">
          <Badge variant="outline" className="bg-slate-900/80 text-slate-300 border-slate-700 backdrop-blur-md font-normal">
            <MapPin className="w-3 h-3 mr-1" />
            Arrastra para rotar · Scroll para zoom
          </Badge>
        </div>

        {/* Info panel overlay - MOVED OUTSIDE CANVAS */}
        {activeEdificio && (
          <div className="absolute top-6 right-6 w-72 transition-all duration-300 animate-in fade-in slide-in-from-right-4 z-10">
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
        <div className="absolute bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-md border-t border-slate-800 px-6 py-3 flex flex-wrap gap-8 text-xs text-slate-300 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] z-10 pointer-events-none">
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
