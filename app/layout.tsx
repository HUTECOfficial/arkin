import type React from "react"
import type { Metadata, Viewport } from "next"
import "./globals.css"
import { Footer } from "@/components/footer"
import { DynamicHeader } from "@/components/dynamic-header"
import { WishlistProvider } from "@/components/wishlist-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { SWRProvider } from "@/components/swr-provider"
import { Toaster } from "sonner"

export const metadata: Metadata = {
  title: "ARKIN SELECT - Tu Plataforma Inmobiliaria de Confianza",
  description: "Exclusividad, Conexión y Confianza. Confía tu propiedad a ARKIN SELECT.",
  generator: "v0.app",
  icons: {
    icon: "/arkinlogo.jpg",
    apple: "/arkinlogo.jpg",
  },
  openGraph: {
    title: "ARKIN SELECT - Tu Plataforma Inmobiliaria de Confianza",
    description: "Exclusividad, Conexión y Confianza. Confía tu propiedad a ARKIN SELECT.",
    images: [
      {
        url: "/arkinlogo.jpg",
        width: 1200,
        height: 630,
        alt: "ARKIN SELECT Logo",
      },
    ],
    type: "website",
    locale: "es_MX",
    siteName: "ARKIN SELECT",
  },
  twitter: {
    card: "summary_large_image",
    title: "ARKIN SELECT - Tu Plataforma Inmobiliaria de Confianza",
    description: "Exclusividad, Conexión y Confianza. Confía tu propiedad a ARKIN SELECT.",
    images: ["/arkinlogo.jpg"],
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="font-arkin m-0 p-0">
        <SWRProvider>
          <AuthProvider>
            <WishlistProvider>
              <DynamicHeader />
              {children}
              <Footer />
              <Toaster position="top-right" richColors />
            </WishlistProvider>
          </AuthProvider>
        </SWRProvider>
      </body>
    </html>
  )
}
