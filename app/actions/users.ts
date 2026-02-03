'use server'

import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { createHash } from 'crypto'

function hash(password: string) {
    return createHash('sha256').update(password).digest('hex')
}

async function getUserFromCookie() {
    const cookieStore = await cookies()
    const session = cookieStore.get('session')
    if (!session) throw new Error('Unauthorized')
    return JSON.parse(session.value)
}

export async function getUsers() {
    const user = await getUserFromCookie()
    // Only PRESIDENT can manage users
    if (user.role !== 'PRESIDENT') {
        throw new Error('Unauthorized')
    }

    try {
        return await prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isActive: true,
                createdAt: true
            }
        })
    } catch (error) {
        console.error('Get users error:', error)
        return []
    }
}

export async function createUser(formData: FormData) {
    const user = await getUserFromCookie()
    // Only PRESIDENT can create users
    if (user.role !== 'PRESIDENT') {
        return { error: 'Unauthorized: Only President can create users' }
    }

    const data = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        password: hash(formData.get('password') as string),
        role: formData.get('role') as string,
        isActive: true
    }

    try {
        const newUser = await prisma.user.create({ data })
        revalidatePath('/users')
        return { success: true, user: newUser }
    } catch (error: any) {
        console.error('Create user error:', error)
        if (error.code === 'P2002') {
            return { error: 'Email already exists' }
        }
        return { error: 'Failed to create user' }
    }
}

export async function toggleUserStatus(userId: number) {
    const user = await getUserFromCookie()
    // Only PRESIDENT can toggle user status
    if (user.role !== 'PRESIDENT') {
        return { error: 'Unauthorized: Only President can manage users' }
    }

    // Cannot deactivate yourself
    if (user.userId === userId) {
        return { error: 'Cannot deactivate your own account' }
    }

    try {
        const targetUser = await prisma.user.findUnique({ where: { id: userId } })
        if (!targetUser) return { error: 'User not found' }

        await prisma.user.update({
            where: { id: userId },
            data: { isActive: !targetUser.isActive }
        })

        revalidatePath('/users')
        return { success: true }
    } catch (error) {
        console.error('Toggle user status error:', error)
        return { error: 'Failed to update user status' }
    }
}
