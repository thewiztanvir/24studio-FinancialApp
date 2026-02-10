import { prisma } from '@/lib/prisma'
import styles from './page.module.css'
import { ReportsFilter } from '../reports/ReportsView'

// Force no caching
export const revalidate = 0
export const dynamic = 'force-dynamic'

export default async function DashboardPage(props: { searchParams: Promise<{ year?: string, month?: string }> }) {
    const searchParams = await props.searchParams
    const year = searchParams.year ? parseInt(searchParams.year) : new Date().getFullYear()
    const month = searchParams.month ? parseInt(searchParams.month) : undefined

    // Calculate date range
    let dateFilter: any = {}
    if (month !== undefined) {
        dateFilter = {
            gte: new Date(year, month, 1),
            lte: new Date(year, month + 1, 0, 23, 59, 59)
        }
    } else {
        dateFilter = {
            gte: new Date(year, 0, 1),
            lte: new Date(year, 11, 31, 23, 59, 59)
        }
    }

    const whereDate = Object.keys(dateFilter).length > 0 ? { date: dateFilter } : {}

    // Get aggregated data for better performance
    const [revenueStats, donationStats, expenseStats, donorCount] = await Promise.all([
        prisma.revenue.aggregate({
            where: whereDate,
            _sum: { amount: true },
            _count: true
        }),
        prisma.donation.aggregate({
            where: whereDate,
            _sum: { amount: true },
            _count: true
        }),
        prisma.expense.aggregate({
            where: {
                status: 'Approved',
                ...whereDate
            },
            _sum: { amount: true },
            _count: true
        }),
        prisma.donor.count()
    ])

    const totalRevenue = Number(revenueStats._sum.amount || 0)
    const totalDonations = Number(donationStats._sum.amount || 0)
    const totalExpenses = Number(expenseStats._sum.amount || 0)

    // Calculate logic balance: (Revenue + Donations) - Expenses
    const totalBalance = (totalRevenue + totalDonations) - totalExpenses

    return (
        <div className={styles.container}>
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{
                        fontSize: '2.5rem',
                        fontWeight: '800',
                        background: 'var(--gradient-primary)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '0.5rem'
                    }}>
                        Dashboard
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                        Financial Overview & Real-time Metrics
                    </p>
                </div>
            </div>

            <div style={{ marginBottom: '-1rem' }}>
                <ReportsFilter
                    currentYear={year}
                    currentMonth={month !== undefined ? month.toString() : 'all'}
                    baseUrl="/dashboard"
                    showTypeFilter={false}
                />
            </div>

            <div className={styles.grid}>
                {/* Total Balance Card - Highlighted */}
                <div className="card" style={{
                    background: 'var(--gradient-primary)',
                    color: 'white',
                    gridColumn: '1 / -1', // Span full width on mobile
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '2rem'
                }}>
                    <h3 style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                        Net Balance <span style={{ fontSize: '0.8em', opacity: 0.8 }}>({month !== undefined ? new Date(year, month).toLocaleString('default', { month: 'long' }) : 'Full Year'} {year})</span>
                    </h3>
                    <div style={{ fontSize: '3.5rem', fontWeight: '800', lineHeight: 1 }}>
                        ৳ {totalBalance.toLocaleString('en-BD', { minimumFractionDigits: 2 })}
                    </div>
                    <p style={{ fontSize: '1rem', opacity: 0.9, marginTop: '1rem', display: 'flex', gap: '2rem' }}>
                        <span>Income: ৳ {(totalRevenue + totalDonations).toLocaleString()}</span>
                        <span>Expenses: ৳ {totalExpenses.toLocaleString()}</span>
                    </p>
                </div>

                <div className="card">
                    <h3 style={{ color: 'var(--success-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        Revenue
                    </h3>
                    <div className={styles.amount}>৳ {totalRevenue.toLocaleString('en-BD', { minimumFractionDigits: 2 })}</div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                        {revenueStats._count} transactions
                    </p>
                </div>

                <div className="card">
                    <h3 style={{ color: 'rgb(139, 92, 246)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        Donations
                    </h3>
                    <div className={styles.amount}>৳ {totalDonations.toLocaleString('en-BD', { minimumFractionDigits: 2 })}</div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                        {donationStats._count} donations
                    </p>
                </div>

                <div className="card">
                    <h3 style={{ color: 'var(--danger-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        Expenses
                    </h3>
                    <div className={styles.amount} style={{ color: 'var(--danger-color)' }}>
                        ৳ {totalExpenses.toLocaleString('en-BD', { minimumFractionDigits: 2 })}
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                        {expenseStats._count} approved expenses
                    </p>
                </div>
            </div>
        </div>
    )
}
