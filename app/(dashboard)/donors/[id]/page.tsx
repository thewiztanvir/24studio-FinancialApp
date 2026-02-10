import { getDonorProfile } from '@/app/actions/donors'
import { Table } from '@/components/ui/Table'
import { format } from 'date-fns'
import Link from 'next/link'
import { ArrowLeft, User, Calendar, CreditCard, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react'

export default async function DonorProfilePage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const donorId = parseInt(params.id)
    const data = await getDonorProfile(donorId)

    if (!data) {
        return (
            <div>
                <Link href="/donors" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', color: 'var(--text-secondary)' }}>
                    <ArrowLeft size={20} /> Back to Donors
                </Link>
                <div style={{ textAlign: 'center', padding: '4rem' }}>
                    <h2>Donor not found</h2>
                </div>
            </div>
        )
    }

    const { donor, stats, history } = data

    // Calculate internal donor status
    const isInternal = donor.status === 'Internal'
    const required = donor.yearlyContributionRequired || 0
    const paid = stats.yearlyDonated
    const remaining = Math.max(0, required - paid)
    const progress = required > 0 ? Math.min(100, (paid / required) * 100) : 0

    const columns = [
        { key: 'date', label: 'Date', render: (val: any) => format(new Date(val), 'dd/MM/yyyy') },
        {
            key: 'type',
            label: 'Type', // Usually Donation, but could be specific type
            render: (val: string) => (
                <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    background: 'rgba(139, 92, 246, 0.1)',
                    color: 'rgb(139, 92, 246)'
                }}>
                    {val}
                </span>
            )
        },
        {
            key: 'amount',
            label: 'Amount',
            render: (val: number) => <strong style={{ color: 'var(--success-color)' }}>+৳ {val.toLocaleString()}</strong>
        },
        { key: 'paymentMethod', label: 'Method' },
        { key: 'transactionId', label: 'Transaction ID', render: (id: string) => id || '—' },
        { key: 'purpose', label: 'Purpose', render: (val: string) => val || '—' }
    ]

    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
                <Link href="/donors" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>
                    <ArrowLeft size={16} /> Back to Donors
                </Link>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            {donor.name}
                            <span style={{
                                fontSize: '0.875rem',
                                padding: '0.25rem 0.75rem',
                                borderRadius: '999px',
                                background: isInternal ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                                color: isInternal ? 'var(--success-color)' : 'var(--primary-color)',
                                fontWeight: '600'
                            }}>
                                {donor.status}
                            </span>
                        </h1>
                        <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                            {donor.email && <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><User size={14} /> {donor.email}</div>}
                            {donor.phone && <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CreditCard size={14} /> {donor.phone}</div>}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={14} /> Joined {format(new Date(donor.createdAt), 'MMMM yyyy')}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="card" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: 'white' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div>
                            <p style={{ margin: 0, opacity: 0.9, fontSize: '0.875rem' }}>Lifetime Donations</p>
                            <h3 style={{ margin: '0.25rem 0 0', fontSize: '1.75rem' }}>৳ {stats.lifetimeDonated.toLocaleString()}</h3>
                        </div>
                        <TrendingUp size={24} style={{ opacity: 0.8 }} />
                    </div>
                    <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                        Last donation: {stats.lastDonationDate ? format(new Date(stats.lastDonationDate), 'MMM d, yyyy') : 'Never'}
                    </div>
                </div>

                <div className="card">
                    <p style={{ margin: '0 0 0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>This Year</p>
                    <h3 style={{ margin: 0, fontSize: '1.75rem', color: 'var(--text-primary)' }}>৳ {stats.yearlyDonated.toLocaleString()}</h3>
                    <p style={{ margin: '0.5rem 0 0', fontSize: '0.875rem', color: 'var(--success-color)' }}>
                        Jan - Dec {new Date().getFullYear()}
                    </p>
                </div>

                <div className="card">
                    <p style={{ margin: '0 0 0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>This Month</p>
                    <h3 style={{ margin: 0, fontSize: '1.75rem', color: 'var(--text-primary)' }}>৳ {stats.monthlyDonated.toLocaleString()}</h3>
                    <p style={{ margin: '0.5rem 0 0', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        {format(new Date(), 'MMMM yyyy')}
                    </p>
                </div>
            </div>

            {/* Internal Donor Contribution Status */}
            {isInternal && (
                <div className="card" style={{ marginBottom: '2rem', borderLeft: remaining > 0 ? '4px solid var(--warning-color)' : '4px solid var(--success-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 style={{ margin: 0, fontSize: '1.125rem' }}>Yearly Contribution Status</h3>
                        {remaining === 0 ? (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success-color)', fontWeight: '600' }}>
                                <CheckCircle size={18} /> Contribution Met
                            </span>
                        ) : (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--warning-color)', fontWeight: '600' }}>
                                <AlertCircle size={18} /> Payment Pending
                            </span>
                        )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', alignItems: 'center' }}>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Goal Progress</span>
                                <span style={{ fontWeight: '600' }}>{Math.round(progress)}%</span>
                            </div>
                            <div style={{ height: '8px', background: '#f3f4f6', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{
                                    height: '100%',
                                    width: `${progress}%`,
                                    background: progress >= 100 ? 'var(--success-color)' : 'var(--primary-color)',
                                    transition: 'width 0.5s ease'
                                }} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '2rem' }}>
                            <div>
                                <p style={{ margin: '0 0 0.25rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>REQUIRED</p>
                                <p style={{ margin: 0, fontWeight: '700', fontSize: '1.125rem' }}>৳ {required.toLocaleString()}</p>
                            </div>
                            <div>
                                <p style={{ margin: '0 0 0.25rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>PAID</p>
                                <p style={{ margin: 0, fontWeight: '700', fontSize: '1.125rem', color: 'var(--success-color)' }}>৳ {paid.toLocaleString()}</p>
                            </div>
                            <div>
                                <p style={{ margin: '0 0 0.25rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>REMAINING</p>
                                <p style={{ margin: 0, fontWeight: '700', fontSize: '1.125rem', color: remaining > 0 ? 'var(--danger-color)' : 'var(--text-secondary)' }}>
                                    ৳ {remaining.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Transaction History */}
            <div className="card">
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.125rem' }}>Donation History</h3>
                <Table columns={columns} data={history} emptyMessage="No donations found for this donor." />
            </div>
        </div>
    )
}
