import { PrismaClient } from '@prisma/client'
import { createHash } from 'crypto'

const prisma = new PrismaClient()

function hash(password: string) {
    return createHash('sha256').update(password).digest('hex')
}

async function main() {
    // Create users with new role structure
    const president = await prisma.user.upsert({
        where: { email: 'president@24studio.org' },
        update: {},
        create: {
            name: 'President',
            email: 'president@24studio.org',
            password: hash('president123'),
            role: 'PRESIDENT',
        },
    })

    const revenue = await prisma.user.upsert({
        where: { email: 'revenue@24studio.org' },
        update: { role: 'REVENUE_TEAM' },
        create: {
            name: 'Revenue Team',
            email: 'revenue@24studio.org',
            password: hash('revenue123'),
            role: 'REVENUE_TEAM',
        },
    })

    const finance = await prisma.user.upsert({
        where: { email: 'finance@24studio.org' },
        update: {},
        create: {
            name: 'Finance Team',
            email: 'finance@24studio.org',
            password: hash('finance123'),
            role: 'FINANCE_TEAM',
        },
    })

    // Update old admin user to president if exists
    await prisma.user.updateMany({
        where: { email: 'admin@24studio.org' },
        data: { role: 'PRESIDENT' }
    })

    console.log('Users created:', { president, revenue, finance })

    // Create accounts with 0 balance
    const bank = await prisma.account.upsert({
        where: { id: 1 },
        update: { currentBalance: 0 },
        create: {
            name: 'Islami Bank Main',
            type: 'Bank',
            currentBalance: 0,
        },
    })

    const bkash = await prisma.account.upsert({
        where: { id: 2 },
        update: { currentBalance: 0 },
        create: {
            name: 'bKash Operations',
            type: 'Mobile Banking',
            currentBalance: 0,
        },
    })

    const cash = await prisma.account.upsert({
        where: { id: 3 },
        update: { currentBalance: 0 },
        create: {
            name: 'Cash on Hand',
            type: 'Cash',
            currentBalance: 0,
        },
    })

    console.log('Accounts created:', { bank, bkash, cash })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
