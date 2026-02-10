'use server'

import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function getUserFromCookie() {
    const cookieStore = await cookies()
    const session = cookieStore.get('session')
    if (!session) throw new Error('Unauthorized')
    return JSON.parse(session.value)
}

export async function createRevenue(formData: FormData) {
    const user = await getUserFromCookie()

    // Only PRESIDENT and REVENUE_TEAM can create revenue
    if (user.role !== 'PRESIDENT' && user.role !== 'REVENUE_TEAM') {
        return { error: 'Unauthorized: Only Revenue Team can add revenue' }
    }

    const data = {
        date: new Date(formData.get('date') as string),
        amount: parseFloat(formData.get('amount') as string),
        category: formData.get('category') as string,
        source: formData.get('source') as string,
        paymentMethod: formData.get('paymentMethod') as string,
        transactionId: formData.get('transactionId') as string || null,
        programName: formData.get('programName') as string || null,
        description: formData.get('description') as string || null,
        receiptPath: formData.get('receiptPath') as string || null,
        status: formData.get('status') as string || 'Received',
        recordedById: user.userId,
    }

    try {
        const revenue = await prisma.revenue.create({ data })

        revalidatePath('/revenue')
        revalidatePath('/dashboard')
        revalidatePath('/transactions')
        return { success: true, revenue }
    } catch (error) {
        console.error('Create revenue error:', error)
        return { error: 'Failed to create revenue' }
    }
}

export async function getRevenues() {
    try {
        const revenues = await prisma.revenue.findMany({
            include: {
                recordedBy: { select: { name: true } }
            },
            orderBy: { date: 'desc' },
            take: 100
        })

        return revenues.map(r => ({
            ...r,
            amount: Number(r.amount)
        }))
    } catch (error) {
        console.error('Get revenues error:', error)
        return []
    }
}

export async function deleteRevenue(id: number) {
    const user = await getUserFromCookie()

    // Only PRESIDENT and REVENUE_TEAM can delete revenue
    if (user.role !== 'PRESIDENT' && user.role !== 'REVENUE_TEAM') {
        return { error: 'Unauthorized: Only Revenue Team can delete revenue' }
    }
    try {
        const revenue = await prisma.revenue.findUnique({ where: { id } })
        if (!revenue) return { error: 'Revenue not found' }

        // Only PRESIDENT can delete any revenue, others can only delete their own
        if (user.role !== 'PRESIDENT' && revenue.recordedById !== user.userId) {
            return { error: 'Unauthorized' }
        }

        await prisma.revenue.delete({ where: { id } })

        revalidatePath('/revenue')
        revalidatePath('/dashboard')
        revalidatePath('/transactions')
        return { success: true }
    } catch (error) {
        console.error('Delete revenue error:', error)
        return { error: 'Failed to delete revenue' }
    }
}
