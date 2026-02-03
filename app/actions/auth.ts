'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { createHash } from 'crypto'

function hash(pass: string) {
    return createHash('sha256').update(pass).digest('hex')
}

export type LoginState = {
    error?: string
}

export async function login(prevState: LoginState, formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
        return { error: 'Please fill in all fields' }
    }

    const hashedPassword = hash(password)

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        })

        if (!user || user.password !== hashedPassword) {
            return { error: 'Invalid credentials' }
        }

        if (!user.isActive) {
            return { error: 'Account is deactivated' }
        }

        // Create session
        const sessionData = JSON.stringify({
            userId: user.id,
            email: user.email,
            role: user.role,
            name: user.name
        })

        // Set cookie
        const cookieStore = await cookies()
        cookieStore.set('session', sessionData, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        })
    } catch (error) {
        console.error('Login error:', error)
        return { error: 'Something went wrong' }
    }

    redirect('/dashboard')
}

export async function logout() {
    const cookieStore = await cookies()
    cookieStore.delete('session')
    redirect('/login')
}

export async function getSession() {
    const cookieStore = await cookies()
    const session = cookieStore.get('session')
    if (!session) return null
    try {
        return JSON.parse(session.value)
    } catch {
        return null
    }
}
