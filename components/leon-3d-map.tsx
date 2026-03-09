"use client"

import { useRef, useState, Suspense, useEffect, Component, ReactNode, useCallback } from "react"
import { Canvas, useLoader, useFrame } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { MapPin, X, ChevronRight, Building2, Home } from "lucide-react"
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"

class OBJErrorBoundary extends Component<{ children: ReactNode }, { error: string | null }> {
  state = { error: null }
  static getDerivedStateFromError(e: Error) { return { error: e.message } }
  render() {
    if (this.state.error) {
      return (
        <mesh position={[0, 1, 0]}>
          <boxGeometry args={[3, 2, 3]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
      )
    }
    return this.props.children
  }
}

// León, Gto centro: 21.1236, -101.6824
const MAP_CENTER_LAT = 21.1236
const MAP_CENTER_LNG = -101.6824
const MAP_ZOOM = 14
const TILE_SIZE = 256

function latLngToTile(lat: number, lng: number, zoom: number) {
  const n = Math.pow(2, zoom)
  const x = Math.floor((lng + 180) / 360 * n)
  const latRad = lat * Math.PI / 180
  const y = Math.floor((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * n)
  return { x, y }
}

async function buildMapTexture(): Promise<THREE.CanvasTexture> {
  const GRID = 4
  const canvas = document.createElement('canvas')
  canvas.width = TILE_SIZE * GRID
  canvas.height = TILE_SIZE * GRID
  const ctx = canvas.getContext('2d')!

  ctx.fillStyle = '#c8d8c8'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const center = latLngToTile(MAP_CENTER_LAT, MAP_CENTER_LNG, MAP_ZOOM)
  const offset = Math.floor(GRID / 2)

  const loads: Promise<void>[] = []
  for (let dy = 0; dy < GRID; dy++) {
    for (let dx = 0; dx < GRID; dx++) {
      const tx = center.x - offset + dx
      const ty = center.y - offset + dy
      const url = `https://tile.openstreetmap.org/${MAP_ZOOM}/${tx}/${ty}.png`
      loads.push(
        new Promise<void>((resolve) => {
          const img = new Image()
          img.crossOrigin = 'anonymous'
          img.onload = () => {
            ctx.drawImage(img, dx * TILE_SIZE, dy * TILE_SIZE, TILE_SIZE, TILE_SIZE)
            resolve()
          }
          img.onerror = () => resolve()
          img.src = url
        })
      )
    }
  }

  await Promise.all(loads)

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

function MapPlane() {
  const [mapTexture, setMapTexture] = useState<THREE.CanvasTexture | null>(null)
  const [fallback, setFallback] = useState(false)

  useEffect(() => {
    buildMapTexture()
      .then(tex => setMapTexture(tex))
      .catch(() => setFallback(true))
  }, [])

  if (!mapTexture && !fallback) {
    return (
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#2d4a2d" roughness={1} />
      </mesh>
    )
  }

  return (
    <group>
      {/* Plano base con textura OSM */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial
          map={mapTexture ?? undefined}
          color={fallback ? '#3a5a3a' : '#ffffff'}
          roughness={0.95}
          metalness={0}
        />
      </mesh>

      {/* Avenidas principales — solo 6 meshes en lugar de 22 */}
      {[-4, 0, 4].map((pos, i) => (
        <mesh key={`av${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[pos, 0.005, 0]}>
          <planeGeometry args={[0.18, 30]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.22} />
        </mesh>
      ))}
      {[-4, 0, 4].map((pos, i) => (
        <mesh key={`ah${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, pos]}>
          <planeGeometry args={[30, 0.18]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.22} />
        </mesh>
      ))}

      {/* Parques / zonas verdes */}
      {[
        { x: -8, z: -7, w: 4.5, d: 3.5 },
        { x:  7, z:  6, w: 3,   d: 4   },
        { x: -5, z:  8, w: 2.5, d: 2.5 },
      ].map((p, i) => (
        <mesh key={`park${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[p.x, 0.004, p.z]}>
          <planeGeometry args={[p.w, p.d]} />
          <meshStandardMaterial color="#4a8c4a" roughness={0.95} transparent opacity={0.65} />
        </mesh>
      ))}

      {/* Bloques de manzanas (edificios genéricos de fondo) */}
      {[
        { x:-10, z:-10, w:2.5, d:2.5, h:0.12 }, { x:-6,  z:-10, w:3,   d:2,   h:0.08 },
        { x: 2,  z:-10, w:2,   d:2.5, h:0.14 }, { x: 8,  z:-10, w:3.5, d:2,   h:0.09 },
        { x:-10, z: -4, w:2,   d:3,   h:0.11 }, { x: 9,  z: -4, w:2.5, d:2.5, h:0.13 },
        { x:-10, z:  4, w:3,   d:2,   h:0.10 }, { x: 8,  z:  4, w:2,   d:3,   h:0.12 },
        { x:-10, z: 10, w:2.5, d:2.5, h:0.09 }, { x:-4,  z: 10, w:2,   d:2,   h:0.11 },
        { x: 3,  z: 10, w:3,   d:2.5, h:0.10 }, { x: 9,  z: 10, w:2,   d:2,   h:0.08 },
      ].map((b, i) => (
        <mesh key={`block${i}`} position={[b.x, b.h / 2, b.z]}>
          <boxGeometry args={[b.w, b.h, b.d]} />
          <meshStandardMaterial color="#b0a898" roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}


const GLB_URLS = [
  'https://qhyuoiyamcxxjsznbiyt.supabase.co/storage/v1/object/public/arkin/edificio+3d+modelo%20(1).glb',
  'https://qhyuoiyamcxxjsznbiyt.supabase.co/storage/v1/object/public/arkin/high-rise+building+3d+model.glb',
  'https://qhyuoiyamcxxjsznbiyt.supabase.co/storage/v1/object/public/arkin/modern+apartment+building+3d+model.glb',
]

type UnitStatus = 'disponible' | 'vendido' | 'reservado'

interface ProyectoData {
  nombre: string
  zona: string
  tipo: string
  disponibles: number
  total: number
  precioDesde: string
  pisos: number
  entrega: string
  unidades: UnitStatus[][]
  position: [number, number, number]
  modelIndex: number
}


const PROYECTOS: ProyectoData[] = [
  {
    nombre: "Residencial del Parque",
    zona: "La Gran Jardín, León Gto.",
    tipo: "Edificio Residencial",
    disponibles: 18,
    total: 36,
    precioDesde: "$3,500,000",
    pisos: 12,
    entrega: "Q2 2027",
    unidades: [
      ['vendido','vendido','vendido'],
      ['vendido','vendido','reservado'],
      ['vendido','reservado','disponible'],
      ['reservado','disponible','disponible'],
      ['disponible','disponible','disponible'],
      ['disponible','disponible','disponible'],
    ],
    position: [8, 0, -7],
    modelIndex: 0,
  },
  {
    nombre: "Sky Tower León",
    zona: "Lomas del Campestre, León Gto.",
    tipo: "Torre de Oficinas y Vivienda",
    disponibles: 24,
    total: 60,
    precioDesde: "$5,800,000",
    pisos: 22,
    entrega: "Q1 2027",
    unidades: [
      ['vendido','vendido','vendido','vendido'],
      ['vendido','vendido','reservado','reservado'],
      ['vendido','reservado','disponible','disponible'],
      ['reservado','disponible','disponible','disponible'],
      ['disponible','disponible','disponible','disponible'],
      ['disponible','disponible','disponible','disponible'],
      ['disponible','disponible','disponible','disponible'],
    ],
    position: [9, 0, 8],
    modelIndex: 1,
  },
  {
    nombre: "Bosque Residencial",
    zona: "El Refugio, León Gto.",
    tipo: "Apartamentos Modernos",
    disponibles: 15,
    total: 40,
    precioDesde: "$2,900,000",
    pisos: 10,
    entrega: "Q3 2026",
    unidades: [
      ['vendido','vendido','vendido'],
      ['vendido','reservado','reservado'],
      ['reservado','disponible','disponible'],
      ['disponible','disponible','disponible'],
      ['disponible','disponible','disponible'],
    ],
    position: [-8, 0, 9],
    modelIndex: 2,
  },
]


function GLBBuilding({ url, position, onHover, onClick, active }: {
  url: string
  position: [number, number, number]
  onHover: (v: boolean) => void
  onClick: () => void
  active: boolean
}) {
  const gltf = useLoader(GLTFLoader, url)
  const groupRef = useRef<THREE.Group>(null)
  const sceneClone = useRef<THREE.Group | null>(null)

  if (!sceneClone.current) {
    sceneClone.current = gltf.scene.clone(true)
    const scene = sceneClone.current

    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh
        mesh.castShadow = false
        mesh.receiveShadow = false
        if (mesh.material) {
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
          mats.forEach(m => { (m as THREE.MeshStandardMaterial).envMapIntensity = 0.3 })
        }
      }
    })

    scene.updateMatrixWorld(true)
    const box = new THREE.Box3().setFromObject(scene)
    const size = new THREE.Vector3()
    box.getSize(size)
    const maxDim = Math.max(size.x, size.y, size.z)
    if (maxDim > 0) {
      const scale = 6 / maxDim
      scene.scale.setScalar(scale)
      scene.updateMatrixWorld(true)
      const box2 = new THREE.Box3().setFromObject(scene)
      const center2 = new THREE.Vector3()
      box2.getCenter(center2)
      scene.position.set(
        position[0] - center2.x,
        position[1] - box2.min.y,
        position[2] - center2.z
      )
    }
  }

  useFrame(() => {
    if (!groupRef.current) return
    const targetY = active ? 0.4 : 0
    groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.1
  })

  return (
    <group
      ref={groupRef}
      onPointerEnter={(e) => { e.stopPropagation(); onHover(true) }}
      onPointerLeave={() => onHover(false)}
      onClick={(e) => { e.stopPropagation(); onClick() }}
    >
      {sceneClone.current && <primitive object={sceneClone.current} />}
    </group>
  )
}

function Scene({ activeIndex, onHover, onClick }: {
  activeIndex: number | null
  onHover: (idx: number | null) => void
  onClick: (idx: number) => void
}) {
  return (
    <>
      <color attach="background" args={["#0a0f1e"]} />
      <fog attach="fog" args={["#0a0f1e", 30, 70]} />

      <ambientLight intensity={2.5} color="#e8f0ff" />
      <directionalLight position={[12, 20, 12]} intensity={2.5} color="#fff8e8" />
      <pointLight position={[-8, 8, -8]} intensity={1.0} distance={35} color="#ffffff" />

      <MapPlane />

      {PROYECTOS.map((proyecto, idx) => (
        <OBJErrorBoundary key={idx}>
          <Suspense fallback={
            <mesh position={[proyecto.position[0], 1, proyecto.position[2]]}>
              <boxGeometry args={[3, 2, 3]} />
              <meshStandardMaterial color="#888888" wireframe />
            </mesh>
          }>
            <GLBBuilding
              url={GLB_URLS[proyecto.modelIndex]}
              position={proyecto.position}
              active={activeIndex === idx}
              onHover={(v) => onHover(v ? idx : null)}
              onClick={() => onClick(idx)}
            />
          </Suspense>
        </OBJErrorBoundary>
      ))}

      <OrbitControls
        enableDamping
        dampingFactor={0.06}
        minPolarAngle={Math.PI / 8}
        maxPolarAngle={Math.PI / 2.15}
        minDistance={5}
        maxDistance={45}
        autoRotate={activeIndex === null}
        autoRotateSpeed={0.4}
      />
    </>
  )
}

export function Leon3DMap() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
  const activeIndex = selectedIdx ?? hoveredIdx

  const handleClick = useCallback((idx: number) => {
    setSelectedIdx(prev => prev === idx ? null : idx)
  }, [])

  const proyecto = selectedIdx !== null ? PROYECTOS[selectedIdx] : null

  return (
    <div className="relative w-full">
      <div className="relative bg-[#080b14] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl h-[500px] lg:h-[600px]">
        <Canvas
          camera={{ position: [0, 14, 22], fov: 45 }}
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
          frameloop="demand"
          onPointerMissed={() => setSelectedIdx(null)}
        >
          <Suspense fallback={null}>
            <Scene activeIndex={activeIndex} onHover={setHoveredIdx} onClick={handleClick} />
          </Suspense>
        </Canvas>

        {/* Hint */}
        <div className="absolute top-4 left-4 pointer-events-none z-10">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-900/80 border border-slate-700 backdrop-blur-md text-slate-300">
            <MapPin className="w-3 h-3" />
            Toca el edificio para ver info · Arrastra para rotar
          </div>
        </div>

        {/* Info panel */}
        {proyecto && (
          <div className="absolute top-4 right-2 sm:right-4 w-[calc(100%-1rem)] max-w-[17rem] z-10 animate-in fade-in slide-in-from-right-4 duration-300" style={{ maxHeight: 'calc(100% - 3.5rem)' }}>
            <div className="bg-[#0f172a]/95 backdrop-blur-md border border-slate-700/50 shadow-2xl rounded-xl overflow-hidden flex flex-col" style={{ maxHeight: 'inherit' }}>
              <div className="h-1 w-full bg-[#e8ff50]" />
              <div className="p-5 overflow-y-auto flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 border border-slate-600 bg-slate-800/50 px-2 py-0.5 rounded-full">
                      {proyecto.zona}
                    </span>
                    <h3 className="font-bold text-white text-base leading-tight mt-2">{proyecto.nombre}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{proyecto.tipo}</p>
                  </div>
                  <button
                    onClick={() => setSelectedIdx(null)}
                    className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 p-1.5 rounded-full transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/50">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-1">Pisos</p>
                    <p className="text-sm text-white font-semibold">{proyecto.pisos} niveles</p>
                  </div>
                  <div className="bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/50">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-1">Entrega</p>
                    <p className="text-sm text-white font-semibold">{proyecto.entrega}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-slate-400 mb-1">Inversión desde</p>
                  <p className="text-2xl font-bold text-[#e8ff50]">{proyecto.precioDesde}</p>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-300 font-medium">Disponibilidad</span>
                    <span className="text-white font-bold">{proyecto.disponibles} / {proyecto.total} unidades</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
                    <div
                      className="h-full rounded-full bg-[#e8ff50] transition-all duration-700"
                      style={{ width: `${(proyecto.disponibles / proyecto.total) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Availability summary — compact 3-column */}
                {(() => {
                  const flat = proyecto.unidades.flat()
                  const disp = flat.filter(s => s === 'disponible').length
                  const res  = flat.filter(s => s === 'reservado').length
                  const vend = flat.filter(s => s === 'vendido').length
                  return (
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="bg-[#e8ff5012] border border-[#e8ff5030] rounded-lg p-2.5 text-center">
                        <p className="text-lg font-bold text-[#e8ff50]">{disp}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Disponibles</p>
                      </div>
                      <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-2.5 text-center">
                        <p className="text-lg font-bold text-orange-400">{res}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Reservados</p>
                      </div>
                      <div className="bg-slate-800/60 border border-slate-700/50 rounded-lg p-2.5 text-center">
                        <p className="text-lg font-bold text-slate-400">{vend}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Vendidos</p>
                      </div>
                    </div>
                  )
                })()}

                <button
                  onClick={() => {
                    const section = document.getElementById('unidades-section')
                    if (section) {
                      section.scrollIntoView({ behavior: 'smooth' })
                      section.dispatchEvent(new CustomEvent('selectProyecto', { detail: selectedIdx, bubbles: true }))
                    }
                  }}
                  className="w-full py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:brightness-110 bg-[#e8ff5022] text-[#e8ff50] border border-[#e8ff5055]"
                >
                  Ver Unidades <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-md border-t border-slate-800 px-3 py-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-300 z-10 pointer-events-none">
          <span className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-yellow-400" />
            <strong className="text-white text-sm">{PROYECTOS.length}</strong> desarrollos
          </span>
          <span className="flex items-center gap-2">
            <Home className="h-4 w-4 text-emerald-400" />
            <strong className="text-white text-sm">{PROYECTOS.reduce((sum, p) => sum + p.disponibles, 0)}</strong> unidades disponibles
          </span>
          <span className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-blue-400" />
            León, Guanajuato
          </span>
        </div>
      </div>
    </div>
  )
}
