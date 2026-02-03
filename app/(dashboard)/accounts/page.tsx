import { getSession } from '@/app/actions/auth'
import { AccountsList } from './AccountsList'

export default async function AccountsPage() {
    const session = await getSession()

    let accounts = []
    let totalBalance = 0

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/accounts`, {
            cache: 'no-store',
        })
        const data = await res.json()
        accounts = data.accounts || []
        totalBalance = data.totalBalance || 0
    } catch (error) {
        console.error('Failed to fetch accounts:', error)
    }

    return (
        <div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: '800', marginBottom: '0.5rem' }}>Accounts</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', fontSize: '1rem' }}>
                All payment accounts and balances
            </p>
            <AccountsList accounts={accounts} totalBalance={totalBalance} userRole={session?.role} />
        </div>
    )
}
