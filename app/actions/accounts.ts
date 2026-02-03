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

export async function updateAccountBalance(accountId: number, newBalance: number) {
    const user = await getUserFromCookie()

    // Only PRESIDENT can manually adjust account balances
    if (user.role !== 'PRESIDENT') {
        return { error: 'Unauthorized: Only President can adjust account balances' }
    }

    try {
        await prisma.account.update({
            where: { id: accountId },
            data: { currentBalance: newBalance }
        })

        revalidatePath('/accounts')
        revalidatePath('/dashboard')
        return { success: true }
    } catch (error) {
        console.error('Update account balance error:', error)
        return { error: 'Failed to update account balance' }
    }
}
