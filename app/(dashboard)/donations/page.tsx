import { getDonations } from '@/app/actions/donors'
import { DonationsList } from './DonationsList'

import { prisma } from '@/lib/prisma'
import { TrendingUp, Calendar, Clock } from 'lucide-react'

export default async function DonationsPage() {
    const donations = await getDonations()

    // Calculate stats
    const now = new Date()
    const startOfYear = new Date(now.getFullYear(), 0, 1)
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const [totalStat, yearlyStat, monthlyStat] = await Promise.all([
        prisma.donation.aggregate({ _sum: { amount: true } }),
        prisma.donation.aggregate({ where: { date: { gte: startOfYear } }, _sum: { amount: true } }),
        prisma.donation.aggregate({ where: { date: { gte: startOfMonth } }, _sum: { amount: true } })
    ])

    const total = Number(totalStat._sum.amount || 0)
    const yearly = Number(yearlyStat._sum.amount || 0)
    const monthly = Number(monthlyStat._sum.amount || 0)

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>Donations</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Track and manage all donations</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div className="card">
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                        <div style={{
                            padding: '0.75rem',
                            background: 'rgba(139, 92, 246, 0.1)',
                            borderRadius: 'var(--radius-md)',
                            color: 'rgb(139, 92, 246)'
                        }}>
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <p style={{ margin: '0 0 0.25rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Total Donations</p>
                            <h3 style={{ margin: 0, fontSize: '1.5rem' }}>৳ {total.toLocaleString()}</h3>
                            <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Lifetime</p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                        <div style={{
                            padding: '0.75rem',
                            background: 'rgba(16, 185, 129, 0.1)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--success-color)'
                        }}>
                            <Calendar size={24} />
                        </div>
                        <div>
                            <p style={{ margin: '0 0 0.25rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>This Year</p>
                            <h3 style={{ margin: 0, fontSize: '1.5rem' }}>৳ {yearly.toLocaleString()}</h3>
                            <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                Jan - Dec {now.getFullYear()}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                        <div style={{
                            padding: '0.75rem',
                            background: 'rgba(59, 130, 246, 0.1)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--primary-color)'
                        }}>
                            <Clock size={24} />
                        </div>
                        <div>
                            <p style={{ margin: '0 0 0.25rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>This Month</p>
                            <h3 style={{ margin: 0, fontSize: '1.5rem' }}>৳ {monthly.toLocaleString()}</h3>
                            <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                {now.toLocaleString('default', { month: 'long' })}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <DonationsList initialDonations={donations} />
        </div>
    )
}
