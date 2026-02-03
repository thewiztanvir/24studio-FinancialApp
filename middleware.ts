import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const session = request.cookies.get('session')
    const { pathname } = request.nextUrl

    // 1. Public paths (no auth required)
    const publicPaths = ['/login']
    if (publicPaths.some(path => pathname.startsWith(path))) {
        if (session) {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }
        return NextResponse.next()
    }

    // 2. Auth guard - require login
    if (!session) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // 3. Role-based access control
    try {
        const user = JSON.parse(session.value)
        const role = user.role

        // PRESIDENT has access to everything
        if (role === 'PRESIDENT') {
            return NextResponse.next()
        }

        // REVENUE_TEAM restrictions - NO expenses, budgets, settings
        if (role === 'REVENUE_TEAM') {
            const blockedPaths = ['/expenses', '/budget', '/settings', '/users']
            if (blockedPaths.some(path => pathname.startsWith(path))) {
                return NextResponse.redirect(new URL('/dashboard', request.url))
            }
        }

        // FINANCE_TEAM restrictions - NO revenue, donations, donors (view only via dashboard)
        if (role === 'FINANCE_TEAM') {
            const blockedPaths = ['/revenue', '/donations', '/donors', '/settings', '/users']
            if (blockedPaths.some(path => pathname.startsWith(path))) {
                return NextResponse.redirect(new URL('/dashboard', request.url))
            }
        }

        return NextResponse.next()
    } catch (error) {
        return NextResponse.redirect(new URL('/login', request.url))
    }
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|logo.png|uploads).*)'],
}
