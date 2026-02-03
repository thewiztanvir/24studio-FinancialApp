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

// Settings Management
export async function getSettings() {
    try {
        let settings = await prisma.settings.findFirst()

        // If no settings exist, create default
        if (!settings) {
            settings = await prisma.settings.create({
                data: {
                    organizationName: '24Studio Foundation',
                    organizationAddress: 'Dhaka, Bangladesh',
                    organizationEmail: 'info@24studio.org',
                    organizationPhone: '+880 XXX XXXX',
                    organizationWebsite: 'https://24studio.org',
                },
            })
        }

        return settings
    } catch (error) {
        console.error('Get settings error:', error)
        return null
    }
}

export async function updateSettings(formData: FormData) {
    const user = await getUserFromCookie()
    if (user.role !== 'PRESIDENT') {
        return { error: 'Unauthorized: Only President can update settings' }
    }

    try {
        const settings = await prisma.settings.findFirst()

        const data = {
            organizationName: formData.get('organizationName') as string,
            organizationAddress: formData.get('organizationAddress') as string,
            organizationEmail: formData.get('organizationEmail') as string,
            organizationPhone: formData.get('organizationPhone') as string,
            organizationWebsite: formData.get('organizationWebsite') as string,
            fiscalYearStart: parseInt(formData.get('fiscalYearStart') as string),
            fiscalYearEnd: parseInt(formData.get('fiscalYearEnd') as string),
        }

        if (settings) {
            await prisma.settings.update({
                where: { id: settings.id },
                data,
            })
        } else {
            await prisma.settings.create({ data })
        }

        revalidatePath('/settings')
        return { success: true, message: 'Settings updated successfully' }
    } catch (error) {
        console.error('Update settings error:', error)
        return { error: 'Failed to update settings' }
    }
}

export async function updateCategories(type: 'revenue' | 'expense', categories: string[]) {
    const user = await getUserFromCookie()
    if (user.role !== 'PRESIDENT') {
        return { error: 'Unauthorized: Only President can update categories' }
    }

    try {
        const settings = await prisma.settings.findFirst()
        const categoriesString = categories.join(',')

        const data = type === 'revenue'
            ? { revenueCategories: categoriesString }
            : { expenseCategories: categoriesString }

        if (settings) {
            await prisma.settings.update({
                where: { id: settings.id },
                data,
            })
        }

        revalidatePath('/settings')
        return { success: true, message: 'Categories updated successfully' }
    } catch (error) {
        console.error('Update categories error:', error)
        return { error: 'Failed to update categories' }
    }
}

// Database Operations
export async function resetAllTransactions() {
    const user = await getUserFromCookie()
    if (user.role !== 'PRESIDENT') {
        return { error: 'Unauthorized: Only President can reset database' }
    }

    try {
        await prisma.budget.deleteMany({})
        await prisma.expense.deleteMany({})
        await prisma.donation.deleteMany({})
        await prisma.revenue.deleteMany({})
        await prisma.donor.deleteMany({})
        await prisma.account.updateMany({ data: { currentBalance: 0 } })

        revalidatePath('/dashboard')
        revalidatePath('/accounts')
        return { success: true, message: 'All transactions cleared and balances reset to ৳ 0' }
    } catch (error) {
        console.error('Reset error:', error)
        return { error: 'Failed to reset database' }
    }
}

export async function getDatabaseStats() {
    const user = await getUserFromCookie()
    if (user.role !== 'PRESIDENT') {
        return null
    }

    try {
        const stats = {
            users: await prisma.user.count(),
            accounts: await prisma.account.count(),
            revenue: await prisma.revenue.count(),
            donations: await prisma.donation.count(),
            donors: await prisma.donor.count(),
            expenses: await prisma.expense.count(),
            budgets: await prisma.budget.count(),
        }
        return stats
    } catch (error) {
        console.error('Stats error:', error)
        return null
    }
}

// Account Management
export async function createAccount(formData: FormData) {
    const user = await getUserFromCookie()
    if (user.role !== 'PRESIDENT') {
        return { error: 'Unauthorized: Only President can create accounts' }
    }

    const data = {
        name: formData.get('name') as string,
        type: formData.get('type') as string,
        currentBalance: parseFloat(formData.get('currentBalance') as string) || 0,
    }

    try {
        const account = await prisma.account.create({ data })
        revalidatePath('/accounts')
        revalidatePath('/settings')
        return { success: true, account }
    } catch (error) {
        console.error('Create account error:', error)
        return { error: 'Failed to create account' }
    }
}

export async function deleteAccount(id: number) {
    const user = await getUserFromCookie()
    if (user.role !== 'PRESIDENT') {
        return { error: 'Unauthorized: Only President can delete accounts' }
    }

    try {
        const revenueCount = await prisma.revenue.count({ where: { accountId: id } })
        const donationCount = await prisma.donation.count({ where: { accountId: id } })
        const expenseCount = await prisma.expense.count({ where: { accountId: id } })

        if (revenueCount > 0 || donationCount > 0 || expenseCount > 0) {
            return { error: 'Cannot delete account with existing transactions' }
        }

        await prisma.account.delete({ where: { id } })
        revalidatePath('/accounts')
        revalidatePath('/settings')
        return { success: true }
    } catch (error) {
        console.error('Delete account error:', error)
        return { error: 'Failed to delete account' }
    }
}

export async function getAllAccounts() {
    const user = await getUserFromCookie()
    if (user.role !== 'PRESIDENT') {
        return []
    }

    try {
        return await prisma.account.findMany({ orderBy: { name: 'asc' } })
    } catch (error) {
        console.error('Get accounts error:', error)
        return []
    }
}
