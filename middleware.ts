import { NextRequest, NextResponse } from 'next/server'

const MAINTENANCE = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true'

const ALLOWED_PATHS = [
  '/construccion',
  '/api/',
  '/_next/',
  '/favicon',
  '/fonts/',
  '/arkinlogo',
  '/avatars/',
]

export function middleware(req: NextRequest) {
  if (!MAINTENANCE) return NextResponse.next()

  const { pathname } = req.nextUrl

  const isAllowed = ALLOWED_PATHS.some(p => pathname.startsWith(p))
  if (isAllowed) return NextResponse.next()

  const url = req.nextUrl.clone()
  url.pathname = '/construccion'
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
