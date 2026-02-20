"use client"

import { useState, useRef, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Building2, MapPin, Home, X, ChevronRight } from "lucide-react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment, ContactShadows, Edges, Html, Grid } from "@react-three/drei"
import * as THREE from "three"

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

  // Determine building geometry blocks based on height
  const blocks = useMemo(() => {
    const parts = []
    if (h > 6) {
      // Skyscraper: Base, main tower, top
      parts.push({ y: h * 0.1, h: h * 0.2, w: w, d: d })
      parts.push({ y: h * 0.5, h: h * 0.6, w: w * 0.8, d: d * 0.8 })
      parts.push({ y: h * 0.9, h: h * 0.2, w: w * 0.6, d: d * 0.6 })
    } else if (h > 3) {
      // Mid-rise
      parts.push({ y: h * 0.5, h: h, w: w, d: d })
      parts.push({ y: h + 0.25, h: 0.5, w: w * 0.5, d: d * 0.5 })
    } else {
      // Low-rise / houses
      parts.push({ y: h * 0.5, h: h, w: w, d: d })
    }
    return parts
  }, [w, h, d])

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
          opacity={active ? 0.4 : 0.1} 
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <group ref={meshRef}>
        {blocks.map((b, i) => (
          <mesh key={i} position={[0, b.y, 0]} castShadow receiveShadow>
            <boxGeometry args={[b.w, b.h, b.d]} />
            <meshPhysicalMaterial
              color={active ? edificio.color : "#1e293b"}
              metalness={0.8}
              roughness={0.2}
              transmission={0.5}
              thickness={1.5}
              envMapIntensity={2}
              emissive={edificio.color}
              emissiveIntensity={active ? 0.5 : 0.1}
            />
            <Edges
              linewidth={active ? 2 : 1}
              threshold={15}
              color={active ? "#ffffff" : edificio.color}
            />
          </mesh>
        ))}

        {/* Floating Label */}
        {active && (
          <Html position={[0, h + 1, 0]} center zIndexRange={[100, 0]} className="pointer-events-none transition-opacity duration-300">
            <div 
              className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border shadow-[0_0_15px_rgba(0,0,0,0.5)] flex flex-col items-center animate-in fade-in zoom-in duration-200"
              style={{ borderColor: `${edificio.color}80` }}
            >
              <span className="text-xs font-bold text-white whitespace-nowrap">{edificio.nombre}</span>
              <span className="text-[10px] text-slate-300 font-medium">{edificio.disponibles} disp.</span>
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-slate-900/90 border-r border-b" style={{ borderColor: `${edificio.color}80` }} />
            </div>
          </Html>
        )}
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

      <Environment preset="city" />

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

        {/* Info panel overlay */}
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
