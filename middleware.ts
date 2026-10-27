import { NextRequest, NextResponse } from 'next/server'

const MAINTENANCE = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true'

// Vista previa privada durante mantenimiento: entrar con ?preview=<PREVIEW_SECRET> guarda una cookie
// y deja ver el sitio completo; ?preview=off la borra. Sin PREVIEW_SECRET configurado no hay acceso.
const PREVIEW_SECRET = process.env.PREVIEW_SECRET
const PREVIEW_COOKIE = 'arkin_preview'

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

  const { pathname, searchParams } = req.nextUrl

  if (PREVIEW_SECRET) {
    const preview = searchParams.get('preview')
    if (preview === PREVIEW_SECRET || preview === 'off') {
      const url = req.nextUrl.clone()
      url.searchParams.delete('preview')
      if (preview === 'off') url.pathname = '/construccion'
      const res = NextResponse.redirect(url)
      if (preview === 'off') {
        res.cookies.delete(PREVIEW_COOKIE)
      } else {
        res.cookies.set(PREVIEW_COOKIE, PREVIEW_SECRET, {
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 30,
        })
      }
      return res
    }
    if (req.cookies.get(PREVIEW_COOKIE)?.value === PREVIEW_SECRET) return NextResponse.next()
  }

  const isAllowed = ALLOWED_PATHS.some(p => pathname.startsWith(p))
  if (isAllowed) return NextResponse.next()

  const url = req.nextUrl.clone()
  url.pathname = '/construccion'
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
