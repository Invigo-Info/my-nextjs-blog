import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Only run middleware for admin routes
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')

  if (!isAdminRoute) {
    return NextResponse.next()
  }

  try {
    // Check if Supabase environment variables are configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Supabase environment variables are not configured')
      // Allow access if Supabase is not configured (development mode)
      return NextResponse.next()
    }

    let supabaseResponse = NextResponse.next({
      request,
    })

    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    // Refresh session if expired
    const {
      data: { user },
      error
    } = await supabase.auth.getUser()

    if (error) {
      console.error('Error getting user:', error)
    }

    // Allow access to login and unauthorized pages
    if (request.nextUrl.pathname === '/admin/login' ||
        request.nextUrl.pathname === '/admin/unauthorized') {
      return supabaseResponse
    }

    if (!user) {
      // Redirect to login if not authenticated
      const redirectUrl = new URL('/admin/login', request.url)
      redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // Check if user is admin
    const adminEmail = process.env.ADMIN_EMAIL
    if (adminEmail && user.email !== adminEmail) {
      return NextResponse.redirect(new URL('/admin/unauthorized', request.url))
    }

    return supabaseResponse
  } catch (error) {
    console.error('Middleware error:', error)
    // In case of error, allow the request to proceed
    // This prevents the entire site from crashing
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
}
