import { getReportData } from '@/app/actions/reports'
import { ReportsFilter, ExportButton } from './ReportsView'
import { Filter, Calendar, TrendingUp, TrendingDown, DollarSign } from 'lucide-react'

export default async function ReportsPage(props: { searchParams: Promise<{ year?: string, month?: string, type?: string }> }) {
    const searchParams = await props.searchParams
    const year = searchParams.year ? parseInt(searchParams.year) : new Date().getFullYear()
    const month = searchParams.month ? parseInt(searchParams.month) : undefined
    const type = (searchParams.type || 'All') as 'All' | 'Revenue' | 'Expense' | 'Donation'

    const data = await getReportData({ year, month, type })

    if (!data) return <div>Error loading report data</div>

    const { summary, breakdown, transactions } = data

    return (
        <div style={{ paddingBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>Financial Reports</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Analysis for {month !== undefined ? new Date(year, month).toLocaleString('default', { month: 'long' }) : 'Full Year'} {year}
                    </p>
                </div>
                {transactions && transactions.length > 0 && <ExportButton data={transactions} />}
            </div>

            <FiltersView selectedYear={year} selectedMonth={month} selectedType={type} />

            {/* Summary Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2.5rem'
            }}>
                <StatCard
                    title="Total Revenue"
                    amount={summary.totalRevenue}
                    icon={<TrendingUp size={24} color="var(--success-color)" />}
                    bg="rgba(16, 185, 129, 0.1)"
                    border="var(--success-color)"
                />
                <StatCard
                    title="Total Donations"
                    amount={summary.totalDonation}
                    icon={<Calendar size={24} color="rgb(139, 92, 246)" />}
                    bg="rgba(139, 92, 246, 0.1)"
                    border="rgb(139, 92, 246)"
                />
                <StatCard
                    title="Total Expense"
                    amount={summary.totalExpense}
                    icon={<TrendingDown size={24} color="var(--danger-color)" />}
                    bg="rgba(239, 68, 68, 0.1)"
                    border="var(--danger-color)"
                />
                <StatCard
                    title="Net Income"
                    amount={summary.netIncome}
                    icon={<DollarSign size={24} color="var(--primary-color)" />}
                    bg="rgba(59, 130, 246, 0.1)"
                    border="var(--primary-color)"
                />
            </div>

            {/* Breakdown & List */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', alignItems: 'start' }}>
                {/* Category Breakdown */}
                <div style={{
                    background: 'var(--card-bg)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.5rem',
                    boxShadow: 'var(--shadow-sm)'
                }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Category Breakdown</h3>
                    {breakdown.length === 0 ? (
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No data for this period.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {breakdown.slice(0, 10).map((item, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                                    <span style={{ color: 'var(--text-secondary)' }}>{item.name}</span>
                                    <span fontWeight="600">৳ {item.amount.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Transaction List */}
                <div style={{
                    background: 'var(--card-bg)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.5rem',
                    boxShadow: 'var(--shadow-sm)'
                }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Detailed Transactions</h3>
                    {transactions.length === 0 ? (
                        <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>No transactions found.</p>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                                        <th style={{ padding: '0.75rem 0.5rem', color: 'var(--text-secondary)' }}>Date</th>
                                        <th style={{ padding: '0.75rem 0.5rem', color: 'var(--text-secondary)' }}>Type</th>
                                        <th style={{ padding: '0.75rem 0.5rem', color: 'var(--text-secondary)' }}>Description</th>
                                        <th style={{ padding: '0.75rem 0.5rem', color: 'var(--text-secondary)', textAlign: 'right' }}>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map(t => (
                                        <tr key={t.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                            <td style={{ padding: '0.75rem 0.5rem' }}>{new Date(t.date).toLocaleDateString()}</td>
                                            <td style={{ padding: '0.75rem 0.5rem' }}>
                                                <span style={{
                                                    padding: '0.25rem 0.5rem',
                                                    borderRadius: '4px',
                                                    fontSize: '0.75rem',
                                                    background: t.type === 'Revenue' ? 'rgba(16, 185, 129, 0.1)' :
                                                        t.type === 'Expense' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(139, 92, 246, 0.1)',
                                                    color: t.type === 'Revenue' ? 'var(--success-color)' :
                                                        t.type === 'Expense' ? 'var(--danger-color)' : 'rgb(139, 92, 246)'
                                                }}>
                                                    {t.type}
                                                </span>
                                            </td>
                                            <td style={{ padding: '0.75rem 0.5rem' }}>
                                                <div style={{ fontWeight: '500' }}>{t.category}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{t.source}</div>
                                            </td>
                                            <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right', fontWeight: '600' }}>
                                                ৳ {t.amount.toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function StatCard({ title, amount, icon, bg, border }: any) {
    return (
        <div style={{
            background: 'var(--card-bg)',
            padding: '1.5rem',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-sm)',
            borderLeft: `4px solid ${border}`
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{title}</span>
                <div style={{ padding: '0.5rem', borderRadius: '50%', background: bg }}>{icon}</div>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>
                ৳ {amount.toLocaleString()}
            </div>
        </div>
    )
}

function FiltersView({ selectedYear, selectedMonth, selectedType }: any) {
    // Import from Client Component
    const { ReportsFilter } = require('./ReportsView')
    return <ReportsFilter currentYear={selectedYear} currentMonth={selectedMonth !== undefined ? selectedMonth.toString() : 'all'} currentType={selectedType} />
}
