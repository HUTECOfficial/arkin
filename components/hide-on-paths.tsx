"use client"

import { usePathname } from "next/navigation"

// Oculta su contenido en las rutas indicadas (p. ej. el menú y footer en /construccion)
export function HideOnPaths({ paths, children }: { paths: string[]; children: React.ReactNode }) {
  const pathname = usePathname()
  if (paths.includes(pathname)) return null
  return <>{children}</>
}
