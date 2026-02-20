"use client"

import { useState, useRef, useCallback, Suspense } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, ContactShadows, Grid } from "@react-three/drei"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Building2, MapPin, Home, X, ChevronRight } from "lucide-react"
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
  hex: string
  x: number
  z: number
  w: number
  d: number
  h: number
}

const edificios: Edificio[] = [
  { id:1,  nombre:"Torre Arkin Campestre",     zona:"Campestre",     tipo:"Departamentos de Lujo",   disponibles:12, total:48, precioDesde:"$4,200,000", pisos:18, hex:"#eab308", x:100, z:80,  w:55, d:45, h:130 },
  { id:2,  nombre:"Residencial La Valenciana", zona:"La Valenciana", tipo:"Casas Residenciales",     disponibles:8,  total:32, precioDesde:"$3,800,000", pisos:3,  hex:"#10b981", x:230, z:60,  w:75, d:55, h:28  },
  { id:3,  nombre:"Gran Jardín Tower",         zona:"Gran Jardín",   tipo:"Departamentos",           disponibles:24, total:80, precioDesde:"$2,900,000", pisos:22, hex:"#3b82f6", x:380, z:85,  w:50, d:42, h:155 },
  { id:4,  nombre:"Puerta Plata Residencial",  zona:"Puerta Plata",  tipo:"Casas Premium",           disponibles:5,  total:20, precioDesde:"$5,500,000", pisos:2,  hex:"#f97316", x:510, z:65,  w:85, d:65, h:22  },
  { id:5,  nombre:"Mayorazgo Business",        zona:"Mayorazgo",     tipo:"Oficinas",                disponibles:18, total:40, precioDesde:"$3,100,000", pisos:12, hex:"#8b5cf6", x:175, z:195, w:60, d:50, h:95  },
  { id:6,  nombre:"San Isidro Park",           zona:"San Isidro",    tipo:"Departamentos",           disponibles:30, total:60, precioDesde:"$2,500,000", pisos:14, hex:"#ef4444", x:335, z:200, w:55, d:45, h:108 },
  { id:7,  nombre:"El Refugio Towers",         zona:"El Refugio",    tipo:"Penthouse",               disponibles:6,  total:24, precioDesde:"$6,800,000", pisos:20, hex:"#14b8a6", x:465, z:185, w:48, d:40, h:145 },
  { id:8,  nombre:"Cañada Lofts",             zona:"La Cañada",     tipo:"Lofts Modernos",          disponibles:14, total:36, precioDesde:"$1,900,000", pisos:8,  hex:"#f43f5e", x:85,  z:285, w:65, d:48, h:70  },
  { id:9,  nombre:"Centro Histórico Plaza",   zona:"Centro",        tipo:"Locales Comerciales",     disponibles:9,  total:30, precioDesde:"$2,200,000", pisos:5,  hex:"#d946ef", x:270, z:300, w:80, d:60, h:50  },
  { id:10, nombre:"Arkin Select Tower",        zona:"Campestre",     tipo:"Departamentos Premium",   disponibles:3,  total:16, precioDesde:"$8,900,000", pisos:28, hex:"#eab308", x:415, z:290, w:45, d:38, h:185 },
]

const SCALE = 0.045
const OX = 320, OZ = 190

function Skyscraper({ w, h, d, hex, active }: { w:number, h:number, d:number, hex:string, active:boolean }) {
  const color = new THREE.Color(hex)
  const bands = Math.min(16, Math.floor(h / 0.6))
  return (
    <group>
      <mesh position={[0, h * 0.02, 0]} castShadow>
        <boxGeometry args={[w * 1.15, h * 0.04, d * 1.15]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>
      <mesh position={[0, h * 0.04 + (h * 0.92) / 2, 0]} castShadow>
        <boxGeometry args={[w, h * 0.92, d]} />
        <meshPhysicalMaterial color={color} metalness={0.6} roughness={0.15} transparent opacity={0.9} />
      </mesh>
      {Array.from({ length: bands }).map((_, i) => (
        <mesh key={i} position={[0, h * 0.06 + i * 0.6, 0]}>
          <boxGeometry args={[w * 1.04, 0.025, d * 1.04]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.1} />
        </mesh>
      ))}
      <mesh position={[0, h * 0.96 + h * 0.06, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.07, h * 0.12, 8]} />
        <meshStandardMaterial color="#ef4444" emissive={new THREE.Color("#ef4444")} emissiveIntensity={active ? 1.2 : 0.7} />
      </mesh>
    </group>
  )
}

function Villa({ w, h, d, hex, active }: { w:number, h:number, d:number, hex:string, active:boolean }) {
  const color = new THREE.Color(hex)
  return (
    <group>
      <mesh position={[0, 0.04, 0]} receiveShadow>
        <boxGeometry args={[w * 1.2, 0.08, d * 1.2]} />
        <meshStandardMaterial color="#d1d5db" roughness={0.9} />
      </mesh>
      <mesh position={[-w * 0.05, 0.08 + h / 2, -d * 0.05]} castShadow>
        <boxGeometry args={[w * 0.85, h, d * 0.8]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
      <mesh position={[-w * 0.05, 0.08 + h + 0.035, -d * 0.05]}>
        <boxGeometry args={[w * 1.05, 0.07, d * 0.95]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>
      <mesh position={[w * 0.28, 0.09, d * 0.28]}>
        <boxGeometry args={[w * 0.45, 0.1, d * 0.35]} />
        <meshPhysicalMaterial color="#38bdf8" transparent opacity={0.85} roughness={0.05} />
      </mesh>
    </group>
  )
}

function Midrise({ w, h, d, hex, active }: { w:number, h:number, d:number, hex:string, active:boolean }) {
  const color = new THREE.Color(hex)
  const slabs = Math.max(1, Math.floor((h * 0.58) / 0.65))
  return (
    <group>
      <mesh position={[0, (h * 0.18) / 2, 0]} castShadow>
        <boxGeometry args={[w, h * 0.18, d]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>
      <mesh position={[-w * 0.08, h * 0.18 + (h * 0.82) / 2, -d * 0.08]} castShadow>
        <boxGeometry args={[w * 0.78, h * 0.82, d * 0.78]} />
        <meshPhysicalMaterial color={color} metalness={0.5} roughness={0.2} transparent opacity={0.9} />
      </mesh>
      <mesh position={[w * 0.22, h * 0.18 + (h * 0.58) / 2, 0]} castShadow>
        <boxGeometry args={[w * 0.45, h * 0.58, d * 0.88]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.7} />
      </mesh>
      {Array.from({ length: slabs }).map((_, i) => (
        <mesh key={i} position={[w * 0.22, h * 0.18 + i * 0.65, 0]}>
          <boxGeometry args={[w * 0.5, 0.04, d * 0.92]} />
          <meshStandardMaterial color="#94a3b8" />
        </mesh>
      ))}
      <mesh position={[-w * 0.08, h + 0.03, -d * 0.08]}>
        <boxGeometry args={[w * 0.78, 0.06, d * 0.78]} />
        <meshStandardMaterial color="#10b981" roughness={0.9} />
      </mesh>
    </group>
  )
}

function GlowRing({ hex, w, d, active }: { hex:string, w:number, d:number, active:boolean }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((_, delta) => {
    if (!ref.current) return
    const mat = ref.current.material as THREE.MeshBasicMaterial
    const target = active ? 0.45 : 0
    mat.opacity += (target - mat.opacity) * 0.12
  })
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
      <planeGeometry args={[w * 3, d * 3]} />
      <meshBasicMaterial color={new THREE.Color(hex)} transparent opacity={0} depthWrite={false} side={THREE.DoubleSide} />
    </mesh>
  )
}

function Building({ ed, active, onHover, onClick }: {
  ed: Edificio
  active: boolean
  onHover: (id: number | null) => void
  onClick: (id: number) => void
}) {
  const groupRef = useRef<THREE.Group>(null)
  const w = ed.w * SCALE, h = ed.h * SCALE, d = ed.d * SCALE
  const px = (ed.x - OX) * SCALE, pz = (ed.z - OZ) * SCALE

  useFrame(() => {
    if (!groupRef.current) return
    const targetY = active ? 0.35 : 0
    groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.1
  })

  return (
    <group
      ref={groupRef}
      position={[px + w / 2, 0, pz + d / 2]}
      onPointerEnter={(e) => { e.stopPropagation(); onHover(ed.id) }}
      onPointerLeave={() => onHover(null)}
      onClick={(e) => { e.stopPropagation(); onClick(ed.id) }}
    >
      <GlowRing hex={ed.hex} w={w} d={d} active={active} />
      {ed.pisos >= 15
        ? <Skyscraper w={w} h={h} d={d} hex={ed.hex} active={active} />
        : ed.pisos <= 3
        ? <Villa w={w} h={h} d={d} hex={ed.hex} active={active} />
        : <Midrise w={w} h={h} d={d} hex={ed.hex} active={active} />
      }
    </group>
  )
}

function Scene({ hoveredId, selectedId, onHover, onSelect }: {
  hoveredId: number | null
  selectedId: number | null
  onHover: (id: number | null) => void
  onSelect: (id: number) => void
}) {
  return (
    <>
      <color attach="background" args={["#080b14"]} />
      <fog attach="fog" args={["#080b14", 22, 58]} />

      <ambientLight intensity={1.5} color="#334155" />
      <directionalLight
        position={[12, 22, 12]}
        intensity={2.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={80}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
        shadow-bias={-0.001}
      />
      <pointLight position={[-12, 8, -12]} intensity={2} distance={30} color="#3b82f6" />
      <pointLight position={[12, 5, 12]} intensity={1.5} distance={25} color="#eab308" />

      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#0a0f1e" roughness={1} />
      </mesh>
      <Grid
        args={[60, 60]}
        position={[0, 0.01, 0]}
        cellColor="#1e293b"
        sectionColor="#1e293b"
        fadeDistance={50}
        infiniteGrid={false}
      />
      <ContactShadows position={[0, 0.02, 0]} opacity={0.6} scale={50} blur={2} far={10} />

      {edificios.map(ed => (
        <Building
          key={ed.id}
          ed={ed}
          active={ed.id === hoveredId || ed.id === selectedId}
          onHover={onHover}
          onClick={onSelect}
        />
      ))}

      <OrbitControls
        enableDamping
        dampingFactor={0.06}
        minPolarAngle={Math.PI / 8}
        maxPolarAngle={Math.PI / 2.15}
        minDistance={8}
        maxDistance={45}
        autoRotate={hoveredId === null && selectedId === null}
        autoRotateSpeed={0.5}
      />
    </>
  )
}

export function Leon3DMap() {
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const activeEdificio = selectedId
    ? edificios.find(e => e.id === selectedId) ?? null
    : hoveredId
    ? edificios.find(e => e.id === hoveredId) ?? null
    : null

  const zonas = [...new Set(edificios.map(e => e.zona))]

  const handleSelect = useCallback((id: number) => {
    setSelectedId(prev => prev === id ? null : id)
  }, [])

  const handleZonaClick = useCallback((zona: string) => {
    const found = edificios.find(e => e.zona === zona)
    if (!found) return
    setSelectedId(prev => prev === found.id ? null : found.id)
  }, [])

  return (
    <div className="relative w-full">
      <div className="flex flex-wrap gap-2 mb-6 px-2">
        {zonas.map(zona => {
          const ed = edificios.find(e => e.zona === zona)!
          const isActive = selectedId === ed.id
          return (
            <button
              key={zona}
              onClick={() => handleZonaClick(zona)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all hover:scale-105"
              style={{
                borderColor: isActive ? `${ed.hex}cc` : `${ed.hex}50`,
                color: "#fff",
                backgroundColor: isActive ? `${ed.hex}35` : `${ed.hex}18`,
                boxShadow: isActive ? `0 0 14px ${ed.hex}55` : `0 0 8px ${ed.hex}18`,
              }}
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ed.hex, boxShadow: `0 0 5px ${ed.hex}` }} />
              {zona}
            </button>
          )
        })}
      </div>

      <div className="relative bg-[#080b14] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl h-[500px] lg:h-[600px]">
        <Canvas
          shadows
          camera={{ position: [0, 18, 28], fov: 45 }}
          gl={{ antialias: true, alpha: false }}
          onPointerMissed={() => setSelectedId(null)}
        >
          <Suspense fallback={null}>
            <Scene
              hoveredId={hoveredId}
              selectedId={selectedId}
              onHover={setHoveredId}
              onSelect={handleSelect}
            />
          </Suspense>
        </Canvas>

        <div className="absolute top-4 left-4 pointer-events-none z-10">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-900/80 border border-slate-700 backdrop-blur-md text-slate-300">
            <MapPin className="w-3 h-3" />
            Arrastra para rotar · Scroll para zoom
          </div>
        </div>

        {activeEdificio && (
          <div className="absolute top-6 right-6 w-72 z-10 transition-all duration-300 animate-in fade-in slide-in-from-right-4">
            <Card className="bg-[#0f172a]/92 backdrop-blur-md border border-slate-700/50 shadow-2xl overflow-hidden">
              <div className="h-1 w-full" style={{ backgroundColor: activeEdificio.hex }} />
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <Badge variant="outline" className="mb-2 text-[10px] uppercase tracking-wider font-semibold border-slate-600 bg-slate-800/50 text-slate-300">
                      {activeEdificio.zona}
                    </Badge>
                    <h3 className="font-bold text-white text-lg leading-tight">{activeEdificio.nombre}</h3>
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

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/50">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-1">Tipo</p>
                    <p className="text-xs text-white font-medium leading-tight">{activeEdificio.tipo}</p>
                  </div>
                  <div className="bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/50">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-1">Pisos</p>
                    <p className="text-sm text-white font-medium">{activeEdificio.pisos} niveles</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-slate-400 mb-1">Inversión desde</p>
                  <p className="text-2xl font-bold" style={{ color: activeEdificio.hex }}>{activeEdificio.precioDesde}</p>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-300 font-medium">Disponibilidad</span>
                    <span className="text-white font-bold">{activeEdificio.disponibles} / {activeEdificio.total}</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${(activeEdificio.disponibles / activeEdificio.total) * 100}%`, backgroundColor: activeEdificio.hex }}
                    />
                  </div>
                </div>

                <button
                  className="w-full py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:brightness-110"
                  style={{ backgroundColor: `${activeEdificio.hex}22`, color: activeEdificio.hex, border: `1px solid ${activeEdificio.hex}55` }}
                >
                  Ver Unidades <ChevronRight className="h-4 w-4" />
                </button>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-md border-t border-slate-800 px-6 py-3 flex flex-wrap gap-8 text-xs text-slate-300 z-10 pointer-events-none">
          <span className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-yellow-400" />
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
