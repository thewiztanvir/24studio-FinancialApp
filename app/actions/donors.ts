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
        status: formData.get('status') as string || 'External',
        yearlyContributionRequired: formData.get('yearlyContributionRequired') ? parseFloat(formData.get('yearlyContributionRequired') as string) : null,
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
        const donors = await prisma.donor.findMany({
            orderBy: { lastDonationDate: 'desc' },
        })

        return donors.map(d => ({
            ...d,
            yearlyContributionRequired: d.yearlyContributionRequired ? Number(d.yearlyContributionRequired) : null,
            totalDonated: Number(d.totalDonated)
        }))
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
        transactionId: formData.get('transactionId') as string || null,
        purpose: formData.get('purpose') as string || null,
        taxReceiptRequired: formData.get('taxReceiptRequired') === 'true',
        receiptPath: formData.get('receiptPath') as string || null,
        recordedById: user.userId,
    }

    try {
        const donation = await prisma.donation.create({ data })

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
        revalidatePath('/transactions')
        return { success: true, donation }
    } catch (error) {
        console.error('Create donation error:', error)
        return { error: 'Failed to create donation' }
    }
}

export async function getDonations() {
    try {
        const donations = await prisma.donation.findMany({
            include: {
                donor: true,
                recordedBy: { select: { name: true } }
            },
            orderBy: { date: 'desc' },
            take: 100
        })

        return donations.map(d => ({
            ...d,
            amount: Number(d.amount),
            donor: {
                ...d.donor,
                yearlyContributionRequired: d.donor.yearlyContributionRequired ? Number(d.donor.yearlyContributionRequired) : null,
                totalDonated: Number(d.donor.totalDonated)
            }
        }))
    } catch (error) {
        console.error('Get donations error:', error)
        return []
    }
}

export async function getDonorProfile(id: number) {
    try {
        const donor = await prisma.donor.findUnique({
            where: { id },
            include: {
                donations: {
                    orderBy: { date: 'desc' },
                    include: {
                        recordedBy: { select: { name: true } }
                    }
                }
            }
        })

        if (!donor) return null

        const currentYear = new Date().getFullYear()
        const currentMonth = new Date().getMonth()

        const donations = donor.donations.map(d => ({
            ...d,
            amount: Number(d.amount)
        }))

        const yearlyDonated = donations
            .filter(d => d.date.getFullYear() === currentYear)
            .reduce((sum, d) => sum + d.amount, 0)

        const monthlyDonated = donations
            .filter(d => d.date.getFullYear() === currentYear && d.date.getMonth() === currentMonth)
            .reduce((sum, d) => sum + d.amount, 0)

        return {
            donor: {
                ...donor,
                yearlyContributionRequired: donor.yearlyContributionRequired ? Number(donor.yearlyContributionRequired) : null,
                totalDonated: Number(donor.totalDonated)
            },
            stats: {
                yearlyDonated,
                monthlyDonated,
                lifetimeDonated: Number(donor.totalDonated),
                lastDonationDate: donor.lastDonationDate
            },
            history: donations
        }
    } catch (error) {
        console.error('Get donor profile error:', error)
        return null
    }
}
