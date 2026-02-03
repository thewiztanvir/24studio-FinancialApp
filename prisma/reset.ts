import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function resetDatabase() {
    console.log('🔄 Starting database reset...')

    try {
        // Delete all transactions in correct order (foreign key constraints)
        await prisma.budget.deleteMany({})
        console.log('✓ Deleted all budgets')

        await prisma.expense.deleteMany({})
        console.log('✓ Deleted all expenses')

        await prisma.donation.deleteMany({})
        console.log('✓ Deleted all donations')

        await prisma.revenue.deleteMany({})
        console.log('✓ Deleted all revenue')

        await prisma.donor.deleteMany({})
        console.log('✓ Deleted all donors')

        // Reset all account balances to 0
        await prisma.account.updateMany({
            data: { currentBalance: 0 }
        })
        console.log('✓ Reset all account balances to ৳ 0')

        console.log('✅ Database reset complete! All balances are now ৳ 0')
    } catch (error) {
        console.error('❌ Reset failed:', error)
    } finally {
        await prisma.$disconnect()
    }
}

resetDatabase()
