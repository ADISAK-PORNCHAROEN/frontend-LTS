import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import { NextRequestWithAuth } from 'next-auth/middleware'

export async function middleware(request: NextRequestWithAuth) {

  // ข้าม middleware สำหรับ path ที่ไม่ต้องการตรวจสอบ
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
  //  console.log('User:', user)

  const Role = {
    isAdmin: "admin",
    isCoordinator: "program_coordinator",
    isInstructor: "instructor"
  }

  // ถ้าไม่มี user และไม่ได้อยู่ในหน้า login/signup ให้ redirect ไปหน้า login
  if (
    !user &&
    !request.nextUrl.pathname.includes('/auth/signIn') &&
    !request.nextUrl.pathname.includes('/auth/signUp')
  ) {
    return NextResponse.redirect(new URL(`/lts/api/auth/signIn`, request.url))
  }

  // ถ้ามี session อยู่แล้ว แต่พยายามเข้าไปที่หน้า login หรือ signup ให้ redirect ไปหน้า /lts/api/auth/redirect
  if (
    user &&
    (request.nextUrl.pathname.includes('/auth/signIn') || request.nextUrl.pathname.includes('/auth/signUp'))
  ) {
    // เช็คว่าเป็น /auth/signIn หรือ /auth/signUp อย่างชัดเจน
    if (request.nextUrl.pathname === '/auth/signIn' || request.nextUrl.pathname === '/auth/signUp') {
      return NextResponse.redirect(new URL('/lts/api/auth/redirect', request.url))
    }
  }

  // เช็ค role ต่างๆ
  const isAdminPath = request.nextUrl.pathname.startsWith('/admin')
  const isCoordinator = request.nextUrl.pathname.startsWith('/coordinator')
  const isInstructor = request.nextUrl.pathname.startsWith('/instructor')

  if (isAdminPath && user?.role !== Role.isAdmin) {
    return NextResponse.redirect(new URL('/instructor', request.url))
  }

  if (isCoordinator && user?.role !== Role.isCoordinator) {
    return NextResponse.redirect(new URL('/instructor', request.url))
  }

  if (isInstructor && user?.role !== Role.isInstructor) {
    return NextResponse.redirect(new URL('/lts/instructor', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // จับทุก path ที่เริ่มต้นด้วย /lts
    '/lts/:path*',
    // จับ root path
    '/',
    // จับ path อื่นๆ ที่ไม่ใช่ _next, api, static
    '/((?!_next|api|static).*)'
  ]
}