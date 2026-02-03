import { getRevenues } from '@/app/actions/revenue'
import { RevenueList } from './RevenueList'

export default async function RevenuePage() {
    const revenues = await getRevenues()

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>Revenue Management</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Track all incoming revenue and payments</p>
            </div>

            <RevenueList initialRevenues={revenues} />
        </div>
    )
}
