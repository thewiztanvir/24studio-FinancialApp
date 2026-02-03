import { prisma } from '@/lib/prisma'
import styles from './page.module.css'

// Force no caching
export const revalidate = 0
export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
    // Get real-time account balances
    const accounts = await prisma.account.findMany()
    const totalBalance = accounts.reduce((sum, acc) => sum + Number(acc.currentBalance), 0)

    // Get transaction counts
    const revenueCount = await prisma.revenue.count()
    const donationCount = await prisma.donation.count()
    const expenseCount = await prisma.expense.count()
    const donorCount = await prisma.donor.count()

    // Calculate totals
    const revenues = await prisma.revenue.findMany()
    const donations = await prisma.donation.findMany()
    const expenses = await prisma.expense.findMany({ where: { status: 'Approved' } })

    const totalRevenue = revenues.reduce((sum, r) => sum + Number(r.amount), 0)
    const totalDonations = donations.reduce((sum, d) => sum + Number(d.amount), 0)
    const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0)
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Dashboard</h1>
            <p className={styles.subtitle}>Welcome to 24Studio Finance Management</p>

            <div className={styles.grid}>
                <div className="card">
                    <h3>Total Revenue</h3>
                    <div className={styles.amount}>৳ {totalRevenue.toLocaleString('en-BD', { minimumFractionDigits: 2 })}</div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                        {revenueCount} entries
                    </p>
                </div>
                <div className="card">
                    <h3>Total Donations</h3>
                    <div className={styles.amount}>৳ {totalDonations.toLocaleString('en-BD', { minimumFractionDigits: 2 })}</div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                        {donationCount} donations from {donorCount} donors
                    </p>
                </div>
                <div className="card">
                    <h3>Total Expenses</h3>
                    <div className={styles.amount} style={{
                        background: 'var(--gradient-danger)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}>
                        ৳ {totalExpenses.toLocaleString('en-BD', { minimumFractionDigits: 2 })}
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                        {expenseCount} approved expenses
                    </p>
                </div>
                <div className="card" style={{ background: 'var(--gradient-primary)', color: 'white' }}>
                    <h3 style={{ color: 'rgba(255, 255, 255, 0.9)' }}>Total Balance</h3>
                    <div style={{ fontSize: '2.25rem', fontWeight: '800', marginTop: '0.75rem' }}>
                        ৳ {totalBalance.toLocaleString('en-BD', { minimumFractionDigits: 2 })}
                    </div>
                    <p style={{ fontSize: '0.875rem', opacity: 0.9, marginTop: '0.5rem' }}>
                        Across all accounts
                    </p>
                </div>
            </div>
        </div>
    )
}
