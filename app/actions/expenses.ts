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

export async function createExpense(formData: FormData) {
    const user = await getUserFromCookie()

    // Only PRESIDENT and FINANCE_TEAM can create expenses
    if (user.role !== 'PRESIDENT' && user.role !== 'FINANCE_TEAM') {
        return { error: 'Unauthorized: Only Finance Team can add expenses' }
    }

    const data = {
        date: new Date(formData.get('date') as string),
        amount: parseFloat(formData.get('amount') as string),
        category: formData.get('category') as string,
        vendor: formData.get('vendor') as string || null,
        paymentMethod: formData.get('paymentMethod') as string,
        transactionId: formData.get('transactionId') as string || null,
        description: formData.get('description') as string || null,
        receiptPath: formData.get('receiptPath') as string || null,
        receiptLink: formData.get('receiptLink') as string || null,
        status: 'Pending',
        recordedById: user.userId,
    }

    try {
        const expense = await prisma.expense.create({ data })
        revalidatePath('/expenses')
        return { success: true, expense }
    } catch (error) {
        console.error('Create expense error:', error)
        return { error: 'Failed to create expense' }
    }
}

export async function getExpenses() {
    try {
        const expenses = await prisma.expense.findMany({
            include: {
                recordedBy: { select: { name: true } },
                approvedBy: { select: { name: true } }
            },
            orderBy: { date: 'desc' },
            take: 100
        })

        return expenses.map(e => ({
            ...e,
            amount: Number(e.amount)
        }))
    } catch (error) {
        console.error('Get expenses error:', error)
        return []
    }
}

export async function approveExpense(id: number) {
    const user = await getUserFromCookie()
    // Only PRESIDENT and FINANCE_TEAM can approve expenses
    if (user.role !== 'PRESIDENT' && user.role !== 'FINANCE_TEAM') {
        return { error: 'Unauthorized: Only Finance Team can approve expenses' }
    }

    try {
        const expense = await prisma.expense.findUnique({ where: { id } })
        if (!expense) return { error: 'Expense not found' }

        if (expense.status !== 'Pending') {
            return { error: 'Expense already processed' }
        }

        // Update expense status
        await prisma.expense.update({
            where: { id },
            data: {
                status: 'Approved',
                approvedById: user.userId
            }
        })

        // Update budget spent amount
        const currentYear = new Date().getFullYear()
        await prisma.budget.updateMany({
            where: {
                year: currentYear,
                category: expense.category
            },
            data: {
                spentAmount: { increment: expense.amount }
            }
        })

        revalidatePath('/expenses')
        revalidatePath('/dashboard')
        revalidatePath('/transactions')
        return { success: true }
    } catch (error) {
        console.error('Approve expense error:', error)
        return { error: 'Failed to approve expense' }
    }
}

export async function rejectExpense(id: number) {
    const user = await getUserFromCookie()
    // Only PRESIDENT and FINANCE_TEAM can reject expenses
    if (user.role !== 'PRESIDENT' && user.role !== 'FINANCE_TEAM') {
        return { error: 'Unauthorized: Only Finance Team can reject expenses' }
    }

    try {
        await prisma.expense.delete({ where: { id } })
        revalidatePath('/expenses')
        revalidatePath('/transactions')
        return { success: true }
    } catch (error) {
        console.error('Reject expense error:', error)
        return { error: 'Failed to reject expense' }
    }
}
