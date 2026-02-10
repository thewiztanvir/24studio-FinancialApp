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

export async function updateCategories(revenueCategories: string[], expenseCategories: string[]) {
    const user = await getUserFromCookie()
    if (user.role !== 'PRESIDENT') {
        return { error: 'Unauthorized: Only President can update categories' }
    }

    try {
        const settings = await prisma.settings.findFirst()
        const revenueCategoriesString = revenueCategories.join(',')
        const expenseCategoriesString = expenseCategories.join(',')

        const data = {
            revenueCategories: revenueCategoriesString,
            expenseCategories: expenseCategoriesString
        }

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

        revalidatePath('/dashboard')
        revalidatePath('/transactions')
        return { success: true, message: 'All transactions cleared successfully' }
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
            revenues: await prisma.revenue.count(),
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
