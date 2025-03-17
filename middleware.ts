import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import { NextRequestWithAuth } from 'next-auth/middleware'

export async function middleware(request: NextRequestWithAuth) {

  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.startsWith('/static')
  ) {
    return NextResponse.next()
  }

  const user = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const Role = {
    isAdmin: "admin",
    isCoordinator: "program_coordinator",
    isInstructor: "instructor"
  }

  if (
    !user &&
    !request.nextUrl.pathname.includes('/auth/signIn') &&
    !request.nextUrl.pathname.includes('/auth/signUp')
  ) {
    return NextResponse.redirect(new URL(`/lts/api/auth/signIn`, request.url))
  }

  if (
    user &&
    (request.nextUrl.pathname.includes('/auth/signIn') || request.nextUrl.pathname.includes('/auth/signUp'))
  ) {
    if (request.nextUrl.pathname === '/auth/signIn' || request.nextUrl.pathname === '/auth/signUp') {
      return NextResponse.redirect(new URL('/lts/api/auth/redirect', request.url))
    }
  }

  const isAdminPath = request.nextUrl.pathname.startsWith('/admin')
  const isCoordinator = request.nextUrl.pathname.startsWith('/coordinator')
  const isInstructor = request.nextUrl.pathname.startsWith('/instructor')

  if (isAdminPath && user?.role !== Role.isAdmin) {
    return NextResponse.redirect(new URL('/lts', request.url))
  }

  if (isCoordinator && user?.role !== Role.isCoordinator) {
    return NextResponse.redirect(new URL('/lts', request.url))
  }

  if (isInstructor && user?.role !== Role.isInstructor) {
    return NextResponse.redirect(new URL('/lts', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/lts/:path*',
    '/',
    '/((?!_next|api|static).*)'
  ]
}