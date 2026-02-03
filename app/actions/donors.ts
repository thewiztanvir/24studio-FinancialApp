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

// Donors
export async function createDonor(formData: FormData) {
    const user = await getUserFromCookie()

    // Only PRESIDENT and REVENUE_TEAM can create donors
    if (user.role !== 'PRESIDENT' && user.role !== 'REVENUE_TEAM') {
        return { error: 'Unauthorized: Only Revenue Team can add donors' }
    }
    const data = {
        name: formData.get('name') as string,
        email: formData.get('email') as string || null,
        phone: formData.get('phone') as string || null,
        address: formData.get('address') as string || null,
        nationalId: formData.get('nationalId') as string || null,
    }

    try {
        const donor = await prisma.donor.create({ data })
        revalidatePath('/donors')
        return { success: true, donor }
    } catch (error) {
        console.error('Create donor error:', error)
        return { error: 'Failed to create donor' }
    }
}

export async function getDonors() {
    try {
        return await prisma.donor.findMany({
            orderBy: { lastDonationDate: 'desc' },
        })
    } catch (error) {
        console.error('Get donors error:', error)
        return []
    }
}

// Donations
export async function createDonation(formData: FormData) {
    const user = await getUserFromCookie()

    // Only PRESIDENT and REVENUE_TEAM can create donations
    if (user.role !== 'PRESIDENT' && user.role !== 'REVENUE_TEAM') {
        return { error: 'Unauthorized: Only Revenue Team can add donations' }
    }

    const data = {
        donorId: parseInt(formData.get('donorId') as string),
        date: new Date(formData.get('date') as string),
        amount: parseFloat(formData.get('amount') as string),
        type: formData.get('type') as string,
        paymentMethod: formData.get('paymentMethod') as string,
        accountId: parseInt(formData.get('accountId') as string),
        purpose: formData.get('purpose') as string || null,
        taxReceiptRequired: formData.get('taxReceiptRequired') === 'true',
        receiptPath: formData.get('receiptPath') as string || null,
        recordedById: user.userId,
    }

    try {
        const donation = await prisma.donation.create({ data })

        // Update account balance
        await prisma.account.update({
            where: { id: data.accountId },
            data: { currentBalance: { increment: data.amount } }
        })

        // Update donor stats
        await prisma.donor.update({
            where: { id: data.donorId },
            data: {
                totalDonated: { increment: data.amount },
                lastDonationDate: data.date
            }
        })

        revalidatePath('/donations')
        revalidatePath('/donors')
        revalidatePath('/dashboard')
        return { success: true, donation }
    } catch (error) {
        console.error('Create donation error:', error)
        return { error: 'Failed to create donation' }
    }
}

export async function getDonations() {
    try {
        return await prisma.donation.findMany({
            include: {
                donor: true,
                account: true,
                recordedBy: { select: { name: true } }
            },
            orderBy: { date: 'desc' },
            take: 100
        })
    } catch (error) {
        console.error('Get donations error:', error)
        return []
    }
}
