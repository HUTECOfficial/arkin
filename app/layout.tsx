import type React from "react"
import type { Metadata, Viewport } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Playfair_Display } from "next/font/google"
import "./globals.css"
import { Footer } from "@/components/footer"
import { DynamicHeader } from "@/components/dynamic-header"
import { WishlistProvider } from "@/components/wishlist-provider"
import { CallButton } from "@/components/call-button"
import { AuthProvider } from "@/contexts/auth-context"
import { SWRProvider } from "@/components/swr-provider"

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
})

export const metadata: Metadata = {
  title: "ARKIN SELECT - Tu Inmobiliaria de Confianza",
  description: "Exclusividad, Conexión y Confianza. Confía tu propiedad a ARKIN SELECT.",
  generator: "v0.app",
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
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} ${playfair.variable} m-0 p-0`}>
        <SWRProvider>
          <AuthProvider>
            <WishlistProvider>
              <DynamicHeader />
              {children}
              <Footer />
              <CallButton />
            </WishlistProvider>
          </AuthProvider>
        </SWRProvider>
      </body>
    </html>
  )
}
