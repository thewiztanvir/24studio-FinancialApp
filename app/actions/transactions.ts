'use server'

import { prisma } from '@/lib/prisma'

export async function getAllTransactions() {
    try {
        const [revenues, expenses, donations] = await Promise.all([
            prisma.revenue.findMany({
                include: { recordedBy: { select: { name: true } } },
                orderBy: { date: 'desc' }
            }),
            prisma.expense.findMany({
                include: { recordedBy: { select: { name: true } } },
                orderBy: { date: 'desc' }
            }),
            prisma.donation.findMany({
                include: {
                    donor: { select: { name: true } },
                    recordedBy: { select: { name: true } }
                },
                orderBy: { date: 'desc' }
            })
        ])

        // Combine and format all transactions
        const allTransactions = [
            ...revenues.map(r => ({
                id: `revenue-${r.id}`,
                date: r.date,
                type: 'Revenue' as const,
                amount: Number(r.amount),
                category: r.category,
                source: r.source,
                paymentMethod: r.paymentMethod,
                transactionId: r.transactionId,
                recordedBy: r.recordedBy.name,
                description: r.description,
                receiptPath: r.receiptPath,
                receiptLink: r.receiptLink
            })),
            ...expenses.map(e => ({
                id: `expense-${e.id}`,
                date: e.date,
                type: 'Expense' as const,
                amount: Number(e.amount),
                category: e.category,
                source: e.vendor || 'N/A',
                paymentMethod: e.paymentMethod,
                transactionId: e.transactionId,
                recordedBy: e.recordedBy.name,
                description: e.description,
                receiptPath: e.receiptPath,
                receiptLink: e.receiptLink
            })),
            ...donations.map(d => ({
                id: `donation-${d.id}`,
                date: d.date,
                type: 'Donation' as const,
                amount: Number(d.amount),
                category: d.type,
                source: d.donor.name,
                paymentMethod: d.paymentMethod,
                transactionId: d.transactionId,
                recordedBy: d.recordedBy.name,
                description: d.purpose,
                receiptPath: d.receiptPath,
                receiptLink: d.receiptLink
            }))
        ]

        // Sort by date descending
        allTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

        return allTransactions
    } catch (error) {
        console.error('Get all transactions error:', error)
        return []
    }
}
