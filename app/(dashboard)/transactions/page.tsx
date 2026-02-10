import { getAllTransactions } from '@/app/actions/transactions'
import { TransactionsList } from './TransactionsList'

export default async function TransactionsPage() {
    const transactions = await getAllTransactions()

    return (
        <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>Transaction History</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                View all financial transactions in one place
            </p>

            <TransactionsList initialTransactions={transactions} />
        </div>
    )
}
