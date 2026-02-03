import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const budget = await prisma.budget.create({
            data: {
                year: body.year,
                category: body.category,
                allocatedAmount: body.allocatedAmount,
            }
        })
        return NextResponse.json(budget)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create budget' }, { status: 500 })
    }
}
