'use server'

import { prisma } from '@/lib/prisma'

export type ReportFilter = {
    year: number
    month?: number // 0-11
    type?: 'All' | 'Revenue' | 'Expense' | 'Donation'
}

export async function getReportData(filter: ReportFilter) {
    try {
        const { year, month, type } = filter

        const startDate = new Date(year, month !== undefined ? month : 0, 1)
        const endDate = new Date(year, month !== undefined ? month + 1 : 12, 0, 23, 59, 59, 999)

        const whereDate = {
            gte: startDate,
            lte: endDate
        }

        // Fetch Data based on type
        let revenues: any[] = []
        let expenses: any[] = []
        let donations: any[] = []

        if (type === 'All' || type === 'Revenue') {
            revenues = await prisma.revenue.findMany({
                where: { date: whereDate },
                include: { recordedBy: { select: { name: true } } },
                orderBy: { date: 'desc' }
            })
        }

        if (type === 'All' || type === 'Expense') {
            expenses = await prisma.expense.findMany({
                where: { date: whereDate },
                include: { recordedBy: { select: { name: true } } },
                orderBy: { date: 'desc' }
            })
        }

        if (type === 'All' || type === 'Donation') {
            donations = await prisma.donation.findMany({
                where: { date: whereDate },
                include: {
                    donor: { select: { name: true } },
                    recordedBy: { select: { name: true } }
                },
                orderBy: { date: 'desc' }
            })
        }

        // Combine for list
        const allTransactions = [
            ...revenues.map(r => ({
                id: `REV-${r.id}`,
                date: r.date,
                type: 'Revenue',
                category: r.category,
                source: r.source,
                amount: Number(r.amount),
                recordedBy: r.recordedBy.name,
                receiptPath: r.receiptPath,
                receiptLink: r.receiptLink
            })),
            ...expenses.map(e => ({
                id: `EXP-${e.id}`,
                date: e.date,
                type: 'Expense',
                category: e.category,
                source: e.vendor || '-',
                amount: Number(e.amount),
                recordedBy: e.recordedBy.name,
                receiptPath: e.receiptPath,
                receiptLink: e.receiptLink
            })),
            ...donations.map(d => ({
                id: `DON-${d.id}`,
                date: d.date,
                type: 'Donation',
                category: d.type,
                source: d.donor.name,
                amount: Number(d.amount),
                recordedBy: d.recordedBy.name,
                receiptPath: d.receiptPath,
                receiptLink: d.receiptLink
            }))
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

        // Calculate Totals per Category
        const categoryTotals: Record<string, number> = {}
        allTransactions.forEach(t => {
            const key = `${t.type}: ${t.category}`
            categoryTotals[key] = (categoryTotals[key] || 0) + t.amount
        })

        // Summary Stats
        const totalRevenue = revenues.reduce((sum, r) => sum + Number(r.amount), 0)
        const totalExpense = expenses.reduce((sum, e) => sum + Number(e.amount), 0)
        const totalDonation = donations.reduce((sum, d) => sum + Number(d.amount), 0)

        // Convert totals to array for chart/list
        const breakdown = Object.entries(categoryTotals)
            .map(([name, amount]) => ({ name, amount }))
            .sort((a, b) => b.amount - a.amount)

        return {
            summary: {
                totalRevenue,
                totalExpense,
                totalDonation,
                netIncome: totalRevenue + totalDonation - totalExpense
            },
            breakdown,
            transactions: allTransactions
        }

    } catch (error) {
        console.error('Get report data error:', error)
        return null
    }
}
