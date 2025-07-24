import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // If user is authenticated and trying to access login page, redirect to main admin
    if (req.nextUrl.pathname === "/admin/login" && req.nextauth.token) {
      return NextResponse.redirect(new URL("/admin", req.url))
    }

    // If user is not authenticated and trying to access admin (not login), redirect to login
    if (req.nextUrl.pathname === "/admin" && !req.nextauth.token) {
      return NextResponse.redirect(new URL("/admin/login", req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to login page without authentication
        if (req.nextUrl.pathname === "/admin/login") {
          return true
        }

        // For all other admin routes, require authentication
        if (req.nextUrl.pathname.startsWith("/admin")) {
          return !!token
        }

        // Allow access to all other routes
        return true
      },
    },
  }
)

export const config = {
  matcher: ["/admin/:path*"],
}
