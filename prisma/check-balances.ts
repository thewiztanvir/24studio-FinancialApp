import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkBalances() {
    console.log('📊 Checking current database state...\n')

    const accounts = await prisma.account.findMany()
    console.log('💼 Accounts:')
    accounts.forEach(acc => {
        console.log(`  - ${acc.name}: ৳ ${acc.currentBalance}`)
    })

    const totalBalance = accounts.reduce((sum, acc) => sum + Number(acc.currentBalance), 0)
    console.log(`\n💰 Total Balance: ৳ ${totalBalance}\n`)

    const revenueCount = await prisma.revenue.count()
    const donationCount = await prisma.donation.count()
    const expenseCount = await prisma.expense.count()

    console.log('📈 Transaction Counts:')
    console.log(`  - Revenue entries: ${revenueCount}`)
    console.log(`  - Donation entries: ${donationCount}`)
    console.log(`  - Expense entries: ${expenseCount}`)

    await prisma.$disconnect()
}

checkBalances()
