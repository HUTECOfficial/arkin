"use client"

import { useRef, useState, Suspense, useEffect, Component, ReactNode, useCallback } from "react"
import { Canvas, useLoader, useFrame } from "@react-three/fiber"
import { OrbitControls, ContactShadows } from "@react-three/drei"
import { MapPin, X, ChevronRight, Building2, Home } from "lucide-react"
import * as THREE from "three"
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js"

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
  const meshRef = useRef<THREE.Mesh>(null)
  const [mapTexture, setMapTexture] = useState<THREE.CanvasTexture | null>(null)
  const [fallback, setFallback] = useState(false)

  useEffect(() => {
    buildMapTexture()
      .then(tex => setMapTexture(tex))
      .catch(() => setFallback(true))
  }, [])

  if (!mapTexture && !fallback) {
    return (
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#2d4a2d" roughness={1} />
      </mesh>
    )
  }

  return (
    <group>
      {/* Plano base con textura OSM */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial
          map={mapTexture ?? undefined}
          color={fallback ? '#3a5a3a' : '#ffffff'}
          roughness={0.95}
          metalness={0}
        />
      </mesh>

      {/* Calles secundarias superpuestas (líneas blancas finas) */}
      {[...Array(8)].map((_, i) => (
        <mesh key={`h${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, -13 + i * 3.7]}>
          <planeGeometry args={[30, 0.06]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.18} />
        </mesh>
      ))}
      {[...Array(8)].map((_, i) => (
        <mesh key={`v${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[-13 + i * 3.7, 0.005, 0]}>
          <planeGeometry args={[0.06, 30]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.18} />
        </mesh>
      ))}

      {/* Avenidas principales (más anchas) */}
      {[-4, 0, 4].map((pos, i) => (
        <mesh key={`av${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[pos, 0.006, 0]}>
          <planeGeometry args={[0.18, 30]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.28} />
        </mesh>
      ))}
      {[-4, 0, 4].map((pos, i) => (
        <mesh key={`ah${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, pos]}>
          <planeGeometry args={[30, 0.18]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.28} />
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
          <meshStandardMaterial color="#4a8c4a" roughness={0.95} transparent opacity={0.7} />
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
        <mesh key={`block${i}`} position={[b.x, b.h / 2, b.z]} castShadow receiveShadow>
          <boxGeometry args={[b.w, b.h, b.d]} />
          <meshStandardMaterial color="#b0a898" roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}

const OBJ_URL = 'https://mnrfsdrjadretxesjxhu.supabase.co/storage/v1/object/sign/arkin/building.obj?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82ZTg2NjJkMS1lZjIzLTRkZjUtYjAwYy04NjVkOTcwYzljZWMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhcmtpbi9idWlsZGluZy5vYmoiLCJpYXQiOjE3NzI4MzQwNjQsImV4cCI6MTgwNDM3MDA2NH0.MV2j_1HArU-jiMNH2IhXCnLi4CtR9f4xfRn5UhEH1vE'
const MTL_URL = 'https://mnrfsdrjadretxesjxhu.supabase.co/storage/v1/object/sign/arkin/building.obj.mtl?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82ZTg2NjJkMS1lZjIzLTRkZjUtYjAwYy04NjVkOTcwYzljZWMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhcmtpbi9idWlsZGluZy5vYmoubXRsIiwiaWF0IjoxNzcyODM0MDg1LCJleHAiOjE4MDQzNzAwODV9.VbwRRCjAk4vHrlDfGqxngwKPpNwMVZ4LhdfvMBNn4e4'

type UnitStatus = 'disponible' | 'vendido' | 'reservado'

const PROYECTO = {
  nombre: "Torre Arkin Campestre",
  zona: "Campestre, León Gto.",
  tipo: "Departamentos de Lujo",
  disponibles: 12,
  total: 48,
  precioDesde: "$4,200,000",
  pisos: 18,
  entrega: "Q4 2026",
  // pisos[0] = piso 1 (planta baja), cada array = depas en ese piso
  unidades: [
    ['vendido','vendido','vendido'] as UnitStatus[],
    ['vendido','vendido','reservado'] as UnitStatus[],
    ['vendido','reservado','disponible'] as UnitStatus[],
    ['vendido','vendido','disponible'] as UnitStatus[],
    ['vendido','disponible','disponible'] as UnitStatus[],
    ['reservado','disponible','disponible'] as UnitStatus[],
    ['disponible','disponible','disponible'] as UnitStatus[],
    ['disponible','disponible','disponible'] as UnitStatus[],
  ] as UnitStatus[][],
}

function OBJBuilding({ position, onHover, onClick, active }: {
  position: [number, number, number]
  onHover: (v: boolean) => void
  onClick: () => void
  active: boolean
}) {
  const obj = useLoader(OBJLoader, OBJ_URL)
  const groupRef = useRef<THREE.Group>(null)

  const processed = useRef(false)
  if (!processed.current) {
    processed.current = true

    obj.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh
        const mat = mesh.material
        if (Array.isArray(mat)) {
          mat.forEach(m => { (m as THREE.MeshStandardMaterial).transparent = false; (m as THREE.MeshStandardMaterial).opacity = 1 })
        } else if (mat) {
          (mat as THREE.MeshStandardMaterial).transparent = false;
          (mat as THREE.MeshStandardMaterial).opacity = 1
        }
        mesh.castShadow = true
        mesh.receiveShadow = true
      }
    })

    obj.rotation.x = -Math.PI / 2
    obj.updateMatrixWorld(true)
    const box = new THREE.Box3().setFromObject(obj)
    const size = new THREE.Vector3()
    box.getSize(size)
    const maxDim = Math.max(size.x, size.y, size.z)
    if (maxDim > 0) {
      const scale = 6 / maxDim
      obj.scale.setScalar(scale)
      obj.updateMatrixWorld(true)
      const box2 = new THREE.Box3().setFromObject(obj)
      const center2 = new THREE.Vector3()
      box2.getCenter(center2)
      obj.position.set(
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
      <primitive object={obj} />
    </group>
  )
}

function Scene({ active, onHover, onClick }: {
  active: boolean
  onHover: (v: boolean) => void
  onClick: () => void
}) {
  return (
    <>
      <color attach="background" args={["#0a0f1e"]} />
      <fog attach="fog" args={["#0a0f1e", 30, 70]} />

      <ambientLight intensity={2.0} color="#e8f0ff" />
      <directionalLight
        position={[12, 22, 12]}
        intensity={3.0}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={80}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
        shadow-bias={-0.001}
        color="#fff8e8"
      />
      <pointLight position={[-10, 10, -10]} intensity={1.5} distance={40} color="#ffffff" />
      <pointLight position={[10, 6, 10]} intensity={1.0} distance={30} color="#ffffff" />

      <MapPlane />
      <ContactShadows position={[0, 0.02, 0]} opacity={0.5} scale={50} blur={2} far={10} />

      <OBJErrorBoundary>
        <Suspense fallback={
          <mesh position={[0, 1, 0]}>
            <boxGeometry args={[3, 2, 3]} />
            <meshStandardMaterial color="#888888" wireframe />
          </mesh>
        }>
          <OBJBuilding position={[0, 0, 0]} active={active} onHover={onHover} onClick={onClick} />
        </Suspense>
      </OBJErrorBoundary>

      <OrbitControls
        enableDamping
        dampingFactor={0.06}
        minPolarAngle={Math.PI / 8}
        maxPolarAngle={Math.PI / 2.15}
        minDistance={5}
        maxDistance={45}
        autoRotate={!active}
        autoRotateSpeed={0.4}
      />
    </>
  )
}

export function Leon3DMap() {
  const [hovered, setHovered] = useState(false)
  const [selected, setSelected] = useState(false)
  const active = hovered || selected

  const handleClick = useCallback(() => setSelected(p => !p), [])

  return (
    <div className="relative w-full">
      <div className="relative bg-[#080b14] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl h-[500px] lg:h-[600px]">
        <Canvas
          shadows
          camera={{ position: [0, 14, 22], fov: 45 }}
          gl={{ antialias: true, alpha: false }}
          onPointerMissed={() => setSelected(false)}
        >
          <Suspense fallback={null}>
            <Scene active={active} onHover={setHovered} onClick={handleClick} />
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
        {selected && (
          <div className="absolute top-4 right-4 w-72 z-10 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="bg-[#0f172a]/95 backdrop-blur-md border border-slate-700/50 shadow-2xl rounded-xl overflow-hidden">
              <div className="h-1 w-full bg-[#e8ff50]" />
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 border border-slate-600 bg-slate-800/50 px-2 py-0.5 rounded-full">
                      {PROYECTO.zona}
                    </span>
                    <h3 className="font-bold text-white text-base leading-tight mt-2">{PROYECTO.nombre}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{PROYECTO.tipo}</p>
                  </div>
                  <button
                    onClick={() => setSelected(false)}
                    className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 p-1.5 rounded-full transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/50">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-1">Pisos</p>
                    <p className="text-sm text-white font-semibold">{PROYECTO.pisos} niveles</p>
                  </div>
                  <div className="bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/50">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-1">Entrega</p>
                    <p className="text-sm text-white font-semibold">{PROYECTO.entrega}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-slate-400 mb-1">Inversión desde</p>
                  <p className="text-2xl font-bold text-[#e8ff50]">{PROYECTO.precioDesde}</p>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-300 font-medium">Disponibilidad</span>
                    <span className="text-white font-bold">{PROYECTO.disponibles} / {PROYECTO.total} unidades</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
                    <div
                      className="h-full rounded-full bg-[#e8ff50] transition-all duration-700"
                      style={{ width: `${(PROYECTO.disponibles / PROYECTO.total) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Floor/unit grid */}
                <div className="mb-4">
                  <p className="text-xs text-slate-400 mb-2 uppercase tracking-wide">Disponibilidad por piso</p>
                  <div className="flex flex-col-reverse gap-1">
                    {PROYECTO.unidades.map((piso, pi) => (
                      <div key={pi} className="flex items-center gap-1">
                        <span className="text-[10px] text-slate-500 w-6 text-right">{pi + 1}</span>
                        <div className="flex gap-1">
                          {piso.map((status, di) => (
                            <div
                              key={di}
                              title={`Piso ${pi + 1} · Depa ${di + 1} · ${status}`}
                              className="w-5 h-4 rounded-sm"
                              style={{
                                backgroundColor:
                                  status === 'disponible' ? '#e8ff50' :
                                  status === 'reservado'  ? '#f97316' :
                                  '#334155'
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-4 mt-2">
                    <span className="flex items-center gap-1 text-[10px] text-slate-400"><span className="w-3 h-3 rounded-sm bg-[#e8ff50] inline-block" /> Disponible</span>
                    <span className="flex items-center gap-1 text-[10px] text-slate-400"><span className="w-3 h-3 rounded-sm bg-orange-500 inline-block" /> Reservado</span>
                    <span className="flex items-center gap-1 text-[10px] text-slate-400"><span className="w-3 h-3 rounded-sm bg-slate-600 inline-block" /> Vendido</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    document.getElementById('unidades-section')?.scrollIntoView({ behavior: 'smooth' })
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
        <div className="absolute bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-md border-t border-slate-800 px-6 py-3 flex gap-8 text-xs text-slate-300 z-10 pointer-events-none">
          <span className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-yellow-400" />
            <strong className="text-white text-sm">{PROYECTO.pisos}</strong> pisos
          </span>
          <span className="flex items-center gap-2">
            <Home className="h-4 w-4 text-emerald-400" />
            <strong className="text-white text-sm">{PROYECTO.disponibles}</strong> unidades disponibles
          </span>
          <span className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-blue-400" />
            {PROYECTO.zona}
          </span>
        </div>
      </div>
    </div>
  )
}
